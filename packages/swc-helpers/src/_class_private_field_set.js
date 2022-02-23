import classExtractFieldDescriptor from './_class_extract_field_descriptor';
import classApplyDescriptorSet from './_class_apply_descriptor_set';

export default function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = classExtractFieldDescriptor(receiver, privateMap, "set");
  classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
