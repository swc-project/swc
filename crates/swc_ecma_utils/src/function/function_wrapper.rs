use std::marker::PhantomData;

use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

use crate::ExprFactory;

pub struct FunctionWrapper<T> {
    pub binding_ident: Option<Ident>,
    pub function: Expr,

    pub ignore_function_name: bool,
    pub ignore_function_length: bool,

    function_ident: Option<Ident>,
    params: Vec<Param>,

    _type: PhantomData<T>,
}

impl<T> FunctionWrapper<T> {
    /// `get_params` clone only the parameters that count in function length.
    fn get_params<'a, ParamsIter, Item>(params_iter: ParamsIter) -> Vec<Param>
    where
        Item: Into<&'a Param>,
        ParamsIter: IntoIterator<Item = Item>,
    {
        params_iter
            .into_iter()
            .map(Into::into)
            .map_while(|param| match param.pat {
                Pat::Ident(..) => Some(param.clone()),
                Pat::Array(..) | Pat::Object(..) => Some(Param {
                    span: param.span,
                    decorators: param.decorators.clone(),
                    pat: private_ident!("_").into(),
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
            kind: VarDeclKind::Var,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(ref_ident.clone().into()),
                init: Some(Box::new(self.function.take())),
                definite: false,
            }],
            ..Default::default()
        }
        .into();

        let return_fn_stmt = {
            let fn_expr = self.build_function_forward(ref_ident, name_ident);

            ReturnStmt {
                span: DUMMY_SP,
                arg: Some(Box::new(fn_expr.into())),
            }
        }
        .into();

        let block_stmt = BlockStmt {
            stmts: vec![ref_decl.into(), return_fn_stmt],
            ..Default::default()
        };

        let function = Box::new(Function {
            span: DUMMY_SP,
            body: Some(block_stmt),
            is_generator: false,
            is_async: false,
            ..Default::default()
        });

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

        let ref_stmt: Stmt = VarDecl {
            kind: VarDeclKind::Var,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(ref_ident.clone().into()),
                init: Some(Box::new(self.function.take())),
                definite: false,
            }],

            ..Default::default()
        }
        .into();

        let fn_decl_stmt = {
            let FnExpr { function, .. } = self.build_function_forward(ref_ident, None);

            FnDecl {
                ident: name_ident.clone(),
                declare: false,
                function,
            }
            .into()
        };

        let return_stmt = ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(name_ident.into())),
        }
        .into();

        let block_stmt = BlockStmt {
            stmts: vec![ref_stmt, fn_decl_stmt, return_stmt],
            ..Default::default()
        };

        let function = Box::new(Function {
            span: DUMMY_SP,
            body: Some(block_stmt),
            is_generator: false,
            is_async: false,
            ..Default::default()
        });

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
    fn build_declaration_wrapper(&mut self, name_ident: Option<Ident>) -> (FnExpr, FnDecl) {
        let ref_ident = self.function_ident.as_ref().map_or_else(
            || private_ident!("_ref"),
            |ident| private_ident!(ident.span, format!("_{}", ident.sym)),
        );

        // function NAME
        let fn_expr = self.build_function_forward(ref_ident.clone(), name_ident);

        let assign_stmt = AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: ref_ident.clone().into(),
            right: Box::new(self.function.take()),
        }
        .into_stmt();

        // clone `return REF.apply(this, arguments);`
        let return_ref_apply_stmt = fn_expr
            .function
            .body
            .as_ref()
            .expect("The `fn_expr` we construct cannot be None")
            .stmts[0]
            .clone();

        let ref_fn_block_stmt = BlockStmt {
            stmts: vec![assign_stmt, return_ref_apply_stmt],
            ..Default::default()
        };

        // function REF
        let ref_decl = FnDecl {
            declare: false,
            ident: ref_ident,
            function: Box::new(Function {
                span: DUMMY_SP,
                is_async: false,
                is_generator: false,
                params: self.params.take(),
                body: Some(ref_fn_block_stmt),
                ..Default::default()
            }),
        };

        (fn_expr, ref_decl)
    }

    ///
    /// ```javascript
    /// function NAME(PARAMS) {
    ///     return REF.apply(this, arguments);
    /// }
    /// ```
    fn build_function_forward(&mut self, ref_ident: Ident, name_ident: Option<Ident>) -> FnExpr {
        let apply = ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(ref_ident.apply(
                DUMMY_SP,
                ThisExpr { span: DUMMY_SP }.into(),
                vec![quote_ident!("arguments").as_arg()],
            ))),
        }
        .into();

        FnExpr {
            ident: name_ident,
            function: Box::new(Function {
                params: self.params.take(),
                span: DUMMY_SP,
                body: Some(BlockStmt {
                    stmts: vec![apply],
                    ..Default::default()
                }),
                is_generator: false,
                is_async: false,

                ..Default::default()
            }),
        }
    }
}

