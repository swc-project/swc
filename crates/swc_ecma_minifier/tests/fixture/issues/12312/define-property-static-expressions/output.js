const obj = {};
Object.defineProperty(obj, "o", {
    value: "T"
});
Object.defineProperty(obj, "e", {
    value: "P"
});
console.log(obj["o"], obj["e"]);
