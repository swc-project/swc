
class A extends B {
  async foo() {
    super.foo ++;
    -- super.bar;
    super['foo'] ++;
    -- super['bar'];
  }
}