impl From<FnExpr> for FunctionWrapper<Expr> {
    fn from(mut fn_expr: FnExpr) -> Self {
        let function_ident = fn_expr.ident.take();
        let params = Self::get_params(fn_expr.function.params.iter());
        Self {
            binding_ident: None,
            function_ident,
            params,
            ignore_function_name: false,
            ignore_function_length: false,
            function: fn_expr.into(),
            _type: Default::default(),
        }
    }
}

impl From<ArrowExpr> for FunctionWrapper<Expr> {
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
        let body = Some(match *body {
            BlockStmtOrExpr::BlockStmt(block) => block,
            BlockStmtOrExpr::Expr(expr) => BlockStmt {
                stmts: vec![Stmt::Return(ReturnStmt {
                    span: expr.span(),
                    arg: Some(expr),
                })],
                ..Default::default()
            },
        });

        let function = Box::new(Function {
            span,
            params: params.into_iter().map(Into::into).collect(),
            body,
            type_params: None,
            return_type: None,
            is_generator,
            is_async,
            ..Default::default()
        });

        let fn_expr = FnExpr {
            ident: None,
            function,
        };

        Self {
            binding_ident: None,
            function_ident: None,
            ignore_function_name: false,
            ignore_function_length: false,
            params: Self::get_params(fn_expr.function.params.iter()),
            function: fn_expr.into(),
            _type: Default::default(),
        }
    }
}

#[allow(clippy::from_over_into)]
impl Into<Expr> for FunctionWrapper<Expr> {
    /// If a function has a function name, it may be called recursively.
    /// We use the named expression to hoist the function name internally
    /// Therefore, its recursive calls refer to the correct identity.
    ///
    /// Else
    /// if a function has a binding name, it may be called recursively as well.
    /// But it refer the binding name which exist the outer scope.
    /// It is safe to using anonymous expression wrapper.
    ///
    /// Optimization:
    /// A function without a name cannot be recursively referenced by Ident.
    /// It's safe to return the expr without wrapper if the params.len is 0.
    fn into(mut self) -> Expr {
        if let Some(name_ident) = self.function_ident.as_ref().cloned() {
            self.build_named_expression_wrapper(name_ident)
        } else if (!self.ignore_function_name && self.binding_ident.is_some())
            || (!self.ignore_function_length && !self.params.is_empty())
        {
            self.build_anonymous_expression_wrapper()
        } else {
            self.function
        }
    }
}

impl From<FnDecl> for FunctionWrapper<FnDecl> {
    fn from(mut fn_decl: FnDecl) -> Self {
        let function_ident = Some(fn_decl.ident.take());
        let params = Self::get_params(fn_decl.function.params.iter());
        Self {
            binding_ident: None,
            function_ident,
            params,
            ignore_function_name: false,
            ignore_function_length: false,
            function: FnExpr {
                ident: None,
                function: fn_decl.function,
            }
            .into(),
            _type: Default::default(),
        }
    }
}

///
/// The result of declaration wrapper includes two parts.
/// `name_fn` is used to replace the original function.
/// `ref_fn` is an extra function called internally by `name_fn`.
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
pub struct FnWrapperResult<N, R> {
    pub name_fn: N,
    pub ref_fn: R,
}

impl From<FunctionWrapper<FnDecl>> for FnWrapperResult<FnDecl, FnDecl> {
    fn from(mut value: FunctionWrapper<FnDecl>) -> Self {
        let name_ident = value
            .function_ident
            .clone()
            .expect("`FunctionWrapper` converted from `FnDecl` definitely has `Ident`");

        let (FnExpr { function, .. }, ref_fn) = value.build_declaration_wrapper(None);

        FnWrapperResult {
            name_fn: FnDecl {
                ident: name_ident,
                declare: false,
                function,
            },
            ref_fn,
        }
    }
}

impl From<FunctionWrapper<Expr>> for FnWrapperResult<FnExpr, FnDecl> {
    fn from(mut value: FunctionWrapper<Expr>) -> Self {
        let name_ident = value
            .function_ident
            .clone()
            .or_else(|| value.binding_ident.clone());

        let (name_fn, ref_fn) = value.build_declaration_wrapper(name_ident);

        FnWrapperResult { name_fn, ref_fn }
    }
}
