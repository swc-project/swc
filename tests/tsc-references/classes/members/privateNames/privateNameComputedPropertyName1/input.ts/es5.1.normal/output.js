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
var A = // @target: esnext, es2015
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
        _a.set(this, {
            writable: true,
            value: 'a'
        });
        _b.set(this, {
            writable: true,
            value: void 0
        });
        _c.set(this, {
            writable: true,
            value: 'c'
        });
        _d.set(this, {
            writable: true,
            value: void 0
        });
        _e.set(this, {
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
