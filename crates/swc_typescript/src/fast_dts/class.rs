use swc_common::util::take::Take;
use swc_ecma_ast::{Class, ClassMember, MethodKind};

use super::{any_type_ann, type_ann, valid_prop_name, FastDts};

impl FastDts {
    pub(crate) fn transform_class(&mut self, class: &mut Class) {
        // Track if the previous member was an overload signature or not.
        // When overloads are present the last item has the implementation
        // body. For declaration files the implementation always needs to
        // be dropped. Needs to be unique for each class because another
        // class could be created inside a class method.
        let mut prev_is_overload = false;

        let new_body = class
            .body
            .take()
            .into_iter()
            .filter(|member| match member {
                ClassMember::Constructor(class_constructor) => {
                    let is_overload =
                        class_constructor.body.is_none() && !class_constructor.is_optional;
                    if !prev_is_overload || is_overload {
                        prev_is_overload = is_overload;
                        true
                    } else {
                        prev_is_overload = false;
                        false
                    }
                }
                ClassMember::Method(method) => {
                    let is_overload = method.function.body.is_none()
                        && !(method.is_abstract || method.is_optional);
                    if !prev_is_overload || is_overload {
                        prev_is_overload = is_overload;
                        true
                    } else {
                        prev_is_overload = false;
                        false
                    }
                }
                ClassMember::TsIndexSignature(_)
                | ClassMember::ClassProp(_)
                | ClassMember::PrivateProp(_)
                | ClassMember::Empty(_)
                | ClassMember::StaticBlock(_)
                | ClassMember::AutoAccessor(_)
                | ClassMember::PrivateMethod(_) => {
                    prev_is_overload = false;
                    true
                }
            })
            .filter_map(|member| match member {
                ClassMember::Constructor(mut class_constructor) => {
                    class_constructor.body = None;
                    self.handle_ts_param_props(&mut class_constructor.params);
                    Some(ClassMember::Constructor(class_constructor))
                }
                ClassMember::Method(mut method) => {
                    if let Some(new_prop_name) = valid_prop_name(&method.key) {
                        method.key = new_prop_name;
                    } else {
                        return None;
                    }

                    method.function.body = None;
                    if method.kind == MethodKind::Setter {
                        method.function.return_type = None;
                    }
                    self.transform_fn_params(&mut method.function.params);
                    Some(ClassMember::Method(method))
                }
                ClassMember::ClassProp(mut prop) => {
                    if let Some(new_prop_name) = valid_prop_name(&prop.key) {
                        prop.key = new_prop_name;
                    } else {
                        return None;
                    }

                    if prop.type_ann.is_none() {
                        if let Some(value) = prop.value {
                            prop.type_ann = self
                                .infer_type_from_expr(&value, false, false)
                                .map(type_ann)
                                .or_else(|| Some(any_type_ann()));
                        }
                    }
                    prop.value = None;
                    prop.definite = false;
                    prop.declare = false;

                    Some(ClassMember::ClassProp(prop))
                }
                ClassMember::TsIndexSignature(index_sig) => {
                    Some(ClassMember::TsIndexSignature(index_sig))
                }

                // These can be removed as they are not relevant for types
                ClassMember::PrivateMethod(_)
                | ClassMember::PrivateProp(_)
                | ClassMember::Empty(_)
                | ClassMember::StaticBlock(_)
                | ClassMember::AutoAccessor(_) => None,
            })
            .collect();

        class.body = new_body;
    }
}
