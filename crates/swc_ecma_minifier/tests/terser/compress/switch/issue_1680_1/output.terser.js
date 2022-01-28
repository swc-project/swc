function f(x) {
    console.log(x);
    return x + 1;
}
switch (2) {
    case f(0):
    case f(1):
        f(2);
    case 2:
        f(5);
}
