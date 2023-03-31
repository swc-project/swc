import _class_apply_descriptor_set from "./_class_apply_descriptor_set.mjs";
import _class_extract_field_descriptor from "./_class_extract_field_descriptor.mjs";
export default function _class_private_field_set(receiver, privateMap, value) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "set");
    _class_apply_descriptor_set(receiver, descriptor, value);
    return value;
}
