import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
function outer() {
    function _class_call_check(e, t) {
        if (!_instanceof(e, t)) throw new TypeError("bad");
    }
    function _instanceof1(e) {
        return new ZodCustom(e);
    }
    eval("");
    var Foo = function Foo() {
        _class_call_check(this, Foo);
    };
    new Foo();
    var ZodCustom = function ZodCustom(v) {
        this.v = v;
    };
}
outer();
