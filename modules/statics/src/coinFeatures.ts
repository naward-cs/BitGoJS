import { CoinFeature } from './base';
import { AccountCoin } from './account';
import { Ada } from './ada';

export const ETH_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.SUPPORTS_TOKENS,
  CoinFeature.ENTERPRISE_PAYS_FEES,
];
export const ETH_FEATURES_WITH_MMI = [...ETH_FEATURES, CoinFeature.METAMASK_INSTITUTIONAL];
export const ETH_FEATURES_WITH_STAKING = [...ETH_FEATURES, CoinFeature.STAKING];
export const ETH_FEATURES_WITH_STAKING_AND_MMI = [...ETH_FEATURES_WITH_STAKING, CoinFeature.METAMASK_INSTITUTIONAL];
export const ETC_FEATURES = [
  ...ETH_FEATURES,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_NEW_YORK,
  CoinFeature.MULTISIG_COLD,
];
export const EVM_FEATURES = [
  ...ETH_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.MPCV2,
  CoinFeature.EVM_WALLET,
  CoinFeature.BULK_TRANSACTION,
  CoinFeature.STUCK_TRANSACTION_MANAGEMENT_TSS,
  CoinFeature.EIP1559,
];
export const AVAXC_FEATURES = [
  ...ETH_FEATURES_WITH_MMI,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_SWITZERLAND,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.EIP1559,
];
export const CELO_FEATURES = [
  ...ETH_FEATURES,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.EIP1559,
];
export const ETH2_FEATURES = [...AccountCoin.DEFAULT_FEATURES, CoinFeature.SUPPORTS_TOKENS];
export const RBTC_FEATURES = [
  ...ETH_FEATURES,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
];
export const XLM_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.SUPPORTS_TOKENS,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_NEW_YORK,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.MULTISIG_COLD,
];
export const XTZ_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.ENTERPRISE_PAYS_FEES,
].filter(
  (feature) =>
    feature !== CoinFeature.CUSTODY &&
    feature !== CoinFeature.CUSTODY_BITGO_TRUST &&
    feature !== CoinFeature.CUSTODY_BITGO_MENA_FZE &&
    feature !== CoinFeature.CUSTODY_BITGO_CUSTODY_MENA_FZE
);

export const XRP_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.SUPPORTS_TOKENS,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_NEW_YORK,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.MULTISIG_COLD,
];
export const POLYGON_TOKEN_FEATURES_WITH_FRANKFURT = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.BULK_TRANSACTION,
];
export const CSPR_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.REQUIRES_RESERVE,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_SWITZERLAND,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.STAKING,
];
export const ALGO_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.SUPPORTS_TOKENS,
  CoinFeature.CUSTODY_BITGO_SWITZERLAND,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.BULK_TRANSACTION,
];
export const HTETH_TOKEN_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.BULK_TRANSACTION,
  CoinFeature.EIP1559,
];
export const ADA_FEATURES = [...Ada.DEFAULT_FEATURES, CoinFeature.BULK_TRANSACTION];
export const ADA_FEATURES_WITH_FRANKFURT = [...ADA_FEATURES, CoinFeature.CUSTODY_BITGO_FRANKFURT];
export const DOT_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.STAKING,
  CoinFeature.EXPIRING_TRANSACTIONS,
  CoinFeature.REBUILD_ON_CUSTODY_SIGNING,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
];
export const EOS_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.SUPPORTS_TOKENS,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.MULTISIG_COLD,
];
export const HBAR_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.SUPPORTS_TOKENS,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.BULK_TRANSACTION,
];
export const POLYGON_FEATURES = [
  ...ETH_FEATURES_WITH_MMI,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.EVM_WALLET,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_SWITZERLAND,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.MPCV2,
  CoinFeature.STUCK_TRANSACTION_MANAGEMENT_TSS,
  CoinFeature.BULK_TRANSACTION,
];

export const POLYGON_TOKEN_FEATURES = [...AccountCoin.DEFAULT_FEATURES, CoinFeature.BULK_TRANSACTION];
export const POL_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.STAKING,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.CUSTODY_BITGO_SWITZERLAND,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
];
export const SOL_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.REQUIRES_RESERVE,
  CoinFeature.SUPPORTS_TOKENS,
  CoinFeature.STAKING,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.BULK_TRANSACTION,
];
export const TSOL_FEATURES = [...SOL_FEATURES, CoinFeature.BULK_TRANSACTION, CoinFeature.CUSTODY_BITGO_SINGAPORE];
export const SOL_TOKEN_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.BULK_TRANSACTION,
];
export const SOL_OFC_TOKEN_FEATURES = [...AccountCoin.DEFAULT_FEATURES, CoinFeature.TSS, CoinFeature.TSS_COLD];
export const BSC_TOKEN_FEATURES = [...AccountCoin.DEFAULT_FEATURES, CoinFeature.BULK_TRANSACTION];
export const BSC_TOKEN_FEATURES_EXCLUDE_SINGAPORE = [
  ...AccountCoin.DEFAULT_FEATURES_EXCLUDE_SINGAPORE,
  CoinFeature.BULK_TRANSACTION,
];
export const STX_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.STAKING,
];
export const NEAR_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.STAKING,
  CoinFeature.REBUILD_ON_CUSTODY_SIGNING,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
];
export const MATIC_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.STAKING,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.METAMASK_INSTITUTIONAL,
  CoinFeature.CUSTODY_BITGO_SWITZERLAND,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
];
export const MATIC_FEATURES_WITH_FRANKFURT = [...MATIC_FEATURES, CoinFeature.CUSTODY_BITGO_FRANKFURT];

