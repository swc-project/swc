use swc_ecma_visit::Fold;

macro_rules! impl_fold_fn {
    ($T:path) => {
        impl Fold for $T {
            fn fold(&mut self, f: Function) -> Function {
                if f.body.is_none() {
                    return f;
                }

                let f = validate!(f);
                let f = f.fold_children_with(self);

                let (params, body) = self.fold_fn_like(f.params, f.body.unwrap());

                validate!(Function {
                    params,
                    body: Some(body),
                    ..f
                })
            }
        }

        impl Fold for $T {
            fn fold(&mut self, f: ArrowExpr) -> ArrowExpr {
                use swc_common::Spanned;

                let f = f.fold_children_with(self);

                let was_expr = match f.body {
                    BlockStmtOrExpr::Expr(..) => true,
                    _ => false,
                };
                let body_span = f.body.span();
                let (params, mut body) = self.fold_fn_like(
                    f.params
                        .into_iter()
                        .map(|pat| Param {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            pat,
                        })
                        .collect(),
                    match f.body {
                        BlockStmtOrExpr::BlockStmt(block) => block,
                        BlockStmtOrExpr::Expr(expr) => BlockStmt {
                            span: body_span,
                            stmts: vec![Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(expr),
                            })],
                        },
                    },
                );

                let body = if was_expr
                    && body.stmts.len() == 1
                    && match body.stmts[0] {
                        Stmt::Return(ReturnStmt { arg: Some(..), .. }) => true,
                        _ => false,
                    } {
                    match body.stmts.pop().unwrap() {
                        Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => {
                            BlockStmtOrExpr::Expr(arg)
                        }
                        _ => unreachable!(),
                    }
                } else {
                    BlockStmtOrExpr::BlockStmt(body)
                };

                validate!(ArrowExpr {
                    params: params.into_iter().map(|param| param.pat).collect(),
                    body,
                    ..f
                })
            }
        }

        impl Fold for $T {
            fn fold(&mut self, f: SetterProp) -> SetterProp {
                if f.body.is_none() {
                    return f;
                }

                let f = f.fold_children_with(self);

                let (mut params, body) = self.fold_fn_like(
                    vec![Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat: f.param,
                    }],
                    f.body.unwrap(),
                );
                debug_assert!(params.len() == 1);

                validate!(SetterProp {
                    param: params.pop().unwrap().pat,
                    body: Some(body),
                    ..f
                })
            }
        }

        impl Fold for $T {
            fn fold(&mut self, f: GetterProp) -> GetterProp {
                if f.body.is_none() {
                    return f;
                }

                let f = f.fold_children_with(self);

                let (params, body) = self.fold_fn_like(vec![], f.body.unwrap());
                debug_assert_eq!(params, vec![]);

                validate!(GetterProp {
                    body: Some(body),
                    ..f
                })
            }
        }

        impl Fold for $T {
            fn fold(&mut self, f: CatchClause) -> CatchClause {
                let f = f.fold_children_with(self);

                let (mut params, body) = match f.param {
                    Some(pat) => self.fold_fn_like(
                        vec![Param {
                            span: DUMMY_SP,
                            decorators: vec![],
                            pat,
                        }],
                        f.body,
                    ),
                    None => self.fold_fn_like(vec![], f.body),
                };
                assert!(
                    params.len() == 0 || params.len() == 1,
                    "fold_fn_like should return 0 ~ 1 parameter while handling catch clause"
                );

                let param = if params.is_empty() {
                    None
                } else {
                    Some(params.pop().unwrap())
                };

                validate!(CatchClause {
                    param: param.map(|param| param.pat),
                    body,
                    ..f
                })
            }
        }

        impl Fold for $T {
            fn fold(&mut self, f: Constructor) -> Constructor {
                if f.body.is_none() {
                    return f;
                }

                let f = f.fold_children_with(self);

                let params = f
                    .params
                    .into_iter()
                    .map(|pat| match pat {
                        ParamOrTsParamProp::Param(p) => p,
                        _ => unreachable!(
                            "TsParameterProperty should be removed by typescript::strip pass"
                        ),
                    })
                    .collect();

                let (params, body) = self.fold_fn_like(params, f.body.unwrap());

                validate!(Constructor {
                    params: params.into_iter().map(ParamOrTsParamProp::Param).collect(),
                    body: Some(body),
                    ..f
                })
            }
        }
    };
}

