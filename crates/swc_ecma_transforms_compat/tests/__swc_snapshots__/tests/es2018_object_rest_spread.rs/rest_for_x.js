// ForXStatement
for (var _ref of []){
    let { a } = _ref, b = _object_without_properties(_ref, [
        "a"
    ]);
}
for (_ref1 of []){
    ({ a } = _ref1), b = _object_without_properties(_ref1, [
        "a"
    ]), _ref1;
}
var _ref1;
async function a() {
    for await (_ref of []){
        ({ a } = _ref), b = _object_without_properties(_ref, [
            "a"
        ]), _ref;
    }
    var _ref;
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
