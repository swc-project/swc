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
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
    }
    _createClass(A, [
        {
            key: "foo",
            value: function foo() {
            }
        }
    ]);
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _classCallCheck(this, B);
        return _possibleConstructorReturn(this, _getPrototypeOf(B).apply(this, arguments));
    }
    return B;
}(A);
var AA = /*#__PURE__*/ function() {
    "use strict";
    function AA() {
        _classCallCheck(this, AA);
    }
    _createClass(AA, [
        {
            key: "foo",
            value: function foo() {
            }
        }
    ]);
    return AA;
}();
var BB = /*#__PURE__*/ function(AA) {
    "use strict";
    _inherits(BB, AA);
    function BB() {
        _classCallCheck(this, BB);
        return _possibleConstructorReturn(this, _getPrototypeOf(BB).apply(this, arguments));
    }
    _createClass(BB, [
        {
            key: "bar",
            value: function bar() {
            }
        }
    ]);
    return BB;
}(AA);
var CC = /*#__PURE__*/ function(BB) {
    "use strict";
    _inherits(CC, BB);
    function CC() {
        _classCallCheck(this, CC);
        return _possibleConstructorReturn(this, _getPrototypeOf(CC).apply(this, arguments));
    }
    return CC;
} // error
(BB);
var DD = /*#__PURE__*/ function(BB) {
    "use strict";
    _inherits(DD, BB);
    function DD() {
        _classCallCheck(this, DD);
        return _possibleConstructorReturn(this, _getPrototypeOf(DD).apply(this, arguments));
    }
    _createClass(DD, [
        {
            key: "foo",
            value: function foo() {
            }
        }
    ]);
    return DD;
}(BB);
