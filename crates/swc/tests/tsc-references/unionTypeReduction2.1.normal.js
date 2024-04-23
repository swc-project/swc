//// [unionTypeReduction2.ts]
function f1(x, y) {
    var z = !!true ? x : y; // { f(x?: string): void }
    z.f();
    z.f('hello');
}
function f2(x, y) {
    var z = !!true ? x : y; // { f(x?: string): void }
    z.f();
    z.f('hello');
}
function f3(x, y) {
    var f = !!true ? x : y; // (x?: string) => void
    f();
    f('hello');
}
function f4(x, y) {
    var f = !!true ? x : y; // (x?: string) => void
    f();
    f('hello');
}
function f5(x, y) {
    var f = !!true ? x : y; // (x?: 'hello') => void
    f();
    f('hello');
}
function f6(x, y) {
    var f = !!true ? x : y; // (x: 'hello' | undefined) => void
    f(); // Error
    f('hello');
}
function f11(a, b) {
    var z = !!true ? a : b; // A | B
    z.f();
    z.f('hello');
}
var k = {
    something: function something() {}
};
function run(options) {
    var _options_something;
    var something = (_options_something = options.something) !== null && _options_something !== void 0 ? _options_something : val.something;
    something('');
}
