var a = 0,
    b = 1;
if (true === (a || true)) b = 2;
console.log(a, b);
