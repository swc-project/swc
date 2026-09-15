const local = {};
console.log((flag ? external : local)["a"], (flag ? local : external)["b"], (external && local)["c"], (local && external)["d"], (external || local)["e"], (local || external)["f"], (external ?? local)["g"], (local ?? external)["h"]);
