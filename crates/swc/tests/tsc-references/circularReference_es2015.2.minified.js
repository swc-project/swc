let foo2 = require('./foo2');
export var M1;
(M1 || (M1 = {})).C1 = class {
    constructor(){
        this.m1 = new foo2.M1.C1(), this.m1.y = 10, this.m1.x = 20;
    }
};
let foo1 = require('./foo1');
(M1 || (M1 = {})).C1 = class {
    constructor(){
        this.m1 = new foo1.M1.C1(), this.m1.y = 10, this.m1.x = 20;
        var tmp = new M1.C1();
        tmp.y = 10, tmp.x = 20;
    }
};
