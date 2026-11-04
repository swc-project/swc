
class Foo {
  #priv
  search() {
    this.#priv?.()
  }
}

console.log(new Foo().search())