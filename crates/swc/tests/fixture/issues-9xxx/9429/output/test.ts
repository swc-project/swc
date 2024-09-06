var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
class Foo {
    static{
        class Bar {
            static #x() {}
            foo() {}
            static{
                _ts_decorate._([
                    Bar.#x
                ], Bar.prototype, "foo", null);
            }
        }
    }
    static #y() {}
    foo() {}
    static{
        class Bar {
            static #x() {}
            foo() {}
            static{
                _ts_decorate._([
                    Bar.#x
                ], Bar.prototype, "foo", null);
            }
        }
    }
    static{
        _ts_decorate._([
            Foo.#y
        ], Foo.prototype, "foo", null);
    }
}
