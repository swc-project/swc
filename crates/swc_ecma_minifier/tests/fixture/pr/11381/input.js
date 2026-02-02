class A {
  constructor(options) {
    console.log(options)
  }
}

export class B extends A {
  constructor(options) {
    let { a } = options;
    a = a || "test";
    let b = [a];
    super({ a, b });
  }
}

new B({})
