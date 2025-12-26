//// [typeOfThisInStaticMembers10.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
class C {
}
C.a = 1;
C.b = C.a + 1;
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
D.c = 2;
D.d = D.c + 1;
D.e = _get(_get_prototype_of(D), "a", D) + D.c + 1;
D.f = ()=>D.c + 1;
D.ff = function() {
    this.c + 1;
};
D = _ts_decorate([
    foo
], D);
class CC {
}
CC.a = 1;
CC.b = CC.a + 1;
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
DD.c = 2;
DD.d = DD.c + 1;
DD.e = _get(_get_prototype_of(DD), "a", DD) + DD.c + 1;
DD.f = ()=>DD.c + 1;
DD.ff = function() {
    this.c + 1;
};
