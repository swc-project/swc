//// [typeOfThisInStaticMembers10.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap(), new WeakMap();
var __7 = new WeakMap(), __23 = new WeakMap(), __31 = new WeakMap(), __41 = new WeakMap(), __51 = new WeakMap();
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
__7.set(DD, {
    writable: !0,
    value: DD.c = 2
}), __23.set(DD, {
    writable: !0,
    value: DD.d = DD.c + 1
}), __31.set(DD, {
    writable: !0,
    value: DD.e = super.a + DD.c + 1
}), __41.set(DD, {
    writable: !0,
    value: DD.f = ()=>DD.c + 1
}), __51.set(DD, {
    writable: !0,
    value: DD.ff = function() {
        this.c;
    }
});
