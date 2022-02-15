class A {
  private constructor() {}

  private method1() {}

  protected method2() {}

  public method3() {}
}

class B {
  constructor(params: number) {
    class Nested {
      method() {}
    }
  }
}
