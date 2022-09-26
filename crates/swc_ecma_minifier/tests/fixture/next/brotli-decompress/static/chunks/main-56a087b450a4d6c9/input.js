(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[179],{

/***/ 5300:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _arrayLikeToArray;
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}


/***/ }),

/***/ 6564:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _arrayWithHoles;
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}


/***/ }),

/***/ 2568:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _arrayWithoutHoles;
var _arrayLikeToArrayMjs = _interopRequireDefault(__webpack_require__(5300));
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return (0, _arrayLikeToArrayMjs).default(arr);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}


/***/ }),

/***/ 8646:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _assertThisInitialized;
function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}


/***/ }),

/***/ 932:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _asyncToGenerator;
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}


/***/ }),

/***/ 9658:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _classCallCheck;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}


/***/ }),

/***/ 5317:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _construct;
var _setPrototypeOfMjs = _interopRequireDefault(__webpack_require__(5814));
function _construct(Parent, args, Class) {
    return construct.apply(null, arguments);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
function construct(Parent1, args1, Class1) {
    if (isNativeReflectConstruct()) {
        construct = Reflect.construct;
    } else {
        construct = function construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) (0, _setPrototypeOfMjs).default(instance, Class.prototype);
            return instance;
        };
    }
    return construct.apply(null, arguments);
}


/***/ }),

/***/ 7222:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _createClass;
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
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


/***/ }),

/***/ 7735:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _createSuper;
var _isNativeReflectConstructMjs = _interopRequireDefault(__webpack_require__(9158));
var _getPrototypeOfMjs = _interopRequireDefault(__webpack_require__(898));
var _possibleConstructorReturnMjs = _interopRequireDefault(__webpack_require__(9241));
function _createSuper(Derived) {
    var hasNativeReflectConstruct = (0, _isNativeReflectConstructMjs).default();
    return function _createSuperInternal() {
        var Super = (0, _getPrototypeOfMjs).default(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = (0, _getPrototypeOfMjs).default(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return (0, _possibleConstructorReturnMjs).default(this, result);
    };
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}


/***/ }),

/***/ 6495:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _extends;
function _extends() {
    return extends_.apply(this, arguments);
}
function extends_() {
    extends_ = Object.assign || function(target) {
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
    return extends_.apply(this, arguments);
}


/***/ }),

/***/ 898:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _getPrototypeOf;
function _getPrototypeOf(o) {
    return getPrototypeOf(o);
}
function getPrototypeOf(o1) {
    getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return getPrototypeOf(o1);
}


/***/ }),

/***/ 7788:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _inherits;
var _setPrototypeOfMjs = _interopRequireDefault(__webpack_require__(5814));
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) (0, _setPrototypeOfMjs).default(subClass, superClass);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}


/***/ }),

/***/ 6856:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _instanceof;
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}


/***/ }),

/***/ 2648:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _interopRequireDefault;
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}


/***/ }),

/***/ 1598:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _interopRequireWildcard;
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _getRequireWildcardCache(nodeInterop1) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop1);
}


/***/ }),

/***/ 4499:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _isNativeFunction;
function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}


/***/ }),

/***/ 9158:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _isNativeReflectConstruct;
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}


/***/ }),

/***/ 1301:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _iterableToArray;
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}


/***/ }),

/***/ 6936:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _nonIterableRest;
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}


/***/ }),

/***/ 4162:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _nonIterableSpread;
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}


/***/ }),

/***/ 7273:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _objectWithoutPropertiesLoose;
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}


/***/ }),

/***/ 9241:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _possibleConstructorReturn;
var _assertThisInitializedMjs = _interopRequireDefault(__webpack_require__(8646));
var _typeOfMjs = _interopRequireDefault(__webpack_require__(5753));
function _possibleConstructorReturn(self, call) {
    if (call && ((0, _typeOfMjs).default(call) === "object" || typeof call === "function")) {
        return call;
    }
    return (0, _assertThisInitializedMjs).default(self);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}


/***/ }),

/***/ 5814:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _setPrototypeOf;
function _setPrototypeOf(o, p) {
    return setPrototypeOf(o, p);
}
function setPrototypeOf(o1, p1) {
    setPrototypeOf = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return setPrototypeOf(o1, p1);
}


/***/ }),

/***/ 4941:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _slicedToArray;
var _arrayWithHolesMjs = _interopRequireDefault(__webpack_require__(6564));
var _iterableToArrayMjs = _interopRequireDefault(__webpack_require__(1301));
var _nonIterableRestMjs = _interopRequireDefault(__webpack_require__(6936));
var _unsupportedIterableToArrayMjs = _interopRequireDefault(__webpack_require__(2149));
function _slicedToArray(arr, i) {
    return (0, _arrayWithHolesMjs).default(arr) || (0, _iterableToArrayMjs).default(arr, i) || (0, _unsupportedIterableToArrayMjs).default(arr, i) || (0, _nonIterableRestMjs).default();
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}


/***/ }),

/***/ 3929:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _toConsumableArray;
var _arrayWithoutHolesMjs = _interopRequireDefault(__webpack_require__(2568));
var _iterableToArrayMjs = _interopRequireDefault(__webpack_require__(1301));
var _nonIterableSpreadMjs = _interopRequireDefault(__webpack_require__(4162));
var _unsupportedIterableToArrayMjs = _interopRequireDefault(__webpack_require__(2149));
function _toConsumableArray(arr) {
    return (0, _arrayWithoutHolesMjs).default(arr) || (0, _iterableToArrayMjs).default(arr) || (0, _unsupportedIterableToArrayMjs).default(arr) || (0, _nonIterableSpreadMjs).default();
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}


/***/ }),

/***/ 2401:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "Z", ({
    enumerable: true,
    get: function() {
        return _tslib.__generator;
    }
}));
var _tslib = __webpack_require__(655);


/***/ }),

/***/ 5753:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _typeof;
function _typeof(obj) {
    "@swc/helpers - typeof";
    return obj && obj.constructor === Symbol ? "symbol" : typeof obj;
}
;


/***/ }),

/***/ 2149:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = _unsupportedIterableToArray;
var _arrayLikeToArrayMjs = _interopRequireDefault(__webpack_require__(5300));
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return (0, _arrayLikeToArrayMjs).default(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0, _arrayLikeToArrayMjs).default(o, minLen);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}


/***/ }),

/***/ 9968:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _wrapNativeSuper;
var _constructMjs = _interopRequireDefault(__webpack_require__(5317));
var _isNativeFunctionMjs = _interopRequireDefault(__webpack_require__(4499));
var _getPrototypeOfMjs = _interopRequireDefault(__webpack_require__(898));
var _setPrototypeOfMjs = _interopRequireDefault(__webpack_require__(5814));
function _wrapNativeSuper(Class) {
    return wrapNativeSuper(Class);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function wrapNativeSuper(Class1) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    wrapNativeSuper = function wrapNativeSuper(Class) {
        if (Class === null || !(0, _isNativeFunctionMjs).default(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return (0, _constructMjs).default(Class, arguments, (0, _getPrototypeOfMjs).default(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return (0, _setPrototypeOfMjs).default(Wrapper, Class);
    };
    return wrapNativeSuper(Class1);
}


/***/ }),

/***/ 37:
/***/ (function() {

"trimStart"in String.prototype||(String.prototype.trimStart=String.prototype.trimLeft),"trimEnd"in String.prototype||(String.prototype.trimEnd=String.prototype.trimRight),"description"in Symbol.prototype||Object.defineProperty(Symbol.prototype,"description",{configurable:!0,get:function(){var t=/\((.*)\)/.exec(this.toString());return t?t[1]:void 0}}),Array.prototype.flat||(Array.prototype.flat=function(t,r){return r=this.concat.apply([],this),t>1&&r.some(Array.isArray)?r.flat(t-1):r},Array.prototype.flatMap=function(t,r){return this.map(t,r).flat()}),Promise.prototype.finally||(Promise.prototype.finally=function(t){if("function"!=typeof t)return this.then(t,t);var r=this.constructor||Promise;return this.then(function(o){return r.resolve(t()).then(function(){return o})},function(o){return r.resolve(t()).then(function(){throw o})})}),Object.fromEntries||(Object.fromEntries=function(t){return Array.from(t).reduce(function(t,r){return t[r[0]]=r[1],t},{})});


/***/ }),

/***/ 8684:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addBasePath = addBasePath;
var _addPathPrefix = __webpack_require__(5391);
var _normalizeTrailingSlash = __webpack_require__(2392);
var basePath =  false || "";
function addBasePath(path, required) {
    if (false) {}
    return (0, _normalizeTrailingSlash).normalizePathTrailingSlash((0, _addPathPrefix).addPathPrefix(path, basePath));
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=add-base-path.js.map


/***/ }),

/***/ 2725:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _toConsumableArray = (__webpack_require__(3929)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addLocale = void 0;
var _normalizeTrailingSlash = __webpack_require__(2392);
var addLocale = function(path) {
    for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        args[_key - 1] = arguments[_key];
    }
    if (false) { var _instance; }
    return path;
};
exports.addLocale = addLocale;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=add-locale.js.map


/***/ }),

/***/ 8748:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _toConsumableArray = (__webpack_require__(3929)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.detectDomainLocale = void 0;
var detectDomainLocale = function() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    if (false) { var _instance; }
};
exports.detectDomainLocale = detectDomainLocale;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=detect-domain-locale.js.map


/***/ }),

/***/ 4119:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.hasBasePath = hasBasePath;
var _pathHasPrefix = __webpack_require__(1259);
var basePath =  false || "";
function hasBasePath(path) {
    return (0, _pathHasPrefix).pathHasPrefix(path, basePath);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=has-base-path.js.map


/***/ }),

/***/ 6007:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _instanceof = (__webpack_require__(6856)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = initHeadManager;
exports.isEqualNode = isEqualNode;
exports.DOMAttributeNames = void 0;
function initHeadManager() {
    return {
        mountedInstances: new Set(),
        updateHead: function(head) {
            var tags = {};
            head.forEach(function(h) {
                if (// it won't be inlined. In this case revert to the original behavior
                h.type === "link" && h.props["data-optimized-fonts"]) {
                    if (document.querySelector('style[data-href="'.concat(h.props["data-href"], '"]'))) {
                        return;
                    } else {
                        h.props.href = h.props["data-href"];
                        h.props["data-href"] = undefined;
                    }
                }
                var components = tags[h.type] || [];
                components.push(h);
                tags[h.type] = components;
            });
            var titleComponent = tags.title ? tags.title[0] : null;
            var title = "";
            if (titleComponent) {
                var children = titleComponent.props.children;
                title = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
            }
            if (title !== document.title) document.title = title;
            [
                "meta",
                "base",
                "link",
                "style",
                "script"
            ].forEach(function(type) {
                updateElements(type, tags[type] || []);
            });
        }
    };
}
var DOMAttributeNames = {
    acceptCharset: "accept-charset",
    className: "class",
    htmlFor: "for",
    httpEquiv: "http-equiv",
    noModule: "noModule"
};
exports.DOMAttributeNames = DOMAttributeNames;
function reactElementToDOM(param) {
    var type = param.type, props = param.props;
    var el = document.createElement(type);
    for(var p in props){
        if (!props.hasOwnProperty(p)) continue;
        if (p === "children" || p === "dangerouslySetInnerHTML") continue;
        // we don't render undefined props to the DOM
        if (props[p] === undefined) continue;
        var attr = DOMAttributeNames[p] || p.toLowerCase();
        if (type === "script" && (attr === "async" || attr === "defer" || attr === "noModule")) {
            el[attr] = !!props[p];
        } else {
            el.setAttribute(attr, props[p]);
        }
    }
    var children = props.children, dangerouslySetInnerHTML = props.dangerouslySetInnerHTML;
    if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || "";
    } else if (children) {
        el.textContent = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
    }
    return el;
}
function isEqualNode(oldTag, newTag) {
    if (_instanceof(oldTag, HTMLElement) && _instanceof(newTag, HTMLElement)) {
        var nonce = newTag.getAttribute("nonce");
        // Only strip the nonce if `oldTag` has had it stripped. An element's nonce attribute will not
        // be stripped if there is no content security policy response header that includes a nonce.
        if (nonce && !oldTag.getAttribute("nonce")) {
            var cloneTag = newTag.cloneNode(true);
            cloneTag.setAttribute("nonce", "");
            cloneTag.nonce = nonce;
            return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
        }
    }
    return oldTag.isEqualNode(newTag);
}
function updateElements(type, components) {
    var headEl = document.getElementsByTagName("head")[0];
    var headCountEl = headEl.querySelector("meta[name=next-head-count]");
    if (false) {}
    var headCount = Number(headCountEl.content);
    var oldTags = [];
    for(var i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j == null ? void 0 : j.previousElementSibling) || null){
        var ref;
        if ((j == null ? void 0 : (ref = j.tagName) == null ? void 0 : ref.toLowerCase()) === type) {
            oldTags.push(j);
        }
    }
    var newTags = components.map(reactElementToDOM).filter(function(newTag) {
        for(var k = 0, len = oldTags.length; k < len; k++){
            var oldTag = oldTags[k];
            if (isEqualNode(oldTag, newTag)) {
                oldTags.splice(k, 1);
                return false;
            }
        }
        return true;
    });
    oldTags.forEach(function(t) {
        var ref;
        return (ref = t.parentNode) == null ? void 0 : ref.removeChild(t);
    });
    newTags.forEach(function(t) {
        return headEl.insertBefore(t, headCountEl);
    });
    headCountEl.content = (headCount - oldTags.length + newTags.length).toString();
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=head-manager.js.map


/***/ }),

