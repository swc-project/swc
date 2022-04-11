class A {
    static foo;
    bar;
    static fil = "P";
    another = "A";
    get;
    set = "S";
    #private;
    #private2 = "S";
    toString() {
        if ("bar" in this && "foo" in A) {
            return A.fil + this.another + this.set + this.#private2;
        }
    }
}
console.log(new A().toString());
