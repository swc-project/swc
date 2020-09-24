//! Handles new expressions and call expressions.
use super::super::Analyzer;
use crate::{
    analyzer::{
        expr::TypeOfMode,
        props::prop_name_to_expr,
        util::{Generalizer, ResultExt},
        Ctx,
    },
    builtin_types,
    debug::print_backtrace,
    errors::Error,
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
use swc_atoms::js_word;
use swc_common::{Span, Spanned};
use swc_ecma_ast::*;
use swc_ts_types::{FoldWith as _, Id, Symbol};
use ty::TypeExt;

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

        log::debug!("extract_call_new_expr_member");

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
            Expr::Ident(Ident {
                sym: js_word!("Symbol"),
                ..
            }) => {
                // Symbol uses special type
                if !args.is_empty() {
                    unimplemented!(
                        "Error reporting for calling `Symbol` with arguments is not implemented \
                         yet"
                    )
                }

                return Ok(box Type::Symbol(Symbol {
                    span,
                    id: self.symbols.generate(),
                }));
            }

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
                            let methods = match *i {
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
                                    &mut args,
                                );
                            }
                            _ => {
                                //
                                for c in candidates {
                                    if c.params.len() == args.len() {
                                        return self.check_method_call(span, &c, &mut args);
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
                            return Ok(box Type::from(TsKeywordType {
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
                    _ => box obj_type,
                };

                match *obj_type.normalize() {
                    Type::Function(ref f) if kind == ExtractKind::Call => {
                        //
                        return Ok(f.ret_ty.clone());
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
                                        return Ok(ret_ty.clone());
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

                let ctx = Ctx {
                    preserve_ref: false,
                    ..self.ctx
                };
                let obj_type = self.with_ctx(ctx).expand_fully(span, obj_type, true)?;

                let callee =
                    self.access_property(span, obj_type, prop, computed, TypeOfMode::RValue)?;

                let type_args = match type_args {
                    None => None,
                    Some(v) => Some(v.validate_with(self)?),
                };

                self.get_best_return_type(span, callee, kind, type_args, &mut args)
            }
            _ => {
                let ctx = Ctx {
                    preserve_ref: false,
                    ..self.ctx
                };

                self.with_ctx(ctx).with(|analyzer| {
                    let ty = {
                        let callee_ty = callee.validate_with(analyzer)?;
                        match *callee_ty.normalize() {
                            Type::Keyword(TsKeywordType {
                                kind: TsKeywordTypeKind::TsAnyKeyword,
                                ..
                            }) if type_args.is_some() => {
                                analyzer.info.errors.push(Error::TS2347 { span })
                            }
                            _ => {}
                        }
                        callee_ty
                    };
                    let ty = analyzer.expand_fully(span, ty, false)?;
                    let type_args = match type_args {
                        None => None,
                        Some(ty) => Some(ty.validate_with(analyzer)?),
                    };

                    Ok(analyzer.extract(span, ty, kind, &mut args, type_args.as_ref())?)
                })
            }
        }
    }

    fn extract(
        &mut self,
        span: Span,
        ty: Box<Type>,
        kind: ExtractKind,
        args: &mut Vec<TypeOrSpread>,
        type_args: Option<&TypeParamInstantiation>,
    ) -> ValidationResult {
        let mut new_args = vec![];
        for arg in args.drain(..) {
            let ty = arg.ty.fold_with(&mut Generalizer { force: true });
            new_args.push(TypeOrSpread {
                span: arg.span,
                spread: arg.spread,
                ty,
            })
        }
        *args = new_args;

        if cfg!(debug_assertions) {
            match *ty.normalize() {
                Type::Ref(ref s) => {
                    print_backtrace();
                    unreachable!("Type::Ref: {:#?}", s)
                }
                _ => {}
            }
        }

        match kind {
            ExtractKind::New => match ty.normalize() {
                Type::Class(ref cls) => {
                    //
                    return Ok(box Type::ClassInstance(ClassInstance {
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
                f.ret_ty.clone(),
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
            Type::Union(..) => self.get_best_return_type(span, ty, kind, type_args.cloned(), args),

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
                return Ok(box ClassInstance {
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
                callee: box ty.clone(),
            }),
            ExtractKind::New => Err(Error::NoNewSignature {
                span,
                callee: box ty.clone(),
            }),
        }
    }

    fn check_method_call(
        &mut self,
        span: Span,
        c: &MethodSignature,
        args: &mut Vec<TypeOrSpread>,
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

    fn get_best_return_type(
        &mut self,
        span: Span,
        callee: Box<Type>,
        kind: ExtractKind,
        type_args: Option<TypeParamInstantiation>,
        args: &mut Vec<TypeOrSpread>,
    ) -> ValidationResult {
        let mut new_args = vec![];
        for arg in args.drain(..) {
            let ty = arg.ty.fold_with(&mut Generalizer { force: true });
            new_args.push(TypeOrSpread {
                span: arg.span,
                spread: arg.spread,
                ty,
            })
        }
        *args = new_args;

        let cnt = callee.normalize().iter_union().count();

        log::info!("get_best_return_type: {} candidates", cnt);

        // TODO: Calculate return type only if selected
        // This can be done by storing type params, return type, params in the
        // candidates.
        let mut candidates = vec![];

        macro_rules! check {
            ($m:expr) => {{
                let m = $m;

                let type_params = m.type_params.as_ref().map(|v| &*v.params);
                if cnt == 1
                    || match self.is_exact_call(
                        span,
                        type_params,
                        &m.params,
                        type_args.as_ref(),
                        args,
                    ) {
                        Ok(true) => true,
                        _ => false,
                    }
                {
                    return self.get_return_type(
                        span,
                        type_params,
                        &m.params,
                        m.ret_ty.clone(),
                        type_args.as_ref(),
                        &args,
                    );
                }

                candidates.push(self.get_return_type(
                    span,
                    m.type_params.as_ref().map(|v| &*v.params),
                    &m.params,
                    m.ret_ty.clone(),
                    type_args.as_ref(),
                    &args,
                ));
            }};
        }

        for callee in callee.normalize().iter_union() {
            // TODO: Check if signature match.
            match callee.normalize() {
                Type::Method(ref m) => {
                    check!(m);
                }
                Type::Function(ref f) => {
                    check!(f);
                }
                Type::Class(ref cls) if kind == ExtractKind::New => {
                    // TODO: Handle type parameters.
                    return Ok(box Type::ClassInstance(ClassInstance {
                        span,
                        cls: cls.clone(),
                        type_args,
                    }));
                }
                _ => {}
            }
        }

        if !candidates.is_empty() {
            return candidates.into_iter().next().unwrap();
        }

        Err(if kind == ExtractKind::Call {
            Error::NoCallSignature { span, callee }
        } else {
            Error::NoNewSignature { span, callee }
        })
    }

    /// Returns the return type of function.
    fn get_return_type(
        &mut self,
        span: Span,
        type_params: Option<&[TypeParam]>,
        params: &[FnParam],
        ret_ty: Box<Type>,
        type_args: Option<&TypeParamInstantiation>,
        args: &[TypeOrSpread],
    ) -> ValidationResult {
        if let Some(type_params) = type_params {
            log::debug!(
                "get_return_type: \ntype_params = {:?}\nret_ty = {:?}",
                type_params,
                ret_ty
            );
            let ret_ty = self.expand(span, ret_ty)?;

            let inferred = self.infer_arg_types(span, type_args, type_params, params, args)?;

            let ty = self.expand_type_params(&inferred, ret_ty)?;

            log::debug!("get_return_type: Expanded return type = {:?}", ty);
            return Ok(ty);
        }

        Ok(ret_ty.clone())
    }

    pub(crate) fn generalize_ret_ty(&self, ty: Box<Type>) -> Box<Type> {
        if self.ctx.generalize_ret_ty {
            ty.generalize_lit()
        } else {
            ty
        }
    }

    /// This method return [Err] if call is invalid
    fn is_exact_call(
        &self,
        span: Span,
        type_params: Option<&[TypeParam]>,
        params: &[FnParam],
        type_args: Option<&TypeParamInstantiation>,
        args: &[TypeOrSpread],
    ) -> ValidationResult<bool> {
        if let Some(type_params) = type_params {
            if let Some(type_args) = type_args {
                // TODO: Handle defaults of the type parameter (Change to range)
                if type_params.len() != type_args.params.len() {
                    return Err(Error::TypeParameterCountMismatch {
                        span,
                        max: type_params.len(),
                        min: type_params.len(),
                        actual: type_args.params.len(),
                    });
                }
            }
        }

        // TODO: Handle spread

        let params_min = params.iter().filter(|param| param.required).count();
        let params_max = params.len();

        if args.len() < params_min || params_max < args.len() {
            return Err(Error::ParameterCountMismatch {
                span,
                min: params_min,
                max: params_max,
                actual: args.len(),
            });
        }

        let mut exact = true;
        for (arg, param) in args.iter().zip(params) {
            assert_eq!(arg.spread, None, "Spread type in call is not supported yet");
            self.assign(&param.ty, &arg.ty, span)?;
            if self.assign(&arg.ty, &param.ty, span).is_err() {
                exact = false
            }
        }

        Ok(exact)
    }
}
