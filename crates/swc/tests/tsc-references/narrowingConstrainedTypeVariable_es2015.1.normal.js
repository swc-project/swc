// @strict: true
// Repro from #20138
class C {
}
function f1(v) {
    if (v instanceof C) {
        const x = v;
    } else {
        const s = v;
    }
}
class D {
}
function f2(v) {
    if (v instanceof C) {
        const x = v;
    } else {
        const y = v;
    }
}
class E {
}
function f3(v) {
    if (v instanceof E) {
        const x = v;
    } else {
        const y = v;
    }
}
