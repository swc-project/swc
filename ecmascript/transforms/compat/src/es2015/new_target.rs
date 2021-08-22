use std::borrow::Cow;
use swc_atoms::js_word;
use swc_common::{pass::CompilerPass, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{private_ident, quote_ident, undefined, ExprFactory};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Node, Visit, VisitMut, VisitMutWith,
};

pub fn new_target() -> impl Fold + VisitMut + CompilerPass {
    as_folder(NewTarget::default())
}

#[derive(Clone, Default)]

struct NewTarget {
    cur: Option<Ident>,

    in_constructor: bool,
}

#[fast_path(ShouldWork)]
impl VisitMut for NewTarget {
    noop_visit_mut_type!();

    fn visit_mut_class_decl(&mut self, class: &mut ClassDecl) {
        class.visit_mut_children_with(&mut NewTarget {
            cur: Some(class.ident.clone()),
            ..self.clone()
        });
    }

    fn visit_mut_class_expr(&mut self, class: &mut ClassExpr) {
        class.visit_mut_children_with(&mut NewTarget {
            cur: class.ident.clone(),
            ..self.clone()
        });
    }

    fn visit_mut_constructor(&mut self, c: &mut Constructor) {
        let old = self.in_constructor;

        self.in_constructor = true;

        c.visit_mut_children_with(self);

        self.in_constructor = old;
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
                    let c = ThisExpr { span: DUMMY_SP }.make_member(quote_ident!("constructor"));

                    if self.in_constructor {
                        *e = c;
                    } else {
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
                            cons: Box::new(c),
                            // void 0
                            alt: undefined(DUMMY_SP),
                        });
                    }
                }
            }

            _ => {}
        }
    }

    fn visit_mut_fn_decl(&mut self, f: &mut FnDecl) {
        // #[fast_path] ensures that `f` contains `new.target`.

        f.visit_mut_children_with(&mut NewTarget {
            cur: Some(f.ident.clone()),
            ..self.clone()
        });
    }

    fn visit_mut_fn_expr(&mut self, f: &mut FnExpr) {
        // #[fast_path] ensures that `f` contains `new.target`.

        let i = f
            .ident
            .get_or_insert_with(|| private_ident!("_target"))
            .clone();

        f.visit_mut_children_with(&mut NewTarget {
            cur: Some(i),
            ..self.clone()
        });
    }
}

impl CompilerPass for NewTarget {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("new-target")
    }
}

#[derive(Default)]
struct ShouldWork {
    found: bool,
}

impl Visit for ShouldWork {
    noop_visit_type!();

    fn visit_meta_prop_expr(&mut self, n: &MetaPropExpr, _: &dyn Node) {
        match n {
            MetaPropExpr {
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
            } => {
                self.found = true;
            }

            _ => {}
        }
    }
}

impl Check for ShouldWork {
    fn should_handle(&self) -> bool {
        self.found
    }
}
