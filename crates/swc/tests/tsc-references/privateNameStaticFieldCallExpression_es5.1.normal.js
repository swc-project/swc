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
// @target: es2015
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
        this.x = 1;
    }
    var _proto = A.prototype;
    _proto.test = function test() {
        var _instance;
        var ref;
        swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc).call(A);
        (ref = swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc)) === null || ref === void 0 ? void 0 : ref.call(A);
        var func = swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc);
        func();
        new (swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc))();
        var arr = [
            1,
            2
        ];
        (_instance = swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc2)).call.apply(_instance, [
            A,
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ]));
        var b = swcHelpers.construct(swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc2), [
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ]));
        var str = swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc2).bind(A)(_templateObject(), 1, 2);
        swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)(_templateObject1(), 1, 2);
    };
    _proto.getClass = function getClass() {
        return A;
    };
    return A;
}();
var _fieldFunc = {
    writable: true,
    value: function value() {
        this.x = 10;
    }
};
var _fieldFunc2 = {
    writable: true,
    value: function value(a) {
        for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            b[_key - 1] = arguments[_key];
        }
    }
};
