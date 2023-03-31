import _is_native_reflect_construct from "./_is_native_reflect_construct.mjs";
import _set_prototype_of from "./_set_prototype_of.mjs";
function construct(Parent, args, Class) {
    if (_is_native_reflect_construct()) {
        construct = Reflect.construct;
    } else {
        construct = function construct(Parent, args, Class) {
            var a = [null];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _set_prototype_of(instance, Class.prototype);
            return instance;
        };
    }
    return construct.apply(null, arguments);
}

export default function _construct() {
    return construct.apply(null, arguments);
}
