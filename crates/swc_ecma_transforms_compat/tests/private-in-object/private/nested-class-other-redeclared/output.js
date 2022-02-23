let Foo = function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: 1
        });
        _classPrivateFieldInit(this, _bar, {
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
                        _classPrivateFieldInit(this, _bar1, {
                            writable: true,
                            value: 2
                        });
                    }
                    _createClass(Nested, [
                        {
                            key: "test",
                            value: function test() {
                                _foo.has(this);
                                _bar1.has(this);
                            }
                        }
                    ]);
                    return Nested;
                }();
                var _bar1 = new WeakMap();
                _foo.has(this);
                _bar.has(this);
            }
        }
    ]);
    return Foo;
}();
var _foo = new WeakMap();
var _bar = new WeakMap();
