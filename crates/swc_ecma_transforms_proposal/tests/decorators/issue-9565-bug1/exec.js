function effect(getDep) {
  return function (_, context) {
    context.addInitializer(function () {
      expect(getDep(this)).toBe(1);
    });
  };
}

class A {
  #log = 1;

  @effect((a) => a.#log)
  #effect() {
    return this.#log;
  }
}

new A();
