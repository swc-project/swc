function fn(_param) {
    var _param1 = _sliced_to_array(_param, 2), foo = _param1[0].foo, bar = _param1[1].bar, flags = _object_without_properties(_param[0], [
        "foo"
    ]);
    console.log(flags.rangeChanged);
}
