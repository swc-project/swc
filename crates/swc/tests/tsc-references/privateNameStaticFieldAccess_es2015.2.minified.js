import * as swcHelpers from "@swc/helpers";
class A {
    constructor(){
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(A, A, _myField)), console.log(swcHelpers.classStaticPrivateFieldSpecGet(this, A, _myField));
    }
}
var _myField = {
    writable: !0,
    value: "hello world"
};
