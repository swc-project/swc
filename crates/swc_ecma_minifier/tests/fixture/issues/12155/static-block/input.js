function publicFunction(parameter) {
    return parameter;
}

class PublicClass {
    static {
        for (; condition;) {
            var staticLoopLocal;
            consume(staticLoopLocal);
        }
    }
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
