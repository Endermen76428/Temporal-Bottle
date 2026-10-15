import { BACSLoadBrewingStandRecipe } from "./brewingStand/recipes";
import { system } from "@minecraft/server";
import { apiScoreboard } from "../../0-lib/math/scoreboard";
import { BACSLoadFurnaceRecipe } from "./furnace/recipes";
export let BACSFurnaceRecipeScore;
export let BACSFurnaceRecipeDenyScore;
export let BACSBrewingStandRecipeScore;
export let BACSBrewingStandRecipeDenyScore;
export const compatibleAddonsTranslation = {
    "digital_miner": true,
    "travel_backpack": true
};
system.run(() => {
    BACSFurnaceRecipeScore = apiScoreboard.getObj("BACS:furnace_recipes");
    BACSFurnaceRecipeDenyScore = apiScoreboard.getObj("BACS:furnace_recipes_deny");
    BACSBrewingStandRecipeScore = apiScoreboard.getObj("BACS:brewing_stand_recipes");
    BACSBrewingStandRecipeDenyScore = apiScoreboard.getObj("BACS:brewing_stand_recipes_deny");
    BACSLoadFurnaceRecipe(BACSFurnaceRecipeScore, BACSFurnaceRecipeDenyScore);
    BACSLoadBrewingStandRecipe(BACSBrewingStandRecipeScore, BACSBrewingStandRecipeDenyScore);
});
