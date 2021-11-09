// all the following should be error
function fn1() {
}
function fn2() {
}
function fn3() {
}
function fn4() {
}
function fn7() {
} // should be valid: any includes void
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
