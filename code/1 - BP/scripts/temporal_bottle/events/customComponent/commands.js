import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus as Status, EquipmentSlot, Player, system } from "@minecraft/server";
import { BACSCommandRecipes } from "../../../1-bacs/recipes/commands/manager";
import { temporalBottleItem } from "../../lib/temporalBottle/bottle";
import { apiEquippable } from "../../lib/player/equippable";
import { apiNumbers } from "../../../0-lib/math/numbers";
export const startUpCommandFunc = {
    "recipes": ({ sourceEntity: player }) => {
        if (!(player instanceof Player))
            return;
        system.run(() => { BACSCommandRecipes(player); });
        return { status: Status.Success };
    },
    "giveTime": ({ sourceEntity: player }, functionType, timeAmount) => {
        if (!player || !(player instanceof Player) || typeof functionType != "string" || typeof timeAmount != "number")
            return { status: Status.Failure };
        const item = apiEquippable.getItemSlot(player, EquipmentSlot.Mainhand);
        if (!item || item.typeId != "temporal_bottle:temporal_bottle")
            return { status: Status.Failure, message: "warn.temporal_bottle:custom_command.give_time.fail.invalid_item" };
        if (functionType == "set") {
            system.run(() => { temporalBottleItem.setTime(player, apiNumbers.clamp(timeAmount, 0, 2147483647), player.selectedSlotIndex); });
            return { status: Status.Success, message: "warn.temporal_bottle:custom_command.give_time.success.set" };
        }
        const currentTime = temporalBottleItem.getTime(player, player.selectedSlotIndex);
        system.run(() => { temporalBottleItem.setTime(player, apiNumbers.clamp(currentTime + timeAmount, 0, 2147483647), player.selectedSlotIndex); });
        return { status: Status.Success, message: "warn.temporal_bottle:custom_command.give_time.success.add" };
    }
};
export const startUpCommandHeader = {
    "recipes": {
        name: "temporal_bottle:bacsrecipes",
        description: "commands.bacs.recipes",
        cheatsRequired: false,
        permissionLevel: CommandPermissionLevel.Any
    },
    "giveTime": {
        name: "temporal_bottle:givetime",
        description: "commands.temporal_bottle.give_time",
        cheatsRequired: true,
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "temporal_bottle:function", type: CustomCommandParamType.Enum },
            { name: "temporal_bottle:time", type: CustomCommandParamType.Integer }
        ]
    }
};
