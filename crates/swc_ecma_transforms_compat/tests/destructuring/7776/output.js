function fn(_0) {
    let _01 = _to_array(_0), _ref = _01[0], _rest = _01.slice(1), foo = _ref.foo, flags = _object_without_properties(_ref, [
        "foo"
    ]), _rest1 = _sliced_to_array(_rest, 1), bar = _rest1[0].bar;
    console.log(flags.rangeChanged);
}
