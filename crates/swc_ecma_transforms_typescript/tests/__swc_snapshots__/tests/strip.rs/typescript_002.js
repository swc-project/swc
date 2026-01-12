class A extends B {
    constructor(a, c, d = 1){
        super(), this.foo = 'foo', this.b = this.a, this.a = a, this.c = c, this.d = d;
        this.foo.subscribe();
    }
}
