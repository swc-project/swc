use super::{control_flow::RemoveTypes, export::pat_to_ts_fn_param, Analyzer};
use crate::{
    builtin_types,
    errors::Error,
    ty::{self, Array, EnumVariant, Intersection, Type, TypeRef, Union},
    util::{CowUtil, EqIgnoreSpan, IntoCow},
};
use std::borrow::Cow;
use swc_atoms::js_word;
use swc_common::{Span, Spanned, Visit, VisitWith};
use swc_ecma_ast::*;

impl Analyzer<'_, '_> {
    pub(super) fn type_of<'e>(&'e self, expr: &'e Expr) -> Result<TypeRef<'e>, Error> {
        let span = expr.span();

        Ok(match *expr {
            Expr::This(ThisExpr { span }) => Cow::Owned(TsType::from(TsThisType { span }).into()),

            Expr::Ident(Ident {
                sym: js_word!("undefined"),
                ..
            }) => Type::undefined(span).owned(),

            Expr::Ident(ref i) => {
                if i.sym == js_word!("require") {
                    unreachable!("typeof(require('...'))");
                }

                if let Some(ty) = self.resolved_imports.get(&i.sym) {
                    return Ok(Cow::Borrowed(&**ty));
                }

                if let Some(ty) = self.find_type(&i.sym) {
                    return Ok(Cow::Borrowed(ty));
                }

                if let Some(ty) = self.find_var_type(&i.sym) {
                    return Ok(Cow::Borrowed(ty));
                }

                if let Some(_var) = self.find_var(&i.sym) {
                    // TODO: Infer type or use type hint to handle
                    //
                    // let id: (x: Foo) => Foo = x => x;
                    //

                    return Ok(Type::any(span).into_cow());
                }

                if let Some(ty) = builtin_types::get(self.libs, &i.sym) {
                    return Ok(ty);
                }

                // println!(
                //     "({}) undefined symbol: {}\n{:#?}",
                //     self.scope.depth(),
                //     i.sym,
                //     self.scope
                // );

                return Err(Error::UndefinedSymbol { span: i.span });
            }

            Expr::Array(ArrayLit { ref elems, .. }) => {
                let mut types: Vec<Type> = vec![];

                for elem in elems {
                    match elem {
                        Some(ExprOrSpread {
                            spread: None,
                            ref expr,
                        }) => {
                            let ty = self.type_of(expr)?.into_owned().generalize_lit();
                            if types.iter().all(|l| !l.eq_ignore_span(&ty)) {
                                types.push(ty)
                            }
                        }
                        Some(ExprOrSpread {
                            spread: Some(..), ..
                        }) => unimplemented!("type of array spread"),
                        None => {
                            let ty = Type::undefined(span);
                            if types.iter().all(|l| !l.eq_ignore_span(&ty)) {
                                types.push(ty)
                            }
                        }
                    }
                }

                Type::Array(Array {
                    span,
                    elem_type: match types.len() {
                        0 => box Type::any(span),
                        1 => box types.into_iter().next().unwrap(),
                        _ => box Union { span, types }.into(),
                    },
                })
                .owned()
            }

            Expr::Lit(Lit::Bool(v)) => Type::Lit(TsLitType {
                span: v.span,
                lit: TsLit::Bool(v),
            })
            .into_cow(),
            Expr::Lit(Lit::Str(ref v)) => Type::Lit(TsLitType {
                span: v.span,
                lit: TsLit::Str(v.clone()),
            })
            .into_cow(),
            Expr::Lit(Lit::Num(v)) => Type::Lit(TsLitType {
                span: v.span,
                lit: TsLit::Number(v),
            })
            .into_cow(),
            Expr::Lit(Lit::Null(Null { span })) => Type::Keyword(TsKeywordType {
                span,
                kind: TsKeywordTypeKind::TsNullKeyword,
            })
            .into_cow(),
            Expr::Lit(Lit::Regex(..)) => TsType::TsTypeRef(TsTypeRef {
                span,
                type_name: TsEntityName::Ident(Ident {
                    span,
                    sym: js_word!("RegExp"),
                    optional: false,
                    type_ann: None,
                }),
                type_params: None,
            })
            .into_cow(),

            Expr::Paren(ParenExpr { ref expr, .. }) => return self.type_of(expr),

            Expr::Tpl(..) => Type::Keyword(TsKeywordType {
                span,
                kind: TsKeywordTypeKind::TsStringKeyword,
            })
            .into_cow(),

            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
                ..
            }) => negate(self.type_of(arg)?.into_owned()).owned(),

            Expr::Unary(UnaryExpr {
                op: op!("typeof"), ..
            }) => Type::Keyword(TsKeywordType {
                span,
                kind: TsKeywordTypeKind::TsStringKeyword,
            })
            .into_cow(),

            Expr::TsAs(TsAsExpr { ref type_ann, .. }) => type_ann.clone().into_cow(),
            Expr::TsTypeCast(TsTypeCastExpr { ref type_ann, .. }) => {
                type_ann.type_ann.clone().into_cow()
            }

            Expr::TsNonNull(TsNonNullExpr { ref expr, .. }) => {
                return self.type_of(expr).map(|ty| {
                    // TODO: Optimize

                    ty.into_owned().remove_falsy()
                });
            }

            Expr::Object(ObjectLit { span, ref props }) => TsType::TsTypeLit(TsTypeLit {
                span,
                members: props
                    .iter()
                    .map(|prop| match *prop {
                        PropOrSpread::Prop(ref prop) => self.type_of_prop(&prop),
                        PropOrSpread::Spread(..) => {
                            unimplemented!("spread element in object literal")
                        }
                    })
                    .collect(),
            })
            .into_cow(),

            // https://github.com/Microsoft/TypeScript/issues/26959
            Expr::Yield(..) => Type::any(span).into_cow(),

            Expr::Update(..) => Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsNumberKeyword,
                span,
            })
            .into_cow(),

            Expr::Cond(CondExpr {
                ref cons, ref alt, ..
            }) => {
                let cons_ty = self.type_of(cons)?;
                let alt_ty = self.type_of(alt)?;
                if cons_ty.eq_ignore_span(&alt_ty) {
                    cons_ty
                } else {
                    Union {
                        span,
                        types: vec![cons_ty.into_owned(), alt_ty.into_owned()],
                    }
                    .into_cow()
                }
            }

            Expr::New(NewExpr {
                ref callee,
                ref type_args,
                ref args,
                ..
            }) => {
                let callee_type = self.extract_call_new_expr_member(
                    callee,
                    ExtractKind::New,
                    args.as_ref().map(|v| &**v).unwrap_or_else(|| &[]),
                    type_args.as_ref(),
                )?;
                return Ok(callee_type.into_cow());
            }

            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(ref callee),
                ref args,
                ref type_args,
                ..
            }) => {
                let callee_type = self
                    .extract_call_new_expr_member(
                        callee,
                        ExtractKind::Call,
                        args,
                        type_args.as_ref(),
                    )
                    .map(|v| v)?;

                return Ok(callee_type.into_cow());
            }

            // super() returns any
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                ..
            }) => Type::any(span).into_cow(),

            Expr::Seq(SeqExpr { ref exprs, .. }) => {
                assert!(exprs.len() >= 1);

                return self.type_of(&exprs.last().unwrap());
            }

            Expr::Await(AwaitExpr { .. }) => unimplemented!("typeof(AwaitExpr)"),

            Expr::Class(ClassExpr { ref class, .. }) => {
                return Ok(self.type_of_class(class)?.into_cow())
            }

            Expr::Arrow(ref e) => return Ok(self.type_of_arrow_fn(e)?.into_cow()),

            Expr::Fn(FnExpr { ref function, .. }) => {
                return Ok(self.type_of_fn(&function)?.into_cow())
            }

            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(ref obj),
                computed,
                ref prop,
                ..
            }) => {
                match **obj {
                    Expr::Ident(ref i) => {
                        if let Some(Type::Enum(ref e)) = self.find_type(&i.sym) {
                            // TODO(kdy1): Check if variant exists.
                            match **prop {
                                Expr::Ident(ref v) if !computed => {
                                    return Ok(Cow::Owned(Type::EnumVariant(EnumVariant {
                                        span,
                                        enum_name: e.id.sym.clone(),
                                        name: v.sym.clone(),
                                    })))
                                }
                                _ => {}
                            }
                        }
                    }
                    _ => {}
                }
                // member expression
                let obj_ty = self.type_of(obj)?;

                unimplemented!(
                    "type_of(MemberExpr):\nObject: {:?},Prop: {:?}",
                    obj_ty,
                    prop
                );
                //
                // Ok(if computed {
                //     let index_type = self.type_of(&prop).map(Box::new)?;
                //     TsIndexedAccessType {
                //         span,
                //         obj_type,
                //         index_type,
                //     }
                // } else {
                //     TsIndexedAccessType {
                //         span,
                //         obj_type,
                //         index_type: box TsType::TsKeywordType(TsKeywordType {
                //             span,
                //             kind: TsKeywordTypeKind::TsStringKeyword,
                //         }),
                //     }
                // })
                // .map(Type::from)
            }

            Expr::MetaProp(..) => unimplemented!("typeof(MetaProp)"),

            Expr::Assign(AssignExpr { ref right, .. }) => return self.type_of(right),

            Expr::Bin(BinExpr {
                op: op!("||"),
                ref right,
                ..
            })
            | Expr::Bin(BinExpr {
                op: op!("&&"),
                ref right,
                ..
            }) => return self.type_of(&right),

            Expr::Bin(BinExpr {
                op: op!(bin, "-"), ..
            }) => Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsNumberKeyword,
                span,
            })
            .into_cow(),

            Expr::Bin(BinExpr { op: op!("==="), .. })
            | Expr::Bin(BinExpr { op: op!("!=="), .. })
            | Expr::Bin(BinExpr { op: op!("!="), .. })
            | Expr::Bin(BinExpr { op: op!("=="), .. })
            | Expr::Bin(BinExpr { op: op!("<="), .. })
            | Expr::Bin(BinExpr { op: op!("<"), .. })
            | Expr::Bin(BinExpr { op: op!(">="), .. })
            | Expr::Bin(BinExpr { op: op!(">"), .. }) => Type::Keyword(TsKeywordType {
                span,
                kind: TsKeywordTypeKind::TsBooleanKeyword,
            })
            .into_cow(),

            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => Type::undefined(span).into_cow(),

            _ => unimplemented!("typeof ({:#?})", expr),
        })
    }

    fn type_of_prop(&self, prop: &Prop) -> TsTypeElement {
        TsPropertySignature {
            span: prop.span(),
            key: prop_key_to_expr(&prop),
            params: Default::default(),
            init: None,
            optional: false,
            readonly: false,
            computed: false,
            type_ann: Default::default(),
            type_params: Default::default(),
        }
        .into()
    }

    pub(super) fn type_of_class(&self, c: &Class) -> Result<Type, Error> {
        // let mut type_props = vec![];
        // for member in &c.body {
        //     let span = member.span();
        //     let any = any(span);

        //     match member {
        //         ClassMember::ClassProp(ref p) => {
        //             let ty = match p.type_ann.as_ref().map(|ty|
        // Type::from(&*ty.type_ann)) {                 Some(ty) => ty,
        //                 None => match p.value {
        //                     Some(ref e) => self.type_of(&e)?,
        //                     None => any,
        //                 },
        //             };

        //
        // type_props.push(TsTypeElement::TsPropertySignature(TsPropertySignature {
        //                 span,
        //                 key: p.key.clone(),
        //                 optional: p.is_optional,
        //                 readonly: p.readonly,
        //                 init: p.value.clone(),
        //                 type_ann: Some(TsTypeAnn {
        //                     span: ty.span(),
        //                     type_ann: box ty.into_owned(),
        //                 }),

        //                 // TODO(kdy1):
        //                 computed: false,

        //                 // TODO(kdy1):
        //                 params: Default::default(),

        //                 // TODO(kdy1):
        //                 type_params: Default::default(),
        //             }));
        //         }

        //         // TODO(kdy1):
        //         ClassMember::Constructor(ref c) => {
        //             type_props.push(TsTypeElement::TsConstructSignatureDecl(
        //                 TsConstructSignatureDecl {
        //                     span,

        //                     // TODO(kdy1):
        //                     type_ann: None,

        //                     params: c
        //                         .params
        //                         .iter()
        //                         .map(|param| match *param {
        //                             PatOrTsParamProp::Pat(ref pat) => {
        //                                 pat_to_ts_fn_param(pat.clone())
        //                             }
        //                             PatOrTsParamProp::TsParamProp(ref prop) => match
        // prop.param {
        // TsParamPropParam::Ident(ref i) => {
        // TsFnParam::Ident(i.clone())                                 }
        //                                 TsParamPropParam::Assign(AssignPat {
        //                                     ref left, ..
        //                                 }) => pat_to_ts_fn_param(*left.clone()),
        //                             },
        //                         })
        //                         .collect(),

        //                     // TODO(kdy1):
        //                     type_params: Default::default(),
        //                 },
        //             ));
        //         }

        //         // TODO(kdy1):
        //         ClassMember::Method(..) => {}

        //         // TODO(kdy1):
        //         ClassMember::TsIndexSignature(..) => {}

        //         ClassMember::PrivateMethod(..) | ClassMember::PrivateProp(..) => {}
        //     }
        // }

        // Ok(TsType::TsTypeLit(TsTypeLit {
        //     span: c.span(),
        //     members: type_props,
        // })
        // .into())
        Ok(Type::Class(c.clone()))
    }

    pub(super) fn infer_return_type(&self, body: &BlockStmt) -> Result<Option<Type>, Error> {
        let mut types = vec![];

        struct Visitor<'a> {
            a: &'a Analyzer<'a, 'a>,
            span: Span,
            types: &'a mut Vec<Result<Type, Error>>,
        }

        impl Visit<ReturnStmt> for Visitor<'_> {
            fn visit(&mut self, stmt: &ReturnStmt) {
                let ty = match stmt.arg {
                    Some(ref arg) => self.a.type_of(arg).map(|ty| ty.into_owned()),
                    None => Ok(Type::undefined(self.span)),
                };
                self.types.push(ty);
            }
        }
        let types_len = types.len();
        let types = {
            let mut v = Visitor {
                span: body.span(),
                types: &mut types,
                a: self,
            };
            body.visit_with(&mut v);
            types
        };

        let mut tys = Vec::with_capacity(types_len);
        for ty in types {
            let ty = ty?;
            tys.push(ty);
        }

        match tys.len() {
            0 => Ok(None),
            1 => Ok(Some(tys.into_iter().next().unwrap())),
            _ => Ok(Some(Type::Union(Union {
                span: body.span(),
                types: tys,
            }))
            .map(Type::from)),
        }
    }

    pub(super) fn type_of_arrow_fn(&self, f: &ArrowExpr) -> Result<Type, Error> {
        let ret_ty = match f.return_type {
            Some(ref ret_ty) => self
                .fix_type(f.span, Cow::Owned(Type::from(ret_ty.type_ann.clone())))?
                .into_owned(),
            None => match f.body {
                BlockStmtOrExpr::BlockStmt(ref body) => match self.infer_return_type(body) {
                    Ok(Some(ty)) => ty,
                    Ok(None) => Type::undefined(body.span()),
                    Err(err) => return Err(err),
                },
                BlockStmtOrExpr::Expr(ref expr) => match self.type_of(&expr) {
                    Ok(ty) => ty.into_owned(),
                    // We failed to infer type.
                    Err(Error::UndefinedSymbol { .. }) => return Ok(Type::any(f.span)),
                    Err(err) => return Err(err),
                },
            },
        };

        Ok(ty::Function {
            span: f.span,
            params: f.params.iter().cloned().map(pat_to_ts_fn_param).collect(),
            type_params: f.type_params.clone(),
            ret_ty: box ret_ty,
        }
        .into())
    }

    pub(super) fn type_of_fn(&self, f: &Function) -> Result<Type, Error> {
        let ret_ty = match f.return_type {
            Some(ref ret_ty) => self
                .fix_type(f.span, Cow::Owned(Type::from(ret_ty.type_ann.clone())))?
                .into_owned(),
            None => match f.body {
                Some(ref body) => match self.infer_return_type(body) {
                    Ok(Some(ty)) => ty,
                    Ok(None) => Type::undefined(body.span()),
                    Err(err) => return Err(err),
                },
                None => unreachable!("function without body should have type annotation"),
            },
        };

        Ok(ty::Function {
            span: f.span,
            params: f.params.iter().cloned().map(pat_to_ts_fn_param).collect(),
            type_params: f.type_params.clone(),
            ret_ty: box ret_ty,
        }
        .into())
    }

    fn extract_call_new_expr_member<'e>(
        &'e self,
        callee: &'e Expr,
        kind: ExtractKind,
        args: &[ExprOrSpread],
        type_args: Option<&TsTypeParamInstantiation>,
    ) -> Result<Type, Error> {
        let span = callee.span();

        macro_rules! search_members_for_prop {
            ($members:expr, $prop:expr) => {{
                // Candidates of the method call.
                //
                // 4 is just an unsientific guess
                let mut candidates = Vec::with_capacity(4);

                for m in $members {
                    match m {
                        TsTypeElement::TsMethodSignature(ref m) if kind == ExtractKind::Call => {
                            // We are only interested on methods named `prop`
                            if $prop.eq_ignore_span(&m.key) {
                                candidates.push(m.clone());
                            }
                        }

                        _ => {}
                    }
                }

                match candidates.len() {
                    0 => {}
                    1 => {
                        let TsMethodSignature { type_ann, .. } =
                            candidates.into_iter().next().unwrap();

                        return Ok(type_ann
                            .map(|ty| Type::from(*ty.type_ann))
                            .unwrap_or_else(|| Type::any(span)));
                    }
                    _ => {
                        //
                        for c in candidates {
                            if c.params.len() == args.len() {
                                return Ok(c
                                    .type_ann
                                    .map(|ty| Type::from(*ty.type_ann))
                                    .unwrap_or_else(|| Type::any(span)));
                            }
                        }

                        unimplemented!(
                            "multiple methods with same name and same number of arguments"
                        )
                    }
                }
            }};
        }

        match *callee {
            Expr::Ident(ref i) if i.sym == js_word!("require") => {
                if let Some(dep) = self.resolved_imports.get(
                    &args
                        .iter()
                        .cloned()
                        .map(|arg| match arg {
                            ExprOrSpread { spread: None, expr } => match *expr {
                                Expr::Lit(Lit::Str(Str { value, .. })) => value.clone(),
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

                // if let Some(Type::Enum(ref e)) = self.scope.find_type(&i.sym) {
                //     return Ok(TsType::TsTypeRef(TsTypeRef {
                //         span,
                //         type_name: TsEntityName::Ident(i.clone()),
                //         type_params: None,
                //     })
                //     .into());
                // }
                Err(Error::UndefinedSymbol { span: i.span() })
            }

            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(ref obj),
                ref prop,
                computed,
                ..
            }) => {
                // member expression
                let obj_type = self.type_of(obj)?;

                match *obj_type {
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
                        search_members_for_prop!(&i.body.body, prop);
                    }

                    Type::Simple(ref obj_type) => match *obj_type {
                        TsType::TsTypeLit(TsTypeLit { ref members, .. }) => {
                            search_members_for_prop!(members, prop);
                        }

                        _ => {}
                    },

                    _ => {}
                }

                if computed {
                    unimplemented!("typeeof(CallExpr): {:?}[{:?}]()", callee, prop)
                } else {
                    println!("extract_call_hew_expr: No signature",);
                    Err(if kind == ExtractKind::Call {
                        Error::NoCallSignature {
                            span,
                            callee: self.type_of(callee)?.into_owned(),
                        }
                    } else {
                        Error::NoNewSignature {
                            span,
                            callee: self.type_of(callee)?.into_owned(),
                        }
                    })
                }
            }
            _ => {
                let ty = self.type_of(callee)?;

                self.extract(span, ty, kind, args, type_args)
            }
        }
    }

    fn extract<'a>(
        &'a self,
        span: Span,
        ty: TypeRef<'a>,
        kind: ExtractKind,
        args: &[ExprOrSpread],
        type_args: Option<&TsTypeParamInstantiation>,
    ) -> Result<Type, Error> {
        let any = Type::any(span);

        macro_rules! ret_err {
            () => {{
                match kind {
                    ExtractKind::Call => {
                        return Err(Error::NoCallSignature {
                            span,
                            callee: ty.clone().into_owned(),
                        })
                    }
                    ExtractKind::New => {
                        return Err(Error::NoNewSignature {
                            span,
                            callee: ty.clone().into_owned(),
                        })
                    }
                }
            }};
        }

        /// Search for members and returns if there's a match
        macro_rules! search_members {
            ($members:expr) => {{
                for member in &$members {
                    match *member {
                        TsTypeElement::TsCallSignatureDecl(TsCallSignatureDecl {
                            ref params,
                            ref type_params,
                            ref type_ann,
                            ..
                        }) if kind == ExtractKind::Call => {
                            //
                            match self.try_instantiate(
                                span,
                                ty.span(),
                                type_ann
                                    .as_ref()
                                    .map(|v| Type::from(v.type_ann.clone()))
                                    .unwrap_or_else(|| Type::any(span)),
                                params,
                                type_params.as_ref(),
                                args,
                                type_args,
                            ) {
                                Ok(v) => return Ok(v),
                                Err(..) => {}
                            };
                        }

                        TsTypeElement::TsConstructSignatureDecl(TsConstructSignatureDecl {
                            ref params,
                            ref type_params,
                            ref type_ann,
                            ..
                        }) if kind == ExtractKind::New => {
                            match self.try_instantiate(
                                span,
                                ty.span(),
                                type_ann
                                    .as_ref()
                                    .map(|v| Type::from(v.type_ann.clone()))
                                    .unwrap_or_else(|| Type::any(span)),
                                params,
                                type_params.as_ref(),
                                args,
                                type_args,
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
            }};
        }

        match *ty {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsAnyKeyword,
                ..
            }) => return Ok(any),

            Type::Function(ty::Function {
                ref params,
                ref type_params,
                ref ret_ty,
                ..
            }) if kind == ExtractKind::Call => self.try_instantiate(
                span,
                ty.span(),
                *ret_ty.clone(),
                params,
                type_params.as_ref(),
                args,
                type_args,
            ),

            Type::Constructor(ty::Constructor {
                ref params,
                ref type_params,
                ref ret_ty,
                ..
            }) if kind == ExtractKind::New => self.try_instantiate(
                span,
                ty.span(),
                *ret_ty.clone(),
                params,
                type_params.as_ref(),
                args,
                type_args,
            ),

            Type::Union(ref u) => {
                let mut errors = vec![];
                for ty in &u.types {
                    match self.extract(span, Cow::Borrowed(ty), kind, args, type_args) {
                        Ok(ty) => return Ok(ty),
                        Err(err) => errors.push(err),
                    }
                }

                Err(Error::UnionError { span, errors })
            }

            Type::Interface(ref i) => {
                // Search for methods
                search_members!(i.body.body);

                ret_err!()
            }

            Type::Simple(ref s) => match *s {
                TsType::TsTypeLit(ref lit) => {
                    search_members!(lit.members);

                    ret_err!()
                }

                _ => ret_err!(),
            },

            _ => ret_err!(),
        }
    }

    fn try_instantiate<'a>(
        &'a self,
        span: Span,
        callee_span: Span,
        ret_type: Type,
        param_decls: &[TsFnParam],
        ty_params_decl: Option<&TsTypeParamDecl>,
        args: &[ExprOrSpread],
        i: Option<&TsTypeParamInstantiation>,
    ) -> Result<Type, Error> {
        {
            // let type_params_len = ty_params_decl.map(|decl|
            // decl.params.len()).unwrap_or(0); let type_args_len = i.map(|v|
            // v.params.len()).unwrap_or(0);

            // // TODO: Handle multiple definitions
            // let min = ty_params_decl
            //     .map(|decl| decl.params.iter().filter(|p| p.default.is_none()).count())
            //     .unwrap_or(type_params_len);

            // let expected = min..=type_params_len;
            // if !expected.contains(&type_args_len) {
            //     return Err(Error::WrongTypeParams {
            //         span,
            //         callee: callee_span,
            //         expected,
            //         actual: type_args_len,
            //     });
            // }
        }

        {
            // TODO: Handle default parameters
            // TODO: Handle multiple definitions

            let min = param_decls
                .iter()
                .filter(|p| match p {
                    TsFnParam::Ident(Ident { optional: true, .. }) => false,
                    _ => true,
                })
                .count();

            let expected = min..=param_decls.len();
            if !expected.contains(&args.len()) {
                return Err(Error::WrongParams {
                    span,
                    callee: callee_span,
                    expected,
                    actual: args.len(),
                });
            }
        }

        Ok(ret_type.into())
    }

    /// Expands
    ///
    ///   - Type alias
    pub(super) fn fix_type<'t>(
        &'t self,
        span: Span,
        ty: TypeRef<'t>,
    ) -> Result<TypeRef<'t>, Error> {
        // println!("({}) expand({:?})", self.scope.depth(), ty);

        match *ty {
            Type::Simple(ref s_ty) => match *s_ty {
                TsType::TsTypeRef(TsTypeRef {
                    ref type_name,
                    ref type_params,
                    ..
                }) => {
                    match *type_name {
                        TsEntityName::Ident(ref i) => {
                            // Check for builtin types
                            match i.sym {
                                js_word!("Record") => {}
                                js_word!("Readonly") => {}
                                js_word!("ReadonlyArray") => {}
                                js_word!("ReturnType") => {}
                                js_word!("Partial") => {}
                                js_word!("Required") => {}
                                js_word!("NonNullable") => {}
                                js_word!("Pick") => {}
                                js_word!("Record") => {}
                                js_word!("Extract") => {}
                                js_word!("Exclude") => {}

                                _ => {}
                            }

                            // Handle enum
                            if let Some(ref ty) = self.find_type(&i.sym) {
                                match ty {
                                    Type::Enum(..) | Type::Interface(..) | Type::Class(..) => {
                                        return Ok(Cow::Borrowed(ty))
                                    }
                                    _ => {}
                                }
                            }
                        }

                        // Handle enum variant type.
                        //
                        //  let a: StringEnum.Foo = x;
                        TsEntityName::TsQualifiedName(box TsQualifiedName {
                            left: TsEntityName::Ident(ref left),
                            ref right,
                        }) => {
                            if let Some(ref ty) = self.scope.find_type(&left.sym) {
                                match *ty {
                                    Type::Enum(..) => {
                                        return Ok(EnumVariant {
                                            span,
                                            enum_name: left.sym.clone(),
                                            name: right.sym.clone(),
                                        }
                                        .into_cow())
                                    }
                                    _ => {}
                                }
                            }
                        }
                        _ => {}
                    }

                    return Ok(ty);

                    // match e.extra {
                    //     Some(ref extra) => {
                    //         // Expand
                    //         match extra {

                    //             ExportExtra::Module(TsModuleDecl {
                    //                 body: Some(body), ..
                    //             })
                    //             | ExportExtra::Namespace(TsNamespaceDecl { box body, .. }) => {
                    //                 let mut name = type_name;
                    //                 let mut body = body;
                    //                 let mut ty = None;

                    //                 while let TsEntityName::TsQualifiedName(q) = name {
                    //                     body = match body {
                    //                         TsNamespaceBody::TsModuleBlock(ref module) => {
                    //                             match q.left {
                    //                                 TsEntityName::Ident(ref left) => {
                    //                                     for item in module.body.iter() {}
                    //                                     return Err(Error::UndefinedSymbol {
                    //                                         span: left.span,
                    //                                     });
                    //                                 }
                    //                                 _ => {
                    //                                     //
                    //                                     unimplemented!("qname")
                    //                                 }
                    //                             }
                    //                         }
                    //                         TsNamespaceBody::TsNamespaceDecl(TsNamespaceDecl {
                    //                             ref id,
                    //                             ref body,
                    //                             ..
                    //                         }) => {
                    //                             match q.left {
                    //                                 TsEntityName::Ident(ref left) => {
                    //                                     if id.sym != left.sym {
                    //                                         return Err(Error::UndefinedSymbol {
                    //                                             span: left.span,
                    //                                         });
                    //                                     }
                    //                                 }
                    //                                 _ => {}
                    //                             }
                    //                             //
                    //                             body
                    //                         }
                    //                     };
                    //                     name = &q.left;
                    //                 }

                    //                 return match ty {
                    //                     Some(ty) => Ok(ty),
                    //                     None => Err(Error::UndefinedSymbol { span }),
                    //                 };
                    //             }
                    //             ExportExtra::Module(..) => {
                    //                 assert_eq!(*type_params, None);

                    //                 unimplemented!(
                    //                     "ExportExtra::Module without body cannot be instantiated"
                    //                 )
                    //             }
                    //             ExportExtra::Interface(ref i) => {
                    //                 // TODO: Check length of type parmaters
                    //                 // TODO: Instantiate type parameters

                    //                 let members = i.body.body.iter().cloned().collect();

                    //                 return Ok(TsType::TsTypeLit(TsTypeLit {
                    //                     span: i.span,
                    //                     members,
                    //                 })
                    //                 .into());
                    //             }
                    //             ExportExtra::Alias(ref decl) => {
                    //                 // TODO(kdy1): Handle type parameters.
                    //                 return Ok(decl.type_ann.into());
                    //             }
                    //         }
                    //     }
                    //     None => unimplemented!("`ty` and `extra` are both null"),
                    // }
                }

                TsType::TsTypeQuery(TsTypeQuery { ref expr_name, .. }) => match *expr_name {
                    TsEntityName::Ident(ref i) => {
                        return self
                            .type_of(&Expr::Ident(i.clone()))
                            .map(|ty| ty.into_owned())
                            .map(Cow::Owned)
                    }
                    _ => unimplemented!("expand(TsTypeQuery): typeof member.expr"),
                },

                _ => {
                    return Ok(s_ty.clone().into_cow());
                }
            },

            _ => {}
        }

        let ty = match ty.into_owned() {
            Type::Union(Union { span, types }) => {
                return Ok(Union {
                    span,
                    types: types
                        .into_iter()
                        .map(|ty| Ok(self.fix_type(span, Cow::Owned(ty))?.into_owned()))
                        .collect::<Result<_, _>>()?,
                }
                .into_cow())
            }
            Type::Intersection(Intersection { span, types }) => {
                return Ok(Intersection {
                    span,
                    types: types
                        .into_iter()
                        .map(|ty| Ok(self.fix_type(span, Cow::Owned(ty))?.into_owned()))
                        .collect::<Result<_, _>>()?,
                }
                .into_cow())
            }

            ty => ty,
        };

        Ok(ty.into_cow())
    }
}

