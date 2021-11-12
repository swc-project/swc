use std::borrow::Cow;
use swc_atoms::js_word;
use swc_common::{pass::CompilerPass, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::{should_work, Check};
use swc_ecma_utils::{prepend, private_ident, quote_ident, undefined, ExprFactory};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Node, Visit, VisitMut, VisitMutWith,
};

pub fn new_target() -> impl Fold + VisitMut + CompilerPass {
    as_folder(NewTarget::default())
}

#[derive(Default)]

struct NewTarget {
    cur: Option<Ident>,

    in_constructor: bool,
    in_method: bool,
    in_arrow_expr: bool,

    var: Option<VarDeclarator>,
}

impl VisitMut for NewTarget {
    noop_visit_mut_type!();

    fn visit_mut_arrow_expr(&mut self, e: &mut ArrowExpr) {
        // Ensure that `e` contains new.target
        if !should_work::<ShouldWork, _>(&*e) {
            return;
        }

        let old = self.in_arrow_expr;
        if self.var.is_none() {
            let mut v = Expr::MetaProp(MetaPropExpr {
                meta: Ident::new("new".into(), DUMMY_SP),
                prop: Ident::new("target".into(), DUMMY_SP),
            });
            v.visit_mut_with(self);
            self.var.get_or_insert_with(|| VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(private_ident!("_newtarget").into()),
                init: Some(Box::new(v)),
                definite: Default::default(),
            });
        }
        self.in_arrow_expr = true;
        e.visit_mut_children_with(self);

        self.in_arrow_expr = old;
    }

    fn visit_mut_class_decl(&mut self, class: &mut ClassDecl) {
        let old = self.cur.take();
        self.cur = Some(class.ident.clone());

        class.visit_mut_children_with(self);

        self.cur = old;
    }

    fn visit_mut_class_expr(&mut self, class: &mut ClassExpr) {
        let old = self.cur.take();
        self.cur = class.ident.clone();

        class.visit_mut_children_with(self);

        self.cur = old;
    }

    fn visit_mut_class_method(&mut self, c: &mut ClassMethod) {
        let old = self.in_method;

        self.in_method = true;

        c.visit_mut_children_with(self);

        self.in_method = old;
    }

    fn visit_mut_constructor(&mut self, c: &mut Constructor) {
        let old = self.in_constructor;

        self.in_constructor = true;
        self.in_arrow_expr = false;
        self.var = None;

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
                if self.in_arrow_expr {
                    *e = Expr::Ident(self.var.as_ref().unwrap().name.clone().ident().unwrap().id);
                } else if self.in_method {
                    *e = *undefined(DUMMY_SP)
                } else {
                    if let Some(cur) = self.cur.clone() {
                        let c =
                            ThisExpr { span: DUMMY_SP }.make_member(quote_ident!("constructor"));

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
            }

            _ => {}
        }
    }

    fn visit_mut_fn_decl(&mut self, f: &mut FnDecl) {
        // Ensure that `f` contains `new.target`.
        if !should_work::<ShouldWork, _>(&*f) {
            return;
        }

        let old = self.cur.take();
        self.cur = Some(f.ident.clone());

        f.visit_mut_children_with(self);

        self.cur = old;
    }

    fn visit_mut_fn_expr(&mut self, f: &mut FnExpr) {
        // Ensure that `f` contains `new.target`.
        if !should_work::<ShouldWork, _>(&*f) {
            return;
        }

        let i = f
            .ident
            .get_or_insert_with(|| private_ident!("_target"))
            .clone();

        let old = self.cur.take();
        self.cur = Some(i.clone());

        f.visit_mut_children_with(self);

        self.cur = old;
    }

    fn visit_mut_method_prop(&mut self, m: &mut MethodProp) {
        let old = self.in_method;

        self.in_method = true;

        m.visit_mut_children_with(self);

        self.in_method = old;
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        stmts.visit_mut_children_with(self);

        if let Some(var) = self.var.take() {
            prepend(
                stmts,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: vec![var],
                }))),
            )
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        stmts.visit_mut_children_with(self);

        if !self.in_arrow_expr {
            if let Some(var) = self.var.take() {
                prepend(
                    stmts,
                    Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: vec![var],
                    })),
                )
            }
        }
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
