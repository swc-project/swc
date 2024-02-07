//// [typeOfThisInStaticMembers11.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
class C {
}
_define_property(C, "a", 1);
_define_property(C, "b", C.a + 1);
C = _ts_decorate([
    foo
], C);
class D extends C {
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
_define_property(D, "c", 2);
_define_property(D, "d", D.c + 1);
_define_property(D, "e", _get(_get_prototype_of(D), "a", D) + D.c + 1);
_define_property(D, "f", ()=>D.c + 1);
_define_property(D, "ff", function() {
    this.c + 1;
});
D = _ts_decorate([
    foo
], D);
class CC {
}
_define_property(CC, "a", 1);
_define_property(CC, "b", CC.a + 1);
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
_define_property(DD, "c", 2);
_define_property(DD, "d", DD.c + 1);
_define_property(DD, "e", _get(_get_prototype_of(DD), "a", DD) + DD.c + 1);
_define_property(DD, "f", ()=>DD.c + 1);
_define_property(DD, "ff", function() {
    this.c + 1;
});
