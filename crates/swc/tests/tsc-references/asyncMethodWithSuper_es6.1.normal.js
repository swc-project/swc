//// [asyncMethodWithSuper_es6.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
class A {
    x() {}
    y() {}
}
class B extends A {
    // async method with only call/get on 'super' does not require a binding
    simple() {
        var _this = this, _superprop_get_x = ()=>super.x, _superprop_get_y = ()=>super.y, _superprop_get = (_prop)=>super[_prop];
        return _async_to_generator(function*() {
            // call with property access
            _superprop_get_x().call(_this);
            // call additional property.
            _superprop_get_y().call(_this);
            // call with element access
            _superprop_get("x").call(_this);
            // property access (read)
            const a = _superprop_get_x();
            // element access (read)
            const b = _superprop_get("x");
        })();
    }
    // async method with assignment/destructuring on 'super' requires a binding
    advanced() {
        var _this = this, _superprop_update_x = {
            get _ () {
                return _superprop_get_x();
            },
            set _ (v){
                _superprop_set_x(v);
            }
        }, _superprop_update = (_prop)=>({
                get _ () {
                    return _superprop_get(_prop);
                },
                set _ (v){
                    return _superprop_set(_prop, v);
                }
            }), _superprop_get_x = ()=>super.x, _superprop_get = (_prop)=>super[_prop], _superprop_set_x = (_value)=>super.x = _value, _superprop_set = (_prop, _value)=>super[_prop] = _value;
        return _async_to_generator(function*() {
            const f = ()=>{};
            // call with property access
            _superprop_get_x().call(_this);
            // call with element access
            _superprop_get("x").call(_this);
            // property access (read)
            const a = _superprop_get_x();
            // element access (read)
            const b = _superprop_get("x");
            // property access (assign)
            _superprop_set_x(f);
            // element access (assign)
            _superprop_set("x", f);
            // destructuring assign with property access
            ({ f: _superprop_update_x._  } = {
                f
            });
            // destructuring assign with element access
            ({ f: _superprop_update("x")._  } = {
                f
            });
            // property access in arrow
            (()=>_superprop_get_x().call(_this));
            // element access in arrow
            (()=>_superprop_get("x").call(_this));
            /*#__PURE__*/ // property access in async arrow
            _async_to_generator(function*() {
                return _superprop_get_x().call(_this);
            });
            /*#__PURE__*/ // element access in async arrow
            _async_to_generator(function*() {
                return _superprop_get("x").call(_this);
            });
        })();
    }
    property_access_only_read_only() {
        var _this = this, _superprop_get_x = ()=>super.x;
        return _async_to_generator(function*() {
            // call with property access
            _superprop_get_x().call(_this);
            // property access (read)
            const a = _superprop_get_x();
            // property access in arrow
            (()=>_superprop_get_x().call(_this));
            /*#__PURE__*/ // property access in async arrow
            _async_to_generator(function*() {
                return _superprop_get_x().call(_this);
            });
        })();
    }
    property_access_only_write_only() {
        var _superprop_update_x = {
            get _ () {
                return _superprop_get_x();
            },
            set _ (v){
                _superprop_set_x(v);
            }
        }, _superprop_get_x = ()=>super.x, _superprop_set_x = (_value)=>super.x = _value;
        return _async_to_generator(function*() {
            const f = ()=>{};
            // property access (assign)
            _superprop_set_x(f);
            // destructuring assign with property access
            ({ f: _superprop_update_x._  } = {
                f
            });
            // property access (assign) in arrow
            (()=>_superprop_set_x(f));
            /*#__PURE__*/ // property access (assign) in async arrow
            _async_to_generator(function*() {
                return _superprop_set_x(f);
            });
        })();
    }
    element_access_only_read_only() {
        var _this = this, _superprop_get = (_prop)=>super[_prop];
        return _async_to_generator(function*() {
            // call with element access
            _superprop_get("x").call(_this);
            // element access (read)
            const a = _superprop_get("x");
            // element access in arrow
            (()=>_superprop_get("x").call(_this));
            /*#__PURE__*/ // element access in async arrow
            _async_to_generator(function*() {
                return _superprop_get("x").call(_this);
            });
        })();
    }
    element_access_only_write_only() {
        var _superprop_update = (_prop)=>({
                get _ () {
                    return _superprop_get(_prop);
                },
                set _ (v){
                    return _superprop_set(_prop, v);
                }
            }), _superprop_get = (_prop)=>super[_prop], _superprop_set = (_prop, _value)=>super[_prop] = _value;
        return _async_to_generator(function*() {
            const f = ()=>{};
            // element access (assign)
            _superprop_set("x", f);
            // destructuring assign with element access
            ({ f: _superprop_update("x")._  } = {
                f
            });
            // element access (assign) in arrow
            (()=>_superprop_set("x", f));
            /*#__PURE__*/ // element access (assign) in async arrow
            _async_to_generator(function*() {
                return _superprop_set("x", f);
            });
        })();
    }
    property_access_only_read_only_in_generator() {
        var _this = this, _superprop_get_x = ()=>super.x;
        return _wrap_async_generator(function*() {
            // call with property access
            _superprop_get_x().call(_this);
            // property access (read)
            const a = _superprop_get_x();
            // property access in arrow
            (()=>_superprop_get_x().call(_this));
            /*#__PURE__*/ // property access in async arrow
            _async_to_generator(function*() {
                return _superprop_get_x().call(_this);
            });
        })();
    }
    property_access_only_write_only_in_generator() {
        var _superprop_update_x = {
            get _ () {
                return _superprop_get_x();
            },
            set _ (v){
                _superprop_set_x(v);
            }
        }, _superprop_get_x = ()=>super.x, _superprop_set_x = (_value)=>super.x = _value;
        return _wrap_async_generator(function*() {
            const f = ()=>{};
            // property access (assign)
            _superprop_set_x(f);
            // destructuring assign with property access
            ({ f: _superprop_update_x._  } = {
                f
            });
            // property access (assign) in arrow
            (()=>_superprop_set_x(f));
            /*#__PURE__*/ // property access (assign) in async arrow
            _async_to_generator(function*() {
                return _superprop_set_x(f);
            });
        })();
    }
    element_access_only_read_only_in_generator() {
        var _this = this, _superprop_get = (_prop)=>super[_prop];
        return _wrap_async_generator(function*() {
            // call with element access
            _superprop_get("x").call(_this);
            // element access (read)
            const a = _superprop_get("x");
            // element access in arrow
            (()=>_superprop_get("x").call(_this));
            /*#__PURE__*/ // element access in async arrow
            _async_to_generator(function*() {
                return _superprop_get("x").call(_this);
            });
        })();
    }
    element_access_only_write_only_in_generator() {
        var _superprop_update = (_prop)=>({
                get _ () {
                    return _superprop_get(_prop);
                },
                set _ (v){
                    return _superprop_set(_prop, v);
                }
            }), _superprop_get = (_prop)=>super[_prop], _superprop_set = (_prop, _value)=>super[_prop] = _value;
        return _wrap_async_generator(function*() {
            const f = ()=>{};
            // element access (assign)
            _superprop_set("x", f);
            // destructuring assign with element access
            ({ f: _superprop_update("x")._  } = {
                f
            });
            // element access (assign) in arrow
            (()=>_superprop_set("x", f));
            /*#__PURE__*/ // element access (assign) in async arrow
            _async_to_generator(function*() {
                return _superprop_set("x", f);
            });
        })();
    }
}
