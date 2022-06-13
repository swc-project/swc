import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
export class B {
    print() {
        return "I am B";
    }
}
function _foo() {
    return (_foo = _async_to_generator(function*() {
        class C extends (yield import("./0")).B {
        }
        new C().print();
    })).apply(this, arguments);
}
!function() {
    return _foo.apply(this, arguments);
}();
