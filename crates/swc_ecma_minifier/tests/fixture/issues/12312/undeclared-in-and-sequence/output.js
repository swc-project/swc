function sideEffect() {}
console.log("inprop" in external);
console.log((sideEffect(), external)["memberprop"]);
