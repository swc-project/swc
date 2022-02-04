// @target: es2015
class C {
}
function method() {
    return 42;
}
C.s = C.#method();
console.log(C.s);
