class C {
    static foo(x) {}
    static bar(x) {}
    static get sc() {
        return 1;
    }
    static set sc(x) {}
    static get sd() {
        return 1;
    }
    baz(x) {
        return '';
    }
    get ic() {
        return 1;
    }
    set ic(x) {}
    get id() {
        return 1;
    }
    constructor(x){
        this.x = x, this.ia = 1, this.ib = ()=>this.ia;
    }
}
C.sa = 1, C.sb = ()=>1;
