use super::super::{pat::PatMode, Analyzer, Ctx};
use crate::{
    analyzer::util::{Generalizer, ResultExt},
    errors::Error,
    ty::{self, Tuple, Type, TypeParam, TypeParamDecl},
    util::PatExt,
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use macros::validator;
use std::mem::take;
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{FoldWith, Visit, VisitMutWith, VisitWith};
use swc_ts_types::Id;

#[validator]
impl Validate<VarDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, var: &mut VarDecl) -> Self::Output {
        self.record(&*var);

        let ctx = Ctx {
            pat_mode: PatMode::Decl,
            var_kind: var.kind,
            in_declare: self.ctx.in_declare || var.declare,
            allow_ref_declaring: true,
            ..self.ctx
        };
        self.with_ctx(ctx).with(|a| {
            var.decls.visit_mut_with(a);
        });

        // Flatten var declarations
        for mut decl in take(&mut var.decls) {
            //
            match decl.name {
                Pat::Array(ArrayPat {
                    span,
                    mut elems,
                    type_ann:
                        Some(TsTypeAnn {
                            type_ann: box TsType::TsTupleType(tuple),
                            ..
                        }),
                    ..
                }) => {
                    //
                    for (i, elem) in elems.into_iter().enumerate() {
                        match elem {
                            Some(mut pat) => {
                                //
                                if i < tuple.elem_types.len() {
                                    pat.set_ty(tuple.elem_types[i].clone().into())
                                }

                                var.decls.push(VarDeclarator {
                                    span,
                                    name: pat,
                                    init: None,
                                    definite: false,
                                })
                            }
                            None => {}
                        }
                    }
                }
                // TODO
                //  Pat::Object(obj) => {}
                _ => var.decls.push(decl),
            }
        }

        Ok(())
    }
}

#[validator]
impl Validate<VarDeclarator> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, v: &mut VarDeclarator) -> Self::Output {
        self.record(v);

        let kind = self.ctx.var_kind;

