function report(label, callback) {
    try {
        callback();
        console.log(label);
    } catch (error) {
        console.log(label, error.name);
    }
}

report("const", () => {
    const x = 1;
    x = x;
});

report("let", () => {
    let x = 1;
    x = x;
});

report("var", () => {
    var x = 1;
    x = x;
});

report("parameter", function (value) {
    value = value;
    console.log(value);
});

report("arrow parameter", (value) => {
    value = value;
    console.log(value);
});

report("constructor parameter", () => {
    class Value {
        constructor(value) {
            value = value;
            console.log(value);
        }
    }
    new Value("constructor");
});

report("catch", () => {
    try {
        throw "caught";
    } catch (error) {
        error = error;
        console.log(error);
    }
});

report("function", () => {
    function value() {
        return "function";
    }
    value = value;
    console.log(value());
});

report("class", () => {
    class Value {
        static get() {
            return "class";
        }
    }
    Value = Value;
    console.log(Value.get());
});

report("class inner", () => {
    class Value {
        static {
            Value = Value;
        }
    }
});

report("class inner normalized RHS", () => {
    class Value {
        static {
            Value = (0, Value);
        }
    }
});

report("class heritage closure", () => {
    let callback;
    class Value extends (callback = () => {
        Value = Value;
    }, Object) {}
    callback();
});
