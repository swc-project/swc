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
function _templateObject2() {
    var data = swcHelpers.taggedTemplateLiteral([
        "head",
        "middle",
        "tail"
    ]);
    return _templateObject2 = function _templateObject2() {
        return data;
    }, data;
}
var _method = new WeakSet(), _method2 = new WeakSet(), AA = function() {
    "use strict";
    function AA() {
        swcHelpers.classCallCheck(this, AA), swcHelpers.classPrivateMethodInit(this, _method), swcHelpers.classPrivateMethodInit(this, _method2), this.x = 1;
    }
    var _proto = AA.prototype;
    return _proto.test = function() {
        swcHelpers.classPrivateMethodGet(this, _method, method).call(this), swcHelpers.classPrivateMethodGet(this, _method, method)(), new (swcHelpers.classPrivateMethodGet(this, _method, method))();
        var _instance, _instance1, _ref, _ref1, _ref2, arr = [
            1,
            2
        ];
        (_instance = swcHelpers.classPrivateMethodGet(this, _method2, method2)).call.apply(_instance, [
            this,
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ])), swcHelpers.construct(swcHelpers.classPrivateMethodGet(this, _method2, method2), [
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ])), swcHelpers.classPrivateMethodGet(this, _method2, method2).bind(this)(_templateObject(), 1, 2), swcHelpers.classPrivateMethodGet(_ref = this.getInstance(), _method2, method2).bind(_ref)(_templateObject1(), 1, 2), (_instance1 = swcHelpers.classPrivateMethodGet(_ref1 = this.getInstance(), _method2, method2)).call.apply(_instance1, [
            _ref1,
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ])), swcHelpers.construct(swcHelpers.classPrivateMethodGet(this.getInstance(), _method2, method2), [
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ])), swcHelpers.classPrivateMethodGet(_ref2 = this.getInstance(), _method2, method2).bind(_ref2)(_templateObject2(), 1, 2);
    }, _proto.getInstance = function() {
        return new AA();
    }, AA;
}();
function method() {
    this.x = 10;
}
function method2(a) {
    for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)b[_key - 1] = arguments[_key];
}
