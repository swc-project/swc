import * as swcHelpers from "@swc/helpers";
// @target: ES6
// @lib: esnext
// @noEmitHelpers: true
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
            // property access in arrow
            (()=>_superprop_get_x().call(_this));
            // element access in arrow
            (()=>_superprop_get("x").call(_this));
            // property access in async arrow
            swcHelpers.asyncToGenerator(function*() {
                return _superprop_get_x().call(_this);
            });
            // element access in async arrow
            swcHelpers.asyncToGenerator(function*() {
                return _superprop_get("x").call(_this);
            });
        })();
    }
    property_access_only_read_only() {
        var _this = this, // call with property access
        _superprop_get_x = ()=>super.x;
        return swcHelpers.asyncToGenerator(function*() {
            _superprop_get_x().call(_this);
            // property access (read)
            const a = _superprop_get_x();
            // property access in arrow
            (()=>_superprop_get_x().call(_this));
            // property access in async arrow
            swcHelpers.asyncToGenerator(function*() {
                return _superprop_get_x().call(_this);
            });
        })();
    }
    property_access_only_write_only() {
        var _superprop_get_x = ()=>super.x, // property access (assign)
        _superprop_set_x = (_value)=>super.x = _value;
        return swcHelpers.asyncToGenerator(function*() {
            const f = ()=>{};
            _superprop_set_x(f);
            // destructuring assign with property access
            ({ f: _superprop_get_x()  } = {
                f
            });
            // property access (assign) in arrow
            (()=>_superprop_set_x(f));
            // property access (assign) in async arrow
            swcHelpers.asyncToGenerator(function*() {
                return _superprop_set_x(f);
            });
        })();
    }
    element_access_only_read_only() {
        var _this = this, // call with element access
        _superprop_get = (_prop)=>super[_prop];
        return swcHelpers.asyncToGenerator(function*() {
            _superprop_get("x").call(_this);
            // element access (read)
            const a = _superprop_get("x");
            // element access in arrow
            (()=>_superprop_get("x").call(_this));
            // element access in async arrow
            swcHelpers.asyncToGenerator(function*() {
                return _superprop_get("x").call(_this);
            });
        })();
    }
    element_access_only_write_only() {
        var _superprop_get = (_prop)=>super[_prop], // element access (assign)
        _superprop_set = (_prop, _value)=>super[_prop] = _value;
        return swcHelpers.asyncToGenerator(function*() {
            const f = ()=>{};
            _superprop_set("x", f);
            // destructuring assign with element access
            ({ f: _superprop_get("x")  } = {
                f
            });
            // element access (assign) in arrow
            (()=>_superprop_set("x", f));
            // element access (assign) in async arrow
            swcHelpers.asyncToGenerator(function*() {
                return _superprop_set("x", f);
            });
        })();
    }
    property_access_only_read_only_in_generator() {
        var _this = this, // call with property access
        _superprop_get_x = ()=>super.x;
        return swcHelpers.wrapAsyncGenerator(function*() {
            _superprop_get_x().call(_this);
            // property access (read)
            const a = _superprop_get_x();
            // property access in arrow
            (()=>_superprop_get_x().call(_this));
            // property access in async arrow
            swcHelpers.asyncToGenerator(function*() {
                return _superprop_get_x().call(_this);
            });
        })();
    }
    property_access_only_write_only_in_generator() {
        var _superprop_get_x = ()=>super.x, // property access (assign)
        _superprop_set_x = (_value)=>super.x = _value;
        return swcHelpers.wrapAsyncGenerator(function*() {
            const f = ()=>{};
            _superprop_set_x(f);
            // destructuring assign with property access
            ({ f: _superprop_get_x()  } = {
                f
            });
            // property access (assign) in arrow
            (()=>_superprop_set_x(f));
            // property access (assign) in async arrow
            swcHelpers.asyncToGenerator(function*() {
                return _superprop_set_x(f);
            });
        })();
    }
    element_access_only_read_only_in_generator() {
        var _this = this, // call with element access
        _superprop_get = (_prop)=>super[_prop];
        return swcHelpers.wrapAsyncGenerator(function*() {
            _superprop_get("x").call(_this);
            // element access (read)
            const a = _superprop_get("x");
            // element access in arrow
            (()=>_superprop_get("x").call(_this));
            // element access in async arrow
            swcHelpers.asyncToGenerator(function*() {
                return _superprop_get("x").call(_this);
            });
        })();
    }
    element_access_only_write_only_in_generator() {
        var _superprop_get = (_prop)=>super[_prop], // element access (assign)
        _superprop_set = (_prop, _value)=>super[_prop] = _value;
        return swcHelpers.wrapAsyncGenerator(function*() {
            const f = ()=>{};
            _superprop_set("x", f);
            // destructuring assign with element access
            ({ f: _superprop_get("x")  } = {
                f
            });
            // element access (assign) in arrow
            (()=>_superprop_set("x", f));
            // element access (assign) in async arrow
            swcHelpers.asyncToGenerator(function*() {
                return _superprop_set("x", f);
            });
        })();
    }
}
