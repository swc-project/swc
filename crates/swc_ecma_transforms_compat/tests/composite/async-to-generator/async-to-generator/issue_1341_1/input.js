
    class A {
      val = '1';
      async foo() {
          try {
              return await (async (x) => x + this.val)('a');
          } catch (e) {
              throw e;
          }
      }
    }
    