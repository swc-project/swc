//// [classExpressionES63.ts]
let c = new class extends class extends class {
    constructor(){
        this.c = 3, this.b = 2, this.a = 1;
    }
} {
} {
}();
c.a, c.b, c.c;
