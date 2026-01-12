//// [emitStatementsBeforeSuperCallWithDefineFields.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
class Base {
}
class Sub extends Base {
    // @ts-ignore
    constructor(p){
        console.log('hi');
        super(), this.p = p, _define_property(this, "p", void 0), _define_property(this, "field", 0);
    }
}
class Test extends Base {
    // @ts-ignore
    constructor(p){
        1;
        super(), this.p = p, _define_property(this, "p", void 0), _define_property(this, "prop", void 0);
        this.prop = 1;
    }
}
