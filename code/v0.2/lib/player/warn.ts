import { world, system, Player, MolangVariableMap, RawMessage, Vector3 } from "@minecraft/server"

export const apiWarn = new class apiWarn {
  notify(player: Player, message: Message, options?: NotifyOptions): void {
    const type = options && options.type ? options.type : "chat"
    const execute = notifyTypes[type]
    if(execute && message) execute(player, message)
    system.runTimeout(() => {
      if(options?.sound) player.playSound(options.sound, {volume: options.volume})
    }, options?.delaySound)
    system.runTimeout(() => {
      if(options?.particle){
        const dimension = options.particle.dimension ? world.getDimension(options.particle.dimension) : player.dimension
        try{ dimension.spawnParticle(options.particle.id, options.particle.pos, options.particle.map) } catch {}
      }
    }, options?.delayParticle)
  }
}

const notifyTypes = new class notifyTypes {
  [key: string]: (player: Player, message: Message) => void

  "chat"(player: Player, message: Message): void { player.sendMessage(typeof message == "string" ? {translate: message} : message) }

  "action_bar"(player: Player, message: Message): void { player.onScreenDisplay.setActionBar(typeof message == "string" ? {translate: message} : message) }

  "title"(player: Player, message: Message): void { player.onScreenDisplay.setTitle(typeof message == "string" ? {translate: message} : message) }
}

type Message = string | RawMessage

interface NotifyOptions {
  type?: "chat" | "action_bar" | "title"
  sound?: string
  volume?: number
  delaySound?: number
  particle?: { id: string, pos: Vector3, dimension?: string, map?: MolangVariableMap }
  delayParticle?: number
}