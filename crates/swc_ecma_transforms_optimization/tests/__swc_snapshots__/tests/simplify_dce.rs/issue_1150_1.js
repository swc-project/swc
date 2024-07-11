class A {
    constructor(o = {}){
        const { a = defaultA, c } = o;
        this.#a = a;
        this.#c = c;
    }
    a() {
        this.#a();
    }
    c() {
        console.log(this.#c);
    }
}
new A();
