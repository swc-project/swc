// @strict: true
// @target: es2015
// Repro from #19682
const c1 = Array.from(a).concat(Array.from(b));
const c2 = from();
