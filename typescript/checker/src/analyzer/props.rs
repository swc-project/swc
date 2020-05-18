use super::{scope::ScopeKind, Analyzer};
use crate::{
    analyzer::{expr::TypeOfMode, util::ResultExt, Ctx},
    errors::{Error, Errors},
    ty::{MethodSignature, Operator, PropertySignature, Type, TypeElement},
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use macros::validator;
use swc_atoms::js_word;
use swc_common::{Spanned, Visit, VisitMutWith, VisitWith, DUMMY_SP};
use swc_ecma_ast::*;

#[derive(Debug, Clone, Copy)]
pub(super) enum ComputedPropMode {
    Class {
        has_body: bool,
    },
    /// Object literal
    Object,

    Interface,
}

#[validator]
impl Validate<PropName> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, node: &mut PropName) -> Self::Output {
        self.record(node);

        node.visit_mut_children(self);

        Ok(())
    }
}

#[validator]
impl Validate<ComputedPropName> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, node: &mut ComputedPropName) -> Self::Output {
        self.record(node);

        let mode = self.ctx.computed_prop_mode;

        let span = node.span;

        let is_symbol_access = match *node.expr {
            Expr::Member(MemberExpr {
                obj:
                    ExprOrSuper::Expr(box Expr::Ident(Ident {
                        sym: js_word!("Symbol"),
                        ..
                    })),
                ..
            }) => true,
            _ => false,
        };

        let mut errors = Errors::default();
        let ty = match self.validate(&mut node.expr) {
            Ok(ty) => ty,
            Err(err) => {
                match err {
                    Error::TS2585 { span } => Err(Error::TS2585 { span })?,
                    _ => {}
                }

                errors.push(err);
                // TODO: Change this to something else (maybe any)
                Type::unknown(span)
            }
        };

        match mode {
            ComputedPropMode::Class { .. } | ComputedPropMode::Interface => {
                let is_valid_key = is_valid_computed_key(&node.expr);

                let ty = self
                    .expand(node.span, ty.clone())
                    .store(&mut self.info.errors);

                if let Some(ref ty) = ty {
                    // TODO: Add support for expressions like '' + ''.
                    match *ty {
                        _ if is_valid_key => {}
                        Type::Lit(..) => {}
                        Type::EnumVariant(..) => {}
                        _ if ty.is_kwd(TsKeywordTypeKind::TsSymbolKeyword)
                            || ty.is_unique_symbol() => {}
                        _ if is_symbol_access => {
                            errors.push(Error::NonSymbolTypedFieldFromSymbol {
                                span: node.expr.span(),
                            })
                        }
                        _ => match mode {
                            ComputedPropMode::Class { .. } => {
                                errors.push(Error::TS1168 { span: node.span })
                            }
                            ComputedPropMode::Interface => {
                                errors.push(Error::TS1169 { span: node.span })
                            }
                            _ => {}
                        },
                    }
                }
            }

            _ => {}
        }

        if match mode {
            ComputedPropMode::Class { has_body } => !has_body,
            ComputedPropMode::Object => errors.is_empty(),
            // TODO:
            ComputedPropMode::Interface => errors.is_empty(),
        } {
            let ty = ty.generalize_lit();
            match *ty.normalize() {
                Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsAnyKeyword,
                    ..
                })
                | Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsStringKeyword,
                    ..
                })
                | Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsNumberKeyword,
                    ..
                })
                | Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsSymbolKeyword,
                    ..
                })
                | Type::Operator(Operator {
                    op: TsTypeOperatorOp::Unique,
                    ty:
                        box Type::Keyword(TsKeywordType {
                            kind: TsKeywordTypeKind::TsSymbolKeyword,
                            ..
                        }),
                    ..
                }) => {}
                _ if is_symbol_access => {}
                _ => errors.push(Error::TS2464 { span }),
            }
        }
        if !errors.is_empty() {
            Err(Error::Errors {
                span,
                errors: errors.into(),
            })?
        }

        Ok(())
    }
}

#[validator]
impl Validate<Prop> for Analyzer<'_, '_> {
    type Output = ValidationResult<TypeElement>;

    fn validate(&mut self, prop: &mut Prop) -> Self::Output {
        self.record(prop);

        let ctx = Ctx {
            computed_prop_mode: ComputedPropMode::Object,
            ..self.ctx
        };

        let old_this = self.scope.this.take();
        let res = self.with_ctx(ctx).validate_prop(prop);
        self.scope.this = old_this;

        res
    }
}

