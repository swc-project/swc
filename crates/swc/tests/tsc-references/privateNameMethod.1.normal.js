//// [privateNameMethod.ts]
var _method = new WeakSet();
class A1 {
    constructor(name){
        _method.add(this);
        method.call(this, "");
        method.call(this, 1); // Error
        method.call(this); // Error 
    }
}
function method(param) {
    return "";
}
