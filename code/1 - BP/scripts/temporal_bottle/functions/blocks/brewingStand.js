import { ItemComponentTypes, ItemStack, Potions } from "@minecraft/server";
import { brewingStandRecipeList } from "../../../1-bacs/recipes/brewingStand/recipes";
import { removeFromGlobalLoop } from "../globalLoop";
export const temporalBottleFuncBrewingStand = new class TemporalBottleFuncBrewingStand {
    constructor() {
        this.brewingStandsInfo = {};
    }
    add(entity, block, inventory, multiplier, maxProcess) {
        const id = (block.x << 20) ^ (block.z << 10) ^ block.y;
        const oldInfo = this.brewingStandsInfo[id];
        if (oldInfo != undefined) {
            oldInfo.multiplier = multiplier;
        }
        else {
            this.brewingStandsInfo[id] = { entity, block, inventory, multiplier, progress: 0, maxProcess };
        }
    }
    update() {
        const brewingStands = Object.entries(this.brewingStandsInfo);
        const length = brewingStands.length;
        let invalids = 0;
        for (let i = 0; i < length; i++) {
            const [key, info] = brewingStands[i] ?? [];
            if (key == undefined || info == undefined)
                continue;
            const { entity, block, inventory, multiplier, progress, maxProcess, gettingRecipe } = info;
            if (!entity.isValid || !block.isValid || !inventory.isValid) {
                invalids++;
                delete this.brewingStandsInfo[key];
                continue;
            }
            if (gettingRecipe != undefined)
                continue;
            const input = inventory.getItem(0);
            if (input == undefined) {
                info.progress = 0;
                continue;
            }
            const thrownType = input.typeId == "minecraft:gunpowder" ? "ThrownSplash" : input.typeId == "minecraft:dragon_breath" ? "ThrownLingering" : undefined;
            let hasValidPotion = false;
            for (let i = 0; i < 3; i++) {
                const slotBase = inventory.getItem(i + 1);
                if (slotBase == undefined)
                    continue;
                const addonRecipeId = brewingStandRecipeList[slotBase?.typeId + "/" + input.typeId];
                const base = slotBase?.getComponent(ItemComponentTypes.Potion);
                const vanillaRecipeId = brewingStandRecipeList[base?.potionEffectType.id + "/" + input.typeId];
                if (addonRecipeId != undefined || (base && thrownType && base.potionDeliveryType.id == transformDeliveryRequirements[thrownType]) || vanillaRecipeId != undefined) {
                    hasValidPotion = true;
                    break;
                }
            }
            if (hasValidPotion)
                info.progress += multiplier;
            if (progress >= maxProcess) {
                info.progress -= maxProcess;
                let transformed = false;
                for (let i = 0; i < 3; i++) {
                    const slotBase = inventory.getItem(i + 1);
                    if (slotBase == undefined)
                        continue;
                    const addonRecipeId = brewingStandRecipeList[slotBase?.typeId + "/" + input.typeId];
                    if (addonRecipeId != undefined) {
                        inventory.setItem(i + 1, new ItemStack(addonRecipeId));
                        transformed = true;
                        continue;
                    }
                    const base = slotBase?.getComponent(ItemComponentTypes.Potion);
                    if (!base)
                        continue;
                    if (thrownType && base.potionDeliveryType.id == transformDeliveryRequirements[thrownType]) {
                        this.transformDeliveryType(inventory, base, i + 1, thrownType);
                        transformed = true;
                        continue;
                    }
                    const vanillaRecipeId = brewingStandRecipeList[base?.potionEffectType.id + "/" + input.typeId];
                    if (vanillaRecipeId != undefined) {
                        inventory.setItem(i + 1, Potions.resolve(vanillaRecipeId, base.potionDeliveryType));
                        transformed = true;
                    }
                }
                if (transformed) {
                    block.dimension.playSound("random.potion.brewed", block.center());
                    if (input.amount < 2) {
                        inventory.setItem(0, undefined);
                    }
                    else {
                        input.amount--;
                        inventory.setItem(0, input);
                    }
                }
            }
        }
        if (length == invalids) {
            removeFromGlobalLoop("brewingStandAccelerate");
        }
    }
    transformDeliveryType(inventory, potion, index, type) {
        inventory.setItem(index, Potions.resolve(potion.potionEffectType, type));
    }
    registerNewRecipe(blockId, input, output) {
    }
};
const transformDeliveryRequirements = {
    "ThrownSplash": "Consume",
    "ThrownLingering": "ThrownSplash"
};
