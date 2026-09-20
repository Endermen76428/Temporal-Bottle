import { ItemStack, ScoreboardObjective, system, world } from "@minecraft/server"
import { BACSLoadFurnaceRecipe } from "./blocks/furnace/recipes"
import { temporalBottleItem } from "./temporalBottle/bottle"
import { apiScoreboard } from "./math/scoreboard"
import { apiInventory } from "./player/inventory"

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
  const players = world.getPlayers()
  for(let p = 0, pLen = players.length; p < pLen; p++){
    const player = players[p]
    if(player == undefined) continue

    player.dimension.getEntities({type: "temporal_bottle:temporal_zone"}).forEach(e => e.remove()) // console.warn("Coisa dev remove depois")

    const item = apiInventory.getItem(player, "temporal_bottle:temporal_bottle")
    if(item){
      player.addTag("has_temporal_bottle")
      cachePlayerBottleSlot.set(player.id, item.slot)
    }
  }

  coalItem = new ItemStack("minecraft:coal")

  // furnaceReloadScore = apiScoreboard.getObj("travel_backpack:furnace")
  // furnaceRecipeScore = apiScoreboard.getObj("travel_backpack:furnace_r")
  BACSFurnaceRecipeScore = apiScoreboard.getObj("BACS:furnace_recipes")
  BACSFurnaceRecipeDenyScore = apiScoreboard.getObj("BACS:furnace_recipes_deny")

  BACSLoadFurnaceRecipe(BACSFurnaceRecipeScore, BACSFurnaceRecipeDenyScore)
})

system.runInterval(() => {
  for(const player of world.getPlayers({tags: ["has_temporal_bottle"]})){
    temporalBottleItem.increaseTime(player)
  }
}, 20)