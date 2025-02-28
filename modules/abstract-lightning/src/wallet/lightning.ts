import * as sdkcore from '@bitgo/sdk-core';
import {
  PendingApprovalData,
  PendingApprovals,
  RequestTracer,
  RequestType,
  TxRequest,
  commonTssMethods,
  TxRequestState,
} from '@bitgo/sdk-core';
import * as t from 'io-ts';
import { createMessageSignature, deriveLightningServiceSharedSecret, unwrapLightningCoinSpecific } from '../lightning';
import {
  BackupResponse,
  CreateInvoiceBody,
  Invoice,
  InvoiceInfo,
  InvoiceQuery,
  LightningAuthKeychain,
  LightningKeychain,
  LndCreatePaymentResponse,
  SubmitPaymentParams,
  UpdateLightningWalletClientRequest,
  UpdateLightningWalletEncryptedRequest,
} from '../codecs';
import { LightningPaymentIntent, LightningPaymentRequest } from '@bitgo/public-types';

export type PayInvoiceResponse = {
  txRequestId: string;
  txRequestState: TxRequestState;
  pendingApproval?: PendingApprovalData;
  // Absent if there's a pending approval
  paymentStatus?: LndCreatePaymentResponse;
};

export interface ILightningWallet {
  /**
   * Creates a lightning invoice
   * @param {object} params Invoice parameters
   * @param {bigint} params.valueMsat The value of the invoice in millisatoshis
   * @param {string} [params.memo] A memo or description for the invoice
   * @param {number} [params.expiry] The expiry time of the invoice in seconds
   * @returns {Promise<Invoice>} A promise that resolves to the created invoice
   */
  createInvoice(params: CreateInvoiceBody): Promise<Invoice>;

  /**
   * Lists current lightning invoices
   * @param {object} params Invoice query parameters
   * @param {string} [params.status] The status of the invoice
   *  - open: The invoice is open and awaiting payment
   *  - settled: The invoice has been paid
   *  - canceled: The invoice has been canceled
   * @param {string} [params.limit] The maximum number of invoices to return
   * @param {Date} [params.startDate] The start date for the query
   * @param {Date} [params.endDate] The end date for the query
   */
  listInvoices(params: InvoiceQuery): Promise<InvoiceInfo[]>;

  /**
   * Pay a lightning invoice
   * @param {SubmitPaymentParams} params - Payment parameters
   * @param {string} params.invoice - The invoice to pay
   * @param {string} params.amountMsat - The amount to pay in millisatoshis
   * @param {string} params.passphrase - The wallet passphrase
   * @param {string} [params.sequenceId] - Optional sequence ID for the respective payment transfer
   * @param {string} [params.comment] - Optional comment for the respective payment transfer
   * @returns {Promise<PayInvoiceResponse>} Payment result containing transaction request details and payment status
   */
  payInvoice(params: SubmitPaymentParams): Promise<PayInvoiceResponse>;

  /**
   * Get the lightning keychain for the given wallet.
   */
  getLightningKeychain(): Promise<LightningKeychain>;

  /**
   * Get the lightning auth keychains for the given wallet.
   */
  getLightningAuthKeychains(): Promise<{ userAuthKey: LightningAuthKeychain; nodeAuthKey: LightningAuthKeychain }>;

  /**
   * Updates the coin-specific configuration for a Lightning Wallet.
   *
   * @param {UpdateLightningWalletClientRequest} params - The parameters containing the updated wallet-specific details.
   *   - `encryptedSignerMacaroon` (optional): This macaroon is used by the watch-only node to ask the signer node to sign transactions.
   *     Encrypted with ECDH secret key from private key of wallet's user auth key and public key of lightning service.
   *   - `encryptedSignerAdminMacaroon` (optional): Generated when initializing the wallet of the signer node.
   *     Encrypted with client's wallet passphrase.
   *   - `signerHost` (optional): The host address of the Lightning signer node.
   *   - `encryptedSignerTlsKey` (optional): The wallet passphrase encrypted TLS key of the signer.
   *   - `passphrase` (required): The wallet passphrase.
   *   - `signerTlsCert` (optional): The TLS certificate of the signer.
   *   - `watchOnlyAccounts` (optional): These are the accounts used to initialize the watch-only wallet.
   * @returns {Promise<unknown>} A promise resolving to the updated wallet response or throwing an error if the update fails.
   */
  updateWalletCoinSpecific(params: UpdateLightningWalletClientRequest): Promise<unknown>;

