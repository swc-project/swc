class A {
    #a;
    b() {
        this.#a ||= 1;
    }
    c(x) {
        x.#a ||= 1;
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