impl Analyzer<'_, '_> {
    fn validate_prop(&mut self, prop: &mut Prop) -> ValidationResult<TypeElement> {
        self.scope.this = Some(Ident::new(js_word!(""), DUMMY_SP).into());

        let span = prop.span();
        // TODO: Validate prop key
        let key = prop_key_to_expr(&prop);

        match prop {
            Prop::Shorthand(ref i) => {
                // TODO: Check if RValue is correct
                self.type_of_var(&i, TypeOfMode::RValue, None)
                    .store(&mut self.info.errors);
            }
            _ => {}
        }

        let span = prop.span();
        let key = prop_key_to_expr(&prop);

        Ok(match *prop {
            Prop::Shorthand(..) => PropertySignature {
                span: prop.span(),
                key: prop_key_to_expr(&prop),
                params: Default::default(),
                optional: false,
                readonly: false,
                computed: false,
                type_ann: Default::default(),
                type_params: Default::default(),
            }
            .into(),

            Prop::KeyValue(ref mut kv) => {
                let computed = match kv.key {
                    PropName::Computed(_) => true,
                    _ => false,
                };
                let ty = kv.value.validate_with(self)?;

                PropertySignature {
                    span,
                    key,
                    params: Default::default(),
                    optional: false,
                    readonly: false,
                    computed,
                    type_ann: Some(ty),
                    type_params: Default::default(),
                }
                .into()
            }

            Prop::Assign(ref mut p) => unimplemented!("type_of_prop(AssignProperty): {:?}", p),
            Prop::Getter(ref mut p) => p.validate_with(self)?,
            Prop::Setter(ref mut p) => {
                let parma_span = p.param.span();
                let mut param = &mut p.param;

                self.with_child(ScopeKind::Fn, Default::default(), {
                    |child| -> ValidationResult<_> {
                        Ok(PropertySignature {
                            span,
                            key,
                            params: vec![param.validate_with(child)?],
                            optional: false,
                            readonly: false,
                            computed: false,
                            type_ann: Some(Type::any(parma_span)),
                            type_params: Default::default(),
                        }
                        .into())
                    }
                })?
            }

            Prop::Method(ref mut p) => {
                let computed = match p.key {
                    PropName::Computed(..) => true,
                    _ => false,
                };

                if let Some(body) = &mut p.function.body {
                    let inferred_ret_ty = self
                        .visit_stmts_for_return(&mut body.stmts)?
                        .unwrap_or_else(|| {
                            Type::Keyword(TsKeywordType {
                                span: body.span,
                                kind: TsKeywordTypeKind::TsVoidKeyword,
                            })
                        });

                    if p.function.return_type.is_none() {
                        p.function.return_type = Some(inferred_ret_ty.clone().into())
                    }

                    // TODO: Assign
                }

                MethodSignature {
                    span,
                    readonly: false,
                    key,
                    computed,
                    optional: false,
                    params: p.function.params.validate_with(self)?,
                    ret_ty: try_opt!(p.function.return_type.validate_with(self)),
                    type_params: try_opt!(p.function.type_params.validate_with(self)),
                }
                .into()
            }
        })
    }
}

#[validator]
impl Validate<GetterProp> for Analyzer<'_, '_> {
    type Output = ValidationResult<TypeElement>;

    fn validate(&mut self, n: &mut GetterProp) -> Self::Output {
        self.record(n);

        let type_ann = self
            .with_child(ScopeKind::Fn, Default::default(), |child| {
                n.key.visit_mut_with(child);

                if let Some(body) = &mut n.body {
                    let ret_ty = child.visit_stmts_for_return(&mut body.stmts)?;
                    if let None = ret_ty {
                        // getter property must have return statements.
                        child.info.errors.push(Error::TS2378 { span: n.key.span() });
                    }

                    return Ok(ret_ty);
                }

                Ok(None)
            })
            .store(&mut self.info.errors)
            .flatten();

        Ok(PropertySignature {
            span: n.span(),
            key: prop_name_to_expr(&n.key),
            params: Default::default(),
            optional: false,
            readonly: true,
            computed: false,
            type_ann,
            type_params: Default::default(),
        }
        .into())
    }
}

fn prop_key_to_expr(p: &Prop) -> Box<Expr> {
    match *p {
        Prop::Shorthand(ref i) => box Expr::Ident(i.clone()),
        Prop::Assign(AssignProp { ref key, .. }) => box Expr::Ident(key.clone()),
        Prop::Getter(GetterProp { ref key, .. })
        | Prop::KeyValue(KeyValueProp { ref key, .. })
        | Prop::Method(MethodProp { ref key, .. })
        | Prop::Setter(SetterProp { ref key, .. }) => prop_name_to_expr(key),
    }
}

pub(super) fn prop_name_to_expr(key: &PropName) -> Box<Expr> {
    match *key {
        PropName::Computed(ref p) => p.expr.clone(),
        PropName::Ident(ref ident) => box Expr::Ident(ident.clone()),
        PropName::Str(ref s) => box Expr::Lit(Lit::Str(Str { ..s.clone() })),
        PropName::Num(ref s) => box Expr::Lit(Lit::Num(Number { ..s.clone() })),
    }
}

fn is_valid_computed_key(key: &Expr) -> bool {
    let mut v = ValidKeyChecker { valid: true };
    key.visit_with(&mut v);
    v.valid
}

#[derive(Debug)]
struct ValidKeyChecker {
    valid: bool,
}

impl Visit<Ident> for ValidKeyChecker {
    fn visit(&mut self, _: &Ident) {
        self.valid = false;
    }
}
