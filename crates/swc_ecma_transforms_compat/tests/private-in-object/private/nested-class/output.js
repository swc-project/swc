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
            value: function test() {
                let Nested = /*#__PURE__*/ function() {
                    function Nested() {
                        _classCallCheck(this, Nested);
                    }
                    _createClass(Nested, [
                        {
                            key: "test",
                            value: function test() {
                                _foo.has(this);
                            }
                        }
                    ]);
                    return Nested;
                }();
                _foo.has(this);
            }
        }
    ]);
    return Foo;
}();
