var a = 0,
    b = 1;
switch (true) {
    case a || true:
        b = 2;
}
console.log(a, b);
