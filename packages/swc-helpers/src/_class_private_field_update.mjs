import _class_apply_descriptor_update from "./_class_apply_descriptor_update.mjs";
import _class_extract_field_descriptor from "./_class_extract_field_descriptor.mjs";
export default function _class_private_field_update(receiver, privateMap) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "update");
    return _class_apply_descriptor_update(receiver, descriptor);
}