fn prop_key_to_expr(p: &Prop) -> Box<Expr> {
    match *p {
        Prop::Shorthand(ref i) => box Expr::Ident(i.clone()),
        Prop::Assign(AssignProp { ref key, .. }) => box Expr::Ident(key.clone()),
        Prop::Getter(GetterProp { ref key, .. })
        | Prop::KeyValue(KeyValueProp { ref key, .. })
        | Prop::Method(MethodProp { ref key, .. })
        | Prop::Setter(SetterProp { ref key, .. }) => match *key {
            PropName::Computed(ref expr) => expr.clone(),
            PropName::Ident(ref ident) => box Expr::Ident(ident.clone()),
            PropName::Str(ref s) => box Expr::Lit(Lit::Str(Str { ..s.clone() })),
            PropName::Num(ref s) => box Expr::Lit(Lit::Num(Number { ..s.clone() })),
        },
    }
}

fn negate(ty: Type) -> Type {
    match ty {
        Type::Lit(TsLitType { ref lit, span }) => match *lit {
            TsLit::Bool(v) => {
                return Type::Lit(TsLitType {
                    lit: TsLit::Bool(Bool {
                        value: !v.value,
                        ..v
                    }),
                    span,
                })
            }
            TsLit::Number(v) => {
                return Type::Lit(TsLitType {
                    lit: TsLit::Bool(Bool {
                        value: v.value != 0.0,
                        span: v.span,
                    }),
                    span,
                })
            }
            TsLit::Str(ref v) => {
                return Type::Lit(TsLitType {
                    lit: TsLit::Bool(Bool {
                        value: v.value != js_word!(""),
                        span: v.span,
                    }),
                    span,
                })
            }
        },

        _ => {}
    }

    TsKeywordType {
        span: ty.span(),
        kind: TsKeywordTypeKind::TsBooleanKeyword,
    }
    .into()
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ExtractKind {
    Call,
    New,
}
