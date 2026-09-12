const obj = {};
Object.defineProperty(obj, "42", {
    value: "PASS"
});
console.log(obj["42"], "42" in obj);
