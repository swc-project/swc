// @target: es5
// @useDefineForClassFields: true
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
