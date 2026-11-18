let _dec, _initClass;
function dec() {}
_dec = (globalThis.x = dec, globalThis.x);
let _A, _A_member;
class A {
    static{
        ({ c: [_A, _initClass] } = _apply_decs_2311(this, [
            _dec
        ], []));
    }
    static{
        _initClass();
        _A_member = _A;
    }
}
