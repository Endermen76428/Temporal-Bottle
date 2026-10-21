import { system } from "@minecraft/server";
let enabledLoop = false;
const enabledFunctions = {};
function loop(tick) {
    if (enabledLoop == false)
        return;
    const updateFunctions = Object.values(enabledFunctions);
    for (let i = 0, len = updateFunctions.length; i < len; i++) {
        const exe = updateFunctions[i];
        exe && exe();
    }
    system.run(() => { loop(tick == 19 ? 0 : tick + 1); });
}
export function addToGlobalLoop(type) {
    const loopExe = BACSLoopFunctions[type];
    if (loopExe == undefined)
        return;
    enabledFunctions[type] = loopExe;
    if (enabledLoop == false) {
        enabledLoop = true;
        loop(0);
    }
}
export function removeFromGlobalLoop(type) {
    delete enabledFunctions[type];
    if (Object.keys(enabledFunctions).length < 1)
        enabledLoop = false;
}
export const BACSLoopFunctions = {};
