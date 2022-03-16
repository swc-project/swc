var _foo = /*#__PURE__*/ new WeakMap();
let Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
        _classPrivateFieldInit(this, _foo, {
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
