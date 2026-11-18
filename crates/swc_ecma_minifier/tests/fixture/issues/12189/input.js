console.log(delete (console.log("binary") + 1));
console.log(delete !console.log("unary"));
console.log(delete (console.log("conditional") ? 1 : 2));
console.log(delete console.log("call"));

console.log(delete !0);
console.log(delete (1 + 2));
console.log(delete (false ? 1 : 2));

console.log(delete undefined, delete NaN, delete Infinity);
