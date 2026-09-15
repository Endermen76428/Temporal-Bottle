import { world } from "@minecraft/server";
import { blocksTimeList } from "../lib/temporalBottle/block";
world.beforeEvents.entityRemove.subscribe(({ removedEntity: entity }) => {
    if (entity.typeId != "temporal_bottle:temporal_zone")
        return;
    const block = entity.dimension.getBlock(entity.location);
    if (block == undefined || !block.isValid)
        return;
    const blockSpeed = blocksTimeList[block.typeId];
});
