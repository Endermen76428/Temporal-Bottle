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
        console.warn("Fornalha");
    if (enabledFunctions.brewingStandAccelerate)
        console.warn("Suporte Poção");
    system.run(() => { loop(tick == 19 ? 0 : tick + 1); });
}
export function addToGlobalLoop(type, info) {
    const enabledType = enabledFunctions[type];
    if (enabledType == false)
        enabledFunctions[type] = true;
    if (enabledLoop == false) {
        enabledLoop = true;
        loop(0);
    }
}
export function removeFromGlobalLoop(type) {
    enabledFunctions[type] = false;
    enabledLoop = false;
}
