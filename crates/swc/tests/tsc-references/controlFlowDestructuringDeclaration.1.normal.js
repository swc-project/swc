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
    var ref = [
        undefined
    ], tmp = ref[0], z = tmp === void 0 ? "" : tmp;
    z;
}
function f3() {
    var x = 1;
    x;
    var y = "";
    y;
    var ref = [
        undefined
    ], tmp = ref[0], z = tmp === void 0 ? "" : tmp;
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
    var ref = {
        z: undefined
    }, _z = ref.z, z = _z === void 0 ? "" : _z;
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
    var ref = {
        z: undefined
    }, _z = ref.z, z = _z === void 0 ? "" : _z;
    z;
}
function f6() {
    var x = {}.x;
    x;
    var y = {}.y;
    y;
    var ref = {}, _z = ref.z, z = _z === void 0 ? "" : _z;
    z;
}
function f7() {
    var o = {
        x: 1
    };
    var x = o.x;
    x;
}
