//// [privateNameErrorsOnNotUseDefineForClassFieldsInEsNext.ts]
class TestWithErrors {
    #prop = 0;
    static dd = new TestWithErrors().#prop;
    static "X_ z_ zz" = class Inner {
        #foo = 10;
        m() {
            new TestWithErrors().#prop;
        }
        static C = class {
            m() {
                new TestWithErrors().#prop, new Inner().#foo;
            }
        };
        static M() {
            return class {
                m() {
                    new TestWithErrors().#prop, new Inner().#foo;
                }
            };
        }
    };
}
class TestNoErrors {
    #prop = 0;
    dd = new TestNoErrors().#prop;
    "X_ z_ zz" = class Inner {
        #foo = 10;
        m() {
            new TestNoErrors().#prop;
        }
        C = class {
            m() {
                new TestNoErrors().#prop, new Inner().#foo;
            }
        };
        static M() {
            return class {
                m() {
                    new TestNoErrors().#prop, new Inner().#foo;
                }
            };
        }
    };
}
