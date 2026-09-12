function f(value, ...rest) {
    value = "changed";
    let [x = arguments[0]] = [];
    return x;
}

console.log(f("original"));
