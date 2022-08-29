//// [privateIdentifierChain.1.ts]
class A {
    #b;
    getA() {
        return new A();
    }
    constructor(){
        this?.#b; // Error
        this?.a.#b; // Error
        this?.getA().#b; // Error
    }
}
