function f(value, ...rest) {
    value = "changed";
    return [arguments[0], rest.length].join(":");
}

console.log(f("original", 1, 2));
