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
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @target: es3
// @filename: index.js
First.Item = function I() {
    "use strict";
    _classCallCheck(this, I);
};
Common.Object = /*#__PURE__*/ (function(_Item) {
    "use strict";
    _inherits(_class, _Item);
    function _class() {
        _classCallCheck(this, _class);
        return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
    }
    return _class;
})(First.Item);
Workspace.Object = /*#__PURE__*/ (function(_Object) {
    "use strict";
    _inherits(_class, _Object);
    function _class() {
        _classCallCheck(this, _class);
        return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
    }
    return _class;
})(Common.Object);
/** @type {Workspace.Object} */ var am;
// @filename: roots.js
var First = {
};
var Common = {
};
var Workspace = {
};
