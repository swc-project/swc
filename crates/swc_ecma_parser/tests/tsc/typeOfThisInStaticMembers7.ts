// @target: esnext, es2022, es6, es5

class C {
    static a = 1;
    static b = this.a + 1;
}

class D extends C {
    static c = 2;
    static d = this.c + 1;
    static e = 1 + (super.a) + (this.c + 1) + 1;
}
