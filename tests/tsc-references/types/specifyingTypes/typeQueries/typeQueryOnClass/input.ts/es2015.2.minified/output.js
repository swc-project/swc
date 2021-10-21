class C {
    static foo(x) {
    }
    static bar(x1) {
    }
    static get sc() {
        return 1;
    }
    static set sc(x2) {
    }
    static get sd() {
        return 1;
    }
    baz(x3) {
        return "";
    }
    get ic() {
        return 1;
    }
    set ic(x4) {
    }
    get id() {
        return 1;
    }
    constructor(x5){
        this.x = x5, this.ia = 1, this.ib = ()=>this.ia
        ;
    }
}
C.sa = 1, C.sb = ()=>1
;