  /**
   * Get the channel backup for the given wallet.
   * @returns {Promise<BackupResponse>} A promise resolving to the channel backup
   */
  getChannelBackup(): Promise<BackupResponse>;
}

export class SelfCustodialLightningWallet implements ILightningWallet {
  public wallet: sdkcore.IWallet;

  constructor(wallet: sdkcore.IWallet) {
    const coin = wallet.baseCoin;
    if (coin.getFamily() !== 'lnbtc') {
      throw new Error(`Invalid coin to update lightning wallet: ${coin.getFamily()}`);
    }
    this.wallet = wallet;
  }

  async createInvoice(params: CreateInvoiceBody): Promise<Invoice> {
    const createInvoiceResponse = await this.wallet.bitgo
      .post(this.wallet.baseCoin.url(`/wallet/${this.wallet.id()}/lightning/invoice`))
      .send(t.exact(CreateInvoiceBody).encode(params))
      .result();
    return sdkcore.decodeOrElse(Invoice.name, Invoice, createInvoiceResponse, (error) => {
      // DON'T throw errors from decodeOrElse. It could leak sensitive information.
      throw new Error(`Invalid create invoice response ${error}`);
    });
  }

  async payInvoice(params: SubmitPaymentParams): Promise<PayInvoiceResponse> {
    const reqId = new RequestTracer();
    this.wallet.bitgo.setRequestTracer(reqId);

    const { userAuthKey } = await this.getLightningAuthKeychains();
    const signature = createMessageSignature(
      t.exact(LightningPaymentRequest).encode(params),
      this.wallet.bitgo.decrypt({ password: params.passphrase, input: userAuthKey.encryptedPrv })
    );

    const paymentIntent: LightningPaymentIntent = {
      comment: params.comment,
      sequenceId: params.sequenceId,
      intentType: 'payment',
      signedRequest: {
        invoice: params.invoice,
        amountMsat: params.amountMsat,
        feeLimitMsat: params.feeLimitMsat,
        feeLimitRatio: params.feeLimitRatio,
      },
      signature,
    };

    const transactionRequestCreate = (await this.wallet.bitgo
      .post(this.wallet.bitgo.url('/wallet/' + this.wallet.id() + '/txrequests', 2))
      .send(LightningPaymentIntent.encode(paymentIntent))
      .result()) as TxRequest;

    if (transactionRequestCreate.state === 'pendingApproval') {
      const pendingApprovals = new PendingApprovals(this.wallet.bitgo, this.wallet.baseCoin);
      const pendingApproval = await pendingApprovals.get({ id: transactionRequestCreate.pendingApprovalId });
      return {
        pendingApproval: pendingApproval.toJSON(),
        txRequestId: transactionRequestCreate.txRequestId,
        txRequestState: transactionRequestCreate.state,
      };
    }

    const transactionRequestSend = await commonTssMethods.sendTxRequest(
      this.wallet.bitgo,
      this.wallet.id(),
      transactionRequestCreate.txRequestId,
      RequestType.tx,
      reqId
    );

    const coinSpecific = transactionRequestSend.transactions?.[0]?.unsignedTx?.coinSpecific;

    return {
      txRequestId: transactionRequestCreate.txRequestId,
      txRequestState: transactionRequestSend.state,
      paymentStatus: coinSpecific
        ? t.exact(LndCreatePaymentResponse).encode(coinSpecific as LndCreatePaymentResponse)
        : undefined,
    };
  }

  async listInvoices(params: InvoiceQuery): Promise<InvoiceInfo[]> {
    const returnCodec = t.array(InvoiceInfo);
    const createInvoiceResponse = await this.wallet.bitgo
      .get(this.wallet.baseCoin.url(`/wallet/${this.wallet.id()}/lightning/invoice`))
      .query(InvoiceQuery.encode(params))
      .result();
    return sdkcore.decodeOrElse(returnCodec.name, returnCodec, createInvoiceResponse, (error) => {
      throw new Error(`Invalid list invoices response ${error}`);
    });
  }

  async getLightningKeychain(): Promise<LightningKeychain> {
    const keyIds = this.wallet.keyIds();
    if (keyIds.length !== 1) {
      throw new Error(`Invalid number of key in lightning wallet: ${keyIds.length}`);
    }
    const keychain = await this.wallet.baseCoin.keychains().get({ id: keyIds[0] });
    return sdkcore.decodeOrElse(LightningKeychain.name, LightningKeychain, keychain, (_) => {
      throw new Error(`Invalid user key`);
    });
  }

