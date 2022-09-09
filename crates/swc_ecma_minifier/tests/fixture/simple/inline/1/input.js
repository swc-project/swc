const A = 10,
    B = 5;

function mod(dividend, divisor) {
    return ((dividend % divisor) + divisor) % divisor;
}

console.log(mod(A, A + B));
