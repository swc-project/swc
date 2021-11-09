"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.App = App;
var _react = _interopRequireDefault(require("react"));
var _reactI18N = require("@shopify/react-i18n");
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function App() {
    var ref = _slicedToArray((0, _reactI18N).useI18n(), 1), i18n = ref[0];
    return(/*#__PURE__*/ _react.default.createElement("h1", null, i18n.translate("foo")));
}
