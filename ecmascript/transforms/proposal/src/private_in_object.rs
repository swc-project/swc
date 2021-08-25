use fxhash::FxHashSet;
use std::{borrow::Cow, mem::take};
use swc_atoms::JsWord;
use swc_common::{pass::CompilerPass, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{ext::MapWithMut, pass::JsPass};
use swc_ecma_utils::{
    default_constructor, ident::IdentLike, prepend, private_ident, quote_ident, ExprExt,
    ExprFactory, Id,
};
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

    cls_ident: Option<Ident>,
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

    consturctor_exprs: Vec<Box<Expr>>,
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

        if !self.cls.consturctor_exprs.is_empty() {
            let has_constructor = n
                .body
                .iter()
                .any(|m| matches!(m, ClassMember::Constructor(_)));

            if !has_constructor {
                let has_super = n.super_class.is_some();
                n.body
                    .push(ClassMember::Constructor(default_constructor(has_super)));
            }

            for m in &mut n.body {
                match m {
                    ClassMember::Constructor(Constructor {
                        body: Some(body), ..
                    }) => {
                        for expr in take(&mut self.cls.consturctor_exprs) {
                            body.stmts.push(Stmt::Expr(ExprStmt {
                                span: DUMMY_SP,
                                expr,
                            }));
                        }
                    }

                    _ => {}
                }
            }
        }

        self.cls = old_cls;
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        let old_cls_ident = take(&mut self.cls_ident);
        self.cls_ident = Some(n.ident.clone());

        n.visit_mut_children_with(self);

        self.cls_ident = old_cls_ident;
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        let old_cls_ident = take(&mut self.cls_ident);

        let i = n.ident.get_or_insert_with(|| private_ident!("_class"));
        self.cls_ident = Some(i.clone());

        n.visit_mut_children_with(self);

        self.cls_ident = old_cls_ident;
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Bin(BinExpr {
                span,
                op: op!("in"),
                left,
                right,
            }) if left.is_private_name() => {
                let left = left.clone().expect_private_name();

                let is_static = self.cls.statics.contains(&left.id.sym);

                if let Some(cls_ident) = self.cls_ident.clone() {
                    if is_static {
                        *e = Expr::Bin(BinExpr {
                            span: *span,
                            op: op!("==="),
                            left: Box::new(Expr::Ident(cls_ident)),
                            right: right.take(),
                        });
                        return;
                    }
                }

                let var_name = self.var_name_for_brand_check(&left);

                if self.injected_vars.insert(var_name.to_id()) {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(var_name.clone().into()),
                        init: Some(Box::new(Expr::New(NewExpr {
                            span: DUMMY_SP,
                            callee: Box::new(Expr::Ident(quote_ident!("WeakSet"))),
                            args: Some(Default::default()),
                            type_args: Default::default(),
                        }))),
                        definite: Default::default(),
                    });
                    self.cls
                        .consturctor_exprs
                        .push(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: var_name
                                .clone()
                                .make_member(quote_ident!("add"))
                                .as_callee(),
                            args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                            type_args: Default::default(),
                        })));
                }

                *e = Expr::Call(CallExpr {
                    span: *span,
                    callee: var_name.make_member(quote_ident!("has")).as_callee(),
                    args: vec![right.take().as_arg()],
                    type_args: Default::default(),
                });
                return;
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

    fn visit_mut_script(&mut self, s: &mut Script) {
        s.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend(
                &mut s.body,
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
