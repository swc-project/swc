//// [accessorsOverrideProperty6.ts]
class A {
    constructor(){
        this.p = 'yep';
    }
}
class B extends A {
    get p() {
        return 'oh no';
    }
}
class C {
    constructor(){
        this.p = 101;
    }
}
class D extends C {
    get p() {
        return this._secret;
    }
    set p(value) {
        this._secret = value;
    }
    constructor(...args){
        super(...args), this._secret = 11;
    }
}
