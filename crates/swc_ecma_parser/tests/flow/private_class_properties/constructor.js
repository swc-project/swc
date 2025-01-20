class A {
  #constructor() {} // Error, no private methods
}

class B {
  static #constructor() {} // Error, no private methods
}

class C {
  #constructor: number // Error, no field named constructor
}

class D {
  static #constructor: number // Error, no field named constructor
}
