import * as swcHelpers from "@swc/helpers";
var _method = /*#__PURE__*/ new WeakSet();
// @target: es2015
class A3 {
    constructor(a, b){
        swcHelpers.classPrivateMethodInit(this, _method);
        swcHelpers.classPrivateFieldSet(this, _method, ()=>{} // Error, not writable 
        );
        swcHelpers.classPrivateFieldSet(a, _method, ()=>{}); // Error, not writable 
        swcHelpers.classPrivateFieldSet(b, _method, ()=>{} //Error, not writable 
        );
        ({ x: swcHelpers.classPrivateFieldDestructureSet(this, _method).value  } = {
            x: ()=>{}
        }); //Error, not writable 
        let x = swcHelpers.classPrivateMethodGet(this, _method, method);
        swcHelpers.classPrivateFieldUpdate(b, _method).value++ //Error, not writable 
        ;
    }
}
function method() {}
