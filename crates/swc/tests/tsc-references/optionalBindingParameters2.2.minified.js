//// [optionalBindingParameters2.ts]
!function(param) {
    param.x, param.y, param.z;
}({
    x: "",
    y: 0,
    z: !1
}), function(param) {
    param.x, param.y, param.z;
}({
    x: !1,
    y: 0,
    z: ""
});
