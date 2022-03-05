import * as swcHelpers from "@swc/helpers";
export class B {
    print() {
        return "I am B";
    }
}
function _foo() {
    return (_foo = swcHelpers.asyncToGenerator(function*() {
        class C extends (yield import("./0")).B {
        }
        new C().print();
    })).apply(this, arguments);
}
!function() {
    return _foo.apply(this, arguments);
}();
