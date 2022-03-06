function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var receiver, descriptor, descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
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
var _name = new WeakMap(), Foo = function() {
    "use strict";
    function Foo(name) {
        var receiver, privateMap, value, descriptor;
        _classCallCheck(this, Foo), _classPrivateFieldInit(this, _name, {
            writable: !0,
            value: void 0
        }), receiver = this, privateMap = _name, value = name, descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"), (function(receiver, descriptor, value) {
            if (descriptor.set) descriptor.set.call(receiver, value);
            else {
                if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                descriptor.value = value;
            }
        })(receiver, descriptor, value);
    }
    return _createClass(Foo, [
        {
            key: "getValue",
            value: function(x) {
                var _y = new WeakMap(), tmp = _classPrivateFieldGet(this, _name), Bar = function() {
                    function Bar() {
                        _classCallCheck(this, Bar), _classPrivateFieldInit(this, _y, {
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
                }();
                return new Bar()[_classPrivateFieldGet(this, _name)]();
            }
        }
    ]), Foo;
}();
console.log(new Foo("NAME").getValue(100));
