import { brewingStandInputOutput } from "../../variables/recipes/brewingStandRecipes";
import { ItemTypes } from "@minecraft/server";
export const registerTemporalBottleBrewingStandRecipe = new class RegisterTemporalBottleBrewingStandRecipe {
    tryRegister(item, rawInfo) {
        const errorMessage = `[§cTemporal Bottle§r] Error: Failed to register the brewing stand recipe in "${item}" item.`;
        const base = rawInfo["base"];
        const reagent = rawInfo["reagent"];
        const output = rawInfo["output"];
        if (typeof base != "string") {
            if (base == undefined) {
                console.warn(`${errorMessage} Missing "base" property`);
            }
            else {
                console.warn(`${errorMessage} Invalid value "${base}" on "base" property, expected type: String`);
            }
            return;
        }
        else if (ItemTypes.get(base) == undefined) {
            console.warn(`${errorMessage} Invalid base item ID "${base}", this item is not registered in any addon currently available in this world`);
            return;
        }
        if (typeof reagent != "string") {
            if (reagent == undefined) {
                console.warn(`${errorMessage} Missing "reagent" property`);
            }
            else {
                console.warn(`${errorMessage} Invalid value "${reagent}" on "reagent" property, expected type: String`);
            }
            return;
        }
        else if (ItemTypes.get(reagent) == undefined) {
            console.warn(`${errorMessage} Invalid reagent item ID "${reagent}", this item is not registered in any addon currently available in this world`);
            return;
        }
        if (typeof output != "string") {
            if (output == undefined) {
                console.warn(`${errorMessage} Missing "output" property`);
            }
            else {
                console.warn(`${errorMessage} Invalid value "${output}" on "output" property, expected type: String`);
            }
            return;
        }
        else if (ItemTypes.get(output) == undefined) {
            console.warn(`${errorMessage} Invalid output item ID "${output}", this item is not registered in any addon currently available in this world`);
            return;
        }
        this.register(base, reagent, output);
    }
    register(base, reagent, output) {
        const id = base + "/" + reagent;
        const hasRecipe = brewingStandInputOutput[id];
        if (hasRecipe)
            return;
        brewingStandInputOutput[id] = output;
    }
};
