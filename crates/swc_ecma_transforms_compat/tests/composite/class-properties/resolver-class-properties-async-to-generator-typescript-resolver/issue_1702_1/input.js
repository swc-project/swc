
    class Foo {
      #y;
      static #z = 3;

      constructor() {
        this.x = 1;
        this.#y = 2;
        this.#sssss();
      }

      #sssss() {
        console.log(this.x, this.#y, Foo.#z);
      }
    }

    const instance = new Foo();
    