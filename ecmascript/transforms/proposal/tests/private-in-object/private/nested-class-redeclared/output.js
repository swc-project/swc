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
            value: function test() {
                let Nested = function() {
                    function Nested() {
                        _classCallCheck(this, Nested);
                        _foo1.set(this, {
                            writable: true,
                            value: 2
                        });
                    }
                    _createClass(Nested, [
                        {
                            key: "test",
                            value: function test() {
                                _foo1.has(this);
                            }
                        }
                    ]);
                    return Nested;
                }();
                var _foo1 = new WeakMap();
                _foo.has(this);
            }
        }
    ]);
    return Foo;
}();
var _foo = new WeakMap();
