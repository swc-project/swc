// @target: es2015
// @useDefineForClassFields: true
class A {
    get p() {
        return 'oh no';
    }
}
class B extends A {
    constructor(...args){
        super(...args);
        this.p // error
         = 'yep';
    }
}
class C {
    get p() {
        return this._secret;
    }
    set p(value) {
        this._secret = value;
    }
    constructor(){
        this._secret = 11;
    }
}
class D extends C {
    constructor(...args1){
        super(...args1);
        this.p // error
         = 101;
    }
}
