//// [controlFlowDestructuringDeclaration.ts]
function f1() {
    var x = 1;
    x;
    var y = "";
    y;
}
function f2() {
    var x = 1;
    x;
    var y = "";
    y;
    var _ref = [
        undefined
    ], tmp = _ref[0], z = tmp === void 0 ? "" : tmp;
    z;
}
function f3() {
    var x = 1;
    x;
    var y = "";
    y;
    var _ref = [
        undefined
    ], tmp = _ref[0], z = tmp === void 0 ? "" : tmp;
    z;
}
function f4() {
    var x = {
        x: 1
    }.x;
    x;
    var y = {
        y: ""
    }.y;
    y;
    var _ref = {
        z: undefined
    }, _ref_z = _ref.z, z = _ref_z === void 0 ? "" : _ref_z;
    z;
}
function f5() {
    var x = {
        x: 1
    }.x;
    x;
    var y = {
        y: ""
    }.y;
    y;
    var _ref = {
        z: undefined
    }, _ref_z = _ref.z, z = _ref_z === void 0 ? "" : _ref_z;
    z;
}
function f6() {
    var x = {}.x;
    x;
    var y = {}.y;
    y;
    var _ref = {}, _ref_z = _ref.z, z = _ref_z === void 0 ? "" : _ref_z;
    z;
}
function f7() {
    var o = {
        x: 1
    };
    var x = o.x;
    x;
}
