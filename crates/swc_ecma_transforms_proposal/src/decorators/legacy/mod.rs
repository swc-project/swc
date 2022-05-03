use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    constructor::inject_after_super, default_constructor, private_ident, prop_name_to_expr_value,
    quote_ident, undefined, ExprFactory, StmtLike,
};
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

use self::metadata::{Metadata, ParamMetadata};

mod metadata;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum EnumKind {
    Mixed,
    Str,
    Num,
}

pub(super) fn new(metadata: bool, use_define_for_class_fields: bool) -> TscDecorator {
    TscDecorator {
        metadata,
        use_define_for_class_fields,
        enums: Default::default(),
        vars: Default::default(),
        appended_exprs: Default::default(),
        class_name: Default::default(),
        constructor_exprs: Default::default(),
    }
}

pub(super) struct TscDecorator {
    metadata: bool,
    use_define_for_class_fields: bool,

    enums: AHashMap<JsWord, EnumKind>,

    /// Used for computed keys, and this variables are not initialized.
    vars: Vec<VarDeclarator>,
    appended_exprs: Vec<Box<Expr>>,

    class_name: Option<Ident>,

    /// Only used if `use_define_for_class_props` is false.
    constructor_exprs: Vec<Box<Expr>>,
}

impl TscDecorator {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self>,
    {
        let old_appended_exprs = self.appended_exprs.take();

        let mut new = vec![];

        for mut s in stmts.take() {
            debug_assert!(self.appended_exprs.is_empty());

            s.visit_mut_with(self);

            new.push(s);

            new.extend(
                self.appended_exprs
                    .drain(..)
                    .into_iter()
                    .map(|expr| {
                        Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr,
                        })
                    })
                    .map(T::from_stmt),
            );
        }

        *stmts = new;

        self.appended_exprs = old_appended_exprs;
    }

    fn key(&mut self, k: &mut PropName) -> Expr {
        match k {
            PropName::Computed(k) => {
                let var_name = private_ident!(k.span, "_key");

                // Declare var
                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(var_name.clone().into()),
                    init: None,
                    definite: Default::default(),
                });

                // Initialize var
                self.appended_exprs.push(Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: PatOrExpr::Pat(var_name.clone().into()),
                    right: k.expr.take(),
                })));

                k.expr = Box::new(Expr::Ident(var_name.clone()));

                Expr::Ident(var_name)
            }
            _ => prop_name_to_expr_value(k.clone()),
        }
    }

    /// Creates `__decorator` calls.
    fn add_decorate_call(
        &mut self,
        decorators: impl IntoIterator<Item = Box<Expr>>,
        target: ExprOrSpread,
        key: ExprOrSpread,
        desc: ExprOrSpread,
    ) {
        let decorators = ArrayLit {
            span: DUMMY_SP,
            elems: decorators
                .into_iter()
                .map(|v| v.as_arg())
                .map(Some)
                .collect(),
        }
        .as_arg();

        self.appended_exprs.push(Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: helper!(ts, ts_decorate, "__decorate"),
            args: vec![decorators, target, key, desc],
            type_args: Default::default(),
        })));
    }
}

impl Visit for TscDecorator {
    fn visit_ts_enum_decl(&mut self, e: &TsEnumDecl) {
        let enum_kind = e
            .members
            .iter()
            .map(|member| member.init.as_ref())
            .map(|init| match init {
                Some(e) => match &**e {
                    Expr::Lit(lit) => match lit {
                        Lit::Str(_) => EnumKind::Str,
                        Lit::Num(_) => EnumKind::Num,
                        _ => EnumKind::Mixed,
                    },
                    _ => EnumKind::Mixed,
                },
                None => EnumKind::Num,
            })
            .fold(None, |opt: Option<EnumKind>, item| {
                //
                let a = match item {
                    EnumKind::Mixed => return Some(EnumKind::Mixed),
                    _ => item,
                };

                let b = match opt {
                    Some(EnumKind::Mixed) => return Some(EnumKind::Mixed),
                    Some(v) => v,
                    None => return Some(item),
                };
                if a == b {
                    Some(a)
                } else {
                    Some(EnumKind::Mixed)
                }
            });
        if let Some(kind) = enum_kind {
            self.enums.insert(e.id.sym.clone(), kind);
        }
    }
}

