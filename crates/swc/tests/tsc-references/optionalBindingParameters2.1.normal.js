//// [optionalBindingParameters2.ts]
function foo(param) {
    var x = param.x, y = param.y, z = param.z;
}
foo({
    x: "",
    y: 0,
    z: false
});
foo({
    x: false,
    y: 0,
    z: ""
});
