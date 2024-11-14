const dec = ()=>{};
class A {
    #A = 1;
    static B = class B extends A {
        #_private_a_1 = 2;
        get a() {
            return this.#_private_a_1;
        }
        set a(_v) {
            this.#_private_a_1 = _v;
        }
        getA() {
            return this.#A;
        }
    };
}
