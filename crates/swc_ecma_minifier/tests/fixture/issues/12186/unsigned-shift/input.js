function unsignedShift(value, shift) {
    return [(value >>> shift) | 0, 0 | (value >>> shift)];
}

console.log(unsignedShift(-1, 0).join(","));
console.log(unsignedShift(4, 1).join(","));
