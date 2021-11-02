function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
function _get(target, property, receiver) {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (base) {
            var desc = Object.getOwnPropertyDescriptor(base, property);
            return desc.get ? desc.get.call(receiver) : desc.value;
        }
    }, _get(target, property, receiver || target);
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
function _superPropBase(object, property) {
    for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)););
    return object;
}
for(aNumber in {
});
for(aBoolean in {
});
for(aRegExp in {
});
for(var idx in {
});
function fn() {
}
for(var x1 in fn());
for(var x1 in c || d);
for(var x1 in e ? c : d);
for(var x1 in c);
for(var x1 in d);
for(var x1 in d[x1]);
for(var x1 in c[23]);
for(var x1 in function(x) {
    return x;
});
for(var x1 in function(x, y) {
    return x + y;
});
var aNumber, aBoolean, aRegExp, c, d, e, i1, A = function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
    }
    return _createClass(A, [
        {
            key: "biz",
            value: function() {
                for(var x in this.biz());
                for(var x in this.biz);
                for(var x in this);
                return null;
            }
        }
    ], [
        {
            key: "baz",
            value: function() {
                for(var x in this);
                for(var x in this.baz);
                for(var x in this.baz());
                return null;
            }
        }
    ]), A;
}(), B = function(A) {
    "use strict";
    function B() {
        var self, call, obj;
        return _classCallCheck(this, B), self = this, call = _getPrototypeOf(B).apply(this, arguments), call && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        })(self);
    }
    return !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(B, A), _createClass(B, [
        {
            key: "boz",
            value: function() {
                for(var x in this.biz());
                for(var x in this.biz);
                for(var x in this);
                for(var x in _get(_getPrototypeOf(B.prototype), "biz", this));
                for(var x in _get(_getPrototypeOf(B.prototype), "biz", this).call(this));
                return null;
            }
        }
    ]), B;
}(A);
for(var x1 in i1[42]);
