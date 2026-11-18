const dec = (fn) => fn;

class Foo {
  value = 10;

  @dec
  #a(x, y) {
    return this.value + x + y;
  }

  @dec
  #b(x = 1, ...rest) {
    return [x, rest.length];
  }

  @dec
  #c({ x }, [y]) {
    return x + y;
  }

  call() {
    return [this.#a(2, 3), this.#b(), this.#b(5, 6, 7), this.#c({ x: 1 }, [2])];
  }
}

expect(new Foo().call()).toEqual([15, [1, 0], [5, 2], 3]);
