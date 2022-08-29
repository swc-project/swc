//// [privateNameErrorsOnNotUseDefineForClassFieldsInEsNext.ts]
class TestWithErrors {
    #prop = 0;
    static dd = new TestWithErrors().#prop;
    static ["X_ z_ zz"] = class Inner {
        #foo = 10;
        m() {
            new TestWithErrors().#prop // Err
            ;
        }
        static C = class InnerInner {
            m() {
                new TestWithErrors().#prop // Err
                ;
                new Inner().#foo; // Err
            }
        };
        static M() {
            return class {
                m() {
                    new TestWithErrors().#prop // Err
                    ;
                    new Inner().#foo; // OK
                }
            };
        }
    };
}
class TestNoErrors {
    #prop = 0;
    dd = new TestNoErrors().#prop;
    ["X_ z_ zz"] = class Inner {
        #foo = 10;
        m() {
            new TestNoErrors().#prop // Ok
            ;
        }
        C = class InnerInner {
            m() {
                new TestNoErrors().#prop // Ok
                ;
                new Inner().#foo; // Ok
            }
        };
        static M() {
            return class {
                m() {
                    new TestNoErrors().#prop // OK
                    ;
                    new Inner().#foo; // OK
                }
            };
        }
    };
}