impl VisitMut for TscDecorator {
    fn visit_mut_class(&mut self, n: &mut Class) {
        let old_constructor_stmts = self.constructor_exprs.take();

        if self.metadata {
            let i = self.class_name.clone();

            n.visit_mut_with(&mut ParamMetadata);
            n.visit_mut_with(&mut Metadata {
                enums: &self.enums,
                class_name: i.as_ref(),
            });
        }

        n.visit_mut_children_with(self);

        if !self.constructor_exprs.is_empty() {
            for m in &mut n.body {
                if let ClassMember::Constructor(c @ Constructor { body: Some(..), .. }) = m {
                    inject_after_super(c, self.constructor_exprs.take());
                }
            }

            if !self.constructor_exprs.is_empty() {
                let mut c = default_constructor(n.super_class.is_some());
                inject_after_super(&mut c, self.constructor_exprs.take());
                n.body.insert(0, ClassMember::Constructor(c));
            }
        }

        self.constructor_exprs = old_constructor_stmts;

        if let Some(class_name) = self.class_name.clone() {
            if !n.decorators.is_empty() {
                let decorators = ArrayLit {
                    span: DUMMY_SP,
                    elems: n
                        .decorators
                        .take()
                        .into_iter()
                        .map(|v| v.expr.as_arg())
                        .map(Some)
                        .collect(),
                }
                .as_arg();

                self.appended_exprs.push(Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(ts, ts_decorate, "__decorate"),
                    args: vec![decorators, class_name.as_arg()],
                    type_args: Default::default(),
                })));
            }
        }
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        let old = self.class_name.take();
        self.class_name = Some(n.ident.clone());

        n.visit_mut_children_with(self);

        self.class_name = old;
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        let old = self.class_name.take();
        if let Some(ident) = &n.ident {
            self.class_name = Some(ident.clone());
        }

        n.visit_mut_children_with(self);

        self.class_name = old;
    }

    fn visit_mut_class_method(&mut self, c: &mut ClassMethod) {
        c.visit_mut_children_with(self);

        if let Some(class_name) = self.class_name.clone() {
            if !c.function.decorators.is_empty() {
                let key = self.key(&mut c.key);

                let target = if c.is_static {
                    class_name.as_arg()
                } else {
                    class_name.make_member(quote_ident!("prototype")).as_arg()
                };

                self.add_decorate_call(
                    c.function.decorators.drain(..).map(|d| d.expr),
                    target,
                    key.as_arg(),
                    Lit::Null(Null::dummy()).as_arg(),
                );
            }
        }
    }

    fn visit_mut_class_prop(&mut self, c: &mut ClassProp) {
        c.visit_mut_children_with(self);

        if let Some(class_name) = self.class_name.clone() {
            let key = self.key(&mut c.key);

            if !c.decorators.is_empty() {
                let target = if c.is_static {
                    class_name.as_arg()
                } else {
                    class_name.make_member(quote_ident!("prototype")).as_arg()
                };

                self.add_decorate_call(
                    c.decorators.drain(..).map(|d| d.expr),
                    target,
                    key.as_arg(),
                    undefined(DUMMY_SP).as_arg(),
                );
            }

            if !self.use_define_for_class_fields && !c.is_static {
                if let Some(init) = c.value.take() {
                    self.constructor_exprs
                        .push(Box::new(Expr::Assign(AssignExpr {
                            span: c.span,
                            op: op!("="),
                            left: PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                                prop: match &c.key {
                                    PropName::Ident(i) => MemberProp::Ident(i.clone()),
                                    _ => MemberProp::Computed(ComputedPropName {
                                        span: DUMMY_SP,
                                        expr: Box::new(prop_name_to_expr_value(c.key.clone())),
                                    }),
                                },
                            }))),
                            right: init,
                        })));
                }
            }
        }
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        n.visit_with(self);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_module_items(&mut self, s: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(s)
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        n.visit_with(self);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(s)
    }
}
