# Bedrock Awakening Compatibility System (BACS)
Hello AddonMaker in this documentation we'll see how create a compatibility with the **Temporal Bottle Addon**.
If you need any help, send me a message on Discord [@Endermen76428](https://discordapp.com/users/760855617383432262)

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
The Furnace register type is "**furnace**".
Furnace register properties:
- **block:** Which furnace your recipe can works, accepted values: **"minecraft:furnace" | "minecraft:blast_furnace" | "minecraft:smoker"**
- **input:** Item Id that you put on the input slot to smelt, like **"minecraft:raw_iron" | "template:steel_dust"**
- **ouput:** Item Id that the input will transform into inside the furnace, like **"minecraft:iron_ingot" | "template:steel_nugget"**

### Recipe Reference:
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
The Fuel register type is "**fuel**".
Fuel register properties:
- **item:** Item Id that you put on the fuel slot burn, like **"template:coal_dust" | "template:compressed_coal"** (Use only for custom items)
- **amount:** Quantity of items that this fuel can smelt, like **1 | 1.5 | 2 | 10 | 999** (It's the value of component "minecraft:fuel" divide by 10)

### Item Tag:
```json
{
  "format_version": "1.21.100",
  "minecraft:item": {
    "description": {
      "identifier": "template:coal_dust",
      "menu_category": { "category": "items" }
    },
    "components": {
      "minecraft:tags": { "tags": [
        "bedrock_awakening:temporal_bottle:{'type':'fuel','item':'template:coal_dust','amount':4}" // The value of "minecraft:fuel" divided by 10
      ] },
      "minecraft:icon": "template:coal_dust",
      "minecraft:fuel": { "duration": 40 }
    }
  }
}
```

### Block Tag:
To register the fuel of a block you need to create an item with the same ID and use the component "minecraft:block_placer" because blocks can't use the component "minecraft:fuel".
```json
{
  "format_version": "1.21.100",
  "minecraft:item": {
    "description": {
      "identifier": "template:compressed_coal",
      "menu_category": { "category": "items" }
    },
    "components": {
      "minecraft:tags": { "tags": [
        "bedrock_awakening:temporal_bottle:{'type':'fuel','item':'template:compressed_coal','amount':40}" // The value of "minecraft:fuel" divided by 10
      ] },
      "minecraft:fuel": { "duration": 400 },
      "minecraft:block_placer": {
        "block": "template:compressed_coal",
        "replace_block_item": true
      }
    }
  }
}
```

### ScriptEvent:
```js
import { world, system } from "@minecraft/server"

system.run(() => {
  system.sendScriptEvent("bedrock_awakening:temporal_bottle/register", `{"type":"fuel","item":"template:compressed_coal","amount":40}`)
})
```

# Brewing Stand
The Brewing Stand register type is "**potion**".
Brewing Stand register properties:
- **base:** Item Id that you put on the bases slots to brewing a potion, like **"minecraft:potion" | "minecraft:splash_potion"**
- **reagent:** Item Id that you put on the input slot to trasform the base, like **"minecraft:iron_ingot" | "template:steel_nugget"**
- **ouput:** Item Id that the base will transform using the reagent, like **"template:iron_potion" | "template:steel_potion"**

### Recipe Referene:
```json
{
  "format_version": "1.12",
  "minecraft:recipe_brewing_mix": {
    "description": { "identifier": "template:steel_potion" },
    "tags": [ "brewing_stand" ],
    "input": "minecraft:potion",
    "reagent": "template:steel_nugget",
    "output": "template:steel_potion"
  }
}
```

### Tag:
```json
{
  "format_version": "1.21.100",
  "minecraft:item": {
    "description": {
      "identifier": "template:steel_nugget",
      "menu_category": { "category": "items" }
    },
    "components": {
      "minecraft:tags": { "tags": [
        "bedrock_awakening:temporal_bottle:{'type':'potion','base':'minecraft:potion','reagent':'template:steel_nugget','output':'template:steel_potion'}"
      ] },
      "minecraft:icon": "template:steel_nugget"
    }
  }
}
```

### ScriptEvent:
```js
import { world, system } from "@minecraft/server"

system.run(() => {
  system.sendScriptEvent("bedrock_awakening:temporal_bottle/register", `{"type":"potion","base":"minecraft:potion","reagent":"minecraft:iron_ingot","output":"template:iron_potion"}`)
})
```