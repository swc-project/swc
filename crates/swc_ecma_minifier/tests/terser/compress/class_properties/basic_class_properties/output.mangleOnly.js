class t {
    static foo;
    bar;
    static fil = "P";
    another = "A";
    get;
    set = "S";
    #a;
    #b = "S";
    toString() {
        if ("bar" in this && "foo" in t) {
            return t.fil + this.another + this.set + this.#b;
        }
    }
}
console.log(new t().toString());
