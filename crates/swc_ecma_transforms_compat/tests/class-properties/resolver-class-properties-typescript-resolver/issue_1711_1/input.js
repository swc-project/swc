
    class Foo {
      #value() {
        return 1;
      }
      // #value = 1;

      get(target) {
        return target.#value;
      }
    }
    