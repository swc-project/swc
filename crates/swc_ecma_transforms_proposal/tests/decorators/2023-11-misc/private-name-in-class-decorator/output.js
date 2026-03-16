let called = false;
class A {
    static #x() {
        called = true;
    }
    constructor(){
        let _dec, _initClass, _A;
        _dec = A.#x, _A = A;
        let _B, _B_member;
        new class extends _identity {
            constructor(){
                super(_B), _initClass(), _B_member = _B;
            }
            static [class B extends _A {
                static{
                    ({ c: [_B, _initClass] } = _apply_decs_2311(this, [
                        A,
                        _dec
                    ], [], 1, void 0, _A));
                }
            }];
            #x() {
                throw new Error("Should not be called");
            }
        }();
    }
}
new A();
expect(called).toBe(true);
