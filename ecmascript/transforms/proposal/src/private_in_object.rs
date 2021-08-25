use fxhash::FxHashSet;
use std::{borrow::Cow, mem::take};
use swc_atoms::JsWord;
use swc_common::{pass::CompilerPass, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{ext::MapWithMut, pass::JsPass};
use swc_ecma_utils::{ident::IdentLike, prepend, quote_ident, ExprExt, ExprFactory, Id};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut, VisitMutWith};

/// https://github.com/tc39/proposal-private-fields-in-in
pub fn private_in_object() -> impl JsPass {
    as_folder(PrivateInObject::default())
}

#[derive(Default)]
struct PrivateInObject {
    vars: Vec<VarDeclarator>,
    injected_vars: FxHashSet<Id>,
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

impl PrivateInObject {
    fn var_name_for_brand_check(&self, n: &PrivateName) -> Ident {
        let span = n.span.apply_mark(self.cls.mark);
        Ident::new(format!("_brand_check_{}", n.id.sym).into(), span)
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
            }) if left.is_private_name() => {
                let left = left.clone().expect_private_name();

                let var_name = self.var_name_for_brand_check(&left);

                if self.injected_vars.insert(var_name.to_id()) {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(var_name.clone().into()),
                        init: Some(Box::new(Expr::New(NewExpr {
                            span: DUMMY_SP,
                            callee: Box::new(Expr::Ident(quote_ident!("WeakSet"))),
                            args: Default::default(),
                            type_args: Default::default(),
                        }))),
                        definite: Default::default(),
                    });
                }
            }

            _ => {}
        }
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);

        if e.computed {
            e.obj.visit_mut_with(self);
        }
    }

    fn visit_mut_module_items(&mut self, ns: &mut Vec<ModuleItem>) {
        ns.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend(
                ns,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: Default::default(),
                    decls: take(&mut self.vars),
                }))),
            );
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

    fn visit_mut_stmts(&mut self, ns: &mut Vec<Stmt>) {
        ns.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend(
                ns,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: Default::default(),
                    decls: take(&mut self.vars),
                })),
            );
        }
    }
}
