import { furnaceHasRecipe, furnaceRecipeList } from "../../variables/recipes/furnaceRecipes";
import { ItemTypes } from "@minecraft/server";
export const registerTemporalBottleFurnaceRecipe = new class RegisterTemporalBottleFurnaceRecipe {
    tryRegister(item, rawInfo) {
        const errorMessage = `[§cTemporal Bottle§r] Error: Failed to register the furnace recipe in "${item}" item.`;
        const blockType = rawInfo["block"];
        const input = rawInfo["input"];
        const output = rawInfo["output"];
        if (typeof blockType != "string") {
            if (blockType == undefined) {
                console.warn(`${errorMessage} Missing "block" property`);
            }
            return;
        }
        else if (!furnaceHasRecipe[blockType]) {
            console.warn(`${errorMessage} Invalid value "${blockType}" on "block" property, expected value: §l"minecraft:furnace", "minecraft:blast_furnace" or "minecraft:smoker"§r`);
        }
        if (typeof input != "string") {
            if (input == undefined) {
                console.warn(`${errorMessage} Missing "input" property`);
            }
            else {
                console.warn(`${errorMessage} Invalid value "${input}" on "input" property, expected type: String`);
            }
            return;
        }
        else if (ItemTypes.get(input) == undefined) {
            console.warn(`${errorMessage} Invalid input item ID "${input}", this item is not registered in any addon currently available in this world`);
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
        this.register(blockType, input, output);
    }
    register(blockType, input, output) {
        const hasRecipe = furnaceHasRecipe[blockType];
        if (!hasRecipe)
            return;
        hasRecipe.add(input);
        const recipe = furnaceRecipeList[input];
        if (!recipe) {
            furnaceRecipeList[input] = output;
            return;
        }
        if (recipe == output)
            return;
        if (typeof recipe == "string") {
            furnaceRecipeList[input] = [recipe, output];
            return;
        }
        if (!recipe.includes(output))
            return;
        recipe.push(output);
        furnaceRecipeList[input] = recipe;
    }
};
