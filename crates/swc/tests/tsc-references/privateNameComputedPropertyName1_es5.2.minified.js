function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var A = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function A() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, A), _a.set(this, {
            writable: !0,
            value: "a"
        }), _b.set(this, {
            writable: !0,
            value: void 0
        }), _c.set(this, {
            writable: !0,
            value: "c"
        }), _d.set(this, {
            writable: !0,
            value: void 0
        }), _e.set(this, {
            writable: !0,
            value: ""
        }), _classPrivateFieldSet(this, _b, "b"), _classPrivateFieldSet(this, _d, "d");
    }
    return Constructor = A, protoProps = [
        function(obj, key, value) {
            return key in obj ? Object.defineProperty(obj, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : obj[key] = value, obj;
        }({
            key: "test"
        }, "value", function() {
            var data = {
                a: "a",
                b: "b",
                c: "c",
                d: "d",
                e: "e"
            }, a = data[_classPrivateFieldGet(this, _a)], b = data[_classPrivateFieldGet(this, _b)], c = data[_classPrivateFieldGet(this, _c)], d = data[_classPrivateFieldGet(this, _d)], e = data[_classPrivateFieldSet(this, _e, "e")];
            console.log(a, b, c, d, e);
            var a1 = data[_classPrivateFieldGet(this, _a)], b1 = data[_classPrivateFieldGet(this, _b)], c1 = data[_classPrivateFieldGet(this, _c)], d1 = data[_classPrivateFieldGet(this, _d)];
            data[_classPrivateFieldGet(this, _e)], console.log(a1, b1, c1, d1);
        })
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), A;
}(), _a = new WeakMap(), _b = new WeakMap(), _c = new WeakMap(), _d = new WeakMap(), _e = new WeakMap();
new A().test();
