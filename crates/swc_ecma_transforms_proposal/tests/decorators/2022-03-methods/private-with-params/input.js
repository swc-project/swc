const dec = () => {};
class Foo {
  value = 1;

  @dec
  #a(x, y) {
    return this.value + x + y;
  }

  @dec
  #b(x = 1, ...rest) {
    return [x, rest];
  }

  @dec
  #c({ x }, [y]) {
    return x + y;
  }

  @dec
  static #s(x) {
    return x;
  }

  call() {
    return [this.#a(1, 2), this.#b(), this.#c({ x: 1 }, [2])];
  }
}
