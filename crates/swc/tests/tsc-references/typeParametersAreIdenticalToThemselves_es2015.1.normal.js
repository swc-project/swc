// type parameters from the same declaration are identical to themself
function foo1(x) {}
function foo2(x) {}
function foo3(x, y) {
    function inner(x) {}
    function inner2(x) {}
}
class C {
    foo1(x) {}
    foo2(a, x) {}
    foo3(x) {}
    foo4(x) {}
}
class C2 {
    foo1(x) {}
    foo2(a, x) {}
    foo3(x) {}
}
