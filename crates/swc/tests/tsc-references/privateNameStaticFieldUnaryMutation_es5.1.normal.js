import * as swcHelpers from "@swc/helpers";
// @target: es2015
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value++;
        swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value--;
        ++swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value;
        --swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value;
        var a = swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value++;
        var b = swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value--;
        var c = ++swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value;
        var d = --swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value;
        for(swcHelpers.classStaticPrivateFieldSpecSet(C, C, _test, 0); swcHelpers.classStaticPrivateFieldSpecGet(C, C, _test) < 10; ++swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value){}
        for(swcHelpers.classStaticPrivateFieldSpecSet(C, C, _test, 0); swcHelpers.classStaticPrivateFieldSpecGet(C, C, _test) < 10; swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value++){}
    }
    var _proto = C.prototype;
    _proto.test = function test() {
        swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value++;
        swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value--;
        ++swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value;
        --swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value;
        var a = swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value++;
        var b = swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value--;
        var c = ++swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value;
        var d = --swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value;
        for(swcHelpers.classStaticPrivateFieldSpecSet(this.getClass(), C, _test, 0); swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), C, _test) < 10; ++swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value){}
        for(swcHelpers.classStaticPrivateFieldSpecSet(this.getClass(), C, _test, 0); swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), C, _test) < 10; swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value++){}
    };
    _proto.getClass = function getClass() {
        return C;
    };
    return C;
}();
var _test = {
    writable: true,
    value: 24
};
