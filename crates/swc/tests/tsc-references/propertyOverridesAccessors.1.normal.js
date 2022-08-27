//// [propertyOverridesAccessors.ts]
class A {
    get p() {
        return 'oh no';
    }
}
class B extends A {
    constructor(...args){
        super(...args);
        this.p = 'yep' // error
        ;
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
    constructor(...args){
        super(...args);
        this.p = 101 // error
        ;
    }
}
