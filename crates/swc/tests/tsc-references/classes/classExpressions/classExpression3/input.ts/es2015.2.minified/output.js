let c = new class extends class extends class {
    constructor(){
        this.a = 1;
    }
} {
    constructor(...args){
        super(...args), this.b = 2;
    }
} {
    constructor(...args1){
        super(...args1), this.c = 3;
    }
}();
c.a, c.b, c.c;
