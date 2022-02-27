function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classApplyDescriptorDestructureSet(receiver, descriptor) {
    if (descriptor.set) {
        if (!("__destrObj" in descriptor)) {
            descriptor.__destrObj = {
                set value (v){
                    descriptor.set.call(receiver, v);
                }
            };
        }
        return descriptor.__destrObj;
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        return descriptor;
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
function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _classPrivateFieldDestructureSet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    return _classApplyDescriptorDestructureSet(receiver, descriptor);
}
var _value = new WeakMap(), _valueRest = new WeakMap(), _valueOne = new WeakMap(), _valueCompound = new WeakMap();
var Test = // @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _classCallCheck(this, Test);
        _classPrivateFieldInit(this, _value, {
            get: void 0,
            set: set_value
        });
        _classPrivateFieldInit(this, _valueRest, {
            get: void 0,
            set: set_valueRest
        });
        _classPrivateFieldInit(this, _valueOne, {
            get: void 0,
            set: set_valueOne
        });
        _classPrivateFieldInit(this, _valueCompound, {
            get: void 0,
            set: set_valueCompound
        });
    }
    _createClass(Test, [
        {
            key: "m",
            value: function m() {
                var foo = {
                    bar: 1
                };
                console.log(_classPrivateFieldGet(this, _value)); // error
                _classPrivateFieldSet(this, _value, {
                    foo: foo
                }); // ok
                _classPrivateFieldSet(this, _value, {
                    foo: foo
                }); // ok
                _classPrivateFieldGet(this, _value).foo = foo; // error
                var ref;
                ref = {
                    o: {
                        foo: foo
                    }
                }, _classPrivateFieldDestructureSet(this, _value).value = ref.o, ref; //ok
                var _tmp;
                _tmp = {
                    foo: foo
                }, _classPrivateFieldDestructureSet(this, _value).value = _extends({}, _tmp), _tmp; //ok
                var ref1;
                ref1 = {
                    foo: foo
                }, _classPrivateFieldGet(this, _value).foo = ref1.foo, ref1; //error
                var _tmp1;
                var ref2, ref3;
                _tmp1 = {
                    foo: foo
                }, _classPrivateFieldGet(this, _value).foo = _extends({}, _tmp1.foo), ref2 = _tmp1, ref3 = ref2.foo, ref3, ref2, _tmp1; //error
                var r = {
                    o: _classPrivateFieldGet(this, _value)
                }; //error
                _classPrivateFieldDestructureSet(this, _valueOne).value = 1, _classPrivateFieldDestructureSet(this, _valueRest).value = [
                    2,
                    3
                ];
                var arr = [
                    _classPrivateFieldGet(this, _valueOne)
                ].concat(_toConsumableArray(_classPrivateFieldGet(this, _valueRest)));
                _classPrivateFieldSet(this, _valueCompound, _classPrivateFieldGet(this, _valueCompound) + 3);
            }
        }
    ]);
    return Test;
}();
function set_value(v) {}
function set_valueRest(v) {}
function set_valueOne(v) {}
function set_valueCompound(v) {}
new Test().m();
