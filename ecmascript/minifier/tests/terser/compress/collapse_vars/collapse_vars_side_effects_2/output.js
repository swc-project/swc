function fn(x) {
    return console.log(x), x;
}
function p1() {
    return foo() + bar() + baz();
}
function p2() {
    var a = foo(),
        c = bar();
    return a + baz() + c;
}
function p3() {
    var b = foo();
    return bar() + b + baz();
}
function p4() {
    var b = foo(),
        c = bar();
    return baz() + b + c;
}
function p5() {
    var c = foo();
    return bar() + baz() + c;
}
function p6() {
    var c = foo(),
        b = bar();
    return baz() + b + c;
}
function q1() {
    return fn(foo() + bar() + baz());
}
function q2() {
    var a = foo(),
        c = bar();
    return fn(a + baz() + c);
}
function q3() {
    var b = foo();
    return fn(bar() + b + baz());
}
function q4() {
    var b = foo(),
        c = bar();
    return fn(baz() + b + c);
}
function q5() {
    var c = foo();
    return fn(bar() + baz() + c);
}
function q6() {
    var c = foo(),
        b = bar();
    return fn(baz() + b + c);
}
function r1() {
    var a = foo(),
        b = bar(),
        c = baz();
    return fn(a) + fn(b) + fn(c);
}
function r2() {
    var a = foo(),
        c = bar(),
        b = baz();
    return fn(a) + fn(b) + fn(c);
}
function r3() {
    var b = foo(),
        a = bar(),
        c = baz();
    return fn(a) + fn(b) + fn(c);
}
function r4() {
    var b = foo(),
        c = bar();
    return fn(baz()) + fn(b) + fn(c);
}
function r5() {
    var c = foo(),
        a = bar(),
        b = baz();
    return fn(a) + fn(b) + fn(c);
}
function r6() {
    var c = foo(),
        b = bar();
    return fn(baz()) + fn(b) + fn(c);
}
function s1() {
    var a = foo(),
        b = bar(),
        c = baz();
    return g(a + b + c);
}
function s6() {
    var c = foo(),
        b = bar(),
        a = baz();
    return g(a + b + c);
}
function t1() {
    var a = foo(),
        b = bar(),
        c = baz();
    return g(a) + g(b) + g(c);
}
function t6() {
    var c = foo(),
        b = bar(),
        a = baz();
    return g(a) + g(b) + g(c);
}
