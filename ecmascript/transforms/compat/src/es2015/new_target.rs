use std::borrow::Cow;

use swc_atoms::js_word;
use swc_common::pass::CompilerPass;
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn new_target() -> impl Fold + VisitMut + CompilerPass {
    as_folder(NewTarget { cur: None })
}

struct NewTarget {
    cur: Option<Ident>,
}

impl VisitMut for NewTarget {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::MetaProp(MetaPropExpr {
                meta:
                    Ident {
                        sym: js_word!("new"),
                        ..
                    },
                prop:
                    Ident {
                        sym: js_word!("target"),
                        ..
                    },
            }) => {
                if let Some(cur) = self.cur.clone() {
                    *e = Expr::Ident(cur);
                }
            }

            _ => {}
        }
    }
}

impl CompilerPass for NewTarget {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("new-target")
    }
}
