import { furnaceHasRecipe, furnaceRecipeList } from "../../lib/variables/recipes/furnaceRecipes"
import { Block, Container, Entity, ItemStack, Vector3 } from "@minecraft/server"
import { furnaceFuelList } from "../../lib/variables/recipes/fuelInfo"
import { furnaceFuelStoredAmount } from "../../lib/variables/cache"
import { apiItemAmount } from "../../lib/item/amount"
import { removeFromGlobalLoop } from "../globalLoop"

export const temporalBottleFuncFurnace = new class TemporalBottleFuncFurnace {
  private furnacesInfo: { [key: string]: IIntervalInfo } = {}

  add(entity: Entity, block: Block, inventory: Container, multiplier: number): void {
    const id = (block.x << 20) ^ (block.z << 10) ^ block.y
    this.furnacesInfo[id] = { entity, block, inventory, multiplier, fuelTime: 0, progress: 0 }
  }

  update(): void {
    const furnaces = Object.entries(this.furnacesInfo)
    const length = furnaces.length
    let invalids = 0

    for(let i = 0; i < length; i++){
      const [ key, info ] = furnaces[i] ?? []
      if(key == undefined || info == undefined) continue
      const { entity, block, inventory, multiplier, fuelTime, progress, gettingRecipe } = info

      // Remove a backpack da lista quando ela fica inválida
      if(!entity.isValid || !block.isValid || !inventory.isValid){
        invalids++
        delete this.furnacesInfo[key]
        continue
      }

      if(gettingRecipe != undefined) continue

      if(fuelTime > 0) info.fuelTime -= multiplier

      const input = inventory.getItem(0)
      if(input == undefined){
        if(progress > 0){
          info.progress = 0
        }
        continue
      }

      let output = inventory.getItem(2)

      // Se o output estiver cheio ele para de executar
      if(output && output.amount >= output.maxAmount) continue

      // Pega o item que será gerado ao fundir o input atual
      const expectedOutput = furnaceRecipeList[input.typeId]
      if(expectedOutput == undefined) continue

      if(output != undefined && expectedOutput != output.typeId){
        if(progress > 0){
          info.progress = 0
        }
        continue
      }

      // console.warn("Fuel:", fuelTime, "/ Progress:", progress)
      if(fuelTime <= 0){
        const fuel = inventory.getItem(1)
        if(fuel == undefined){
          if(progress > 0){
            info.progress -= multiplier
          }
          continue
        }

        const gettedFuelTime = furnaceFuelList[fuel.typeId]
        if(gettedFuelTime == undefined){
          if(progress > 0){
            info.progress -= multiplier
          }
          continue
        }

        if(fuel.amount -1 == 0){
          inventory.setItem(1, undefined)
        } else {
          fuel.amount--
          inventory.setItem(1, fuel)
        }
        info.fuelTime += gettedFuelTime *200 // 200 ticks = 10s tempo de assar 1 item na fornalha
      }

      console.warn(info.progress, "+", multiplier, "=", info.progress + multiplier)
      info.progress += multiplier
      // Gera o resultado
      while(info.progress >= 200){
        if(output == undefined){
          output = new ItemStack(expectedOutput)
        } else {
          output.amount++
        }
        inventory.setItem(2, output)

        // Decremetanta o input
        if(input.amount -1 == 0){
          inventory.setItem(0, undefined)
        } else {
          input.amount--
          inventory.setItem(0, input)
        }
        info.progress -= 200
        // info.fuelTime -= 175 // Não é a forma certa
      }
    }

    // Desativa o loop se não tiver mais fornalhas
    if(length == invalids){
      removeFromGlobalLoop("furnaceAccelerate")
    }

    // const blockInv = block.getComponent(BlockComponentTypes.Inventory)?.container
    // if(!blockInv) return

    // // Remove the fuel even without an item on the input slot
    // const currentFuel = furnaceFuelStoredAmount.get((block.x << 20) ^ (block.y << 10) ^ block.z) ?? 0
    // furnaceFuelStoredAmount.set((block.x << 20) ^ (block.y << 10) ^ block.z, currentFuel <= 1 ? 0 : currentFuel -1)

    // const inputSlot = blockInv.getItem(0)
    // if(!inputSlot) return

    // if(!(furnaceHasRecipe[block.typeId.replace("lit_", "")]?.has(inputSlot.typeId) ?? false)) return

    // const expectedOutput = furnaceRecipeList[inputSlot.typeId]
    // if(!expectedOutput) return

    // const output = blockInv.getItem(2)

    // let outputSlot: false | ItemStack | null = null
    // if(Array.isArray(expectedOutput)){
    //   for(const outputId of expectedOutput){
    //     if(ItemTypes.get(outputId) && (output?.typeId == outputId || output == undefined)){
    //       outputSlot = apiItemAmount.increase(output ?? outputId, 1)
    //       break
    //     }
    //   }
    // } else {
    //   // Cancels the execution if the current output isn't equal to the item that the current input would result in
    //   if(output?.typeId != expectedOutput && output != undefined) return
    //   if(ItemTypes.get(output?.typeId ?? expectedOutput)) outputSlot = apiItemAmount.increase(output ?? expectedOutput, 1)
    // }

    // if(!outputSlot) outputSlot = false
    // if(outputSlot == false) return

    // const newFuelAmount = this.consumeFuel(block, blockInv, blockInv.getItem(1))
    // if(newFuelAmount < 1) return

    // const itemInput = apiItemAmount.decrease(inputSlot, 1)

    // blockInv.setItem(0, itemInput)
    // blockInv.setItem(2, outputSlot)
  }

  private consumeFuel(pos: Vector3, blockInv: Container, invFuel: ItemStack | undefined): number {
    const id = (pos.x << 20) ^ (pos.y << 10) ^ pos.z
    let fuelStored = furnaceFuelStoredAmount.get(id) ?? 0

    if(fuelStored < 1 && invFuel){
      const fuelTime = furnaceFuelList[invFuel.typeId]
      if(!fuelTime) return fuelStored

      fuelStored += fuelTime
      furnaceFuelStoredAmount.set(id, fuelStored)

      const reducedItem = apiItemAmount.decrease(invFuel, 1)
      blockInv.setItem(1, reducedItem)
    }

    return fuelStored
  }
}

interface IIntervalInfo {
  entity: Entity
  block: Block
  inventory: Container
  multiplier: number
  fuelTime: number
  progress: number

  gettingRecipe?: Block
}