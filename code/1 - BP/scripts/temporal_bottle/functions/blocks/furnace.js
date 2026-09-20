import { furnaceHasRecipe, furnaceRecipeDenyList, furnaceRecipeList } from "../../lib/blocks/furnace/recipes";
import { BACSFurnaceRecipeDenyScore, BACSFurnaceRecipeScore, coalItem } from "../../lib/variables";
import { BlockComponentTypes, ItemStack, system } from "@minecraft/server";
import { furnaceFuelList } from "../../lib/blocks/furnace/fuel";
import { removeFromGlobalLoop } from "../globalLoop";
import { apiNumbers } from "../../lib/math/numbers";
export const temporalBottleFuncFurnace = new class TemporalBottleFuncFurnace {
    constructor() {
        this.furnacesInfo = {};
    }
    add(entity, block, inventory, multiplier, maxProcess) {
        const id = (block.x << 20) ^ (block.z << 10) ^ block.y;
        const oldInfo = this.furnacesInfo[id];
        if (oldInfo != undefined) {
            oldInfo.multiplier = multiplier;
        }
        else {
            this.furnacesInfo[id] = { entity, block, inventory, multiplier, fuelTime: 0, progress: 0, maxProcess };
        }
    }
    update() {
        const furnaces = Object.entries(this.furnacesInfo);
        const length = furnaces.length;
        let invalids = 0;
        for (let i = 0; i < length; i++) {
            const [key, info] = furnaces[i] ?? [];
            if (key == undefined || info == undefined)
                continue;
            const { entity, block, inventory, multiplier, fuelTime, progress, maxProcess, gettingRecipe } = info;
            if (!entity.isValid || !block.isValid || !inventory.isValid) {
                invalids++;
                delete this.furnacesInfo[key];
                continue;
            }
            if (gettingRecipe != undefined)
                continue;
            const input = inventory.getItem(0);
            if (input == undefined) {
                if (progress > 0 || fuelTime > 0) {
                    info.progress = 0;
                    info.fuelTime -= apiNumbers.clamp(info.fuelTime - multiplier, 0, info.fuelTime);
                }
                continue;
            }
            let output = inventory.getItem(2);
            if (output && output.amount >= output.maxAmount)
                continue;
            const expectedOutput = furnaceRecipeList[input.typeId];
            if (expectedOutput == undefined) {
                if (furnaceRecipeDenyList[input.typeId] != undefined)
                    continue;
                const furnaceBlock = block.dimension.getBlock({ x: block.x, y: block.y + 2, z: block.z });
                if (furnaceBlock == undefined || !furnaceBlock.isValid)
                    continue;
                const blastBlock = furnaceBlock?.north();
                const smokerBlock = furnaceBlock?.south();
                if (blastBlock == undefined || !blastBlock.isValid)
                    continue;
                if (smokerBlock == undefined || !smokerBlock.isValid)
                    continue;
                info.gettingRecipe = furnaceBlock;
                furnaceBlock.setType("minecraft:furnace");
                blastBlock.setType("minecraft:blast_furnace");
                smokerBlock.setType("minecraft:smoker");
                const furnaceInv = furnaceBlock.getComponent(BlockComponentTypes.Inventory)?.container;
                const blastInv = blastBlock.getComponent(BlockComponentTypes.Inventory)?.container;
                const smokerInv = smokerBlock.getComponent(BlockComponentTypes.Inventory)?.container;
                if (furnaceInv == undefined || blastInv == undefined || smokerInv == undefined)
                    continue;
                const inputItem = new ItemStack(input.typeId);
                furnaceInv.setItem(0, inputItem), blastInv.setItem(0, inputItem), smokerInv.setItem(0, inputItem);
                furnaceInv.setItem(1, coalItem), blastInv.setItem(1, coalItem), smokerInv.setItem(1, coalItem);
                system.runTimeout(() => {
                    delete info.gettingRecipe;
                    if (!furnaceInv.isValid || !blastInv.isValid || !smokerInv.isValid)
                        return console.warn("Container Invalido");
                    const furnaceOutput = furnaceInv.getItem(2)?.typeId, blastOutput = blastInv.getItem(2)?.typeId, smokerOutput = smokerInv.getItem(2)?.typeId;
                    furnaceInv.clearAll(), blastInv.clearAll(), smokerInv.clearAll();
                    furnaceBlock.setType("minecraft:bedrock"), blastBlock.setType("minecraft:bedrock"), smokerBlock.setType("minecraft:bedrock");
                    this.registerNewRecipe("minecraft:furnace", input.typeId, furnaceOutput);
                    this.registerNewRecipe("minecraft:blast_furnace", input.typeId, blastOutput);
                    this.registerNewRecipe("minecraft:smoker", input.typeId, smokerOutput);
                }, 200);
                continue;
            }
            if (output != undefined && expectedOutput != output.typeId) {
                if (progress > 0) {
                    info.progress = 0;
                }
                continue;
            }
            const canSmelt = Math.min(output ? (output.maxAmount - output.amount) : 64, input.amount);
            const maxTicks = Math.min(canSmelt * maxProcess, multiplier);
            if ((fuelTime + progress) < maxTicks) {
                const fuel = inventory.getItem(1);
                if (fuel == undefined) {
                    if (progress > 0) {
                        info.progress -= multiplier;
                    }
                    continue;
                }
                const gettedFuelTime = furnaceFuelList[fuel.typeId];
                if (gettedFuelTime == undefined) {
                    if (progress > 0) {
                        info.progress -= multiplier;
                    }
                    continue;
                }
                const itemFuelTime = gettedFuelTime * maxProcess;
                const fuelNeeded = Math.min(fuel.amount, Math.ceil((maxTicks - fuelTime) / itemFuelTime));
                if (fuel.amount - fuelNeeded == 0) {
                    inventory.setItem(1, undefined);
                }
                else {
                    fuel.amount -= fuelNeeded;
                    inventory.setItem(1, fuel);
                }
                info.fuelTime += itemFuelTime * fuelNeeded;
            }
            const minConsume = Math.min(multiplier, info.fuelTime);
            const totalProgress = info.progress + minConsume;
            const amount = Math.min(canSmelt, Math.floor(totalProgress / maxProcess));
            info.progress = totalProgress - amount * maxProcess;
            info.fuelTime -= minConsume;
            if (amount <= 0)
                continue;
            if (output == undefined) {
                output = new ItemStack(expectedOutput, amount);
            }
            else {
                output.amount += amount;
            }
            inventory.setItem(2, output);
            if (input.amount - amount == 0) {
                inventory.setItem(0, undefined);
            }
            else {
                input.amount -= amount;
                inventory.setItem(0, input);
            }
        }
        if (length == invalids) {
            removeFromGlobalLoop("furnaceAccelerate");
        }
    }
    registerNewRecipe(blockId, input, output) {
        const index = furnaceIndex[blockId];
        if (index == undefined)
            return;
        if (output != undefined) {
            furnaceRecipeList[input] = output;
            furnaceHasRecipe["minecraft:smoker"]?.add(output);
            BACSFurnaceRecipeScore.setScore(`${input}/${output}`, 0);
        }
        else {
            const id = `${index}/${input}`;
            furnaceRecipeDenyList[id] = true;
            BACSFurnaceRecipeDenyScore.setScore(id, 0);
        }
    }
};
const furnaceIndex = {
    "minecraft:furnace": 0,
    "minecraft:blast_furnace": 1,
    "minecraft:smoker": 2
};
