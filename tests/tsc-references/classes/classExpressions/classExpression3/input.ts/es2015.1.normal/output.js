let C = class _class extends class _class extends class _class {
    constructor(){
        this.a = 1;
    }
} {
    constructor(...args){
        super(...args);
        this.b = 2;
    }
} {
    constructor(...args1){
        super(...args1);
        this.c = 3;
    }
};
let c = new C();
c.a;
c.b;
c.c;
