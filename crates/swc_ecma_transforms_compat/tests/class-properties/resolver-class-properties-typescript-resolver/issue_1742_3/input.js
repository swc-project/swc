
    class Foo {
      #tag() {
        return this;
      }

      #tag2 = this.#tag;

      constructor() {
        const receiver = this.#tag`tagged template`;
        expect(receiver).toBe(this);

        const receiver2 = this.#tag2`tagged template`;
        expect(receiver2).toBe(this);
      }
    }
    new Foo();
    