var _foo = new WeakMap();
let Foo = function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
        _classPrivateFieldInit(this, _foo, {
            get: get_foo,
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
function get_foo() {}
