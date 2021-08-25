use std::borrow::Cow;
use swc_common::pass::CompilerPass;
use swc_ecma_transforms_base::pass::JsPass;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut};

/// https://github.com/tc39/proposal-private-fields-in-in
pub fn private_in_object() -> impl JsPass {
    as_folder(PrivateInObject {})
}

struct PrivateInObject {}

impl CompilerPass for PrivateInObject {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("private-in-object")
    }
}

impl VisitMut for PrivateInObject {
    noop_visit_mut_type!();
}
