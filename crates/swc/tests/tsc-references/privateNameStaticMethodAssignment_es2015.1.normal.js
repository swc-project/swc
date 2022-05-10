import * as swcHelpers from "@swc/helpers";
// @target: es2015
class A3 {
    constructor(a, b){
        swcHelpers.classStaticPrivateFieldSpecSet(A3, A3, _method, ()=>{} // Error, not writable 
        );
        swcHelpers.classStaticPrivateFieldSpecSet(a, A3, _method, ()=>{}); // Error, not writable 
        swcHelpers.classStaticPrivateFieldSpecSet(b, A3, _method, ()=>{} //Error, not writable 
        );
        ({ x: swcHelpers.classStaticPrivateFieldDestructureSet(A3, A3, _method).value  } = {
            x: ()=>{}
        }); //Error, not writable 
        let x = swcHelpers.classStaticPrivateMethodGet(A3, A3, method);
        swcHelpers.classStaticPrivateFieldUpdate(b, A3, _method).value++ //Error, not writable 
        ;
    }
}
function method() {}
