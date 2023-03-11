//// [typeOfThisInStaticMembers7.ts]
class C {
    static{
        this.a = 1;
    }
    static{
        this.b = this.a + 1;
    }
}
class D extends C {
    static{
        this.c = 2;
    }
    static{
        this.d = this.c + 1;
    }
    static{
        this.e = 1 + super.a + (this.c + 1) + 1;
    }
}
