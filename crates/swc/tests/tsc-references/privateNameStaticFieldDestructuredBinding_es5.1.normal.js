function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
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
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _classStaticPrivateFieldDestructureSet(receiver, classConstructor, descriptor) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    _classCheckPrivateStaticFieldDescriptor(descriptor, "set");
    return _classApplyDescriptorDestructureSet(receiver, descriptor);
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
var A = // @target: esnext, es2022, es2015
// @useDefineForClassFields: false
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
        this.otherClass = A;
        var y;
        var ref;
        ref = this.testObject(), _classStaticPrivateFieldDestructureSet(A, _field).value = ref.x, y = ref.y, ref;
        var ref1;
        ref1 = _slicedToArray(this.testArray(), 2), _classStaticPrivateFieldDestructureSet(A, _field).value = ref1[0], y = ref1[1], ref1;
        var ref2, ref3;
        ref2 = {
            a: 1,
            b: [
                2
            ]
        }, _classStaticPrivateFieldDestructureSet(A, _field).value = ref2.a, ref3 = _slicedToArray(ref2.b, 1), _classStaticPrivateFieldDestructureSet(A, _field).value = ref3[0], ref3, ref2;
        var ref4;
        _classStaticPrivateFieldDestructureSet(A, _field).value = 1, ref4 = [
            2
        ], _classStaticPrivateFieldDestructureSet(A, _field).value = ref4[0], ref4;
        var ref5, ref6, ref7, ref8;
        ref5 = {
            b: []
        }, ref6 = ref5.a, _classStaticPrivateFieldDestructureSet(A, _field).value = ref6 === void 0 ? 1 : ref6, ref7 = _slicedToArray(ref5.b, 1), ref8 = ref7[0], _classStaticPrivateFieldDestructureSet(A, _field).value = ref8 === void 0 ? 1 : ref8, ref7, ref5;
        var ref9, ref10;
        ref9 = [], ref10 = ref9[0], _classStaticPrivateFieldDestructureSet(A, _field).value = ref10 === void 0 ? 2 : ref10, ref9;
        var ref11, ref12;
        ref11 = [], ref12 = ref11[0], _classStaticPrivateFieldDestructureSet(this.otherClass, _field).value = ref12 === void 0 ? 2 : ref12, ref11;
    }
    _createClass(A, [
        {
            key: "testObject",
            value: function testObject() {
                return {
                    x: 10,
                    y: 6
                };
            }
        },
        {
            key: "testArray",
            value: function testArray() {
                return [
                    10,
                    11
                ];
            }
        }
    ], [
        {
            key: "test",
            value: function test(_a) {
                _classStaticPrivateFieldDestructureSet(_a, _field).value = 2;
            }
        }
    ]);
    return A;
}();
var _field = {
    writable: true,
    value: 1
};
