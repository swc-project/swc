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
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function _construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _setPrototypeOf(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
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
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
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
function _templateObject() {
    var data = _taggedTemplateLiteral([
        "head",
        "middle",
        "tail"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "test",
        "and",
        ""
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
function _templateObject2() {
    var data = _taggedTemplateLiteral([
        "head",
        "middle",
        "tail"
    ]);
    _templateObject2 = function _templateObject2() {
        return data;
    };
    return data;
}
var _method = new WeakSet(), _method2 = new WeakSet();
var AA = // @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function AA() {
        _classCallCheck(this, AA);
        _classPrivateMethodInit(this, _method);
        _classPrivateMethodInit(this, _method2);
        this.x = 1;
    }
    _createClass(AA, [
        {
            key: "test",
            value: function test() {
                var _instance, _instance1;
                var _ref, _ref1, _ref2, _ref3;
                _classPrivateMethodGet(this, _method, method).call(this);
                var func = _classPrivateMethodGet(this, _method, method);
                func();
                new (_classPrivateMethodGet(this, _method, method))();
                var arr = [
                    1,
                    2
                ];
                (_instance = _classPrivateMethodGet(this, _method2, method2)).call.apply(_instance, [
                    this,
                    0
                ].concat(_toConsumableArray(arr), [
                    3
                ]));
                var b = _construct(_classPrivateMethodGet(this, _method2, method2), [
                    0
                ].concat(_toConsumableArray(arr), [
                    3
                ])); //Error 
                var str = _classPrivateMethodGet(this, _method2, method2).bind(this)(_templateObject(), 1, 2);
                _classPrivateMethodGet(_ref = this.getInstance(), _method2, method2).bind(_ref)(_templateObject1(), 1, 2);
                (_instance1 = _classPrivateMethodGet(_ref1 = this.getInstance(), _method2, method2)).call.apply(_instance1, [
                    _ref1,
                    0
                ].concat(_toConsumableArray(arr), [
                    3
                ]));
                var b2 = _construct(_classPrivateMethodGet(_ref2 = this.getInstance(), _method2, method2), [
                    0
                ].concat(_toConsumableArray(arr), [
                    3
                ])); //Error 
                var str2 = _classPrivateMethodGet(_ref3 = this.getInstance(), _method2, method2).bind(_ref3)(_templateObject2(), 1, 2);
            }
        },
        {
            key: "getInstance",
            value: function getInstance() {
                return new AA();
            }
        }
    ]);
    return AA;
}();
function method() {
    this.x = 10;
}
function method2(a) {
    for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        b[_key - 1] = arguments[_key];
    }
}
