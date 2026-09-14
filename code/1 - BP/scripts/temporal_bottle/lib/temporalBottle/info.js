import { timeCostByUse } from "../variables/cache";
export const temporalBottleInfo = new class TemporalBottleInfo {
    timeByTier(tier) {
        return timeCostByUse * (1 << tier) - (tier > 0 ? timeCostByUse * (1 << (tier - 1)) : 0);
    }
    speedMultiplyByTier(tier) {
        return (2 ** (tier + 1));
    }
    tickInterval(blockSpeed, tier) {
        return Math.ceil((blockSpeed * 20) / this.speedMultiplyByTier(tier));
    }
};
