let Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
Object.defineProperty(Base.prototype, 0, {
    value: 0,
    writable: true,
    configurable: true
});
Object.defineProperty(Base.prototype, 1, {
    value: 1,
    writable: true,
    configurable: true
});
let i = 0;
const proper = {
    get prop () {
        return i++;
    }
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
            key: "update",
            value: function update() {
                _update(_get_prototype_of(Obj.prototype), proper.prop, this, true)._++;
            }
        },
        {
            key: "update2",
            value: function update2() {
                _update(_get_prototype_of(Obj.prototype), i, this, true)._++;
            }
        }
    ]);
    return Obj;
}(Base);
const obj = new Obj();
obj.update();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(1);
obj.update2();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(2);
