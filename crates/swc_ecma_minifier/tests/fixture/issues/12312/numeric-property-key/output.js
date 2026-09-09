const seed = {};
Object.defineProperty(seed, "e", {
    value: 0
});
const obj = {
    42: "PASS"
};
console.log(obj["42"], "42" in obj);
