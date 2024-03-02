const { x } = a, y = _object_without_properties(a, [
    "x"
]), z = foo(y);
const s = _extends({}, _object_destructuring_empty(r)), t = foo(s);
// ordering is preserved
var l = foo(), _bar = bar(), { m: { n } } = _bar, o = _object_without_properties(_bar.m, [
    "n"
]), p = _object_without_properties(_bar, [
    "m"
]), q = baz();
