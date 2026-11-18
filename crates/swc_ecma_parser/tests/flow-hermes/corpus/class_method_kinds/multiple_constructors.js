class Foo {
  constructor() { }
  constructor() { } // Error
}

class Bar {
  static constructor: number // Error
}

class Baz {
  constructor: number // Error
}

class Static {
  static constructor() { }
  static constructor() { } // Fine
}

class Proto {
  prototype: number // Fine
}

class ProtoBad {
  static prototype: number // Error
}
