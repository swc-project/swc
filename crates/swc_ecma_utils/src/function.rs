use swc_atoms::js_word;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

#[derive(Clone, Default)]
pub struct WrapperState {
    this: Option<Ident>,
    args: Option<Ident>,
    new_target: Option<Ident>,
}

impl WrapperState {
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
                    meta: Ident::new(js_word!("new"), DUMMY_SP),
                    prop: Ident::new(js_word!("target"), DUMMY_SP),
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
                    meta: Ident::new(js_word!("new"), DUMMY_SP),
                    prop: Ident::new(js_word!("target"), DUMMY_SP),
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

impl Take for WrapperState {
    fn dummy() -> Self {
        Self::default()
    }
}

pub struct FunctionWrapper<'a> {
    state: &'a mut WrapperState,
}

impl<'a> FunctionWrapper<'a> {
    pub fn new(state: &'a mut WrapperState) -> Self {
        FunctionWrapper { state }
    }
}

impl<'a> VisitMut for FunctionWrapper<'a> {
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
        if m.computed {
            m.prop.visit_mut_with(self);
        }

        m.obj.visit_mut_with(self);
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
                callee: ExprOrSuper::Super(Super { span: super_span }),
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
                                callee: ExprOrSuper::Super(Super { span: *super_span }),
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