/***/ 7339:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _classCallCheck = (__webpack_require__(9658)/* ["default"] */ .Z);
var _createClass = (__webpack_require__(7222)/* ["default"] */ .Z);
var _inherits = (__webpack_require__(7788)/* ["default"] */ .Z);
var _interopRequireWildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
var _slicedToArray = (__webpack_require__(4941)/* ["default"] */ .Z);
var _createSuper = (__webpack_require__(7735)/* ["default"] */ .Z);
var _tsGenerator = (__webpack_require__(2401)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.initialize = initialize;
exports.hydrate = hydrate;
exports.emitter = exports.router = exports.version = void 0;
var _async_to_generator = (__webpack_require__(932)/* ["default"] */ .Z);
var _extends = (__webpack_require__(6495)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
__webpack_require__(37);
var _react = _interop_require_default(__webpack_require__(7294));
var _headManagerContext = __webpack_require__(8404);
var _mitt = _interop_require_default(__webpack_require__(5660));
var _routerContext = __webpack_require__(3462);
var _isDynamic = __webpack_require__(8689);
var _querystring = __webpack_require__(466);
var _runtimeConfig = __webpack_require__(8027);
var _utils = __webpack_require__(3794);
var _portal = __webpack_require__(2207);
var _headManager = _interop_require_default(__webpack_require__(6007));
var _pageLoader = _interop_require_default(__webpack_require__(5181));
var _performanceRelayer = _interop_require_default(__webpack_require__(9302));
var _routeAnnouncer = __webpack_require__(8982);
var _router = __webpack_require__(387);
var _isError = __webpack_require__(676);
var _imageConfigContext = __webpack_require__(9977);
var _removeBasePath = __webpack_require__(9320);
var _hasBasePath = __webpack_require__(4119);
var ReactDOM =  true ? __webpack_require__(745) : 0;
var version = "12.3.1";
exports.version = version;
var router;
exports.router = router;
var emitter = (0, _mitt).default();
exports.emitter = emitter;
var looseToArray = function(input) {
    return [].slice.call(input);
};
var initialData;
var defaultLocale = undefined;
var asPath;
var pageLoader;
var appElement;
var headManager;
var initialMatchesMiddleware = false;
var lastAppProps;
var lastRenderReject;
var webpackHMR;
var CachedApp, onPerfEntry;
var CachedComponent;
self.__next_require__ = __webpack_require__;
var Container = /*#__PURE__*/ function(_Component) {
    _inherits(Container, _Component);
    var _super = _createSuper(Container);
    function Container() {
        _classCallCheck(this, Container);
        return _super.apply(this, arguments);
    }
    _createClass(Container, [
        {
            key: "componentDidCatch",
            value: function componentDidCatch(componentErr, info) {
                this.props.fn(componentErr, info);
            }
        },
        {
            key: "componentDidMount",
            value: function componentDidMount() {
                this.scrollToHash();
                // We need to replace the router state if:
                // - the page was (auto) exported and has a query string or search (hash)
                // - it was auto exported and is a dynamic route (to provide params)
                // - if it is a client-side skeleton (fallback render)
                // - if middleware matches the current page (may have rewrite params)
                // - if rewrites in next.config.js match (may have rewrite params)
                if (router.isSsr && // We don't update for 404 requests as this can modify
                // the asPath unexpectedly e.g. adding basePath when
                // it wasn't originally present
                initialData.page !== "/404" && initialData.page !== "/_error" && (initialData.isFallback || initialData.nextExport && ((0, _isDynamic).isDynamicRoute(router.pathname) || location.search || false || initialMatchesMiddleware) || initialData.props && initialData.props.__N_SSG && (location.search || false || initialMatchesMiddleware))) {
                    // update query on mount for exported pages
                    router.replace(router.pathname + "?" + String((0, _querystring).assign((0, _querystring).urlQueryToSearchParams(router.query), new URLSearchParams(location.search))), asPath, {
                        // @ts-ignore
                        // WARNING: `_h` is an internal option for handing Next.js
                        // client-side hydration. Your app should _never_ use this property.
                        // It may change at any time without notice.
                        _h: 1,
                        // Fallback pages must trigger the data fetch, so the transition is
                        // not shallow.
                        // Other pages (strictly updating query) happens shallowly, as data
                        // requirements would already be present.
                        shallow: !initialData.isFallback && !initialMatchesMiddleware
                    }).catch(function(err) {
                        if (!err.cancelled) throw err;
                    });
                }
            }
        },
        {
            key: "componentDidUpdate",
            value: function componentDidUpdate() {
                this.scrollToHash();
            }
        },
        {
            key: "scrollToHash",
            value: function scrollToHash() {
                var hash = location.hash;
                hash = hash && hash.substring(1);
                if (!hash) return;
                var el = document.getElementById(hash);
                if (!el) return;
                // If we call scrollIntoView() in here without a setTimeout
                // it won't scroll properly.
                setTimeout(function() {
                    return el.scrollIntoView();
                }, 0);
            }
        },
        {
            key: "render",
            value: function render() {
                if (true) {
                    return this.props.children;
                } else { var ReactDevOverlay; }
            }
        }
    ]);
    return Container;
}(_react.default.Component);
function initialize() {
    return _initialize.apply(this, arguments);
}
function _initialize() {
    _initialize = _async_to_generator(function() {
        var opts, prefix, normalizeLocalePath, detectDomainLocale, parseRelativeUrl, formatUrl, parsedAs, localePathResult, detectedDomain, initScriptLoader, register;
        var _arguments = arguments;
        return _tsGenerator(this, function(_state) {
            opts = _arguments.length > 0 && _arguments[0] !== void 0 ? _arguments[0] : {};
            // This makes sure this specific lines are removed in production
            if (false) {}
            initialData = JSON.parse(document.getElementById("__NEXT_DATA__").textContent);
            window.__NEXT_DATA__ = initialData;
            defaultLocale = initialData.defaultLocale;
            prefix = initialData.assetPrefix || "";
            // With dynamic assetPrefix it's no longer possible to set assetPrefix at the build time
            // So, this is how we do it in the client side at runtime
            __webpack_require__.p = "".concat(prefix, "/_next/") //eslint-disable-line
            ;
            // Initialize next/config with the environment configuration
            (0, _runtimeConfig).setConfig({
                serverRuntimeConfig: {},
                publicRuntimeConfig: initialData.runtimeConfig || {}
            });
            asPath = (0, _utils).getURL();
            // make sure not to attempt stripping basePath for 404s
            if ((0, _hasBasePath).hasBasePath(asPath)) {
                asPath = (0, _removeBasePath).removeBasePath(asPath);
            }
            if (false) {}
            if (initialData.scriptLoader) {
                initScriptLoader = (__webpack_require__(699).initScriptLoader);
                initScriptLoader(initialData.scriptLoader);
            }
            pageLoader = new _pageLoader.default(initialData.buildId, prefix);
            register = function(param) {
                var _param = _slicedToArray(param, 2), r = _param[0], f = _param[1];
                return pageLoader.routeLoader.onEntrypoint(r, f);
            };
            if (window.__NEXT_P) {
                // Defer page registration for another tick. This will increase the overall
                // latency in hydrating the page, but reduce the total blocking time.
                window.__NEXT_P.map(function(p) {
                    return setTimeout(function() {
                        return register(p);
                    }, 0);
                });
            }
            window.__NEXT_P = [];
            window.__NEXT_P.push = register;
            headManager = (0, _headManager).default();
            headManager.getIsSsr = function() {
                return router.isSsr;
            };
            appElement = document.getElementById("__next");
            return [
                2,
                {
                    assetPrefix: prefix
                }
            ];
        });
    });
    return _initialize.apply(this, arguments);
}
function renderApp(App, appProps) {
    return /*#__PURE__*/ _react.default.createElement(App, Object.assign({}, appProps));
}
function AppContainer(param) {
    var children = param.children;
    return /*#__PURE__*/ _react.default.createElement(Container, {
        fn: function(error) {
            return(// eslint-disable-next-line @typescript-eslint/no-use-before-define
            renderError({
                App: CachedApp,
                err: error
            }).catch(function(err) {
                return console.error("Error rendering page: ", err);
            }));
        }
    }, /*#__PURE__*/ _react.default.createElement(_routerContext.RouterContext.Provider, {
        value: (0, _router).makePublicRouterInstance(router)
    }, /*#__PURE__*/ _react.default.createElement(_headManagerContext.HeadManagerContext.Provider, {
        value: headManager
    }, /*#__PURE__*/ _react.default.createElement(_imageConfigContext.ImageConfigContext.Provider, {
        value: {"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","dangerouslyAllowSVG":false,"unoptimized":false}
    }, children))));
}
var wrapApp = function(App) {
    return function(wrappedAppProps) {
        var appProps = _extends({}, wrappedAppProps, {
            Component: CachedComponent,
            err: initialData.err,
            router: router
        });
        return /*#__PURE__*/ _react.default.createElement(AppContainer, null, renderApp(App, appProps));
    };
};
// This method handles all runtime and debug errors.
// 404 and 500 errors are special kind of errors
// and they are still handle via the main render method.
function renderError(renderErrorProps) {
    var App = renderErrorProps.App, err = renderErrorProps.err;
    // In development runtime errors are caught by our overlay
    // In production we catch runtime errors using componentDidCatch which will trigger renderError
    if (false) {}
    // Make sure we log the error to the console, otherwise users can't track down issues.
    console.error(err);
    console.error("A client-side exception has occurred, see here for more info: https://nextjs.org/docs/messages/client-side-exception-occurred");
    return pageLoader.loadPage("/_error").then(function(param) {
        var ErrorComponent = param.page, styleSheets = param.styleSheets;
        return (lastAppProps == null ? void 0 : lastAppProps.Component) === ErrorComponent ? Promise.resolve().then(function() {
            return /*#__PURE__*/ _interopRequireWildcard(__webpack_require__(9185));
        }).then(function(errorModule) {
            return Promise.resolve().then(function() {
                return /*#__PURE__*/ _interopRequireWildcard(__webpack_require__(6029));
            }).then(function(appModule) {
                App = appModule.default;
                renderErrorProps.App = App;
                return errorModule;
            });
        }).then(function(m) {
            return {
                ErrorComponent: m.default,
                styleSheets: []
            };
        }) : {
            ErrorComponent: ErrorComponent,
            styleSheets: styleSheets
        };
    }).then(function(param) {
        var ErrorComponent = param.ErrorComponent, styleSheets = param.styleSheets;
        var ref;
        // In production we do a normal render with the `ErrorComponent` as component.
        // If we've gotten here upon initial render, we can use the props from the server.
        // Otherwise, we need to call `getInitialProps` on `App` before mounting.
        var AppTree = wrapApp(App);
        var appCtx = {
            Component: ErrorComponent,
            AppTree: AppTree,
            router: router,
            ctx: {
                err: err,
                pathname: initialData.page,
                query: initialData.query,
                asPath: asPath,
                AppTree: AppTree
            }
        };
        return Promise.resolve(((ref = renderErrorProps.props) == null ? void 0 : ref.err) ? renderErrorProps.props : (0, _utils).loadGetInitialProps(App, appCtx)).then(function(initProps) {
            return(// eslint-disable-next-line @typescript-eslint/no-use-before-define
            doRender(_extends({}, renderErrorProps, {
                err: err,
                Component: ErrorComponent,
                styleSheets: styleSheets,
                props: initProps
            })));
        });
    });
}
// Dummy component that we render as a child of Root so that we can
// toggle the correct styles before the page is rendered.
function Head(param) {
    var callback = param.callback;
    // We use `useLayoutEffect` to guarantee the callback is executed
    // as soon as React flushes the update.
    _react.default.useLayoutEffect(function() {
        return callback();
    }, [
        callback
    ]);
    return null;
}
var reactRoot = null;
// On initial render a hydrate should always happen
var shouldHydrate = true;
function clearMarks() {
    [
        "beforeRender",
        "afterHydrate",
        "afterRender",
        "routeChange"
    ].forEach(function(mark) {
        return performance.clearMarks(mark);
    });
}
function markHydrateComplete() {
    if (!_utils.ST) return;
    performance.mark("afterHydrate") // mark end of hydration
    ;
    performance.measure("Next.js-before-hydration", "navigationStart", "beforeRender");
    performance.measure("Next.js-hydration", "beforeRender", "afterHydrate");
    if (onPerfEntry) {
        performance.getEntriesByName("Next.js-hydration").forEach(onPerfEntry);
    }
    clearMarks();
}
function markRenderComplete() {
    if (!_utils.ST) return;
    performance.mark("afterRender") // mark end of render
    ;
    var navStartEntries = performance.getEntriesByName("routeChange", "mark");
    if (!navStartEntries.length) return;
    performance.measure("Next.js-route-change-to-render", navStartEntries[0].name, "beforeRender");
    performance.measure("Next.js-render", "beforeRender", "afterRender");
    if (onPerfEntry) {
        performance.getEntriesByName("Next.js-render").forEach(onPerfEntry);
        performance.getEntriesByName("Next.js-route-change-to-render").forEach(onPerfEntry);
    }
    clearMarks();
    [
        "Next.js-route-change-to-render",
        "Next.js-render"
    ].forEach(function(measure) {
        return performance.clearMeasures(measure);
    });
}
function renderReactElement(domEl, fn) {
    // mark start of hydrate/render
    if (_utils.ST) {
        performance.mark("beforeRender");
    }
    var reactEl = fn(shouldHydrate ? markHydrateComplete : markRenderComplete);
    if (true) {
        if (!reactRoot) {
            // Unlike with createRoot, you don't need a separate root.render() call here
            reactRoot = ReactDOM.hydrateRoot(domEl, reactEl);
            // TODO: Remove shouldHydrate variable when React 18 is stable as it can depend on `reactRoot` existing
            shouldHydrate = false;
        } else {
            var startTransition = _react.default.startTransition;
            startTransition(function() {
                reactRoot.render(reactEl);
            });
        }
    } else {}
}
function Root(param) {
    var callbacks = param.callbacks, children = param.children;
    // We use `useLayoutEffect` to guarantee the callbacks are executed
    // as soon as React flushes the update
    _react.default.useLayoutEffect(function() {
        return callbacks.forEach(function(callback) {
            return callback();
        });
    }, [
        callbacks
    ]);
    // We should ask to measure the Web Vitals after rendering completes so we
    // don't cause any hydration delay:
    _react.default.useEffect(function() {
        (0, _performanceRelayer).default(onPerfEntry);
    }, []);
    if (false) {}
    return children;
}
function doRender(input) {
    var onStart = // This function has a return type to ensure it doesn't start returning a
    // Promise. It should remain synchronous.
    function onStart() {
        if (!styleSheets || // We use `style-loader` in development, so we don't need to do anything
        // unless we're in production:
        "production" !== "production") {
            return false;
        }
        var currentStyleTags = looseToArray(document.querySelectorAll("style[data-n-href]"));
        var currentHrefs = new Set(currentStyleTags.map(function(tag) {
            return tag.getAttribute("data-n-href");
        }));
        var noscript = document.querySelector("noscript[data-n-css]");
        var nonce = noscript == null ? void 0 : noscript.getAttribute("data-n-css");
        styleSheets.forEach(function(param) {
            var href = param.href, text = param.text;
            if (!currentHrefs.has(href)) {
                var styleTag = document.createElement("style");
                styleTag.setAttribute("data-n-href", href);
                styleTag.setAttribute("media", "x");
                if (nonce) {
                    styleTag.setAttribute("nonce", nonce);
                }
                document.head.appendChild(styleTag);
                styleTag.appendChild(document.createTextNode(text));
            }
        });
        return true;
    };
    var onHeadCommit = function onHeadCommit() {
        if (// unless we're in production:
         true && // We can skip this during hydration. Running it wont cause any harm, but
        // we may as well save the CPU cycles:
        styleSheets && // Ensure this render was not canceled
        !canceled) {
            var desiredHrefs = new Set(styleSheets.map(function(s) {
                return s.href;
            }));
            var currentStyleTags = looseToArray(document.querySelectorAll("style[data-n-href]"));
            var currentHrefs = currentStyleTags.map(function(tag) {
                return tag.getAttribute("data-n-href");
            });
            // Toggle `<style>` tags on or off depending on if they're needed:
            for(var idx = 0; idx < currentHrefs.length; ++idx){
                if (desiredHrefs.has(currentHrefs[idx])) {
                    currentStyleTags[idx].removeAttribute("media");
                } else {
                    currentStyleTags[idx].setAttribute("media", "x");
                }
            }
            // Reorder styles into intended order:
            var referenceNode = document.querySelector("noscript[data-n-css]");
            if (referenceNode) {
                styleSheets.forEach(function(param) {
                    var href = param.href;
                    var targetTag = document.querySelector('style[data-n-href="'.concat(href, '"]'));
                    if (targetTag) {
                        referenceNode.parentNode.insertBefore(targetTag, referenceNode.nextSibling);
                        referenceNode = targetTag;
                    }
                });
            }
            // Finally, clean up server rendered stylesheets:
            looseToArray(document.querySelectorAll("link[data-n-p]")).forEach(function(el) {
                el.parentNode.removeChild(el);
            });
        }
        if (input.scroll) {
            var htmlElement = document.documentElement;
            var existing = htmlElement.style.scrollBehavior;
            htmlElement.style.scrollBehavior = "auto";
            window.scrollTo(input.scroll.x, input.scroll.y);
            htmlElement.style.scrollBehavior = existing;
        }
    };
    var onRootCommit = function onRootCommit() {
        resolvePromise();
    };
    var App = input.App, Component = input.Component, props = input.props, err = input.err;
    var styleSheets = "initial" in input ? undefined : input.styleSheets;
    Component = Component || lastAppProps.Component;
    props = props || lastAppProps.props;
    var appProps = _extends({}, props, {
        Component: Component,
        err: err,
        router: router
    });
    // lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.
    lastAppProps = appProps;
    var canceled = false;
    var resolvePromise;
    var renderPromise = new Promise(function(resolve, reject) {
        if (lastRenderReject) {
            lastRenderReject();
        }
        resolvePromise = function() {
            lastRenderReject = null;
            resolve();
        };
        lastRenderReject = function() {
            canceled = true;
            lastRenderReject = null;
            var error = new Error("Cancel rendering route");
            error.cancelled = true;
            reject(error);
        };
    });
    onStart();
    var elem = /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(Head, {
        callback: onHeadCommit
    }), /*#__PURE__*/ _react.default.createElement(AppContainer, null, renderApp(App, appProps), /*#__PURE__*/ _react.default.createElement(_portal.Portal, {
        type: "next-route-announcer"
    }, /*#__PURE__*/ _react.default.createElement(_routeAnnouncer.RouteAnnouncer, null))));
    // We catch runtime errors using componentDidCatch which will trigger renderError
    renderReactElement(appElement, function(callback) {
        return /*#__PURE__*/ _react.default.createElement(Root, {
            callbacks: [
                callback,
                onRootCommit
            ]
        },  true ? /*#__PURE__*/ _react.default.createElement(_react.default.StrictMode, null, elem) : 0);
    });
    return renderPromise;
}
function render(renderingProps) {
    return _render.apply(this, arguments);
}
function _render() {
    _render = _async_to_generator(function(renderingProps) {
        var err, renderErr;
        return _tsGenerator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!renderingProps.err) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        renderError(renderingProps)
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
                case 2:
                    _state.trys.push([
                        2,
                        4,
                        ,
                        6
                    ]);
                    return [
                        4,
                        doRender(renderingProps)
                    ];
                case 3:
                    _state.sent();
                    return [
                        3,
                        6
                    ];
                case 4:
                    err = _state.sent();
                    renderErr = (0, _isError).getProperError(err);
                    // bubble up cancelation errors
                    if (renderErr.cancelled) {
                        throw renderErr;
                    }
                    if (false) {}
                    return [
                        4,
                        renderError(_extends({}, renderingProps, {
                            err: renderErr
                        }))
                    ];
                case 5:
                    _state.sent();
                    return [
                        3,
                        6
                    ];
                case 6:
                    return [
                        2
                    ];
            }
        });
    });
    return _render.apply(this, arguments);
}
function hydrate(opts) {
    return _hydrate.apply(this, arguments);
}
function _hydrate() {
    _hydrate = _async_to_generator(function(opts) {
        var initialErr, appEntrypoint, app, mod, pageEntrypoint, _tmp, isValidElementType, error1, getServerError, renderCtx;
        return _tsGenerator(this, function(_state) {
            switch(_state.label){
                case 0:
                    initialErr = initialData.err;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        ,
                        7
                    ]);
                    return [
                        4,
                        pageLoader.routeLoader.whenEntrypoint("/_app")
                    ];
                case 2:
                    appEntrypoint = _state.sent();
                    if ("error" in appEntrypoint) {
                        throw appEntrypoint.error;
                    }
                    app = appEntrypoint.component, mod = appEntrypoint.exports;
                    CachedApp = app;
                    if (mod && mod.reportWebVitals) {
                        onPerfEntry = function(param) {
                            var id = param.id, name = param.name, startTime = param.startTime, value = param.value, duration = param.duration, entryType = param.entryType, entries = param.entries;
                            // Combines timestamp with random number for unique ID
                            var uniqueID = "".concat(Date.now(), "-").concat(Math.floor(Math.random() * (9e12 - 1)) + 1e12);
                            var perfStartEntry;
                            if (entries && entries.length) {
                                perfStartEntry = entries[0].startTime;
                            }
                            var webVitals = {
                                id: id || uniqueID,
                                name: name,
                                startTime: startTime || perfStartEntry,
                                value: value == null ? duration : value,
                                label: entryType === "mark" || entryType === "measure" ? "custom" : "web-vital"
                            };
                            mod.reportWebVitals(webVitals);
                        };
                    }
                    if (true) return [
                        3,
                        3
                    ];
                    _tmp = {
                        error: initialData.err
                    };
                    return [
                        3,
                        5
                    ];
                case 3:
                    return [
                        4,
                        pageLoader.routeLoader.whenEntrypoint(initialData.page)
                    ];
                case 4:
                    _tmp = _state.sent();
                    _state.label = 5;
                case 5:
                    pageEntrypoint = _tmp;
                    if ("error" in pageEntrypoint) {
                        throw pageEntrypoint.error;
                    }
                    CachedComponent = pageEntrypoint.component;
                    if (false) {}
                    return [
                        3,
                        7
                    ];
                case 6:
                    error1 = _state.sent();
                    // This catches errors like throwing in the top level of a module
                    initialErr = (0, _isError).getProperError(error1);
                    return [
                        3,
                        7
                    ];
                case 7:
                    if (false) {}
                    if (!window.__NEXT_PRELOADREADY) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        window.__NEXT_PRELOADREADY(initialData.dynamicIds)
                    ];
                case 8:
                    _state.sent();
                    _state.label = 9;
                case 9:
                    exports.router = router = (0, _router).createRouter(initialData.page, initialData.query, asPath, {
                        initialProps: initialData.props,
                        pageLoader: pageLoader,
                        App: CachedApp,
                        Component: CachedComponent,
                        wrapApp: wrapApp,
                        err: initialErr,
                        isFallback: Boolean(initialData.isFallback),
                        subscription: function(info, App, scroll) {
                            return render(Object.assign({}, info, {
                                App: App,
                                scroll: scroll
                            }));
                        },
                        locale: initialData.locale,
                        locales: initialData.locales,
                        defaultLocale: defaultLocale,
                        domainLocales: initialData.domainLocales,
                        isPreview: initialData.isPreview
                    });
                    return [
                        4,
                        router._initialMatchesMiddlewarePromise
                    ];
                case 10:
                    initialMatchesMiddleware = _state.sent();
                    renderCtx = {
                        App: CachedApp,
                        initial: true,
                        Component: CachedComponent,
                        props: initialData.props,
                        err: initialErr
                    };
                    if (!(opts == null ? void 0 : opts.beforeRender)) return [
                        3,
                        12
                    ];
                    return [
                        4,
                        opts.beforeRender()
                    ];
                case 11:
                    _state.sent();
                    _state.label = 12;
                case 12:
                    render(renderCtx);
                    return [
                        2
                    ];
            }
        });
    });
    return _hydrate.apply(this, arguments);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=index.js.map


/***/ }),

/***/ 2870:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _ = __webpack_require__(7339);
window.next = {
    version: _.version,
    // router is initialized later so it has to be live-binded
    get router () {
        return _.router;
    },
    emitter: _.emitter
};
(0, _).initialize({}).then(function() {
    return (0, _).hydrate();
}).catch(console.error);
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=next.js.map


/***/ }),

/***/ 2392:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.normalizePathTrailingSlash = void 0;
var _removeTrailingSlash = __webpack_require__(6316);
var _parsePath = __webpack_require__(4943);
var normalizePathTrailingSlash = function(path) {
    if (!path.startsWith("/")) {
        return path;
    }
    var ref = (0, _parsePath).parsePath(path), pathname = ref.pathname, query = ref.query, hash = ref.hash;
    if (false) {}
    return "".concat((0, _removeTrailingSlash).removeTrailingSlash(pathname)).concat(query).concat(hash);
};
exports.normalizePathTrailingSlash = normalizePathTrailingSlash;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=normalize-trailing-slash.js.map


/***/ }),

/***/ 5181:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _classCallCheck = (__webpack_require__(9658)/* ["default"] */ .Z);
var _createClass = (__webpack_require__(7222)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _addBasePath = __webpack_require__(8684);
var _router = __webpack_require__(6273);
var _getAssetPathFromRoute = _interop_require_default(__webpack_require__(3891));
var _addLocale = __webpack_require__(2725);
var _isDynamic = __webpack_require__(8689);
var _parseRelativeUrl = __webpack_require__(6305);
var _removeTrailingSlash = __webpack_require__(6316);
var _routeLoader = __webpack_require__(2669);
var PageLoader = /*#__PURE__*/ function() {
    function PageLoader(buildId, assetPrefix) {
        _classCallCheck(this, PageLoader);
        this.routeLoader = (0, _routeLoader).createRouteLoader(assetPrefix);
        this.buildId = buildId;
        this.assetPrefix = assetPrefix;
        this.promisedSsgManifest = new Promise(function(resolve) {
            if (window.__SSG_MANIFEST) {
                resolve(window.__SSG_MANIFEST);
            } else {
                window.__SSG_MANIFEST_CB = function() {
                    resolve(window.__SSG_MANIFEST);
                };
            }
        });
    }
    _createClass(PageLoader, [
        {
            key: "getPageList",
            value: function getPageList() {
                if (true) {
                    return (0, _routeLoader).getClientBuildManifest().then(function(manifest) {
                        return manifest.sortedPages;
                    });
                } else {}
            }
        },
        {
            key: "getMiddleware",
            value: function getMiddleware() {
                if (true) {
                    var middlewareMatchers = [];
                    window.__MIDDLEWARE_MATCHERS = middlewareMatchers ? middlewareMatchers : undefined;
                    return window.__MIDDLEWARE_MATCHERS;
                } else {}
            }
        },
        {
            key: "getDataHref",
            value: function getDataHref(params) {
                var _this = this;
                var asPath = params.asPath, href = params.href, locale = params.locale;
                var ref = (0, _parseRelativeUrl).parseRelativeUrl(href), hrefPathname = ref.pathname, query = ref.query, search = ref.search;
                var ref1 = (0, _parseRelativeUrl).parseRelativeUrl(asPath), asPathname = ref1.pathname;
                var route = (0, _removeTrailingSlash).removeTrailingSlash(hrefPathname);
                if (route[0] !== "/") {
                    throw new Error('Route name should start with a "/", got "'.concat(route, '"'));
                }
                var getHrefForSlug = function(path) {
                    var dataRoute = (0, _getAssetPathFromRoute).default((0, _removeTrailingSlash).removeTrailingSlash((0, _addLocale).addLocale(path, locale)), ".json");
                    return (0, _addBasePath).addBasePath("/_next/data/".concat(_this.buildId).concat(dataRoute).concat(search), true);
                };
                return getHrefForSlug(params.skipInterpolation ? asPathname : (0, _isDynamic).isDynamicRoute(route) ? (0, _router).interpolateAs(hrefPathname, asPathname, query).result : route);
            }
        },
        {
            /**
   * @param {string} route - the route (file-system path)
   */ key: "_isSsg",
            value: function _isSsg(route) {
                return this.promisedSsgManifest.then(function(manifest) {
                    return manifest.has(route);
                });
            }
        },
        {
            key: "loadPage",
            value: function loadPage(route) {
                return this.routeLoader.loadRoute(route).then(function(res) {
                    if ("component" in res) {
                        return {
                            page: res.component,
                            mod: res.exports,
                            styleSheets: res.styles.map(function(o) {
                                return {
                                    href: o.href,
                                    text: o.content
                                };
                            })
                        };
                    }
                    throw res.error;
                });
            }
        },
        {
            key: "prefetch",
            value: function prefetch(route) {
                return this.routeLoader.prefetch(route);
            }
        }
    ]);
    return PageLoader;
}();
exports["default"] = PageLoader;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=page-loader.js.map


/***/ }),

/***/ 9302:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
var _webVitals = __webpack_require__(8018);
var initialHref = location.href;
var isRegistered = false;
var userReportHandler;
function onReport(metric) {
    if (userReportHandler) {
        userReportHandler(metric);
    }
    // This code is not shipped, executed, or present in the client-side
    // JavaScript bundle unless explicitly enabled in your application.
    //
    // When this feature is enabled, we'll make it very clear by printing a
    // message during the build (`next build`).
    if (false) { var send, vitalsUrl, blob, body, ref, fallbackSend; }
}
var _default = function(onPerfEntry) {
    // Update function if it changes:
    userReportHandler = onPerfEntry;
    // Only register listeners once:
    if (isRegistered) {
        return;
    }
    isRegistered = true;
    (0, _webVitals).onCLS(onReport);
    (0, _webVitals).onFID(onReport);
    (0, _webVitals).onFCP(onReport);
    (0, _webVitals).onLCP(onReport);
    (0, _webVitals).onTTFB(onReport);
    (0, _webVitals).onINP(onReport);
};
exports["default"] = _default;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=performance-relayer.js.map


/***/ }),

/***/ 2207:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _slicedToArray = (__webpack_require__(4941)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.Portal = void 0;
var _react = __webpack_require__(7294);
var _reactDom = __webpack_require__(3935);
var Portal = function(param) {
    var children = param.children, type = param.type;
    var ref = _slicedToArray((0, _react).useState(null), 2), portalNode = ref[0], setPortalNode = ref[1];
    (0, _react).useEffect(function() {
        var element = document.createElement(type);
        document.body.appendChild(element);
        setPortalNode(element);
        return function() {
            document.body.removeChild(element);
        };
    }, [
        type
    ]);
    return portalNode ? /*#__PURE__*/ (0, _reactDom).createPortal(children, portalNode) : null;
};
exports.Portal = Portal;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=index.js.map


/***/ }),

/***/ 9320:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.removeBasePath = removeBasePath;
var _hasBasePath = __webpack_require__(4119);
var basePath =  false || "";
function removeBasePath(path) {
    if (false) {}
    path = path.slice(basePath.length);
    if (!path.startsWith("/")) path = "/".concat(path);
    return path;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=remove-base-path.js.map


/***/ }),

/***/ 5776:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.removeLocale = removeLocale;
var _parsePath = __webpack_require__(4943);
function removeLocale(path, locale) {
    if (false) { var localeLower, pathLower, pathname; }
    return path;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=remove-locale.js.map


/***/ }),

