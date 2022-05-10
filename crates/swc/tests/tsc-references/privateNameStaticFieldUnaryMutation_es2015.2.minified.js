import * as swcHelpers from "@swc/helpers";
class C {
    test() {
        for(swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value++, swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value--, ++swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value, --swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value, swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value++, swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value--, ++swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value, --swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value, swcHelpers.classStaticPrivateFieldSpecSet(this.getClass(), C, _test, 0); 10 > swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), C, _test); ++swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value);
        for(swcHelpers.classStaticPrivateFieldSpecSet(this.getClass(), C, _test, 0); 10 > swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), C, _test); swcHelpers.classStaticPrivateFieldUpdate(this.getClass(), C, _test).value++);
    }
    getClass() {
        return C;
    }
    constructor(){
        for(swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value++, swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value--, ++swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value, --swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value, swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value++, swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value--, ++swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value, --swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value, swcHelpers.classStaticPrivateFieldSpecSet(C, C, _test, 0); 10 > swcHelpers.classStaticPrivateFieldSpecGet(C, C, _test); ++swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value);
        for(swcHelpers.classStaticPrivateFieldSpecSet(C, C, _test, 0); 10 > swcHelpers.classStaticPrivateFieldSpecGet(C, C, _test); swcHelpers.classStaticPrivateFieldUpdate(C, C, _test).value++);
    }
}
var _test = {
    writable: !0,
    value: 24
};
