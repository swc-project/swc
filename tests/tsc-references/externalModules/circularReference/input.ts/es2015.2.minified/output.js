var M1;
(M1 || (M1 = {
})).C1 = class {
    constructor(){
        this.m1 = new (require("./foo2")).M1.C1(), this.m1.y = 10, this.m1.x = 20;
    }
}, (M1 || (M1 = {
})).C1 = class {
    constructor(){
        this.m1 = new (require("./foo1")).M1.C1(), this.m1.y = 10, this.m1.x = 20;
        var tmp = new M1.C1();
        tmp.y = 10, tmp.x = 20;
    }
};
