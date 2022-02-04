// @strict: true
function f1(x, y, z) {
    if (x) {
        x;
        x.length;
        return x;
    }
    if (y.a) {
        y.a.length;
        return y.a;
    }
    if (z[0]) {
        z[0].length;
        return z[0];
    }
    return "hello";
}
function f2(x) {
    if (x) {
        x;
        x.length;
        return x;
    }
    return "hello";
}
function g1(x) {
    if (isBox(x)) {
        unbox(x);
    }
}
function g2(x) {
    if (!isUndefined(x)) {
        unbox(x);
    }
}
function g3(x) {
    if (!isBox(x)) {
        unbox(x); // Error
    }
}
function g4(x) {
    if (isUndefined(x)) {
        unbox(x); // Error
    }
}
export function bounceAndTakeIfA(value) {
    if (value === 'A') {
        takeA(value);
        return value;
    } else {
        return value;
    }
}
const fn = (value)=>{
    value.foo; // Error
    if ('foo' in value) {
        value.foo;
    }
    if (value.tag === 'B') {
        value.foo;
    }
};
const fn2 = (value)=>{
    value.foo; // Error
    if ('foo' in value) {
        value.foo;
    }
    if (value.tag === 'B') {
        value.foo;
    }
};
function notWorking(object) {
    if (!object.testable) return;
    object.doTest();
}
function get(key, obj) {
    const value = obj[key];
    if (value !== null) {
        return value;
    }
    return 0;
}
// Repro from #44093
class EventEmitter {
    off(...args) {}
}
function once(emittingObject, eventName) {
    emittingObject.off(eventName, 0);
    emittingObject.off(eventName, 0);
}
// In an element access obj[x], we consider obj to be in a constraint position, except when obj is of
// a generic type without a nullable constraint and x is a generic type. This is because when both obj
// and x are of generic types T and K, we want the resulting type to be T[K].
function fx1(obj, key) {
    const x1 = obj[key];
    const x2 = obj && obj[key];
}
function fx2(obj, key) {
    const x1 = obj[key];
    const x2 = obj && obj[key];
}
function fx3(obj, key) {
    const x1 = obj[key]; // Error
    const x2 = obj && obj[key];
}
// Repro from #44166
class TableBaseEnum {
    m() {
        let iSpec = null;
        iSpec[null]; // Error, object possibly undefined
        iSpec[null]; // Error, object possibly undefined
        if (iSpec === undefined) {
            return;
        }
        iSpec[null];
        iSpec[null];
    }
}
// Repros from #45145
function f10(x, y) {
    y = x;
}
class SqlTable {
    validateRow(_row) {}
    insertRow(row) {
        this.validateRow(row);
    }
}
function update(control, key, value) {
    if (control !== undefined) {
        control[key] = value;
    }
}
