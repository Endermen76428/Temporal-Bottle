import { blocksTimeList, temporalBottleBlock } from "../lib/temporalBottle/block";
import { temporalBottleFuncBrewStand } from "./blocks/brewingStand/brewingStand";
import { temporalBottleFuncFurnace } from "./blocks/furnace";
import { BlockComponentTypes } from "@minecraft/server";
import { addToGlobalLoop } from "./globalLoop";
export const temporalZone = new class TemporalZone {
    createZone(entity) {
        const block = entity.dimension.getBlock(entity.location);
        if (block == undefined || !block.isValid)
            return;
        const blockSpeed = blocksTimeList[block.typeId];
        if (blockSpeed == undefined)
            return;
        const speedTier = temporalBottleBlock.getCurrentSpeed(block);
        if (!speedTier)
            return;
        let multiplier = 1 << (speedTier.tier + 1);
        multiplier = multiplier < 0 ? 2147483647 : multiplier;
        const exe = accelerationTypeFunc[blockSpeed.type];
        exe && exe(entity, block, 1 << (speedTier.tier + 1), blockSpeed.time);
    }
};
const accelerationTypeFunc = {
    "furnace": (entity, block, multiplier, time) => {
        const inventory = block.getComponent(BlockComponentTypes.Inventory)?.container;
        if (inventory == undefined)
            return;
        temporalBottleFuncFurnace.add(entity, block, inventory, multiplier, time * 20);
        addToGlobalLoop("furnaceAccelerate");
    },
    "brewing_stand": (entity, block, multiplier) => temporalBottleFuncBrewStand.brewing(block)
};
