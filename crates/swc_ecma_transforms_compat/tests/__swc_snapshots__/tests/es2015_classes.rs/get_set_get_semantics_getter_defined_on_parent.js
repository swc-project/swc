let Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    _create_class(Base, [
        {
            key: "test",
            get: function() {
                expect(this).toBe(obj);
                return 1;
            }
        }
    ]);
    return Base;
}();
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
            key: "get",
            value: function get() {
                return _get(_get_prototype_of(Obj.prototype), "test", this);
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
expect(obj.test).toBe(2);
expect(obj.get()).toBe(1);
