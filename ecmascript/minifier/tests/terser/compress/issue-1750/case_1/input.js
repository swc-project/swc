var a = 0,
    b = 1;
switch (true) {
    case a || true:
    default:
        b = 2;
    case true:
}
console.log(a, b);
