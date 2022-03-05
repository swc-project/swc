import * as swcHelpers from "@swc/helpers";
var _method = new WeakSet();
// @strict: true
// @target: es6
class A1 {
    constructor(name){
        swcHelpers.classPrivateMethodInit(this, _method);
        swcHelpers.classPrivateMethodGet(this, _method, method).call(this, "");
        swcHelpers.classPrivateMethodGet(this, _method, method).call(this, 1) // Error
        ;
        swcHelpers.classPrivateMethodGet(this, _method, method).call(this) // Error 
        ;
    }
}
function method(param) {
    return "";
}
