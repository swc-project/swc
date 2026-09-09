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
function heritage() {
    let superClass = new Proxy(function() {}, {
        get (target, key) {
            if ("prototype" === key) console.log("heritage");
            return target[key];
        }
    });
    let value = foo("heritage");
    return [
        class extends superClass {
        },
        value
    ];
}
function instanceFields() {
    return [
        class {
            field = bar("instance field");
            #privateField = bar("private instance field");
        },
        foo("instance fields")
    ];
}
function computedKeyDependency() {
    let key = "before";
    let value = key = "after";
    console.log(Object.getOwnPropertyNames((class {
        [key]() {}
    }).prototype)[1], value);
}
function staticPrototypeMethod() {
    let value = foo("static prototype method");
    return [
        class {
            static ["prototype"]() {}
        },
        value
    ];
}
function staticPrototypeField() {
    let value = foo("static prototype field");
    return [
        class {
            static ["prototype"] = 0;
        },
        value
    ];
}
function staticComputedMethod() {
    let value = foo("static computed method");
    return [
        class {
            static ["safe"]() {}
        },
        value
    ];
}
for (const test of (staticField(), computedKey(), staticBlock(), instanceMethod(), heritage(), instanceFields(), computedKeyDependency(), [
    staticPrototypeMethod,
    staticPrototypeField,
    staticComputedMethod
]))try {
    test();
} catch (err) {
    console.log("prototype throws");
}
