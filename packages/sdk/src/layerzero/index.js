// ============================================================================
// STYLO PROTOCOL — LayerZero V2 OFT Integration
// Cross-chain CETES tokenization via Omnichain Fungible Token standard
// ============================================================================
// LayerZero V2 Endpoint IDs
export const LZ_ENDPOINTS = {
    ARBITRUM_ONE: 30110,
    ETHEREUM: 30101,
    POLYGON: 30109,
    AVALANCHE: 30106,
    BSC: 30102,
    OPTIMISM: 30111,
    BASE: 30184,
};
// Supported OFT token addresses (Arbitrum One)
export const OFT_TOKENS = {
    CETES_28: "0x0000000000000000000000000000000000000001", // placeholder
    CETES_91: "0x0000000000000000000000000000000000000002",
    CETES_182: "0x0000000000000000000000000000000000000003",
    CETES_364: "0x0000000000000000000000000000000000000004",
};
/**
 * Estimate LayerZero messaging fee for OFT transfer
 */
export async function estimateBridgeFee(params) {
    // In production this calls the LZ endpoint contract
    // Simulated estimation for development
    const baseFee = BigInt(1e15); // ~0.001 ETH
    const sizeFactor = params.amount > BigInt(1e18) ? BigInt(2) : BigInt(1);
    return {
        nativeFee: baseFee * sizeFactor,
        lzTokenFee: BigInt(0),
    };
}
/**
 * Build adapter params for LayerZero V2 message options
 */
export function buildAdapterParams(gasLimit = 200_000, nativeDropAmount = BigInt(0), nativeDropAddress = "0x0000000000000000000000000000000000000000") {
    // Type 2 adapter params with native drop
    if (nativeDropAmount > BigInt(0)) {
        return encodeAdapterParamsV2(gasLimit, nativeDropAmount, nativeDropAddress);
    }
    // Type 1 adapter params (simple)
    return encodeAdapterParamsV1(gasLimit);
}
function encodeAdapterParamsV1(gasLimit) {
    return `0x00010000000000000000000000000000000000000000000000000000000000${gasLimit.toString(16).padStart(8, "0")}`;
}
function encodeAdapterParamsV2(gasLimit, nativeDropAmount, nativeDropAddress) {
    const gasHex = gasLimit.toString(16).padStart(64, "0");
    const amountHex = nativeDropAmount.toString(16).padStart(64, "0");
    const addrHex = nativeDropAddress.replace("0x", "").padStart(64, "0");
    return `0x0002${gasHex}${amountHex}${addrHex}`;
}
/**
 * Validate OFT bridge parameters
 */
export function validateBridgeParams(params) {
    const errors = [];
    if (params.amount <= BigInt(0)) {
        errors.push("Amount must be positive");
    }
    if (params.srcChainId === params.dstChainId) {
        errors.push("Source and destination chains must differ");
    }
    if (!params.receiver || params.receiver === "0x0000000000000000000000000000000000000000") {
        errors.push("Invalid receiver address");
    }
    if (params.minAmountOut > params.amount) {
        errors.push("Minimum amount out cannot exceed send amount");
    }
    const validChainIds = Object.values(LZ_ENDPOINTS);
    if (!validChainIds.includes(params.srcChainId)) {
        errors.push(`Unsupported source chain ID: ${params.srcChainId}`);
    }
    if (!validChainIds.includes(params.dstChainId)) {
        errors.push(`Unsupported destination chain ID: ${params.dstChainId}`);
    }
    return { valid: errors.length === 0, errors };
}
/**
 * Format cross-chain transfer summary for UI
 */
export function formatTransferSummary(params) {
    const chainNames = {
        [LZ_ENDPOINTS.ARBITRUM_ONE]: "Arbitrum One",
        [LZ_ENDPOINTS.ETHEREUM]: "Ethereum",
        [LZ_ENDPOINTS.POLYGON]: "Polygon",
        [LZ_ENDPOINTS.BASE]: "Base",
    };
    const srcName = chainNames[params.srcChainId] || `Chain ${params.srcChainId}`;
    const dstName = chainNames[params.dstChainId] || `Chain ${params.dstChainId}`;
    return `Bridge ${params.amount.toString()} tokens from ${srcName} → ${dstName}`;
}
//# sourceMappingURL=index.js.map