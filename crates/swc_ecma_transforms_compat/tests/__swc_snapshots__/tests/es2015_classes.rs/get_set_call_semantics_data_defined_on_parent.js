let Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    _create_class(Base, [
        {
            key: "test",
            value: function test(...args) {
                expect(this).toBe(obj);
                expect(args).toEqual([
                    1,
                    2,
                    3
                ]);
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
            key: "call",
            value: function call() {
                _get(_get_prototype_of(Obj.prototype), "test", this).call(this, 1, 2, 3);
                _get(_get_prototype_of(Obj.prototype), "test", this).call(this, 1, ...[
                    2,
                    3
                ]);
                _get(_get_prototype_of(Obj.prototype), "test", this).call(this, ...[
                    1,
                    2,
                    3
                ]);
                return _get(_get_prototype_of(Obj.prototype), "test", this).apply(this, arguments);
            }
        },
        {
            key: "test",
            value: function test() {
                throw new Error("called");
            }
        }
    ]);
    return Obj;
}(Base);
const obj = new Obj();
expect(obj.call(1, 2, 3)).toBe(1);
