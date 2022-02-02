function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function foo() {
    {
        var _ref = {}, a2 = _ref.a, c2 = _ref.b, _d2 = _ref.d, d2 = _d2 === void 0 ? e : _d2, tmp = _ref.f, g2 = tmp === void 0 ? h : tmp, i2 = _objectWithoutProperties(_ref, [
            "a",
            "b",
            "d",
            "f"
        ]);
        // all should be renamed
        use(a2, c2, d2, g2, i2);
    }
    var _ref2 = {}, a = _ref2.a, c = _ref2.b, _d1 = _ref2.d, d = _d1 === void 0 ? e : _d1, tmp2 = _ref2.f, g = tmp2 === void 0 ? h : tmp2, i = _objectWithoutProperties(_ref2, [
        "a",
        "b",
        "d",
        "f"
    ]);
    use(a, c, d, g, i);
}
function bar() {
    var _ref = {}, a = _ref.a, c = _ref.b, _d4 = _ref.d, d = _d4 === void 0 ? e : _d4, tmp = _ref.f, g = tmp === void 0 ? h : tmp, i = _objectWithoutProperties(_ref, [
        "a",
        "b",
        "d",
        "f"
    ]);
    use(a, c, d, g, i);
    {
        var _ref3 = {}, a3 = _ref3.a, c3 = _ref3.b, _d3 = _ref3.d, d3 = _d3 === void 0 ? e : _d3, tmp3 = _ref3.f, g3 = tmp3 === void 0 ? h : tmp3, i3 = _objectWithoutProperties(_ref3, [
            "a",
            "b",
            "d",
            "f"
        ]);
        // all should be renamed
        use(a3, c3, d3, g3, i3);
    }
}
{
    var b = 1; // keep name
    var e1 = 1; // should rename. conflict with unresoved
    var f = 1; // keep name
    var h1 = 1; // should rename. conflict with unresoved
}{
    var _ref1 = {}, a1 = _ref1.a, c1 = _ref1.b, _d = _ref1.d, d1 = _d === void 0 ? e : _d, tmp1 = _ref1.f, g1 = tmp1 === void 0 ? h : tmp1, i1 = _objectWithoutProperties(_ref1, [
        "a",
        "b",
        "d",
        "f"
    ]);
    // all should be renamed
    use(a1, c1, d1, g1, i1);
}// should not touch following
var a = 1;
var c = 1;
var d = 1;
var g = 1;
var i = 1;
var _ref = 1;
var tmp = 1;
