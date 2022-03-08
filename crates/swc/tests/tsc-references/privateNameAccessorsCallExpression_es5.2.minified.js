import * as swcHelpers from "@swc/helpers";
function _templateObject() {
    var data = swcHelpers.taggedTemplateLiteral([
        "head",
        "middle",
        "tail"
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = swcHelpers.taggedTemplateLiteral([
        "test",
        "and",
        ""
    ]);
    return _templateObject1 = function _templateObject1() {
        return data;
    }, data;
}
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap(), A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateFieldInit(this, _fieldFunc, {
            get: get_fieldFunc,
            set: void 0
        }), swcHelpers.classPrivateFieldInit(this, _fieldFunc2, {
            get: get_fieldFunc2,
            set: void 0
        }), this.x = 1;
    }
    var _proto = A.prototype;
    return _proto.test = function() {
        swcHelpers.classPrivateFieldGet(this, _fieldFunc).call(this), swcHelpers.classPrivateFieldGet(this, _fieldFunc)(), new (swcHelpers.classPrivateFieldGet(this, _fieldFunc))();
        var _instance, _ref, arr = [
            1,
            2
        ];
        (_instance = swcHelpers.classPrivateFieldGet(this, _fieldFunc2)).call.apply(_instance, [
            this,
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ])), swcHelpers.construct(swcHelpers.classPrivateFieldGet(this, _fieldFunc2), [
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ])), swcHelpers.classPrivateFieldGet(this, _fieldFunc2).bind(this)(_templateObject(), 1, 2), swcHelpers.classPrivateFieldGet(_ref = this.getInstance(), _fieldFunc2).bind(_ref)(_templateObject1(), 1, 2);
    }, _proto.getInstance = function() {
        return new A();
    }, A;
}();
function get_fieldFunc() {
    return function() {
        this.x = 10;
    };
}
function get_fieldFunc2() {
    return function(a) {
        for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)b[_key - 1] = arguments[_key];
    };
}
