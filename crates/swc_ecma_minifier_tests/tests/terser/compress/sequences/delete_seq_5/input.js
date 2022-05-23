function f() {}
console.log(delete (f(), undefined));
console.log(delete (f(), void 0));
console.log(delete (f(), Infinity));
console.log(delete (f(), 1 / 0));
console.log(delete (f(), NaN));
console.log(delete (f(), 0 / 0));
