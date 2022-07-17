// @strict: true
// @declaration: true
function f1(a, b) {
    a = b;
    b = a; // Error
}
function f2(a, b) {
    a = b; // Error
    b = a;
}
function f3(a, b) {
    a = b; // Error
    b = a; // Error
}
// Extract<T, Function> is a T that is known to be a Function
function isFunction(value) {
    return typeof value === "function";
}
function getFunction(item) {
    if (isFunction(item)) {
        return item;
    }
    throw new Error();
}
function f10(x) {
    if (isFunction(x)) {
        const f = x;
        const t = x;
    }
}
function f11(x) {
    if (isFunction(x)) {
        x();
    }
}
function f12(x) {
    const f = getFunction(x); // () => string
    f();
}
function f20(x, y, z) {
    fooBar(x);
    fooBar(y);
    fooBar(z);
}
function f21(x, y, z) {
    fooBat(x); // Error
    fooBat(y); // Error
    fooBat(z); // Error
}
// Repros from #22860
class Opt {
    toVector() {
        return undefined;
    }
}
class Vector {
    tail() {
        return undefined;
    }
    partition2(predicate) {
        return undefined;
    }
}
function foo(value) {
    if (isFunction(value)) {
        toString1(value);
        toString2(value);
    }
}
const w = {
    a: 4
};
exportCommand(save);
gg(ff);
 // true
