// @strict: true
function f1(x, y) {
    let z = !!true ? x : y; // { f(x?: string): void }
    z.f();
    z.f('hello');
}
function f2(x, y) {
    let z = !!true ? x : y; // { f(x?: string): void }
    z.f();
    z.f('hello');
}
function f3(x, y) {
    let f = !!true ? x : y; // (x?: string) => void
    f();
    f('hello');
}
function f4(x, y) {
    let f = !!true ? x : y; // (x?: string) => void
    f();
    f('hello');
}
function f5(x, y) {
    let f = !!true ? x : y; // (x?: 'hello') => void
    f();
    f('hello');
}
function f6(x, y) {
    let f = !!true ? x : y; // (x: 'hello' | undefined) => void
    f(); // Error
    f('hello');
}
function f11(a, b) {
    let z = !!true ? a : b; // A | B
    z.f();
    z.f('hello');
}
const k = {
    something () {
    }
};
function run(options) {
    var _something;
    const something = (_something = options.something) !== null && _something !== void 0 ? _something : val.something;
    something('');
}
