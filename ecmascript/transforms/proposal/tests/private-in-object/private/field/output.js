let Foo = function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
        _foo.set(this, {
            writable: true,
            value: 1
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
var _foo = new WeakMap();
