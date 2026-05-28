/**
 * fees.ts — calculates the full cost breakdown for deploying a contract.
 *
 * Total = gas fee (dynamic) + treasury fee (always fixed)
 * Treasury fee does NOT fluctuate with gas price.
 */

import {
  TREASURY_FEE_DEPLOY_USD,
  TREASURY_FEE_VERIFY_USD,
  CONTRACT_GAS_LIMITS,
  DEFAULT_GAS_LIMIT,
} from "@/constants/treasury";
import { estimateDeploymentCost, formatUsd, formatEth } from "@/services/gas";
import type { GasData } from "@/services/gas";

export type DeployMode = "deploy" | "deploy-verify";

export interface FeeBreakdown {
  /** Live gas cost in ETH */
  gasCostEth: number;
  /** Live gas cost in USD */
  gasCostUsd: number;
  /** Fixed treasury fee in USD */
  treasuryFeeUsd: number;
  /** Total cost in USD */
  totalUsd: number;
  /** Gas limit used for estimate */
  gasLimit: number;
  /** Formatted strings ready for display */
  display: {
    gasCostEth: string;
    gasCostUsd: string;
    treasuryFee: string;
    total: string;
  };
}

/**
 * Calculate the full fee breakdown for a given contract + deploy mode.
 * Requires live GasData from useGasPrice hook.
 */
export function calculateFees(
  contractId: string,
  mode: DeployMode,
  gasData: GasData,
): FeeBreakdown {
  const gasLimit = CONTRACT_GAS_LIMITS[contractId] ?? DEFAULT_GAS_LIMIT;
  const { gasCostEth, gasCostUsd } = estimateDeploymentCost(gasLimit, gasData);

  const treasuryFeeUsd =
    mode === "deploy-verify" ? TREASURY_FEE_VERIFY_USD : TREASURY_FEE_DEPLOY_USD;

  const totalUsd = gasCostUsd + treasuryFeeUsd;

  return {
    gasCostEth,
    gasCostUsd,
    treasuryFeeUsd,
    totalUsd,
    gasLimit,
    display: {
      gasCostEth: formatEth(gasCostEth),
      gasCostUsd: formatUsd(gasCostUsd),
      treasuryFee: formatUsd(treasuryFeeUsd),
      total: formatUsd(totalUsd),
    },
  };
}