export const WETH_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.METAMASK_INSTITUTIONAL,
  CoinFeature.CUSTODY_BITGO_SWITZERLAND,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.LIQUID_STAKING,
];
export const TWETH_FEATURES = [...WETH_FEATURES, CoinFeature.STAKING];
export const EIGEN_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.STAKING,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.METAMASK_INSTITUTIONAL,
  CoinFeature.CUSTODY_BITGO_SWITZERLAND,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.LIQUID_STAKING,
];
export const RETH_ROCKET_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.STAKING,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.METAMASK_INSTITUTIONAL,
  CoinFeature.CUSTODY_BITGO_SWITZERLAND,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.LIQUID_STAKING,
];
export const SUI_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.STAKING,
  CoinFeature.BULK_TRANSACTION,
  CoinFeature.BULK_STAKING_TRANSACTION,
  CoinFeature.SUPPORTS_TOKENS,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
];
export const SUI_TOKEN_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.BULK_TRANSACTION,
];
export const SUI_TOKEN_FEATURES_STAKING = [
  ...SUI_TOKEN_FEATURES,
  CoinFeature.STAKING,
  CoinFeature.BULK_STAKING_TRANSACTION,
];
export const TRX_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.SUPPORTS_TOKENS,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_SINGAPORE,
  CoinFeature.MULTISIG_COLD,
];
export const COSMOS_SIDECHAIN_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.MPCV2,
  CoinFeature.SHA256_WITH_ECDSA_TSS,
  CoinFeature.COSMOS_LIKE_COINS,
  CoinFeature.REBUILD_ON_CUSTODY_SIGNING,
  CoinFeature.INCREASED_TX_REQUEST_REBUILD_LIMIT,
  CoinFeature.BULK_TRANSACTION,
  CoinFeature.STUCK_TRANSACTION_MANAGEMENT_TSS,
];
export const COSMOS_SIDECHAIN_FEATURES_WITH_STAKING = [
  ...COSMOS_SIDECHAIN_FEATURES,
  CoinFeature.STAKING,
  CoinFeature.BULK_STAKING_TRANSACTION,
];
export const ATOM_FEATURES = [...COSMOS_SIDECHAIN_FEATURES_WITH_STAKING, CoinFeature.CUSTODY_BITGO_FRANKFURT];
export const INJECTIVE_FEATURES = [
  ...COSMOS_SIDECHAIN_FEATURES_WITH_STAKING,
  CoinFeature.CUSTODY_BITGO_SWITZERLAND,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
];
export const COREUM_FEATURES = [...COSMOS_SIDECHAIN_FEATURES_WITH_STAKING, CoinFeature.CUSTODY_BITGO_FRANKFURT];
export const SEI_FEATURES = [...COSMOS_SIDECHAIN_FEATURES_WITH_STAKING, CoinFeature.CUSTODY_BITGO_FRANKFURT];
export const TOKEN_FEATURES_WITH_SWISS = [...AccountCoin.DEFAULT_FEATURES, CoinFeature.CUSTODY_BITGO_SWITZERLAND];
export const TOKEN_FEATURES_WITH_FRANKFURT = [...AccountCoin.DEFAULT_FEATURES, CoinFeature.CUSTODY_BITGO_FRANKFURT];
export const TOKEN_FEATURES_WITH_NY_GERMANY_FRANKFURT = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.CUSTODY_BITGO_NEW_YORK,
  CoinFeature.CUSTODY_BITGO_GERMANY,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
];
export const GENERIC_TOKEN_FEATURES = [
  CoinFeature.ACCOUNT_MODEL,
  CoinFeature.REQUIRES_BIG_NUMBER,
  CoinFeature.VALUELESS_TRANSFER,
  CoinFeature.TRANSACTION_DATA,
  CoinFeature.GENERIC_TOKEN,
];
export const TON_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.STAKING,
  CoinFeature.REBUILD_ON_CUSTODY_SIGNING,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
];
export const ARBETH_FEATURES = [
  ...ETH_FEATURES,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.EVM_WALLET,
  CoinFeature.USES_NON_PACKED_ENCODING_FOR_TXDATA,
  CoinFeature.ETH_ROLLUP_CHAIN,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.EIP1559,
];
export const OPETH_FEATURES = [
  ...ETH_FEATURES,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.EVM_WALLET,
  CoinFeature.USES_NON_PACKED_ENCODING_FOR_TXDATA,
  CoinFeature.ETH_ROLLUP_CHAIN,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.EIP1559,
];
export const ZKETH_FEATURES = [
  ...ETH_FEATURES,
  CoinFeature.MULTISIG_COLD,
  CoinFeature.EVM_WALLET,
  CoinFeature.USES_NON_PACKED_ENCODING_FOR_TXDATA,
  CoinFeature.ETH_ROLLUP_CHAIN,
  CoinFeature.EIP1559,
];
export const BERA_FEATURES = [
  ...ETH_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.MPCV2,
  CoinFeature.EVM_WALLET,
  CoinFeature.USES_NON_PACKED_ENCODING_FOR_TXDATA,
  CoinFeature.BULK_TRANSACTION,
  CoinFeature.STUCK_TRANSACTION_MANAGEMENT_TSS,
  CoinFeature.EIP1559,
  CoinFeature.STAKING,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_GERMANY,
];
export const OAS_FEATURES = [
  ...ETH_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.MPCV2,
  CoinFeature.EVM_WALLET,
  CoinFeature.BULK_TRANSACTION,
  CoinFeature.STUCK_TRANSACTION_MANAGEMENT_TSS,
  CoinFeature.EIP1559,
];
export const COREDAO_FEATURES = [
  ...ETH_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.MPCV2,
  CoinFeature.EVM_WALLET,
  CoinFeature.BULK_TRANSACTION,
  CoinFeature.STUCK_TRANSACTION_MANAGEMENT_TSS,
  CoinFeature.EIP1559,
  CoinFeature.STAKING,
  CoinFeature.EIP1559,
];
export const APT_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.STAKING,
  CoinFeature.BULK_TRANSACTION,
  CoinFeature.BULK_STAKING_TRANSACTION,
  CoinFeature.SUPPORTS_TOKENS,
  CoinFeature.ENTERPRISE_PAYS_FEES,
  CoinFeature.TSS_ENTERPRISE_PAYS_FEES,
];

