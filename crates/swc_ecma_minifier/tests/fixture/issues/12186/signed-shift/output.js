function signedShift(value, shift) {
    return [
        value >> shift,
        value >> shift
    ];
}
console.log(signedShift(-1, 0).join(",")), console.log(signedShift(4, 1).join(","));
