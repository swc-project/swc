//// [typeOfThisInStaticMembers11.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
class C {
}
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
D = _ts_decorate([
    foo
], D);
class CC {
}
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
_define_property(DD, "e", super.a + DD.c + 1);
_define_property(DD, "f", ()=>DD.c + 1);
_define_property(DD, "ff", function() {
    this.c + 1;
});
