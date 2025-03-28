import {
  BaseCoin,
  BitGoBase,
  EDDSAMethods,
  InvalidAddressError,
  KeyPair,
  MPCAlgorithm,
  MultisigType,
  multisigTypes,
  ParsedTransaction,
  ParseTransactionOptions,
  SignedTransaction,
  SignTransactionOptions,
  TransactionExplanation,
  TssVerifyAddressOptions,
  VerifyTransactionOptions,
} from '@bitgo/sdk-core';
import { BaseCoin as StaticsBaseCoin, coins } from '@bitgo/statics';
import { KeyPair as TonKeyPair } from './lib/keyPair';
import BigNumber from 'bignumber.js';
import * as _ from 'lodash';
import { Transaction, TransactionBuilderFactory, Utils } from './lib';
import TonWeb from 'tonweb';

export interface TonParseTransactionOptions extends ParseTransactionOptions {
  txHex: string;
  fromAddressBounceable?: boolean;
  toAddressBounceable?: boolean;
}

export class Ton extends BaseCoin {
  protected readonly _staticsCoin: Readonly<StaticsBaseCoin>;
  protected constructor(bitgo: BitGoBase, staticsCoin?: Readonly<StaticsBaseCoin>) {
    super(bitgo);

    if (!staticsCoin) {
      throw new Error('missing required constructor parameter staticsCoin');
    }

    this._staticsCoin = staticsCoin;
  }

  static createInstance(bitgo: BitGoBase, staticsCoin?: Readonly<StaticsBaseCoin>): BaseCoin {
    return new Ton(bitgo, staticsCoin);
  }

  /**
   * Factor between the coin's base unit and its smallest subdivison
   */
  public getBaseFactor(): number {
    return 1e9;
  }

  public getChain(): string {
    return 'ton';
  }

  public getFamily(): string {
    return 'ton';
  }

  public getFullName(): string {
    return 'Ton';
  }

  /** @inheritDoc */
  supportsTss(): boolean {
    return true;
  }

  /** inherited doc */
  getDefaultMultisigType(): MultisigType {
    return multisigTypes.tss;
  }

  getMPCAlgorithm(): MPCAlgorithm {
    return 'eddsa';
  }

  allowsAccountConsolidations(): boolean {
    return true;
  }

  async verifyTransaction(params: VerifyTransactionOptions): Promise<boolean> {
    const coinConfig = coins.get(this.getChain());
    const { txPrebuild: txPrebuild, txParams: txParams } = params;
    const transaction = new Transaction(coinConfig);
    const rawTx = txPrebuild.txHex;
    if (!rawTx) {
      throw new Error('missing required tx prebuild property txHex');
    }

    transaction.fromRawTransaction(Buffer.from(rawTx, 'hex').toString('base64'));
    const explainedTx = transaction.explainTransaction();
    if (txParams.recipients !== undefined) {
      const filteredRecipients = txParams.recipients?.map((recipient) => {
        return {
          address: new TonWeb.Address(recipient.address).toString(true, true, true),
          amount: BigInt(recipient.amount),
        };
      });
      const filteredOutputs = explainedTx.outputs.map((output) => {
        return {
          address: new TonWeb.Address(output.address).toString(true, true, true),
          amount: BigInt(output.amount),
        };
      });
      if (!_.isEqual(filteredOutputs, filteredRecipients)) {
        throw new Error('Tx outputs does not match with expected txParams recipients');
      }
      let totalAmount = new BigNumber(0);
      for (const recipients of txParams.recipients) {
        totalAmount = totalAmount.plus(recipients.amount);
      }
      if (!totalAmount.isEqualTo(explainedTx.outputAmount)) {
        throw new Error('Tx total amount does not match with expected total amount field');
      }
    }
    return true;
  }

  async isWalletAddress(params: TssVerifyAddressOptions): Promise<boolean> {
    const { keychains, address: newAddress, index } = params;

    if (!this.isValidAddress(newAddress)) {
      throw new InvalidAddressError(`invalid address: ${newAddress}`);
    }

    if (!keychains) {
      throw new Error('missing required param keychains');
    }

    for (const keychain of keychains) {
      const [address, memoId] = newAddress.split('?memoId=');
      const MPC = await EDDSAMethods.getInitializedMpcInstance();
      const commonKeychain = keychain.commonKeychain as string;

      const derivationPath = 'm/' + index;
      const derivedPublicKey = MPC.deriveUnhardened(commonKeychain, derivationPath).slice(0, 64);
      const expectedAddress = await Utils.default.getAddressFromPublicKey(derivedPublicKey);

      if (memoId) {
        return memoId === `${index}`;
      }

      if (address !== expectedAddress) {
        return false;
      }
    }

    return true;
  }

  async parseTransaction(params: TonParseTransactionOptions): Promise<ParsedTransaction> {
    const factory = new TransactionBuilderFactory(coins.get(this.getChain()));
    const transactionBuilder = factory.from(Buffer.from(params.txHex, 'hex').toString('base64'));

    if (typeof params.toAddressBounceable === 'boolean') {
      transactionBuilder.toAddressBounceable(params.toAddressBounceable);
    }

    if (typeof params.fromAddressBounceable === 'boolean') {
      transactionBuilder.fromAddressBounceable(params.fromAddressBounceable);
    }

    const rebuiltTransaction = await transactionBuilder.build();
    const parsedTransaction = rebuiltTransaction.toJson();
    return {
      inputs: [
        {
          address: parsedTransaction.sender,
          amount: parsedTransaction.amount,
        },
      ],
      outputs: [
        {
          address: parsedTransaction.destination,
          amount: parsedTransaction.amount,
        },
      ],
    };
  }

  generateKeyPair(seed?: Buffer): KeyPair {
    const keyPair = seed ? new TonKeyPair({ seed }) : new TonKeyPair();
    const keys = keyPair.getKeys();
    if (!keys.prv) {
      throw new Error('Missing prv in key generation.');
    }
    return {
      pub: keys.pub,
      prv: keys.prv,
    };
  }

  isValidPub(pub: string): boolean {
    throw new Error('Method not implemented.');
  }

  isValidAddress(address: string): boolean {
    try {
      const addressBase64 = address.replace(/\+/g, '-').replace(/\//g, '_');
      const buf = Buffer.from(addressBase64.split('?memoId=')[0], 'base64');
      return buf.length === 36;
    } catch {
      return false;
    }
  }

  signTransaction(params: SignTransactionOptions): Promise<SignedTransaction> {
    throw new Error('Method not implemented.');
  }

  /** @inheritDoc */
  async getSignablePayload(serializedTx: string): Promise<Buffer> {
    const factory = new TransactionBuilderFactory(coins.get(this.getChain()));
    const rebuiltTransaction = await factory.from(serializedTx).build();
    return rebuiltTransaction.signablePayload;
  }

  /** @inheritDoc */
  async explainTransaction(params: Record<string, any>): Promise<TransactionExplanation> {
    try {
      const factory = new TransactionBuilderFactory(coins.get(this.getChain()));
      const transactionBuilder = factory.from(Buffer.from(params.txHex, 'hex').toString('base64'));

      const { toAddressBounceable, fromAddressBounceable } = params;

      if (typeof toAddressBounceable === 'boolean') {
        transactionBuilder.toAddressBounceable(toAddressBounceable);
      }

      if (typeof fromAddressBounceable === 'boolean') {
        transactionBuilder.fromAddressBounceable(fromAddressBounceable);
      }

      const rebuiltTransaction = await transactionBuilder.build();
      return rebuiltTransaction.explainTransaction();
    } catch {
      throw new Error('Invalid transaction');
    }
  }
}
