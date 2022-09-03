//// [privateIdentifierChain.1.ts]
class A {
    #b;
    getA() {
        return new A();
    }
    constructor(){
        this?.#b, this?.a.#b, this?.getA().#b;
    }
}
