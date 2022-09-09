var a = 0,
    c = 1;
switch (0) {
    default:
        c = 2;
    case a:
        a = 3;
    case 0:
}
console.log(a, c);