  async getLightningAuthKeychains(): Promise<{
    userAuthKey: LightningAuthKeychain;
    nodeAuthKey: LightningAuthKeychain;
  }> {
    const authKeyIds = this.wallet.coinSpecific()?.keys;
    if (authKeyIds?.length !== 2) {
      throw new Error(`Invalid number of auth keys in lightning wallet: ${authKeyIds?.length}`);
    }
    const coin = this.wallet.baseCoin;
    const keychains = await Promise.all(authKeyIds.map((id) => coin.keychains().get({ id })));
    const authKeychains = keychains.map((keychain) => {
      return sdkcore.decodeOrElse(LightningAuthKeychain.name, LightningAuthKeychain, keychain, (_) => {
        // DON'T throw errors from decodeOrElse. It could leak sensitive information.
        throw new Error(`Invalid lightning auth key: ${keychain?.id}`);
      });
    });
    const [userAuthKey, nodeAuthKey] = (['userAuth', 'nodeAuth'] as const).map((purpose) => {
      const keychain = authKeychains.find(
        (k) => unwrapLightningCoinSpecific(k.coinSpecific, coin.getChain()).purpose === purpose
      );
      if (!keychain) {
        throw new Error(`Missing ${purpose} key`);
      }
      return keychain;
    });

    return { userAuthKey, nodeAuthKey };
  }

  private encryptWalletUpdateRequest(
    params: UpdateLightningWalletClientRequest,
    userAuthKey: LightningAuthKeychain
  ): UpdateLightningWalletEncryptedRequest {
    const coinName = this.wallet.coin() as 'tlnbtc' | 'lnbtc';

    const requestWithEncryption: Partial<UpdateLightningWalletClientRequest & UpdateLightningWalletEncryptedRequest> = {
      ...params,
    };

    const userAuthXprv = this.wallet.bitgo.decrypt({
      password: params.passphrase,
      input: userAuthKey.encryptedPrv,
    });

    if (params.signerTlsKey) {
      requestWithEncryption.encryptedSignerTlsKey = this.wallet.bitgo.encrypt({
        password: params.passphrase,
        input: params.signerTlsKey,
      });
    }

    if (params.signerAdminMacaroon) {
      requestWithEncryption.encryptedSignerAdminMacaroon = this.wallet.bitgo.encrypt({
        password: params.passphrase,
        input: params.signerAdminMacaroon,
      });
    }

    if (params.signerMacaroon) {
      requestWithEncryption.encryptedSignerMacaroon = this.wallet.bitgo.encrypt({
        password: deriveLightningServiceSharedSecret(coinName, userAuthXprv).toString('hex'),
        input: params.signerMacaroon,
      });
    }

    return t.exact(UpdateLightningWalletEncryptedRequest).encode(requestWithEncryption);
  }

  async updateWalletCoinSpecific(params: UpdateLightningWalletClientRequest): Promise<unknown> {
    sdkcore.decodeOrElse(
      UpdateLightningWalletClientRequest.name,
      UpdateLightningWalletClientRequest,
      params,
      (errors) => {
        // DON'T throw errors from decodeOrElse. It could leak sensitive information.
        throw new Error(`Invalid params for lightning specific update wallet`);
      }
    );

    const { userAuthKey } = await this.getLightningAuthKeychains();
    const updateRequestWithEncryption = this.encryptWalletUpdateRequest(params, userAuthKey);
    const signature = createMessageSignature(
      updateRequestWithEncryption,
      this.wallet.bitgo.decrypt({ password: params.passphrase, input: userAuthKey.encryptedPrv })
    );
    const coinSpecific = {
      [this.wallet.coin()]: {
        signedRequest: updateRequestWithEncryption,
        signature,
      },
    };
    return await this.wallet.bitgo.put(this.wallet.url()).send({ coinSpecific }).result();
  }

  async getChannelBackup(): Promise<BackupResponse> {
    const backupResponse = await this.wallet.bitgo
      .get(this.wallet.baseCoin.url(`/wallet/${this.wallet.id()}/lightning/backup`))
      .result();
    return sdkcore.decodeOrElse(BackupResponse.name, BackupResponse, backupResponse, (error) => {
      throw new Error(`Invalid backup response: ${error}`);
    });
  }
}
