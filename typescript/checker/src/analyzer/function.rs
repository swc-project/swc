use super::Analyzer;
use crate::{
    analyzer::{pat::PatMode, util::ResultExt, Ctx, ScopeKind},
    errors::Error,
    swc_common::VisitWith,
    ty,
    ty::{ClassInstance, FnParam, QueryType, Tuple, Type, TypeParam, TypeParamDecl},
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use macros::validator;
use swc_common::{Fold, FoldWith, Spanned, Visit, DUMMY_SP};
use swc_ecma_ast::*;

#[validator]
impl Validate<Function> for Analyzer<'_, '_> {
    type Output = ValidationResult<ty::Function>;

    fn validate(&mut self, f: &mut Function) -> Self::Output {
        self.record(f);

        self.with_child(ScopeKind::Fn, Default::default(), |child| {
            let mut errors = vec![];

            {
                // Validate params
                // TODO: Move this to parser
                let mut has_optional = false;
                for p in &f.params {
                    if has_optional {
                        match p.pat {
                            Pat::Ident(Ident { optional: true, .. }) | Pat::Rest(..) => {}
                            _ => {
                                child.info.errors.push(Error::TS1016 { span: p.span() });
                            }
                        }
                    }

                    match p.pat {
                        Pat::Ident(Ident { optional, .. }) => {
                            // Allow optional after optional parameter
                            if optional {
                                has_optional = true;
                            }
                        }
                        _ => {}
                    }
                }
            }

            let mut type_params = try_opt!(f.type_params.validate_with(child));

            let mut params = {
                let ctx = Ctx {
                    pat_mode: PatMode::Decl,
                    allow_ref_declaring: false,
                    ..child.ctx
                };
                f.params.validate_with(&mut *child.with_ctx(ctx))?
            };

            if !child.is_builtin {
                params = params
                    .into_iter()
                    .map(|param: FnParam| -> Result<_, Error> {
                        let ty = child.expand(param.span, param.ty)?;
                        Ok(FnParam { ty, ..param })
                    })
                    .collect::<Result<_, _>>()?;
            }

            let declared_ret_ty = try_opt!(f.return_type.validate_with(child)).map(|ret_ty| {
                let span = ret_ty.span();
                match ret_ty {
                    Type::Class(cls) => Type::ClassInstance(ClassInstance {
                        span,
                        cls,
                        type_args: None,
                    }),
                    ty => ty,
                }
            });

            let inferred_return_type = try_opt!(f
                .body
                .as_mut()
                .map(|body| child.visit_stmts_for_return(&mut body.stmts)));

            let inferred_return_type = match inferred_return_type {
                Some(Some(inferred_return_type)) => {
                    if let Some(ref declared) = declared_ret_ty {
                        // Expand before assigning
                        let declared = child.expand_fully(f.span, declared.clone(), true)?;
                        let span = inferred_return_type.span();

                        child.assign(&declared, &inferred_return_type, span)?;
                    }

                    inferred_return_type
                }
                Some(None) => {
                    let mut span = f.span;

                    if let Some(ref declared) = declared_ret_ty {
                        span = declared.span();

                        match *declared.normalize() {
                            Type::Keyword(TsKeywordType {
                                kind: TsKeywordTypeKind::TsAnyKeyword,
                                ..
                            })
                            | Type::Keyword(TsKeywordType {
                                kind: TsKeywordTypeKind::TsVoidKeyword,
                                ..
                            })
                            | Type::Keyword(TsKeywordType {
                                kind: TsKeywordTypeKind::TsNeverKeyword,
                                ..
                            }) => {}
                            _ => errors.push(Error::ReturnRequired { span }),
                        }
                    }

                    // No return statement -> void
                    Type::Keyword(TsKeywordType {
                        span,
                        kind: TsKeywordTypeKind::TsVoidKeyword,
                    })
                }
                None => Type::any(f.span),
            };

            child.info.errors.extend(errors);

            Ok(ty::Function {
                span: f.span,
                params,
                type_params,
                ret_ty: box declared_ret_ty.unwrap_or_else(|| inferred_return_type),
            }
            .into())
        })
    }
}

impl Analyzer<'_, '_> {
    /// TODO: Handle recursive funciton
    fn visit_fn(&mut self, name: Option<&Ident>, f: &mut Function) -> Type {
        let fn_ty: Result<_, _> = try {
            let no_implicit_any_span = name.as_ref().map(|name| name.span);

            // if let Some(name) = name {
            //     // We use `typeof function` to infer recursive function's return type.
            //     match self.declare_var(
            //         f.span,
            //         VarDeclKind::Var,
            //         name.sym.clone(),
            //         Some(Type::Query(QueryType {
            //             span: f.span,
            //             expr: TsEntityName::Ident(name.clone()).into(),
            //         })),
            //         // value is initialized
            //         true,
            //         // Allow overriding
            //         true,
            //     ) {
            //         Ok(()) => {}
            //         Err(err) => {
            //             self.info.errors.push(err);
            //         }
            //     }
            // }

            if let Some(name) = name {
                assert_eq!(self.scope.declaring_fn, None);
                self.scope.declaring_fn = Some(name.sym.clone());
            }

            let mut fn_ty: ty::Function = f.validate_with(self)?;
            // Handle type parameters in return type.
            fn_ty.ret_ty = fn_ty.ret_ty.fold_with(&mut TypeParamHandler {
                params: fn_ty.type_params.as_ref().map(|v| &*v.params),
            });
            match fn_ty {
                ty::Function { ref mut ret_ty, .. } => {
                    match **ret_ty {
                        // Handle tuple widening of the return type.
                        Type::Tuple(Tuple { ref mut types, .. }) => {
                            for t in types.iter_mut() {
                                let span = t.span();

                                match t.normalize() {
                                    Type::Keyword(TsKeywordType {
                                        kind: TsKeywordTypeKind::TsUndefinedKeyword,
                                        ..
                                    })
                                    | Type::Keyword(TsKeywordType {
                                        kind: TsKeywordTypeKind::TsNullKeyword,
                                        ..
                                    }) => {}
                                    _ => continue,
                                }

                                //if child.rule.no_implicit_any
                                //    && child.span_allowed_implicit_any != f.span
                                //{
                                //    child.info.errors.push(Error::ImplicitAny {
                                //        span: no_implicit_any_span.unwrap_or(span),
                                //    });
                                //}

                                *t = Type::any(span);
                            }
                        }

                        _ => {}
                    }
                }
            }

            if let Some(name) = name {
                self.scope.declaring_fn = None;
            }

            fn_ty
        };

        match fn_ty {
            Ok(ty) => ty.into(),
            Err(err) => {
                self.info.errors.push(err);
                Type::any(f.span)
            }
        }
    }
}

#[validator]
impl Validate<FnDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    /// NOTE: This method **should not call f.fold_children(self)**
    fn validate(&mut self, f: &mut FnDecl) -> Self::Output {
        let fn_ty = self.visit_fn(Some(&f.ident), &mut f.function).freeze();

        self.register_type(f.ident.sym.clone(), fn_ty.clone())
            .store(&mut self.info.errors);
        match self.override_var(VarDeclKind::Var, f.ident.sym.clone(), fn_ty) {
            Ok(()) => {}
            Err(err) => {
                self.info.errors.push(err);
            }
        }

        Ok(())
    }
}

#[validator]
impl Validate<FnExpr> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    /// NOTE: This method **should not call f.fold_children(self)**
    fn validate(&mut self, f: &mut FnExpr) -> Self::Output {
        self.visit_fn(f.ident.as_ref(), &mut f.function);

        Ok(())
    }
}

struct TypeParamHandler<'a> {
    params: Option<&'a [TypeParam]>,
}

impl Fold<Type> for TypeParamHandler<'_> {
    fn fold(&mut self, ty: Type) -> Type {
        if let Some(params) = self.params {
            let ty: Type = ty.fold_children(self);

            match ty {
                Type::Ref(ref r) if r.type_args.is_none() => match r.type_name {
                    TsEntityName::Ident(ref i) => {
                        //
                        for param in params {
                            if param.name == i.sym {
                                return Type::Param(param.clone());
                            }
                        }
                    }
                    _ => {}
                },

                _ => {}
            }

            ty
        } else {
            ty
        }
    }
}
