import { Block, system } from "@minecraft/server"

let enabledLoop = false
const enabledFunctions: IEnabledFunctions = {
  // Temporal Bottle
  furnaceAccelerate: false,
  brewingStandAccelerate: false
}

function loop(tick: number): void {
  // Cancela o loop global
  if(enabledLoop == false) return

  if(enabledFunctions.furnaceAccelerate) console.warn("Fornalha")
  if(enabledFunctions.brewingStandAccelerate) console.warn("Suporte Poção")

  // Reinicia o Loop no proximo tick
  system.run(() => { loop(tick == 19 ? 0 : tick +1) })
}

export function addToGlobalLoop<T extends keyof IEnabledFunctions>(type: T, info: IEnabledFunctionsInfo[T]): void {
  const enabledType = enabledFunctions[type]
  if(enabledType == false) enabledFunctions[type] = true

  if(enabledLoop == false){
    enabledLoop = true
    loop(0)
  }
}

export function removeFromGlobalLoop<T extends keyof IEnabledFunctions>(type: T): void {
  enabledFunctions[type] = false
  enabledLoop = false
}

interface IEnabledFunctions {
  furnaceAccelerate: boolean
  brewingStandAccelerate: boolean
}

interface IEnabledFunctionsInfo {
  furnaceAccelerate: {
    block: Block
  }

  brewingStandAccelerate: {
    test: string
  }
}