use swc_atoms::js_word;
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::ExprFactory;

#[derive(Clone, Default)]
pub struct FunctionEnvironmentState {
    this: Option<Ident>,
    args: Option<Ident>,
    new_target: Option<Ident>,
}

impl FunctionEnvironmentState {
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

impl Take for FunctionEnvironmentState {
    fn dummy() -> Self {
        Self::default()
    }
}

pub struct FunctionEnvironmentUnwraper<'a> {
    state: &'a mut FunctionEnvironmentState,
}

impl<'a> FunctionEnvironmentUnwraper<'a> {
    pub fn new(state: &'a mut FunctionEnvironmentState) -> Self {
        FunctionEnvironmentUnwraper { state }
    }
}

impl<'a> VisitMut for FunctionEnvironmentUnwraper<'a> {
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

pub struct FunctionWrapper {
    pub binding_ident: Option<Ident>,
    function_ident: Option<Ident>,

    params: Vec<Param>,
    pub function: Expr,
}

impl VisitMut for FunctionWrapper {}

impl From<FnExpr> for FunctionWrapper {
    fn from(mut fn_expr: FnExpr) -> Self {
        let function_ident = fn_expr.ident.take();
        Self {
            binding_ident: None,
            function_ident,
            params: Self::get_params(fn_expr.function.params.iter()),
            function: fn_expr.into(),
        }
    }
}

impl From<FnDecl> for FunctionWrapper {
    fn from(mut fn_decl: FnDecl) -> Self {
        let function_ident = Some(fn_decl.ident.take());
        Self {
            binding_ident: None,
            function_ident,
            params: Self::get_params(fn_decl.function.params.iter()),
            function: FnExpr {
                ident: None,
                function: fn_decl.function,
            }
            .into(),
        }
    }
}

impl From<ArrowExpr> for FunctionWrapper {
    fn from(
        ArrowExpr {
            span,
            params,
            body,
            is_async,
            is_generator,
            ..
        }: ArrowExpr,
    ) -> Self {
        let body = Some(match body {
            BlockStmtOrExpr::BlockStmt(block) => block,
            BlockStmtOrExpr::Expr(expr) => BlockStmt {
                span: DUMMY_SP,
                stmts: vec![Stmt::Return(ReturnStmt {
                    span: expr.span(),
                    arg: Some(expr),
                })],
            },
        });

        let function = Function {
            span,
            params: params.into_iter().map(Into::into).collect(),
            decorators: Default::default(),
            body,
            type_params: None,
            return_type: None,
            is_generator,
            is_async,
        };

        let fn_expr = FnExpr {
            ident: None,
            function,
        };

        Self {
            binding_ident: None,
            function_ident: None,
            params: Self::get_params(fn_expr.function.params.iter()),
            function: fn_expr.into(),
        }
    }
}

impl TryFrom<VarDeclarator> for FunctionWrapper {
    type Error = ();

    fn try_from(var: VarDeclarator) -> Result<Self, Self::Error> {
        if let VarDeclarator {
            name: Pat::Ident(BindingIdent {
                id: binding_ident, ..
            }),
            init: Some(init),
            ..
        } = var
        {
            match *init {
                Expr::Fn(fn_expr) => {
                    let mut wrapper = Self::from(fn_expr);
                    wrapper.binding_ident = Some(binding_ident);

                    Ok(wrapper)
                }

                Expr::Arrow(arrow_expr) => {
                    let mut wrapper = Self::from(arrow_expr);
                    wrapper.binding_ident = Some(binding_ident);

                    Ok(wrapper)
                }

                _ => Err(()),
            }
        } else {
            Err(())
        }
    }
}

impl FunctionWrapper {
    fn get_params<'a, T, P>(params_iter: T) -> Vec<Param>
    where
        P: Into<&'a Param>,
        T: IntoIterator<Item = P>,
    {
        params_iter
            .into_iter()
            .map(Into::into)
            .map_while(|param| match param.pat {
                Pat::Ident(..) => Some(param.clone()),
                Pat::Array(..) | Pat::Object(..) => Some(Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(private_ident!("_").into()),
                }),
                _ => None,
            })
            .collect()
    }

