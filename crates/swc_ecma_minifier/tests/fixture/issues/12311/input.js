function foo(kind) {
    console.log("foo " + kind);
    return 1;
}

function bar(kind) {
    console.log("bar " + kind);
}

function staticField() {
    let value = foo("static field");
    return [class {
        static value = bar("static field");
    }, value];
}

function computedKey() {
    let value = foo("computed key");
    return [class {
        [bar("computed key")]() {}
    }, value];
}

function staticBlock() {
    let value = foo("static block");
    return [class {
        static {
            bar("static block");
        }
    }, value];
}

function instanceMethod() {
    let value = foo("instance method");
    return [class {
        method() {}
    }, value];
}

staticField();
computedKey();
staticBlock();
instanceMethod();
