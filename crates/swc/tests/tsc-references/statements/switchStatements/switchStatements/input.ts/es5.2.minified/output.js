function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var M, x, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
};
switch((M || (M = {
})).fn = function(x) {
    return "";
}, x){
    case "":
    case 12:
    case !0:
    case null:
    case void 0:
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
        "a"
    ]:
    case void 0 === x ? "undefined" : _typeof(x):
    case void 0 === M ? "undefined" : _typeof(M):
    case M.fn(1):
    case function(x) {
        return "";
    }:
    case "":
    default:
}
var C1 = function() {
    "use strict";
    _classCallCheck(this, C1);
}, D = function(C) {
    "use strict";
    !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(D, C);
    var _super = function(Derived) {
        var hasNativeReflectConstruct = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
                })), !0;
            } catch (e) {
                return !1;
            }
        }();
        return function() {
            var self, call, result, Super = _getPrototypeOf(Derived);
            if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
            } else result = Super.apply(this, arguments);
            return self = this, (call = result) && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
                if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self;
            })(self);
        };
    }(D);
    function D() {
        return _classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D;
}(C1);
switch(new C1()){
    case new D():
    case {
        id: 12,
        name: ""
    }:
    case new C1():
}
switch(""){
}
switch(12){
}
switch(!0){
}
switch(null){
}
switch(void 0){
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
    "a"
]){
}
switch(function(x) {
    return "";
}){
}
switch(""){
}
