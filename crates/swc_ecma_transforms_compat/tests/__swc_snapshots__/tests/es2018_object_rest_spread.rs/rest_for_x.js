// ForXStatement
for (var _ref of []){
    let { a } = _ref, b = _object_without_properties(_ref, [
        "a"
    ]);
}
for (var _ref1 of []){
    var _ref2;
    _ref2 = _ref1, b = _object_without_properties(_ref2, [
        "a"
    ]), ({ a } = _ref2), _ref2;
}
async function a() {
    for await (var _ref of []){
        var _ref1;
        _ref1 = _ref, b = _object_without_properties(_ref1, [
            "a"
        ]), ({ a } = _ref1), _ref1;
    }
}
// skip
for({ a } in {}){}
for ({ a } of []){}
async function a() {
    for await ({ a } of []){}
}
for(a in {}){}
for (a of []){}
async function a() {
    for await (a of []){}
}
