import { ItemStack, system } from "@minecraft/server";
import { BACSLoadFurnaceRecipe } from "./blocks/furnace/recipes";
import { apiScoreboard } from "./math/scoreboard";
export const timeCostByUse = 30;
export const maxSpeedTier = 10;
export const cachePlayerBottleSlot = new Map();
export let coalItem;
export let furnaceReloadScore;
export let furnaceRecipeScore;
export let BACSFurnaceRecipeScore;
export let BACSFurnaceRecipeDenyScore;
system.run(() => {
    coalItem = new ItemStack("minecraft:coal");
    BACSFurnaceRecipeScore = apiScoreboard.getObj("BACS:furnace_recipes");
    BACSFurnaceRecipeDenyScore = apiScoreboard.getObj("BACS:furnace_recipes_deny");
    BACSLoadFurnaceRecipe(BACSFurnaceRecipeScore, BACSFurnaceRecipeDenyScore);
});
