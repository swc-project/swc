use swc_atoms::js_word;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

#[derive(Clone, Default)]
pub struct FnEnvState {
    this: Option<Ident>,
    args: Option<Ident>,
    new_target: Option<Ident>,
}

impl FnEnvState {
    pub fn new(this: Option<Ident>, args: Option<Ident>, new_target: Option<Ident>) -> Self {
        Self {
            this,
            args,
            new_target,
        }
    }
    pub fn to_decl(self) -> Vec<VarDeclarator> {
        let Self {
            this,
            args,
            new_target,
        } = self;

        let mut decls = Vec::with_capacity(3);
        if let Some(this_id) = this {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(this_id.clone().into()),
                init: Some(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
                definite: false,
            });
        }
        if let Some(id) = args {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(id.into()),
                init: Some(Box::new(Expr::Ident(Ident::new(
                    js_word!("arguments"),
                    DUMMY_SP,
                )))),
                definite: false,
            });
        }
        if let Some(id) = new_target {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(id.into()),
                init: Some(Box::new(Expr::MetaProp(MetaPropExpr {
                    span: DUMMY_SP,
                    kind: MetaPropKind::NewTarget,
                }))),
                definite: false,
            });
        }
        decls
    }
    pub fn to_stmt(self) -> Option<Stmt> {
        let decls = self.to_decl();

        if decls.is_empty() {
            None
        } else {
            Some(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls,
            })))
        }
    }

    pub fn to_stmt_in_subclass(self) -> (Option<Stmt>, Option<Ident>) {
        let Self {
            this,
            args,
            new_target,
        } = self;

        let mut decls = Vec::with_capacity(3);
        if let Some(this_id) = &this {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(this_id.clone().into()),
                init: None,
                definite: false,
            });
        }
        if let Some(id) = args {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(id.into()),
                init: Some(Box::new(Expr::Ident(Ident::new(
                    js_word!("arguments"),
                    DUMMY_SP,
                )))),
                definite: false,
            });
        }
        if let Some(id) = new_target {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(id.into()),
                init: Some(Box::new(Expr::MetaProp(MetaPropExpr {
                    span: DUMMY_SP,
                    kind: MetaPropKind::NewTarget,
                }))),
                definite: false,
            });
        }

        if decls.is_empty() {
            (None, None)
        } else {
            (
                Some(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls,
                }))),
                this.clone(),
            )
        }
    }
}

impl Take for FnEnvState {
    fn dummy() -> Self {
        Self::default()
    }
}

pub struct FnEnvHoister<'a> {
    state: &'a mut FnEnvState,
}

impl<'a> FnEnvHoister<'a> {
    pub fn new(state: &'a mut FnEnvState) -> Self {
        FnEnvHoister { state }
    }
}

impl<'a> VisitMut for FnEnvHoister<'a> {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Ident(id) if id.sym == js_word!("arguments") => {
                let arguments = self
                    .state
                    .args
                    .get_or_insert_with(|| private_ident!("_arguments"));
                *e = Expr::Ident(arguments.clone());
            }
            Expr::This(..) => {
                let this = self
                    .state
                    .this
                    .get_or_insert_with(|| private_ident!("_this"));
                *e = Expr::Ident(this.clone());
            }
            Expr::MetaProp(MetaPropExpr {
                kind: MetaPropKind::NewTarget,
                ..
            }) => {
                let target = self
                    .state
                    .new_target
                    .get_or_insert_with(|| private_ident!("_newtarget"));
                *e = Expr::Ident(target.clone());
            }
            _ => e.visit_mut_children_with(self),
        }
    }

    /// Don't recurse into prop of member expression unless computed
    fn visit_mut_member_expr(&mut self, m: &mut MemberExpr) {
        if let MemberProp::Computed(computed) = &mut m.prop {
            computed.visit_mut_with(self);
        }

        m.obj.visit_mut_with(self);
    }

    /// Don't recurse into prop of super expression unless computed
    fn visit_mut_super_prop_expr(&mut self, m: &mut SuperPropExpr) {
        if let SuperProp::Computed(computed) = &mut m.prop {
            computed.visit_mut_with(self);
        }
    }

    /// Don't recurse into constructor
    fn visit_mut_class(&mut self, _: &mut Class) {}

    /// Don't recurse into fn
    fn visit_mut_function(&mut self, _: &mut Function) {}

    /// Don't recurse into getter/setter/method except computed key
    fn visit_mut_getter_prop(&mut self, p: &mut GetterProp) {
        if p.key.is_computed() {
            p.key.visit_mut_with(self);
        }
    }

    fn visit_mut_setter_prop(&mut self, p: &mut SetterProp) {
        if p.key.is_computed() {
            p.key.visit_mut_with(self);
        }
    }

    fn visit_mut_method_prop(&mut self, p: &mut MethodProp) {
        if p.key.is_computed() {
            p.key.visit_mut_with(self);
        }
    }
}

pub fn init_this(stmts: &mut Vec<Stmt>, this_id: &Ident) {
    stmts.visit_mut_children_with(&mut InitThis { this_id })
}

struct InitThis<'a> {
    this_id: &'a Ident,
}

// babel is skip function and class property
impl<'a> VisitMut for InitThis<'a> {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, _: &mut Class) {}

    // babel will transform super() to super(); _this = this
    // hopefully it will be meaningless
    // fn visit_mut_stmts(&mut self, stmt: &mut Vec<Stmt>) {}

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        match expr {
            Expr::Call(CallExpr {
                callee: Callee::Super(Super { span: super_span }),
                span,
                ..
            }) => {
                *expr = Expr::Paren(ParenExpr {
                    span: *span,
                    expr: Box::new(Expr::Seq(SeqExpr {
                        span: *span,
                        exprs: vec![
                            Box::new(Expr::Call(CallExpr {
                                span: *span,
                                callee: Callee::Super(Super { span: *super_span }),
                                args: Vec::new(),
                                type_args: None,
                            })),
                            Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(Box::new(self.this_id.clone().into())),
                                op: AssignOp::Assign,
                                right: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                            })),
                        ],
                    })),
                })
            }
            _ => (),
        }
    }
}
