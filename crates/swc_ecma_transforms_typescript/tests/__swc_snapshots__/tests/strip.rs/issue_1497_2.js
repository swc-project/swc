let prop, prop1;
let _tmp = (console.log(3), 'c');
class A {
    [_tmp]() {}
    constructor(){
        this[prop] = 1;
    }
}
(()=>{
    prop = (console.log(1), 'a');
    prop1 = (console.log(2), 'b');
})();
A[prop1] = 2;
