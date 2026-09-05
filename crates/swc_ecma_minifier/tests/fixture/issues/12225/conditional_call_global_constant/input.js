function f(a, b) {
    return b;
}

let x = true;
x ? f(undefined, 1) : f(undefined, 2);
x ? f(Infinity, 1) : f(Infinity, 2);
x ? f({ undefined }, 1) : f({ undefined }, 2);
x ? f({ NaN }, 1) : f({ NaN }, 2);
x ? f({ Infinity }, 1) : f({ Infinity }, 2);
