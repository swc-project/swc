import * as swcHelpers from "@swc/helpers";
var _test = new WeakMap(), C = function() {
    "use strict";
    function C() {
        for(swcHelpers.classCallCheck(this, C), swcHelpers.classPrivateFieldInit(this, _test, {
            writable: !0,
            value: 24
        }), swcHelpers.classPrivateFieldUpdate(this, _test).value++, swcHelpers.classPrivateFieldUpdate(this, _test).value--, ++swcHelpers.classPrivateFieldUpdate(this, _test).value, --swcHelpers.classPrivateFieldUpdate(this, _test).value, swcHelpers.classPrivateFieldUpdate(this, _test).value++, swcHelpers.classPrivateFieldUpdate(this, _test).value--, ++swcHelpers.classPrivateFieldUpdate(this, _test).value, --swcHelpers.classPrivateFieldUpdate(this, _test).value, swcHelpers.classPrivateFieldSet(this, _test, 0); 10 > swcHelpers.classPrivateFieldGet(this, _test); ++swcHelpers.classPrivateFieldUpdate(this, _test).value);
        for(swcHelpers.classPrivateFieldSet(this, _test, 0); 10 > swcHelpers.classPrivateFieldGet(this, _test); swcHelpers.classPrivateFieldUpdate(this, _test).value++);
    }
    var _proto = C.prototype;
    return _proto.test = function() {
        for(swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value++, swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value--, ++swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value, --swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value, swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value++, swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value--, ++swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value, --swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value, swcHelpers.classPrivateFieldSet(this.getInstance(), _test, 0); 10 > swcHelpers.classPrivateFieldGet(this.getInstance(), _test); ++swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value);
        for(swcHelpers.classPrivateFieldSet(this.getInstance(), _test, 0); 10 > swcHelpers.classPrivateFieldGet(this.getInstance(), _test); swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value++);
    }, _proto.getInstance = function() {
        return new C();
    }, C;
}();
