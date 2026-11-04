class A {
    #a;
    b() {
        this.#a || (this.#a = 1);
    }
    c(x) {
        var _x;
        (_x = x).#a || (_x.#a = 1);
    }
    log() {
        console.log(this.#a);
    }
}
const x = new A();
x.b();
x.log();
const y = new A();
y.c(y);
y.log();
