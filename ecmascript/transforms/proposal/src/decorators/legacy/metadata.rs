use super::EnumKind;
use fxhash::FxHashMap;
use swc_atoms::js_word;
use swc_common::{util::move_map::MoveMap, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::member_expr;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::{ident::IdentLike, undefined, ExprFactory, Id};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

/// https://github.com/leonardfactory/babel-plugin-transform-typescript-metadata/blob/master/src/parameter/parameterVisitor.ts
pub(super) struct ParamMetadata;

impl Fold for ParamMetadata {
    noop_fold_type!();

    fn fold_class(&mut self, mut cls: Class) -> Class {
        cls = cls.fold_children_with(self);
        let mut decorators = cls.decorators;

        cls.body = cls.body.move_map(|m| match m {
            ClassMember::Constructor(mut c) => {
                for (idx, param) in c.params.iter_mut().enumerate() {
                    //
                    match param {
                        ParamOrTsParamProp::TsParamProp(p) => {
                            for decorator in p.decorators.drain(..) {
                                let new_dec =
                                    self.create_param_decorator(idx, decorator.expr, true);
                                decorators.push(new_dec);
                            }
                        }
                        ParamOrTsParamProp::Param(param) => {
                            for decorator in param.decorators.drain(..) {
                                let new_dec =
                                    self.create_param_decorator(idx, decorator.expr, true);
                                decorators.push(new_dec);
                            }
                        }
                    }
                }

                ClassMember::Constructor(c)
            }
            _ => m,
        });
        cls.decorators = decorators;

        cls
    }

    fn fold_class_method(&mut self, mut m: ClassMethod) -> ClassMethod {
        for (idx, param) in m.function.params.iter_mut().enumerate() {
            for decorator in param.decorators.drain(..) {
                let new_dec = self.create_param_decorator(idx, decorator.expr, false);
                m.function.decorators.push(new_dec);
            }
        }

        m
    }
}

impl ParamMetadata {
    fn create_param_decorator(
        &self,
        param_index: usize,
        decorator_expr: Box<Expr>,
        is_constructor: bool,
    ) -> Decorator {
        Decorator {
            span: DUMMY_SP,
            expr: Box::new(Expr::Fn(FnExpr {
                ident: None,
                function: Function {
                    params: vec![
                        Param {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            pat: Pat::Ident(quote_ident!("target").into()),
                        },
                        Param {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            pat: Pat::Ident(quote_ident!("key").into()),
                        },
                    ],
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: decorator_expr.as_callee(),
                                args: vec![
                                    quote_ident!("target").as_arg(),
                                    if is_constructor {
                                        quote_ident!("undefined").as_arg()
                                    } else {
                                        quote_ident!("key").as_arg()
                                    },
                                    Lit::Num(Number {
                                        span: DUMMY_SP,
                                        value: param_index as _,
                                    })
                                    .as_arg(),
                                ],
                                type_args: Default::default(),
                            }))),
                        })],
                    }),
                    decorators: Default::default(),
                    span: Default::default(),
                    is_generator: Default::default(),
                    is_async: Default::default(),
                    type_params: Default::default(),
                    return_type: Default::default(),
                },
            })),
        }
    }
}

/// https://github.com/leonardfactory/babel-plugin-transform-typescript-metadata/blob/master/src/metadata/metadataVisitor.ts
pub(super) struct Metadata<'a> {
    pub(super) enums: &'a FxHashMap<Id, EnumKind>,

    pub(super) class_name: Option<&'a Ident>,
}

