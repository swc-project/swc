import _get_prototype_of from "./_get_prototype_of.mjs";
export default function _super_prop_base(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
        object = _get_prototype_of(object);
        if (object === null) break;
    }
    return object;
}
