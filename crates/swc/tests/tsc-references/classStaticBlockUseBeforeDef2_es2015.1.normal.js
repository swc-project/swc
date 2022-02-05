// @target: esnext, es2022
// @noEmit: true
// @strict: true
class C {
}
var __ = {
    writable: true,
    value: (()=>{
        C.x = 1;
    })()
};
