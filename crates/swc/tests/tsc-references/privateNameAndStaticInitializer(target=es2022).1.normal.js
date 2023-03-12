//// [privateNameAndStaticInitializer.ts]
class A {
    #foo;
    static{
        this.inst = new A();
    }
    #prop;
    constructor(){
        this.#foo = 1;
        this.#prop = 2;
    }
}
