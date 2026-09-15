import { furnaceRecipeList } from "../../lib/variables/recipes/furnaceRecipes";
import { ItemStack } from "@minecraft/server";
import { furnaceFuelList } from "../../lib/variables/recipes/fuelInfo";
import { furnaceFuelStoredAmount } from "../../lib/variables/cache";
import { apiItemAmount } from "../../lib/item/amount";
import { removeFromGlobalLoop } from "../globalLoop";
export const temporalBottleFuncFurnace = new class TemporalBottleFuncFurnace {
    constructor() {
        this.furnacesInfo = {};
    }
    add(entity, block, inventory, multiplier) {
        const id = (block.x << 20) ^ (block.z << 10) ^ block.y;
        this.furnacesInfo[id] = { entity, block, inventory, multiplier, fuelTime: 0, progress: 0 };
    }
    update() {
        const furnaces = Object.entries(this.furnacesInfo);
        const length = furnaces.length;
        let invalids = 0;
        for (let i = 0; i < length; i++) {
            const [key, info] = furnaces[i] ?? [];
            if (key == undefined || info == undefined)
                continue;
            const { entity, block, inventory, multiplier, fuelTime, progress, gettingRecipe } = info;
            if (!entity.isValid || !block.isValid || !inventory.isValid) {
                invalids++;
                delete this.furnacesInfo[key];
                continue;
            }
            if (gettingRecipe != undefined)
                continue;
            if (fuelTime > 0)
                info.fuelTime -= multiplier;
            const input = inventory.getItem(0);
            if (input == undefined) {
                if (progress > 0) {
                    info.progress = 0;
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
            if (fuelTime <= 0) {
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
                if (fuel.amount - 1 == 0) {
                    inventory.setItem(1, undefined);
                }
                else {
                    fuel.amount--;
                    inventory.setItem(1, fuel);
                }
                info.fuelTime += gettedFuelTime * 200;
            }
            console.warn(info.progress, "+", multiplier, "=", info.progress + multiplier);
            info.progress += multiplier;
            while (info.progress >= 200) {
                if (output == undefined) {
                    output = new ItemStack(expectedOutput);
                }
                else {
                    output.amount++;
                }
                inventory.setItem(2, output);
                if (input.amount - 1 == 0) {
                    inventory.setItem(0, undefined);
                }
                else {
                    input.amount--;
                    inventory.setItem(0, input);
                }
                info.progress -= 200;
            }
        }
        if (length == invalids) {
            removeFromGlobalLoop("furnaceAccelerate");
        }
    }
    consumeFuel(pos, blockInv, invFuel) {
        const id = (pos.x << 20) ^ (pos.y << 10) ^ pos.z;
        let fuelStored = furnaceFuelStoredAmount.get(id) ?? 0;
        if (fuelStored < 1 && invFuel) {
            const fuelTime = furnaceFuelList[invFuel.typeId];
            if (!fuelTime)
                return fuelStored;
            fuelStored += fuelTime;
            furnaceFuelStoredAmount.set(id, fuelStored);
            const reducedItem = apiItemAmount.decrease(invFuel, 1);
            blockInv.setItem(1, reducedItem);
        }
        return fuelStored;
    }
};
