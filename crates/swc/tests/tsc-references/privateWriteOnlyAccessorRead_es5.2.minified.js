function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    return !function(receiver, descriptor, value) {
        if (descriptor.set) descriptor.set.call(receiver, value);
        else {
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        }
    }(receiver, descriptor, value), value;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function _classPrivateFieldDestructureSet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    return (function(receiver, descriptor) {
        if (descriptor.set) return "__destrObj" in descriptor || (descriptor.__destrObj = {
            set value (v){
                descriptor.set.call(receiver, v);
            }
        }), descriptor.__destrObj;
        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
        return descriptor;
    })(receiver, descriptor);
}
var _value = new WeakMap(), _valueRest = new WeakMap(), _valueOne = new WeakMap(), _valueCompound = new WeakMap(), Test = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Test() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Test), _classPrivateFieldInit(this, _value, {
            get: void 0,
            set: set_value
        }), _classPrivateFieldInit(this, _valueRest, {
            get: void 0,
            set: set_valueRest
        }), _classPrivateFieldInit(this, _valueOne, {
            get: void 0,
            set: set_valueOne
        }), _classPrivateFieldInit(this, _valueCompound, {
            get: void 0,
            set: set_valueCompound
        });
    }
    return Constructor = Test, protoProps = [
        {
            key: "m",
            value: function() {
                var ref, _tmp, ref1, _tmp1, arr, foo = {
                    bar: 1
                };
                console.log(_classPrivateMethodGet(this, _value, value)), _classPrivateFieldSet(this, _value, {
                    foo: foo
                }), _classPrivateFieldSet(this, _value, {
                    foo: foo
                }), _classPrivateMethodGet(this, _value, value).foo = foo, ref = {
                    o: {
                        foo: foo
                    }
                }, _classPrivateFieldDestructureSet(this, _value).value = ref.o, _tmp = {
                    foo: foo
                }, _classPrivateFieldDestructureSet(this, _value).value = _extends({}, _tmp), ref1 = {
                    foo: foo
                }, _classPrivateMethodGet(this, _value, value).foo = ref1.foo, _tmp1 = {
                    foo: foo
                }, _classPrivateMethodGet(this, _value, value).foo = _extends({}, _tmp1.foo), _tmp1.foo, _classPrivateMethodGet(this, _value, value), _classPrivateFieldDestructureSet(this, _valueOne).value = 1, _classPrivateFieldDestructureSet(this, _valueRest).value = [
                    2,
                    3
                ], [
                    _classPrivateMethodGet(this, _valueOne, valueOne)
                ].concat(function(arr) {
                    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
                }(arr = _classPrivateMethodGet(this, _valueRest, valueRest)) || function(iter) {
                    if ("undefined" != typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
                }(arr) || function(o, minLen) {
                    if (o) {
                        if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
                        var n = Object.prototype.toString.call(o).slice(8, -1);
                        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
                        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
                    }
                }(arr) || function() {
                    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                }()), _classPrivateFieldSet(this, _valueCompound, _classPrivateMethodGet(this, _valueCompound, valueCompound) + 3);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Test;
}();
function set_value(v) {}
function set_valueRest(v) {}
function set_valueOne(v) {}
function set_valueCompound(v) {}
new Test().m();
