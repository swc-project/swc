function sideEffect() {}
console.log("a" in external);
console.log((sideEffect(), external)["b"]);
