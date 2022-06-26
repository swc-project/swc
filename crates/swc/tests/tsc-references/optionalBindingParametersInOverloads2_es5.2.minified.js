function foo() {
    for(var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
}
foo({
    x: "",
    y: 0,
    z: !1
}), foo({
    x: !1,
    y: 0,
    z: ""
});
