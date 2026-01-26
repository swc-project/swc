function fn(_0) {
    let [_ref, ..._rest] = _0, { foo } = _ref, flags = _object_without_properties(_ref, [
        "foo"
    ]), [{ bar }] = _rest;
    console.log(flags.rangeChanged);
}
