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
function _templateObject2() {
    var data = swcHelpers.taggedTemplateLiteral([
        "head",
        "middle",
        "tail"
    ]);
    _templateObject2 = function _templateObject2() {
        return data;
    };
    return data;
}
// @target: es2015
var AA = /*#__PURE__*/ function() {
    "use strict";
    function AA() {
        swcHelpers.classCallCheck(this, AA);
    }
    var _proto = AA.prototype;
    _proto.test = function test() {
        var _instance, _instance1;
        swcHelpers.classStaticPrivateMethodGet(AA, AA, method).call(AA);
        var func = swcHelpers.classStaticPrivateMethodGet(AA, AA, method);
        func();
        new (swcHelpers.classStaticPrivateMethodGet(AA, AA, method))();
        var arr = [
            1,
            2
        ];
        (_instance = swcHelpers.classStaticPrivateMethodGet(AA, AA, method2)).call.apply(_instance, [
            AA,
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ]));
        var b = swcHelpers.construct(swcHelpers.classStaticPrivateMethodGet(AA, AA, method2), [
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ])); //Error 
        var str = swcHelpers.classStaticPrivateMethodGet(AA, AA, method2).bind(AA)(_templateObject(), 1, 2);
        swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2).bind(AA)(_templateObject1(), 1, 2);
        (_instance1 = swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2)).call.apply(_instance1, [
            AA,
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ]));
        var b2 = swcHelpers.construct(swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2), [
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ])); //Error 
        var str2 = swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2).bind(AA)(_templateObject2(), 1, 2);
    };
    AA.getClass = function getClass() {
        return AA;
    };
    return AA;
}();
AA.x = 1;
function method() {
    this.x = 10;
}
function method2(a) {
    for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        b[_key - 1] = arguments[_key];
    }
}
