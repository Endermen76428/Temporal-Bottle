# Bedrock Awakening Compatibility System (BACS)
Hello AddonMaker in this documentation we'll see how create a compatibility with the Temporal Bottle Addon.

The BACS allow you to register some infos using **Item Tag** or **ScriptEvent** (we recommend using ScriptEvent)

Remember, at the momente only have 3 compatibility:
- [Vanilla Furnace](https://github.com/Endermen76428/Temporal-Bottle/blob/main/template/Documentation.md#vanilla-furnace)
- [Fuel](https://github.com/Endermen76428/Temporal-Bottle/blob/main/template/Documentation#Fuel)
- [Brewing Stand](https://github.com/Endermen76428/Temporal-Bottle/blob/main/template/Documentation#Brewing-Stand)

# Vanilla Furnace

### ScriptEvent:
```js
import { world, system } from "@minecraft/server"

system.run(() => {
  system.sendScriptEvent("bedrock_awakening:temporal_bottle/register", `{"type":"furnace","block":"minecraft:furnace","input":"template:steel_nugget","output":"template:steel_dust"}`)
  system.sendScriptEvent("bedrock_awakening:temporal_bottle/register", `{"type":"furnace","block":"minecraft:blast_furnace","input":"template:steel_nugget","output":"template:steel_dust"}`)
})
```

# Fuel

### ScriptEvent:
```js
import { world, system } from "@minecraft/server"

system.run(() => {
  system.sendScriptEvent("bedrock_awakening:temporal_bottle/register", `{"type":"fuel","item":"template:compressed_coal","amount":40}`)
})
```

# Brewing Stand

### ScriptEvent:
```js
import { world, system } from "@minecraft/server"

system.run(() => {
  system.sendScriptEvent("bedrock_awakening:temporal_bottle/register", `{"type":"potion","base":"minecraft:potion","reagent":"minecraft:iron_ingot","output":"template:iron_potion"}`)
})
```