// In methods of an object literal with no contextual type, 'this' has the type
// of the object literal.

let obj1 = {
    a: 1,
    f() {
        return this.a;
    },
    b: "hello",
    c: {
        g() {
            this.g();
        }
    },
    get d() {
        return this.a;
    },
    get e() {
        return this.b;
    },
    set e(value) {
        this.b = value;
    }
};
