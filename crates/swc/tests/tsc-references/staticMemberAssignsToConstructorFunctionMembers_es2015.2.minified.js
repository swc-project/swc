class C {
    static foo() {
        C.foo = ()=>{};
    }
    static bar(x) {
        return C.bar = ()=>{}, C.bar = (x)=>x, C.bar = (x)=>1, 1;
    }
}