export const ICP_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.MPCV2,
  CoinFeature.SUPPORTS_TOKENS,
];

export const TAO_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.TSS,
  CoinFeature.TSS_COLD,
  CoinFeature.STAKING,
];

export const ETH_FEATURES_WITH_FRANKFURT = [...ETH_FEATURES, CoinFeature.CUSTODY_BITGO_FRANKFURT];
export const ETH_FEATURES_WITH_GERMANY = [...ETH_FEATURES, CoinFeature.CUSTODY_BITGO_GERMANY];
export const ETH_FEATURES_WITH_FRANKFURT_GERMANY = [...ETH_FEATURES_WITH_FRANKFURT, CoinFeature.CUSTODY_BITGO_GERMANY];
export const SOL_TOKEN_FEATURES_WITH_FRANKFURT = [
  ...SOL_TOKEN_FEATURES,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.BULK_TRANSACTION,
];
export const SOL_TOKEN_FEATURES_WITH_FRANKFURT_GERMANY = [
  ...SOL_TOKEN_FEATURES_WITH_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_GERMANY,
];
export const XLM_TOKEN_FEATURES_WITH_FRANKFURT = [...AccountCoin.DEFAULT_FEATURES, CoinFeature.CUSTODY_BITGO_FRANKFURT];
export const ZETA_FEATURES = [...COSMOS_SIDECHAIN_FEATURES_WITH_STAKING, CoinFeature.CUSTODY_BITGO_SINGAPORE];
export const ZETA_EVM_FEATURES = [...AccountCoin.DEFAULT_FEATURES, CoinFeature.CUSTODY_BITGO_SINGAPORE];
export const ETH_FEATURES_WITH_FRANKFURT_EXCLUDE_SINGAPORE = ETH_FEATURES_WITH_FRANKFURT.filter(
  (feature) => feature !== CoinFeature.CUSTODY_BITGO_SINGAPORE
);
export const TIA_FEATURES = [
  ...COSMOS_SIDECHAIN_FEATURES_WITH_STAKING,
  CoinFeature.CUSTODY_BITGO_SWITZERLAND,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
];
export const WCT_FEATURES = [...AccountCoin.DEFAULT_FEATURES, CoinFeature.STAKING];
export const BERA_BGT_FEATURES = [
  ...AccountCoin.DEFAULT_FEATURES,
  CoinFeature.CUSTODY_BITGO_FRANKFURT,
  CoinFeature.CUSTODY_BITGO_GERMANY,
];
