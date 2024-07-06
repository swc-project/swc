class A {
  #p: number
  constructor() { this.#p = 3; this.#q = 3} // All in scope
  #q: number
}

class B {
  #p: number
  constructor() {
    var x = class {
      test() {
        var b = new B();
        b.#q = 3;
        b.#p = 3; // All in scope!
      }
    }
  }
  #q: number
}

class C {
  #p: number
  constructor () {
    var x = class {
      #r: number
      test() {
        this.#r = 3; // Fine
        var c = new C();
        c.#p = 3; // Fine
        c.#q = 3; // Fine
      }
    }
    var y = class {
      test() {
        this.#r = 3; // Error!
        var c = new C();
        c.#p = 3; // Fine
        c.#q = 3; // Fine
      }
    }
  }
  #q: number
}

this.#p; // Error!
