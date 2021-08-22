use std::borrow::Cow;
use swc_atoms::js_word;
use swc_common::{pass::CompilerPass, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{quote_ident, undefined, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn new_target() -> impl Fold + VisitMut + CompilerPass {
    as_folder(NewTarget { cur: None })
}

struct NewTarget {
    cur: Option<Ident>,
}

impl VisitMut for NewTarget {
    noop_visit_mut_type!();

    fn visit_mut_class_decl(&mut self, class: &mut ClassDecl) {
        class.visit_mut_children_with(&mut NewTarget {
            cur: Some(class.ident.clone()),
        });
    }

    fn visit_mut_class_expr(&mut self, class: &mut ClassExpr) {
        class.visit_mut_children_with(&mut NewTarget {
            cur: class.ident.clone(),
        });
    }

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
                    // (this instanceof Foo ? this.constructor : void 0)
                    *e = Expr::Cond(CondExpr {
                        span: DUMMY_SP,
                        // this instanceof Foo
                        test: Box::new(Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            op: op!("instanceof"),
                            left: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                            right: Box::new(Expr::Ident(cur)),
                        })),
                        // this.constructor
                        cons: Box::new(
                            ThisExpr { span: DUMMY_SP }.make_member(quote_ident!("constructor")),
                        ),
                        // void 0
                        alt: undefined(DUMMY_SP),
                    });
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
