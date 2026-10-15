import { BACSLoadBrewingStandRecipe } from "./brewingStand/recipes"
import { ScoreboardObjective, system } from "@minecraft/server"
import { apiScoreboard } from "../../0-lib/math/scoreboard"
import { BACSLoadFurnaceRecipe } from "./furnace/recipes"

export let BACSFurnaceRecipeScore: ScoreboardObjective
export let BACSFurnaceRecipeDenyScore: ScoreboardObjective
export let BACSBrewingStandRecipeScore: ScoreboardObjective
export let BACSBrewingStandRecipeDenyScore: ScoreboardObjective

export const compatibleAddonsTranslation: { [key: string]: true } = {
  "digital_miner": true,
  "travel_backpack": true
}

system.run(() => {
  // furnaceReloadScore = apiScoreboard.getObj("travel_backpack:furnace")
  // furnaceRecipeScore = apiScoreboard.getObj("travel_backpack:furnace_r")
  BACSFurnaceRecipeScore = apiScoreboard.getObj("BACS:furnace_recipes")
  BACSFurnaceRecipeDenyScore = apiScoreboard.getObj("BACS:furnace_recipes_deny")
  BACSBrewingStandRecipeScore = apiScoreboard.getObj("BACS:brewing_stand_recipes")
  BACSBrewingStandRecipeDenyScore = apiScoreboard.getObj("BACS:brewing_stand_recipes_deny")

  BACSLoadFurnaceRecipe(BACSFurnaceRecipeScore, BACSFurnaceRecipeDenyScore)
  BACSLoadBrewingStandRecipe(BACSBrewingStandRecipeScore, BACSBrewingStandRecipeDenyScore)
})