function e() {}
console.log(delete (e(), undefined));
console.log(delete (e(), void 0));
console.log(delete (e(), Infinity));
console.log(delete (e(), 1 / 0));
console.log(delete (e(), NaN));
console.log(delete (e(), 0 / 0));