/***/ 9311:
/***/ (function(module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.cancelIdleCallback = exports.requestIdleCallback = void 0;
var requestIdleCallback = typeof self !== "undefined" && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
    var start = Date.now();
    return setTimeout(function() {
        cb({
            didTimeout: false,
            timeRemaining: function timeRemaining() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};
exports.requestIdleCallback = requestIdleCallback;
var cancelIdleCallback = typeof self !== "undefined" && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(id) {
    return clearTimeout(id);
};
exports.cancelIdleCallback = cancelIdleCallback;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=request-idle-callback.js.map


/***/ }),

/***/ 8982:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _slicedToArray = (__webpack_require__(4941)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = exports.RouteAnnouncer = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
var _router = __webpack_require__(387);
var nextjsRouteAnnouncerStyles = {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: "1px",
    margin: "-1px",
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    width: "1px",
    // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
    whiteSpace: "nowrap",
    wordWrap: "normal"
};
var RouteAnnouncer = function() {
    var asPath = (0, _router).useRouter().asPath;
    var ref = _slicedToArray(_react.default.useState(""), 2), routeAnnouncement = ref[0], setRouteAnnouncement = ref[1];
    // Only announce the path change, but not for the first load because screen
    // reader will do that automatically.
    var previouslyLoadedPath = _react.default.useRef(asPath);
    // Every time the path changes, announce the new page’s title following this
    // priority: first the document title (from head), otherwise the first h1, or
    // if none of these exist, then the pathname from the URL. This methodology is
    // inspired by Marcy Sutton’s accessible client routing user testing. More
    // information can be found here:
    // https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
    _react.default.useEffect(function() {
        // If the path hasn't change, we do nothing.
        if (previouslyLoadedPath.current === asPath) return;
        previouslyLoadedPath.current = asPath;
        if (document.title) {
            setRouteAnnouncement(document.title);
        } else {
            var pageHeader = document.querySelector("h1");
            var ref;
            var content = (ref = pageHeader == null ? void 0 : pageHeader.innerText) != null ? ref : pageHeader == null ? void 0 : pageHeader.textContent;
            setRouteAnnouncement(content || asPath);
        }
    }, [
        asPath
    ]);
    return /*#__PURE__*/ _react.default.createElement("p", {
        "aria-live": "assertive" // Make the announcement immediately.
        ,
        id: "__next-route-announcer__",
        role: "alert",
        style: nextjsRouteAnnouncerStyles
    }, routeAnnouncement);
};
exports.RouteAnnouncer = RouteAnnouncer;
var _default = RouteAnnouncer;
exports["default"] = _default;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=route-announcer.js.map


/***/ }),

/***/ 2669:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.markAssetError = markAssetError;
exports.isAssetError = isAssetError;
exports.getClientBuildManifest = getClientBuildManifest;
exports.createRouteLoader = createRouteLoader;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _getAssetPathFromRoute = _interop_require_default(__webpack_require__(3891));
var _trustedTypes = __webpack_require__(4991);
var _requestIdleCallback = __webpack_require__(9311);
// 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
// considers as "Good" time-to-interactive. We must assume something went
// wrong beyond this point, and then fall-back to a full page transition to
// show the user something of value.
var MS_MAX_IDLE_DELAY = 3800;
function withFuture(key, map, generator) {
    var entry = map.get(key);
    if (entry) {
        if ("future" in entry) {
            return entry.future;
        }
        return Promise.resolve(entry);
    }
    var resolver;
    var prom = new Promise(function(resolve) {
        resolver = resolve;
    });
    map.set(key, entry = {
        resolve: resolver,
        future: prom
    });
    return generator ? generator() // eslint-disable-next-line no-sequences
    .then(function(value) {
        return resolver(value), value;
    }).catch(function(err) {
        map.delete(key);
        throw err;
    }) : prom;
}
function hasPrefetch(link) {
    try {
        link = document.createElement("link");
        return(// with relList.support
        !!window.MSInputMethodContext && !!document.documentMode || link.relList.supports("prefetch"));
    } catch (e) {
        return false;
    }
}
var canPrefetch = hasPrefetch();
function prefetchViaDom(href, as, link) {
    return new Promise(function(res, rej) {
        var selector = '\n      link[rel="prefetch"][href^="'.concat(href, '"],\n      link[rel="preload"][href^="').concat(href, '"],\n      script[src^="').concat(href, '"]');
        if (document.querySelector(selector)) {
            return res();
        }
        link = document.createElement("link");
        // The order of property assignment here is intentional:
        if (as) link.as = as;
        link.rel = "prefetch";
        link.crossOrigin = undefined;
        link.onload = res;
        link.onerror = rej;
        // `href` should always be last:
        link.href = href;
        document.head.appendChild(link);
    });
}
var ASSET_LOAD_ERROR = Symbol("ASSET_LOAD_ERROR");
function markAssetError(err) {
    return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
}
function isAssetError(err) {
    return err && ASSET_LOAD_ERROR in err;
}
function appendScript(src, script) {
    return new Promise(function(resolve, reject) {
        script = document.createElement("script");
        // The order of property assignment here is intentional.
        // 1. Setup success/failure hooks in case the browser synchronously
        //    executes when `src` is set.
        script.onload = resolve;
        script.onerror = function() {
            return reject(markAssetError(new Error("Failed to load script: ".concat(src))));
        };
        // 2. Configure the cross-origin attribute before setting `src` in case the
        //    browser begins to fetch.
        script.crossOrigin = undefined;
        // 3. Finally, set the source and inject into the DOM in case the child
        //    must be appended for fetching to start.
        script.src = src;
        document.body.appendChild(script);
    });
}
// We wait for pages to be built in dev before we start the route transition
// timeout to prevent an un-necessary hard navigation in development.
var devBuildPromise;
// Resolve a promise that times out after given amount of milliseconds.
function resolvePromiseWithTimeout(p, ms, err) {
    return new Promise(function(resolve, reject) {
        var cancelled = false;
        p.then(function(r) {
            // Resolved, cancel the timeout
            cancelled = true;
            resolve(r);
        }).catch(reject);
        // We wrap these checks separately for better dead-code elimination in
        // production bundles.
        if (false) {}
        if (true) {
            (0, _requestIdleCallback).requestIdleCallback(function() {
                return setTimeout(function() {
                    if (!cancelled) {
                        reject(err);
                    }
                }, ms);
            });
        }
    });
}
function getClientBuildManifest() {
    if (self.__BUILD_MANIFEST) {
        return Promise.resolve(self.__BUILD_MANIFEST);
    }
    var onBuildManifest = new Promise(function(resolve) {
        // Mandatory because this is not concurrent safe:
        var cb = self.__BUILD_MANIFEST_CB;
        self.__BUILD_MANIFEST_CB = function() {
            resolve(self.__BUILD_MANIFEST);
            cb && cb();
        };
    });
    return resolvePromiseWithTimeout(onBuildManifest, MS_MAX_IDLE_DELAY, markAssetError(new Error("Failed to load client build manifest")));
}
function getFilesForRoute(assetPrefix, route) {
    if (false) { var scriptUrl; }
    return getClientBuildManifest().then(function(manifest) {
        if (!(route in manifest)) {
            throw markAssetError(new Error("Failed to lookup route: ".concat(route)));
        }
        var allFiles = manifest[route].map(function(entry) {
            return assetPrefix + "/_next/" + encodeURI(entry);
        });
        return {
            scripts: allFiles.filter(function(v) {
                return v.endsWith(".js");
            }).map(function(v) {
                return (0, _trustedTypes).__unsafeCreateTrustedScriptURL(v);
            }),
            css: allFiles.filter(function(v) {
                return v.endsWith(".css");
            })
        };
    });
}
function createRouteLoader(assetPrefix) {
    var maybeExecuteScript = function maybeExecuteScript(src) {
        // With HMR we might need to "reload" scripts when they are
        // disposed and readded. Executing scripts twice has no functional
        // differences
        if (true) {
            var prom = loadedScripts.get(src.toString());
            if (prom) {
                return prom;
            }
            // Skip executing script if it's already in the DOM:
            if (document.querySelector('script[src^="'.concat(src, '"]'))) {
                return Promise.resolve();
            }
            loadedScripts.set(src.toString(), prom = appendScript(src));
            return prom;
        } else {}
    };
    var fetchStyleSheet = function fetchStyleSheet(href) {
        var prom = styleSheets.get(href);
        if (prom) {
            return prom;
        }
        styleSheets.set(href, prom = fetch(href).then(function(res) {
            if (!res.ok) {
                throw new Error("Failed to load stylesheet: ".concat(href));
            }
            return res.text().then(function(text) {
                return {
                    href: href,
                    content: text
                };
            });
        }).catch(function(err) {
            throw markAssetError(err);
        }));
        return prom;
    };
    var entrypoints = new Map();
    var loadedScripts = new Map();
    var styleSheets = new Map();
    var routes = new Map();
    return {
        whenEntrypoint: function whenEntrypoint(route) {
            return withFuture(route, entrypoints);
        },
        onEntrypoint: function onEntrypoint(route, execute) {
            (execute ? Promise.resolve().then(function() {
                return execute();
            }).then(function(exports1) {
                return {
                    component: exports1 && exports1.default || exports1,
                    exports: exports1
                };
            }, function(err) {
                return {
                    error: err
                };
            }) : Promise.resolve(undefined)).then(function(input) {
                var old = entrypoints.get(route);
                if (old && "resolve" in old) {
                    if (input) {
                        entrypoints.set(route, input);
                        old.resolve(input);
                    }
                } else {
                    if (input) {
                        entrypoints.set(route, input);
                    } else {
                        entrypoints.delete(route);
                    }
                    // when this entrypoint has been resolved before
                    // the route is outdated and we want to invalidate
                    // this cache entry
                    routes.delete(route);
                }
            });
        },
        loadRoute: function loadRoute(route, prefetch) {
            var _this = this;
            return withFuture(route, routes, function() {
                var devBuildPromiseResolve;
                if (false) {}
                return resolvePromiseWithTimeout(getFilesForRoute(assetPrefix, route).then(function(param) {
                    var scripts = param.scripts, css = param.css;
                    return Promise.all([
                        entrypoints.has(route) ? [] : Promise.all(scripts.map(maybeExecuteScript)),
                        Promise.all(css.map(fetchStyleSheet))
                    ]);
                }).then(function(res) {
                    return _this.whenEntrypoint(route).then(function(entrypoint) {
                        return {
                            entrypoint: entrypoint,
                            styles: res[1]
                        };
                    });
                }), MS_MAX_IDLE_DELAY, markAssetError(new Error("Route did not complete loading: ".concat(route)))).then(function(param) {
                    var entrypoint = param.entrypoint, styles = param.styles;
                    var res = Object.assign({
                        styles: styles
                    }, entrypoint);
                    return "error" in entrypoint ? entrypoint : res;
                }).catch(function(err) {
                    if (prefetch) {
                        // we don't want to cache errors during prefetch
                        throw err;
                    }
                    return {
                        error: err
                    };
                }).finally(function() {
                    return devBuildPromiseResolve == null ? void 0 : devBuildPromiseResolve();
                });
            });
        },
        prefetch: function prefetch(route) {
            var _this = this;
            // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
            // License: Apache 2.0
            var cn;
            if (cn = navigator.connection) {
                // Don't prefetch if using 2G or if Save-Data is enabled.
                if (cn.saveData || /2g/.test(cn.effectiveType)) return Promise.resolve();
            }
            return getFilesForRoute(assetPrefix, route).then(function(output) {
                return Promise.all(canPrefetch ? output.scripts.map(function(script) {
                    return prefetchViaDom(script.toString(), "script");
                }) : []);
            }).then(function() {
                (0, _requestIdleCallback).requestIdleCallback(function() {
                    return _this.loadRoute(route, true).catch(function() {});
                });
            }).catch(function() {});
        }
    };
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=route-loader.js.map


/***/ }),

/***/ 387:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _construct = (__webpack_require__(5317)["default"]);
var _toConsumableArray = (__webpack_require__(3929)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "Router", ({
    enumerable: true,
    get: function get() {
        return _router.default;
    }
}));
Object.defineProperty(exports, "withRouter", ({
    enumerable: true,
    get: function get() {
        return _withRouter.default;
    }
}));
exports.useRouter = useRouter;
exports.createRouter = createRouter;
exports.makePublicRouterInstance = makePublicRouterInstance;
exports["default"] = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
var _router = _interop_require_default(__webpack_require__(6273));
var _routerContext = __webpack_require__(3462);
var _isError = _interop_require_default(__webpack_require__(676));
var _withRouter = _interop_require_default(__webpack_require__(8981));
var singletonRouter = {
    router: null,
    readyCallbacks: [],
    ready: function ready(cb) {
        if (this.router) return cb();
        if (true) {
            this.readyCallbacks.push(cb);
        }
    }
};
// Create public properties and methods of the router in the singletonRouter
var urlPropertyFields = [
    "pathname",
    "route",
    "query",
    "asPath",
    "components",
    "isFallback",
    "basePath",
    "locale",
    "locales",
    "defaultLocale",
    "isReady",
    "isPreview",
    "isLocaleDomain",
    "domainLocales"
];
var routerEvents = [
    "routeChangeStart",
    "beforeHistoryChange",
    "routeChangeComplete",
    "routeChangeError",
    "hashChangeStart",
    "hashChangeComplete"
];
var coreMethodFields = [
    "push",
    "replace",
    "reload",
    "back",
    "prefetch",
    "beforePopState"
];
// Events is a static property on the router, the router doesn't have to be initialized to use it
Object.defineProperty(singletonRouter, "events", {
    get: function get() {
        return _router.default.events;
    }
});
function getRouter() {
    if (!singletonRouter.router) {
        var message = "No router instance found.\n" + 'You should only use "next/router" on the client side of your app.\n';
        throw new Error(message);
    }
    return singletonRouter.router;
}
urlPropertyFields.forEach(function(field) {
    // Here we need to use Object.defineProperty because we need to return
    // the property assigned to the actual router
    // The value might get changed as we change routes and this is the
    // proper way to access it
    Object.defineProperty(singletonRouter, field, {
        get: function get() {
            var router = getRouter();
            return router[field];
        }
    });
});
coreMethodFields.forEach(function(field) {
    singletonRouter[field] = function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        var _router;
        var router = getRouter();
        return (_router = router)[field].apply(_router, _toConsumableArray(args));
    };
});
routerEvents.forEach(function(event) {
    singletonRouter.ready(function() {
        _router.default.events.on(event, function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            var eventField = "on".concat(event.charAt(0).toUpperCase()).concat(event.substring(1));
            var _singletonRouter = singletonRouter;
            if (_singletonRouter[eventField]) {
                try {
                    var __singletonRouter;
                    (__singletonRouter = _singletonRouter)[eventField].apply(__singletonRouter, _toConsumableArray(args));
                } catch (err) {
                    console.error("Error when running the Router event: ".concat(eventField));
                    console.error((0, _isError).default(err) ? "".concat(err.message, "\n").concat(err.stack) : err + "");
                }
            }
        });
    });
});
var _default = singletonRouter;
exports["default"] = _default;
function useRouter() {
    return _react.default.useContext(_routerContext.RouterContext);
}
function createRouter() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    singletonRouter.router = _construct(_router.default, _toConsumableArray(args));
    singletonRouter.readyCallbacks.forEach(function(cb) {
        return cb();
    });
    singletonRouter.readyCallbacks = [];
    return singletonRouter.router;
}
function makePublicRouterInstance(router) {
    var scopedRouter = router;
    var instance = {};
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = urlPropertyFields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var property = _step.value;
            if (typeof scopedRouter[property] === "object") {
                instance[property] = Object.assign(Array.isArray(scopedRouter[property]) ? [] : {}, scopedRouter[property]) // makes sure query is not stateful
                ;
                continue;
            }
            instance[property] = scopedRouter[property];
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    // Events is a static property on the router, the router doesn't have to be initialized to use it
    instance.events = _router.default.events;
    coreMethodFields.forEach(function(field) {
        instance[field] = function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            var _scopedRouter;
            return (_scopedRouter = scopedRouter)[field].apply(_scopedRouter, _toConsumableArray(args));
        };
    });
    return instance;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=router.js.map


/***/ }),

/***/ 699:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _slicedToArray = (__webpack_require__(4941)/* ["default"] */ .Z);
var _toConsumableArray = (__webpack_require__(3929)/* ["default"] */ .Z);
"client";
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.handleClientScriptLoad = handleClientScriptLoad;
exports.initScriptLoader = initScriptLoader;
exports["default"] = void 0;
var _extends = (__webpack_require__(6495)/* ["default"] */ .Z);
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
var _object_without_properties_loose = (__webpack_require__(7273)/* ["default"] */ .Z);
var _react = _interop_require_wildcard(__webpack_require__(7294));
var _headManagerContext = __webpack_require__(8404);
var _headManager = __webpack_require__(6007);
var _requestIdleCallback = __webpack_require__(9311);
"client";
var ScriptCache = new Map();
var LoadCache = new Set();
var ignoreProps = [
    "onLoad",
    "onReady",
    "dangerouslySetInnerHTML",
    "children",
    "onError",
    "strategy"
];
var loadScript = function(props) {
    var src = props.src, id = props.id, _onLoad = props.onLoad, onLoad = _onLoad === void 0 ? function() {} : _onLoad, _onReady = props.onReady, onReady = _onReady === void 0 ? null : _onReady, dangerouslySetInnerHTML = props.dangerouslySetInnerHTML, _children = props.children, children = _children === void 0 ? "" : _children, _strategy = props.strategy, strategy = _strategy === void 0 ? "afterInteractive" : _strategy, onError = props.onError;
    var cacheKey = id || src;
    // Script has already loaded
    if (cacheKey && LoadCache.has(cacheKey)) {
        return;
    }
    // Contents of this script are already loading/loaded
    if (ScriptCache.has(src)) {
        LoadCache.add(cacheKey);
        // It is possible that multiple `next/script` components all have same "src", but has different "onLoad"
        // This is to make sure the same remote script will only load once, but "onLoad" are executed in order
        ScriptCache.get(src).then(onLoad, onError);
        return;
    }
    /** Execute after the script first loaded */ var afterLoad = function() {
        // Run onReady for the first time after load event
        if (onReady) {
            onReady();
        }
        // add cacheKey to LoadCache when load successfully
        LoadCache.add(cacheKey);
    };
    var el = document.createElement("script");
    var loadPromise = new Promise(function(resolve, reject) {
        el.addEventListener("load", function(e) {
            resolve();
            if (onLoad) {
                onLoad.call(this, e);
            }
            afterLoad();
        });
        el.addEventListener("error", function(e) {
            reject(e);
        });
    }).catch(function(e) {
        if (onError) {
            onError(e);
        }
    });
    if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || "";
        afterLoad();
    } else if (children) {
        el.textContent = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
        afterLoad();
    } else if (src) {
        el.src = src;
        // do not add cacheKey into LoadCache for remote script here
        // cacheKey will be added to LoadCache when it is actually loaded (see loadPromise above)
        ScriptCache.set(src, loadPromise);
    }
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Object.entries(props)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _value = _slicedToArray(_step.value, 2), k = _value[0], value = _value[1];
            if (value === undefined || ignoreProps.includes(k)) {
                continue;
            }
            var attr = _headManager.DOMAttributeNames[k] || k.toLowerCase();
            el.setAttribute(attr, value);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    if (strategy === "worker") {
        el.setAttribute("type", "text/partytown");
    }
    el.setAttribute("data-nscript", strategy);
    document.body.appendChild(el);
};
function handleClientScriptLoad(props) {
    var _strategy = props.strategy, strategy = _strategy === void 0 ? "afterInteractive" : _strategy;
    if (strategy === "lazyOnload") {
        window.addEventListener("load", function() {
            (0, _requestIdleCallback).requestIdleCallback(function() {
                return loadScript(props);
            });
        });
    } else {
        loadScript(props);
    }
}
function loadLazyScript(props) {
    if (document.readyState === "complete") {
        (0, _requestIdleCallback).requestIdleCallback(function() {
            return loadScript(props);
        });
    } else {
        window.addEventListener("load", function() {
            (0, _requestIdleCallback).requestIdleCallback(function() {
                return loadScript(props);
            });
        });
    }
}
function addBeforeInteractiveToCache() {
    var scripts = _toConsumableArray(document.querySelectorAll('[data-nscript="beforeInteractive"]')).concat(_toConsumableArray(document.querySelectorAll('[data-nscript="beforePageRender"]')));
    scripts.forEach(function(script) {
        var cacheKey = script.id || script.getAttribute("src");
        LoadCache.add(cacheKey);
    });
}
function initScriptLoader(scriptLoaderItems) {
    scriptLoaderItems.forEach(handleClientScriptLoad);
    addBeforeInteractiveToCache();
}
function Script(props) {
    var id = props.id, _src = props.src, src = _src === void 0 ? "" : _src, _onLoad = props.onLoad, onLoad = _onLoad === void 0 ? function() {} : _onLoad, _onReady = props.onReady, onReady = _onReady === void 0 ? null : _onReady, _strategy = props.strategy, strategy = _strategy === void 0 ? "afterInteractive" : _strategy, onError = props.onError, restProps = _object_without_properties_loose(props, [
        "id",
        "src",
        "onLoad",
        "onReady",
        "strategy",
        "onError"
    ]);
    // Context is available only during SSR
    var ref = (0, _react).useContext(_headManagerContext.HeadManagerContext), updateScripts = ref.updateScripts, scripts = ref.scripts, getIsSsr = ref.getIsSsr;
    /**
   * - First mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script hasn't loaded yet (not in LoadCache)
   *      onReady is skipped, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. hasLoadScriptEffectCalled.current is false, loadScript executes
   *      Once the script is loaded, the onLoad and onReady will be called by then
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   *
   * - Second mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script has already loaded (found in LoadCache)
   *      onReady is called, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. The script is already loaded, loadScript bails out
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   */ var hasOnReadyEffectCalled = (0, _react).useRef(false);
    (0, _react).useEffect(function() {
        var cacheKey = id || src;
        if (!hasOnReadyEffectCalled.current) {
            // Run onReady if script has loaded before but component is re-mounted
            if (onReady && cacheKey && LoadCache.has(cacheKey)) {
                onReady();
            }
            hasOnReadyEffectCalled.current = true;
        }
    }, [
        onReady,
        id,
        src
    ]);
    var hasLoadScriptEffectCalled = (0, _react).useRef(false);
    (0, _react).useEffect(function() {
        if (!hasLoadScriptEffectCalled.current) {
            if (strategy === "afterInteractive") {
                loadScript(props);
            } else if (strategy === "lazyOnload") {
                loadLazyScript(props);
            }
            hasLoadScriptEffectCalled.current = true;
        }
    }, [
        props,
        strategy
    ]);
    if (strategy === "beforeInteractive" || strategy === "worker") {
        if (updateScripts) {
            scripts[strategy] = (scripts[strategy] || []).concat([
                _extends({
                    id: id,
                    src: src,
                    onLoad: onLoad,
                    onReady: onReady,
                    onError: onError
                }, restProps)
            ]);
            updateScripts(scripts);
        } else if (getIsSsr && getIsSsr()) {
            // Script has already loaded during SSR
            LoadCache.add(id || src);
        } else if (getIsSsr && !getIsSsr()) {
            loadScript(props);
        }
    }
    return null;
}
Object.defineProperty(Script, "__nextScript", {
    value: true
});
var _default = Script;
exports["default"] = _default;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=script.js.map


/***/ }),

/***/ 4991:
/***/ (function(module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.__unsafeCreateTrustedScriptURL = __unsafeCreateTrustedScriptURL;
/**
 * Stores the Trusted Types Policy. Starts as undefined and can be set to null
 * if Trusted Types is not supported in the browser.
 */ var policy;
/**
 * Getter for the Trusted Types Policy. If it is undefined, it is instantiated
 * here or set to null if Trusted Types is not supported in the browser.
 */ function getPolicy() {
    if (typeof policy === "undefined" && "object" !== "undefined") {
        var ref;
        policy = ((ref = window.trustedTypes) == null ? void 0 : ref.createPolicy("nextjs", {
            createHTML: function(input) {
                return input;
            },
            createScript: function(input) {
                return input;
            },
            createScriptURL: function(input) {
                return input;
            }
        })) || null;
    }
    return policy;
}
function __unsafeCreateTrustedScriptURL(url) {
    var ref;
    return ((ref = getPolicy()) == null ? void 0 : ref.createScriptURL(url)) || url;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=trusted-types.js.map


/***/ }),

/***/ 8981:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = withRouter;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
var _router = __webpack_require__(387);
function withRouter(ComposedComponent) {
    var WithRouterWrapper = function WithRouterWrapper(props) {
        return /*#__PURE__*/ _react.default.createElement(ComposedComponent, Object.assign({
            router: (0, _router).useRouter()
        }, props));
    };
    WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps;
    WithRouterWrapper.origGetInitialProps = ComposedComponent.origGetInitialProps;
    if (false) { var name; }
    return WithRouterWrapper;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=with-router.js.map


/***/ }),

/***/ 6029:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _classCallCheck = (__webpack_require__(9658)/* ["default"] */ .Z);
var _createClass = (__webpack_require__(7222)/* ["default"] */ .Z);
var _inherits = (__webpack_require__(7788)/* ["default"] */ .Z);
var _createSuper = (__webpack_require__(7735)/* ["default"] */ .Z);
var _tsGenerator = (__webpack_require__(2401)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "AppInitialProps", ({
    enumerable: true,
    get: function get() {
        return _utils.AppInitialProps;
    }
}));
Object.defineProperty(exports, "NextWebVitalsMetric", ({
    enumerable: true,
    get: function get() {
        return _utils.NextWebVitalsMetric;
    }
}));
Object.defineProperty(exports, "AppType", ({
    enumerable: true,
    get: function get() {
        return _utils.AppType;
    }
}));
exports["default"] = void 0;
var _async_to_generator = (__webpack_require__(932)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
var _utils = __webpack_require__(3794);
function appGetInitialProps(_) {
    return _appGetInitialProps.apply(this, arguments);
}
function _appGetInitialProps() {
    _appGetInitialProps = /**
 * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
 * This allows for keeping state between navigation, custom error handling, injecting additional data.
 */ _async_to_generator(function(param) {
        var Component, ctx, pageProps;
        return _tsGenerator(this, function(_state) {
            switch(_state.label){
                case 0:
                    Component = param.Component, ctx = param.ctx;
                    return [
                        4,
                        (0, _utils).loadGetInitialProps(Component, ctx)
                    ];
                case 1:
                    pageProps = _state.sent();
                    return [
                        2,
                        {
                            pageProps: pageProps
                        }
                    ];
            }
        });
    });
    return _appGetInitialProps.apply(this, arguments);
}
var _Component;
var App = /*#__PURE__*/ function(_superClass) {
    _inherits(App, _superClass);
    var _super = _createSuper(App);
    function App() {
        _classCallCheck(this, App);
        return _super.apply(this, arguments);
    }
    _createClass(App, [
        {
            key: "render",
            value: function render() {
                var _props = this.props, Component = _props.Component, pageProps = _props.pageProps;
                return /*#__PURE__*/ _react.default.createElement(Component, Object.assign({}, pageProps));
            }
        }
    ]);
    return App;
}(_Component = _react.default.Component);
App.origGetInitialProps = appGetInitialProps;
App.getInitialProps = appGetInitialProps;
exports["default"] = App; //# sourceMappingURL=_app.js.map


/***/ }),

