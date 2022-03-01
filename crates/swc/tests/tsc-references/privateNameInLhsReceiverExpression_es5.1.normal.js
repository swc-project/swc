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
var _y = new WeakMap();
var Test = // @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _classCallCheck(this, Test);
        _classPrivateFieldInit(this, _y, {
            writable: true,
            value: 123
        });
    }
    _createClass(Test, null, [
        {
            key: "something",
            value: function something(obj) {
                var _s;
                var _x, _x1;
                _classPrivateFieldSet(obj[(new (_x = new WeakMap(), function _class() {
                    _classCallCheck(this, _class);
                    _classPrivateFieldInit(this, _x, {
                        writable: true,
                        value: 1
                    });
                    this.s = "prop";
                })).s], _y, 1);
                _classPrivateFieldSet(_s = obj[(new (_x1 = new WeakMap(), function _class() {
                    _classCallCheck(this, _class);
                    _classPrivateFieldInit(this, _x1, {
                        writable: true,
                        value: 1
                    });
                    this.s = "prop";
                })).s], _y, _classPrivateFieldGet(_s, _y) + 1);
            }
        }
    ]);
    return Test;
}();
