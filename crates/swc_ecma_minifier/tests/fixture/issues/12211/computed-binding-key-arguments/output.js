function f(value, ...rest) {
    value = "changed";
    let { [arguments = arguments[0]]: x } = {
        original: "original",
        changed: "changed"
    };
    return x;
}
console.log(f("original"));
