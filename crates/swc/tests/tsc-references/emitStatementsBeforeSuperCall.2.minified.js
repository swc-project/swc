//// [emitStatementsBeforeSuperCall.ts]
class Base {
}
class Sub extends Base {
    constructor(p){
        console.log('hi'), super(), this.p = p, this.field = 0;
    }
}
class Test extends Base {
    constructor(p){
        super(), this.p = p, this.prop = 1;
    }
}
