import classExtractFieldDescriptor from './_class_extract_field_descriptor';
import classApplyDescriptorGet from './_class_apply_descriptor_get';

export default function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = classExtractFieldDescriptor(receiver, privateMap, "get");
  return classApplyDescriptorGet(receiver, descriptor);
}
