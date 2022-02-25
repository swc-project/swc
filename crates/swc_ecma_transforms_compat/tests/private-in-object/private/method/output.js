var _foo = new WeakSet();
let Foo = function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
        _classPrivateMethodInit(this, _foo);
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
function foo() {}
