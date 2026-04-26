import { startUpCommandFunc, startUpCommandHeader } from "./commands"
import { world, system } from "@minecraft/server"

system.beforeEvents.startup.subscribe(({customCommandRegistry: customC}) => {
  customC.registerEnum("temporal_bottle:function", ["add", "set"])
  customC.registerCommand(startUpCommandHeader.giveTime, startUpCommandFunc.giveTime)
})