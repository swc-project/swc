function f(values, a = undefined) {
    let [b = undefined] = values;
    return b;
}
let [value = undefined] = JSON.parse("[3]");
console.log(f([2]), f.length, value);
