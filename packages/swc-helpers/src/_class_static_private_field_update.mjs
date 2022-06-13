import classCheckPrivateStaticAccess from './_class_check_private_static_access';
import classCheckPrivateStaticFieldDescriptor from './_class_check_private_static_access';
import classApplyDescriptorUpdate from './_class_apply_descriptor_update';

export default function _classStaticPrivateFieldUpdate(receiver, classConstructor, descriptor) {
  classCheckPrivateStaticAccess(receiver, classConstructor);
  classCheckPrivateStaticFieldDescriptor(descriptor, "update");
  return classApplyDescriptorUpdate(receiver, descriptor);
}
