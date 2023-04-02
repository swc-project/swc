import _class_apply_descriptor_update from "./_class_apply_descriptor_update.mjs";
import _class_check_private_static_access from "./_class_check_private_static_access.mjs";
import _class_check_private_static_field_descriptor from "./_class_check_private_static_field_descriptor.mjs";
export default function _class_static_private_field_update(receiver, classConstructor, descriptor) {
    _class_check_private_static_access(receiver, classConstructor);
    _class_check_private_static_field_descriptor(descriptor, "update");
    return _class_apply_descriptor_update(receiver, descriptor);
}