impl Fold for Metadata<'_> {
    noop_fold_type!();

    fn fold_class(&mut self, mut c: Class) -> Class {
        c = c.fold_children_with(self);

        if c.decorators.is_empty() {
            return c;
        }

        let constructor = c.body.iter().find_map(|m| match m {
            ClassMember::Constructor(c) => Some(c),
            _ => None,
        });
        if constructor.is_none() {
            return c;
        }

        {
            let dec = self
                .create_metadata_design_decorator("design:type", quote_ident!("Function").as_arg());
            c.decorators.push(dec);
        }
        {
            let dec = self.create_metadata_design_decorator(
                "design:paramtypes",
                ArrayLit {
                    span: DUMMY_SP,
                    elems: constructor
                        .as_ref()
                        .unwrap()
                        .params
                        .iter()
                        .map(|v| match v {
                            ParamOrTsParamProp::TsParamProp(p) => {
                                let ann = match &p.param {
                                    TsParamPropParam::Ident(i) => i.type_ann.as_ref(),
                                    TsParamPropParam::Assign(a) => get_type_ann_of_pat(&a.left),
                                };
                                Some(serialize_type(self.class_name, ann).as_arg())
                            }
                            ParamOrTsParamProp::Param(p) => Some(
                                serialize_type(self.class_name, get_type_ann_of_pat(&p.pat))
                                    .as_arg(),
                            ),
                        })
                        .collect(),
                }
                .as_arg(),
            );
            c.decorators.push(dec);
        }
        c
    }

    fn fold_class_method(&mut self, mut m: ClassMethod) -> ClassMethod {
        if m.function.decorators.is_empty() {
            return m;
        }

        {
            let dec = self
                .create_metadata_design_decorator("design:type", quote_ident!("Function").as_arg());
            m.function.decorators.push(dec);
        }
        {
            let dec = self.create_metadata_design_decorator(
                "design:paramtypes",
                ArrayLit {
                    span: DUMMY_SP,
                    elems: m
                        .function
                        .params
                        .iter()
                        .map(|v| {
                            Some(
                                serialize_type(self.class_name, get_type_ann_of_pat(&v.pat))
                                    .as_arg(),
                            )
                        })
                        .collect(),
                }
                .as_arg(),
            );
            m.function.decorators.push(dec);
        }
        m
    }

    fn fold_class_prop(&mut self, mut p: ClassProp) -> ClassProp {
        if p.decorators.is_empty() {
            return p;
        }

        if p.type_ann.is_none() {
            return p;
        }

        if let Some(name) = p
            .type_ann
            .as_ref()
            .map(|ty| &ty.type_ann)
            .map(|type_ann| match &**type_ann {
                TsType::TsTypeRef(r) => Some(r),
                _ => None,
            })
            .flatten()
            .map(|r| match &r.type_name {
                TsEntityName::TsQualifiedName(_) => None,
                TsEntityName::Ident(i) => Some(i),
            })
            .flatten()
        {
            if let Some(kind) = self.enums.get(&name.to_id()) {
                let dec = self.create_metadata_design_decorator(
                    "design:type",
                    match kind {
                        EnumKind::Mixed => quote_ident!("Object").as_arg(),
                        EnumKind::Str => quote_ident!("String").as_arg(),
                        EnumKind::Num => quote_ident!("Number").as_arg(),
                    },
                );
                p.decorators.push(dec);
                return p;
            }
        }

        let dec = self.create_metadata_design_decorator(
            "design:type",
            serialize_type(self.class_name, p.type_ann.as_ref()).as_arg(),
        );
        p.decorators.push(dec);

        p
    }
}

impl Metadata<'_> {
    fn create_metadata_design_decorator(&self, design: &str, type_arg: ExprOrSpread) -> Decorator {
        Decorator {
            span: DUMMY_SP,
            expr: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                left: Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    left: Box::new(Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left: Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("typeof"),
                            arg: Box::new(Expr::Ident(quote_ident!("Reflect"))),
                        })),
                        op: op!("!=="),
                        right: Box::new(Expr::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: "undefined".into(),
                            has_escape: false,
                            kind: Default::default(),
                        }))),
                    })),
                    op: op!("&&"),
                    right: Box::new(Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left: Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("typeof"),
                            arg: member_expr!(DUMMY_SP, Reflect.metadata),
                        })),
                        op: op!("==="),
                        right: Box::new(Expr::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: "function".into(),
                            has_escape: false,
                            kind: Default::default(),
                        }))),
                    })),
                })),
                op: op!("&&"),
                right: Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: member_expr!(DUMMY_SP, Reflect.metadata).as_callee(),
                    args: vec![
                        Str {
                            span: DUMMY_SP,
                            value: design.into(),
                            has_escape: false,
                            kind: Default::default(),
                        }
                        .as_arg(),
                        type_arg,
                    ],

                    type_args: Default::default(),
                })),
            })),
        }
    }
}

