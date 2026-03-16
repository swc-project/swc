const dec = ()=>{};
class A {
    #A = 1;
    static B = class B extends A {
        #___private_a_1 = 2;
        get a() {
            return this.#___private_a_1;
        }
        set a(_v) {
            this.#___private_a_1 = _v;
        }
        getA() {
            return this.#A;
        }
    };
}
