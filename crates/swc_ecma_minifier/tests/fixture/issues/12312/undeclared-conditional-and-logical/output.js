const local = {};
console.log((flag ? external : local)["conditionalConsequent"], (flag ? local : external)["conditionalAlternate"], (external && local)["andLeft"], (local && external)["andRight"], (external || local)["orLeft"], (local || external)["orRight"], (external ?? local)["nullishLeft"], (local ?? external)["nullishRight"]);
