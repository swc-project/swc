class C {
    foo() {
        return this;
    }
    f1() {
        this.c = this.self;
        this.self = this.c; // Error
    }
    f2() {
        var a;
        var a = [
            this,
            this.c
        ]; // C[] since this is subtype of C
        var b;
        var b = [
            this,
            this.self,
            null,
            undefined
        ];
    }
    f3(b) {
        return b ? this.c : this.self; // Should be C
    }
    constructor(){
        this.self = this;
        this.c = new C();
    }
}
class D extends C {
    bar() {
        this.self = this.self1;
        this.self = this.self2;
        this.self = this.self3;
        this.self1 = this.self;
        this.self2 = this.self;
        this.self3 = this.self;
        this.d = this.self;
        this.d = this.c; // Error
        this.self = this.d; // Error
        this.c = this.d;
    }
    constructor(...args){
        super(...args);
        this.self1 = this;
        this.self2 = this.self;
        this.self3 = this.foo();
        this.d = new D();
    }
}
