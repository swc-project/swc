let Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    _create_class(Base, [
        {
            key: "test",
            get: function() {
                return 1;
            }
        }
    ]);
    return Base;
}();
;
let Obj = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Obj, Base);
    function Obj() {
        _class_call_check(this, Obj);
        return _call_super(this, Obj, arguments);
    }
    _create_class(Obj, [
        {
            key: "set",
            value: function set() {
                return _set(_get_prototype_of(Obj.prototype), "test", 3, this, true);
            }
        }
    ]);
    return Obj;
}(Base);
Object.defineProperty(Obj.prototype, 'test', {
    value: 2,
    writable: true,
    configurable: true
});
const obj = new Obj();
expect(()=>{
    // this requires helpers to be in file (not external), so they
    // are in "strict" mode code.
    obj.set();
}).toThrow();
expect(Base.prototype.test).toBe(1);
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(2);