fn serialize_type(class_name: Option<&Ident>, param: Option<&TsTypeAnn>) -> Expr {
    fn serialize_type_ref(class_name: &str, ty: &TsTypeRef) -> Expr {
        match &ty.type_name {
            // We should omit references to self (class) since it will throw a ReferenceError at
            // runtime due to babel transpile output.
            TsEntityName::Ident(i) if &*i.sym == class_name => {
                return quote_ident!("Object").into()
            }
            _ => {}
        }

        let member_expr = ts_entity_to_member_expr(&ty.type_name);

        fn check_object_existed(expr: Box<Expr>) -> Box<Expr> {
            match *expr {
                Expr::Member(ref member_expr) => {
                    let obj_expr = match member_expr.obj {
                        ExprOrSuper::Expr(ref exp) => exp.clone(),
                        ExprOrSuper::Super(_) => panic!("Unreachable code path"),
                    };
                    Box::new(Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left: check_object_existed(obj_expr),
                        op: op!("||"),
                        right: Box::new(Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            left: Box::new(Expr::Unary(UnaryExpr {
                                span: DUMMY_SP,
                                op: op!("typeof"),
                                arg: expr.clone(),
                            })),
                            op: op!("==="),
                            right: Box::new(Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: "undefined".into(),
                                has_escape: false,
                                kind: Default::default(),
                            }))),
                        })),
                    }))
                }
                _ => Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    left: Box::new(Expr::Unary(UnaryExpr {
                        span: DUMMY_SP,
                        op: op!("typeof"),
                        arg: expr.clone(),
                    })),
                    op: op!("==="),
                    right: Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: "undefined".into(),
                        has_escape: false,
                        kind: Default::default(),
                    }))),
                })),
            }
        }

        // We don't know if type is just a type (interface, etc.) or a concrete value
        // (class, etc.)
        //
        // `typeof` operator allows us to use the expression even if it is not defined,
        // fallback is just `Object`.

        Expr::Cond(CondExpr {
            span: DUMMY_SP,
            test: check_object_existed(Box::new(member_expr.clone())),
            cons: Box::new(quote_ident!("Object").into()),
            alt: Box::new(member_expr),
        })
    }

    fn serialize_type_list(class_name: &str, types: &[Box<TsType>]) -> Expr {
        let mut u = None;

        for ty in types {
            // Skip parens if need be
            let ty = match &**ty {
                TsType::TsParenthesizedType(ty) => &ty.type_ann,
                _ => ty,
            };

            match &**ty {
                // Always elide `never` from the union/intersection if possible
                TsType::TsKeywordType(TsKeywordType {
                    kind: TsKeywordTypeKind::TsNeverKeyword,
                    ..
                }) => {
                    continue;
                }

                // Elide null and undefined from unions for metadata, just like what we did prior to
                // the implementation of strict null checks
                TsType::TsKeywordType(TsKeywordType {
                    kind: TsKeywordTypeKind::TsNullKeyword,
                    ..
                })
                | TsType::TsKeywordType(TsKeywordType {
                    kind: TsKeywordTypeKind::TsUndefinedKeyword,
                    ..
                }) => {
                    continue;
                }

                _ => {}
            }

            let item = serialize_type_node(class_name, &ty);

            // One of the individual is global object, return immediately
            match item {
                Expr::Ident(Ident {
                    sym: js_word!("Object"),
                    ..
                }) => return item,
                _ => {}
            }

            // If there exists union that is not void 0 expression, check if the
            // the common type is identifier. anything more complex
            // and we will just default to Object

            //
            match &u {
                None => {
                    u = Some(item);
                }

                Some(prev) => {
                    // Check for different types
                    match prev {
                        Expr::Ident(prev) => match &item {
                            Expr::Ident(item) if prev.sym == item.sym => {}
                            _ => return quote_ident!("Object").into(),
                        },

                        _ => return quote_ident!("Object").into(),
                    }
                }
            }
        }

        *undefined(DUMMY_SP)
    }

    fn serialize_type_node(class_name: &str, ty: &TsType) -> Expr {
        let span = ty.span();
        match ty {
            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsVoidKeyword,
                ..
            })
            | TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsUndefinedKeyword,
                ..
            })
            | TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsNullKeyword,
                ..
            })
            | TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsNeverKeyword,
                ..
            }) => return *undefined(span),

            TsType::TsParenthesizedType(ty) => serialize_type_node(class_name, &*ty.type_ann),

            TsType::TsFnOrConstructorType(_) => quote_ident!("Function").into(),

            TsType::TsArrayType(_) | TsType::TsTupleType(_) => quote_ident!("Array").into(),

            TsType::TsLitType(TsLitType {
                lit: TsLit::Bool(..),
                ..
            })
            | TsType::TsTypePredicate(_)
            | TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsBooleanKeyword,
                ..
            }) => quote_ident!("Boolean").into(),

            ty if is_str(ty) => quote_ident!("String").into(),

            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsObjectKeyword,
                ..
            }) => quote_ident!("Object").into(),

            TsType::TsLitType(TsLitType {
                lit: TsLit::Number(..),
                ..
            })
            | TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsNumberKeyword,
                ..
            })
            | TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsBigIntKeyword,
                ..
            }) => quote_ident!("Number").into(),

            TsType::TsLitType(ty) => {
                // TODO: Proper error reporting
                panic!("Bad type for decoration: {:?}", ty);
            }

            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsSymbolKeyword,
                ..
            }) => quote_ident!("Symbol").into(),

            TsType::TsTypeQuery(_)
            | TsType::TsTypeOperator(_)
            | TsType::TsIndexedAccessType(_)
            | TsType::TsTypeLit(_)
            | TsType::TsMappedType(_)
            | TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsAnyKeyword,
                ..
            })
            | TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsUnknownKeyword,
                ..
            })
            | TsType::TsThisType(..) => quote_ident!("Object").into(),

            TsType::TsUnionOrIntersectionType(ty) => match ty {
                TsUnionOrIntersectionType::TsUnionType(ty) => {
                    serialize_type_list(class_name, &ty.types)
                }
                TsUnionOrIntersectionType::TsIntersectionType(ty) => {
                    serialize_type_list(class_name, &ty.types)
                }
            },

            TsType::TsConditionalType(ty) => {
                serialize_type_list(class_name, &[ty.true_type.clone(), ty.false_type.clone()])
            }

            TsType::TsTypeRef(ty) => serialize_type_ref(class_name, ty),

            _ => panic!("Bad type for decorator: {:?}", ty),
        }
    }

    let param = match param {
        Some(v) => &v.type_ann,
        None => return *undefined(DUMMY_SP),
    };

    serialize_type_node(class_name.map(|v| &*v.sym).unwrap_or(""), &**param)
}

