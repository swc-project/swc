//// [classExpressionES63.ts]
let c = new class extends class extends class {
    constructor(){
        this.a = 1;
    }
} {
    constructor(...args){
        super(...args), this.b = 2;
    }
} {
    constructor(...args){
        super(...args), this.c = 3;
    }
}();
c.a, c.b, c.c;
