let prop, prop1;
class A {
    constructor(){
        this[prop] = 1;
    }
}
(()=>{
    prop = (console.log(1), 'a');
    prop1 = (console.log(2), 'b');
})();
A[prop1] = 2;
