function fn(_param) {
    var [_ref, ..._rest] = _param, { foo } = _ref, flags = _object_without_properties(_ref, [
        "foo"
    ]), [{ bar }] = _rest;
    console.log(flags.rangeChanged);
}
