function f(value, ...rest) {
    return class {
        constructor() {
            return arguments[0];
        }
    };
}

console.log(new (f("outer"))({ value: "constructor" }).value);
