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
var AA = function() {
    "use strict";
    function AA() {
        swcHelpers.classCallCheck(this, AA);
    }
    return swcHelpers.createClass(AA, [
        {
            key: "test",
            value: function() {
                swcHelpers.classStaticPrivateMethodGet(AA, AA, method).call(AA), swcHelpers.classStaticPrivateMethodGet(AA, AA, method)(), new (swcHelpers.classStaticPrivateMethodGet(AA, AA, method))();
                var _instance, _instance1, arr = [
                    1,
                    2
                ];
                (_instance = swcHelpers.classStaticPrivateMethodGet(AA, AA, method2)).call.apply(_instance, [
                    AA,
                    0
                ].concat(swcHelpers.toConsumableArray(arr), [
                    3
                ])), swcHelpers.construct(swcHelpers.classStaticPrivateMethodGet(AA, AA, method2), [
                    0
                ].concat(swcHelpers.toConsumableArray(arr), [
                    3
                ])), swcHelpers.classStaticPrivateMethodGet(AA, AA, method2).bind(AA)(_templateObject(), 1, 2), swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2).bind(AA)(_templateObject1(), 1, 2), (_instance1 = swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2)).call.apply(_instance1, [
                    AA,
                    0
                ].concat(swcHelpers.toConsumableArray(arr), [
                    3
                ])), swcHelpers.construct(swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2), [
                    0
                ].concat(swcHelpers.toConsumableArray(arr), [
                    3
                ])), swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2).bind(AA)(_templateObject2(), 1, 2);
            }
        }
    ], [
        {
            key: "getClass",
            value: function() {
                return AA;
            }
        }
    ]), AA;
}();
function method() {
    this.x = 10;
}
function method2(a) {
    for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)b[_key - 1] = arguments[_key];
}
AA.x = 1;
