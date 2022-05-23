function run(c, v) {
    return new c(v).value;
}
var o_p = class Foo {
    constructor(value) {
        this.value = 10 * value;
    }
};
console.log(o_p.name, true, run(o_p, 1), run(o_p, 2));
