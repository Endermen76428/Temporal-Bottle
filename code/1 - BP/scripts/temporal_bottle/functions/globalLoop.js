import { temporalBottleFuncFurnace } from "./blocks/furnace";
import { system } from "@minecraft/server";
let enabledLoop = false;
const enabledFunctions = {
    furnaceAccelerate: false,
    brewingStandAccelerate: false
};
function loop(tick) {
    if (enabledLoop == false)
        return;
    if (enabledFunctions.furnaceAccelerate)
        temporalBottleFuncFurnace.update();
    if (enabledFunctions.brewingStandAccelerate)
        console.warn("Suporte Poção");
    system.run(() => { loop(tick == 19 ? 0 : tick + 1); });
}
export function addToGlobalLoop(type) {
    enabledFunctions[type] = true;
    if (enabledLoop == false) {
        enabledLoop = true;
        loop(0);
    }
}
export function removeFromGlobalLoop(type) {
    enabledFunctions[type] = false;
    const values = Object.values(enabledFunctions);
    let disable = true;
    for (let i = 0, len = values.length; i < len; i++) {
        if (values[i] == true) {
            disable = false;
            break;
        }
    }
    if (disable)
        enabledLoop = false;
}
