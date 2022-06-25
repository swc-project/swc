function foo() {
    for(var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
}
foo([
    "",
    0,
    !1
]), foo([
    !1,
    0,
    ""
]);
