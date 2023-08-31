function fn(_param) {
    var [{ foo }, { bar }] = _param, flags = _object_without_properties(_param[0], [
        "foo"
    ]);
    console.log(flags.rangeChanged);
}
