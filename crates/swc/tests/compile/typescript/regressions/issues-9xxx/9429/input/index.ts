class Foo {
  static #loggedMethod<Args extends unknown[], Ret>(
    _prototype: typeof Foo.prototype,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<(this: Foo, ...args: Args) => Promise<Ret>>,
  ) {
    const method = descriptor.value!;
    descriptor.value = function (...args) {
      try {
        console.log("before");
        return method.apply(this, args);
      } finally {
        console.log("after");
      }
    };
  }

  @(Foo.#loggedMethod)
  public greet(): any {
    console.log("hi");
  }
}

const foo = new Foo();
foo.greet();