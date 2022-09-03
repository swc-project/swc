//// [asyncMethodWithSuperConflict_es6.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
class A {
    x() {}
    y() {}
}
class B extends A {
    simple() {
        var _this = this, _superprop_get_x = ()=>super.x, _superprop_get_y = ()=>super.y, _superprop_get = (_prop)=>super[_prop];
        return _async_to_generator(function*() {
            _superprop_get_x().call(_this), _superprop_get_y().call(_this), _superprop_get("x").call(_this), _superprop_get_x(), _superprop_get("x");
        })();
    }
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
            let f = ()=>{};
            _superprop_get_x().call(_this), _superprop_get("x").call(_this), _superprop_get_x(), _superprop_get("x"), _superprop_set_x(f), _superprop_set("x", f), ({ f: _superprop_update_x._  } = {
                f
            }), { f: _superprop_update("x")._  } = {
                f
            };
        })();
    }
}
