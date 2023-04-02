import _check_private_redeclaration from "./_check_private_redeclaration.mjs";
export default function _class_private_field_init(obj, privateMap, value) {
    _check_private_redeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
