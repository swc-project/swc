import _check_private_redeclaration from "./_check_private_redeclaration.mjs";
export default function _class_private_method_init(obj, privateSet) {
    _check_private_redeclaration(obj, privateSet);
    privateSet.add(obj);
}
