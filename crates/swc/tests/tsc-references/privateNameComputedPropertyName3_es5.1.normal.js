function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var Foo = // @target: esnext, es2015
/*#__PURE__*/ function() {
    "use strict";
    function Foo(name) {
        _classCallCheck(this, Foo);
        _name.set(this, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _name, name);
    }
    _createClass(Foo, [
        {
            key: "getValue",
            value: function getValue(x) {
                var obj = this;
                var tmp = _classPrivateFieldGet(obj, _name);
                var Bar = /*#__PURE__*/ function() {
                    function Bar() {
                        _classCallCheck(this, Bar);
                        _y.set(this, {
                            writable: true,
                            value: 100
                        });
                    }
                    _createClass(Bar, [
                        {
                            key: tmp,
                            value: function value() {
                                return x + _classPrivateFieldGet(this, _y);
                            }
                        }
                    ]);
                    return Bar;
                }();
                var _y = new WeakMap();
                return new Bar()[_classPrivateFieldGet(obj, _name)]();
            }
        }
    ]);
    return Foo;
}();
var _name = new WeakMap();
console.log(new Foo("NAME").getValue(100));
