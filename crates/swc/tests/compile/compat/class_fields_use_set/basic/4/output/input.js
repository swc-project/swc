class Foo {
    #b;
    static{
        this.c = 3;
    }
    static #d = 4;
    foo() {
        class Bar {
            #b;
            static{
                this.c = 3;
            }
            static #d = 4;
            constructor(){
                this.a = 1;
                this.#b = 2;
            }
        }
    }
    constructor(){
        this.a = 1;
        this.#b = 2;
    }
}
