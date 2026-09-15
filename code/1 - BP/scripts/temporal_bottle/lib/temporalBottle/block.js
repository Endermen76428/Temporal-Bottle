import { system } from "@minecraft/server";
export const temporalBottleBlock = new class TemporalBottleBlock {
    getCurrentSpeed(block) {
        const entities = block.dimension.getEntitiesAtBlockLocation(block).filter(value => value.typeId == "temporal_bottle:temporal_zone");
        if (entities.length == 0)
            return;
        const entitiesTier = entities.map(value => {
            const tier = value.getProperty("temporal_bottle:tier");
            return { entity: value, tier: typeof tier != "number" ? 0 : tier };
        });
        const highTierIndex = this.getHighestTierIndex(entitiesTier);
        system.run(() => { entities.forEach((value, index) => index != highTierIndex && value.isValid && value.remove()); });
        return entitiesTier[highTierIndex];
    }
    getHighestTierIndex(entities) {
        let highestTier = 0;
        for (let i = 0; i < entities.length; i++) {
            if ((entities[i]?.tier ?? 0) > (entities[highestTier]?.tier ?? 0))
                highestTier = i;
        }
        return highestTier;
    }
};
export const blocksTimeList = {
    "minecraft:furnace": { type: "furnace", time: 10 },
    "minecraft:lit_furnace": { type: "furnace", time: 10 },
    "minecraft:blast_furnace": { type: "furnace", time: 5 },
    "minecraft:lit_blast_furnace": { type: "furnace", time: 5 },
    "minecraft:smoker": { type: "furnace", time: 5 },
    "minecraft:lit_smoker": { type: "furnace", time: 5 },
    "minecraft:brewing_stand": { type: "brewing_stand", time: 30 },
    "minecraft:hopper": { type: "hopper", time: 2.5 }
};
