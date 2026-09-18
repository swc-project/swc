function dec(value) {
    console.log(value);
    return () => {};
}

function f(value, ...rest) {
    value = "changed";
    return class C {
        @dec(arguments[0])
        method() {}
    };
}

new (f("original"));
