const _foo = foo(), { s } = _foo, t = _object_without_properties(_foo, [
    "s"
]);
const _bar = bar(), { s: { q1 } } = _bar, q2 = _object_without_properties(_bar.s, [
    "q1"
]), q3 = _object_without_properties(_bar, [
    "s"
]);
const _foo1 = foo((_param)=>{
    var { b } = _param, c = _object_without_properties(_param, [
        "b"
    ]);
    console.log(b, c);
}), { a } = _foo1;
