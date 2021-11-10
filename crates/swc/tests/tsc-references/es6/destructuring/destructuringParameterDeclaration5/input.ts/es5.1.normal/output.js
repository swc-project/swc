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
var Class = function Class() {
    "use strict";
    _classCallCheck(this, Class);
};
var SubClass = /*#__PURE__*/ function(Class) {
    "use strict";
    _inherits(SubClass, Class);
    var _super = _createSuper(SubClass);
    function SubClass() {
        _classCallCheck(this, SubClass);
        return _super.call(this);
    }
    return SubClass;
}(Class);
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
};
var SubD = /*#__PURE__*/ function(D) {
    "use strict";
    _inherits(SubD, D);
    var _super = _createSuper(SubD);
    function SubD() {
        _classCallCheck(this, SubD);
        return _super.call(this);
    }
    return SubD;
}(D);
function d0(param) {
    var x = (param === void 0 ? {
        x: new Class()
    } : param).x;
}
function d1(param) {
    var x = param.x;
}
function d2(param) {
    var x = param.x;
}
function d3(param) {
    var y = param.y;
}
function d4(param) {
    var y = (param === void 0 ? {
        y: new D()
    } : param).y;
}
var obj1 = new Class();
d0({
    x: 1
});
d0({
    x: {
    }
});
d0({
    x: "string"
});
d1({
    x: new Class()
});
d1({
    x: {
    }
});
d1({
    x: "string"
});
d2({
    x: new SubClass()
});
d2({
    x: {
    }
});
d3({
    y: new SubD()
});
d3({
    y: new SubClass()
});
// Error
d3({
    y: new Class()
});
d3({
});
d3({
    y: 1
});
d3({
    y: "world"
});
