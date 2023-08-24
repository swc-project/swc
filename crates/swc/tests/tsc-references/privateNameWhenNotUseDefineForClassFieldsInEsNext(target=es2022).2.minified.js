//// [privateNameWhenNotUseDefineForClassFieldsInEsNext.ts]
class TestWithStatics {
    #prop;
    static{
        this.dd = new TestWithStatics().#prop // OK
        ;
    }
    static{
        this["X_ z_ zz"] = class Inner {
            #foo;
            m() {
                new TestWithStatics().#prop // OK
                ;
            }
            static{
                this.C = class {
                    m() {
                        new TestWithStatics().#prop // OK
                        , new Inner().#foo;
                    }
                };
            }
            static M() {
                return class {
                    m() {
                        new TestWithStatics().#prop // OK
                        , new Inner().#foo;
                    }
                };
            }
            constructor(){
                this.#foo = 10;
            }
        };
    }
    constructor(){
        this.#prop = 0;
    }
}
