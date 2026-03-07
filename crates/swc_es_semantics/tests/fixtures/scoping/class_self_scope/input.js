const A = class B {
  method() {
    return B;
  }

  static {
    this.self = B;
  }
};

class C {
  static {
    this.value = C;
  }
}
