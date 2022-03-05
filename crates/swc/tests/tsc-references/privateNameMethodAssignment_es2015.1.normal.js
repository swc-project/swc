import * as swcHelpers from "@swc/helpers";
var _method = new WeakSet();
// @target: es2015
class A3 {
    constructor(a, b){
        var _b, _this_method;
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
        swcHelpers.classPrivateFieldSet(_b = b, _method, (_this_method = +swcHelpers.classPrivateMethodGet(_b, _method, method)) + 1), _this_method; //Error, not writable 
    }
}
function method() {}
