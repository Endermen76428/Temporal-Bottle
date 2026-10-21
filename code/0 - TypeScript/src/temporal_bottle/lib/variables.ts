import { ItemStack, ScoreboardObjective, system, world } from "@minecraft/server"
import { temporalBottleItem } from "./temporalBottle/bottle"
import { apiScoreboard } from "../../0-lib/math/scoreboard"
import { apiInventory } from "./player/inventory"

export const timeCostByUse = 30 // Base of time cost
export const maxSpeedTier = 10 // Max amount of acelerations

// Last slot with a Temporal Bottle
export const cachePlayerBottleSlot = new Map<string, number>() // Player Id > Slot Index

export let coalItem: ItemStack

export let furnaceReloadScore: ScoreboardObjective

system.run(() => {
  furnaceReloadScore = apiScoreboard.getObj("temporal_bottle:furnace")

  coalItem = new ItemStack("minecraft:coal")

  const players = world.getPlayers()
  for(let p = 0, pLen = players.length; p < pLen; p++){
    const player = players[p]
    if(player == undefined) continue

    // player.dimension.getEntities({type: "temporal_bottle:temporal_zone"}).forEach(e => e.remove())

    const item = apiInventory.getItem(player, "temporal_bottle:temporal_bottle")
    if(item){
      player.addTag("has_temporal_bottle")
      cachePlayerBottleSlot.set(player.id, item.slot)
    }
  }
})

system.runInterval(() => {
  for(const player of world.getPlayers({tags: ["has_temporal_bottle"]})){
    temporalBottleItem.increaseTime(player)
  }
}, 20)