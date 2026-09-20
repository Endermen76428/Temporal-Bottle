import { EntityComponentTypes, ItemStack } from "@minecraft/server";
export const apiInventory = new class apiInventory {
    addItem(entity, itemId, amount = 1) {
        const inventory = entity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!inventory)
            return;
        inventory.addItem(itemId instanceof ItemStack ? itemId : new ItemStack(itemId, amount));
    }
    setItem(entity, item, slot) {
        const inventory = entity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!inventory)
            return;
        if (slot > inventory.size)
            return;
        inventory.setItem(slot, item);
    }
    getItem(entity, itemId) {
        const inventory = entity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!inventory)
            return;
        for (let slot = 0; slot < inventory.size; slot++) {
            const item = inventory.getItem(slot);
            if (item == undefined)
                continue;
            if (itemId == undefined)
                return { item, slot };
            if (item.typeId == itemId)
                return { item, slot };
        }
        return;
    }
    getItemSlot(entity, slot) {
        const inventory = entity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!inventory)
            return;
        return inventory.getItem(slot);
    }
};
