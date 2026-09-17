import { temporalBottleBlock } from "../lib/temporalBottle/block";
import { temporalBottleItem } from "../lib/temporalBottle/bottle";
import { system, world } from "@minecraft/server";
import { maxSpeedTier } from "../lib/variables/cache";
world.beforeEvents.playerInteractWithBlock.subscribe(ev => {
    if (!ev.isFirstEvent)
        return;
    const { block, player, itemStack: item } = ev;
    if (item?.typeId == "temporal_bottle:temporal_bottle")
        if (enableTemporalAccelerate(block, player))
            ev.cancel = true;
});
function enableTemporalAccelerate(block, player) {
    const currentSpeed = temporalBottleBlock.getCurrentSpeed(block);
    if (currentSpeed == undefined) {
        if (temporalBottleItem.hasTime(player, 0)) {
            system.run(() => {
                const entity = block.dimension.spawnEntity("temporal_bottle:temporal_zone", block.bottomCenter());
                entity.setProperty("temporal_bottle:tier", maxSpeedTier);
                temporalBottleItem.decreaseTime(player, 0);
            });
        }
        return true;
    }
    if (currentSpeed.tier + 1 < maxSpeedTier) {
        if (temporalBottleItem.hasTime(player, currentSpeed.tier + 1)) {
            system.run(() => {
                currentSpeed.entity.triggerEvent("temporal_bottle:increase_tier");
                temporalBottleItem.decreaseTime(player, currentSpeed.tier + 1);
            });
            return true;
        }
    }
    return false;
}
