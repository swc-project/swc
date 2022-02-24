function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
        descriptor.set.call(receiver, value);
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
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
var _name = new WeakMap();
var Foo = // @target: esnext, es2022, es2015
/*#__PURE__*/ function() {
    "use strict";
    function Foo(name) {
        _classCallCheck(this, Foo);
        _classPrivateFieldInit(this, _name, {
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
                var _y = new WeakMap(), tmp = _classPrivateFieldGet(obj, _name);
                var Bar = /*#__PURE__*/ function() {
                    function Bar() {
                        _classCallCheck(this, Bar);
                        _classPrivateFieldInit(this, _y, {
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
                return new Bar()[_classPrivateFieldGet(obj, _name)]();
            }
        }
    ]);
    return Foo;
}();
console.log(new Foo("NAME").getValue(100));