/***/ 9185:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _classCallCheck = (__webpack_require__(9658)/* ["default"] */ .Z);
var _createClass = (__webpack_require__(7222)/* ["default"] */ .Z);
var _inherits = (__webpack_require__(7788)/* ["default"] */ .Z);
var _createSuper = (__webpack_require__(7735)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
var _head = _interop_require_default(__webpack_require__(5443));
var statusCodes = {
    400: "Bad Request",
    404: "This page could not be found",
    405: "Method Not Allowed",
    500: "Internal Server Error"
};
function _getInitialProps(param) {
    var res = param.res, err = param.err;
    var statusCode = res && res.statusCode ? res.statusCode : err ? err.statusCode : 404;
    return {
        statusCode: statusCode
    };
}
var styles = {
    error: {
        fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
        height: "100vh",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    desc: {
        display: "inline-block",
        textAlign: "left",
        lineHeight: "49px",
        height: "49px",
        verticalAlign: "middle"
    },
    h1: {
        display: "inline-block",
        margin: 0,
        marginRight: "20px",
        padding: "0 23px 0 0",
        fontSize: "24px",
        fontWeight: 500,
        verticalAlign: "top",
        lineHeight: "49px"
    },
    h2: {
        fontSize: "14px",
        fontWeight: "normal",
        lineHeight: "49px",
        margin: 0,
        padding: 0
    }
};
var _Component;
var Error = /*#__PURE__*/ function(_superClass) {
    _inherits(Error, _superClass);
    var _super = _createSuper(Error);
    function Error() {
        _classCallCheck(this, Error);
        return _super.apply(this, arguments);
    }
    _createClass(Error, [
        {
            key: "render",
            value: function render() {
                var _props = this.props, statusCode = _props.statusCode, _withDarkMode = _props.withDarkMode, withDarkMode = _withDarkMode === void 0 ? true : _withDarkMode;
                var title = this.props.title || statusCodes[statusCode] || "An unexpected error has occurred";
                return /*#__PURE__*/ _react.default.createElement("div", {
                    style: styles.error
                }, /*#__PURE__*/ _react.default.createElement(_head.default, null, /*#__PURE__*/ _react.default.createElement("title", null, statusCode ? "".concat(statusCode, ": ").concat(title) : "Application error: a client-side exception has occurred")), /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("style", {
                    dangerouslySetInnerHTML: {
                        __html: "\n                body { margin: 0; color: #000; background: #fff; }\n                .next-error-h1 {\n                  border-right: 1px solid rgba(0, 0, 0, .3);\n                }\n\n                ".concat(withDarkMode ? "@media (prefers-color-scheme: dark) {\n                  body { color: #fff; background: #000; }\n                  .next-error-h1 {\n                    border-right: 1px solid rgba(255, 255, 255, .3);\n                  }\n                }" : "")
                    }
                }), statusCode ? /*#__PURE__*/ _react.default.createElement("h1", {
                    className: "next-error-h1",
                    style: styles.h1
                }, statusCode) : null, /*#__PURE__*/ _react.default.createElement("div", {
                    style: styles.desc
                }, /*#__PURE__*/ _react.default.createElement("h2", {
                    style: styles.h2
                }, this.props.title || statusCode ? title : /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, "Application error: a client-side exception has occurred (see the browser console for more information)"), "."))));
            }
        }
    ]);
    return Error;
}(_Component = _react.default.Component);
Error.displayName = "ErrorPage";
Error.getInitialProps = _getInitialProps;
Error.origGetInitialProps = _getInitialProps;
exports["default"] = Error; //# sourceMappingURL=_error.js.map


/***/ }),

/***/ 2227:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AmpStateContext = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
var AmpStateContext = _react.default.createContext({});
exports.AmpStateContext = AmpStateContext;
if (false) {} //# sourceMappingURL=amp-context.js.map


/***/ }),

/***/ 7363:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.isInAmpMode = isInAmpMode;
function isInAmpMode() {
    var ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ampFirst = ref.ampFirst, ampFirst = _ampFirst === void 0 ? false : _ampFirst, _hybrid = ref.hybrid, hybrid = _hybrid === void 0 ? false : _hybrid, _hasQuery = ref.hasQuery, hasQuery = _hasQuery === void 0 ? false : _hasQuery;
    return ampFirst || hybrid && hasQuery;
} //# sourceMappingURL=amp-mode.js.map


/***/ }),

/***/ 489:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.escapeStringRegexp = escapeStringRegexp;
// regexp is based on https://github.com/sindresorhus/escape-string-regexp
var reHasRegExp = /[|\\{}()[\]^$+*?.-]/;
var reReplaceRegExp = /[|\\{}()[\]^$+*?.-]/g;
function escapeStringRegexp(str) {
    // see also: https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/escapeRegExp.js#L23
    if (reHasRegExp.test(str)) {
        return str.replace(reReplaceRegExp, "\\$&");
    }
    return str;
} //# sourceMappingURL=escape-regexp.js.map


/***/ }),

/***/ 8404:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.HeadManagerContext = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
var HeadManagerContext = _react.default.createContext({});
exports.HeadManagerContext = HeadManagerContext;
if (false) {} //# sourceMappingURL=head-manager-context.js.map


/***/ }),

/***/ 5443:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"client";
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.defaultHead = defaultHead;
exports["default"] = void 0;
var _extends = (__webpack_require__(6495)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
var _react = _interop_require_wildcard(__webpack_require__(7294));
var _sideEffect = _interop_require_default(__webpack_require__(5188));
var _ampContext = __webpack_require__(2227);
var _headManagerContext = __webpack_require__(8404);
var _ampMode = __webpack_require__(7363);
var _utils = __webpack_require__(3794);
"client";
function defaultHead() {
    var inAmpMode = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    var head = [
        /*#__PURE__*/ _react.default.createElement("meta", {
            charSet: "utf-8"
        })
    ];
    if (!inAmpMode) {
        head.push(/*#__PURE__*/ _react.default.createElement("meta", {
            name: "viewport",
            content: "width=device-width"
        }));
    }
    return head;
}
function onlyReactElement(list, child) {
    // React children can be "string" or "number" in this case we ignore them for backwards compat
    if (typeof child === "string" || typeof child === "number") {
        return list;
    }
    // Adds support for React.Fragment
    if (child.type === _react.default.Fragment) {
        return list.concat(_react.default.Children.toArray(child.props.children).reduce(function(fragmentList, fragmentChild) {
            if (typeof fragmentChild === "string" || typeof fragmentChild === "number") {
                return fragmentList;
            }
            return fragmentList.concat(fragmentChild);
        }, []));
    }
    return list.concat(child);
}
var METATYPES = [
    "name",
    "httpEquiv",
    "charSet",
    "itemProp"
];
/*
 returns a function for filtering head child elements
 which shouldn't be duplicated, like <title/>
 Also adds support for deduplicated `key` properties
*/ function unique() {
    var keys = new Set();
    var tags = new Set();
    var metaTypes = new Set();
    var metaCategories = {};
    return function(h) {
        var isUnique = true;
        var hasKey = false;
        if (h.key && typeof h.key !== "number" && h.key.indexOf("$") > 0) {
            hasKey = true;
            var key = h.key.slice(h.key.indexOf("$") + 1);
            if (keys.has(key)) {
                isUnique = false;
            } else {
                keys.add(key);
            }
        }
        // eslint-disable-next-line default-case
        switch(h.type){
            case "title":
            case "base":
                if (tags.has(h.type)) {
                    isUnique = false;
                } else {
                    tags.add(h.type);
                }
                break;
            case "meta":
                for(var i = 0, len = METATYPES.length; i < len; i++){
                    var metatype = METATYPES[i];
                    if (!h.props.hasOwnProperty(metatype)) continue;
                    if (metatype === "charSet") {
                        if (metaTypes.has(metatype)) {
                            isUnique = false;
                        } else {
                            metaTypes.add(metatype);
                        }
                    } else {
                        var category = h.props[metatype];
                        var categories = metaCategories[metatype] || new Set();
                        if ((metatype !== "name" || !hasKey) && categories.has(category)) {
                            isUnique = false;
                        } else {
                            categories.add(category);
                            metaCategories[metatype] = categories;
                        }
                    }
                }
                break;
        }
        return isUnique;
    };
}
/**
 *
 * @param headChildrenElements List of children of <Head>
 */ function reduceComponents(headChildrenElements, props) {
    var inAmpMode = props.inAmpMode;
    return headChildrenElements.reduce(onlyReactElement, []).reverse().concat(defaultHead(inAmpMode).reverse()).filter(unique()).reverse().map(function(c, i) {
        var key = c.key || i;
        if ( true && !inAmpMode) {
            if (c.type === "link" && c.props["href"] && // TODO(prateekbh@): Replace this with const from `constants` when the tree shaking works.
            [
                "https://fonts.googleapis.com/css",
                "https://use.typekit.net/"
            ].some(function(url) {
                return c.props["href"].startsWith(url);
            })) {
                var newProps = _extends({}, c.props || {});
                newProps["data-href"] = newProps["href"];
                newProps["href"] = undefined;
                // Add this attribute to make it easy to identify optimized tags
                newProps["data-optimized-fonts"] = true;
                return /*#__PURE__*/ _react.default.cloneElement(c, newProps);
            }
        }
        if (false) { var srcMessage; }
        return /*#__PURE__*/ _react.default.cloneElement(c, {
            key: key
        });
    });
}
/**
 * This component injects elements to `<head>` of your page.
 * To avoid duplicated `tags` in `<head>` you can use the `key` property, which will make sure every tag is only rendered once.
 */ function Head(param) {
    var children = param.children;
    var ampState = (0, _react).useContext(_ampContext.AmpStateContext);
    var headManager = (0, _react).useContext(_headManagerContext.HeadManagerContext);
    return /*#__PURE__*/ _react.default.createElement(_sideEffect.default, {
        reduceComponentsToState: reduceComponents,
        headManager: headManager,
        inAmpMode: (0, _ampMode).isInAmpMode(ampState)
    }, children);
}
var _default = Head;
exports["default"] = _default;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=head.js.map


/***/ }),

/***/ 4317:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.normalizeLocalePath = normalizeLocalePath;
function normalizeLocalePath(pathname, locales) {
    var detectedLocale;
    // first item will be empty string from splitting at first char
    var pathnameParts = pathname.split("/");
    (locales || []).some(function(locale) {
        if (pathnameParts[1] && pathnameParts[1].toLowerCase() === locale.toLowerCase()) {
            detectedLocale = locale;
            pathnameParts.splice(1, 1);
            pathname = pathnameParts.join("/") || "/";
            return true;
        }
        return false;
    });
    return {
        pathname: pathname,
        detectedLocale: detectedLocale
    };
} //# sourceMappingURL=normalize-locale-path.js.map


/***/ }),

/***/ 9977:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ImageConfigContext = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
var _imageConfig = __webpack_require__(9309);
var ImageConfigContext = _react.default.createContext(_imageConfig.imageConfigDefault);
exports.ImageConfigContext = ImageConfigContext;
if (false) {} //# sourceMappingURL=image-config-context.js.map


/***/ }),

/***/ 9309:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.imageConfigDefault = exports.VALID_LOADERS = void 0;
var VALID_LOADERS = [
    "default",
    "imgix",
    "cloudinary",
    "akamai",
    "custom"
];
exports.VALID_LOADERS = VALID_LOADERS;
var imageConfigDefault = {
    deviceSizes: [
        640,
        750,
        828,
        1080,
        1200,
        1920,
        2048,
        3840
    ],
    imageSizes: [
        16,
        32,
        48,
        64,
        96,
        128,
        256,
        384
    ],
    path: "/_next/image",
    loader: "default",
    domains: [],
    disableStaticImages: false,
    minimumCacheTTL: 60,
    formats: [
        "image/webp"
    ],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
    remotePatterns: [],
    unoptimized: false
};
exports.imageConfigDefault = imageConfigDefault; //# sourceMappingURL=image-config.js.map


/***/ }),

/***/ 8887:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getObjectClassLabel = getObjectClassLabel;
exports.isPlainObject = isPlainObject;
function getObjectClassLabel(value) {
    return Object.prototype.toString.call(value);
}
function isPlainObject(value) {
    if (getObjectClassLabel(value) !== "[object Object]") {
        return false;
    }
    var prototype = Object.getPrototypeOf(value);
    /**
   * this used to be previously:
   *
   * `return prototype === null || prototype === Object.prototype`
   *
   * but Edge Runtime expose Object from vm, being that kind of type-checking wrongly fail.
   *
   * It was changed to the current implementation since it's resilient to serialization.
   */ return prototype === null || prototype.hasOwnProperty("isPrototypeOf");
} //# sourceMappingURL=is-plain-object.js.map


/***/ }),

/***/ 5660:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _toConsumableArray = (__webpack_require__(3929)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = mitt;
function mitt() {
    var all = Object.create(null);
    return {
        on: function on(type, handler) {
            (all[type] || (all[type] = [])).push(handler);
        },
        off: function off(type, handler) {
            if (all[type]) {
                all[type].splice(all[type].indexOf(handler) >>> 0, 1);
            }
        },
        emit: function emit(type) {
            for(var _len = arguments.length, evts = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                evts[_key - 1] = arguments[_key];
            }
            (all[type] || []).slice().map(function(handler) {
                handler.apply(void 0, _toConsumableArray(evts));
            });
        }
    };
} //# sourceMappingURL=mitt.js.map


/***/ }),

/***/ 8317:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.denormalizePagePath = denormalizePagePath;
var _utils = __webpack_require__(418);
var _normalizePathSep = __webpack_require__(9892);
function denormalizePagePath(page) {
    var _page = (0, _normalizePathSep).normalizePathSep(page);
    return _page.startsWith("/index/") && !(0, _utils).isDynamicRoute(_page) ? _page.slice(6) : _page !== "/index" ? _page : "/";
} //# sourceMappingURL=denormalize-page-path.js.map


/***/ }),

/***/ 9892:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.normalizePathSep = normalizePathSep;
function normalizePathSep(path) {
    return path.replace(/\\/g, "/");
} //# sourceMappingURL=normalize-path-sep.js.map


/***/ }),

/***/ 3462:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.RouterContext = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
var RouterContext = _react.default.createContext(null);
exports.RouterContext = RouterContext;
if (false) {} //# sourceMappingURL=router-context.js.map


/***/ }),

