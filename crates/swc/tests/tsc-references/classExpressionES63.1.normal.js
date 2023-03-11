//// [classExpressionES63.ts]
let C = class extends class extends class {
    constructor(){
        this.c = 3;
        this.b = 2;
        this.a = 1;
    }
} {
} {
};
let c = new C();
c.a;
c.b;
c.c;