fn ts_entity_to_member_expr(type_name: &TsEntityName) -> Expr {
    match type_name {
        TsEntityName::TsQualifiedName(q) => {
            let obj = ts_entity_to_member_expr(&q.left);

            Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: obj.as_obj(),
                prop: Box::new(Expr::Ident(q.right.clone())),
                computed: false,
            })
        }
        TsEntityName::Ident(i) => Expr::Ident(i.clone()),
    }
}

fn get_type_ann_of_pat(p: &Pat) -> Option<&TsTypeAnn> {
    match p {
        Pat::Ident(p) => &p.type_ann,
        Pat::Array(p) => &p.type_ann,
        Pat::Rest(p) => &p.type_ann,
        Pat::Object(p) => &p.type_ann,
        Pat::Assign(p) => &p.type_ann,
        Pat::Invalid(_) => return None,
        Pat::Expr(_) => return None,
    }
    .as_ref()
}

fn is_str(ty: &TsType) -> bool {
    match ty {
        TsType::TsLitType(TsLitType {
            lit: TsLit::Str(..),
            ..
        })
        | TsType::TsKeywordType(TsKeywordType {
            kind: TsKeywordTypeKind::TsStringKeyword,
            ..
        }) => true,

        TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(u)) => {
            u.types.iter().all(|ty| is_str(ty))
        }

        _ => false,
    }
}
