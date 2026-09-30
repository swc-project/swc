function f(values, a = void 0) {
    let [b] = values;
    return b;
}
let [value] = JSON.parse("[3]");
console.log(f([
    2
]), f.length, value);
