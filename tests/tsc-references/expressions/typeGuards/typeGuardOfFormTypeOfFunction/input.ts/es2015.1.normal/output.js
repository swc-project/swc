function f1(x) {
    if (typeof x === "function") {
        x; // any
    }
}
function f2(x) {
    if (typeof x === "function") {
        x; // Function
    }
}
function f3(x) {
    if (typeof x === "function") {
        x; // Function
    }
}
function f4(x) {
    if (typeof x === "function") {
        x; // T & Function
    }
}
function f5(x) {
    if (typeof x === "function") {
        x; // never
    }
}
function f6(x) {
    if (typeof x === "function") {
        x; // () => string
    }
}
function f10(x) {
    if (typeof x === "function") {
        x; // () => string
    } else {
        x; // string
    }
}
function f11(x) {
    if (typeof x === "function") {
        x; // () => string
    } else {
        x; // { s: string }
    }
}
function f12(x) {
    if (typeof x === "function") {
        x; // never
    } else {
        x; // { s: string } | { n: number }
    }
}
// Repro from #18238
function f100(obj, keys) {
    for (const k of keys){
        const item = obj[k];
        if (typeof item == 'function') item.call(obj);
    }
}
