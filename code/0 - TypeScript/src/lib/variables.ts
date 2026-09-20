import { ItemStack, ScoreboardObjective, system } from "@minecraft/server"
import { BACSLoadFurnaceRecipe } from "./blocks/furnace/recipes"
import { apiScoreboard } from "./math/scoreboard"

export const timeCostByUse = 30 // Base of time cost
export const maxSpeedTier = 10 // Max amount of acelerations

// Last slot with a Temporal Bottle
export const cachePlayerBottleSlot = new Map<string, number>() // Player Id > Slot Index

export let coalItem: ItemStack

export let furnaceReloadScore: ScoreboardObjective
export let furnaceRecipeScore: ScoreboardObjective
export let BACSFurnaceRecipeScore: ScoreboardObjective
export let BACSFurnaceRecipeDenyScore: ScoreboardObjective

system.run(() => {
  coalItem = new ItemStack("minecraft:coal")

  // furnaceReloadScore = apiScoreboard.getObj("travel_backpack:furnace")
  // furnaceRecipeScore = apiScoreboard.getObj("travel_backpack:furnace_r")
  BACSFurnaceRecipeScore = apiScoreboard.getObj("BACS:furnace_recipes")
  BACSFurnaceRecipeDenyScore = apiScoreboard.getObj("BACS:furnace_recipes_deny")

  BACSLoadFurnaceRecipe(BACSFurnaceRecipeScore, BACSFurnaceRecipeDenyScore)
})