const dec = ()=>{};
class A {
    #A = 1;
    static B = class B extends A {
        #___private_a = 2;
        get a() {
            return this.#___private_a;
        }
        set a(_v) {
            this.#___private_a = _v;
        }
        getA() {
            return this.#A;
        }
    };
}
