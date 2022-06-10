class C {
    foo() {
        C.prototype.foo = ()=>{};
    }
    bar(x1) {
        return C.prototype.bar = ()=>{}, C.prototype.bar = (x)=>x, C.prototype.bar = (x)=>1, 1;
    }
}
