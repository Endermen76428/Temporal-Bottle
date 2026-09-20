import { temporalBottleFuncFurnace } from "./blocks/furnace"
import { system } from "@minecraft/server"

let enabledLoop = false
const enabledFunctions: IEnabledFunctions = {
  // Temporal Bottle
  furnaceAccelerate: false,
  brewingStandAccelerate: false
}

function loop(tick: number): void {
  // Cancela o loop global
  if(enabledLoop == false) return

  // console.warn("Tick:", tick)
  if(enabledFunctions.furnaceAccelerate) temporalBottleFuncFurnace.update()
  if(enabledFunctions.brewingStandAccelerate) console.warn("Suporte Poção")

  // Reinicia o Loop no proximo tick
  system.run(() => { loop(tick == 19 ? 0 : tick +1) })
}

export function addToGlobalLoop<T extends keyof IEnabledFunctions>(type: T): void {
  enabledFunctions[type] = true

  if(enabledLoop == false){
    enabledLoop = true
    loop(0)
  }
}

export function removeFromGlobalLoop<T extends keyof IEnabledFunctions>(type: T): void {
  enabledFunctions[type] = false

  const values = Object.values(enabledFunctions)
  let disable = true
  for(let i = 0, len = values.length; i < len; i++){
    if(values[i] == true){
      // Se qualquer uma das funções ainda estiver ativas ele vai manter o loop ligado
      disable = false
      break
    }
  }

  if(disable) enabledLoop = false
}

interface IEnabledFunctions {
  furnaceAccelerate: boolean
  brewingStandAccelerate: boolean
}