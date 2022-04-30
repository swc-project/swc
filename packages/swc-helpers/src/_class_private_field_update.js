import classExtractFieldDescriptor from "./_class_extract_field_descriptor";
import _classApplyDescriptorUpdate from "./_class_apply_descriptor_update";

export default function _classPrivateFieldUpdate(receiver, privateMap) {
    var descriptor = classExtractFieldDescriptor(receiver, privateMap, "update");
    return _classApplyDescriptorUpdate(receiver, descriptor);
}
