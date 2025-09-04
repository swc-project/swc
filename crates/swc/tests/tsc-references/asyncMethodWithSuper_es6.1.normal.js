//// [asyncMethodWithSuper_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
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
            ({ f: _superprop_update_x._ } = {
                f
            });
            // destructuring assign with element access
            ({ f: _superprop_update("x")._ } = {
                f
            });
            // property access in arrow
            ()=>_superprop_get_x().call(_this);
            // element access in arrow
            ()=>_superprop_get("x").call(_this);
            // property access in async arrow
            ()=>{
                var _this = this, _superprop_get_x1 = ()=>_superprop_get_x();
                _async_to_generator(function*() {
                    return _superprop_get_x1().call(_this);
                })();
            };
            // element access in async arrow
            ()=>{
                var _this = this, _superprop_get1 = (_prop)=>_superprop_get(_prop);
                _async_to_generator(function*() {
                    return _superprop_get1("x").call(_this);
                })();
            };
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
            ()=>_superprop_get_x().call(_this);
            // property access in async arrow
            ()=>{
                var _this = this, _superprop_get_x1 = ()=>_superprop_get_x();
                _async_to_generator(function*() {
                    return _superprop_get_x1().call(_this);
                })();
            };
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
            ({ f: _superprop_update_x._ } = {
                f
            });
            // property access (assign) in arrow
            ()=>_superprop_set_x(f);
            // property access (assign) in async arrow
            ()=>{
                var _superprop_set_x1 = (_value)=>_superprop_set_x(_value);
                _async_to_generator(function*() {
                    return _superprop_set_x1(f);
                })();
            };
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
            ()=>_superprop_get("x").call(_this);
            // element access in async arrow
            ()=>{
                var _this = this, _superprop_get1 = (_prop)=>_superprop_get(_prop);
                _async_to_generator(function*() {
                    return _superprop_get1("x").call(_this);
                })();
            };
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
            ({ f: _superprop_update("x")._ } = {
                f
            });
            // element access (assign) in arrow
            ()=>_superprop_set("x", f);
            // element access (assign) in async arrow
            ()=>{
                var _superprop_set1 = (_prop, _value)=>_superprop_set(_prop, _value);
                _async_to_generator(function*() {
                    return _superprop_set1("x", f);
                })();
            };
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
            ()=>_superprop_get_x().call(_this);
            // property access in async arrow
            ()=>{
                var _this = this, _superprop_get_x1 = ()=>_superprop_get_x();
                _async_to_generator(function*() {
                    return _superprop_get_x1().call(_this);
                })();
            };
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
            ({ f: _superprop_update_x._ } = {
                f
            });
            // property access (assign) in arrow
            ()=>_superprop_set_x(f);
            // property access (assign) in async arrow
            ()=>{
                var _superprop_set_x1 = (_value)=>_superprop_set_x(_value);
                _async_to_generator(function*() {
                    return _superprop_set_x1(f);
                })();
            };
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
            ()=>_superprop_get("x").call(_this);
            // element access in async arrow
            ()=>{
                var _this = this, _superprop_get1 = (_prop)=>_superprop_get(_prop);
                _async_to_generator(function*() {
                    return _superprop_get1("x").call(_this);
                })();
            };
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
            ({ f: _superprop_update("x")._ } = {
                f
            });
            // element access (assign) in arrow
            ()=>_superprop_set("x", f);
            // element access (assign) in async arrow
            ()=>{
                var _superprop_set1 = (_prop, _value)=>_superprop_set(_prop, _value);
                _async_to_generator(function*() {
                    return _superprop_set1("x", f);
                })();
            };
        })();
    }
}
// https://github.com/microsoft/TypeScript/issues/46828
class Base {
    set setter(x) {}
    get getter() {
        return;
    }
    method(x) {}
    static set setter(x) {}
    static get getter() {
        return;
    }
    static method(x) {}
}
class Derived extends Base {
    a() {
        return ()=>{
            var _this = this, _superprop_get_method = ()=>super.method;
            _async_to_generator(function*() {
                return _superprop_get_method().call(_this, '');
            })();
        };
    }
    b() {
        return ()=>{
            var _superprop_get_getter = ()=>super.getter;
            _async_to_generator(function*() {
                return _superprop_get_getter();
            })();
        };
    }
    c() {
        return ()=>{
            var _superprop_set_setter = (_value)=>super.setter = _value;
            _async_to_generator(function*() {
                return _superprop_set_setter('');
            })();
        };
    }
    d() {
        return ()=>{
            var _this = this, _superprop_get = (_prop)=>super[_prop];
            _async_to_generator(function*() {
                return _superprop_get("method").call(_this, '');
            })();
        };
    }
    e() {
        return ()=>{
            var _superprop_get = (_prop)=>super[_prop];
            _async_to_generator(function*() {
                return _superprop_get("getter");
            })();
        };
    }
    f() {
        return ()=>{
            var _superprop_set = (_prop, _value)=>super[_prop] = _value;
            _async_to_generator(function*() {
                return _superprop_set("setter", '');
            })();
        };
    }
    static a() {
        return ()=>{
            var _this = this, _superprop_get_method = ()=>super.method;
            _async_to_generator(function*() {
                return _superprop_get_method().call(_this, '');
            })();
        };
    }
    static b() {
        return ()=>{
            var _superprop_get_getter = ()=>super.getter;
            _async_to_generator(function*() {
                return _superprop_get_getter();
            })();
        };
    }
    static c() {
        return ()=>{
            var _superprop_set_setter = (_value)=>super.setter = _value;
            _async_to_generator(function*() {
                return _superprop_set_setter('');
            })();
        };
    }
    static d() {
        return ()=>{
            var _this = this, _superprop_get = (_prop)=>super[_prop];
            _async_to_generator(function*() {
                return _superprop_get("method").call(_this, '');
            })();
        };
    }
    static e() {
        return ()=>{
            var _superprop_get = (_prop)=>super[_prop];
            _async_to_generator(function*() {
                return _superprop_get("getter");
            })();
        };
    }
    static f() {
        return ()=>{
            var _superprop_set = (_prop, _value)=>super[_prop] = _value;
            _async_to_generator(function*() {
                return _superprop_set("setter", '');
            })();
        };
    }
}
