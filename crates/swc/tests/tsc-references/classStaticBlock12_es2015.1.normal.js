// @useDefineForClassFields: false
// @target: es2015
class C {
}
var _x = {
    writable: true,
    value: 1
};
var __ = {
    writable: true,
    value: (()=>{
        C.#x;
    })()
};
