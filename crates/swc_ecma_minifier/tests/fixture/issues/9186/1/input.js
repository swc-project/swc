o = {
    foo() {
        return val;
    },
    s: "test",
};
console.log(o.foo().length);

o = {
    foo(val = this.s) {
        return val;
    },
    s: "test",
};
console.log(o.foo().length);
