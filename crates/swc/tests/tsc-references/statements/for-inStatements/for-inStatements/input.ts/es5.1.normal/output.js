function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
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
function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
    } else {
        _get = function _get(target, property, receiver) {
            var base = _superPropBase(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) {
                return desc.get.call(receiver);
            }
            return desc.value;
        };
    }
    return _get(target, property, receiver || target);
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
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
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
function _superPropBase(object, property) {
    while(!Object.prototype.hasOwnProperty.call(object, property)){
        object = _getPrototypeOf(object);
        if (object === null) break;
    }
    return object;
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var aString;
for(aString in {
}){
}
var anAny;
for(anAny in {
}){
}
for(var x1 in {
}){
}
for(var x1 in []){
}
for(var x1 in [
    1,
    2,
    3,
    4,
    5
]){
}
function fn() {
}
for(var x1 in fn()){
}
for(var x1 in /[a-z]/){
}
for(var x1 in new Date()){
}
var c, d, e;
for(var x1 in c || d){
}
for(var x1 in e ? c : d){
}
for(var x1 in 42 ? c : d){
}
for(var x1 in '' ? c : d){
}
for(var x1 in 42 ? d[x1] : c[x1]){
}
for(var x1 in c[d]){
}
for(var x1 in function(x) {
    return x;
}){
}
for(var x1 in function(x, y) {
    return x + y;
}){
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
    }
    _createClass(A, [
        {
            key: "biz",
            value: function biz() {
                for(var x in this.biz()){
                }
                for(var x in this.biz){
                }
                for(var x in this){
                }
                return null;
            }
        }
    ], [
        {
            key: "baz",
            value: function baz() {
                for(var x in this){
                }
                for(var x in this.baz){
                }
                for(var x in this.baz()){
                }
                return null;
            }
        }
    ]);
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _createSuper(B);
    function B() {
        _classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    _createClass(B, [
        {
            key: "boz",
            value: function boz() {
                for(var x in this.biz()){
                }
                for(var x in this.biz){
                }
                for(var x in this){
                }
                for(var x in _get(_getPrototypeOf(B.prototype), "biz", this)){
                }
                for(var x in _get(_getPrototypeOf(B.prototype), "biz", this).call(this)){
                }
                return null;
            }
        }
    ]);
    return B;
}(A);
var i1;
for(var x1 in i1[42]){
}
var M1;
(function(M) {
    var X = function X() {
        "use strict";
        _classCallCheck(this, X);
    };
    M.X = X;
})(M1 || (M1 = {
}));
for(var x1 in M1){
}
for(var x1 in M1.X){
}
var Color1;
(function(Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Blue"] = 1] = "Blue";
})(Color1 || (Color1 = {
}));
for(var x1 in Color1){
}
for(var x1 in Color1.Blue){
}
