//// [templateLiteralTypes3.ts]
function f1(s, n, b, t) {
    foo1("hello"), foo1("*hello*"), foo1("**hello**"), foo1("*".concat(s, "*")), foo1("*".concat(n, "*")), foo1("*".concat(b, "*")), foo1("*".concat(t, "*")), foo1("**".concat(s, "**"));
}
function f2() {}
function f3(s, n, b, t) {
    "*".concat(s, "*"), "*".concat(n, "*"), "*".concat(b, "*"), "*".concat(t, "*"), "**".concat(s, "**");
}
function f4(s, n, b, t) {
    "*".concat(s, "*"), "*".concat(n, "*"), "*".concat(b, "*"), "*".concat(t, "*");
}
var value1 = "abc", templated1 = "".concat(value1, " abc"), value2 = "abc", templated2 = "".concat(value2, " abc");
function ff1(x, y, z) {}
function ff2(x, y, z) {}
function ff3(x, y) {}
function ff4(x, y) {}
function reducer(action) {
    "FOO_SUCCESS" === action.type && (action.type, action.response);
}
function ft1(t, u, u1, u2) {
    spread("1.".concat(t, ".3"), "1.".concat(t, ".4")), spread("1.".concat(u, ".3"), "1.".concat(u, ".4")), spread(u1, u2);
}
chain("a"), noSpread([
    "1.2.3",
    "1.2.4"
]), noSpread([
    "1.2.3",
    "1.2.4"
]), spread("1.2.3", "1.2.4"), spread("1.2.3", "1.2.4");
