class C {
    foo() {
        C.prototype.foo = ()=>{};
    }
    bar(x) {
        return C.prototype.bar = ()=>{}, C.prototype.bar = (x)=>x, C.prototype.bar = (x)=>1, 1;
    }
}
