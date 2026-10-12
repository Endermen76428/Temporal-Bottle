import { ActionFormData } from "@minecraft/server-ui";
export function BACSRecipes(player) {
    new ActionFormData()
        .title("ui.bacs:recipes.title")
        .button("ui.bacs:recipes.allowed")
        .button("ui.bacs:recipes.denied")
        .show(player).then(({ canceled, selection }) => {
        if (canceled || selection == undefined)
            return;
        console.warn(selection);
    });
}
