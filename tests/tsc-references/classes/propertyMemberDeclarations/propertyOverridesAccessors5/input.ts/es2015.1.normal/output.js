// @target: esnext
// @useDefineForClassFields: true
class A {
    get p() {
        return 'oh no';
    }
}
class B extends A {
    constructor(p){
        super();
        this.p = p;
    }
}
