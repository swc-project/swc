use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

use crate::ExprFactory;

pub struct FunctionWrapper {
    pub binding_ident: Option<Ident>,
    function_ident: Option<Ident>,

    params: Vec<Param>,
    pub function: Expr,
}

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
                    span: param.span,
                    decorators: param.decorators.clone(),
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
    fn into(mut self) -> Expr {
        // A function may be called internally recursively if it has a name
        if let Some(name_ident) = self.function_ident.as_ref().cloned() {
            self.build_named_expression_wrapper(name_ident)
        }
        // An internal recursive call has to refer to the external binding_name,
        // It is safe to using expression wrapper.
        else if self.params.len() > 0 || self.binding_ident.is_some() {
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
