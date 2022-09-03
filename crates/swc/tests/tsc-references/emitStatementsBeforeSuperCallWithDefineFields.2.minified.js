//// [emitStatementsBeforeSuperCallWithDefineFields.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
class Base {
}
class Sub extends Base {
    constructor(p){
        console.log('hi'), super(), _define_property(this, "field", void 0), _define_property(this, "p", void 0), this.p = p, this.field = 0;
    }
}
class Test extends Base {
    constructor(p){
        super(), _define_property(this, "prop", void 0), _define_property(this, "p", void 0), this.p = p, this.prop = 1;
    }
}
