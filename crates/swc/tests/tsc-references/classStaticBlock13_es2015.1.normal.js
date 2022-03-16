import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es2015
// @useDefineForClassFields: true
class C {
    foo() {
        return swcHelpers.classStaticPrivateFieldSpecGet(C, C, _x);
    }
}
var _x = {
    writable: true,
    value: 123
};
var __ = {
    writable: true,
    value: (()=>{
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(C, C, _x));
    })()
};
