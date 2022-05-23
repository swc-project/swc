console.log(delete (1 ? undefined : x));
console.log(delete (1 ? void 0 : x));
console.log(delete (1 ? Infinity : x));
console.log(delete (1 ? 1 / 0 : x));
console.log(delete (1 ? NaN : x));
console.log(delete (1 ? 0 / 0 : x));
