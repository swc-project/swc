import * as swcHelpers from "@swc/helpers";
function _templateObject() {
    var data = swcHelpers.taggedTemplateLiteral([
        "head",
        "middle",
        "tail"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = swcHelpers.taggedTemplateLiteral([
        "test",
        "and",
        ""
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
var _fieldFunc = /*#__PURE__*/ new WeakMap(), _fieldFunc2 = /*#__PURE__*/ new WeakMap();
// @target: es2015
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
        swcHelpers.classPrivateFieldInit(this, _fieldFunc, {
            get: get_fieldFunc,
            set: void 0
        });
        swcHelpers.classPrivateFieldInit(this, _fieldFunc2, {
            get: get_fieldFunc2,
            set: void 0
        });
        this.x = 1;
    }
    var _proto = A.prototype;
    _proto.test = function test() {
        var _instance;
        var _ref;
        swcHelpers.classPrivateFieldGet(this, _fieldFunc).call(this);
        var func = swcHelpers.classPrivateFieldGet(this, _fieldFunc);
        func();
        new (swcHelpers.classPrivateFieldGet(this, _fieldFunc))();
        var arr = [
            1,
            2
        ];
        (_instance = swcHelpers.classPrivateFieldGet(this, _fieldFunc2)).call.apply(_instance, [
            this,
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ]));
        var b = swcHelpers.construct(swcHelpers.classPrivateFieldGet(this, _fieldFunc2), [
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ]));
        var str = swcHelpers.classPrivateFieldGet(this, _fieldFunc2).bind(this)(_templateObject(), 1, 2);
        swcHelpers.classPrivateFieldGet(_ref = this.getInstance(), _fieldFunc2).bind(_ref)(_templateObject1(), 1, 2);
    };
    _proto.getInstance = function getInstance() {
        return new A();
    };
    return A;
}();
function get_fieldFunc() {
    return function() {
        this.x = 10;
    };
}
function get_fieldFunc2() {
    return function(a) {
        for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            b[_key - 1] = arguments[_key];
        }
    };
}
