//// [typeOfThisInStaticMembers10.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
class C {
    static{
        this.a = 1;
    }
    static{
        this.b = this.a + 1;
    }
}
C = _ts_decorate([
    foo
], C);
class D extends C {
    static{
        this.c = 2;
    }
    static{
        this.d = this.c + 1;
    }
    static{
        this.e = super.a + this.c + 1;
    }
    static{
        this.f = ()=>this.c + 1;
    }
    static{
        this.ff = function() {
            this.c;
        };
    }
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
    static{
        this.a = 1;
    }
    static{
        this.b = this.a + 1;
    }
}
class DD extends CC {
    static{
        this.c = 2;
    }
    static{
        this.d = this.c + 1;
    }
    static{
        this.e = super.a + this.c + 1;
    }
    static{
        this.f = ()=>this.c + 1;
    }
    static{
        this.ff = function() {
            this.c;
        };
    }
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
