let called = false;
class A {
    constructor(){
        let _ref;
        var _B, _x, _class;
        let _dec, _initClass, _A;
        _dec = _class_static_private_method_get(A, A, x), _A = A;
        let _B1, _B_member;
        new (_x = /*#__PURE__*/ new WeakSet(), _ref = (_B = class B extends _A {
        }, { c: [_B1, _initClass] } = _apply_decs_2311(_B, [
            A,
            _dec
        ], [], 1, void 0, _A), _B), _class = class extends _identity {
            constructor(){
                super(_B1), _class_private_method_init(this, _x), _initClass(), _B_member = _B1;
            }
        }, _define_property(_class, _ref, void 0), _class)();
        function x1() {
            throw new Error("Should not be called");
        }
    }
}
function x() {
    called = true;
}
new A();
expect(called).toBe(true);