/***/ 6273:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _classCallCheck = (__webpack_require__(9658)/* ["default"] */ .Z);
var _createClass = (__webpack_require__(7222)/* ["default"] */ .Z);
var _slicedToArray = (__webpack_require__(4941)/* ["default"] */ .Z);
var _tsGenerator = (__webpack_require__(2401)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.matchesMiddleware = matchesMiddleware;
exports.isLocalURL = isLocalURL;
exports.interpolateAs = interpolateAs;
exports.resolveHref = resolveHref;
exports.createKey = createKey;
exports["default"] = void 0;
var _async_to_generator = (__webpack_require__(932)/* ["default"] */ .Z);
var _extends = (__webpack_require__(6495)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
var _normalizeTrailingSlash = __webpack_require__(2392);
var _removeTrailingSlash = __webpack_require__(6316);
var _routeLoader = __webpack_require__(2669);
var _script = __webpack_require__(699);
var _isError = _interop_require_wildcard(__webpack_require__(676));
var _denormalizePagePath = __webpack_require__(8317);
var _normalizeLocalePath = __webpack_require__(4317);
var _mitt = _interop_require_default(__webpack_require__(5660));
var _utils = __webpack_require__(3794);
var _isDynamic = __webpack_require__(8689);
var _parseRelativeUrl = __webpack_require__(6305);
var _querystring = __webpack_require__(466);
var _resolveRewrites = _interop_require_default(__webpack_require__(2431));
var _routeMatcher = __webpack_require__(3888);
var _routeRegex = __webpack_require__(4095);
var _formatUrl = __webpack_require__(4611);
var _detectDomainLocale = __webpack_require__(8748);
var _parsePath = __webpack_require__(4943);
var _addLocale = __webpack_require__(2725);
var _removeLocale = __webpack_require__(5776);
var _removeBasePath = __webpack_require__(9320);
var _addBasePath = __webpack_require__(8684);
var _hasBasePath = __webpack_require__(4119);
var _getNextPathnameInfo = __webpack_require__(159);
var _formatNextPathnameInfo = __webpack_require__(4022);
var _compareStates = __webpack_require__(610);
var _isBot = __webpack_require__(9671);
function buildCancellationError() {
    return Object.assign(new Error("Route Cancelled"), {
        cancelled: true
    });
}
function matchesMiddleware(options) {
    return _matchesMiddleware.apply(this, arguments);
}
function _matchesMiddleware() {
    _matchesMiddleware = _async_to_generator(function(options) {
        var matchers, ref, asPathname, cleanedAs, asWithBasePathAndLocale;
        return _tsGenerator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve(options.router.pageLoader.getMiddleware())
                    ];
                case 1:
                    matchers = _state.sent();
                    if (!matchers) return [
                        2,
                        false
                    ];
                    ref = (0, _parsePath).parsePath(options.asPath), asPathname = ref.pathname;
                    cleanedAs = (0, _hasBasePath).hasBasePath(asPathname) ? (0, _removeBasePath).removeBasePath(asPathname) : asPathname;
                    asWithBasePathAndLocale = (0, _addBasePath).addBasePath((0, _addLocale).addLocale(cleanedAs, options.locale));
                    // Check only path match on client. Matching "has" should be done on server
                    // where we can access more info such as headers, HttpOnly cookie, etc.
                    return [
                        2,
                        matchers.some(function(m) {
                            return new RegExp(m.regexp).test(asWithBasePathAndLocale);
                        })
                    ];
            }
        });
    });
    return _matchesMiddleware.apply(this, arguments);
}
function stripOrigin(url) {
    var origin = (0, _utils).getLocationOrigin();
    return url.startsWith(origin) ? url.substring(origin.length) : url;
}
function omit(object, keys) {
    var omitted = {};
    Object.keys(object).forEach(function(key) {
        if (!keys.includes(key)) {
            omitted[key] = object[key];
        }
    });
    return omitted;
}
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils).isAbsoluteUrl(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        var locationOrigin = (0, _utils).getLocationOrigin();
        var resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasBasePath).hasBasePath(resolved.pathname);
    } catch (_) {
        return false;
    }
}
function interpolateAs(route, asPathname, query) {
    var interpolatedRoute = "";
    var dynamicRegex = (0, _routeRegex).getRouteRegex(route);
    var dynamicGroups = dynamicRegex.groups;
    var dynamicMatches = (asPathname !== route ? (0, _routeMatcher).getRouteMatcher(dynamicRegex)(asPathname) : "") || // Fall back to reading the values from the href
    // TODO: should this take priority; also need to change in the router.
    query;
    interpolatedRoute = route;
    var params = Object.keys(dynamicGroups);
    if (!params.every(function(param) {
        var value = dynamicMatches[param] || "";
        var _param = dynamicGroups[param], repeat = _param.repeat, optional = _param.optional;
        // support single-level catch-all
        // TODO: more robust handling for user-error (passing `/`)
        var replaced = "[".concat(repeat ? "..." : "").concat(param, "]");
        if (optional) {
            replaced = "".concat(!value ? "/" : "", "[").concat(replaced, "]");
        }
        if (repeat && !Array.isArray(value)) value = [
            value
        ];
        return (optional || param in dynamicMatches) && // Interpolate group into data URL if present
        (interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map(// path delimiter escaped since they are being inserted
        // into the URL and we expect URL encoded segments
        // when parsing dynamic route params
        function(segment) {
            return encodeURIComponent(segment);
        }).join("/") : encodeURIComponent(value)) || "/");
    })) {
        interpolatedRoute = "" // did not satisfy all requirements
        ;
    // n.b. We ignore this error because we handle warning for this case in
    // development in the `<Link>` component directly.
    }
    return {
        params: params,
        result: interpolatedRoute
    };
}
function resolveHref(router, href, resolveAs) {
    // we use a dummy base url for relative urls
    var base;
    var urlAsString = typeof href === "string" ? href : (0, _formatUrl).formatWithValidation(href);
    // repeated slashes and backslashes in the URL are considered
    // invalid and will never match a Next.js page/file
    var urlProtoMatch = urlAsString.match(/^[a-zA-Z]{1,}:\/\//);
    var urlAsStringNoProto = urlProtoMatch ? urlAsString.slice(urlProtoMatch[0].length) : urlAsString;
    var urlParts = urlAsStringNoProto.split("?");
    if ((urlParts[0] || "").match(/(\/\/|\\)/)) {
        console.error("Invalid href passed to next/router: ".concat(urlAsString, ", repeated forward-slashes (//) or backslashes \\ are not valid in the href"));
        var normalizedUrl = (0, _utils).normalizeRepeatedSlashes(urlAsStringNoProto);
        urlAsString = (urlProtoMatch ? urlProtoMatch[0] : "") + normalizedUrl;
    }
    // Return because it cannot be routed by the Next.js router
    if (!isLocalURL(urlAsString)) {
        return resolveAs ? [
            urlAsString
        ] : urlAsString;
    }
    try {
        base = new URL(urlAsString.startsWith("#") ? router.asPath : router.pathname, "http://n");
    } catch (_) {
        // fallback to / for invalid asPath values e.g. //
        base = new URL("/", "http://n");
    }
    try {
        var finalUrl = new URL(urlAsString, base);
        finalUrl.pathname = (0, _normalizeTrailingSlash).normalizePathTrailingSlash(finalUrl.pathname);
        var interpolatedAs = "";
        if ((0, _isDynamic).isDynamicRoute(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
            var query = (0, _querystring).searchParamsToUrlQuery(finalUrl.searchParams);
            var ref = interpolateAs(finalUrl.pathname, finalUrl.pathname, query), result = ref.result, params = ref.params;
            if (result) {
                interpolatedAs = (0, _formatUrl).formatWithValidation({
                    pathname: result,
                    hash: finalUrl.hash,
                    query: omit(query, params)
                });
            }
        }
        // if the origin didn't change, it means we received a relative href
        var resolvedHref = finalUrl.origin === base.origin ? finalUrl.href.slice(finalUrl.origin.length) : finalUrl.href;
        return resolveAs ? [
            resolvedHref,
            interpolatedAs || resolvedHref
        ] : resolvedHref;
    } catch (_1) {
        return resolveAs ? [
            urlAsString
        ] : urlAsString;
    }
}
function prepareUrlAs(router, url, as) {
    // If url and as provided as an object representation,
    // we'll format them into the string version here.
    var ref = _slicedToArray(resolveHref(router, url, true), 2), resolvedHref = ref[0], resolvedAs = ref[1];
    var origin = (0, _utils).getLocationOrigin();
    var hrefHadOrigin = resolvedHref.startsWith(origin);
    var asHadOrigin = resolvedAs && resolvedAs.startsWith(origin);
    resolvedHref = stripOrigin(resolvedHref);
    resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
    var preparedUrl = hrefHadOrigin ? resolvedHref : (0, _addBasePath).addBasePath(resolvedHref);
    var preparedAs = as ? stripOrigin(resolveHref(router, as)) : resolvedAs || resolvedHref;
    return {
        url: preparedUrl,
        as: asHadOrigin ? preparedAs : (0, _addBasePath).addBasePath(preparedAs)
    };
}
function resolveDynamicRoute(pathname, pages) {
    var cleanPathname = (0, _removeTrailingSlash).removeTrailingSlash((0, _denormalizePagePath).denormalizePagePath(pathname));
    if (cleanPathname === "/404" || cleanPathname === "/_error") {
        return pathname;
    }
    // handle resolving href for dynamic routes
    if (!pages.includes(cleanPathname)) {
        // eslint-disable-next-line array-callback-return
        pages.some(function(page) {
            if ((0, _isDynamic).isDynamicRoute(page) && (0, _routeRegex).getRouteRegex(page).re.test(cleanPathname)) {
                pathname = page;
                return true;
            }
        });
    }
    return (0, _removeTrailingSlash).removeTrailingSlash(pathname);
}
function getMiddlewareData(source, response, options) {
    var nextConfig = {
        basePath: options.router.basePath,
        i18n: {
            locales: options.router.locales
        },
        trailingSlash: Boolean(false)
    };
    var rewriteHeader = response.headers.get("x-nextjs-rewrite");
    var rewriteTarget = rewriteHeader || response.headers.get("x-nextjs-matched-path");
    var matchedPath = response.headers.get("x-matched-path");
    if (matchedPath && !rewriteTarget && !matchedPath.includes("__next_data_catchall") && !matchedPath.includes("/_error") && !matchedPath.includes("/404")) {
        // leverage x-matched-path to detect next.config.js rewrites
        rewriteTarget = matchedPath;
    }
    if (rewriteTarget) {
        if (rewriteTarget.startsWith("/")) {
            var parsedRewriteTarget = (0, _parseRelativeUrl).parseRelativeUrl(rewriteTarget);
            var pathnameInfo = (0, _getNextPathnameInfo).getNextPathnameInfo(parsedRewriteTarget.pathname, {
                nextConfig: nextConfig,
                parseData: true
            });
            var fsPathname = (0, _removeTrailingSlash).removeTrailingSlash(pathnameInfo.pathname);
            return Promise.all([
                options.router.pageLoader.getPageList(),
                (0, _routeLoader).getClientBuildManifest()
            ]).then(function(param) {
                var _param = _slicedToArray(param, 2), pages = _param[0], ref = _param[1], rewrites = ref.__rewrites;
                var as = (0, _addLocale).addLocale(pathnameInfo.pathname, pathnameInfo.locale);
                if ((0, _isDynamic).isDynamicRoute(as) || !rewriteHeader && pages.includes((0, _normalizeLocalePath).normalizeLocalePath((0, _removeBasePath).removeBasePath(as), options.router.locales).pathname)) {
                    var parsedSource = (0, _getNextPathnameInfo).getNextPathnameInfo((0, _parseRelativeUrl).parseRelativeUrl(source).pathname, {
                        parseData: true
                    });
                    as = (0, _addBasePath).addBasePath(parsedSource.pathname);
                    parsedRewriteTarget.pathname = as;
                }
                if (false) { var result; } else if (!pages.includes(fsPathname)) {
                    var resolvedPathname = resolveDynamicRoute(fsPathname, pages);
                    if (resolvedPathname !== fsPathname) {
                        fsPathname = resolvedPathname;
                    }
                }
                var resolvedHref = !pages.includes(fsPathname) ? resolveDynamicRoute((0, _normalizeLocalePath).normalizeLocalePath((0, _removeBasePath).removeBasePath(parsedRewriteTarget.pathname), options.router.locales).pathname, pages) : fsPathname;
                if ((0, _isDynamic).isDynamicRoute(resolvedHref)) {
                    var matches = (0, _routeMatcher).getRouteMatcher((0, _routeRegex).getRouteRegex(resolvedHref))(as);
                    Object.assign(parsedRewriteTarget.query, matches || {});
                }
                return {
                    type: "rewrite",
                    parsedAs: parsedRewriteTarget,
                    resolvedHref: resolvedHref
                };
            });
        }
        var src = (0, _parsePath).parsePath(source);
        var pathname = (0, _formatNextPathnameInfo).formatNextPathnameInfo(_extends({}, (0, _getNextPathnameInfo).getNextPathnameInfo(src.pathname, {
            nextConfig: nextConfig,
            parseData: true
        }), {
            defaultLocale: options.router.defaultLocale,
            buildId: ""
        }));
        return Promise.resolve({
            type: "redirect-external",
            destination: "".concat(pathname).concat(src.query).concat(src.hash)
        });
    }
    var redirectTarget = response.headers.get("x-nextjs-redirect");
    if (redirectTarget) {
        if (redirectTarget.startsWith("/")) {
            var src1 = (0, _parsePath).parsePath(redirectTarget);
            var pathname1 = (0, _formatNextPathnameInfo).formatNextPathnameInfo(_extends({}, (0, _getNextPathnameInfo).getNextPathnameInfo(src1.pathname, {
                nextConfig: nextConfig,
                parseData: true
            }), {
                defaultLocale: options.router.defaultLocale,
                buildId: ""
            }));
            return Promise.resolve({
                type: "redirect-internal",
                newAs: "".concat(pathname1).concat(src1.query).concat(src1.hash),
                newUrl: "".concat(pathname1).concat(src1.query).concat(src1.hash)
            });
        }
        return Promise.resolve({
            type: "redirect-external",
            destination: redirectTarget
        });
    }
    return Promise.resolve({
        type: "next"
    });
}
function withMiddlewareEffects(options) {
    return matchesMiddleware(options).then(function(matches) {
        if (matches && options.fetchData) {
            return options.fetchData().then(function(data) {
                return getMiddlewareData(data.dataHref, data.response, options).then(function(effect) {
                    return {
                        dataHref: data.dataHref,
                        cacheKey: data.cacheKey,
                        json: data.json,
                        response: data.response,
                        text: data.text,
                        effect: effect
                    };
                });
            }).catch(function(_err) {
                /**
           * TODO: Revisit this in the future.
           * For now we will not consider middleware data errors to be fatal.
           * maybe we should revisit in the future.
           */ return null;
            });
        }
        return null;
    });
}
var manualScrollRestoration = (/* unused pure expression or super */ null && ( false && 0));
var SSG_DATA_NOT_FOUND = Symbol("SSG_DATA_NOT_FOUND");
function fetchRetry(url, attempts, options) {
    return fetch(url, {
        // Cookies are required to be present for Next.js' SSG "Preview Mode".
        // Cookies may also be required for `getServerSideProps`.
        //
        // > `fetch` won’t send cookies, unless you set the credentials init
        // > option.
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        //
        // > For maximum browser compatibility when it comes to sending &
        // > receiving cookies, always supply the `credentials: 'same-origin'`
        // > option instead of relying on the default.
        // https://github.com/github/fetch#caveats
        credentials: "same-origin",
        method: options.method || "GET",
        headers: Object.assign({}, options.headers, {
            "x-nextjs-data": "1"
        })
    }).then(function(response) {
        return !response.ok && attempts > 1 && response.status >= 500 ? fetchRetry(url, attempts - 1, options) : response;
    });
}
var backgroundCache = {};
function handleSmoothScroll(fn) {
    var htmlElement = document.documentElement;
    var existing = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = "auto";
    fn();
    htmlElement.style.scrollBehavior = existing;
}
function tryToParseAsJSON(text) {
    try {
        return JSON.parse(text);
    } catch (error) {
        return null;
    }
}
function fetchNextData(param) {
    var dataHref = param.dataHref, inflightCache = param.inflightCache, isPrefetch = param.isPrefetch, hasMiddleware = param.hasMiddleware, isServerRender = param.isServerRender, parseJSON = param.parseJSON, persistCache = param.persistCache, isBackground = param.isBackground, unstable_skipClientCache = param.unstable_skipClientCache;
    var ref = new URL(dataHref, window.location.href), cacheKey = ref.href;
    var ref1;
    var getData = function(params) {
        return fetchRetry(dataHref, isServerRender ? 3 : 1, {
            headers: isPrefetch ? {
                purpose: "prefetch"
            } : {},
            method: (ref1 = params == null ? void 0 : params.method) != null ? ref1 : "GET"
        }).then(function(response) {
            if (response.ok && (params == null ? void 0 : params.method) === "HEAD") {
                return {
                    dataHref: dataHref,
                    response: response,
                    text: "",
                    json: {},
                    cacheKey: cacheKey
                };
            }
            return response.text().then(function(text) {
                if (!response.ok) {
                    /**
             * When the data response is a redirect because of a middleware
             * we do not consider it an error. The headers must bring the
             * mapped location.
             * TODO: Change the status code in the handler.
             */ if (hasMiddleware && [
                        301,
                        302,
                        307,
                        308
                    ].includes(response.status)) {
                        return {
                            dataHref: dataHref,
                            response: response,
                            text: text,
                            json: {},
                            cacheKey: cacheKey
                        };
                    }
                    if (!hasMiddleware && response.status === 404) {
                        var ref;
                        if ((ref = tryToParseAsJSON(text)) == null ? void 0 : ref.notFound) {
                            return {
                                dataHref: dataHref,
                                json: {
                                    notFound: SSG_DATA_NOT_FOUND
                                },
                                response: response,
                                text: text,
                                cacheKey: cacheKey
                            };
                        }
                    }
                    var error = new Error("Failed to load static props");
                    /**
             * We should only trigger a server-side transition if this was
             * caused on a client-side transition. Otherwise, we'd get into
             * an infinite loop.
             */ if (!isServerRender) {
                        (0, _routeLoader).markAssetError(error);
                    }
                    throw error;
                }
                return {
                    dataHref: dataHref,
                    json: parseJSON ? tryToParseAsJSON(text) : null,
                    response: response,
                    text: text,
                    cacheKey: cacheKey
                };
            });
        }).then(function(data) {
            if (!persistCache || "production" !== "production" || data.response.headers.get("x-middleware-cache") === "no-cache") {
                delete inflightCache[cacheKey];
            }
            return data;
        }).catch(function(err) {
            delete inflightCache[cacheKey];
            throw err;
        });
    };
    // when skipping client cache we wait to update
    // inflight cache until successful data response
    // this allows racing click event with fetching newer data
    // without blocking navigation when stale data is available
    if (unstable_skipClientCache && persistCache) {
        return getData({}).then(function(data) {
            inflightCache[cacheKey] = Promise.resolve(data);
            return data;
        });
    }
    if (inflightCache[cacheKey] !== undefined) {
        return inflightCache[cacheKey];
    }
    return inflightCache[cacheKey] = getData(isBackground ? {
        method: "HEAD"
    } : {});
}
function createKey() {
    return Math.random().toString(36).slice(2, 10);
}
function handleHardNavigation(param) {
    var url = param.url, router = param.router;
    // ensure we don't trigger a hard navigation to the same
    // URL as this can end up with an infinite refresh
    if (url === (0, _addBasePath).addBasePath((0, _addLocale).addLocale(router.asPath, router.locale))) {
        throw new Error("Invariant: attempted to hard navigate to the same URL ".concat(url, " ").concat(location.href));
    }
    window.location.href = url;
}
var getCancelledHandler = function(param) {
    var route = param.route, router = param.router;
    var cancelled = false;
    var cancel = router.clc = function() {
        cancelled = true;
    };
    var handleCancelled = function() {
        if (cancelled) {
            var error = new Error('Abort fetching component for route: "'.concat(route, '"'));
            error.cancelled = true;
            throw error;
        }
        if (cancel === router.clc) {
            router.clc = null;
        }
    };
    return handleCancelled;
};
var Router = /*#__PURE__*/ function() {
    function Router(pathname1, query1, as1, param) {
        var initialProps = param.initialProps, pageLoader = param.pageLoader, App = param.App, wrapApp = param.wrapApp, Component = param.Component, err = param.err, subscription = param.subscription, isFallback = param.isFallback, locale = param.locale, locales = param.locales, defaultLocale = param.defaultLocale, domainLocales = param.domainLocales, isPreview = param.isPreview;
        var _this = this;
        _classCallCheck(this, Router);
        // Server Data Cache
        this.sdc = {};
        this.isFirstPopStateEvent = true;
        this._key = createKey();
        this.onPopState = function(e) {
            var isFirstPopStateEvent = _this.isFirstPopStateEvent;
            _this.isFirstPopStateEvent = false;
            var state = e.state;
            if (!state) {
                // We get state as undefined for two reasons.
                //  1. With older safari (< 8) and older chrome (< 34)
                //  2. When the URL changed with #
                //
                // In the both cases, we don't need to proceed and change the route.
                // (as it's already changed)
                // But we can simply replace the state with the new changes.
                // Actually, for (1) we don't need to nothing. But it's hard to detect that event.
                // So, doing the following for (1) does no harm.
                var pathname = _this.pathname, query = _this.query;
                _this.changeState("replaceState", (0, _formatUrl).formatWithValidation({
                    pathname: (0, _addBasePath).addBasePath(pathname),
                    query: query
                }), (0, _utils).getURL());
                return;
            }
            // __NA is used to identify if the history entry can be handled by the app-router.
            if (state.__NA) {
                window.location.reload();
                return;
            }
            if (!state.__N) {
                return;
            }
            // Safari fires popstateevent when reopening the browser.
            if (isFirstPopStateEvent && _this.locale === state.options.locale && state.as === _this.asPath) {
                return;
            }
            var forcedScroll;
            var url = state.url, as = state.as, options = state.options, key = state.key;
            if (false) { var v; }
            _this._key = key;
            var pathname1 = (0, _parseRelativeUrl).parseRelativeUrl(url).pathname;
            // Make sure we don't re-render on initial load,
            // can be caused by navigating back from an external site
            if (_this.isSsr && as === (0, _addBasePath).addBasePath(_this.asPath) && pathname1 === (0, _addBasePath).addBasePath(_this.pathname)) {
                return;
            }
            // If the downstream application returns falsy, return.
            // They will then be responsible for handling the event.
            if (_this._bps && !_this._bps(state)) {
                return;
            }
            _this.change("replaceState", url, as, Object.assign({}, options, {
                shallow: options.shallow && _this._shallow,
                locale: options.locale || _this.defaultLocale,
                // @ts-ignore internal value not exposed on types
                _h: 0
            }), forcedScroll);
        };
        // represents the current component key
        var route = (0, _removeTrailingSlash).removeTrailingSlash(pathname1);
        // set up the component cache (by route keys)
        this.components = {};
        // We should not keep the cache, if there's an error
        // Otherwise, this cause issues when when going back and
        // come again to the errored page.
        if (pathname1 !== "/_error") {
            this.components[route] = {
                Component: Component,
                initial: true,
                props: initialProps,
                err: err,
                __N_SSG: initialProps && initialProps.__N_SSG,
                __N_SSP: initialProps && initialProps.__N_SSP
            };
        }
        this.components["/_app"] = {
            Component: App,
            styleSheets: []
        };
        // Backwards compat for Router.router.events
        // TODO: Should be remove the following major version as it was never documented
        this.events = Router.events;
        this.pageLoader = pageLoader;
        // if auto prerendered and dynamic route wait to update asPath
        // until after mount to prevent hydration mismatch
        var autoExportDynamic = (0, _isDynamic).isDynamicRoute(pathname1) && self.__NEXT_DATA__.autoExport;
        this.basePath =  false || "";
        this.sub = subscription;
        this.clc = null;
        this._wrapApp = wrapApp;
        // make sure to ignore extra popState in safari on navigating
        // back from external site
        this.isSsr = true;
        this.isLocaleDomain = false;
        this.isReady = !!(self.__NEXT_DATA__.gssp || self.__NEXT_DATA__.gip || self.__NEXT_DATA__.appGip && !self.__NEXT_DATA__.gsp || !autoExportDynamic && !self.location.search && !false);
        if (false) {}
        this.state = {
            route: route,
            pathname: pathname1,
            query: query1,
            asPath: autoExportDynamic ? pathname1 : as1,
            isPreview: !!isPreview,
            locale:  false ? 0 : undefined,
            isFallback: isFallback
        };
        this._initialMatchesMiddlewarePromise = Promise.resolve(false);
        if (true) {
            // make sure "as" doesn't start with double slashes or else it can
            // throw an error as it's considered invalid
            if (!as1.startsWith("//")) {
                // in order for `e.state` to work on the `onpopstate` event
                // we have to register the initial route upon initialization
                var options = {
                    locale: locale
                };
                var asPath = (0, _utils).getURL();
                this._initialMatchesMiddlewarePromise = matchesMiddleware({
                    router: this,
                    locale: locale,
                    asPath: asPath
                }).then(function(matches) {
                    options._shouldResolveHref = as1 !== pathname1;
                    _this.changeState("replaceState", matches ? asPath : (0, _formatUrl).formatWithValidation({
                        pathname: (0, _addBasePath).addBasePath(pathname1),
                        query: query1
                    }), asPath, options);
                    return matches;
                });
            }
            window.addEventListener("popstate", this.onPopState);
            // enable custom scroll restoration handling when available
            // otherwise fallback to browser's default handling
            if (false) {}
        }
    }
    _createClass(Router, [
        {
            key: "reload",
            value: function reload() {
                window.location.reload();
            }
        },
        {
            /**
   * Go back in history
   */ key: "back",
            value: function back() {
                window.history.back();
            }
        },
        {
            /**
   * Performs a `pushState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ key: "push",
            value: function push(url, as) {
                var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                if (false) {}
                var ref;
                ref = prepareUrlAs(this, url, as), url = ref.url, as = ref.as, ref;
                return this.change("pushState", url, as, options);
            }
        },
        {
            /**
   * Performs a `replaceState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ key: "replace",
            value: function replace(url, as) {
                var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                var ref;
                ref = prepareUrlAs(this, url, as), url = ref.url, as = ref.as, ref;
                return this.change("replaceState", url, as, options);
            }
        },
        {
            key: "change",
            value: function change(method, url, as, options, forcedScroll) {
                var _this = this;
                return _async_to_generator(function() {
                    var isQueryUpdating, shouldResolveHref, nextState, readyStateChange, isSsr, prevLocale, parsedAs, localePathResult, didNavigate, ref, detectedDomain, asNoBasePath, _shallow, shallow, _scroll, scroll, routeProps, cleanedAs, localeChange, err, parsed, pathname, query, pages, rewrites, ref1, ref2, err1, resolvedAs, isMiddlewareMatch, rewritesResult, route, routeMatch, parsedAs1, asPathname, routeRegex, shouldInterpolate, interpolatedAs, missingParams, ref21, ref3, routeInfo, cleanedParsedPathname, prefixedAs, rewriteAs, localeResult, routeRegex1, curRouteMatch, error, props, __N_SSG, __N_SSP, component, scripts, destination, parsedHref, ref4, newUrl, newAs, notFoundRoute, _, _route, isValidShallowRoute, _scroll1, shouldScroll, resetScroll, upcomingRouterState, upcomingScrollState, canSkipUpdating, hashRegex, err11;
                    return _tsGenerator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!isLocalURL(url)) {
                                    handleHardNavigation({
                                        url: url,
                                        router: _this
                                    });
                                    return [
                                        2,
                                        false
                                    ];
                                }
                                isQueryUpdating = options._h;
                                shouldResolveHref = isQueryUpdating || options._shouldResolveHref || (0, _parsePath).parsePath(url).pathname === (0, _parsePath).parsePath(as).pathname;
                                nextState = _extends({}, _this.state);
                                readyStateChange = _this.isReady !== true;
                                _this.isReady = true;
                                isSsr = _this.isSsr;
                                if (!isQueryUpdating) {
                                    _this.isSsr = false;
                                }
                                // if a route transition is already in progress before
                                // the query updating is triggered ignore query updating
                                if (isQueryUpdating && _this.clc) {
                                    return [
                                        2,
                                        false
                                    ];
                                }
                                prevLocale = nextState.locale;
                                if (false) {}
                                // marking route changes as a navigation start entry
                                if (_utils.ST) {
                                    performance.mark("routeChange");
                                }
                                _shallow = options.shallow, shallow = _shallow === void 0 ? false : _shallow, _scroll = options.scroll, scroll = _scroll === void 0 ? true : _scroll;
                                routeProps = {
                                    shallow: shallow
                                };
                                if (_this._inFlightRoute && _this.clc) {
                                    if (!isSsr) {
                                        Router.events.emit("routeChangeError", buildCancellationError(), _this._inFlightRoute, routeProps);
                                    }
                                    _this.clc();
                                    _this.clc = null;
                                }
                                as = (0, _addBasePath).addBasePath((0, _addLocale).addLocale((0, _hasBasePath).hasBasePath(as) ? (0, _removeBasePath).removeBasePath(as) : as, options.locale, _this.defaultLocale));
                                cleanedAs = (0, _removeLocale).removeLocale((0, _hasBasePath).hasBasePath(as) ? (0, _removeBasePath).removeBasePath(as) : as, nextState.locale);
                                _this._inFlightRoute = as;
                                localeChange = prevLocale !== nextState.locale;
                                if (!(!isQueryUpdating && _this.onlyAHashChange(cleanedAs) && !localeChange)) return [
                                    3,
                                    5
                                ];
                                nextState.asPath = cleanedAs;
                                Router.events.emit("hashChangeStart", as, routeProps);
                                // TODO: do we need the resolved href when only a hash change?
                                _this.changeState(method, url, as, _extends({}, options, {
                                    scroll: false
                                }));
                                if (scroll) {
                                    _this.scrollToHash(cleanedAs);
                                }
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    _this.set(nextState, _this.components[nextState.route], null)
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                err = _state.sent();
                                if ((0, _isError).default(err) && err.cancelled) {
                                    Router.events.emit("routeChangeError", err, cleanedAs, routeProps);
                                }
                                throw err;
                            case 4:
                                Router.events.emit("hashChangeComplete", as, routeProps);
                                return [
                                    2,
                                    true
                                ];
                            case 5:
                                parsed = (0, _parseRelativeUrl).parseRelativeUrl(url);
                                pathname = parsed.pathname, query = parsed.query;
                                _state.label = 6;
                            case 6:
                                _state.trys.push([
                                    6,
                                    8,
                                    ,
                                    9
                                ]);
                                return [
                                    4,
                                    Promise.all([
                                        _this.pageLoader.getPageList(),
                                        (0, _routeLoader).getClientBuildManifest(),
                                        _this.pageLoader.getMiddleware()
                                    ])
                                ];
                            case 7:
                                ref1 = _slicedToArray.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), pages = ref1[0], ref2 = ref1[1], rewrites = ref2.__rewrites, ref2, ref1;
                                return [
                                    3,
                                    9
                                ];
                            case 8:
                                err1 = _state.sent();
                                // If we fail to resolve the page list or client-build manifest, we must
                                // do a server-side transition:
                                handleHardNavigation({
                                    url: as,
                                    router: _this
                                });
                                return [
                                    2,
                                    false
                                ];
                            case 9:
                                // If asked to change the current URL we should reload the current page
                                // (not location.reload() but reload getInitialProps and other Next.js stuffs)
                                // We also need to set the method = replaceState always
                                // as this should not go into the history (That's how browsers work)
                                // We should compare the new asPath to the current asPath, not the url
                                if (!_this.urlIsNew(cleanedAs) && !localeChange) {
                                    method = "replaceState";
                                }
                                resolvedAs = as;
                                // url and as should always be prefixed with basePath by this
                                // point by either next/link or router.push/replace so strip the
                                // basePath from the pathname to match the pages dir 1-to-1
                                pathname = pathname ? (0, _removeTrailingSlash).removeTrailingSlash((0, _removeBasePath).removeBasePath(pathname)) : pathname;
                                return [
                                    4,
                                    matchesMiddleware({
                                        asPath: as,
                                        locale: nextState.locale,
                                        router: _this
                                    })
                                ];
                            case 10:
                                isMiddlewareMatch = _state.sent();
                                if (options.shallow && isMiddlewareMatch) {
                                    pathname = _this.pathname;
                                }
                                if (shouldResolveHref && pathname !== "/_error") {
                                    options._shouldResolveHref = true;
                                    if (false) {} else {
                                        parsed.pathname = resolveDynamicRoute(pathname, pages);
                                        if (parsed.pathname !== pathname) {
                                            pathname = parsed.pathname;
                                            parsed.pathname = (0, _addBasePath).addBasePath(pathname);
                                            if (!isMiddlewareMatch) {
                                                url = (0, _formatUrl).formatWithValidation(parsed);
                                            }
                                        }
                                    }
                                }
                                if (!isLocalURL(as)) {
                                    if (false) {}
                                    handleHardNavigation({
                                        url: as,
                                        router: _this
                                    });
                                    return [
                                        2,
                                        false
                                    ];
                                }
                                resolvedAs = (0, _removeLocale).removeLocale((0, _removeBasePath).removeBasePath(resolvedAs), nextState.locale);
                                route = (0, _removeTrailingSlash).removeTrailingSlash(pathname);
                                routeMatch = false;
                                if ((0, _isDynamic).isDynamicRoute(route)) {
                                    parsedAs1 = (0, _parseRelativeUrl).parseRelativeUrl(resolvedAs);
                                    asPathname = parsedAs1.pathname;
                                    routeRegex = (0, _routeRegex).getRouteRegex(route);
                                    routeMatch = (0, _routeMatcher).getRouteMatcher(routeRegex)(asPathname);
                                    shouldInterpolate = route === asPathname;
                                    interpolatedAs = shouldInterpolate ? interpolateAs(route, asPathname, query) : {};
                                    if (!routeMatch || shouldInterpolate && !interpolatedAs.result) {
                                        missingParams = Object.keys(routeRegex.groups).filter(function(param) {
                                            return !query[param];
                                        });
                                        if (missingParams.length > 0 && !isMiddlewareMatch) {
                                            if (false) {}
                                            throw new Error((shouldInterpolate ? "The provided `href` (".concat(url, ") value is missing query values (").concat(missingParams.join(", "), ") to be interpolated properly. ") : "The provided `as` value (".concat(asPathname, ") is incompatible with the `href` value (").concat(route, "). ")) + "Read more: https://nextjs.org/docs/messages/".concat(shouldInterpolate ? "href-interpolation-failed" : "incompatible-href-as"));
                                        }
                                    } else if (shouldInterpolate) {
                                        as = (0, _formatUrl).formatWithValidation(Object.assign({}, parsedAs1, {
                                            pathname: interpolatedAs.result,
                                            query: omit(query, interpolatedAs.params)
                                        }));
                                    } else {
                                        // Merge params into `query`, overwriting any specified in search
                                        Object.assign(query, routeMatch);
                                    }
                                }
                                if (!isQueryUpdating) {
                                    Router.events.emit("routeChangeStart", as, routeProps);
                                }
                                _state.label = 11;
                            case 11:
                                _state.trys.push([
                                    11,
                                    21,
                                    ,
                                    22
                                ]);
                                return [
                                    4,
                                    _this.getRouteInfo({
                                        route: route,
                                        pathname: pathname,
                                        query: query,
                                        as: as,
                                        resolvedAs: resolvedAs,
                                        routeProps: routeProps,
                                        locale: nextState.locale,
                                        isPreview: nextState.isPreview,
                                        hasMiddleware: isMiddlewareMatch
                                    })
                                ];
                            case 12:
                                routeInfo = _state.sent();
                                if ("route" in routeInfo && isMiddlewareMatch) {
                                    pathname = routeInfo.route || route;
                                    route = pathname;
                                    if (!routeProps.shallow) {
                                        query = Object.assign({}, routeInfo.query || {}, query);
                                    }
                                    cleanedParsedPathname = (0, _hasBasePath).hasBasePath(parsed.pathname) ? (0, _removeBasePath).removeBasePath(parsed.pathname) : parsed.pathname;
                                    if (routeMatch && pathname !== cleanedParsedPathname) {
                                        Object.keys(routeMatch).forEach(function(key) {
                                            if (routeMatch && query[key] === routeMatch[key]) {
                                                delete query[key];
                                            }
                                        });
                                    }
                                    if ((0, _isDynamic).isDynamicRoute(pathname)) {
                                        prefixedAs = !routeProps.shallow && routeInfo.resolvedAs ? routeInfo.resolvedAs : (0, _addBasePath).addBasePath((0, _addLocale).addLocale(new URL(as, location.href).pathname, nextState.locale), true);
                                        rewriteAs = prefixedAs;
                                        if ((0, _hasBasePath).hasBasePath(rewriteAs)) {
                                            rewriteAs = (0, _removeBasePath).removeBasePath(rewriteAs);
                                        }
                                        if (false) {}
                                        routeRegex1 = (0, _routeRegex).getRouteRegex(pathname);
                                        curRouteMatch = (0, _routeMatcher).getRouteMatcher(routeRegex1)(rewriteAs);
                                        if (curRouteMatch) {
                                            Object.assign(query, curRouteMatch);
                                        }
                                    }
                                }
                                // If the routeInfo brings a redirect we simply apply it.
                                if ("type" in routeInfo) {
                                    if (routeInfo.type === "redirect-internal") {
                                        return [
                                            2,
                                            _this.change(method, routeInfo.newUrl, routeInfo.newAs, options)
                                        ];
                                    } else {
                                        handleHardNavigation({
                                            url: routeInfo.destination,
                                            router: _this
                                        });
                                        return [
                                            2,
                                            new Promise(function() {})
                                        ];
                                    }
                                }
                                error = routeInfo.error, props = routeInfo.props, __N_SSG = routeInfo.__N_SSG, __N_SSP = routeInfo.__N_SSP;
                                component = routeInfo.Component;
                                if (component && component.unstable_scriptLoader) {
                                    scripts = [].concat(component.unstable_scriptLoader());
                                    scripts.forEach(function(script) {
                                        (0, _script).handleClientScriptLoad(script.props);
                                    });
                                }
                                if (!((__N_SSG || __N_SSP) && props)) return [
                                    3,
                                    18
                                ];
                                if (props.pageProps && props.pageProps.__N_REDIRECT) {
                                    // Use the destination from redirect without adding locale
                                    options.locale = false;
                                    destination = props.pageProps.__N_REDIRECT;
                                    // check if destination is internal (resolves to a page) and attempt
                                    // client-navigation if it is falling back to hard navigation if
                                    // it's not
                                    if (destination.startsWith("/") && props.pageProps.__N_REDIRECT_BASE_PATH !== false) {
                                        parsedHref = (0, _parseRelativeUrl).parseRelativeUrl(destination);
                                        parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);
                                        ref4 = prepareUrlAs(_this, destination, destination), newUrl = ref4.url, newAs = ref4.as;
                                        return [
                                            2,
                                            _this.change(method, newUrl, newAs, options)
                                        ];
                                    }
                                    handleHardNavigation({
                                        url: destination,
                                        router: _this
                                    });
                                    return [
                                        2,
                                        new Promise(function() {})
                                    ];
                                }
                                nextState.isPreview = !!props.__N_PREVIEW;
                                if (!(props.notFound === SSG_DATA_NOT_FOUND)) return [
                                    3,
                                    18
                                ];
                                _state.label = 13;
                            case 13:
                                _state.trys.push([
                                    13,
                                    15,
                                    ,
                                    16
                                ]);
                                return [
                                    4,
                                    _this.fetchComponent("/404")
                                ];
                            case 14:
                                _state.sent();
                                notFoundRoute = "/404";
                                return [
                                    3,
                                    16
                                ];
                            case 15:
                                _ = _state.sent();
                                notFoundRoute = "/_error";
                                return [
                                    3,
                                    16
                                ];
                            case 16:
                                return [
                                    4,
                                    _this.getRouteInfo({
                                        route: notFoundRoute,
                                        pathname: notFoundRoute,
                                        query: query,
                                        as: as,
                                        resolvedAs: resolvedAs,
                                        routeProps: {
                                            shallow: false
                                        },
                                        locale: nextState.locale,
                                        isPreview: nextState.isPreview
                                    })
                                ];
                            case 17:
                                routeInfo = _state.sent();
                                if ("type" in routeInfo) {
                                    throw new Error("Unexpected middleware effect on /404");
                                }
                                _state.label = 18;
                            case 18:
                                Router.events.emit("beforeHistoryChange", as, routeProps);
                                _this.changeState(method, url, as, options);
                                if (isQueryUpdating && pathname === "/_error" && ((ref21 = self.__NEXT_DATA__.props) == null ? void 0 : (ref3 = ref21.pageProps) == null ? void 0 : ref3.statusCode) === 500 && (props == null ? void 0 : props.pageProps)) {
                                    // ensure statusCode is still correct for static 500 page
                                    // when updating query information
                                    props.pageProps.statusCode = 500;
                                }
                                isValidShallowRoute = options.shallow && nextState.route === ((_route = routeInfo.route) != null ? _route : route);
                                shouldScroll = (_scroll1 = options.scroll) != null ? _scroll1 : !options._h && !isValidShallowRoute;
                                resetScroll = shouldScroll ? {
                                    x: 0,
                                    y: 0
                                } : null;
                                upcomingRouterState = _extends({}, nextState, {
                                    route: route,
                                    pathname: pathname,
                                    query: query,
                                    asPath: cleanedAs,
                                    isFallback: false
                                });
                                upcomingScrollState = forcedScroll != null ? forcedScroll : resetScroll;
                                canSkipUpdating = options._h && !upcomingScrollState && !readyStateChange && !localeChange && (0, _compareStates).compareRouterStates(upcomingRouterState, _this.state);
                                if (!!canSkipUpdating) return [
                                    3,
                                    20
                                ];
                                return [
                                    4,
                                    _this.set(upcomingRouterState, routeInfo, upcomingScrollState).catch(function(e) {
                                        if (e.cancelled) error = error || e;
                                        else throw e;
                                    })
                                ];
                            case 19:
                                _state.sent();
                                if (error) {
                                    if (!isQueryUpdating) {
                                        Router.events.emit("routeChangeError", error, cleanedAs, routeProps);
                                    }
                                    throw error;
                                }
                                if (false) {}
                                if (!isQueryUpdating) {
                                    Router.events.emit("routeChangeComplete", as, routeProps);
                                }
                                hashRegex = /#.+$/;
                                if (shouldScroll && hashRegex.test(as)) {
                                    _this.scrollToHash(as);
                                }
                                _state.label = 20;
                            case 20:
                                return [
                                    2,
                                    true
                                ];
                            case 21:
                                err11 = _state.sent();
                                if ((0, _isError).default(err11) && err11.cancelled) {
                                    return [
                                        2,
                                        false
                                    ];
                                }
                                throw err11;
                            case 22:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "changeState",
            value: function changeState(method, url, as) {
                var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
                if (false) {}
                if (method !== "pushState" || (0, _utils).getURL() !== as) {
                    this._shallow = options.shallow;
                    window.history[method]({
                        url: url,
                        as: as,
                        options: options,
                        __N: true,
                        key: this._key = method !== "pushState" ? this._key : createKey()
                    }, // Passing the empty string here should be safe against future changes to the method.
                    // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
                    "", as);
                }
            }
        },
        {
            key: "handleRouteInfoError",
            value: function handleRouteInfoError(err, pathname, query, as, routeProps, loadErrorFail) {
                var _this = this;
                return _async_to_generator(function() {
                    var props, ref, Component, styleSheets, routeInfo, gipErr, routeInfoErr;
                    return _tsGenerator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                console.error(err);
                                if (err.cancelled) {
                                    // bubble up cancellation errors
                                    throw err;
                                }
                                if ((0, _routeLoader).isAssetError(err) || loadErrorFail) {
                                    Router.events.emit("routeChangeError", err, as, routeProps);
                                    // If we can't load the page it could be one of following reasons
                                    //  1. Page doesn't exists
                                    //  2. Page does exist in a different zone
                                    //  3. Internal error while loading the page
                                    // So, doing a hard reload is the proper way to deal with this.
                                    handleHardNavigation({
                                        url: as,
                                        router: _this
                                    });
                                    // Changing the URL doesn't block executing the current code path.
                                    // So let's throw a cancellation error stop the routing logic.
                                    throw buildCancellationError();
                                }
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    7,
                                    ,
                                    8
                                ]);
                                return [
                                    4,
                                    _this.fetchComponent("/_error")
                                ];
                            case 2:
                                ref = _state.sent(), Component = ref.page, styleSheets = ref.styleSheets;
                                routeInfo = {
                                    props: props,
                                    Component: Component,
                                    styleSheets: styleSheets,
                                    err: err,
                                    error: err
                                };
                                if (!!routeInfo.props) return [
                                    3,
                                    6
                                ];
                                _state.label = 3;
                            case 3:
                                _state.trys.push([
                                    3,
                                    5,
                                    ,
                                    6
                                ]);
                                return [
                                    4,
                                    _this.getInitialProps(Component, {
                                        err: err,
                                        pathname: pathname,
                                        query: query
                                    })
                                ];
                            case 4:
                                routeInfo.props = _state.sent();
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                gipErr = _state.sent();
                                console.error("Error in error page `getInitialProps`: ", gipErr);
                                routeInfo.props = {};
                                return [
                                    3,
                                    6
                                ];
                            case 6:
                                return [
                                    2,
                                    routeInfo
                                ];
                            case 7:
                                routeInfoErr = _state.sent();
                                return [
                                    2,
                                    _this.handleRouteInfoError((0, _isError).default(routeInfoErr) ? routeInfoErr : new Error(routeInfoErr + ""), pathname, query, as, routeProps, true)
                                ];
                            case 8:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getRouteInfo",
            value: function getRouteInfo(param) {
                var requestedRoute = param.route, pathname = param.pathname, query = param.query, as = param.as, resolvedAs = param.resolvedAs, routeProps = param.routeProps, locale = param.locale, hasMiddleware = param.hasMiddleware, isPreview = param.isPreview, unstable_skipClientCache = param.unstable_skipClientCache;
                var _this = this;
                return _async_to_generator(function() {
                    var route, ref, ref4, ref5, handleCancelled, existingInfo, cachedRouteInfo, fetchNextDataParams, data, routeInfo, _tmp, isValidElementType, shouldFetchData, ref1, props, cacheKey, err;
                    return _tsGenerator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                route = requestedRoute;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    6,
                                    ,
                                    7
                                ]);
                                handleCancelled = getCancelledHandler({
                                    route: route,
                                    router: _this
                                });
                                existingInfo = _this.components[route];
                                if (routeProps.shallow && existingInfo && _this.route === route) {
                                    return [
                                        2,
                                        existingInfo
                                    ];
                                }
                                if (hasMiddleware) {
                                    existingInfo = undefined;
                                }
                                cachedRouteInfo = existingInfo && !("initial" in existingInfo) && "production" !== "development" ? existingInfo : undefined;
                                fetchNextDataParams = {
                                    dataHref: _this.pageLoader.getDataHref({
                                        href: (0, _formatUrl).formatWithValidation({
                                            pathname: pathname,
                                            query: query
                                        }),
                                        skipInterpolation: true,
                                        asPath: resolvedAs,
                                        locale: locale
                                    }),
                                    hasMiddleware: true,
                                    isServerRender: _this.isSsr,
                                    parseJSON: true,
                                    inflightCache: _this.sdc,
                                    persistCache: !isPreview,
                                    isPrefetch: false,
                                    unstable_skipClientCache: unstable_skipClientCache
                                };
                                return [
                                    4,
                                    withMiddlewareEffects({
                                        fetchData: function() {
                                            return fetchNextData(fetchNextDataParams);
                                        },
                                        asPath: resolvedAs,
                                        locale: locale,
                                        router: _this
                                    })
                                ];
                            case 2:
                                data = _state.sent();
                                handleCancelled();
                                if ((data == null ? void 0 : (ref = data.effect) == null ? void 0 : ref.type) === "redirect-internal" || (data == null ? void 0 : (ref4 = data.effect) == null ? void 0 : ref4.type) === "redirect-external") {
                                    return [
                                        2,
                                        data.effect
                                    ];
                                }
                                if ((data == null ? void 0 : (ref5 = data.effect) == null ? void 0 : ref5.type) === "rewrite") {
                                    route = (0, _removeTrailingSlash).removeTrailingSlash(data.effect.resolvedHref);
                                    pathname = data.effect.resolvedHref;
                                    query = _extends({}, query, data.effect.parsedAs.query);
                                    resolvedAs = (0, _removeBasePath).removeBasePath((0, _normalizeLocalePath).normalizeLocalePath(data.effect.parsedAs.pathname, _this.locales).pathname);
                                    // Check again the cache with the new destination.
                                    existingInfo = _this.components[route];
                                    if (routeProps.shallow && existingInfo && _this.route === route && !hasMiddleware) {
                                        // If we have a match with the current route due to rewrite,
                                        // we can copy the existing information to the rewritten one.
                                        // Then, we return the information along with the matched route.
                                        return [
                                            2,
                                            _extends({}, existingInfo, {
                                                route: route
                                            })
                                        ];
                                    }
                                }
                                if (route === "/api" || route.startsWith("/api/")) {
                                    handleHardNavigation({
                                        url: as,
                                        router: _this
                                    });
                                    return [
                                        2,
                                        new Promise(function() {})
                                    ];
                                }
                                _tmp = cachedRouteInfo;
                                if (_tmp) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    _this.fetchComponent(route).then(function(res) {
                                        return {
                                            Component: res.page,
                                            styleSheets: res.styleSheets,
                                            __N_SSG: res.mod.__N_SSG,
                                            __N_SSP: res.mod.__N_SSP
                                        };
                                    })
                                ];
                            case 3:
                                _tmp = _state.sent();
                                _state.label = 4;
                            case 4:
                                routeInfo = _tmp;
                                if (false) {}
                                shouldFetchData = routeInfo.__N_SSG || routeInfo.__N_SSP;
                                return [
                                    4,
                                    _this._getData(_async_to_generator(function() {
                                        var ref, json, _cacheKey, _tmp, _tmp1;
                                        return _tsGenerator(this, function(_state) {
                                            switch(_state.label){
                                                case 0:
                                                    if (!shouldFetchData) return [
                                                        3,
                                                        4
                                                    ];
                                                    if (!(data == null ? void 0 : data.json)) return [
                                                        3,
                                                        1
                                                    ];
                                                    _tmp = data;
                                                    return [
                                                        3,
                                                        3
                                                    ];
                                                case 1:
                                                    return [
                                                        4,
                                                        fetchNextData({
                                                            dataHref: _this.pageLoader.getDataHref({
                                                                href: (0, _formatUrl).formatWithValidation({
                                                                    pathname: pathname,
                                                                    query: query
                                                                }),
                                                                asPath: resolvedAs,
                                                                locale: locale
                                                            }),
                                                            isServerRender: _this.isSsr,
                                                            parseJSON: true,
                                                            inflightCache: _this.sdc,
                                                            persistCache: !isPreview,
                                                            isPrefetch: false,
                                                            unstable_skipClientCache: unstable_skipClientCache
                                                        })
                                                    ];
                                                case 2:
                                                    _tmp = _state.sent();
                                                    _state.label = 3;
                                                case 3:
                                                    ref = _tmp, json = ref.json, _cacheKey = ref.cacheKey;
                                                    return [
                                                        2,
                                                        {
                                                            cacheKey: _cacheKey,
                                                            props: json || {}
                                                        }
                                                    ];
                                                case 4:
                                                    _tmp1 = {
                                                        headers: {},
                                                        cacheKey: ""
                                                    };
                                                    return [
                                                        4,
                                                        _this.getInitialProps(routeInfo.Component, {
                                                            pathname: pathname,
                                                            query: query,
                                                            asPath: as,
                                                            locale: locale,
                                                            locales: _this.locales,
                                                            defaultLocale: _this.defaultLocale
                                                        })
                                                    ];
                                                case 5:
                                                    return [
                                                        2,
                                                        (_tmp1.props = _state.sent(), _tmp1)
                                                    ];
                                            }
                                        });
                                    }))
                                ];
                            case 5:
                                ref1 = _state.sent(), props = ref1.props, cacheKey = ref1.cacheKey;
                                // Only bust the data cache for SSP routes although
                                // middleware can skip cache per request with
                                // x-middleware-cache: no-cache as well
                                if (routeInfo.__N_SSP && fetchNextDataParams.dataHref) {
                                    delete _this.sdc[cacheKey];
                                }
                                // we kick off a HEAD request in the background
                                // when a non-prefetch request is made to signal revalidation
                                if (!_this.isPreview && routeInfo.__N_SSG && "production" !== "development") {
                                    fetchNextData(Object.assign({}, fetchNextDataParams, {
                                        isBackground: true,
                                        persistCache: false,
                                        inflightCache: backgroundCache
                                    })).catch(function() {});
                                }
                                props.pageProps = Object.assign({}, props.pageProps);
                                routeInfo.props = props;
                                routeInfo.route = route;
                                routeInfo.query = query;
                                routeInfo.resolvedAs = resolvedAs;
                                _this.components[route] = routeInfo;
                                return [
                                    2,
                                    routeInfo
                                ];
                            case 6:
                                err = _state.sent();
                                return [
                                    2,
                                    _this.handleRouteInfoError((0, _isError).getProperError(err), pathname, query, as, routeProps)
                                ];
                            case 7:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "set",
            value: function set(state, data, resetScroll) {
                this.state = state;
                return this.sub(data, this.components["/_app"].Component, resetScroll);
            }
        },
        {
            /**
   * Callback to execute before replacing router state
   * @param cb callback to be executed
   */ key: "beforePopState",
            value: function beforePopState(cb) {
                this._bps = cb;
            }
        },
        {
            key: "onlyAHashChange",
            value: function onlyAHashChange(as) {
                if (!this.asPath) return false;
                var ref = _slicedToArray(this.asPath.split("#"), 2), oldUrlNoHash = ref[0], oldHash = ref[1];
                var ref1 = _slicedToArray(as.split("#"), 2), newUrlNoHash = ref1[0], newHash = ref1[1];
                // Makes sure we scroll to the provided hash if the url/hash are the same
                if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
                    return true;
                }
                // If the urls are change, there's more than a hash change
                if (oldUrlNoHash !== newUrlNoHash) {
                    return false;
                }
                // If the hash has changed, then it's a hash only change.
                // This check is necessary to handle both the enter and
                // leave hash === '' cases. The identity case falls through
                // and is treated as a next reload.
                return oldHash !== newHash;
            }
        },
        {
            key: "scrollToHash",
            value: function scrollToHash(as) {
                var ref = _slicedToArray(as.split("#"), 2), tmp = ref[1], hash = tmp === void 0 ? "" : tmp;
                // Scroll to top if the hash is just `#` with no value or `#top`
                // To mirror browsers
                if (hash === "" || hash === "top") {
                    handleSmoothScroll(function() {
                        return window.scrollTo(0, 0);
                    });
                    return;
                }
                // Decode hash to make non-latin anchor works.
                var rawHash = decodeURIComponent(hash);
                // First we check if the element by id is found
                var idEl = document.getElementById(rawHash);
                if (idEl) {
                    handleSmoothScroll(function() {
                        return idEl.scrollIntoView();
                    });
                    return;
                }
                // If there's no element with the id, we check the `name` property
                // To mirror browsers
                var nameEl = document.getElementsByName(rawHash)[0];
                if (nameEl) {
                    handleSmoothScroll(function() {
                        return nameEl.scrollIntoView();
                    });
                }
            }
        },
        {
            key: "urlIsNew",
            value: function urlIsNew(asPath) {
                return this.asPath !== asPath;
            }
        },
        {
            /**
   * Prefetch page code, you may wait for the data during page rendering.
   * This feature only works in production!
   * @param url the href of prefetched page
   * @param asPath the as path of the prefetched page
   */ key: "prefetch",
            value: function prefetch(url) {
                var asPath = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : url, options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                var _this = this;
                return _async_to_generator(function() {
                    var parsed, pathname, query, parsedAs, localePathResult, pages, resolvedAs, locale, rewrites, ref, rewritesResult, route;
                    return _tsGenerator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if ( true && (0, _isBot).isBot(window.navigator.userAgent)) {
                                    // No prefetches for bots that render the link since they are typically navigating
                                    // links via the equivalent of a hard navigation and hence never utilize these
                                    // prefetches.
                                    return [
                                        2
                                    ];
                                }
                                parsed = (0, _parseRelativeUrl).parseRelativeUrl(url);
                                pathname = parsed.pathname, query = parsed.query;
                                if (false) {}
                                return [
                                    4,
                                    _this.pageLoader.getPageList()
                                ];
                            case 1:
                                pages = _state.sent();
                                resolvedAs = asPath;
                                locale = typeof options.locale !== "undefined" ? options.locale || undefined : _this.locale;
                                if (true) return [
                                    3,
                                    3
                                ];
                                return [
                                    4,
                                    (0, _routeLoader).getClientBuildManifest()
                                ];
                            case 2:
                                ref = _state.sent(), rewrites = ref.__rewrites, ref;
                                rewritesResult = (0, _resolveRewrites).default((0, _addBasePath).addBasePath((0, _addLocale).addLocale(asPath, _this.locale), true), pages, rewrites, parsed.query, function(p) {
                                    return resolveDynamicRoute(p, pages);
                                }, _this.locales);
                                if (rewritesResult.externalDest) {
                                    return [
                                        2
                                    ];
                                }
                                resolvedAs = (0, _removeLocale).removeLocale((0, _removeBasePath).removeBasePath(rewritesResult.asPath), _this.locale);
                                if (rewritesResult.matchedPage && rewritesResult.resolvedHref) {
                                    // if this directly matches a page we need to update the href to
                                    // allow the correct page chunk to be loaded
                                    pathname = rewritesResult.resolvedHref;
                                    parsed.pathname = pathname;
                                    url = (0, _formatUrl).formatWithValidation(parsed);
                                }
                                _state.label = 3;
                            case 3:
                                parsed.pathname = resolveDynamicRoute(parsed.pathname, pages);
                                if ((0, _isDynamic).isDynamicRoute(parsed.pathname)) {
                                    pathname = parsed.pathname;
                                    parsed.pathname = pathname;
                                    Object.assign(query, (0, _routeMatcher).getRouteMatcher((0, _routeRegex).getRouteRegex(parsed.pathname))((0, _parsePath).parsePath(asPath).pathname) || {});
                                    url = (0, _formatUrl).formatWithValidation(parsed);
                                }
                                // Prefetch is not supported in development mode because it would trigger on-demand-entries
                                if (false) {}
                                route = (0, _removeTrailingSlash).removeTrailingSlash(pathname);
                                return [
                                    4,
                                    Promise.all([
                                        _this.pageLoader._isSsg(route).then(function(isSsg) {
                                            return isSsg ? fetchNextData({
                                                dataHref: _this.pageLoader.getDataHref({
                                                    href: url,
                                                    asPath: resolvedAs,
                                                    locale: locale
                                                }),
                                                isServerRender: false,
                                                parseJSON: true,
                                                inflightCache: _this.sdc,
                                                persistCache: !_this.isPreview,
                                                isPrefetch: true,
                                                unstable_skipClientCache: options.unstable_skipClientCache || options.priority && !!true
                                            }).then(function() {
                                                return false;
                                            }) : false;
                                        }),
                                        _this.pageLoader[options.priority ? "loadPage" : "prefetch"](route)
                                    ])
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "fetchComponent",
            value: function fetchComponent(route) {
                var _this = this;
                return _async_to_generator(function() {
                    var handleCancelled, componentResult, err;
                    return _tsGenerator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                handleCancelled = getCancelledHandler({
                                    route: route,
                                    router: _this
                                });
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    _this.pageLoader.loadPage(route)
                                ];
                            case 2:
                                componentResult = _state.sent();
                                handleCancelled();
                                return [
                                    2,
                                    componentResult
                                ];
                            case 3:
                                err = _state.sent();
                                handleCancelled();
                                throw err;
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "_getData",
            value: function _getData(fn) {
                var _this = this;
                var cancelled = false;
                var cancel = function() {
                    cancelled = true;
                };
                this.clc = cancel;
                return fn().then(function(data) {
                    if (cancel === _this.clc) {
                        _this.clc = null;
                    }
                    if (cancelled) {
                        var err = new Error("Loading initial props cancelled");
                        err.cancelled = true;
                        throw err;
                    }
                    return data;
                });
            }
        },
        {
            key: "_getFlightData",
            value: function _getFlightData(dataHref) {
                // Do not cache RSC flight response since it's not a static resource
                return fetchNextData({
                    dataHref: dataHref,
                    isServerRender: true,
                    parseJSON: false,
                    inflightCache: this.sdc,
                    persistCache: false,
                    isPrefetch: false
                }).then(function(param) {
                    var text = param.text;
                    return {
                        data: text
                    };
                });
            }
        },
        {
            key: "getInitialProps",
            value: function getInitialProps(Component, ctx) {
                var ref = this.components["/_app"], App = ref.Component;
                var AppTree = this._wrapApp(App);
                ctx.AppTree = AppTree;
                return (0, _utils).loadGetInitialProps(App, {
                    AppTree: AppTree,
                    Component: Component,
                    router: this,
                    ctx: ctx
                });
            }
        },
        {
            key: "route",
            get: function get() {
                return this.state.route;
            }
        },
        {
            key: "pathname",
            get: function get() {
                return this.state.pathname;
            }
        },
        {
            key: "query",
            get: function get() {
                return this.state.query;
            }
        },
        {
            key: "asPath",
            get: function get() {
                return this.state.asPath;
            }
        },
        {
            key: "locale",
            get: function get() {
                return this.state.locale;
            }
        },
        {
            key: "isFallback",
            get: function get() {
                return this.state.isFallback;
            }
        },
        {
            key: "isPreview",
            get: function get() {
                return this.state.isPreview;
            }
        }
    ]);
    return Router;
}();
Router.events = (0, _mitt).default();
exports["default"] = Router; //# sourceMappingURL=router.js.map


/***/ }),

/***/ 7459:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addLocale = addLocale;
var _addPathPrefix = __webpack_require__(5391);
var _pathHasPrefix = __webpack_require__(1259);
function addLocale(path, locale, defaultLocale, ignorePrefix) {
    if (locale && locale !== defaultLocale && (ignorePrefix || !(0, _pathHasPrefix).pathHasPrefix(path.toLowerCase(), "/".concat(locale.toLowerCase())) && !(0, _pathHasPrefix).pathHasPrefix(path.toLowerCase(), "/api"))) {
        return (0, _addPathPrefix).addPathPrefix(path, "/".concat(locale));
    }
    return path;
} //# sourceMappingURL=add-locale.js.map


/***/ }),

/***/ 5391:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addPathPrefix = addPathPrefix;
var _parsePath = __webpack_require__(4943);
function addPathPrefix(path, prefix) {
    if (!path.startsWith("/") || !prefix) {
        return path;
    }
    var ref = (0, _parsePath).parsePath(path), pathname = ref.pathname, query = ref.query, hash = ref.hash;
    return "".concat(prefix).concat(pathname).concat(query).concat(hash);
} //# sourceMappingURL=add-path-prefix.js.map


/***/ }),

/***/ 4156:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addPathSuffix = addPathSuffix;
var _parsePath = __webpack_require__(4943);
function addPathSuffix(path, suffix) {
    if (!path.startsWith("/") || !suffix) {
        return path;
    }
    var ref = (0, _parsePath).parsePath(path), pathname = ref.pathname, query = ref.query, hash = ref.hash;
    return "".concat(pathname).concat(suffix).concat(query).concat(hash);
} //# sourceMappingURL=add-path-suffix.js.map


/***/ }),

