const seed = {};
Object.defineProperty(seed, "42", { value: 0 });
const obj = { 42: "PASS" };

console.log(obj["42"], "42" in obj);
