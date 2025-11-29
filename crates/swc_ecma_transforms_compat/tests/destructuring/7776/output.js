function fn(_param) {
    var _param1 = _to_array(_param), _ref = _param1[0], _rest = _param1.slice(1), foo = _ref.foo, flags = _object_without_properties(_ref, [
        "foo"
    ]), _rest1 = _sliced_to_array(_rest, 1), bar = _rest1[0].bar;
    console.log(flags.rangeChanged);
}
