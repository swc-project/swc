//// [typeOfThisInStaticMembers11.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
class C {
    static a = 1;
    static b = this.a + 1;
}
C = _ts_decorate([
    foo
], C);
class D extends C {
    static c = 2;
    static d = this.c + 1;
    static e = super.a + this.c + 1;
    static f = ()=>this.c + 1;
    static ff = function() {
        this.c + 1;
    };
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
    static a = 1;
    static b = this.a + 1;
}
class DD extends CC {
    static c = 2;
    static d = this.c + 1;
    static e = super.a + this.c + 1;
    static f = ()=>this.c + 1;
    static ff = function() {
        this.c + 1;
    };
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
