function noop(value) {}
class A {
    static [Symbol.hasInstance](value) {
        console.log("check");
        return true;
    }
}
function run(x) {
    return noop(x instanceof A), noop(), 42;
}
console.log(run({}));
