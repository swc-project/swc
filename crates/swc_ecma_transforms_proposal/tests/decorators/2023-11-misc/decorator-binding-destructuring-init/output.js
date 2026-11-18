let _initClass;
function init() {}
const { dec } = (globalThis.x = init(), {
    dec: init
});
let _C, _C_member;
class C {
    static{
        ({ c: [_C, _initClass] } = _apply_decs_2311(this, [
            dec
        ], []));
    }
    static{
        _initClass();
        _C_member = _C;
    }
}
