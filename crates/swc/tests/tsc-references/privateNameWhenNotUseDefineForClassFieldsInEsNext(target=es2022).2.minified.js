//// [privateNameWhenNotUseDefineForClassFieldsInEsNext.ts]
class TestWithStatics {
    #prop = 0;
    static dd = new TestWithStatics().#prop;
    static "X_ z_ zz" = class Inner {
        #foo = 10;
        m() {
            new TestWithStatics().#prop;
        }
        static C = class {
            m() {
                new TestWithStatics().#prop, new Inner().#foo;
            }
        };
        static M() {
            return class {
                m() {
                    new TestWithStatics().#prop, new Inner().#foo;
                }
            };
        }
    };
}
class TestNonStatics {
    #prop = 0;
    dd = new TestNonStatics().#prop;
    "X_ z_ zz" = class Inner {
        #foo = 10;
        m() {
            new TestNonStatics().#prop;
        }
        C = class {
            m() {
                new TestNonStatics().#prop, new Inner().#foo;
            }
        };
        static M() {
            return class {
                m() {
                    new TestNonStatics().#prop, new Inner().#foo;
                }
            };
        }
    };
}
