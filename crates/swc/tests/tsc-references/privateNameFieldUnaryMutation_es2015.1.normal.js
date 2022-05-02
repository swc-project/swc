import * as swcHelpers from "@swc/helpers";
var _test = /*#__PURE__*/ new WeakMap();
// @target: es2015
class C {
    test() {
        var _ref, _ref1;
        swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value++;
        swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value--;
        ++swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value;
        --swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value;
        const a = swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value++;
        const b = swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value--;
        const c = ++swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value;
        const d = --swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value;
        for(swcHelpers.classPrivateFieldSet(this.getInstance(), _test, 0); swcHelpers.classPrivateFieldGet(_ref = this.getInstance(), _test) < 10; ++swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value){}
        for(swcHelpers.classPrivateFieldSet(this.getInstance(), _test, 0); swcHelpers.classPrivateFieldGet(_ref1 = this.getInstance(), _test) < 10; swcHelpers.classPrivateFieldUpdate(this.getInstance(), _test).value++){}
    }
    getInstance() {
        return new C();
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _test, {
            writable: true,
            value: 24
        });
        swcHelpers.classPrivateFieldUpdate(this, _test).value++;
        swcHelpers.classPrivateFieldUpdate(this, _test).value--;
        ++swcHelpers.classPrivateFieldUpdate(this, _test).value;
        --swcHelpers.classPrivateFieldUpdate(this, _test).value;
        const a = swcHelpers.classPrivateFieldUpdate(this, _test).value++;
        const b = swcHelpers.classPrivateFieldUpdate(this, _test).value--;
        const c = ++swcHelpers.classPrivateFieldUpdate(this, _test).value;
        const d = --swcHelpers.classPrivateFieldUpdate(this, _test).value;
        for(swcHelpers.classPrivateFieldSet(this, _test, 0); swcHelpers.classPrivateFieldGet(this, _test) < 10; ++swcHelpers.classPrivateFieldUpdate(this, _test).value){}
        for(swcHelpers.classPrivateFieldSet(this, _test, 0); swcHelpers.classPrivateFieldGet(this, _test) < 10; swcHelpers.classPrivateFieldUpdate(this, _test).value++){}
    }
}
