
  class A {
    val = '1';
    async foo() {
      return await (async (x) => x + this.val)('a');
    }
  }
  