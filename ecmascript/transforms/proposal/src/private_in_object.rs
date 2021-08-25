use std::{borrow::Cow, mem::take};
use swc_atoms::JsWord;
use swc_common::{pass::CompilerPass, Mark};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::pass::JsPass;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut, VisitMutWith};

/// https://github.com/tc39/proposal-private-fields-in-in
pub fn private_in_object() -> impl JsPass {
    as_folder(PrivateInObject::default())
}

#[derive(Default)]
struct PrivateInObject {
    cls: ClassData,
}

#[derive(Default)]
struct ClassData {
    /// [Mark] for the current class.
    ///
    /// This is modified by the class visitor.
    mark: Mark,

    /// Name of private methods.
    methods: Vec<JsWord>,

    /// Name of private statics.
    statics: Vec<JsWord>,
}

impl CompilerPass for PrivateInObject {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("private-in-object")
    }
}

impl VisitMut for PrivateInObject {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, n: &mut Class) {
        let old_cls = take(&mut self.cls);

        self.cls.mark = Mark::fresh(Mark::root());
        for m in &n.body {
            match m {
                ClassMember::PrivateMethod(m) => {
                    self.cls.methods.push(m.key.id.sym.clone());

                    if m.is_static {
                        self.cls.statics.push(m.key.id.sym.clone());
                    }
                }

                ClassMember::PrivateProp(m) => {
                    if m.is_static {
                        self.cls.statics.push(m.key.id.sym.clone());
                    }
                }

                _ => {}
            }
        }

        n.visit_mut_children_with(self);

        self.cls = old_cls;
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Bin(BinExpr {
                op: op!("in"),
                left,
                right,
                ..
            }) if left.is_private_name() => {}

            _ => {}
        }
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
