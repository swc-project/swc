// @strict: true
class B {
}
class D extends B {
}
class ED extends D {
}
class DD extends D {
}
const a = B["f"];
const b = B[42];
const c = D["f"];
const d = D[42];
const e = ED["f"];
const f = ED[42];
const g = DD["f"];
const h = DD[42];
