import * as swcHelpers from "@swc/helpers";
var _ref, _method = new WeakSet();
// @target: es2015
class C {
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _method);
    }
}
C.s = swcHelpers.classPrivateMethodGet(_ref = new C(), _method, method).call(_ref);
function method() {
    return 42;
}
console.log(C.s);
