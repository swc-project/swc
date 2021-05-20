function f1() {
    var a;
    a = typeof b === "function" ? b() : b;
    return a !== undefined && c();
}
function f2(b) {
    var a;
    b = c();
    a = typeof b === "function" ? b() : b;
    return "stirng" == typeof a && d();
}
function f3(c) {
    var a;
    a = b(a / 2);
    if (a < 0) {
        a++;
        ++c;
        return c / 2;
    }
}
function f4(c) {
    var a;
    a = b(a / 2);
    if (a < 0) {
        a++;
        c++;
        return c / 2;
    }
}
