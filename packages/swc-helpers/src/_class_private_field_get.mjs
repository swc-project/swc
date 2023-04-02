import _class_apply_descriptor_get from "./_class_apply_descriptor_get.mjs";
import _class_extract_field_descriptor from "./_class_extract_field_descriptor.mjs";
export default function _class_private_field_get(receiver, privateMap) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "get");
    return _class_apply_descriptor_get(receiver, descriptor);
}
