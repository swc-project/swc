var _foo = new WeakMap(), _bar = new WeakMap();
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
                var _bar1 = new WeakMap();
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
                _foo.has(this);
                _bar.has(this);
            }
        }
    ]);
    return Foo;
}();
