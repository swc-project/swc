function nestedBitwise(value, shift) {
    return [(value | 0) >>> shift, value >>> (shift | 0)];
}

console.log(nestedBitwise(-1, 0).join(","));
console.log(nestedBitwise(4, 1).join(","));
