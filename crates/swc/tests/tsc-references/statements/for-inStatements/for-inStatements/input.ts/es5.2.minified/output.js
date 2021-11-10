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
for(aString in {
});
for(anAny in {
});
for(var x1 in {
});
for(var x1 in []);
for(var x1 in [
    1,
    2,
    3,
    4,
    5
]);
function fn() {
}
for(var x1 in fn());
for(var x1 in /[a-z]/);
for(var x1 in new Date());
for(var x1 in c || d);
for(var x1 in e ? c : d);
for(var x1 in c);
for(var x1 in d);
for(var x1 in d[x1]);
for(var x1 in c[d]);
for(var x1 in function(x) {
    return x;
});
for(var x1 in function(x, y) {
    return x + y;
});
var Color, aString, anAny, c, d, e, i1, M1, Color1, A = function() {
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
    !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(B, A);
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
            var obj, self, call, result, Super = _getPrototypeOf(Derived);
            if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
            } else result = Super.apply(this, arguments);
            return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
                if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self;
            })(self);
        };
    }(B);
    function B() {
        return _classCallCheck(this, B), _super.apply(this, arguments);
    }
    return _createClass(B, [
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
for(var x1 in !function(M) {
    var X = function() {
        "use strict";
        _classCallCheck(this, X);
    };
    M.X = X;
}(M1 || (M1 = {
})), M1);
for(var x1 in M1.X);
for(var x1 in (Color = Color1 || (Color1 = {
}))[Color.Red = 0] = "Red", Color[Color.Blue = 1] = "Blue", Color1);
for(var x1 in Color1.Blue);
