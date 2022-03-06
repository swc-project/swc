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
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, null, [
        {
            key: "test",
            value: function() {
                swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc).call(A), swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc)(), new (swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc))();
                var _instance, arr = [
                    1,
                    2
                ];
                (_instance = swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc2)).call.apply(_instance, [
                    A,
                    0
                ].concat(swcHelpers.toConsumableArray(arr), [
                    3
                ])), swcHelpers.construct(swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc2), [
                    0
                ].concat(swcHelpers.toConsumableArray(arr), [
                    3
                ])), swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc2).bind(A)(_templateObject(), 1, 2), swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)(_templateObject1(), 1, 2);
            }
        },
        {
            key: "getClass",
            value: function() {
                return A;
            }
        }
    ]), A;
}(), _fieldFunc = {
    get: function() {
        return function() {
            swcHelpers.classStaticPrivateFieldSpecSet(A, A, _x, 10);
        };
    },
    set: void 0
}, _fieldFunc2 = {
    get: function() {
        return function(a) {
            for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)b[_key - 1] = arguments[_key];
        };
    },
    set: void 0
}, _x = {
    writable: !0,
    value: 1
};
