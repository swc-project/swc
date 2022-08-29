//// [controlFlowTypeofObject.ts]
function f1(x) {
    if (!x) {
        return;
    }
    if (typeof x === "object") {
        obj(x);
    }
}
function f2(x) {
    if (x === null) {
        return;
    }
    if (typeof x === "object") {
        obj(x);
    }
}
function f3(x) {
    if (x == null) {
        return;
    }
    if (typeof x === "object") {
        obj(x);
    }
}
function f4(x) {
    if (x == undefined) {
        return;
    }
    if (typeof x === "object") {
        obj(x);
    }
}
function f5(x) {
    if (!!true) {
        if (!x) {
            return;
        }
    } else {
        if (x === null) {
            return;
        }
    }
    if (typeof x === "object") {
        obj(x);
    }
}
function f6(x) {
    if (x === null) {
        x;
    } else {
        x;
        if (typeof x === "object") {
            obj(x);
        }
    }
    if (typeof x === "object") {
        obj(x); // Error
    }
}
