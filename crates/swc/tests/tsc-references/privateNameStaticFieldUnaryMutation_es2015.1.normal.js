import * as swcHelpers from "@swc/helpers";
// @target: es2015
class C {
    test() {
        swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value++;
        swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value--;
        ++swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value;
        --swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value;
        const a = swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value++;
        const b = swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value--;
        const c = ++swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value;
        const d = --swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value;
        for(swcHelpers.classStaticPrivateFieldSpecSet(this.getClass(), C, _test, 0); swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), C, _test) < 10; ++swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value){}
        for(swcHelpers.classStaticPrivateFieldSpecSet(this.getClass(), C, _test, 0); swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), C, _test) < 10; swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value++){}
    }
    getClass() {
        return C;
    }
    constructor(){
        swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value++;
        swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value--;
        ++swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value;
        --swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value;
        const a = swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value++;
        const b = swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value--;
        const c = ++swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value;
        const d = --swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value;
        for(swcHelpers.classStaticPrivateFieldSpecSet(C, C, _test, 0); swcHelpers.classStaticPrivateFieldSpecGet(C, C, _test) < 10; ++swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value){}
        for(swcHelpers.classStaticPrivateFieldSpecSet(C, C, _test, 0); swcHelpers.classStaticPrivateFieldSpecGet(C, C, _test) < 10; swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value++){}
    }
}
var _test = {
    writable: true,
    value: 24
};
