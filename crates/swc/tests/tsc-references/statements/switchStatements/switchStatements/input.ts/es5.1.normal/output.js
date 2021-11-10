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
var M1;
(function(M) {
    var fn = function fn(x) {
        return '';
    };
    M.fn = fn;
})(M1 || (M1 = {
}));
var x;
switch(x){
    case '':
    case 12:
    case true:
    case null:
    case undefined:
    case new Date(12):
    case new Object():
    case /[a-z]/:
    case []:
    case {
    }:
    case {
        id: 12
    }:
    case [
        'a'
    ]:
    case typeof x === "undefined" ? "undefined" : _typeof(x):
    case typeof M1 === "undefined" ? "undefined" : _typeof(M1):
    case M1.fn(1):
    case function(x) {
        return '';
    }:
    case (function(x) {
        return '';
    })(2):
    default:
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _createSuper(D);
    function D() {
        _classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
switch(new C()){
    case new D():
    case {
        id: 12,
        name: ''
    }:
    case new C():
}
switch(''){
}
switch(12){
}
switch(true){
}
switch(null){
}
switch(undefined){
}
switch(new Date(12)){
}
switch(new Object()){
}
switch(/[a-z]/){
}
switch([]){
}
switch({
}){
}
switch({
    id: 12
}){
}
switch([
    'a'
]){
}
switch(function(x) {
    return '';
}){
}
switch((function(x) {
    return '';
})(1)){
}
