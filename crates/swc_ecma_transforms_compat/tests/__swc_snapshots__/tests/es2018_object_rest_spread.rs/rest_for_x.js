var _ref;
// ForXStatement
for (var _ref1 of []){
    let { a } = _ref1, b = _object_without_properties(_ref1, [
        "a"
    ]);
}
for (_ref of []){
    ({ a } = _ref), b = _object_without_properties(_ref, [
        "a"
    ]), _ref;
}
async function a() {
    var _ref;
    for await (_ref of []){
        ({ a } = _ref), b = _object_without_properties(_ref, [
            "a"
        ]), _ref;
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