/***/ 610:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.compareRouterStates = compareRouterStates;
function compareRouterStates(a, b) {
    var stateKeys = Object.keys(a);
    if (stateKeys.length !== Object.keys(b).length) return false;
    for(var i = stateKeys.length; i--;){
        var key = stateKeys[i];
        if (key === "query") {
            var queryKeys = Object.keys(a.query);
            if (queryKeys.length !== Object.keys(b.query).length) {
                return false;
            }
            for(var j = queryKeys.length; j--;){
                var queryKey = queryKeys[j];
                if (!b.query.hasOwnProperty(queryKey) || a.query[queryKey] !== b.query[queryKey]) {
                    return false;
                }
            }
        } else if (!b.hasOwnProperty(key) || a[key] !== b[key]) {
            return false;
        }
    }
    return true;
} //# sourceMappingURL=compare-states.js.map


/***/ }),

/***/ 4022:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.formatNextPathnameInfo = formatNextPathnameInfo;
var _removeTrailingSlash = __webpack_require__(6316);
var _addPathPrefix = __webpack_require__(5391);
var _addPathSuffix = __webpack_require__(4156);
var _addLocale = __webpack_require__(7459);
function formatNextPathnameInfo(info) {
    var pathname = (0, _addLocale).addLocale(info.pathname, info.locale, info.buildId ? undefined : info.defaultLocale, info.ignorePrefix);
    if (info.buildId) {
        pathname = (0, _addPathSuffix).addPathSuffix((0, _addPathPrefix).addPathPrefix(pathname, "/_next/data/".concat(info.buildId)), info.pathname === "/" ? "index.json" : ".json");
    }
    pathname = (0, _addPathPrefix).addPathPrefix(pathname, info.basePath);
    return info.trailingSlash ? !info.buildId && !pathname.endsWith("/") ? (0, _addPathSuffix).addPathSuffix(pathname, "/") : pathname : (0, _removeTrailingSlash).removeTrailingSlash(pathname);
} //# sourceMappingURL=format-next-pathname-info.js.map


