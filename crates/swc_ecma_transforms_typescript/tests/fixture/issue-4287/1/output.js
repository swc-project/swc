var _a = /*#__PURE__*/ new WeakMap();
class C {
    constructor(){
        _classPrivateFieldInit(this, _a, {
            writable: true,
            value: 'a'
        });
        const a = ''; // Ok
        const b = 1; // Error
    }
}
