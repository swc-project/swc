//// [optionalBindingParameters2.ts]
function foo(param) {
    param.x, param.y, param.z;
}
foo({
    x: "",
    y: 0,
    z: !1
}), foo({
    x: !1,
    y: 0,
    z: ""
});
