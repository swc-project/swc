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
var A = // @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    A.test = function test() {
        var _instance;
        swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc).call(A);
        var func = swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc);
        func();
        new (swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc))();
        var arr = [
            1,
            2
        ];
        (_instance = swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc2)).call.apply(_instance, [
            A,
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ]));
        var b = swcHelpers.construct(swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc2), [
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ]));
        var str = swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc2).bind(A)(_templateObject(), 1, 2);
        swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)(_templateObject1(), 1, 2);
    };
    A.getClass = function getClass() {
        return A;
    };
    return A;
}();
var _fieldFunc = {
    get: get_fieldFunc,
    set: void 0
};
var _fieldFunc2 = {
    get: get_fieldFunc2,
    set: void 0
};
var _x = {
    writable: true,
    value: 1
};
function get_fieldFunc() {
    return function() {
        swcHelpers.classStaticPrivateFieldSpecSet(A, A, _x, 10);
    };
}
function get_fieldFunc2() {
    return function(a) {
        for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            b[_key - 1] = arguments[_key];
        }
    };
}
