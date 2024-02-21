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
                this.C = class InnerInner {
                    m() {
                        new TestWithStatics().#prop // OK
                        ;
                        new Inner().#foo; // OK
                    }
                };
            }
            static M() {
                return class {
                    m() {
                        new TestWithStatics().#prop // OK
                        ;
                        new Inner().#foo; // OK
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
class TestNonStatics {
    #prop;
    constructor(){
        this.#prop = 0;
        this.dd = new TestNonStatics().#prop // OK
        ;
        this["X_ z_ zz"] = class Inner {
            #foo;
            m() {
                new TestNonStatics().#prop // Ok
                ;
            }
            static M() {
                return class {
                    m() {
                        new TestNonStatics().#prop // OK
                        ;
                        new Inner().#foo; // OK
                    }
                };
            }
            constructor(){
                this.#foo = 10;
                this.C = class InnerInner {
                    m() {
                        new TestNonStatics().#prop // Ok
                        ;
                        new Inner().#foo; // Ok
                    }
                };
            }
        };
    }
}
