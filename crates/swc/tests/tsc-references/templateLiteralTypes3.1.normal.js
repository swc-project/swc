//// [templateLiteralTypes3.ts]
// Inference from template literal type to template literal type
function f1(s, n, b, t) {
    var x1 = foo1('hello'); // Error
    var x2 = foo1('*hello*');
    var x3 = foo1('**hello**');
    var x4 = foo1("*".concat(s, "*"));
    var x5 = foo1("*".concat(n, "*"));
    var x6 = foo1("*".concat(b, "*"));
    var x7 = foo1("*".concat(t, "*"));
    var x8 = foo1("**".concat(s, "**"));
}
function f2() {
    var x;
    x = '1.1.1';
    x = '1.1.1';
    x = '1.1.1';
    x = '1.1.1';
    x = '1.1.1';
    x = '1.1.1';
    x = '1.1.1';
    x = '1.1.1';
}
function f3(s, n, b, t) {
    var x;
    x = 'hello'; // Error
    x = '*hello*';
    x = '**hello**';
    x = "*".concat(s, "*");
    x = "*".concat(n, "*");
    x = "*".concat(b, "*");
    x = "*".concat(t, "*");
    x = "**".concat(s, "**");
}
function f4(s, n, b, t) {
    var x;
    x = '123'; // Error
    x = '*123*';
    x = '**123**'; // Error
    x = "*".concat(s, "*"); // Error
    x = "*".concat(n, "*");
    x = "*".concat(b, "*"); // Error
    x = "*".concat(t, "*");
}
var value1 = "abc";
var templated1 = "".concat(value1, " abc");
// Type '`${string} abc`' is not assignable to type '`${string} ${string}`'.
var value2 = "abc";
var templated2 = "".concat(value2, " abc");
chain("a");
// Repro from #46125
function ff1(x, y, z) {
    if (x === y) {
        x; // `foo-${string}`
    }
    if (x === z) {}
}
function ff2(x, y, z) {
    if (x === y) {
        x; // `foo-${T}`
    }
    if (x === z) {}
}
function ff3(x, y) {
    if (x === y) {
        x; // `foo-${string}` | 'bar'
    }
}
function ff4(x, y) {
    if (x === 'foo-test') {
        x; // 'foo-test'
    }
    if (y === 'foo-test') {
        y; // 'foo-test'
    }
}
function reducer(action) {
    if (action.type === 'FOO_SUCCESS') {
        action.type;
        action.response;
    }
}
noSpread([
    "1.2.3",
    "1.2.4"
]);
noSpread([
    "1.2.3",
    "1.2.4"
]);
spread("1.2.3", "1.2.4");
spread("1.2.3", "1.2.4");
function ft1(t, u, u1, u2) {
    spread("1.".concat(t, ".3"), "1.".concat(t, ".4"));
    spread("1.".concat(u, ".3"), "1.".concat(u, ".4"));
    spread(u1, u2);
}
// Repro from #56582
function a() {
    var x;
    x = "id";
    x = "-id";
}
