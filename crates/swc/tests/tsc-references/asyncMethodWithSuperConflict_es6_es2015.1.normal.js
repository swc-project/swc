import * as swcHelpers from "@swc/helpers";
// @target: es6
class A {
    x() {}
    y() {}
}
class B extends A {
    // async method with only call/get on 'super' does not require a binding
    simple() {
        var _this = this, // call with property access
        _superprop_get_x = ()=>super.x, // call additional property.
        _superprop_get_y = ()=>super.y, // call with element access
        _superprop_get = (_prop)=>super[_prop];
        return swcHelpers.asyncToGenerator(function*() {
            const _super = null;
            const _superIndex = null;
            _superprop_get_x().call(_this);
            _superprop_get_y().call(_this);
            _superprop_get("x").call(_this);
            // property access (read)
            const a = _superprop_get_x();
            // element access (read)
            const b = _superprop_get("x");
        })();
    }
    // async method with assignment/destructuring on 'super' requires a binding
    advanced() {
        var _this = this, // call with property access
        _superprop_get_x = ()=>super.x, // call with element access
        _superprop_get = (_prop)=>super[_prop], // property access (assign)
        _superprop_set_x = (_value)=>super.x = _value, // element access (assign)
        _superprop_set = (_prop, _value)=>super[_prop] = _value;
        return swcHelpers.asyncToGenerator(function*() {
            const _super = null;
            const _superIndex = null;
            const f = ()=>{};
            _superprop_get_x().call(_this);
            _superprop_get("x").call(_this);
            // property access (read)
            const a = _superprop_get_x();
            // element access (read)
            const b = _superprop_get("x");
            _superprop_set_x(f);
            _superprop_set("x", f);
            // destructuring assign with property access
            ({ f: _superprop_get_x()  } = {
                f
            });
            // destructuring assign with element access
            ({ f: _superprop_get("x")  } = {
                f
            });
        })();
    }
}
