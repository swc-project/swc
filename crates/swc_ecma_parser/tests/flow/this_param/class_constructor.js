class A {
  constructor(this: string,) {}
}

class B {
  constructor(this: string, bar: number) {}
}

class C {
  constructor(this: string, bar: number, ...rest: Array<boolean>) {}
}

class D {
  constructor(this: string, ...rest: Array<boolean>) {}
}
