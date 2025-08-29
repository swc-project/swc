import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
class Foo {
    static{
        class Bar {
            static #x() {}
            foo() {}
            static{
                _ts_decorate([
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
                _ts_decorate([
                    Bar.#x
                ], Bar.prototype, "foo", null);
            }
        }
    }
    static{
        _ts_decorate([
            Foo.#y
        ], Foo.prototype, "foo", null);
    }
}
