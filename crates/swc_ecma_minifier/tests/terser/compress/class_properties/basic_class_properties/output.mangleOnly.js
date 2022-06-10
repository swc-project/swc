class a {
    static foo;
    bar;
    static fil = "P";
    another = "A";
    get;
    set = "S";
    #a;
    #b = "S";
    toString() {
        if ("bar" in this && "foo" in a) {
            return a.fil + this.another + this.set + this.#b;
        }
    }
}
console.log(new a().toString());
