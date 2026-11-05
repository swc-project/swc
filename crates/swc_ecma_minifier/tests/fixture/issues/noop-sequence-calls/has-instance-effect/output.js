function noop(value) {}
class A {
    static [Symbol.hasInstance](value) {
        return console.log("check"), !0;
    }
}
function run(x) {
    return x instanceof A, 42;
}
console.log(run({}));
