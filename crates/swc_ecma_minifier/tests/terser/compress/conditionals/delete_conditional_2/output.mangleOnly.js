console.log(delete (0 ? x : undefined));
console.log(delete (0 ? x : void 0));
console.log(delete (0 ? x : Infinity));
console.log(delete (0 ? x : 1 / 0));
console.log(delete (0 ? x : NaN));
console.log(delete (0 ? x : 0 / 0));
