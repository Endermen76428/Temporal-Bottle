import { blocksTimeList, temporalBottleBlock } from "../lib/temporalBottle/block"
import { temporalBottleFuncBrewStand } from "./blocks/brewingStand"
import { temporalBottleFuncFurnace } from "./blocks/furnace"
import { Block, BlockComponentTypes, Entity } from "@minecraft/server"
import { addToGlobalLoop } from "./globalLoop"

export const temporalZone = new class TemporalZone {
  createZone(entity: Entity): void {
    const block = entity.dimension.getBlock(entity.location)
    if(block == undefined || !block.isValid) return

    const blockSpeed = blocksTimeList[block.typeId]
    if(blockSpeed == undefined) return

    const speedTier = temporalBottleBlock.getCurrentSpeed(block)
    if(!speedTier) return

    const exe = accelerationTypeFunc[blockSpeed.type]
    exe && exe(entity, block, 1 << (speedTier.tier +1))
  }
}

const accelerationTypeFunc: { [key: string]: (entity: Entity, block: Block, multiplier: number) => void } = {
  "furnace": (entity, block, multiplier) => {
    const inventory = block.getComponent(BlockComponentTypes.Inventory)?.container
    if(inventory == undefined) return

    temporalBottleFuncFurnace.add(entity, block, inventory, multiplier)
    addToGlobalLoop("furnaceAccelerate")
  },

  "brewing_stand": (entity, block, multiplier) => temporalBottleFuncBrewStand.brewing(block)
}