    ///
    /// ```javascript
    /// (function () {
    ///     var REF = FUNCTION;
    ///     return function NAME(PARAMS) {
    ///         return REF.apply(this, arguments);
    ///     };
    /// })()
    /// ```
    fn build_anonymous_expression_wrapper(&mut self) -> Expr {
        let name_ident = self.binding_ident.take();
        let ref_ident = private_ident!("_ref");

        let ref_decl: Decl = VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(ref_ident.clone().into()),
                init: Some(Box::new(self.function.take())),
                definite: false,
            }],
            declare: false,
        }
        .into();

        let fn_expr = self.build_function_forward(ref_ident, name_ident);

        let return_fn_stmt = ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(fn_expr.into())),
        }
        .into();

        let block_stmt = BlockStmt {
            span: DUMMY_SP,
            stmts: vec![ref_decl.into(), return_fn_stmt],
        };

        let function = Function {
            span: DUMMY_SP,
            body: Some(block_stmt),
            params: Default::default(),
            is_generator: false,
            is_async: false,
            decorators: Default::default(),
            return_type: Default::default(),
            type_params: Default::default(),
        };

        FnExpr {
            ident: None,
            function,
        }
        .as_iife()
        .into()
    }

    ///
    /// ```javascript
    /// (function () {
    ///     var REF = FUNCTION;
    ///     function NAME(PARAMS) {
    ///         return REF.apply(this, arguments);
    ///     }
    ///     return NAME;
    /// })()
    /// ```
    fn build_named_expression_wrapper(&mut self, name_ident: Ident) -> Expr {
        let ref_ident = self.function_ident.as_ref().map_or_else(
            || private_ident!("_ref"),
            |ident| private_ident!(ident.span, format!("_{}", ident.sym)),
        );

        let ref_stmt: Stmt = Stmt::Decl(
            VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(ref_ident.clone().into()),
                    init: Some(Box::new(self.function.take())),
                    definite: false,
                }],
                declare: false,
            }
            .into(),
        );

        let FnExpr { function, .. } =
            self.build_function_forward(ref_ident, Some(name_ident.clone()));

        let fn_stmt = Stmt::Decl(
            FnDecl {
                ident: name_ident.clone(),
                declare: false,
                function,
            }
            .into(),
        );

        let return_fn_indent = Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(name_ident.into())),
        });

        let block_stmt = BlockStmt {
            span: DUMMY_SP,
            stmts: vec![ref_stmt, fn_stmt, return_fn_indent],
        };

        let function = Function {
            span: DUMMY_SP,
            body: Some(block_stmt),
            params: Default::default(),
            is_generator: false,
            is_async: false,
            decorators: Default::default(),
            return_type: Default::default(),
            type_params: Default::default(),
        };

        FnExpr {
            ident: None,
            function,
        }
        .as_iife()
        .into()
    }

    ///
    /// ```javascript
    /// function NAME(PARAMS) {
    ///     return REF.apply(this, arguments);
    /// }
    /// function REF() {
    ///     REF = FUNCTION;
    ///     return REF.apply(this, arguments);
    /// }
    /// ```
    fn build_declaration_wrapper(&mut self, name_ident: Ident) -> (FnDecl, FnDecl) {
        let ref_ident = self.function_ident.as_ref().map_or_else(
            || private_ident!("_ref"),
            |ident| private_ident!(ident.span, format!("_{}", ident.sym)),
        );

        let FnExpr { function, .. } =
            self.build_function_forward(ref_ident.clone(), Some(name_ident.clone()));

        let assign_stmt = AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::Assign,
            left: PatOrExpr::Expr(Box::new(Expr::Ident(ref_ident.clone()))),
            right: Box::new(self.function.take()),
        }
        .into_stmt();

        // clone `return REF.apply(this, arguments);`
        let return_ref_apply_stmt = function.body.as_ref().unwrap().stmts[0].clone();

        let ref_fn_block_stmt = BlockStmt {
            span: DUMMY_SP,
            stmts: vec![assign_stmt, return_ref_apply_stmt],
        };

        let ref_decl = FnDecl {
            ident: ref_ident,
            declare: false,
            function: Function {
                span: DUMMY_SP,
                is_async: false,
                is_generator: false,
                params: self.params.take(),
                body: Some(ref_fn_block_stmt),
                decorators: Default::default(),
                type_params: Default::default(),
                return_type: Default::default(),
            },
        };

        let name_decl = FnDecl {
            ident: name_ident,
            function,
            declare: false,
        };

        (name_decl, ref_decl)
    }

    ///
    /// ```javascript
    /// function NAME(PARAMS) {
    ///     return REF.apply(this, arguments);
    /// }
    /// ```
    fn build_function_forward(&mut self, ref_ident: Ident, name_ident: Option<Ident>) -> FnExpr {
        let apply = Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(ref_ident.apply(
                DUMMY_SP,
                Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                vec![quote_ident!("arguments").as_arg()],
            ))),
        });

        FnExpr {
            ident: name_ident,
            function: Function {
                span: DUMMY_SP,
                is_async: false,
                is_generator: false,
                params: self.params.take(),
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![apply],
                }),
                decorators: Default::default(),
                type_params: Default::default(),
                return_type: Default::default(),
            },
        }
    }
}

impl Into<Expr> for FunctionWrapper {
    // Can't figure out why not use named templates when got binding_name.
    // But this is Babel's behavior. Let's follow it.
    fn into(mut self) -> Expr {
        if let Some(name_ident) = self.function_ident.as_ref().cloned() {
            self.build_named_expression_wrapper(name_ident)
        } else if self.params.len() > 0 || self.binding_ident.is_some() {
            self.build_anonymous_expression_wrapper()
        } else {
            // Optimization: no name, no params
            self.function
        }
    }
}

impl Into<(FnDecl, FnDecl)> for FunctionWrapper {
    fn into(mut self) -> (FnDecl, FnDecl) {
        let name_ident = self.function_ident.as_ref().or(self.binding_ident.as_ref());
        assert!(name_ident.is_some());
        let name_ident = name_ident.unwrap().clone();

        self.build_declaration_wrapper(name_ident)
    }
}
