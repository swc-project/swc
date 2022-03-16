import * as swcHelpers from "@swc/helpers";
// @target: es2015
class A3 {
    constructor(a, b){
        var _this_method;
        swcHelpers.classStaticPrivateFieldSpecSet(A3, A3, _method, ()=>{} // Error, not writable 
        );
        swcHelpers.classStaticPrivateFieldSpecSet(a, A3, _method, ()=>{}); // Error, not writable 
        swcHelpers.classStaticPrivateFieldSpecSet(b, A3, _method, ()=>{} //Error, not writable 
        );
        ({ x: swcHelpers.classStaticPrivateFieldDestructureSet(A3, _method).value  } = {
            x: ()=>{}
        }); //Error, not writable 
        let x = swcHelpers.classStaticPrivateMethodGet(A3, A3, method);
        swcHelpers.classStaticPrivateFieldSpecSet(b, A3, _method, (_this_method = +swcHelpers.classStaticPrivateMethodGet(b, A3, method)) + 1), _this_method; //Error, not writable 
    }
}
function method() {}
