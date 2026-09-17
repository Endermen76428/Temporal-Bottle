import { furnaceRecipeList } from "../../lib/variables/recipes/furnaceRecipes";
import { ItemStack } from "@minecraft/server";
import { furnaceFuelList } from "../../lib/variables/recipes/fuelInfo";
import { removeFromGlobalLoop } from "../globalLoop";
import { apiNumbers } from "../../lib/math/numbers";
export const temporalBottleFuncFurnace = new class TemporalBottleFuncFurnace {
    constructor() {
        this.furnacesInfo = {};
    }
    add(entity, block, inventory, multiplier, maxProcess) {
        const id = (block.x << 20) ^ (block.z << 10) ^ block.y;
        this.furnacesInfo[id] = { entity, block, inventory, multiplier, fuelTime: 0, progress: 0, maxProcess };
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
            if (expectedOutput == undefined)
                continue;
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
};
