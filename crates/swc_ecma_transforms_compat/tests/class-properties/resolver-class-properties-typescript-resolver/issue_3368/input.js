
class A {
  #a = 'fff'
  static #b = 123
  foo() {
    return class B {
      bar() {
        console.log(this.#a, this.#b, this.#bar)
      }
    }
  }
  #bar() {}
}
