function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
var Foo = function() {
    "use strict";
    function Foo(name) {
        _classCallCheck(this, Foo), _name.set(this, {
            writable: !0,
            value: void 0
        }), (function(receiver, privateMap, value) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
            var descriptor = privateMap.get(receiver);
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        })(this, _name, name);
    }
    return _createClass(Foo, [
        {
            key: "getValue",
            value: function(x) {
                var tmp = _classPrivateFieldGet(this, _name), Bar = function() {
                    function Bar() {
                        _classCallCheck(this, Bar), _y.set(this, {
                            writable: !0,
                            value: 100
                        });
                    }
                    return _createClass(Bar, [
                        {
                            key: tmp,
                            value: function() {
                                return x + _classPrivateFieldGet(this, _y);
                            }
                        }
                    ]), Bar;
                }(), _y = new WeakMap();
                return new Bar()[_classPrivateFieldGet(this, _name)]();
            }
        }
    ]), Foo;
}(), _name = new WeakMap();
console.log(new Foo("NAME").getValue(100));
