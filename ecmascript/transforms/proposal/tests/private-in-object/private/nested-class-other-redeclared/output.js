let Foo = function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
        _foo1.set(this, {
            writable: true,
            value: 1
        });
        _bar1.set(this, {
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
                        _bar.set(this, {
                            writable: true,
                            value: 2
                        });
                    }
                    _createClass(Nested, [
                        {
                            key: "test",
                            value: function test() {
                                _foo.has(this);
                                _bar.has(this);
                            }
                        }
                    ]);
                    return Nested;
                }();
                var _bar = new WeakMap();
                _foo1.has(this);
                _bar1.has(this);
            }
        }
    ]);
    return Foo;
}();
var _foo1 = new WeakMap();
var _bar1 = new WeakMap();
