import _get_prototype_of from "./_get_prototype_of.mjs";
import _is_native_reflect_construct from "./_is_native_reflect_construct.mjs";
import _possible_constructor_return from "./_possible_constructor_return.mjs";
export default function _create_super(Derived) {
    var hasNativeReflectConstruct = _is_native_reflect_construct();
    return function _createSuperInternal() {
        var Super = _get_prototype_of(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _get_prototype_of(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possible_constructor_return(this, result);
    };
}
