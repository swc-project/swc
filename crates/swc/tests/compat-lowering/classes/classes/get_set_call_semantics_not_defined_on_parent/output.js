let Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
let Obj = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Obj, Base);
    function Obj() {
        _class_call_check(this, Obj);
        return _call_super(this, Obj, arguments);
    }
    _create_class(Obj, [
        {
            key: "call",
            value: function call() {
                return _get(_get_prototype_of(Obj.prototype), "test", this).call(this);
            }
        },
        {
            key: "test",
            value: function test() {
                throw new Error("gobbledygook");
            }
        }
    ]);
    return Obj;
}(Base);
const obj = new Obj();
expect(()=>{
    obj.call();
// Asser that this throws, but that it's not
// Obj.p.test's error that is thrown
}).toThrowError(TypeError);