/***/ }),

/***/ 4611:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.formatUrl = formatUrl;
exports.formatWithValidation = formatWithValidation;
exports.urlObjectKeys = void 0;
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
var querystring = _interop_require_wildcard(__webpack_require__(466));
var slashedProtocols = /https?|ftp|gopher|file/;
function formatUrl(urlObj) {
    var auth = urlObj.auth, hostname = urlObj.hostname;
    var protocol = urlObj.protocol || "";
    var pathname = urlObj.pathname || "";
    var hash = urlObj.hash || "";
    var query = urlObj.query || "";
    var host = false;
    auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ":") + "@" : "";
    if (urlObj.host) {
        host = auth + urlObj.host;
    } else if (hostname) {
        host = auth + (~hostname.indexOf(":") ? "[".concat(hostname, "]") : hostname);
        if (urlObj.port) {
            host += ":" + urlObj.port;
        }
    }
    if (query && typeof query === "object") {
        query = String(querystring.urlQueryToSearchParams(query));
    }
    var search = urlObj.search || query && "?".concat(query) || "";
    if (protocol && !protocol.endsWith(":")) protocol += ":";
    if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
        host = "//" + (host || "");
        if (pathname && pathname[0] !== "/") pathname = "/" + pathname;
    } else if (!host) {
        host = "";
    }
    if (hash && hash[0] !== "#") hash = "#" + hash;
    if (search && search[0] !== "?") search = "?" + search;
    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace("#", "%23");
    return "".concat(protocol).concat(host).concat(pathname).concat(search).concat(hash);
}
var urlObjectKeys = [
    "auth",
    "hash",
    "host",
    "hostname",
    "href",
    "path",
    "pathname",
    "port",
    "protocol",
    "query",
    "search",
    "slashes"
];
exports.urlObjectKeys = urlObjectKeys;
function formatWithValidation(url) {
    if (false) {}
    return formatUrl(url);
} //# sourceMappingURL=format-url.js.map


/***/ }),

/***/ 3891:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = getAssetPathFromRoute;
function getAssetPathFromRoute(route) {
    var ext = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    var path = route === "/" ? "/index" : /^\/index(\/|$)/.test(route) ? "/index".concat(route) : "".concat(route);
    return path + ext;
} //# sourceMappingURL=get-asset-path-from-route.js.map


/***/ }),

/***/ 159:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getNextPathnameInfo = getNextPathnameInfo;
var _normalizeLocalePath = __webpack_require__(4317);
var _removePathPrefix = __webpack_require__(9244);
var _pathHasPrefix = __webpack_require__(1259);
function getNextPathnameInfo(pathname, options) {
    var _nextConfig;
    var ref = (_nextConfig = options.nextConfig) != null ? _nextConfig : {}, basePath = ref.basePath, i18n = ref.i18n, trailingSlash = ref.trailingSlash;
    var info = {
        pathname: pathname,
        trailingSlash: pathname !== "/" ? pathname.endsWith("/") : trailingSlash
    };
    if (basePath && (0, _pathHasPrefix).pathHasPrefix(info.pathname, basePath)) {
        info.pathname = (0, _removePathPrefix).removePathPrefix(info.pathname, basePath);
        info.basePath = basePath;
    }
    if (options.parseData === true && info.pathname.startsWith("/_next/data/") && info.pathname.endsWith(".json")) {
        var paths = info.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
        var buildId = paths[0];
        info.pathname = paths[1] !== "index" ? "/".concat(paths.slice(1).join("/")) : "/";
        info.buildId = buildId;
    }
    if (i18n) {
        var pathLocale = (0, _normalizeLocalePath).normalizeLocalePath(info.pathname, i18n.locales);
        info.locale = pathLocale == null ? void 0 : pathLocale.detectedLocale;
        info.pathname = (pathLocale == null ? void 0 : pathLocale.pathname) || info.pathname;
    }
    return info;
} //# sourceMappingURL=get-next-pathname-info.js.map


/***/ }),

/***/ 418:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getSortedRoutes", ({
    enumerable: true,
    get: function get() {
        return _sortedRoutes.getSortedRoutes;
    }
}));
Object.defineProperty(exports, "isDynamicRoute", ({
    enumerable: true,
    get: function get() {
        return _isDynamic.isDynamicRoute;
    }
}));
var _sortedRoutes = __webpack_require__(3907);
var _isDynamic = __webpack_require__(8689); //# sourceMappingURL=index.js.map


/***/ }),

/***/ 9671:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.isBot = isBot;
function isBot(userAgent) {
    return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(userAgent);
} //# sourceMappingURL=is-bot.js.map


/***/ }),

/***/ 8689:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.isDynamicRoute = isDynamicRoute;
// Identify /[param]/ in route string
var TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;
function isDynamicRoute(route) {
    return TEST_ROUTE.test(route);
} //# sourceMappingURL=is-dynamic.js.map


/***/ }),

/***/ 4943:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.parsePath = parsePath;
function parsePath(path) {
    var hashIndex = path.indexOf("#");
    var queryIndex = path.indexOf("?");
    var hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
    if (hasQuery || hashIndex > -1) {
        return {
            pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
            query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined) : "",
            hash: hashIndex > -1 ? path.slice(hashIndex) : ""
        };
    }
    return {
        pathname: path,
        query: "",
        hash: ""
    };
} //# sourceMappingURL=parse-path.js.map


/***/ }),

/***/ 6305:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.parseRelativeUrl = parseRelativeUrl;
var _utils = __webpack_require__(3794);
var _querystring = __webpack_require__(466);
function parseRelativeUrl(url, base) {
    var globalBase = new URL( false ? 0 : (0, _utils).getLocationOrigin());
    var resolvedBase = base ? new URL(base, globalBase) : url.startsWith(".") ? new URL( false ? 0 : window.location.href) : globalBase;
    var ref = new URL(url, resolvedBase), pathname = ref.pathname, searchParams = ref.searchParams, search = ref.search, hash = ref.hash, href = ref.href, origin = ref.origin;
    if (origin !== globalBase.origin) {
        throw new Error("invariant: invalid relative URL, router received ".concat(url));
    }
    return {
        pathname: pathname,
        query: (0, _querystring).searchParamsToUrlQuery(searchParams),
        search: search,
        hash: hash,
        href: href.slice(globalBase.origin.length)
    };
} //# sourceMappingURL=parse-relative-url.js.map


/***/ }),

/***/ 1259:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.pathHasPrefix = pathHasPrefix;
var _parsePath = __webpack_require__(4943);
function pathHasPrefix(path, prefix) {
    if (typeof path !== "string") {
        return false;
    }
    var pathname = (0, _parsePath).parsePath(path).pathname;
    return pathname === prefix || pathname.startsWith(prefix + "/");
} //# sourceMappingURL=path-has-prefix.js.map


/***/ }),

/***/ 466:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _slicedToArray = (__webpack_require__(4941)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.searchParamsToUrlQuery = searchParamsToUrlQuery;
exports.urlQueryToSearchParams = urlQueryToSearchParams;
exports.assign = assign;
function searchParamsToUrlQuery(searchParams) {
    var query = {};
    searchParams.forEach(function(value, key) {
        if (typeof query[key] === "undefined") {
            query[key] = value;
        } else if (Array.isArray(query[key])) {
            query[key].push(value);
        } else {
            query[key] = [
                query[key],
                value
            ];
        }
    });
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === "string" || typeof param === "number" && !isNaN(param) || typeof param === "boolean") {
        return String(param);
    } else {
        return "";
    }
}
function urlQueryToSearchParams(urlQuery) {
    var result = new URLSearchParams();
    Object.entries(urlQuery).forEach(function(param) {
        var _param = _slicedToArray(param, 2), key = _param[0], value = _param[1];
        if (Array.isArray(value)) {
            value.forEach(function(item) {
                return result.append(key, stringifyUrlQueryParam(item));
            });
        } else {
            result.set(key, stringifyUrlQueryParam(value));
        }
    });
    return result;
}
function assign(target) {
    for(var _len = arguments.length, searchParamsList = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        searchParamsList[_key - 1] = arguments[_key];
    }
    searchParamsList.forEach(function(searchParams) {
        Array.from(searchParams.keys()).forEach(function(key) {
            return target.delete(key);
        });
        searchParams.forEach(function(value, key) {
            return target.append(key, value);
        });
    });
    return target;
} //# sourceMappingURL=querystring.js.map


/***/ }),

/***/ 9244:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.removePathPrefix = removePathPrefix;
var _pathHasPrefix = __webpack_require__(1259);
function removePathPrefix(path, prefix) {
    if ((0, _pathHasPrefix).pathHasPrefix(path, prefix)) {
        var withoutPrefix = path.slice(prefix.length);
        return withoutPrefix.startsWith("/") ? withoutPrefix : "/".concat(withoutPrefix);
    }
    return path;
} //# sourceMappingURL=remove-path-prefix.js.map


/***/ }),

/***/ 6316:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.removeTrailingSlash = removeTrailingSlash;
function removeTrailingSlash(route) {
    return route.replace(/\/$/, "") || "/";
} //# sourceMappingURL=remove-trailing-slash.js.map


/***/ }),

/***/ 3888:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getRouteMatcher = getRouteMatcher;
var _utils = __webpack_require__(3794);
function getRouteMatcher(param) {
    var re = param.re, groups = param.groups;
    return function(pathname) {
        var routeMatch = re.exec(pathname);
        if (!routeMatch) {
            return false;
        }
        var decode = function(param) {
            try {
                return decodeURIComponent(param);
            } catch (_) {
                throw new _utils.DecodeError("failed to decode param");
            }
        };
        var params = {};
        Object.keys(groups).forEach(function(slugName) {
            var g = groups[slugName];
            var m = routeMatch[g.pos];
            if (m !== undefined) {
                params[slugName] = ~m.indexOf("/") ? m.split("/").map(function(entry) {
                    return decode(entry);
                }) : g.repeat ? [
                    decode(m)
                ] : decode(m);
            }
        });
        return params;
    };
} //# sourceMappingURL=route-matcher.js.map


/***/ }),

/***/ 4095:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getRouteRegex = getRouteRegex;
exports.getNamedRouteRegex = getNamedRouteRegex;
exports.getNamedMiddlewareRegex = getNamedMiddlewareRegex;
var _extends = (__webpack_require__(6495)/* ["default"] */ .Z);
var _escapeRegexp = __webpack_require__(489);
var _removeTrailingSlash = __webpack_require__(6316);
/**
 * Parses a given parameter from a route to a data structure that can be used
 * to generate the parametrized route. Examples:
 *   - `[...slug]` -> `{ name: 'slug', repeat: true, optional: true }`
 *   - `[foo]` -> `{ name: 'foo', repeat: false, optional: true }`
 *   - `bar` -> `{ name: 'bar', repeat: false, optional: false }`
 */ function parseParameter(param) {
    var optional = param.startsWith("[") && param.endsWith("]");
    if (optional) {
        param = param.slice(1, -1);
    }
    var repeat = param.startsWith("...");
    if (repeat) {
        param = param.slice(3);
    }
    return {
        key: param,
        repeat: repeat,
        optional: optional
    };
}
function getParametrizedRoute(route) {
    var segments = (0, _removeTrailingSlash).removeTrailingSlash(route).slice(1).split("/");
    var groups = {};
    var groupIndex = 1;
    return {
        parameterizedRoute: segments.map(function(segment) {
            if (segment.startsWith("[") && segment.endsWith("]")) {
                var ref = parseParameter(segment.slice(1, -1)), key = ref.key, optional = ref.optional, repeat = ref.repeat;
                groups[key] = {
                    pos: groupIndex++,
                    repeat: repeat,
                    optional: optional
                };
                return repeat ? optional ? "(?:/(.+?))?" : "/(.+?)" : "/([^/]+?)";
            } else {
                return "/".concat((0, _escapeRegexp).escapeStringRegexp(segment));
            }
        }).join(""),
        groups: groups
    };
}
function getRouteRegex(normalizedRoute) {
    var ref = getParametrizedRoute(normalizedRoute), parameterizedRoute = ref.parameterizedRoute, groups = ref.groups;
    return {
        re: new RegExp("^".concat(parameterizedRoute, "(?:/)?$")),
        groups: groups
    };
}
/**
 * Builds a function to generate a minimal routeKey using only a-z and minimal
 * number of characters.
 */ function buildGetSafeRouteKey() {
    var routeKeyCharCode = 97;
    var routeKeyCharLength = 1;
    return function() {
        var routeKey = "";
        for(var i = 0; i < routeKeyCharLength; i++){
            routeKey += String.fromCharCode(routeKeyCharCode);
            routeKeyCharCode++;
            if (routeKeyCharCode > 122) {
                routeKeyCharLength++;
                routeKeyCharCode = 97;
            }
        }
        return routeKey;
    };
}
function getNamedParametrizedRoute(route) {
    var segments = (0, _removeTrailingSlash).removeTrailingSlash(route).slice(1).split("/");
    var getSafeRouteKey = buildGetSafeRouteKey();
    var routeKeys = {};
    return {
        namedParameterizedRoute: segments.map(function(segment) {
            if (segment.startsWith("[") && segment.endsWith("]")) {
                var ref = parseParameter(segment.slice(1, -1)), key = ref.key, optional = ref.optional, repeat = ref.repeat;
                // replace any non-word characters since they can break
                // the named regex
                var cleanedKey = key.replace(/\W/g, "");
                var invalidKey = false;
                // check if the key is still invalid and fallback to using a known
                // safe key
                if (cleanedKey.length === 0 || cleanedKey.length > 30) {
                    invalidKey = true;
                }
                if (!isNaN(parseInt(cleanedKey.slice(0, 1)))) {
                    invalidKey = true;
                }
                if (invalidKey) {
                    cleanedKey = getSafeRouteKey();
                }
                routeKeys[cleanedKey] = key;
                return repeat ? optional ? "(?:/(?<".concat(cleanedKey, ">.+?))?") : "/(?<".concat(cleanedKey, ">.+?)") : "/(?<".concat(cleanedKey, ">[^/]+?)");
            } else {
                return "/".concat((0, _escapeRegexp).escapeStringRegexp(segment));
            }
        }).join(""),
        routeKeys: routeKeys
    };
}
function getNamedRouteRegex(normalizedRoute) {
    var result = getNamedParametrizedRoute(normalizedRoute);
    return _extends({}, getRouteRegex(normalizedRoute), {
        namedRegex: "^".concat(result.namedParameterizedRoute, "(?:/)?$"),
        routeKeys: result.routeKeys
    });
}
function getNamedMiddlewareRegex(normalizedRoute, options) {
    var parameterizedRoute = getParametrizedRoute(normalizedRoute).parameterizedRoute;
    var _catchAll = options.catchAll, catchAll = _catchAll === void 0 ? true : _catchAll;
    if (parameterizedRoute === "/") {
        var catchAllRegex = catchAll ? ".*" : "";
        return {
            namedRegex: "^/".concat(catchAllRegex, "$")
        };
    }
    var namedParameterizedRoute = getNamedParametrizedRoute(normalizedRoute).namedParameterizedRoute;
    var catchAllGroupedRegex = catchAll ? "(?:(/.*)?)" : "";
    return {
        namedRegex: "^".concat(namedParameterizedRoute).concat(catchAllGroupedRegex, "$")
    };
} //# sourceMappingURL=route-regex.js.map


/***/ }),

