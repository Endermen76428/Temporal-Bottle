import { temporalBottleEntity } from "../lib/temporalBottle/entity";
import { system } from "@minecraft/server";
system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity, sourceBlock }) => {
    const execute = scriptEventManager[id];
    if (execute)
        execute(message, sourceEntity, sourceBlock);
}, { namespaces: ["temporal_bottle"] });
const scriptEventManager = {
    "temporal_bottle:start_acceleration": (message, sourceE) => {
        if (!sourceE || !sourceE.isValid)
            return;
        temporalBottleEntity.createInterval(sourceE);
    }
};
