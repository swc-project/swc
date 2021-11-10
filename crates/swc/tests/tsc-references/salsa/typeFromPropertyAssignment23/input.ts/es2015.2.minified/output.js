class B {
    foo() {
    }
    constructor(){
        this.n = 1;
    }
}
(class extends B {
}).prototype.foo = function() {
}, (class extends B {
}).prototype.foo = ()=>{
    this.n = "not checked, so no error";
};
class Module {
}
Module.prototype.identifier = void 0, Module.prototype.size = null;