        let res: Result<_, _> = try {
            let v_span = v.span();
            if !self.is_builtin {
                debug_assert!(!v_span.is_dummy());
            }

            let debug_declaring = if cfg!(debug_assertions) {
                Some(self.scope.declaring.clone())
            } else {
                None
            };

            macro_rules! inject_any {
                () => {
                    // Declare variable with type any
                    match self.declare_complex_vars(kind, &v.name, Type::any(v_span)) {
                        Ok(()) => {}
                        Err(err) => {
                            self.info.errors.push(err);
                        }
                    }
                };
            }

            {
                // let a = {} as Foo
                match v.init {
                    Some(box Expr::TsAs(TsAsExpr { ref type_ann, .. }))
                    | Some(box Expr::TsTypeCast(TsTypeCastExpr {
                        type_ann: TsTypeAnn { ref type_ann, .. },
                        ..
                    })) => v.name.set_ty(Some(type_ann.clone())),
                    _ => {}
                }
            }

            // If user specified type, value should be removed.
            let should_remove_value = v.name.get_ty().is_some();

            macro_rules! remove_declaring {
                () => {{
                    if should_remove_value {
                        v.init = None;
                    }

                    debug_assert_eq!(Some(self.scope.declaring.clone()), debug_declaring);
                }};
            }

            if let Some(ref mut init) = v.init {
                let span = init.span();

                let declared_ty = v.name.get_mut_ty();
                if declared_ty.is_some() {
                    //TODO:
                    // self.span_allowed_implicit_any = span;
                }

                debug_assert_eq!(self.ctx.allow_ref_declaring, true);

                //  Check if v_ty is assignable to ty
                let mut value_ty = match init.validate_with(self) {
                    Ok(ty) => ty,
                    Err(err) => {
                        if self.is_builtin {
                            unreachable!("failed to assign builtin: \nError: {:?}", err)
                        } else {
                            self.info.errors.push(err);
                        }
                        inject_any!();
                        remove_declaring!();
                        return Ok(());
                    }
                };

                match declared_ty {
                    Some(ty) => {
                        log::debug!("var: user declared type");
                        let ty = match ty.validate_with(self) {
                            Ok(ty) => ty,
                            Err(err) => {
                                self.info.errors.push(err);
                                remove_declaring!();
                                return Ok(());
                            }
                        };
                        let ty = self.expand(span, ty)?;
                        self.check_rvalue(&ty);
                        value_ty = self.expand(span, value_ty)?;
                        value_ty = self.rename_type_params(span, value_ty, Some(&ty))?;

                        let ty_for_assignment = self.expand_fully(span, ty.clone(), true)?;
                        let value_ty_for_assignment =
                            self.expand_fully(span, value_ty.clone(), true)?;
                        match self.assign(&ty_for_assignment, &value_ty_for_assignment, v_span) {
                            Ok(()) => {
                                let ty = ty.fold_with(&mut Generalizer::default());
                                match self.declare_complex_vars(kind, &v.name, ty) {
                                    Ok(()) => {}
                                    Err(err) => {
                                        self.info.errors.push(err);
                                    }
                                }
                                remove_declaring!();
                                return Ok(());
                            }
                            Err(err) => {
                                self.info.errors.push(err);
                                Some(init)
                            }
                        }
                    }
                    None => {
                        // infer type from value.
                        let mut ty = (|| {
                            match value_ty {
                                Type::EnumVariant(ref v) => {
                                    if let Some(items) = self.find_type(&v.enum_name) {
                                        for ty in items {
                                            if let Type::Enum(ref e) = ty {
                                                return Type::Enum(e.clone());
                                            }
                                        }
                                    }
                                }
                                _ => {}
                            }

                            value_ty
                        })();

                        let should_generalize_fully =
                            self.may_generalize(&ty) && !contains_type_param(&ty);

                        log::debug!("var: user did not declare type");
                        let mut ty = self.rename_type_params(span, ty, None)?;
                        ty = ty.fold_with(&mut Generalizer::default());

                        if should_generalize_fully {
                            ty = match ty {
                                Type::Function(mut f) => {
                                    f.ret_ty = box f.ret_ty.generalize_lit();
                                    Type::Function(f)
                                }
                                _ => ty,
                            };
                        }

                        if self.scope.is_root() {
                            if let Some(box Expr::Ident(ref alias)) = &v.init {
                                if let Pat::Ident(ref mut i) = v.name {
                                    i.type_ann = Some(TsTypeAnn {
                                        span: DUMMY_SP,
                                        type_ann: box TsType::TsTypeQuery(TsTypeQuery {
                                            span,
                                            expr_name: TsTypeQueryExpr::TsEntityName(
                                                TsEntityName::Ident(alias.clone()),
                                            ),
                                        }),
                                    });
                                }
                            }
                            if !should_remove_value {
                                v.name.set_ty(Some(ty.clone().into()));
                            }
                        }
                        ty = self.expand(span, ty)?;
                        self.check_rvalue(&ty);

                        let mut type_errors = vec![];

                        // Handle implicit any

                        match ty {
                            Type::Tuple(Tuple { ref mut types, .. }) => {
                                for (i, t) in types.iter_mut().enumerate() {
                                    let span = t.span();

                                    match *t.normalize() {
                                        Type::Keyword(TsKeywordType {
                                            kind: TsKeywordTypeKind::TsUndefinedKeyword,
                                            ..
                                        })
                                        | Type::Keyword(TsKeywordType {
                                            kind: TsKeywordTypeKind::TsNullKeyword,
                                            ..
                                        }) => {}
                                        _ => {
                                            continue;
                                        }
                                    }
                                    // Widen tuple types
                                    *t = Type::any(span);

                                    if self.rule.no_implicit_any {
                                        match v.name {
                                            Pat::Ident(ref i) => {
                                                let span = i.span;
                                                type_errors.push(Error::ImplicitAny { span });
                                                break;
                                            }
                                            Pat::Array(ArrayPat { ref elems, .. }) => {
                                                let span = elems[i].span();
                                                type_errors.push(Error::ImplicitAny { span });
                                            }
                                            _ => {}
                                        }
                                    }
                                }
                            }
                            _ => {}
                        }

                        if !type_errors.is_empty() {
                            self.info.errors.extend(type_errors);
                            remove_declaring!();
                            return Ok(());
                        }

                        self.declare_complex_vars(kind, &v.name, ty)
                            .store(&mut self.info.errors);
                        remove_declaring!();
                        return Ok(());
                    }
                }
            } else {
                match v.name {
                    Pat::Ident(ref mut i) => {
                        //
                        let sym: Id = (&*i).into();
                        let ty = try_opt!(i.type_ann.validate_with(self));
                        let ty = match ty {
                            Some(ty) => Some(self.expand(i.span, ty)?),
                            None => None,
                        };

                        match self.declare_var(
                            i.span,
                            kind,
                            sym,
                            ty,
                            // initialized
                            false,
                            // allow_multiple
                            kind == VarDeclKind::Var,
                        ) {
                            Ok(()) => {}
                            Err(err) => {
                                self.info.errors.push(err);
                            }
                        };
                    }
                    _ => {
                        // assert!(
                        //     var.declare,
                        //     "complex pattern without initializer is invalid syntax and
                        // parser \      should handle it"
                        //  );

                        if self.ctx.in_declare {
                            match self.declare_vars(kind, &mut v.name) {
                                Ok(()) => {}
                                Err(err) => {
                                    self.info.errors.push(err);
                                }
                            };
                        } else {
                            // This is parsing error
                        }
                    }
                };
                remove_declaring!();
                return Ok(());
            };

            debug_assert_eq!(self.ctx.allow_ref_declaring, true);
            self.declare_vars(kind, &mut v.name)
                .store(&mut self.info.errors);

            remove_declaring!();
        };

        res.store(&mut self.info.errors);

        Ok(())
    }
}

struct TypeParamFinder {
    found: bool,
}

impl ty::Visit for TypeParamFinder {
    fn visit_type_param(&mut self, _: &TypeParam, _: &dyn ty::TypeNode) {
        self.found = true;
    }
}

fn contains_type_param<T>(node: &T) -> bool
where
    T: VisitWith<TypeParamFinder>,
{
    let mut v = TypeParamFinder { found: false };

    node.visit_with(&mut v);

    v.found
}
