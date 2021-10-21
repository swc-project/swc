// @useDefineForClassFields: false
// @target: es2015
class Base {
}
class Sub extends Base {
    // @ts-ignore
    constructor(p){
        console.log('hi'); // should emit before super
        super();
        this.p = p;
        this.field = 0;
    }
}
class Test extends Base {
    // @ts-ignore
    constructor(p1){
        1; // should emit before super
        super();
        this.p = p1;
        this.prop = 1;
    }
}
