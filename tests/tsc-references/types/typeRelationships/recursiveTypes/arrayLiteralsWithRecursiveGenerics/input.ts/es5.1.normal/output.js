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
var List = function List() {
    "use strict";
    _classCallCheck(this, List);
};
var DerivedList = /*#__PURE__*/ function(List) {
    "use strict";
    _inherits(DerivedList, List);
    function DerivedList() {
        _classCallCheck(this, DerivedList);
        return _possibleConstructorReturn(this, _getPrototypeOf(DerivedList).apply(this, arguments));
    }
    return DerivedList;
}(List);
var MyList = function MyList() {
    "use strict";
    _classCallCheck(this, MyList);
};
var list;
var list2;
var myList;
var xs = [
    list,
    myList
]; // {}[]
var ys = [
    list,
    list2
]; // {}[]
var zs = [
    list,
    null
]; // List<number>[]
var myDerivedList;
var as = [
    list,
    myDerivedList
]; // List<number>[]
