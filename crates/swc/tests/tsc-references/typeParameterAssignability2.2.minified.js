//// [typeParameterAssignability2.ts]
function foo(t, u) {}
function foo2(t, u) {}
function foo3(t, u, v) {}
function foo4(t, u, v) {
    t = u, t = v, u = t = new Date(), u = v, u = new Date(), v = t, v = u, v = new Date();
}
function foo5(t, u, v) {
    t = u, t = v, u = t = new Date(), u = v, u = new Date(), v = t, v = u, v = new Date();
}
function foo6(t, u, v) {
    t = u, u = t = v, u = v, v = t, v = u;
}
