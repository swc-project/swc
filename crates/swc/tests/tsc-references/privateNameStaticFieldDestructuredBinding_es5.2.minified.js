function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _slicedToArray(arr, i) {
    return (function(arr) {
        if (Array.isArray(arr)) return arr;
    })(arr) || (function(arr, i) {
        var _s, _e, _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
        if (null != _i) {
            var _arr = [], _n = !0, _d = !1;
            try {
                for(_i = _i.call(arr); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
            } catch (err) {
                _d = !0, _e = err;
            } finally{
                try {
                    _n || null == _i.return || _i.return();
                } finally{
                    if (_d) throw _e;
                }
            }
            return _arr;
        }
    })(arr, i) || _unsupportedIterableToArray(arr, i) || (function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
}
function _unsupportedIterableToArray(o, minLen) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
}
function _classStaticPrivateFieldDestructureSet(receiver, classConstructor, descriptor) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "set"), (function(receiver, descriptor) {
        if (descriptor.set) return "__destrObj" in descriptor || (descriptor.__destrObj = {
            set value (v){
                descriptor.set.call(receiver, v);
            }
        }), descriptor.__destrObj;
        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
        return descriptor;
    })(receiver, descriptor);
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
var A = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function A() {
        var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, A), this.otherClass = A, ref = this.testObject(), _classStaticPrivateFieldDestructureSet(A, _field).value = ref.x, ref.y, ref1 = _slicedToArray(this.testArray(), 2), _classStaticPrivateFieldDestructureSet(A, _field).value = ref1[0], ref1[1], ref2 = {
            a: 1,
            b: [
                2
            ]
        }, _classStaticPrivateFieldDestructureSet(A, _field).value = ref2.a, ref3 = _slicedToArray(ref2.b, 1), _classStaticPrivateFieldDestructureSet(A, _field).value = ref3[0], _classStaticPrivateFieldDestructureSet(A, _field).value = 1, ref4 = [
            2
        ], _classStaticPrivateFieldDestructureSet(A, _field).value = ref4[0], ref6 = (ref5 = {
            b: []
        }).a, _classStaticPrivateFieldDestructureSet(A, _field).value = void 0 === ref6 ? 1 : ref6, ref7 = _slicedToArray(ref5.b, 1)[0], _classStaticPrivateFieldDestructureSet(A, _field).value = void 0 === ref7 ? 1 : ref7, ref8 = void 0, _classStaticPrivateFieldDestructureSet(A, _field).value = void 0 === ref8 ? 2 : ref8, ref9 = void 0, _classStaticPrivateFieldDestructureSet(this.otherClass, _field).value = void 0 === ref9 ? 2 : ref9;
    }
    return Constructor = A, protoProps = [
        {
            key: "testObject",
            value: function() {
                return {
                    x: 10,
                    y: 6
                };
            }
        },
        {
            key: "testArray",
            value: function() {
                return [
                    10,
                    11
                ];
            }
        }
    ], staticProps = [
        {
            key: "test",
            value: function(_a) {
                _classStaticPrivateFieldDestructureSet(_a, _field).value = 2;
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), A;
}(), _field = {
    writable: !0,
    value: 1
};
