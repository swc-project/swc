//! Handles new expressions and call expressions.
use super::super::Analyzer;
use crate::{
    analyzer::{expr::TypeOfMode, props::prop_name_to_expr, util::ResultExt},
    builtin_types,
    errors::Error,
    id::Id,
    ty,
    ty::{
        CallSignature, ClassInstance, ConstructorSignature, FnParam, Method, MethodSignature,
        QueryExpr, QueryType, Static, Type, TypeElement, TypeOrSpread, TypeParam,
        TypeParamInstantiation,
    },
    util::EqIgnoreSpan,
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use macros::validator;
use swc_atoms::js_word;
use swc_common::{Span, Spanned};
use swc_ecma_ast::*;

#[validator]
impl Validate<ExprOrSpread> for Analyzer<'_, '_> {
    type Output = ValidationResult<TypeOrSpread>;

    fn validate(&mut self, node: &mut ExprOrSpread) -> Self::Output {
        let span = node.span();
        Ok(TypeOrSpread {
            span,
            spread: node.spread,
            ty: node.expr.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<CallExpr> for Analyzer<'_, '_> {
    type Output = ValidationResult;

    fn validate(&mut self, e: &mut CallExpr) -> ValidationResult {
        self.record(e);

        let CallExpr {
            span,
            ref mut callee,
            ref mut args,
            ref mut type_args,
        } = *e;

        let callee = match callee {
            ExprOrSuper::Super(..) => return Ok(Type::any(span)),
            ExprOrSuper::Expr(callee) => callee,
        };

        // TODO: validate children

        self.extract_call_new_expr_member(callee, ExtractKind::Call, args, type_args.as_mut())
    }
}

#[validator]
impl Validate<NewExpr> for Analyzer<'_, '_> {
    type Output = ValidationResult;

    fn validate(&mut self, e: &mut NewExpr) -> ValidationResult {
        self.record(e);

        let NewExpr {
            span,
            ref mut callee,
            ref mut args,
            ref mut type_args,
        } = *e;

        // TODO: e.visit_children

        self.extract_call_new_expr_member(
            callee,
            ExtractKind::New,
            args.as_mut().map(|v| &mut **v).unwrap_or_else(|| &mut []),
            type_args.as_mut(),
        )
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ExtractKind {
    New,
    Call,
}

impl Analyzer<'_, '_> {
    /// Calculates the return type of a new /call expression.
    ///
    /// This method check arguments
    fn extract_call_new_expr_member(
        &mut self,
        callee: &mut Expr,
        kind: ExtractKind,
        args: &mut [ExprOrSpread],
        type_args: Option<&mut TsTypeParamInstantiation>,
    ) -> ValidationResult {
        let span = callee.span();

        macro_rules! callee_ty {
            () => {{
                let callee_ty = callee.validate_with(self)?;
                match *callee_ty.normalize() {
                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsAnyKeyword,
                        ..
                    }) if type_args.is_some() => self.info.errors.push(Error::TS2347 { span }),
                    _ => {}
                }
                callee_ty
            }};
        }

        match *callee {
            Expr::Ident(ref i) if i.sym == js_word!("require") => {
                if let Some(dep) = self.resolved_import_vars.get(
                    &args
                        .iter()
                        .cloned()
                        .map(|arg| match arg {
                            ExprOrSpread { spread: None, expr } => match *expr {
                                Expr::Lit(Lit::Str(Str { span, value, .. })) => {
                                    Ident::new(value.clone(), span).into()
                                }
                                _ => unimplemented!("dynamic import: require()"),
                            },
                            _ => unimplemented!("error reporting: spread element in require()"),
                        })
                        .next()
                        .unwrap(),
                ) {
                    let dep = dep.clone();
                    unimplemented!("dep: {:#?}", dep);
                }

                // if let Some(Type::Enum(ref e)) = self.scope.find_type(&i.into()) {
                //     return Ok(TsType::TsTypeRef(TsTypeRef {
                //         span,
                //         type_name: TsEntityName::Ident(i.clone()),
                //         type_params: None,
                //     })
                //     .into());
                // }
                Err(Error::UndefinedSymbol {
                    sym: i.into(),
                    span: i.span(),
                })?
            }

            _ => {}
        }

        let mut args: Vec<_> = args
            .into_iter()
            .map(|arg| {
                self.validate(arg)
                    .store(&mut self.info.errors)
                    .unwrap_or_else(|| TypeOrSpread {
                        span: arg.span(),
                        spread: arg.spread,
                        ty: Type::any(arg.expr.span()),
                    })
            })
            .collect();

        match *callee {
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(ref mut obj),
                ref mut prop,
                computed,
                ..
            }) => {
                let is_key_eq_prop = |e: &Expr| {
                    let tmp;
                    let v = match *e {
                        Expr::Ident(ref i) => {
                            tmp = Id::from(i);
                            &tmp
                        }
                        Expr::Lit(Lit::Str(ref s)) => {
                            tmp = Id::word(s.value.clone());
                            &tmp
                        }
                        _ => return false,
                    };

                    let p = match **prop {
                        Expr::Ident(ref i) => &i.sym,
                        Expr::Lit(Lit::Str(ref s)) if computed => &s.value,
                        _ => return false,
                    };

                    v.as_str() == &**p
                };

                macro_rules! search_members_for_prop {
                    ($members:expr) => {{
                        // Candidates of the method call.
                        //
                        // 4 is just an unscientific guess
                        // TODO: Use smallvec
                        let mut candidates = Vec::with_capacity(4);

                        macro_rules! check {
                            ($m:expr) => {{
                                match $m {
                                    TypeElement::Method(ref m) if kind == ExtractKind::Call => {
                                        // We are interested only on methods named `prop`
                                        if is_key_eq_prop(&m.key) {
                                            candidates.push(m.clone());
                                        }
                                    }

                                    _ => {}
                                }
                            }};
                        }

                        for m in $members {
                            check!(m);
                        }

                        {
                            // Handle methods from `interface Object`
                            let i = builtin_types::get_type(
                                self.libs,
                                span,
                                &Id::word(js_word!("Object")),
                            )
                            .expect("`interface Object` is must");
                            let methods = match i {
                                Type::Static(Static {
                                    ty: Type::Interface(i),
                                    ..
                                }) => &*i.body,

                                _ => &[],
                            };

                            // TODO: Remove clone
                            for m in methods.into_iter().map(|v| v.clone()) {
                                check!(m);
                            }
                        }

                        match candidates.len() {
                            0 => {
                                unimplemented!("no method with same name\nMembers: {:?}", $members)
                            }
                            1 => {
                                // TODO:
                                return self.check_method_call(
                                    span,
                                    &candidates.into_iter().next().unwrap(),
                                    &args,
                                );
                            }
                            _ => {
                                //
                                for c in candidates {
                                    if c.params.len() == args.len() {
                                        return self.check_method_call(span, &c, &args);
                                    }
                                }

                                unimplemented!(
                                    "multiple methods with same name and same number of arguments"
                                )
                            }
                        }
                    }};
                }

                {
                    // Handle toString()
                    macro_rules! handle {
                        () => {{
                            return Ok(Type::from(TsKeywordType {
                                span,
                                kind: TsKeywordTypeKind::TsStringKeyword,
                            }));
                        }};
                    }
                    match **prop {
                        Expr::Ident(Ident {
                            sym: js_word!("toString"),
                            ..
                        }) if !computed => handle!(),
                        Expr::Lit(Lit::Str(Str {
                            value: js_word!("toString"),
                            ..
                        })) => handle!(),

                        _ => {}
                    }
                }

                // Handle member expression
                let obj_type = self.validate(obj)?.generalize_lit().into_owned();

                let obj_type = match *obj_type.normalize() {
                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsNumberKeyword,
                        ..
                    }) => builtin_types::get_type(self.libs, span, &Id::word(js_word!("Number")))
                        .expect("Builtin type named 'Number' should exist"),
                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsStringKeyword,
                        ..
                    }) => builtin_types::get_type(self.libs, span, &Id::word(js_word!("String")))
                        .expect("Builtin type named 'String' should exist"),
                    _ => obj_type,
                };

                match *obj_type.normalize() {
                    Type::Function(ref f) if kind == ExtractKind::Call => {
                        //
                        return Ok(*f.ret_ty.clone());
                    }

                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsAnyKeyword,
                        ..
                    }) => {
                        return Ok(Type::any(span));
                    }

                    Type::Interface(ref i) => {
                        // TODO: Check parent interface
                        search_members_for_prop!(i.body.iter());
                    }

                    Type::TypeLit(ref t) => {
                        search_members_for_prop!(t.members.iter());
                    }

                    Type::Class(ty::Class { ref body, .. }) => {
                        for member in body.iter() {
                            match *member {
                                ty::ClassMember::Method(Method {
                                    ref key,
                                    ref ret_ty,
                                    ..
                                }) => {
                                    if prop_name_to_expr(key).eq_ignore_span(&*prop) {
                                        return Ok(*ret_ty.clone());
                                    }
                                }
                                _ => {}
                            }
                        }
                    }
                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsSymbolKeyword,
                        ..
                    }) => {
                        if let Ok(ty) =
                            builtin_types::get_type(self.libs, span, &Id::word(js_word!("Symbol")))
                        {
                            return Ok(ty);
                        }
                    }

                    _ => {}
                }

                if computed {
                    unimplemented!("typeof(CallExpr): {:?}[{:?}]()", obj, prop)
                } else {
                    let callee =
                        self.access_property(span, obj_type, prop, computed, TypeOfMode::RValue)?;

                    let type_args = match type_args {
                        None => None,
                        Some(v) => Some(v.validate_with(self)?),
                    };

                    match callee.normalize() {
                        Type::Method(ref m) => {
                            return self.get_return_type(
                                span,
                                m.type_params.as_ref().map(|v| &*v.params),
                                &m.params,
                                *m.ret_ty.clone(),
                                type_args.as_ref(),
                                &args,
                            );
                        }
                        Type::Function(ref f) => {
                            return self.get_return_type(
                                span,
                                f.type_params.as_ref().map(|v| &*v.params),
                                &f.params,
                                *f.ret_ty.clone(),
                                type_args.as_ref(),
                                &args,
                            );
                        }
                        Type::Class(ref cls) if kind == ExtractKind::New => {
                            // TODO: Handle type parameters.
                            return Ok(Type::ClassInstance(ClassInstance {
                                span,
                                cls: cls.clone(),
                                type_args,
                            }));
                        }
                        _ => {}
                    }

                    Err(if kind == ExtractKind::Call {
                        Error::NoCallSignature { span, callee }
                    } else {
                        Error::NoNewSignature { span, callee }
                    })
                }
            }
            _ => {
                let ty = callee_ty!();
                let ty = self.expand(span, ty)?;
                let type_args = match type_args {
                    None => None,
                    Some(ty) => Some(ty.validate_with(self)?),
                };

                Ok(self.extract(span, ty, kind, &mut args, type_args.as_ref())?)
            }
        }
    }

    fn extract(
        &mut self,
        span: Span,
        ty: Type,
        kind: ExtractKind,
        args: &[TypeOrSpread],
        type_args: Option<&TypeParamInstantiation>,
    ) -> ValidationResult {
        if cfg!(debug_assertions) {
            match *ty.normalize() {
                Type::Ref(ref s) => unreachable!("Type::Ref: {:#?}", s),
                _ => {}
            }
        }

        match kind {
            ExtractKind::New => match ty.normalize() {
                Type::Class(ref cls) => {
                    //
                    return Ok(Type::ClassInstance(ClassInstance {
                        span,
                        cls: cls.clone(),
                        type_args: type_args.cloned(),
                    }));
                }

                _ => {}
            },
            _ => {}
        }

        macro_rules! ret_err {
            () => {{
                match kind {
                    ExtractKind::Call => return Err(Error::NoCallSignature { span, callee: ty }),
                    ExtractKind::New => return Err(Error::NoNewSignature { span, callee: ty }),
                }
            }};
        }

        match *ty.normalize() {
            Type::Static(..) => unreachable!("normalize should handle Type::Static"),

            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsAnyKeyword,
                ..
            }) => return Ok(Type::any(span)),

            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUnknownKeyword,
                ..
            }) => return Err(Error::Unknown { span }),

            Type::Function(ref f) if kind == ExtractKind::Call => self.get_return_type(
                span,
                f.type_params.as_ref().map(|v| &*v.params),
                &f.params,
                *f.ret_ty.clone(),
                type_args,
                args,
            ),

            // Type::Constructor(ty::Constructor {
            //     ref params,
            //     ref type_params,
            //     ref ret_ty,
            //     ..
            // }) if kind == ExtractKind::New => self.try_instantiate_simple(
            //     span,
            //     ty.span(),
            //     &ret_ty,
            //     params,
            //     type_params.as_ref(),
            //     args,
            //     type_args,
            // ),
            Type::Union(ref u) => {
                let mut errors = vec![];
                for ty in &u.types {
                    // TODO: Remove clone
                    match self.extract(span, ty.clone(), kind, args, type_args) {
                        Ok(ty) => return Ok(ty),
                        Err(err) => errors.push(err),
                    }
                }

                Err(Error::UnionError { span, errors })
            }

            Type::Interface(ref i) => {
                // Search for methods
                match self.search_members_for_extract(span, &ty, &i.body, kind, args, type_args) {
                    Ok(ty) => return Ok(ty),
                    Err(err) => {
                        // TODO: Check parent interface
                        Err(err)?
                    }
                }
            }

            Type::TypeLit(ref l) => {
                return self
                    .search_members_for_extract(span, &ty, &l.members, kind, args, type_args);
            }

            Type::Class(ref cls) if kind == ExtractKind::New => {
                // TODO: Remove clone
                return Ok(ClassInstance {
                    span,
                    cls: cls.clone(),
                    type_args: type_args.cloned(),
                }
                .into());
            }

            Type::Query(QueryType {
                expr: QueryExpr::TsEntityName(TsEntityName::Ident(Ident { ref sym, .. })),
                ..
            }) => {
                //if self.scope.find_declaring_fn(sym) {
                //    return Ok(Type::any(span));
                //}

                ret_err!();
            }

            _ => ret_err!(),
        }
    }

    /// Search for members and returns if there's a match
    #[inline(never)]
    fn search_members_for_extract(
        &mut self,
        span: Span,
        ty: &Type,
        members: &[TypeElement],
        kind: ExtractKind,
        args: &[TypeOrSpread],
        type_args: Option<&TypeParamInstantiation>,
    ) -> ValidationResult {
        let ty_span = ty.span();

        for member in members {
            match *member {
                TypeElement::Call(CallSignature {
                    ref params,
                    ref type_params,
                    ref ret_ty,
                    ..
                }) if kind == ExtractKind::Call => {
                    //
                    match self.get_return_type(
                        span,
                        type_params.as_ref().map(|v| &*v.params),
                        params,
                        ret_ty.clone().unwrap_or(Type::any(span)),
                        type_args,
                        args,
                    ) {
                        Ok(v) => return Ok(v),
                        Err(..) => {}
                    };
                }

                TypeElement::Constructor(ConstructorSignature {
                    ref params,
                    ref type_params,
                    ref ret_ty,
                    ..
                }) if kind == ExtractKind::New => {
                    match self.get_return_type(
                        span,
                        type_params.as_ref().map(|v| &*v.params),
                        params,
                        ret_ty.clone().unwrap_or(Type::any(span)),
                        type_args,
                        args,
                    ) {
                        Ok(v) => return Ok(v),
                        Err(..) => {
                            // TODO: Handle error
                        }
                    }
                }
                _ => {}
            }
        }

        match kind {
            ExtractKind::Call => Err(Error::NoCallSignature {
                span,
                callee: ty.clone(),
            }),
            ExtractKind::New => Err(Error::NoNewSignature {
                span,
                callee: ty.clone(),
            }),
        }
    }

    fn check_method_call(
        &mut self,
        span: Span,
        c: &MethodSignature,
        args: &[TypeOrSpread],
    ) -> ValidationResult {
        // Validate arguments
        for (i, p) in c.params.iter().enumerate() {
            // TODO: Handle spread
            // TODO: Validate optional parameters
            if args.len() > i {
                let args_ty = &args[i].ty;
                if let Err(..) = self.assign(&p.ty, &args_ty, args[i].span()) {
                    continue;
                }
            }
        }

        return Ok(c.ret_ty.clone().unwrap_or_else(|| Type::any(span)));
    }

    /// Returns the
    fn get_return_type(
        &mut self,
        span: Span,
        type_params: Option<&[TypeParam]>,
        params: &[FnParam],
        ret_ty: Type,
        type_args: Option<&TypeParamInstantiation>,
        args: &[TypeOrSpread],
    ) -> ValidationResult {
        if let Some(type_params) = type_params {
            log::trace!(
                "get_return_type: \ntype_params = {:#?}\nret_ty = {:#?}",
                type_params,
                ret_ty
            );
            let ret_ty = self.expand(span, ret_ty)?;

            let inferred;
            let i = match type_args {
                Some(ty) => ty,
                None => {
                    inferred = self.infer_arg_types(span, type_params, params, args)?;
                    &inferred
                }
            };
            let ty = self.expand_type_params(i, type_params, ret_ty)?;

            return Ok(ty);
        }

        Ok(ret_ty.clone())
    }
}
