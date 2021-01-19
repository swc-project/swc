var o_p = class Foo {
    constructor(value) {
        this.value = 10 * value;
    }
};
console.log(o_p.name, true, new o_p(1).value, new o_p(2).value);
