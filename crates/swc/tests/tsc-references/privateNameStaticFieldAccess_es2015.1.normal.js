import * as swcHelpers from "@swc/helpers";
// @target: es2015
class A {
    constructor(){
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(A, A, _myField)); //Ok
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(this, A, _myField)); //Error
    }
}
var _myField = {
    writable: true,
    value: "hello world"
};
