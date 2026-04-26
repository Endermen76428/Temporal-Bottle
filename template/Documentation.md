# Bedrock Awakening Compatibility System (BACS)
Hello AddonMaker in this documentation we'll see how create a compatibility with the **Temporal Bottle Addon**.

Remember, at the momente only have 3 compatibility:
- [Vanilla Furnace](https://github.com/Endermen76428/Temporal-Bottle/blob/main/template/Documentation.md#vanilla-furnace)
- [Fuel](https://github.com/Endermen76428/Temporal-Bottle/blob/main/template/Documentation.md#fuel)
- [Brewing Stand](https://github.com/Endermen76428/Temporal-Bottle/blob/main/template/Documentation.md#brewing-stand)

# Introduction
The BACS is system based on **Blocks/Items Tags** and **ScriptEvent** to share information between addons to allow we create a native compatibility with other addons.

The **Temporal Bottle** use a JSON format to register info, so we recommend using ScriptEvent to register because it's easier for most people.
Both registration methods are similar. Each one of the 3 compatibility has its own properties, but **always** need to contain the "Type" property
to indicate what type of record you are making.

- For Tags you need to use the prefix "**bedrock_awakening:temporal_bottle:**" and after the colon you write the JSON, but instead of use **Quotation Marks** you need to use **Single Quotation Marks** (Exemple: ```"bedrock_awakening:temporal_bottle:{'type':'furnace'}"```).
- For ScriptEvent you need to use the prefix "**bedrock_awakening:temporal_bottle/register**" and on the second argument of the function sendScriptEvent you write the JSON normaly (Exemple: ```sendScriptEvent("bedrock_awakening:temporal_bottle/register", `{"type":"furnace"}`)```)

# Vanilla Furnace
The furnace register type is "**furnace**".
Other properties that you need to specify:
- **block:** Which furnace your recipe can works, accepted values: "minecraft:furnace" | "minecraft:blast_furnace" | "minecraft:smoker"
- **input:** Item Id that you put on the input slot to smelt, like "minecraft:raw_iron" | "template:steel_dust"
- **ouput:** Item Id that the input will transform into inside the furnace, like "minecraft:iron_ingot" | "template:steel_nugget"

### Recipe Reference
```json
{
  "format_version": "1.12",
  "minecraft:recipe_furnace": {
    "description": { "identifier": "template:steel_nugget_from_dust" },  
    "tags": [ "furnace", "blast_furnace" ],
    "input": "template:steel_dust",
    "output": "template:steel_nugget"
  }
}
```

### Tag:
```json
{
  "format_version": "1.21.100",
  "minecraft:item": {
    "description": {
      "identifier": "template:steel_dust",
      "menu_category": { "category": "items" }
    },
    "components": {
      "minecraft:tags": { "tags": [
        "bedrock_awakening:temporal_bottle:{'type':'furnace','block':'minecraft:furnace','input':'template:steel_dust','output':'template:steel_nugget'}",
        "bedrock_awakening:temporal_bottle:{'type':'furnace','block':'minecraft:blast_furnace','input':'template:steel_dust','output':'template:steel_nugget'}"
      ] },
      "minecraft:icon": "template:steel_dust"
    }
  }
}
```

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