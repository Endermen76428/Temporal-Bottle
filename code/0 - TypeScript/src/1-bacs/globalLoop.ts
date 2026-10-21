// import { BACSLoopFunctions } from "./loopList"
import { system } from "@minecraft/server"

let enabledLoop = false
const enabledFunctions: { [key: string]: () => void } = {}

function loop(tick: number): void {
  // Cancela o loop global
  if(enabledLoop == false) return

  // Executa as updates dos loops
  const updateFunctions = Object.values(enabledFunctions)
  for(let i = 0, len = updateFunctions.length; i < len; i++){
    const exe = updateFunctions[i]
    exe && exe()
  }

  // Reinicia o Loop no proximo tick
  system.run(() => { loop(tick == 19 ? 0 : tick +1) })
}

export function addToGlobalLoop(type: string): void {
  const loopExe = BACSLoopFunctions[type]
  if(loopExe == undefined) return

  enabledFunctions[type] = loopExe

  if(enabledLoop == false){
    enabledLoop = true
    loop(0)
  }
}

export function removeFromGlobalLoop(type: string): void {
  delete enabledFunctions[type]

  // Se não existir mais nenhum um loop ativo ele desativa o loop global
  if(Object.keys(enabledFunctions).length < 1) enabledLoop = false
}

// A inicialização das funções é feita dentro do arquivo do proprio loop, pois o minecraft pode tentar inicializar esse arquivo de loop global antes dos arquivos de funções gerando erros
export const BACSLoopFunctions: { [key: string]: () => void } = {}