#[cfg(test)]
#[allow(dead_code)]
pub(crate) fn validating(name: &'static str, tr: impl Fold + 'static) -> Box<dyn Pass> {
    box ::swc_common::Fold::then(tr, crate::debug::validator::Validator { name })
}

#[cfg(test)]
#[allow(unused_macros)]
macro_rules! validating {
    ($folder:expr) => {{
        crate::macros::validating(stringify!($folder), $folder)
    }};
}

macro_rules! validate {
    ($e:expr) => {{
        if cfg!(debug_assertions) {
            $e.fold_with(&mut $crate::debug::validator::Validator {
                name: concat!(file!(), ':', line!(), ':', column!()),
            })
        } else {
            $e
        }
    }};
}

#[macro_export]
macro_rules! noop_fold_type {
    ($F:ty, $N:tt) => {
        // impl Fold<swc_ecma_ast::$N> for $F {
        //     #[inline]
        //     fn fold(&mut self, node: swc_ecma_ast::$N) -> swc_ecma_ast::$N {
        //         node
        //     }
        // }
    };
    ($F:ty) => {
        noop_fold_type!($F, Accessibility);
        noop_fold_type!($F, TruePlusMinus);
        noop_fold_type!($F, TsArrayType);
        noop_fold_type!($F, TsCallSignatureDecl);
        noop_fold_type!($F, TsConditionalType);
        noop_fold_type!($F, TsConstructSignatureDecl);
        noop_fold_type!($F, TsConstructorType);
        noop_fold_type!($F, TsEntityName);
        noop_fold_type!($F, TsEnumDecl);
        noop_fold_type!($F, TsEnumMember);
        noop_fold_type!($F, TsEnumMemberId);
        noop_fold_type!($F, TsExternalModuleRef);
        noop_fold_type!($F, TsFnOrConstructorType);
        noop_fold_type!($F, TsFnParam);
        noop_fold_type!($F, TsFnType);
        noop_fold_type!($F, TsImportEqualsDecl);
        noop_fold_type!($F, TsImportType);
        noop_fold_type!($F, TsIndexSignature);
        noop_fold_type!($F, TsIndexedAccessType);
        noop_fold_type!($F, TsInferType);
        noop_fold_type!($F, TsInterfaceBody);
        noop_fold_type!($F, TsInterfaceDecl);
        noop_fold_type!($F, TsIntersectionType);
        noop_fold_type!($F, TsKeywordType);
        noop_fold_type!($F, TsKeywordTypeKind);
        noop_fold_type!($F, TsMappedType);
        noop_fold_type!($F, TsMethodSignature);
        noop_fold_type!($F, TsModuleBlock);
        noop_fold_type!($F, TsModuleDecl);
        noop_fold_type!($F, TsModuleName);
        noop_fold_type!($F, TsModuleRef);
        noop_fold_type!($F, TsNamespaceBody);
        noop_fold_type!($F, TsNamespaceDecl);
        noop_fold_type!($F, TsNamespaceExportDecl);
        noop_fold_type!($F, TsOptionalType);
        noop_fold_type!($F, TsParamProp);
        noop_fold_type!($F, TsParamPropParam);
        noop_fold_type!($F, TsParenthesizedType);
        noop_fold_type!($F, TsPropertySignature);
        noop_fold_type!($F, TsQualifiedName);
        noop_fold_type!($F, TsRestType);
        noop_fold_type!($F, TsSignatureDecl);
        noop_fold_type!($F, TsThisType);
        noop_fold_type!($F, TsThisTypeOrIdent);
        noop_fold_type!($F, TsTupleType);
        noop_fold_type!($F, TsType);
        noop_fold_type!($F, TsTypeAliasDecl);
        noop_fold_type!($F, TsTypeAnn);
        noop_fold_type!($F, TsTypeAssertion);
        noop_fold_type!($F, TsTypeCastExpr);
        noop_fold_type!($F, TsTypeElement);
        noop_fold_type!($F, TsTypeLit);
        noop_fold_type!($F, TsTypeOperator);
        noop_fold_type!($F, TsTypeOperatorOp);
        noop_fold_type!($F, TsTypeParam);
        noop_fold_type!($F, TsTypeParamDecl);
        noop_fold_type!($F, TsTypeParamInstantiation);
        noop_fold_type!($F, TsTypePredicate);
        noop_fold_type!($F, TsTypeQuery);
        noop_fold_type!($F, TsTypeQueryExpr);
        noop_fold_type!($F, TsTypeRef);
        noop_fold_type!($F, TsUnionOrIntersectionType);
        noop_fold_type!($F, TsUnionType);
    };
}

