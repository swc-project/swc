var a = 100,
    b = 10;
function f() {
    switch (--b) {
        default:
        case !function x() {}:
            break;
        case b--:
            switch (0) {
                default:
                case a--:
            }
            break;
        case a++:
            break;
    }
}
f();
console.log(a, b);
