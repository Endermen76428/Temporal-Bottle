# Bedrock Awakening Compatibility System (BACS)
Hello AddonMaker in this documentation we'll see how create a compatibility with the **Temporal Bottle Addon**.

Remember, at the momente only have 3 compatibility:
- [Vanilla Furnace](https://github.com/Endermen76428/Temporal-Bottle/blob/main/template/Documentation.md#vanilla-furnace)
- [Fuel](https://github.com/Endermen76428/Temporal-Bottle/blob/main/template/Documentation#fuel)
- [Brewing Stand](https://github.com/Endermen76428/Temporal-Bottle/blob/main/template/Documentation#brewing-stand)

# Introduction
The BACS is system based on **Blocks/Items Tags** and **ScriptEvent** to share information between addons to allow we create a native compatibility with other addons.

The **Temporal Bottle** use a JSON format to register info, so we recommend using ScriptEvent to register because it's easier for most people.
Both registration methods are similar, and the JSON should **always** contain the "Type" property.

- For Tags you need to use the prefix "**bedrock_awakening:temporal_bottle:**" and after the colon you write the JSON, but instead of use **Quotation Marks** you need to use **Single Quotation Marks** (Exemple: "__bedrock_awakening:temporal_bottle:{'type':'furnace'}__").
- For ScriptEvent you need to use the prefix "**bedrock_awakening:temporal_bottle/register**" and on the second argument of the function sendScriptEvent you write the JSON normaly (Exemple: ```sendScriptEvent("bedrock_awakening:temporal_bottle/register", `{"type":"furnace"}`)```")

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