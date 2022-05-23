var a;
console.log(delete (a = undefined));
console.log(delete (a = void 0));
console.log(delete (a = Infinity));
console.log(delete (a = 1 / 0));
console.log(delete (a = NaN));
console.log(delete (a = 0 / 0));
