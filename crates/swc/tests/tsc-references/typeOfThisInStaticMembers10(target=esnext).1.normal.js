//// [typeOfThisInStaticMembers10.ts]
@foo
class C {
    static{
        this.a = 1;
    }
    static{
        this.b = this.a + 1;
    }
}
@foo
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
            this.c + 1;
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
            this.c + 1;
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
