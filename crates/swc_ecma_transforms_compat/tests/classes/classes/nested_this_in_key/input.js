
class Outer extends B {
  constructor() {
    class Inner {
      [this]() {
        return 'hello';
      }
    }

    function foo() {
      return this;
    }

    return new Inner();
  }
}
