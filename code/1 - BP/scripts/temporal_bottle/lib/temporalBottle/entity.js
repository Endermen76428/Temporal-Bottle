import { temporalBottleFuncBrewStand } from "../../functions/brewingStand";
import { temporalBottleFuncFurnace } from "../../functions/furnace";
import { furnaceFuelStoredAmount } from "../variables/cache";
import { system } from "@minecraft/server";
import { temporalBottleBlock } from "./block";
import { temporalBottleInfo } from "./info";
const accelerationRunInterval = new Map();
export const temporalBottleEntity = new class TemporalBottleEntity {
    createInterval(entity) {
        const block = entity.dimension.getBlock(entity.location);
        if (!block)
            return;
        const blockSpeed = temporalBottleBlock.getBlockTime(block.typeId);
        if (blockSpeed == undefined)
            return;
        const speedTier = temporalBottleBlock.getCurrentSpeed(block);
        if (!speedTier)
            return;
        const tickInterval = temporalBottleInfo.tickInterval(blockSpeed.time, speedTier.tier);
        const oldRunIntervalId = accelerationRunInterval.get(entity.id);
        oldRunIntervalId != undefined && system.clearRun(oldRunIntervalId);
        const runIntervalId = system.runInterval(() => {
            if (!entity.isValid) {
                furnaceFuelStoredAmount.delete((block.x << 20) ^ (block.y << 10) ^ block.z);
                return system.clearRun(runIntervalId);
            }
            const execute = accelerationTypeFunc[blockSpeed.type];
            if (execute)
                execute(block);
        }, tickInterval);
        console.warn(tickInterval);
        accelerationRunInterval.set(entity.id, runIntervalId);
    }
};
const accelerationTypeFunc = {
    "furnace": (block) => temporalBottleFuncFurnace.smelt(block),
    "brewing_stand": (block) => temporalBottleFuncBrewStand.brewing(block)
};
