import { temporalBottleFuncBrewStand } from "./blocks/brewingStand";
import { temporalBottleFuncFurnace } from "./blocks/furnace";
import { blocksTimeList, temporalBottleBlock } from "../lib/temporalBottle/block";
export const temporalBottleEntity = new class TemporalBottleEntity {
    createInterval(entity) {
        const block = entity.dimension.getBlock(entity.location);
        if (block == undefined || !block.isValid)
            return;
        const blockSpeed = blocksTimeList[block.typeId];
        if (blockSpeed == undefined)
            return;
        const speedTier = temporalBottleBlock.getCurrentSpeed(block);
        if (!speedTier)
            return;
        console.warn(speedTier.tier, (2 ** (speedTier.tier + 1)), 1 << (speedTier.tier + 1));
    }
};
const accelerationTypeFunc = {
    "furnace": (block) => temporalBottleFuncFurnace.smelt(block),
    "brewing_stand": (block) => temporalBottleFuncBrewStand.brewing(block)
};