/***/ 3907:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _classCallCheck = (__webpack_require__(9658)/* ["default"] */ .Z);
var _createClass = (__webpack_require__(7222)/* ["default"] */ .Z);
var _toConsumableArray = (__webpack_require__(3929)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getSortedRoutes = getSortedRoutes;
var UrlNode = /*#__PURE__*/ function() {
    function UrlNode() {
        _classCallCheck(this, UrlNode);
        this.placeholder = true;
        this.children = new Map();
        this.slugName = null;
        this.restSlugName = null;
        this.optionalRestSlugName = null;
    }
    _createClass(UrlNode, [
        {
            key: "insert",
            value: function insert(urlPath) {
                this._insert(urlPath.split("/").filter(Boolean), [], false);
            }
        },
        {
            key: "smoosh",
            value: function smoosh() {
                return this._smoosh();
            }
        },
        {
            key: "_smoosh",
            value: function _smoosh() {
                var prefix = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "/";
                var _this = this;
                var childrenPaths = _toConsumableArray(this.children.keys()).sort();
                if (this.slugName !== null) {
                    childrenPaths.splice(childrenPaths.indexOf("[]"), 1);
                }
                if (this.restSlugName !== null) {
                    childrenPaths.splice(childrenPaths.indexOf("[...]"), 1);
                }
                if (this.optionalRestSlugName !== null) {
                    childrenPaths.splice(childrenPaths.indexOf("[[...]]"), 1);
                }
                var routes = childrenPaths.map(function(c) {
                    return _this.children.get(c)._smoosh("".concat(prefix).concat(c, "/"));
                }).reduce(function(prev, curr) {
                    return _toConsumableArray(prev).concat(_toConsumableArray(curr));
                }, []);
                if (this.slugName !== null) {
                    var _routes;
                    (_routes = routes).push.apply(_routes, _toConsumableArray(this.children.get("[]")._smoosh("".concat(prefix, "[").concat(this.slugName, "]/"))));
                }
                if (!this.placeholder) {
                    var r = prefix === "/" ? "/" : prefix.slice(0, -1);
                    if (this.optionalRestSlugName != null) {
                        throw new Error('You cannot define a route with the same specificity as a optional catch-all route ("'.concat(r, '" and "').concat(r, "[[...").concat(this.optionalRestSlugName, ']]").'));
                    }
                    routes.unshift(r);
                }
                if (this.restSlugName !== null) {
                    var _routes1;
                    (_routes1 = routes).push.apply(_routes1, _toConsumableArray(this.children.get("[...]")._smoosh("".concat(prefix, "[...").concat(this.restSlugName, "]/"))));
                }
                if (this.optionalRestSlugName !== null) {
                    var _routes2;
                    (_routes2 = routes).push.apply(_routes2, _toConsumableArray(this.children.get("[[...]]")._smoosh("".concat(prefix, "[[...").concat(this.optionalRestSlugName, "]]/"))));
                }
                return routes;
            }
        },
        {
            key: "_insert",
            value: function _insert(urlPaths, slugNames, isCatchAll) {
                if (urlPaths.length === 0) {
                    this.placeholder = false;
                    return;
                }
                if (isCatchAll) {
                    throw new Error("Catch-all must be the last part of the URL.");
                }
                // The next segment in the urlPaths list
                var nextSegment = urlPaths[0];
                // Check if the segment matches `[something]`
                if (nextSegment.startsWith("[") && nextSegment.endsWith("]")) {
                    var handleSlug = function handleSlug(previousSlug, nextSlug) {
                        if (previousSlug !== null) {
                            // If the specific segment already has a slug but the slug is not `something`
                            // This prevents collisions like:
                            // pages/[post]/index.js
                            // pages/[id]/index.js
                            // Because currently multiple dynamic params on the same segment level are not supported
                            if (previousSlug !== nextSlug) {
                                // TODO: This error seems to be confusing for users, needs an error link, the description can be based on above comment.
                                throw new Error("You cannot use different slug names for the same dynamic path ('".concat(previousSlug, "' !== '").concat(nextSlug, "')."));
                            }
                        }
                        slugNames.forEach(function(slug) {
                            if (slug === nextSlug) {
                                throw new Error('You cannot have the same slug name "'.concat(nextSlug, '" repeat within a single dynamic path'));
                            }
                            if (slug.replace(/\W/g, "") === nextSegment.replace(/\W/g, "")) {
                                throw new Error('You cannot have the slug names "'.concat(slug, '" and "').concat(nextSlug, '" differ only by non-word symbols within a single dynamic path'));
                            }
                        });
                        slugNames.push(nextSlug);
                    };
                    // Strip `[` and `]`, leaving only `something`
                    var segmentName = nextSegment.slice(1, -1);
                    var isOptional = false;
                    if (segmentName.startsWith("[") && segmentName.endsWith("]")) {
                        // Strip optional `[` and `]`, leaving only `something`
                        segmentName = segmentName.slice(1, -1);
                        isOptional = true;
                    }
                    if (segmentName.startsWith("...")) {
                        // Strip `...`, leaving only `something`
                        segmentName = segmentName.substring(3);
                        isCatchAll = true;
                    }
                    if (segmentName.startsWith("[") || segmentName.endsWith("]")) {
                        throw new Error("Segment names may not start or end with extra brackets ('".concat(segmentName, "')."));
                    }
                    if (segmentName.startsWith(".")) {
                        throw new Error("Segment names may not start with erroneous periods ('".concat(segmentName, "')."));
                    }
                    if (isCatchAll) {
                        if (isOptional) {
                            if (this.restSlugName != null) {
                                throw new Error('You cannot use both an required and optional catch-all route at the same level ("[...'.concat(this.restSlugName, ']" and "').concat(urlPaths[0], '" ).'));
                            }
                            handleSlug(this.optionalRestSlugName, segmentName);
                            // slugName is kept as it can only be one particular slugName
                            this.optionalRestSlugName = segmentName;
                            // nextSegment is overwritten to [[...]] so that it can later be sorted specifically
                            nextSegment = "[[...]]";
                        } else {
                            if (this.optionalRestSlugName != null) {
                                throw new Error('You cannot use both an optional and required catch-all route at the same level ("[[...'.concat(this.optionalRestSlugName, ']]" and "').concat(urlPaths[0], '").'));
                            }
                            handleSlug(this.restSlugName, segmentName);
                            // slugName is kept as it can only be one particular slugName
                            this.restSlugName = segmentName;
                            // nextSegment is overwritten to [...] so that it can later be sorted specifically
                            nextSegment = "[...]";
                        }
                    } else {
                        if (isOptional) {
                            throw new Error('Optional route parameters are not yet supported ("'.concat(urlPaths[0], '").'));
                        }
                        handleSlug(this.slugName, segmentName);
                        // slugName is kept as it can only be one particular slugName
                        this.slugName = segmentName;
                        // nextSegment is overwritten to [] so that it can later be sorted specifically
                        nextSegment = "[]";
                    }
                }
                // If this UrlNode doesn't have the nextSegment yet we create a new child UrlNode
                if (!this.children.has(nextSegment)) {
                    this.children.set(nextSegment, new UrlNode());
                }
                this.children.get(nextSegment)._insert(urlPaths.slice(1), slugNames, isCatchAll);
            }
        }
    ]);
    return UrlNode;
}();
function getSortedRoutes(normalizedPages) {
    // First the UrlNode is created, and every UrlNode can have only 1 dynamic segment
    // Eg you can't have pages/[post]/abc.js and pages/[hello]/something-else.js
    // Only 1 dynamic segment per nesting level
    // So in the case that is test/integration/dynamic-routing it'll be this:
    // pages/[post]/comments.js
    // pages/blog/[post]/comment/[id].js
    // Both are fine because `pages/[post]` and `pages/blog` are on the same level
    // So in this case `UrlNode` created here has `this.slugName === 'post'`
    // And since your PR passed through `slugName` as an array basically it'd including it in too many possibilities
    // Instead what has to be passed through is the upwards path's dynamic names
    var root = new UrlNode();
    // Here the `root` gets injected multiple paths, and insert will break them up into sublevels
    normalizedPages.forEach(function(pagePath) {
        return root.insert(pagePath);
    });
    // Smoosh will then sort those sublevels up to the point where you get the correct route definition priority
    return root.smoosh();
} //# sourceMappingURL=sorted-routes.js.map


/***/ }),

/***/ 8027:
/***/ (function(module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.setConfig = setConfig;
exports["default"] = void 0;
var runtimeConfig;
var _default = function() {
    return runtimeConfig;
};
exports["default"] = _default;
function setConfig(configValue) {
    runtimeConfig = configValue;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=runtime-config.js.map


/***/ }),

/***/ 5188:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = SideEffect;
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
var _react = _interop_require_wildcard(__webpack_require__(7294));
function SideEffect(props) {
    var emitChange = function emitChange() {
        if (headManager && headManager.mountedInstances) {
            var headElements = _react.Children.toArray(Array.from(headManager.mountedInstances).filter(Boolean));
            headManager.updateHead(reduceComponentsToState(headElements, props));
        }
    };
    var headManager = props.headManager, reduceComponentsToState = props.reduceComponentsToState;
    if (isServer) {
        var ref;
        headManager == null ? void 0 : (ref = headManager.mountedInstances) == null ? void 0 : ref.add(props.children);
        emitChange();
    }
    useClientOnlyLayoutEffect(function() {
        var ref1;
        headManager == null ? void 0 : (ref1 = headManager.mountedInstances) == null ? void 0 : ref1.add(props.children);
        return function() {
            var ref;
            headManager == null ? void 0 : (ref = headManager.mountedInstances) == null ? void 0 : ref.delete(props.children);
        };
    });
    // We need to call `updateHead` method whenever the `SideEffect` is trigger in all
    // life-cycles: mount, update, unmount. However, if there are multiple `SideEffect`s
    // being rendered, we only trigger the method from the last one.
    // This is ensured by keeping the last unflushed `updateHead` in the `_pendingUpdate`
    // singleton in the layout effect pass, and actually trigger it in the effect pass.
    useClientOnlyLayoutEffect(function() {
        if (headManager) {
            headManager._pendingUpdate = emitChange;
        }
        return function() {
            if (headManager) {
                headManager._pendingUpdate = emitChange;
            }
        };
    });
    useClientOnlyEffect(function() {
        if (headManager && headManager._pendingUpdate) {
            headManager._pendingUpdate();
            headManager._pendingUpdate = null;
        }
        return function() {
            if (headManager && headManager._pendingUpdate) {
                headManager._pendingUpdate();
                headManager._pendingUpdate = null;
            }
        };
    });
    return null;
}
var isServer = "object" === "undefined";
var useClientOnlyLayoutEffect = isServer ? function() {} : _react.useLayoutEffect;
var useClientOnlyEffect = isServer ? function() {} : _react.useEffect; //# sourceMappingURL=side-effect.js.map


/***/ }),

/***/ 3794:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _classCallCheck = (__webpack_require__(9658)/* ["default"] */ .Z);
var _inherits = (__webpack_require__(7788)/* ["default"] */ .Z);
var _toConsumableArray = (__webpack_require__(3929)/* ["default"] */ .Z);
var _wrapNativeSuper = (__webpack_require__(9968)/* ["default"] */ .Z);
var _createSuper = (__webpack_require__(7735)/* ["default"] */ .Z);
var _tsGenerator = (__webpack_require__(2401)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.execOnce = execOnce;
exports.getLocationOrigin = getLocationOrigin;
exports.getURL = getURL;
exports.getDisplayName = getDisplayName;
exports.isResSent = isResSent;
exports.normalizeRepeatedSlashes = normalizeRepeatedSlashes;
exports.loadGetInitialProps = loadGetInitialProps;
exports.ST = exports.SP = exports.warnOnce = exports.isAbsoluteUrl = void 0;
var _async_to_generator = (__webpack_require__(932)/* ["default"] */ .Z);
function execOnce(fn) {
    var used = false;
    var result;
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (!used) {
            used = true;
            result = fn.apply(void 0, _toConsumableArray(args));
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
var ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
var isAbsoluteUrl = function(url) {
    return ABSOLUTE_URL_REGEX.test(url);
};
exports.isAbsoluteUrl = isAbsoluteUrl;
function getLocationOrigin() {
    var _location = window.location, protocol = _location.protocol, hostname = _location.hostname, port = _location.port;
    return "".concat(protocol, "//").concat(hostname).concat(port ? ":" + port : "");
}
function getURL() {
    var href = window.location.href;
    var origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === "string" ? Component : Component.displayName || Component.name || "Unknown";
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    var urlParts = url.split("?");
    var urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, "/").replace(/\/\/+/g, "/") + (urlParts[1] ? "?".concat(urlParts.slice(1).join("?")) : "");
}
function loadGetInitialProps(App, ctx) {
    return _loadGetInitialProps.apply(this, arguments);
}
function _loadGetInitialProps() {
    _loadGetInitialProps = _async_to_generator(function(App, ctx) {
        var ref, message, res, _tmp, props, message1;
        return _tsGenerator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (false) {}
                    res = ctx.res || ctx.ctx && ctx.ctx.res;
                    if (!!App.getInitialProps) return [
                        3,
                        3
                    ];
                    if (!(ctx.ctx && ctx.Component)) return [
                        3,
                        2
                    ];
                    _tmp = {};
                    return [
                        4,
                        loadGetInitialProps(ctx.Component, ctx.ctx)
                    ];
                case 1:
                    // @ts-ignore pageProps default
                    return [
                        2,
                        (_tmp.pageProps = _state.sent(), _tmp)
                    ];
                case 2:
                    return [
                        2,
                        {}
                    ];
                case 3:
                    return [
                        4,
                        App.getInitialProps(ctx)
                    ];
                case 4:
                    props = _state.sent();
                    if (res && isResSent(res)) {
                        return [
                            2,
                            props
                        ];
                    }
                    if (!props) {
                        message1 = '"'.concat(getDisplayName(App), '.getInitialProps()" should resolve to an object. But found "').concat(props, '" instead.');
                        throw new Error(message1);
                    }
                    if (false) {}
                    return [
                        2,
                        props
                    ];
            }
        });
    });
    return _loadGetInitialProps.apply(this, arguments);
}
var warnOnce = function(_) {};
if (false) { var warnings; }
var SP = typeof performance !== "undefined";
exports.SP = SP;
var ST = SP && [
    "mark",
    "measure",
    "getEntriesByName"
].every(function(method) {
    return typeof performance[method] === "function";
});
exports.ST = ST;
var DecodeError = /*#__PURE__*/ function(Error1) {
    _inherits(DecodeError, Error1);
    var _super = _createSuper(DecodeError);
    function DecodeError() {
        _classCallCheck(this, DecodeError);
        return _super.apply(this, arguments);
    }
    return DecodeError;
}(_wrapNativeSuper(Error));
exports.DecodeError = DecodeError;
var NormalizeError = /*#__PURE__*/ function(Error1) {
    _inherits(NormalizeError, Error1);
    var _super = _createSuper(NormalizeError);
    function NormalizeError() {
        _classCallCheck(this, NormalizeError);
        return _super.apply(this, arguments);
    }
    return NormalizeError;
}(_wrapNativeSuper(Error));
exports.NormalizeError = NormalizeError;
var PageNotFoundError = /*#__PURE__*/ function(Error1) {
    _inherits(PageNotFoundError, Error1);
    var _super = _createSuper(PageNotFoundError);
    function PageNotFoundError(page) {
        _classCallCheck(this, PageNotFoundError);
        var _this;
        _this = _super.call(this);
        _this.code = "ENOENT";
        _this.message = "Cannot find module for page: ".concat(page);
        return _this;
    }
    return PageNotFoundError;
}(_wrapNativeSuper(Error));
exports.PageNotFoundError = PageNotFoundError;
var MissingStaticPage = /*#__PURE__*/ function(Error1) {
    _inherits(MissingStaticPage, Error1);
    var _super = _createSuper(MissingStaticPage);
    function MissingStaticPage(page, message) {
        _classCallCheck(this, MissingStaticPage);
        var _this;
        _this = _super.call(this);
        _this.message = "Failed to load static file for page: ".concat(page, " ").concat(message);
        return _this;
    }
    return MissingStaticPage;
}(_wrapNativeSuper(Error));
exports.MissingStaticPage = MissingStaticPage;
var MiddlewareNotFoundError = /*#__PURE__*/ function(Error1) {
    _inherits(MiddlewareNotFoundError, Error1);
    var _super = _createSuper(MiddlewareNotFoundError);
    function MiddlewareNotFoundError() {
        _classCallCheck(this, MiddlewareNotFoundError);
        var _this;
        _this = _super.call(this);
        _this.code = "ENOENT";
        _this.message = "Cannot find the middleware module";
        return _this;
    }
    return MiddlewareNotFoundError;
}(_wrapNativeSuper(Error));
exports.MiddlewareNotFoundError = MiddlewareNotFoundError;
exports.warnOnce = warnOnce; //# sourceMappingURL=utils.js.map


/***/ }),

/***/ 8018:
/***/ (function(module) {

var __dirname = "/";
(function(){"use strict";var n={};!function(){n.d=function(y,T){for(var C in T){if(n.o(T,C)&&!n.o(y,C)){Object.defineProperty(y,C,{enumerable:true,get:T[C]})}}}}();!function(){n.o=function(n,y){return Object.prototype.hasOwnProperty.call(n,y)}}();!function(){n.r=function(n){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(n,"__esModule",{value:true})}}();if(typeof n!=="undefined")n.ab=__dirname+"/";var y={};n.r(y);n.d(y,{getCLS:function(){return E},getFCP:function(){return g},getFID:function(){return F},getINP:function(){return O},getLCP:function(){return _},getTTFB:function(){return G},onCLS:function(){return E},onFCP:function(){return g},onFID:function(){return F},onINP:function(){return O},onLCP:function(){return _},onTTFB:function(){return G}});var T,C,w,P,I,k=-1,o=function(n){addEventListener("pageshow",(function(y){y.persisted&&(k=y.timeStamp,n(y))}),!0)},c=function(){return window.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]},u=function(){var n=c();return n&&n.activationStart||0},f=function(n,y){var T=c(),C="navigate";return k>=0?C="back-forward-cache":T&&(C=document.prerendering||u()>0?"prerender":T.type.replace(/_/g,"-")),{name:n,value:void 0===y?-1:y,rating:"good",delta:0,entries:[],id:"v3-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:C}},s=function(n,y,T){try{if(PerformanceObserver.supportedEntryTypes.includes(n)){var C=new PerformanceObserver((function(n){y(n.getEntries())}));return C.observe(Object.assign({type:n,buffered:!0},T||{})),C}}catch(n){}},d=function(n,y){var T=function t(T){"pagehide"!==T.type&&"hidden"!==document.visibilityState||(n(T),y&&(removeEventListener("visibilitychange",t,!0),removeEventListener("pagehide",t,!0)))};addEventListener("visibilitychange",T,!0),addEventListener("pagehide",T,!0)},l=function(n,y,T,C){var w,P;return function(I){y.value>=0&&(I||C)&&((P=y.value-(w||0))||void 0===w)&&(w=y.value,y.delta=P,y.rating=function(n,y){return n>y[1]?"poor":n>y[0]?"needs-improvement":"good"}(y.value,T),n(y))}},N=-1,v=function(){return"hidden"!==document.visibilityState||document.prerendering?1/0:0},m=function(){d((function(n){var y=n.timeStamp;N=y}),!0)},h=function(){return N<0&&(N=v(),m(),o((function(){setTimeout((function(){N=v(),m()}),0)}))),{get firstHiddenTime(){return N}}},g=function(n,y){y=y||{};var T,C=[1800,3e3],w=h(),P=f("FCP"),c=function(n){n.forEach((function(n){"first-contentful-paint"===n.name&&(k&&k.disconnect(),n.startTime<w.firstHiddenTime&&(P.value=n.startTime-u(),P.entries.push(n),T(!0)))}))},I=window.performance&&window.performance.getEntriesByName&&window.performance.getEntriesByName("first-contentful-paint")[0],k=I?null:s("paint",c);(I||k)&&(T=l(n,P,C,y.reportAllChanges),I&&c([I]),o((function(w){P=f("FCP"),T=l(n,P,C,y.reportAllChanges),requestAnimationFrame((function(){requestAnimationFrame((function(){P.value=performance.now()-w.timeStamp,T(!0)}))}))})))},j=!1,q=-1,E=function(n,y){y=y||{};var T=[.1,.25];j||(g((function(n){q=n.value})),j=!0);var C,i=function(y){q>-1&&n(y)},w=f("CLS",0),P=0,I=[],p=function(n){n.forEach((function(n){if(!n.hadRecentInput){var y=I[0],T=I[I.length-1];P&&n.startTime-T.startTime<1e3&&n.startTime-y.startTime<5e3?(P+=n.value,I.push(n)):(P=n.value,I=[n]),P>w.value&&(w.value=P,w.entries=I,C())}}))},k=s("layout-shift",p);k&&(C=l(i,w,T,y.reportAllChanges),d((function(){p(k.takeRecords()),C(!0)})),o((function(){P=0,q=-1,w=f("CLS",0),C=l(i,w,T,y.reportAllChanges)})))},x={passive:!0,capture:!0},z=new Date,L=function(n,y){T||(T=y,C=n,w=new Date,A(removeEventListener),S())},S=function(){if(C>=0&&C<w-z){var n={entryType:"first-input",name:T.type,target:T.target,cancelable:T.cancelable,startTime:T.timeStamp,processingStart:T.timeStamp+C};P.forEach((function(y){y(n)})),P=[]}},b=function(n){if(n.cancelable){var y=(n.timeStamp>1e12?new Date:performance.now())-n.timeStamp;"pointerdown"==n.type?function(n,y){var t=function(){L(n,y),i()},r=function(){i()},i=function(){removeEventListener("pointerup",t,x),removeEventListener("pointercancel",r,x)};addEventListener("pointerup",t,x),addEventListener("pointercancel",r,x)}(y,n):L(y,n)}},A=function(n){["mousedown","keydown","touchstart","pointerdown"].forEach((function(y){return n(y,b,x)}))},F=function(n,y){y=y||{};var w,I=[100,300],k=h(),N=f("FID"),v=function(n){n.startTime<k.firstHiddenTime&&(N.value=n.processingStart-n.startTime,N.entries.push(n),w(!0))},m=function(n){n.forEach(v)},j=s("first-input",m);w=l(n,N,I,y.reportAllChanges),j&&d((function(){m(j.takeRecords()),j.disconnect()}),!0),j&&o((function(){var k;N=f("FID"),w=l(n,N,I,y.reportAllChanges),P=[],C=-1,T=null,A(addEventListener),k=v,P.push(k),S()}))},J=0,K=1/0,Q=0,M=function(n){n.forEach((function(n){n.interactionId&&(K=Math.min(K,n.interactionId),Q=Math.max(Q,n.interactionId),J=Q?(Q-K)/7+1:0)}))},B=function(){return I?J:performance.interactionCount||0},D=function(){"interactionCount"in performance||I||(I=s("event",M,{type:"event",buffered:!0,durationThreshold:0}))},U=0,R=function(){return B()-U},V=[],W={},H=function(n){var y=V[V.length-1],T=W[n.interactionId];if(T||V.length<10||n.duration>y.latency){if(T)T.entries.push(n),T.latency=Math.max(T.latency,n.duration);else{var C={id:n.interactionId,latency:n.duration,entries:[n]};W[C.id]=C,V.push(C)}V.sort((function(n,y){return y.latency-n.latency})),V.splice(10).forEach((function(n){delete W[n.id]}))}},O=function(n,y){y=y||{};var T=[200,500];D();var C,w=f("INP"),a=function(n){n.forEach((function(n){(n.interactionId&&H(n),"first-input"===n.entryType)&&(!V.some((function(y){return y.entries.some((function(y){return n.duration===y.duration&&n.startTime===y.startTime}))}))&&H(n))}));var y,T=(y=Math.min(V.length-1,Math.floor(R()/50)),V[y]);T&&T.latency!==w.value&&(w.value=T.latency,w.entries=T.entries,C())},P=s("event",a,{durationThreshold:y.durationThreshold||40});C=l(n,w,T,y.reportAllChanges),P&&(P.observe({type:"first-input",buffered:!0}),d((function(){a(P.takeRecords()),w.value<0&&R()>0&&(w.value=0,w.entries=[]),C(!0)})),o((function(){V=[],U=B(),w=f("INP"),C=l(n,w,T,y.reportAllChanges)})))},X={},_=function(n,y){y=y||{};var T,C=[2500,4e3],w=h(),P=f("LCP"),c=function(n){var y=n[n.length-1];if(y){var C=y.startTime-u();C<w.firstHiddenTime&&(P.value=C,P.entries=[y],T())}},I=s("largest-contentful-paint",c);if(I){T=l(n,P,C,y.reportAllChanges);var v=function(){X[P.id]||(c(I.takeRecords()),I.disconnect(),X[P.id]=!0,T(!0))};["keydown","click"].forEach((function(n){addEventListener(n,v,{once:!0,capture:!0})})),d(v,!0),o((function(w){P=f("LCP"),T=l(n,P,C,y.reportAllChanges),requestAnimationFrame((function(){requestAnimationFrame((function(){P.value=performance.now()-w.timeStamp,X[P.id]=!0,T(!0)}))}))}))}},Y=function e(n){document.prerendering?addEventListener("prerenderingchange",(function(){return e(n)}),!0):"complete"!==document.readyState?addEventListener("load",(function(){return e(n)}),!0):setTimeout(n,0)},G=function(n,y){y=y||{};var T=[800,1800],C=f("TTFB"),w=l(n,C,T,y.reportAllChanges);Y((function(){var P=c();if(P){if(C.value=Math.max(P.responseStart-u(),0),C.value<0||C.value>performance.now())return;C.entries=[P],w(!0),o((function(){C=f("TTFB",0),(w=l(n,C,T,y.reportAllChanges))(!0)}))}}))};module.exports=y})();

/***/ }),

/***/ 676:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = isError;
exports.getProperError = getProperError;
var _isPlainObject = __webpack_require__(8887);
function isError(err) {
    return typeof err === "object" && err !== null && "name" in err && "message" in err;
}
function getProperError(err) {
    if (isError(err)) {
        return err;
    }
    if (false) {}
    return new Error((0, _isPlainObject).isPlainObject(err) ? JSON.stringify(err) : err + "");
}

//# sourceMappingURL=is-error.js.map

/***/ }),

/***/ 655:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__assign": function() { return /* binding */ __assign; },
/* harmony export */   "__asyncDelegator": function() { return /* binding */ __asyncDelegator; },
/* harmony export */   "__asyncGenerator": function() { return /* binding */ __asyncGenerator; },
/* harmony export */   "__asyncValues": function() { return /* binding */ __asyncValues; },
/* harmony export */   "__await": function() { return /* binding */ __await; },
/* harmony export */   "__awaiter": function() { return /* binding */ __awaiter; },
/* harmony export */   "__classPrivateFieldGet": function() { return /* binding */ __classPrivateFieldGet; },
/* harmony export */   "__classPrivateFieldIn": function() { return /* binding */ __classPrivateFieldIn; },
/* harmony export */   "__classPrivateFieldSet": function() { return /* binding */ __classPrivateFieldSet; },
/* harmony export */   "__createBinding": function() { return /* binding */ __createBinding; },
/* harmony export */   "__decorate": function() { return /* binding */ __decorate; },
/* harmony export */   "__exportStar": function() { return /* binding */ __exportStar; },
/* harmony export */   "__extends": function() { return /* binding */ __extends; },
/* harmony export */   "__generator": function() { return /* binding */ __generator; },
/* harmony export */   "__importDefault": function() { return /* binding */ __importDefault; },
/* harmony export */   "__importStar": function() { return /* binding */ __importStar; },
/* harmony export */   "__makeTemplateObject": function() { return /* binding */ __makeTemplateObject; },
/* harmony export */   "__metadata": function() { return /* binding */ __metadata; },
/* harmony export */   "__param": function() { return /* binding */ __param; },
/* harmony export */   "__read": function() { return /* binding */ __read; },
/* harmony export */   "__rest": function() { return /* binding */ __rest; },
/* harmony export */   "__spread": function() { return /* binding */ __spread; },
/* harmony export */   "__spreadArray": function() { return /* binding */ __spreadArray; },
/* harmony export */   "__spreadArrays": function() { return /* binding */ __spreadArrays; },
/* harmony export */   "__values": function() { return /* binding */ __values; }
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}


/***/ }),

/***/ 2431:
/***/ (function() {

/* (ignored) */

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774], function() { return __webpack_exec__(2870); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);