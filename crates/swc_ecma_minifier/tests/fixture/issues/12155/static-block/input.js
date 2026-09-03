function publicFunction(parameter) {
    return parameter;
}

for (; condition;) {
    (class {
        static {
            var a, staticValue;
            consume(a, staticValue);
        }
    });

    var holder = class {
        static {
            var privateName;
            consume(privateName);
        }
    };
    consume(holder);
}
