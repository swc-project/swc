var _foo = new WeakMap();
let Foo = function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
        _foo.set(this, {
            get: foo,
            set: void 0
        });
    }
    _createClass(Foo, [
        {
            key: "test",
            value: function test(other) {
                return _foo.has(other);
            }
        }
    ]);
    return Foo;
}();
function foo() {
}
