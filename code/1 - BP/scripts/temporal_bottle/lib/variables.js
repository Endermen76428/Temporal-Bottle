import { ItemStack, system, world } from "@minecraft/server";
import { BACSLoadFurnaceRecipe } from "./blocks/furnace/recipes";
import { temporalBottleItem } from "./temporalBottle/bottle";
import { apiScoreboard } from "./math/scoreboard";
import { apiInventory } from "./player/inventory";
export const timeCostByUse = 30;
export const maxSpeedTier = 10;
export const cachePlayerBottleSlot = new Map();
export let coalItem;
export let furnaceReloadScore;
export let furnaceRecipeScore;
export let BACSFurnaceRecipeScore;
export let BACSFurnaceRecipeDenyScore;
system.run(() => {
    const players = world.getPlayers();
    for (let p = 0, pLen = players.length; p < pLen; p++) {
        const player = players[p];
        if (player == undefined)
            continue;
        player.dimension.getEntities({ type: "temporal_bottle:temporal_zone" }).forEach(e => e.remove());
        const item = apiInventory.getItem(player, "temporal_bottle:temporal_bottle");
        if (item) {
            player.addTag("has_temporal_bottle");
            cachePlayerBottleSlot.set(player.id, item.slot);
        }
    }
    coalItem = new ItemStack("minecraft:coal");
    BACSFurnaceRecipeScore = apiScoreboard.getObj("BACS:furnace_recipes");
    BACSFurnaceRecipeDenyScore = apiScoreboard.getObj("BACS:furnace_recipes_deny");
    BACSLoadFurnaceRecipe(BACSFurnaceRecipeScore, BACSFurnaceRecipeDenyScore);
});
system.runInterval(() => {
    for (const player of world.getPlayers({ tags: ["has_temporal_bottle"] })) {
        temporalBottleItem.increaseTime(player);
    }
}, 20);
