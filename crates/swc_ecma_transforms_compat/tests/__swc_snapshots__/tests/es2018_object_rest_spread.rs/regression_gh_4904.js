const _foo = foo(), { s } = _foo, t = _object_without_properties(_foo, [
    "s"
]);
const _bar = bar(), { s: _ref } = _bar, { q1 } = _ref, q2 = _object_without_properties(_ref, [
    "q1"
]), q3 = _object_without_properties(_bar, [
    "s"
]);
const { a } = foo((_param)=>{
    var { b } = _param, c = _object_without_properties(_param, [
        "b"
    ]);
    console.log(b, c);
});
