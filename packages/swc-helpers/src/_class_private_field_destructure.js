import classExtractFieldDescriptor from './_class_extract_field_descriptor';
import classApplyDescriptorDestructureSet from './_class_apply_descriptor_destructure';

export default function _classPrivateFieldDestructureSet(receiver, privateMap) {
  var descriptor = classExtractFieldDescriptor(receiver, privateMap, "set");
  return classApplyDescriptorDestructureSet(receiver, descriptor);
}
