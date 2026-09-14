import { EquipmentSlot, EntityComponentTypes } from "@minecraft/server";
export const apiEquippable = new class apiEquippable {
    getItem(entity, ids) {
        const equippable = entity.getComponent(EntityComponentTypes.Equippable);
        if (!equippable)
            return;
        for (const slot of Object.values(EquipmentSlot)) {
            const item = equippable.getEquipment(slot);
            if (!item)
                continue;
            if (!ids)
                return { item: item, slot: slot };
            if (ids.includes(item.typeId))
                return { item: item, slot: slot };
        }
        return;
    }
    getItems(entity, ids) {
        const equippable = entity.getComponent(EntityComponentTypes.Equippable);
        if (!equippable)
            return;
        const items = [];
        for (const slot of Object.values(EquipmentSlot)) {
            const item = equippable.getEquipment(slot);
            if (!item)
                continue;
            if (!ids) {
                items.push({ item: item, slot: slot });
                continue;
            }
            if (ids.includes(item.typeId))
                items.push({ item: item, slot: slot });
        }
        if (items.length == 0)
            return;
        return items;
    }
    getItemSlot(entity, slot) {
        const equippable = entity.getComponent(EntityComponentTypes.Equippable);
        if (!equippable)
            return;
        return equippable.getEquipment(slot);
    }
    setItem(entity, item, slot) {
        const equippable = entity.getComponent(EntityComponentTypes.Equippable);
        if (!equippable)
            return;
        equippable.setEquipment(slot, item);
    }
};
