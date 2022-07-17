// @strict: true
// @target: es2015
// Repro from #19682
var c1 = Array.from(a).concat(Array.from(b));
var c2 = from();
