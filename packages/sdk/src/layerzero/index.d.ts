import type { OFTBridgeParams } from "../types/index.js";
export declare const LZ_ENDPOINTS: {
    readonly ARBITRUM_ONE: 30110;
    readonly ETHEREUM: 30101;
    readonly POLYGON: 30109;
    readonly AVALANCHE: 30106;
    readonly BSC: 30102;
    readonly OPTIMISM: 30111;
    readonly BASE: 30184;
};
export declare const OFT_TOKENS: {
    readonly CETES_28: "0x0000000000000000000000000000000000000001";
    readonly CETES_91: "0x0000000000000000000000000000000000000002";
    readonly CETES_182: "0x0000000000000000000000000000000000000003";
    readonly CETES_364: "0x0000000000000000000000000000000000000004";
};
/**
 * Estimate LayerZero messaging fee for OFT transfer
 */
export declare function estimateBridgeFee(params: OFTBridgeParams): Promise<{
    nativeFee: bigint;
    lzTokenFee: bigint;
}>;
/**
 * Build adapter params for LayerZero V2 message options
 */
export declare function buildAdapterParams(gasLimit?: number, nativeDropAmount?: bigint, nativeDropAddress?: string): string;
/**
 * Validate OFT bridge parameters
 */
export declare function validateBridgeParams(params: OFTBridgeParams): {
    valid: boolean;
    errors: string[];
};
/**
 * Format cross-chain transfer summary for UI
 */
export declare function formatTransferSummary(params: OFTBridgeParams): string;
//# sourceMappingURL=index.d.ts.map