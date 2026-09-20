import { temporalBottleItem } from "../lib/temporalBottle/bottle";
import { cachePlayerBottleSlot } from "../lib/variables";
import { apiInventory } from "../lib/player/inventory";
import { system, world } from "@minecraft/server";
import "./customComponent/startUp";
import "./playerInteractBlock";
import "./inventoryChange";
import "./scriptEvent";
import "./breakBlock";
system.runInterval(() => {
    for (const player of world.getPlayers({ tags: ["has_temporal_bottle"] })) {
        temporalBottleItem.increaseTime(player);
    }
}, 20);
system.run(() => {
    world.getPlayers().forEach(player => {
        player.dimension.getEntities({ type: "temporal_bottle:temporal_zone" }).forEach(e => e.remove());
        const item = apiInventory.getItem(player, "temporal_bottle:temporal_bottle");
        if (item) {
            player.addTag("has_temporal_bottle");
            cachePlayerBottleSlot.set(player.id, item.slot);
        }
    });
});