#[macro_export]
macro_rules! noop_visit_type {
    ($F:ty, $N:tt) => {
        // impl Visit<swc_ecma_ast::$N> for $F {
        //     #[inline]
        //     fn visit(&mut self, _: &swc_ecma_ast::$N) {}
        // }
    };
    ($F:ty) => {
        noop_visit_type!($F, Accessibility);
        noop_visit_type!($F, TruePlusMinus);
        noop_visit_type!($F, TsArrayType);
        noop_visit_type!($F, TsCallSignatureDecl);
        noop_visit_type!($F, TsConditionalType);
        noop_visit_type!($F, TsConstructSignatureDecl);
        noop_visit_type!($F, TsConstructorType);
        noop_visit_type!($F, TsEntityName);
        noop_visit_type!($F, TsEnumDecl);
        noop_visit_type!($F, TsEnumMember);
        noop_visit_type!($F, TsEnumMemberId);
        noop_visit_type!($F, TsExternalModuleRef);
        noop_visit_type!($F, TsFnOrConstructorType);
        noop_visit_type!($F, TsFnParam);
        noop_visit_type!($F, TsFnType);
        noop_visit_type!($F, TsImportEqualsDecl);
        noop_visit_type!($F, TsImportType);
        noop_visit_type!($F, TsIndexSignature);
        noop_visit_type!($F, TsIndexedAccessType);
        noop_visit_type!($F, TsInferType);
        noop_visit_type!($F, TsInterfaceBody);
        noop_visit_type!($F, TsInterfaceDecl);
        noop_visit_type!($F, TsIntersectionType);
        noop_visit_type!($F, TsKeywordType);
        noop_visit_type!($F, TsKeywordTypeKind);
        noop_visit_type!($F, TsMappedType);
        noop_visit_type!($F, TsMethodSignature);
        noop_visit_type!($F, TsModuleBlock);
        noop_visit_type!($F, TsModuleDecl);
        noop_visit_type!($F, TsModuleName);
        noop_visit_type!($F, TsModuleRef);
        noop_visit_type!($F, TsNamespaceBody);
        noop_visit_type!($F, TsNamespaceDecl);
        noop_visit_type!($F, TsNamespaceExportDecl);
        noop_visit_type!($F, TsOptionalType);
        noop_visit_type!($F, TsParamProp);
        noop_visit_type!($F, TsParamPropParam);
        noop_visit_type!($F, TsParenthesizedType);
        noop_visit_type!($F, TsPropertySignature);
        noop_visit_type!($F, TsQualifiedName);
        noop_visit_type!($F, TsRestType);
        noop_visit_type!($F, TsSignatureDecl);
        noop_visit_type!($F, TsThisType);
        noop_visit_type!($F, TsThisTypeOrIdent);
        noop_visit_type!($F, TsTupleType);
        noop_visit_type!($F, TsType);
        noop_visit_type!($F, TsTypeAliasDecl);
        noop_visit_type!($F, TsTypeAnn);
        noop_visit_type!($F, TsTypeAssertion);
        noop_visit_type!($F, TsTypeCastExpr);
        noop_visit_type!($F, TsTypeElement);
        noop_visit_type!($F, TsTypeLit);
        noop_visit_type!($F, TsTypeOperator);
        noop_visit_type!($F, TsTypeOperatorOp);
        noop_visit_type!($F, TsTypeParam);
        noop_visit_type!($F, TsTypeParamDecl);
        noop_visit_type!($F, TsTypeParamInstantiation);
        noop_visit_type!($F, TsTypePredicate);
        noop_visit_type!($F, TsTypeQuery);
        noop_visit_type!($F, TsTypeQueryExpr);
        noop_visit_type!($F, TsTypeRef);
        noop_visit_type!($F, TsUnionOrIntersectionType);
        noop_visit_type!($F, TsUnionType);
    };
}
