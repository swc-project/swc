use super::{control_flow::RemoveTypes, export::pat_to_ts_fn_param, Analyzer};
use crate::{
    builtin_types,
    errors::Error,
    ty::{
        self, Array, CallSignature, ConstructorSignature, EnumVariant, Intersection,
        MethodSignature, PropertySignature, Type, TypeElement, TypeLit, TypeParamDecl, TypeRef,
        TypeRefExt, Union,
    },
    util::{EqIgnoreNameAndSpan, EqIgnoreSpan, IntoCow},
};
use std::borrow::Cow;
use swc_atoms::js_word;
use swc_common::{Span, Spanned};
use swc_ecma_ast::*;

impl Analyzer<'_, '_> {
    pub(super) fn type_of<'e>(&'e self, expr: &Expr) -> Result<TypeRef<'e>, Error> {
        let span = expr.span();

        match *expr {
            Expr::This(ThisExpr { span }) => {
                if let Some(ref ty) = self.scope.this() {
                    return Ok(ty.static_cast());
                }
                return Ok(Cow::Owned(Type::from(TsThisType { span })));
            }

            Expr::Ident(Ident {
                sym: js_word!("undefined"),
                ..
            }) => return Ok(Type::undefined(span).into_cow()),

            Expr::Ident(ref i) => {
                if i.sym == js_word!("require") {
                    unreachable!("typeof(require('...'))");
                }

                if let Some(ty) = self.resolved_imports.get(&i.sym) {
                    return Ok(ty.static_cast());
                }

                if let Some(ty) = self.find_type(&i.sym) {
                    return Ok(ty.static_cast());
                }

                if let Some(ty) = self.find_var_type(&i.sym) {
                    return Ok(ty.static_cast());
                }

                if let Some(_var) = self.find_var(&i.sym) {
                    // TODO: Infer type or use type hint to handle
                    //
                    // let id: (x: Foo) => Foo = x => x;
                    //
                    return Ok(Type::any(span).into_cow());
                }

                if let Ok(ty) = builtin_types::get_var(self.libs, &i.sym) {
                    return Ok(ty.owned());
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
                let mut types: Vec<TypeRef> = vec![];

                for elem in elems {
                    match elem {
                        Some(ExprOrSpread {
                            spread: None,
                            ref expr,
                        }) => {
                            let ty = self.type_of(expr)?.generalize_lit();
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
                                types.push(ty.into_cow())
                            }
                        }
                    }
                }

                return Ok(Type::Array(Array {
                    span,
                    elem_type: match types.len() {
                        0 => box Type::any(span).into_cow(),
                        1 => box types.into_iter().next().unwrap(),
                        _ => box Union { span, types }.into_cow(),
                    },
                })
                .into_cow());
            }

            Expr::Lit(Lit::Bool(v)) => {
                return Ok(Type::Lit(TsLitType {
                    span: v.span,
                    lit: TsLit::Bool(v),
                })
                .into_cow())
            }
            Expr::Lit(Lit::Str(ref v)) => {
                return Ok(Type::Lit(TsLitType {
                    span: v.span,
                    lit: TsLit::Str(v.clone()),
                })
                .into_cow())
            }
            Expr::Lit(Lit::Num(v)) => {
                return Ok(Type::Lit(TsLitType {
                    span: v.span,
                    lit: TsLit::Number(v),
                })
                .into_cow())
            }
            Expr::Lit(Lit::Null(Null { span })) => {
                return Ok(Type::Keyword(TsKeywordType {
                    span,
                    kind: TsKeywordTypeKind::TsNullKeyword,
                })
                .into_cow())
            }
            Expr::Lit(Lit::Regex(..)) => {
                return Ok(TsType::TsTypeRef(TsTypeRef {
                    span,
                    type_name: TsEntityName::Ident(Ident {
                        span,
                        sym: js_word!("RegExp"),
                        optional: false,
                        type_ann: None,
                    }),
                    type_params: None,
                })
                .into_cow())
            }

            Expr::Paren(ParenExpr { ref expr, .. }) => return self.type_of(expr),

            Expr::Tpl(..) => {
                return Ok(Type::Keyword(TsKeywordType {
                    span,
                    kind: TsKeywordTypeKind::TsStringKeyword,
                })
                .into_cow())
            }

            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
                ..
            }) => return Ok(negate(self.type_of(arg)?.into_owned()).into_cow()),

            Expr::Unary(UnaryExpr {
                op: op!("typeof"), ..
            }) => {
                return Ok(Type::Keyword(TsKeywordType {
                    span,
                    kind: TsKeywordTypeKind::TsStringKeyword,
                })
                .into_cow())
            }

            Expr::TsAs(TsAsExpr { ref type_ann, .. }) => return Ok(type_ann.clone().into_cow()),
            Expr::TsTypeCast(TsTypeCastExpr { ref type_ann, .. }) => {
                return Ok(type_ann.type_ann.clone().into_cow())
            }

            Expr::TsNonNull(TsNonNullExpr { ref expr, .. }) => {
                return self.type_of(expr).map(|ty| {
                    // TODO: Optimize

                    ty.remove_falsy()
                });
            }

            Expr::Object(ObjectLit { span, ref props }) => {
                let mut members = Vec::with_capacity(props.len());
                let mut special_type = None;

                for prop in props.iter() {
                    match *prop {
                        PropOrSpread::Prop(ref prop) => {
                            members.push(self.type_of_prop(&prop));
                        }
                        PropOrSpread::Spread(SpreadElement { ref expr, .. }) => {
                            match self.type_of(&expr)?.into_owned() {
                                Type::TypeLit(TypeLit {
                                    members: spread_members,
                                    ..
                                }) => {
                                    members.extend(spread_members);
                                }

                                // Use last type on ...any or ...unknown
                                ty @ Type::Keyword(TsKeywordType {
                                    kind: TsKeywordTypeKind::TsUnknownKeyword,
                                    ..
                                })
                                | ty @ Type::Keyword(TsKeywordType {
                                    kind: TsKeywordTypeKind::TsAnyKeyword,
                                    ..
                                }) => special_type = Some(ty),

                                ty => unimplemented!("spread with non-type-lit: {:#?}", ty),
                            }
                        }
                    }
                }

                if let Some(ty) = special_type {
                    return Ok(ty.into_cow());
                }

                return Ok(Type::TypeLit(TypeLit { span, members }).into_cow());
            }

            // https://github.com/Microsoft/TypeScript/issues/26959
            Expr::Yield(..) => return Ok(Type::any(span).into_cow()),

            Expr::Update(..) => {
                return Ok(Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsNumberKeyword,
                    span,
                })
                .into_cow())
            }

            Expr::Cond(CondExpr {
                ref cons, ref alt, ..
            }) => {
                let cons_ty = self.type_of(cons)?;
                let alt_ty = self.type_of(alt)?;
                return Ok(if cons_ty.eq_ignore_name_and_span(&alt_ty) {
                    cons_ty
                } else {
                    Union {
                        span,
                        types: vec![cons_ty, alt_ty],
                    }
                    .into_cow()
                });
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
                return Ok(callee_type);
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

                return Ok(callee_type);
            }

            // super() returns any
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                ..
            }) => return Ok(Type::any(span).into_cow()),

            Expr::Seq(SeqExpr { ref exprs, .. }) => {
                assert!(exprs.len() >= 1);

                return self.type_of(&exprs.last().unwrap());
            }

            Expr::Await(AwaitExpr { .. }) => unimplemented!("typeof(AwaitExpr)"),

            Expr::Class(ClassExpr { ref class, .. }) => {
                return Ok(self.type_of_class(class)?.owned())
            }

            Expr::Arrow(ref e) => return Ok(self.type_of_arrow_fn(e)?.owned()),

            Expr::Fn(FnExpr { ref function, .. }) => {
                return Ok(self.type_of_fn(&function)?.owned())
            }

            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(ref obj),
                computed,
                ref prop,
                ..
            }) => {
                // member expression
                let obj_ty = self.type_of(obj)?;

                return self.access_property(span, obj_ty, prop, computed);
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
            }) => {
                return Ok(Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsNumberKeyword,
                    span,
                })
                .into_cow())
            }

            Expr::Bin(BinExpr { op: op!("==="), .. })
            | Expr::Bin(BinExpr { op: op!("!=="), .. })
            | Expr::Bin(BinExpr { op: op!("!="), .. })
            | Expr::Bin(BinExpr { op: op!("=="), .. })
            | Expr::Bin(BinExpr { op: op!("<="), .. })
            | Expr::Bin(BinExpr { op: op!("<"), .. })
            | Expr::Bin(BinExpr { op: op!(">="), .. })
            | Expr::Bin(BinExpr { op: op!(">"), .. }) => {
                return Ok(Type::Keyword(TsKeywordType {
                    span,
                    kind: TsKeywordTypeKind::TsBooleanKeyword,
                })
                .into_cow())
            }

            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => return Ok(Type::undefined(span).into_cow()),
            _ => unimplemented!("typeof ({:#?})", expr),
        }
    }

    fn type_of_prop(&self, prop: &Prop) -> TypeElement {
        let span = prop.span();

        match *prop {
            Prop::Shorthand(ref i) => PropertySignature {
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

            Prop::KeyValue(ref p) => PropertySignature {
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

            Prop::Assign(ref p) => unimplemented!("type_of_prop(AssignProperty): {:#?}", p),
            Prop::Getter(ref p) => unimplemented!("type_of_prop(GetterProperty): {:#?}", p),
            Prop::Setter(ref p) => unimplemented!("type_of_prop(SetterProperty): {:#?}", p),

            Prop::Method(ref p) => MethodSignature {
                span,
                readonly: false,
                key: prop_key_to_expr(&prop),
                computed: false,
                optional: false,
                params: p
                    .function
                    .params
                    .iter()
                    .cloned()
                    .map(pat_to_ts_fn_param)
                    .collect(),
                ret_ty: p.function.return_type.clone().map(|v| v.into_cow()),
                type_params: p.function.type_params.clone().map(|v| v.into()),
            }
            .into(),
        }
    }

    fn access_property<'a>(
        &self,
        span: Span,
        obj: TypeRef,
        prop: &Expr,
        computed: bool,
    ) -> Result<TypeRef<'a>, Error> {
        let obj = obj.generalize_lit();
        match *obj.normalize() {
            Type::Lit(..) => unreachable!(),

            Type::Enum(ref e) => {
                // TODO(kdy1): Check if variant exists.
                match *prop {
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

            // enum Foo { A }
            //
            // Foo.A.toString()
            Type::EnumVariant(EnumVariant {
                ref enum_name,
                ref name,
                span,
                ..
            }) => match self.find_type(enum_name) {
                Some(ref v) => match **v {
                    Type::Enum(ref e) => {
                        for (i, v) in e.members.iter().enumerate() {
                            let new_obj = v.init.clone().unwrap_or_else(|| {
                                box Expr::Lit(Lit::Num(Number {
                                    span,
                                    value: i as f64,
                                }))
                            });
                            let new_obj_ty = self.type_of(&new_obj)?;
                            return self.access_property(span, new_obj_ty, prop, computed);
                        }
                        unreachable!("Enum {} does not have a variant named {}", enum_name, name);
                    }
                    _ => unreachable!("Enum named {} does not exist", enum_name),
                },
                _ => unreachable!("Enum named {} does not exist", enum_name),
            },

            Type::Class(ref c) => {
                for v in c.body.iter() {
                    match v {
                        ClassMember::ClassProp(ref class_prop) => {
                            //
                            if (*class_prop.key).eq_ignore_span(&*prop) {
                                return Ok(
                                    match class_prop.type_ann.clone().map(|v| v.into_cow()) {
                                        Some(ty) => ty,
                                        None => Type::any(span).owned(),
                                    },
                                );
                            }
                        }
                        _ => unimplemented!("Non-property class member"),
                    }
                }
            }

            _ => {}
        }

        unimplemented!("type_of(MemberExpr):\nObject: {:?}\nProp: {:?}", obj, prop);
    }

    pub(super) fn type_of_class(&self, c: &Class) -> Result<Type<'static>, Error> {
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
        // type_props.push(TypeElement::TsPropertySignature(TsPropertySignature {
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
        //             type_props.push(TypeElement::TsConstructSignatureDecl(
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

    pub(super) fn infer_return_type(
        &self,
        body: &BlockStmt,
    ) -> Result<Option<Type<'static>>, Error> {
        let types = { ::std::mem::replace(&mut *self.inferred_return_types.borrow_mut(), vec![]) };

        let mut tys = Vec::with_capacity(types.len());
        let mut span = body.span;
        for ty in types {
            span = ty.span();
            tys.push(ty.owned());
        }

        match tys.len() {
            0 => Ok(None),
            1 => Ok(Some(tys.into_iter().next().unwrap().into_owned())),
            _ => Ok(Some(Type::Union(Union { span, types: tys })).map(Type::from)),
        }
    }

    pub(super) fn type_of_arrow_fn(&self, f: &ArrowExpr) -> Result<Type<'static>, Error> {
        let ret_ty: TypeRef<'static> = match f.return_type {
            Some(ref ret_ty) => self
                .expand_type(f.span, Cow::Owned(Type::from(ret_ty.type_ann.clone())))?
                .to_static()
                .into_cow(),
            None => match f.body {
                BlockStmtOrExpr::BlockStmt(ref body) => match self.infer_return_type(body) {
                    Ok(Some(ty)) => ty.into_cow(),
                    Ok(None) => Type::undefined(body.span()).into_cow(),
                    Err(err) => return Err(err),
                },
                BlockStmtOrExpr::Expr(ref expr) => match self.type_of(&expr) {
                    Ok(ty) => ty.to_static().into_cow(),
                    // We failed to infer type.
                    Err(Error::UndefinedSymbol { .. }) => return Ok(Type::any(f.span)),
                    Err(err) => return Err(err),
                },
            },
        };

        Ok(ty::Function {
            span: f.span,
            params: f.params.iter().cloned().map(pat_to_ts_fn_param).collect(),
            type_params: f.type_params.clone().map(From::from),
            ret_ty: box ret_ty,
        }
        .into())
    }

    pub(super) fn type_of_fn(&self, f: &Function) -> Result<Type<'static>, Error> {
        let declared_ret_ty = f.return_type.as_ref().map(|ret_ty| {
            self.expand_type(f.span, Cow::Owned(Type::from(ret_ty.type_ann.clone())))
                .map(|v| v.to_static())
        });
        let declared_ret_ty = match declared_ret_ty {
            Some(Ok(ty)) => Some(ty),
            Some(Err(err)) => return Err(err),
            None => None,
        };

        let inferred_return_type = f.body.as_ref().map(|body| -> Result<_, _> {
            match self.infer_return_type(body)? {
                Some(ty) => Ok(ty),
                // No return statement found
                None => Ok(Type::undefined(f.body.span())),
            }
        });
        let inferred_return_type = match inferred_return_type {
            Some(Ok(inferred_return_type)) => {
                if let Some(ref declared) = declared_ret_ty {
                    let span = inferred_return_type.span();
                    inferred_return_type.assign_to(declared, span)?;
                }

                inferred_return_type
            }
            Some(Err(err)) => return Err(err),
            None => Type::any(f.span),
        };

        Ok(ty::Function {
            span: f.span,
            params: f.params.iter().cloned().map(pat_to_ts_fn_param).collect(),
            type_params: f.type_params.clone().map(From::from),
            ret_ty: box declared_ret_ty
                .map(|ty| ty.to_static().owned())
                .unwrap_or(inferred_return_type.to_static().owned()),
        }
        .into())
    }

    fn extract_call_new_expr_member<'e>(
        &'e self,
        callee: &Expr,
        kind: ExtractKind,
        args: &[ExprOrSpread],
        type_args: Option<&TsTypeParamInstantiation>,
    ) -> Result<TypeRef<'e>, Error> {
        let span = callee.span();

        macro_rules! search_members_for_prop {
            ($members:expr, $prop:expr) => {{
                // Candidates of the method call.
                //
                // 4 is just an unsientific guess
                let mut candidates = Vec::with_capacity(4);

                for m in $members {
                    match m {
                        TypeElement::Method(ref m) if kind == ExtractKind::Call => {
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
                        let MethodSignature { ret_ty, .. } = candidates.into_iter().next().unwrap();

                        return Ok(ret_ty.unwrap_or_else(|| Type::any(span).owned()));
                    }
                    _ => {
                        //
                        for c in candidates {
                            if c.params.len() == args.len() {
                                return Ok(c.ret_ty.unwrap_or_else(|| Type::any(span).owned()));
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
                let obj_type = self.type_of(obj)?.generalize_lit();

                match *obj_type.normalize() {
                    Type::Function(ref f) if kind == ExtractKind::Call => {
                        //
                        return Ok(*f.ret_ty.clone());
                    }

                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsAnyKeyword,
                        ..
                    }) => {
                        return Ok(Type::any(span).into_cow());
                    }

                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsNumberKeyword,
                        ..
                    }) => {
                        return Ok(builtin_types::get_type(self.libs, &js_word!("Number"))
                            .map(Type::owned)
                            .expect("Builtin type named 'Numnber' should exist"));
                    }

                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsStringKeyword,
                        ..
                    }) => {
                        return Ok(builtin_types::get_type(self.libs, &js_word!("String"))
                            .map(Type::owned)
                            .expect("Builtin type named 'String' should exist"));
                    }

                    Type::Interface(ref i) => {
                        search_members_for_prop!(&i.body, prop);
                    }

                    Type::TypeLit(ref t) => {
                        search_members_for_prop!(&t.members, prop);
                    }

                    _ => {}
                }

                if computed {
                    unimplemented!("typeeof(CallExpr): {:?}[{:?}]()", callee, prop)
                } else {
                    Err(if kind == ExtractKind::Call {
                        Error::NoCallSignature {
                            span,
                            callee: self.type_of(callee)?.to_static(),
                        }
                    } else {
                        Error::NoNewSignature {
                            span,
                            callee: self.type_of(callee)?.to_static(),
                        }
                    })
                }
            }
            _ => {
                let ty = self.type_of(callee)?;

                Ok(self.extract(span, &ty, kind, args, type_args)?.into_cow())
            }
        }
    }

    fn extract<'a>(
        &'a self,
        span: Span,
        ty: &Type<'a>,
        kind: ExtractKind,
        args: &[ExprOrSpread],
        type_args: Option<&TsTypeParamInstantiation>,
    ) -> Result<Type, Error> {
        macro_rules! ret_err {
            () => {{
                match kind {
                    ExtractKind::Call => {
                        return Err(Error::NoCallSignature {
                            span,
                            callee: ty.to_static(),
                        })
                    }
                    ExtractKind::New => {
                        return Err(Error::NoNewSignature {
                            span,
                            callee: ty.to_static(),
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
                        TypeElement::Call(CallSignature {
                            ref params,
                            ref type_params,
                            ref ret_ty,
                            ..
                        }) if kind == ExtractKind::Call => {
                            //
                            match self.try_instantiate(
                                span,
                                ty.span(),
                                &ret_ty.as_ref().unwrap_or(&Type::any(span).owned()),
                                params,
                                type_params.as_ref(),
                                args,
                                type_args,
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
                            match self.try_instantiate(
                                span,
                                ty.span(),
                                &ret_ty.as_ref().unwrap_or(&Type::any(span).owned()),
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
            }) => return Ok(Type::any(span)),

            Type::Function(ty::Function {
                ref params,
                ref type_params,
                ref ret_ty,
                ..
            }) if kind == ExtractKind::Call => self.try_instantiate(
                span,
                ty.span(),
                &ret_ty,
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
                &ret_ty,
                params,
                type_params.as_ref(),
                args,
                type_args,
            ),

            Type::Union(ref u) => {
                let mut errors = vec![];
                for ty in &u.types {
                    match self.extract(span, ty, kind, args, type_args) {
                        Ok(ty) => return Ok(ty),
                        Err(err) => errors.push(err),
                    }
                }

                Err(Error::UnionError { span, errors })
            }

            Type::Interface(ref i) => {
                // Search for methods
                search_members!(i.body);

                ret_err!()
            }

            Type::TypeLit(ref l) => {
                search_members!(l.members);

                ret_err!()
            }

            Type::Class(..) => {
                //
                unimplemented!("new Class()")
            }

            _ => ret_err!(),
        }
    }

    fn try_instantiate<'a>(
        &'a self,
        span: Span,
        callee_span: Span,
        ret_type: &Type<'a>,
        param_decls: &[TsFnParam],
        ty_params_decl: Option<&TypeParamDecl>,
        args: &[ExprOrSpread],
        i: Option<&TsTypeParamInstantiation>,
    ) -> Result<Type<'a>, Error> {
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

        Ok(ret_type.clone())
    }

    /// Expands
    ///
    ///   - Type alias
    pub(super) fn expand_type<'t>(
        &'t self,
        span: Span,
        ty: TypeRef<'t>,
    ) -> Result<TypeRef<'t>, Error> {
        // println!("({}) expand({:?})", self.scope.depth(), ty);

        match *ty {
            Type::Static(s) => return self.expand_type(span, s.static_cast()),
            Type::Simple(ref s_ty) => match **s_ty {
                TsType::TsTypeRef(TsTypeRef {
                    ref type_name,
                    ref type_params,
                    ..
                }) => {
                    match *type_name {
                        TsEntityName::Ident(ref i) => {
                            // Check for builtin types
                            if let Ok(ty) = builtin_types::get_type(self.libs, &i.sym) {
                                return Ok(ty.owned());
                            }

                            // Handle enum
                            if let Some(ref ty) = self.find_type(&i.sym) {
                                match ty.normalize() {
                                    Type::Enum(..) => {
                                        assert_eq!(
                                            *type_params, None,
                                            "unimplemented: error rerporting: Enum reference \
                                             cannot have type parameters."
                                        );
                                        return Ok(ty.static_cast());
                                    }

                                    Type::Interface(..) | Type::Class(..) | Type::Param(..) => {
                                        return Ok(ty.static_cast());
                                    }

                                    Type::Alias(ref a) => {
                                        // Expand type alias
                                        return Ok(a.ty.static_cast());
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

                    unimplemented!("Undefined type: {:#?}", ty);
                }

                TsType::TsTypeQuery(TsTypeQuery { ref expr_name, .. }) => match *expr_name {
                    TsEntityName::Ident(ref i) => {
                        let ty = self.type_of(&Expr::Ident(i.clone()))?;

                        return Ok(ty);
                    }
                    _ => unimplemented!("expand(TsTypeQuery): typeof member.expr"),
                },

                _ => {
                    return Ok(Cow::Owned((*s_ty).clone().into()));
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
                        .map(|ty| Ok(self.expand_type(span, ty)?))
                        .collect::<Result<_, _>>()?,
                }
                .into_cow())
            }
            Type::Intersection(Intersection { span, types }) => {
                return Ok(Intersection {
                    span,
                    types: types
                        .into_iter()
                        .map(|ty| Ok(self.expand_type(span, ty)?))
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
