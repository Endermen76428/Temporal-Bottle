import { system } from "@minecraft/server";
import { temporalZone } from "../functions/temporalZone";
system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity, sourceBlock }) => {
    const execute = scriptEventManager[id];
    if (execute)
        execute(message, sourceEntity, sourceBlock);
}, { namespaces: ["temporal_bottle"] });
const scriptEventManager = {
    "temporal_bottle:start_acceleration": (message, sourceE) => {
        if (!sourceE || !sourceE.isValid)
            return;
        temporalZone.create(sourceE);
    }
};
