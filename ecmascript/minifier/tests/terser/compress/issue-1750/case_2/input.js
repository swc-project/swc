var a = 0,
    b = 1;
switch (0) {
    default:
        b = 2;
    case a:
        a = 3;
    case 0:
}
console.log(a, b);
