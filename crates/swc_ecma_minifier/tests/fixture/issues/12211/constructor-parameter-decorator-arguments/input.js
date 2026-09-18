function dec(value) {
    console.log(value);
    return () => {};
}

function f(value, ...rest) {
    value = "changed";
    return class {
        constructor(@dec(arguments[0]) parameter) {}
    };
}

new (f("original"));
