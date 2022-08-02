function mod(dividend, divisor) {
    return ((dividend % divisor) + divisor) % divisor;
}

console.log(mod(10, 15));
