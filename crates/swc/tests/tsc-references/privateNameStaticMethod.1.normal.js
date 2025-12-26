//// [privateNameStaticMethod.ts]
class A1 {
    constructor(){
        method.call(A1, "");
        method.call(A1, 1); // Error
        method.call(A1); // Error 
    }
}
function method(param) {
    return "";
}
