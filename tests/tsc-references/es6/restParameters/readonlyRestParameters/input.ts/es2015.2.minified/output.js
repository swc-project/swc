function f0(a, b) {
    f0(a, b), f1(a, b), f2(a, b);
}
function f1(...args) {
    f0(...args), f1("abc", "def"), f1("abc", ...args), f1(...args);
}
function f2(...args) {
    f0(...args), f1("abc", "def"), f1("abc", ...args), f1(...args), f2("abc", "def"), f2("abc", ...args), f2(...args);
}
