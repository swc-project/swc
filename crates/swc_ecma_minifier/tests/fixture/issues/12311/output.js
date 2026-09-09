function foo(kind) {
    return console.log("foo " + kind), 1;
}
function bar(kind) {
    console.log("bar " + kind);
}
function staticField() {
    let value = foo("static field");
    return [
        class {
            static value = bar("static field");
        },
        value
    ];
}
function computedKey() {
    let value = foo("computed key");
    return [
        class {
            [bar("computed key")]() {}
        },
        value
    ];
}
function staticBlock() {
    let value = foo("static block");
    return [
        class {
            static{
                bar("static block");
            }
        },
        value
    ];
}
function instanceMethod() {
    return [
        class {
            method() {}
        },
        foo("instance method")
    ];
}
function computedKeyDependency() {
    let key = "before";
    let value = key = "after";
    console.log(Object.getOwnPropertyNames((class {
        [key]() {}
    }).prototype)[1], value);
}
staticField(), computedKey(), staticBlock(), instanceMethod(), computedKeyDependency();
