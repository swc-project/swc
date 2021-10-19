// all the following should be valid
function fn1() {
    return 1;
}
function fn2() {
    return '';
}
function fn3() {
    return undefined;
}
function fn4() {
    return;
}
function fn5() {
    return true;
}
function fn6() {
    return new Date(12);
}
function fn7() {
    return null;
}
function fn8() {
    return;
} // OK, eq. to 'return undefined'
class C {
    dispose() {
    }
}
class D extends C {
}
function fn10() {
    return {
        id: 12
    };
}
function fn11() {
    return new C();
}
function fn12() {
    return new D();
}
function fn13() {
    return null;
}
