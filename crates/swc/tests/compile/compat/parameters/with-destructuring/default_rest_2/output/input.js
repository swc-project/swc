var a = 1;
function rest2() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : a;
    for(var _len = arguments.length, a1 = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        a1[_key - 1] = arguments[_key];
    }
    expect(a1[0]).toBe(2);
}
rest2(undefined, 2);
