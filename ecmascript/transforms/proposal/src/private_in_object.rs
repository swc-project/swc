use std::borrow::Cow;
use swc_common::{pass::CompilerPass, Mark};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::pass::JsPass;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut, VisitMutWith};

/// https://github.com/tc39/proposal-private-fields-in-in
pub fn private_in_object() -> impl JsPass {
    as_folder(PrivateInObject { mark: Mark::root() })
}

struct PrivateInObject {
    /// [Mark] for the current class.
    ///
    /// This is modified the class visitor.
    mark: Mark,
}

impl CompilerPass for PrivateInObject {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("private-in-object")
    }
}

impl VisitMut for PrivateInObject {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, n: &mut Class) {
        let old_mark = self.mark;

        self.mark = Mark::fresh(Mark::root());

        n.visit_mut_children_with(self);

        self.mark = old_mark;
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);

        if e.computed {
            e.obj.visit_mut_with(self);
        }
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        match n {
            PropName::Computed(_) => {
                n.visit_mut_children_with(self);
            }

            _ => {}
        }
    }
}
