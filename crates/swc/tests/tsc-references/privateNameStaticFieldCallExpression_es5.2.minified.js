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
        swcHelpers.classCallCheck(this, A), this.x = 1;
    }
    var _proto = A.prototype;
    return _proto.test = function() {
        swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc).call(A), null === (ref = swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc)) || void 0 === ref || ref.call(A), swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc)(), new (swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc))();
        var _instance, ref, arr = [
            1,
            2
        ];
        (_instance = swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc2)).call.apply(_instance, [
            A,
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ])), swcHelpers.construct(swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc2), [
            0
        ].concat(swcHelpers.toConsumableArray(arr), [
            3
        ])), swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc2).bind(A)(_templateObject(), 1, 2), swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)(_templateObject1(), 1, 2);
    }, _proto.getClass = function() {
        return A;
    }, A;
}(), _fieldFunc = {
    writable: !0,
    value: function() {
        this.x = 10;
    }
}, _fieldFunc2 = {
    writable: !0,
    value: function(a) {
        for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)b[_key - 1] = arguments[_key];
    }
};
