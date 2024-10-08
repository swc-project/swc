use std::ops::Deref;

use swc_atoms::JsWord;
use swc_common::{
    collections::AHashMap,
    util::{move_map::MoveMap, take::Take},
    BytePos, Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_visit::{VisitMut, VisitMutWith};

use super::EnumKind;

/// https://github.com/leonardfactory/babel-plugin-transform-typescript-metadata/blob/master/src/parameter/parameterVisitor.ts
pub(super) struct ParamMetadata;

impl VisitMut for ParamMetadata {
    fn visit_mut_class(&mut self, cls: &mut Class) {
        cls.visit_mut_children_with(self);

        let mut decorators = cls.decorators.take();

        cls.body = cls.body.take().move_map(|m| match m {
            ClassMember::Constructor(mut c) => {
                for (idx, param) in c.params.iter_mut().enumerate() {
                    //
                    match param {
                        ParamOrTsParamProp::TsParamProp(p) => {
                            for decorator in p.decorators.drain(..) {
                                let new_dec = self.create_param_decorator(idx, decorator.expr);
                                decorators.push(new_dec);
                            }
                        }
                        ParamOrTsParamProp::Param(param) => {
                            for decorator in param.decorators.drain(..) {
                                let new_dec = self.create_param_decorator(idx, decorator.expr);
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
    }

    fn visit_mut_class_method(&mut self, m: &mut ClassMethod) {
        for (idx, param) in m.function.params.iter_mut().enumerate() {
            for decorator in param.decorators.drain(..) {
                let new_dec = self.create_param_decorator(idx, decorator.expr);
                m.function.decorators.push(new_dec);
            }
        }
    }
}

impl ParamMetadata {
    fn create_param_decorator(
        &self,
        param_index: usize,
        mut decorator_expr: Box<Expr>,
    ) -> Decorator {
        remove_span(&mut decorator_expr);

        Decorator {
            span: DUMMY_SP,
            expr: CallExpr {
                span: DUMMY_SP,
                callee: helper!(ts, ts_param),
                args: vec![param_index.as_arg(), decorator_expr.as_arg()],
                ..Default::default()
            }
            .into(),
        }
    }
}

pub(super) fn remove_span(e: &mut Expr) {
    match e {
        Expr::Member(m) => {
            m.span = DUMMY_SP;
            remove_span(&mut m.obj);
        }
        Expr::Call(c) => {
            c.span = DUMMY_SP;
            if let Callee::Expr(e) = &mut c.callee {
                remove_span(e);
            }
            for arg in &mut c.args {
                remove_span(&mut arg.expr);
            }
        }
        _ => {
            e.set_span(DUMMY_SP);
        }
    }
}

type EnumMapType = AHashMap<JsWord, EnumKind>;

pub(super) struct EnumMap<'a>(&'a EnumMapType);

impl Deref for EnumMap<'_> {
    type Target = EnumMapType;

    fn deref(&self) -> &Self::Target {
        self.0
    }
}

impl EnumMap<'_> {
    fn get_kind_as_str(&self, param: Option<&TsTypeAnn>) -> Option<&'static str> {
        param
            .and_then(|t| t.type_ann.as_ts_type_ref())
            .and_then(|t| t.type_name.as_ident())
            .and_then(|t| self.get(&t.sym))
            .map(|kind| match kind {
                EnumKind::Mixed => "Object",
                EnumKind::Str => "String",
                EnumKind::Num => "Number",
            })
    }
}

/// https://github.com/leonardfactory/babel-plugin-transform-typescript-metadata/blob/master/src/metadata/metadataVisitor.ts
pub(super) struct Metadata<'a> {
    pub(super) enums: EnumMap<'a>,

    pub(super) class_name: Option<&'a Ident>,
}

impl VisitMut for Metadata<'_> {
    fn visit_mut_class(&mut self, c: &mut Class) {
        c.visit_mut_children_with(self);

        if c.decorators.is_empty() {
            return;
        }

        let constructor = c.body.iter().find_map(|m| match m {
            ClassMember::Constructor(c) => Some(c),
            _ => None,
        });
        if constructor.is_none() {
            return;
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
                                    TsParamPropParam::Ident(i) => i.type_ann.as_deref(),
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
    }

    fn visit_mut_class_method(&mut self, m: &mut ClassMethod) {
        if m.function.decorators.is_empty() {
            return;
        }

        {
            let type_arg = match m.kind {
                MethodKind::Method => quote_ident!("Function").as_arg(),
                MethodKind::Getter => {
                    let return_type = m.function.return_type.as_deref();

                    if let Some(kind) = self.enums.get_kind_as_str(return_type) {
                        quote_ident!(kind).as_arg()
                    } else {
                        serialize_type(self.class_name, return_type).as_arg()
                    }
                }
                MethodKind::Setter => serialize_type(
                    self.class_name,
                    get_type_ann_of_pat(&m.function.params[0].pat),
                )
                .as_arg(),
            };

            let dec = self.create_metadata_design_decorator("design:type", type_arg);
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

        // https://github.com/microsoft/TypeScript/blob/2a8865e6ba95c9bdcdb9e2c9c08f10c5f5c75391/src/compiler/transformers/ts.ts#L1180
        if m.kind == MethodKind::Method {
            // Copy tsc behaviour
            // https://github.com/microsoft/TypeScript/blob/5e8c261b6ab746213f19ee3501eb8c48a6215dd7/src/compiler/transformers/typeSerializer.ts#L242
            let dec = self.create_metadata_design_decorator(
                "design:returntype",
                if m.function.is_async {
                    quote_ident!("Promise").as_arg()
                } else {
                    let return_type = m.function.return_type.as_deref();

                    if let Some(kind) = self.enums.get_kind_as_str(return_type) {
                        quote_ident!(kind).as_arg()
                    } else {
                        serialize_type(self.class_name, return_type).as_arg()
                    }
                },
            );
            m.function.decorators.push(dec);
        }
    }

    fn visit_mut_class_prop(&mut self, p: &mut ClassProp) {
        if p.decorators.is_empty() || p.type_ann.is_none() {
            return;
        }

        let dec = self.create_metadata_design_decorator("design:type", {
            let prop_type = p.type_ann.as_deref();

            if let Some(kind) = self.enums.get_kind_as_str(prop_type) {
                quote_ident!(kind).as_arg()
            } else {
                serialize_type(self.class_name, prop_type).as_arg()
            }
        });
        p.decorators.push(dec);
    }
}

impl<'a> Metadata<'a> {
    pub(super) fn new(enums: &'a EnumMapType, class_name: Option<&'a Ident>) -> Self {
        Self {
            enums: EnumMap(enums),
            class_name,
        }
    }

    fn create_metadata_design_decorator(&self, design: &str, type_arg: ExprOrSpread) -> Decorator {
        Decorator {
            span: DUMMY_SP,
            expr: CallExpr {
                span: DUMMY_SP,
                callee: helper!(ts, ts_metadata),
                args: vec![design.as_arg(), type_arg],
                ..Default::default()
            }
            .into(),
        }
    }
}

fn serialize_type(class_name: Option<&Ident>, param: Option<&TsTypeAnn>) -> Expr {
    fn check_object_existed(expr: Box<Expr>) -> Box<Expr> {
        match *expr {
            Expr::Member(ref member_expr) => {
                let obj_expr = member_expr.obj.clone();
                BinExpr {
                    span: DUMMY_SP,
                    left: check_object_existed(obj_expr),
                    op: op!("||"),
                    right: Box::new(
                        BinExpr {
                            span: DUMMY_SP,
                            left: Box::new(Expr::Unary(UnaryExpr {
                                span: DUMMY_SP,
                                op: op!("typeof"),
                                arg: expr,
                            })),
                            op: op!("==="),
                            right: Box::new(Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: "undefined".into(),
                                raw: None,
                            }))),
                        }
                        .into(),
                    ),
                }
                .into()
            }
            _ => BinExpr {
                span: DUMMY_SP,
                left: Box::new(
                    UnaryExpr {
                        span: DUMMY_SP,
                        op: op!("typeof"),
                        arg: expr,
                    }
                    .into(),
                ),
                op: op!("==="),
                right: Box::new(
                    Lit::Str(Str {
                        span: DUMMY_SP,
                        value: "undefined".into(),
                        raw: None,
                    })
                    .into(),
                ),
            }
            .into(),
        }
    }

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

        // We don't know if type is just a type (interface, etc.) or a concrete value
        // (class, etc.)
        //
        // `typeof` operator allows us to use the expression even if it is not defined,
        // fallback is just `Object`.

        CondExpr {
            span: DUMMY_SP,
            test: check_object_existed(Box::new(member_expr.clone())),
            cons: Box::new(quote_ident!("Object").into()),
            alt: Box::new(member_expr),
        }
        .into()
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
                    return quote_ident!("Object").into();
                }

                _ => {}
            }

            let item = serialize_type_node(class_name, ty);

            // One of the individual is global object, return immediately
            if item.is_ident_ref_to("Object") {
                return item;
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

        match u {
            Some(i) => i,
            _ => quote_ident!("Object").into(),
        }
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
            }) => *Expr::undefined(span),

            TsType::TsParenthesizedType(ty) => serialize_type_node(class_name, &ty.type_ann),

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
            }) => quote_ident!("Number").into(),

            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsBigIntKeyword,
                ..
            }) => CondExpr {
                span: DUMMY_SP,
                test: check_object_existed(quote_ident!("BigInt").into()),
                cons: quote_ident!("Object").into(),
                alt: quote_ident!("BigInt").into(),
            }
            .into(),

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
        None => return *Expr::undefined(DUMMY_SP),
    };

    serialize_type_node(class_name.map(|v| &*v.sym).unwrap_or(""), param)
}

fn ts_entity_to_member_expr(type_name: &TsEntityName) -> Expr {
    match type_name {
        TsEntityName::TsQualifiedName(q) => {
            let obj = ts_entity_to_member_expr(&q.left);

            MemberExpr {
                span: DUMMY_SP,
                obj: obj.into(),
                prop: MemberProp::Ident(q.right.clone()),
            }
            .into()
        }
        TsEntityName::Ident(i) => i.clone().with_pos(BytePos::DUMMY, BytePos::DUMMY).into(),
    }
}

fn get_type_ann_of_pat(p: &Pat) -> Option<&TsTypeAnn> {
    match p {
        Pat::Ident(p) => p.type_ann.as_deref(),
        Pat::Array(p) => p.type_ann.as_deref(),
        Pat::Rest(p) => p.type_ann.as_deref(),
        Pat::Object(p) => p.type_ann.as_deref(),
        Pat::Assign(p) => get_type_ann_of_pat(&p.left),
        Pat::Invalid(_) => None,
        Pat::Expr(_) => None,
    }
}

fn is_str(ty: &TsType) -> bool {
    match ty {
        TsType::TsLitType(TsLitType {
            lit: TsLit::Str(..) | TsLit::Tpl(..),
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
