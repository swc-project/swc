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
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
var A = // @target: esnext, es2022, es2015
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
        _classPrivateFieldInit(this, _a, {
            writable: true,
            value: 'a'
        });
        _classPrivateFieldInit(this, _b, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldInit(this, _c, {
            writable: true,
            value: 'c'
        });
        _classPrivateFieldInit(this, _d, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldInit(this, _e, {
            writable: true,
            value: ''
        });
        _classPrivateFieldSet(this, _b, 'b');
        _classPrivateFieldSet(this, _d, 'd');
    }
    _createClass(A, [
        _defineProperty({
            key: "test"
        }, "value", function test() {
            var data = {
                a: 'a',
                b: 'b',
                c: 'c',
                d: 'd',
                e: 'e'
            };
            var a = data[_classPrivateFieldGet(this, _a)], b = data[_classPrivateFieldGet(this, _b)], c = data[_classPrivateFieldGet(this, _c)], d = data[_classPrivateFieldGet(this, _d)], e = data[_classPrivateFieldSet(this, _e, 'e')];
            console.log(a, b, c, d, e);
            var a1 = data[_classPrivateFieldGet(this, _a)];
            var b1 = data[_classPrivateFieldGet(this, _b)];
            var c1 = data[_classPrivateFieldGet(this, _c)];
            var d1 = data[_classPrivateFieldGet(this, _d)];
            var e1 = data[_classPrivateFieldGet(this, _e)];
            console.log(a1, b1, c1, d1);
        })
    ]);
    return A;
}();
var _a = new WeakMap();
var _b = new WeakMap();
var _c = new WeakMap();
var _d = new WeakMap();
var _e = new WeakMap();
new A().test();
