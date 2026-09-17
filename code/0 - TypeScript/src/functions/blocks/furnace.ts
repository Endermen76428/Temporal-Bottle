import { furnaceHasRecipe, furnaceRecipeList } from "../../lib/variables/recipes/furnaceRecipes"
import { Block, Container, Entity, ItemStack } from "@minecraft/server"
import { furnaceFuelList } from "../../lib/variables/recipes/fuelInfo"
import { removeFromGlobalLoop } from "../globalLoop"
import { apiNumbers } from "../../lib/math/numbers"

// let time = 0
// let time2 = 0

export const temporalBottleFuncFurnace = new class TemporalBottleFuncFurnace {
  private furnacesInfo: { [key: string]: IIntervalInfo } = {}

  add(entity: Entity, block: Block, inventory: Container, multiplier: number, maxProcess: number): void {
    const id = (block.x << 20) ^ (block.z << 10) ^ block.y
    this.furnacesInfo[id] = { entity, block, inventory, multiplier, fuelTime: 0, progress: 0, maxProcess }
  }

  update(): void {
    const furnaces = Object.entries(this.furnacesInfo)
    const length = furnaces.length
    let invalids = 0

    for(let i = 0; i < length; i++){
      const [ key, info ] = furnaces[i] ?? []
      if(key == undefined || info == undefined) continue
      const { entity, block, inventory, multiplier, fuelTime, progress, maxProcess, gettingRecipe } = info

      // Remove a backpack da lista quando ela fica inválida
      if(!entity.isValid || !block.isValid || !inventory.isValid){
        invalids++
        delete this.furnacesInfo[key]
        continue
      }

      if(gettingRecipe != undefined) continue

      const input = inventory.getItem(0)
      if(input == undefined){
        if(progress > 0 || fuelTime > 0){
          info.progress = 0
          info.fuelTime -= apiNumbers.clamp(info.fuelTime - multiplier, 0, info.fuelTime) // console.warn("Tem que ver um jeito melhor, talvez fazer as const ali em cima virarem let e trabalhar com elas e o info. fica só pra execuções do proximo tick e não desse atual, acho que fica melhor")
        }
        // if(time2 == 0){
        //   console.warn((Date.now() - time) / 1000, "segundos")
        //   time2 = 1
        //   time = 0
        // }
        continue
      }

      let output = inventory.getItem(2)

      // Se o output estiver cheio ele para de executar
      if(output && output.amount >= output.maxAmount) continue

      // Pega o item que será gerado ao fundir o input atual
      const expectedOutput = furnaceRecipeList[input.typeId]
      if(expectedOutput == undefined) continue

      // Para de executar se ele for um output diferente do esperado
      if(output != undefined && expectedOutput != output.typeId){
        if(progress > 0){
          info.progress = 0
        }
        continue
      }

      // Pega a quantia minima de itens que podem ser fundidos tanto pela quantia no input quanto a quantia restante no output
      const canSmelt = Math.min(output ? (output.maxAmount - output.amount) : 64, input.amount)
      const maxTicks = Math.min(canSmelt * maxProcess, multiplier)

      // console.warn("Min: (", fuelTime, "+", progress, ") <", maxTicks, "=", (fuelTime + progress) < maxTicks, "/// (", canSmelt, ":", canSmelt * maxProcess, ") |", multiplier)
      if((fuelTime + progress) < maxTicks){
        const fuel = inventory.getItem(1)
        if(fuel == undefined){
          if(progress > 0){
            info.progress -= multiplier
          }
          continue
        }
        // else {
        //   if(time == 0){
        //     time = Date.now()
        //     time2 = 0
        //   }
        // }

        const gettedFuelTime = furnaceFuelList[fuel.typeId]
        if(gettedFuelTime == undefined){
          if(progress > 0){
            info.progress -= multiplier
          }
          continue
        }

        const itemFuelTime = gettedFuelTime * maxProcess
        // Pega a quantia de combustiveis necessarios para poder executar novamente caso não tenha pega tudo que resta
        const fuelNeeded = Math.min(fuel.amount, Math.ceil((maxTicks - fuelTime) / itemFuelTime))
        // console.warn("( (", maxTicks, "-", fuelTime, ") /", itemFuelTime, ") =", Math.ceil((maxTicks - fuelTime) / itemFuelTime), "ou", fuel.amount, "=", fuelNeeded, "items =>", itemFuelTime * fuelNeeded, "ticks => Current:", fuelTime + itemFuelTime * fuelNeeded)

        if(fuel.amount - fuelNeeded == 0){
          inventory.setItem(1, undefined)
        } else {
          fuel.amount -= fuelNeeded
          inventory.setItem(1, fuel)
        }
        info.fuelTime += itemFuelTime * fuelNeeded // 200 ticks = 10s tempo de assar 1 item na fornalha normal / 100 se for no smoker ou blast
      }

      const minConsume = Math.min(multiplier, info.fuelTime)
      const totalProgress = info.progress + minConsume
      // Pega o minino entre execuções possiveis por quantiade de itens e pela quantia que deveria ser fundida
      const amount = Math.min(canSmelt, Math.floor(totalProgress / maxProcess))
      // console.warn("Gerado:", info.progress, "+", minConsume, "=", totalProgress, "/", maxProcess, "=", amount, "| Sobra P:", totalProgress - amount * maxProcess, "F:", info.fuelTime - minConsume, "/ Consume:", minConsume, "/ Progress:", amount * maxProcess)
      info.progress = totalProgress - amount * maxProcess
      info.fuelTime -= minConsume

      if(amount <= 0) continue

      if(output == undefined){
        output = new ItemStack(expectedOutput, amount)
      } else {
        output.amount += amount
      }
      inventory.setItem(2, output)

      if(input.amount - amount == 0){
        inventory.setItem(0, undefined)
      } else {
        input.amount -= amount
        inventory.setItem(0, input)
      }
    }

    // Desativa o loop se não tiver mais fornalhas
    if(length == invalids){
      removeFromGlobalLoop("furnaceAccelerate")
    }
  }
}

interface IIntervalInfo {
  entity: Entity
  block: Block
  inventory: Container
  multiplier: number
  fuelTime: number
  progress: number
  maxProcess: number

  gettingRecipe?: Block
}