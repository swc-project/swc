const { x } = a, y = _object_without_properties(a, [
    "x"
]), z = foo(y);
const {} = r, s = _extends({}, r), t = foo(s);
// ordering is preserved
var l = foo(), _bar = bar(), { m: _ref } = _bar, { n } = _ref, o = _object_without_properties(_ref, [
    "n"
]), p = _object_without_properties(_bar, [
    "m"
]), q = baz();
