//// [propertyOverridesAccessors5.ts]
class A {
    get p() {
        return 'oh no';
    }
}
class B extends A {
    p;
    constructor(p){
        super(), this.p = p;
    }
}
