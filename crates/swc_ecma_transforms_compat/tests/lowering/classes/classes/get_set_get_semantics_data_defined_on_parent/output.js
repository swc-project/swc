let Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
Base.prototype.test = 1;
let Obj = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Obj, Base);
    function Obj() {
        _class_call_check(this, Obj);
        return _call_super(this, Obj, arguments);
    }
    _create_class(Obj, [
        {
            key: "get",
            value: function get() {
                return _get(_get_prototype_of(Obj.prototype), "test", this);
            }
        }
    ]);
    return Obj;
}(Base);
Obj.prototype.test = 2;
const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBe(1);
