use super::Analyzer;
use crate::{
    analyzer::util::{ResultExt, VarVisitor},
    errors::Error,
    ty,
    ty::Type,
    util::{PatExt, TypeEq},
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use macros::validator;
use swc_common::{Spanned, VisitMutWith, VisitWith, DUMMY_SP};
use swc_ecma_ast::*;

#[derive(Debug, Clone, Copy)]
pub(super) enum PatMode {
    /// Used for assignment expressions
    Assign,
    /// Used for variable declarations, function parameters and parameter of a
    /// catch clause
    Decl,
}

#[validator]
impl Validate<Pat> for Analyzer<'_, '_> {
    type Output = ValidationResult<ty::FnParam>;

    fn validate(&mut self, p: &mut Pat) -> Self::Output {
        self.record(p);
        if !self.is_builtin {
            debug_assert_ne!(p.span(), DUMMY_SP, "A pattern should have a valid span");
        }

        let ty = match p.get_mut_ty() {
            None => None,
            Some(ty) => Some(ty.validate_with(self)?),
        };

        match self.ctx.pat_mode {
            PatMode::Decl => {
                let mut names = vec![];

                let mut visitor = VarVisitor { names: &mut names };

                p.visit_with(&mut visitor);

                self.scope.declaring.extend(names.clone());

                match self.declare_vars_with_ty(VarDeclKind::Let, p, ty.clone()) {
                    Ok(()) => {}
                    Err(err) => {
                        self.info.errors.push(err);
                    }
                }

                self.scope.remove_declaring(names);
            }

            PatMode::Assign => {}
        }

        let ty = ty.unwrap_or_else(|| Type::any(p.span()));

        if p.get_ty().is_none() {
            p.set_ty(Some(box ty.clone().into()));
        }

        Ok(ty::FnParam {
            span: p.span(),
            pat: p.clone(),
            required: match p {
                Pat::Ident(i) => !i.optional,
                _ => true,
            },
            ty,
        })
    }
}

#[validator]
impl Validate<RestPat> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, p: &mut RestPat) -> Self::Output {
        p.visit_mut_children(self);

        let mut errors = vec![];

        if let Pat::Assign(AssignPat { ref mut right, .. }) = *p.arg {
            let res: Result<_, _> = try {
                let value_ty = right.validate_with(self)?;

                match value_ty.normalize() {
                    Type::Array(..)
                    | Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsAnyKeyword,
                        ..
                    }) => {}
                    _ => Err(Error::TS2370 { span: p.dot3_token })?,
                }
            };
            res.store(&mut errors);
        } else if let Some(ref mut type_ann) = p.type_ann {
            let res: Result<_, _> = try {
                let ty = type_ann.validate_with(self)?;

                match *ty.normalize() {
                    Type::Array(..)
                    | Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsAnyKeyword,
                        ..
                    }) => {}
                    _ => Err(Error::TS2370 { span: p.dot3_token })?,
                }
            };

            res.store(&mut errors);
        }

        self.info.errors.extend(errors);

        Ok(())
    }
}

#[validator]
impl Validate<AssignPat> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, p: &mut AssignPat) -> Self::Output {
        p.visit_mut_children(self);

        //
        match *p.left {
            Pat::Object(ref left) => {
                //
                match *p.right {
                    Expr::Object(ref right) => {
                        'l: for e in &right.props {
                            match e {
                                PropOrSpread::Prop(ref prop) => {
                                    //
                                    for lp in &left.props {
                                        match lp {
                                            ObjectPatProp::KeyValue(KeyValuePatProp {
                                                key: ref pk,
                                                ..
                                            }) => {
                                                //
                                                match **prop {
                                                    Prop::KeyValue(KeyValueProp {
                                                        ref key,
                                                        ..
                                                    }) => {
                                                        if pk.type_eq(key) {
                                                            continue 'l;
                                                        }
                                                    }
                                                    _ => {}
                                                }
                                            }
                                            _ => {}
                                        }
                                    }

                                    self.info.errors.push(Error::TS2353 { span: prop.span() })
                                }
                                _ => {}
                            }
                        }
                    }
                    _ => {
                        // TODO: Report an error
                    }
                }
            }
            _ => {}
        }

        Ok(())
    }
}
