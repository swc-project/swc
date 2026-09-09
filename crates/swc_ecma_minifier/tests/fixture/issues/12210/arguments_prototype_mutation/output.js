function f(a) {
    arguments.__proto__ = {
        0: 42
    };
    return arguments[0];
}
console.log(f());
