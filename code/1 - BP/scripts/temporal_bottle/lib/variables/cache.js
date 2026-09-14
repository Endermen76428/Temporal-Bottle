import { registerTemporalBottleRecipe } from "../temporalBottle/register/registerHandler";
import { ItemStack, ItemTypes, system } from "@minecraft/server";
export const timeCostByUse = 30;
export const maxSpeedTier = 8;
export const cachePlayerBottleSlot = new Map();
export const furnaceFuelStoredAmount = new Map();
system.run(() => {
    for (const value of ItemTypes.getAll()) {
        if (value.id.startsWith("minecraft:"))
            continue;
        const item = new ItemStack(value);
        const allTags = item.getTags();
        if (allTags.length == 0)
            continue;
        const tags = allTags.filter(tag => tag.startsWith("bedrock_awakening:temporal_bottle"));
        for (const tag of tags) {
            registerTemporalBottleRecipe(item.typeId, tag.replace("bedrock_awakening:temporal_bottle:", "").replaceAll("'", "\""));
        }
    }
});
