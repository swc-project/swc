//// [typeOfThisInStaticMembers10.ts]
var _C, _D;
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
let C = ((_C = class {
}).a = 1, _C.b = _C.a + 1, _C);
C = _ts_decorate([
    foo
], C);
let D = ((_D = class extends C {
    static foo() {
        return this.c + 1;
    }
    static get fa() {
        return this.c + 1;
    }
    static set fa(v) {
        this.c = v + 1;
    }
}).c = 2, _D.d = _D.c + 1, _D.e = _get(_get_prototype_of(_D), "a", _D) + _D.c + 1, _D.f = ()=>_D.c + 1, _D.ff = function() {
    this.c;
}, _D);
D = _ts_decorate([
    foo
], D);
class CC {
}
CC.a = 1, CC.b = CC.a + 1;
class DD extends CC {
    static foo() {
        return this.c + 1;
    }
    static get fa() {
        return this.c + 1;
    }
    static set fa(v) {
        this.c = v + 1;
    }
}
DD.c = 2, DD.d = DD.c + 1, DD.e = _get(_get_prototype_of(DD), "a", DD) + DD.c + 1, DD.f = ()=>DD.c + 1, DD.ff = function() {
    this.c;
};
