import _super_prop_base from "./_super_prop_base.mjs";
function get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
        get = Reflect.get;
    } else {
        get = function get(target, property, receiver) {
            var base = _super_prop_base(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) {
                return desc.get.call(receiver || target);
            }
            return desc.value;
        };
    }
    return get(target, property, receiver || target);
}

export default function _get(target, property, receiver) {
    return get(target, property, receiver)
}