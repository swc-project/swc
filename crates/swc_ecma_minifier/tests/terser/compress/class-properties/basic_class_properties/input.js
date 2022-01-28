class A {
    static foo;
    bar;
    static fil = "P";
    another = "A";
    toString() {
        if ("bar" in this && "foo" in A) {
            return A.fil + this.another;
        }
    }
}
console.log(new A().toString());
