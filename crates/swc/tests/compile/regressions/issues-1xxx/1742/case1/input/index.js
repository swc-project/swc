class Foo {
    #tag() {
        return this;
    }

    #tag2 = this.#tag;

    constructor() {
        const receiver = this.#tag`tagged template`;
        console.log(receiver === this);

        const receiver2 = this.#tag2`tagged template`;
        console.log(receiver2 === this);
    }
}
new Foo();
