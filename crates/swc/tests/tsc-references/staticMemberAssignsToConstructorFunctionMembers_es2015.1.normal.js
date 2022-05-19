class C {
    static foo() {
        C.foo = ()=>{};
    }
    static bar(x1) {
        C.bar = ()=>{} // error
        ;
        C.bar = (x)=>x; // ok
        C.bar = (x)=>1; // ok
        return 1;
    }
}
