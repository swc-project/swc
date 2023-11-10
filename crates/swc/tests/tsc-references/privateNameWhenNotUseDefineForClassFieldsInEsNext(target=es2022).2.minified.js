//// [privateNameWhenNotUseDefineForClassFieldsInEsNext.ts]
class TestWithStatics {
    #prop;
    static{
        this.dd = new TestWithStatics().#prop;
    }
    static{
        this["X_ z_ zz"] = class Inner {
            #foo;
            m() {
                new TestWithStatics().#prop;
            }
            static{
                this.C = class {
                    m() {
                        new TestWithStatics().#prop, new Inner().#foo;
                    }
                };
            }
            static M() {
                return class {
                    m() {
                        new TestWithStatics().#prop, new Inner().#foo;
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
