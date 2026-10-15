import { Block, Container, Entity, ItemComponentTypes, ItemPotionComponent, ItemStack, Potions } from "@minecraft/server"
import { brewingStandRecipeList } from "../../../1-bacs/recipes/brewingStand/recipes"
import { removeFromGlobalLoop } from "../globalLoop"

export const temporalBottleFuncBrewingStand = new class TemporalBottleFuncBrewingStand {
  private brewingStandsInfo: { [key: string]: IIntervalInfo } = {}

  add(entity: Entity, block: Block, inventory: Container, multiplier: number, maxProcess: number): void {
    const id = (block.x << 20) ^ (block.z << 10) ^ block.y
    const oldInfo = this.brewingStandsInfo[id]
    if(oldInfo != undefined){
      oldInfo.multiplier = multiplier
    } else {
      this.brewingStandsInfo[id] = { entity, block, inventory, multiplier, progress: 0, maxProcess }
    }
  }

  update(): void {
    const brewingStands = Object.entries(this.brewingStandsInfo)
    const length = brewingStands.length
    let invalids = 0

    for(let i = 0; i < length; i++){
      const [ key, info ] = brewingStands[i] ?? []
      if(key == undefined || info == undefined) continue
      const { entity, block, inventory, multiplier, progress, maxProcess, gettingRecipe } = info

      // Remove a backpack da lista quando ela fica inválida
      if(!entity.isValid || !block.isValid || !inventory.isValid){
        invalids++
        delete this.brewingStandsInfo[key]
        continue
      }

      if(gettingRecipe != undefined) continue
      // console.warn("Fazer um sistema para pegar todos os temporal zone e reativa-las ao executar o /reload, seila fazer um array, pois ai ele reseta sempre nesses caso, talvez funcione")

      const input = inventory.getItem(0)
      if(input == undefined){
        info.progress = 0
        continue
      }

      const thrownType: TThrownType | undefined = input.typeId == "minecraft:gunpowder" ? "ThrownSplash" : input.typeId == "minecraft:dragon_breath" ? "ThrownLingering" : undefined

      let hasValidPotion = false
      for(let i = 0; i < 3; i++){
        const slotBase = inventory.getItem(i +1)

        if(slotBase == undefined) continue

        const addonRecipeId = brewingStandRecipeList[slotBase?.typeId + "/" + input.typeId]
        const base = slotBase?.getComponent(ItemComponentTypes.Potion)
        const vanillaRecipeId = brewingStandRecipeList[base?.potionEffectType.id + "/" + input.typeId]
        if(addonRecipeId != undefined || (base && thrownType && base.potionDeliveryType.id == transformDeliveryRequirements[thrownType]) || vanillaRecipeId != undefined){
          hasValidPotion = true
          break
        }
      }

      // Se alguma poção pode ser gerada no futuro, o progresso será aumentado
      if(hasValidPotion) info.progress += multiplier

      if(progress >= maxProcess){
        info.progress -= maxProcess

        let transformed = false
        for(let i = 0; i < 3; i++){
          const slotBase = inventory.getItem(i +1)
          if(slotBase == undefined) continue

          // Verifia se a poção gerada é de addon
          const addonRecipeId = brewingStandRecipeList[slotBase?.typeId + "/" + input.typeId]
          if(addonRecipeId != undefined){
            inventory.setItem(i +1, new ItemStack(addonRecipeId))
            transformed = true
            continue
          }

          const base = slotBase?.getComponent(ItemComponentTypes.Potion)
          if(!base) continue

          // verificar se a fabricação será uma transformação de tipo
          if(thrownType && base.potionDeliveryType.id == transformDeliveryRequirements[thrownType]){
            this.transformDeliveryType(inventory, base, i +1, thrownType)
            transformed = true
            continue
          }

          // Verifica se a poção é vanilla
          const vanillaRecipeId = brewingStandRecipeList[base?.potionEffectType.id + "/" + input.typeId]
          if(vanillaRecipeId != undefined){
            inventory.setItem(i +1, Potions.resolve(vanillaRecipeId, base.potionDeliveryType))
            transformed = true
          }
        }

        // Se pelo menos uma das poções foi criada, o input é decrementado
        if(transformed){
          block.dimension.playSound("random.potion.brewed", block.center())
          if(input.amount < 2){
            inventory.setItem(0, undefined)
          } else {
            input.amount--
            inventory.setItem(0, input)
          }
        }
      }

      // Pega o item que será gerado ao fundir o input atual
      // const expectedOutput = brewingStandRecipeList[input.typeId]
      // if(expectedOutput == undefined){
      //   if(furnaceRecipeDenyList[`${index}/${input.typeId}`] != undefined) continue

      //   entity.triggerEvent("temporal_bottle:search_furnace_recipe")

      //   // const furnaceBlock = block.dimension.getBlock({x: block.x, y: block.y +2, z: block.z})
      //   const furnaceBlock = block.dimension.getBlock({x: block.x, y: block.dimension.heightRange.min, z: block.z})
      //   if(furnaceBlock == undefined || !furnaceBlock.isValid) continue

      //   const blastBlock = furnaceBlock?.north()
      //   const smokerBlock = furnaceBlock?.south()
      //   if(blastBlock == undefined || !blastBlock.isValid) continue
      //   if(smokerBlock == undefined || !smokerBlock.isValid) continue

      //   info.gettingRecipe = furnaceBlock
      //   furnaceBlock.setType("minecraft:furnace")
      //   blastBlock.setType("minecraft:blast_furnace")
      //   smokerBlock.setType("minecraft:smoker")

      //   const furnaceInv = furnaceBlock.getComponent(BlockComponentTypes.Inventory)?.container
      //   const blastInv = blastBlock.getComponent(BlockComponentTypes.Inventory)?.container
      //   const smokerInv = smokerBlock.getComponent(BlockComponentTypes.Inventory)?.container

      //   if(furnaceInv == undefined || blastInv == undefined || smokerInv == undefined) continue

      //   const inputItem = new ItemStack(input.typeId) // Recria o item mas somente com 1 unidade
      //   furnaceInv.setItem(0, inputItem), blastInv.setItem(0, inputItem), smokerInv.setItem(0, inputItem)
      //   furnaceInv.setItem(1, coalItem), blastInv.setItem(1, coalItem), smokerInv.setItem(1, coalItem)

      //   const tickId = `${furnaceBlock.x},${furnaceBlock.y},${furnaceBlock.z}`
      //   world.tickingAreaManager.hasTickingArea(tickId) == false && world.tickingAreaManager.createTickingArea(tickId, {dimension: furnaceBlock.dimension, from: blastBlock.location, to: smokerBlock.location})

      //   let players = entity.dimension.getPlayers({location: entity.location, maxDistance: 10})
      //   for(let p = 0, pLen = players.length; p < pLen; p++){
      //     const player = players[p]
      //     const addonId = input.typeId.split(":", 1)[0] ?? ""
      //     if(player != undefined) apiWarn.notify(player, {translate: "bacs.warn.temporal_bottle:furnace.start_search.20", with: {rawtext:[{translate: input.localizationKey + (compatibleAddonsTranslation[addonId] ? ".bacs" : "")}]}}, {sound: "warn.ender_addon_pack:pop"})
      //   }

      //   system.runTimeout(() => {
      //     delete info.gettingRecipe

      //     if(!furnaceBlock.isValid || !blastBlock.isValid || !smokerBlock.isValid || !furnaceInv.isValid || !blastInv.isValid || !smokerInv.isValid){
      //       for(let p = 0, pLen = players.length; p < pLen; p++){
      //         const player = players[p]
      //         if(player != undefined) apiWarn.notify(player, "bacs.warn.temporal_bottle:furnace.invalid_block", {sound: "warn.ender_addon_pack:break"})
      //       }
      //       return
      //     }

      //     const furnaceOutput = furnaceInv.getItem(2)?.typeId, blastOutput = blastInv.getItem(2)?.typeId, smokerOutput = smokerInv.getItem(2)?.typeId
      //     furnaceInv.clearAll(), blastInv.clearAll(), smokerInv.clearAll()
      //     furnaceBlock.setType("minecraft:bedrock"), blastBlock.setType("minecraft:bedrock"), smokerBlock.setType("minecraft:bedrock")

      //     world.tickingAreaManager.removeTickingArea(tickId)

      //     // Se haver um output ele será adicionado a lista de recipes validas para aquele tipo de bloco e na lista global
      //     // Caso contrario será colocado na lista de recipes invalidas com o prefixo do bloco
      //     this.registerNewRecipe("minecraft:furnace", input.typeId, furnaceOutput)
      //     this.registerNewRecipe("minecraft:blast_furnace", input.typeId, blastOutput)
      //     this.registerNewRecipe("minecraft:smoker", input.typeId, smokerOutput)
      //     block.dimension.playSound("warn.temporal_bottle:recipe_finished", block.center())
      //   }, 200)

      //   continue
      // }
    }

    // Desativa o loop se não tiver mais Suportes de Poções
    if(length == invalids){
      removeFromGlobalLoop("brewingStandAccelerate")
    }
  }

  transformDeliveryType(inventory: Container, potion: ItemPotionComponent, index: number, type: TThrownType): void {
    inventory.setItem(index, Potions.resolve(potion.potionEffectType, type))
  }

  private registerNewRecipe(blockId: string, input: string, output?: string): void {
    // const index = furnaceIndex[blockId]
    // if(index == undefined) return

    // if(output != undefined){
    //   furnaceRecipeList[input] = output
    //   furnaceHasRecipe[blockId]?.add(input)
    //   BACSFurnaceRecipeScore.setScore(`${input}/${output}`, 0)
    // } else {
    //   const id = `${index}/${input}`
    //   furnaceRecipeDenyList[id] = true
    //   BACSFurnaceRecipeDenyScore.setScore(id, 0)
    // }
  }
}

const transformDeliveryRequirements: Record<TThrownType, string> = {
  "ThrownSplash": "Consume",
  "ThrownLingering": "ThrownSplash"
}

type TThrownType = "ThrownSplash" | "ThrownLingering"

interface IIntervalInfo {
  entity: Entity
  block: Block
  inventory: Container
  multiplier: number
  progress: number
  maxProcess: number

  gettingRecipe?: Block
}