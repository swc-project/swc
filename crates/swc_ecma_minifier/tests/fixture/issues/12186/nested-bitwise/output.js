function nestedBitwise(value, shift) {
    return [
        value >>> shift,
        value >>> shift
    ];
}
console.log(nestedBitwise(-1, 0).join(",")), console.log(nestedBitwise(4, 1).join(","));
