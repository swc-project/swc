// @target: esnext, es2022, es2015
// @useDefineForClassFields: true

class C {
  static #x = 123;

  static {
    console.log(C.#x)
  }

  foo () {
    return C.#x;
  }
}
