let called = false;
class A {
    static #x() {
        called = true;
    }
    constructor(){
        var _initClass, _A;
        let _B;
        new class extends _identity {
            constructor(){
                super(_B), _initClass();
            }
            static{
                class B extends (_A = A) {
                    static{
                        ({ c: [_B, _initClass] } = _apply_decs_2311(this, [
                            A,
                            A.#x
                        ], [], 1, void 0, _A));
                    }
                }
            }
            #x() {
                throw new Error("Should not be called");
            }
        }();
    }
}
new A();
expect(called).toBe(true);
