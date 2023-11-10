let Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
let Obj = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Obj, Base);
    var _super = _create_super(Obj);
    function Obj() {
        _class_call_check(this, Obj);
        return _super.apply(this, arguments);
    }
    _create_class(Obj, [
        {
            key: "test",
            get: function() {}
        },
        {
            key: "set",
            value: function set() {
                return _set(_get_prototype_of(Obj.prototype), "test", 3, this, true);
            }
        }
    ]);
    return Obj;
}(Base);
const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(obj.test).toBe(3);
