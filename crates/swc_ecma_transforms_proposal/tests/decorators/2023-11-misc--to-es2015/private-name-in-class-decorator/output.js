let called = false;
class A {
    constructor(){
        var _x, _class;
        var _initClass, _A;
        let _B;
        new (_x = /*#__PURE__*/ new WeakSet(), _class = class extends _identity {
            constructor(){
                super(_B), _class_private_method_init(this, _x), _initClass();
            }
        }, (()=>{
            class B extends (_A = A) {
            }
            ({ c: [_B, _initClass] } = _apply_decs_2311(B, [
                A,
                _class_private_method_get(A, _x, x)
            ], [], 1, void 0, _A));
        })(), _class)();
        function x() {
            throw new Error("Should not be called");
        }
    }
}
function x() {
    called = true;
}
new A();
expect(called).toBe(true);
