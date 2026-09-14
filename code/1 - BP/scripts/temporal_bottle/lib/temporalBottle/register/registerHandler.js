import { registerTemporalBottleBrewingStandRecipe } from "./brewingStand";
import { registerTemporalBottleFurnaceRecipe } from "./furnace";
import { registerTemporalBottleFuel } from "./fuel";
export function registerTemporalBottleRecipe(item, rawInfo) {
    let info;
    try {
        info = JSON.parse(rawInfo);
    }
    catch (e) {
        return console.warn(`[§cTemporal Bottle§r] Error: Failed to register the recipe in "${item}" item. Invalid JSON format on tag "bedrock_awakening:temporal_bottle:§l§4>>§r${rawInfo}§l§4<<§r"`);
    }
    if (!info["type"])
        return console.warn(`[§cTemporal Bottle§r] Error: Failed to register the recipe in "${item}" item. Missing "type" property`);
    const exe = registerIdenfierHandler[info["type"]];
    if (exe == undefined)
        return console.warn(`[§cTemporal Bottle§r] Error: Failed to register the recipe in "${item}" item. Unexpected value "${info["type"]}" on "type" property`);
    exe(item, info);
}
const registerIdenfierHandler = {
    "furnace"(item, info) { registerTemporalBottleFurnaceRecipe.tryRegister(item, info); },
    "potion"(item, info) { registerTemporalBottleBrewingStandRecipe.tryRegister(item, info); },
    "fuel"(item, info) { registerTemporalBottleFuel.tryRegister(item, info); },
};
