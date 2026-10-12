import { ActionFormData } from "@minecraft/server-ui"
import { Player } from "@minecraft/server"
import { furnaceRecipeList } from "../../temporal_bottle/lib/blocks/furnace/recipes"

export function BACSRecipes(player: Player): void {
  new ActionFormData()
  .title("ui.bacs:recipes.title")
  .button("ui.bacs:recipes.allowed")
  .button("ui.bacs:recipes.denied")
  .show(player).then(({canceled, selection}) => {
    if(canceled || selection == undefined) return

    if(selection == 0){
      const items = Object.entries(furnaceRecipeList)
      
    }
  })
}

