/// Emitting decorator metadata.
///
/// This plugin is used to emit decorator metadata for legacy decorators by
/// the `__metadata` helper.
///
/// ## Example
///
/// Input:
/// ```ts
/// class Demo {
///   @LogMethod
///   public foo(bar: number) {}
///
///   @Prop
///   prop: string = "hello";
/// }
/// ```
///
/// Output:
/// ```js
/// class Demo {
///   foo(bar) {}
///   prop = "hello";
/// }
/// babelHelpers.decorate([
///   LogMethod,
///   babelHelpers.decorateParam(0, babelHelpers.decorateMetadata("design:type", Function)),
///   babelHelpers.decorateParam(0, babelHelpers.decorateMetadata("design:paramtypes", [Number])),
///   babelHelpers.decorateParam(0, babelHelpers.decorateMetadata("design:returntype", void 0))
/// ], Demo.prototype, "foo", null);
/// babelHelpers.decorate([Prop, babelHelpers.decorateMetadata("design:type", String)], Demo.prototype, "prop", void 0);
/// ```
///
/// ## Implementation
///
/// Implementation based on https://github.com/microsoft/TypeScript/blob/d85767abfd83880cea17cea70f9913e9c4496dcc/src/compiler/transformers/ts.ts#L1119-L1136
///
/// ## Limitations
///
/// ### Compared to TypeScript
///
/// We are lacking a kind of type inference ability that TypeScript has, so we
/// are not able to determine the exactly type of the type reference.
///
/// ### Compared to SWC
///
/// SWC also has the above limitation, considering that SWC has been adopted in [NestJS](https://docs.nestjs.com/recipes/swc#jest--swc),
/// so the limitation may not be a problem. In addition, SWC provides additional
/// support for inferring enum members, which we currently do not have. We
/// haven't dived into how NestJS uses it, so we don't know if it matters, thus
/// we may leave it until we receive feedback.
///
/// ## References
/// * TypeScript's [emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata)
use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::{common::helper_loader::Helper, context::TraverseCtx};

/// Type of an enum inferred from its members
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum EnumType {
    /// All members are string literals or template literals with string-only
    /// expressions
    String,
    /// All members are numeric, bigint, unary numeric, or auto-incremented
    Number,
    /// Mixed types or computed values
    Object,
}

/// Metadata for decorated methods
pub(super) struct MethodMetadata {
    /// The `design:type` metadata expression
    pub r#type: Expr,
    /// The `design:paramtypes` metadata expression
    pub param_types: Expr,
    /// The `design:returntype` metadata expression (optional, omitted for
    /// getters/setters)
    pub return_type: Option<Expr>,
}

pub struct LegacyDecoratorMetadata {
    /// Stack of method metadata.
    ///
    /// Only the method that needs to be pushed onto a stack is the method
    /// metadata, which should be inserted after all real decorators.
    /// However, method parameters will be processed before the metadata
    /// generation, so we need to temporarily store them in a stack and pop
    /// them when in exit_class_method.
    method_metadata_stack: Vec<Option<MethodMetadata>>,
    /// Stack of constructor metadata expressions, each expression
    /// is the `design:paramtypes`.
    ///
    /// Same as `method_metadata_stack`, but for constructors. Because the
    /// constructor is specially treated in the class, we need to handle it
    /// in `exit_class` rather than `exit_class_method`.
    constructor_metadata_stack: Vec<Option<Expr>>,
    enum_types: FxHashMap<String, EnumType>,
}

impl LegacyDecoratorMetadata {
    pub fn new() -> Self {
        LegacyDecoratorMetadata {
            method_metadata_stack: vec![],
            constructor_metadata_stack: vec![],
            enum_types: FxHashMap::default(),
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for LegacyDecoratorMetadata {
    #[inline]
    fn exit_program(&mut self, _program: &mut Program, _ctx: &mut TraverseCtx) {
        debug_assert!(
            self.method_metadata_stack.is_empty(),
            "All method metadata should have been popped."
        );
        debug_assert!(
            self.constructor_metadata_stack.is_empty(),
            "All constructor metadata should have been popped."
        );
    }

    // `#[inline]` because this is a hot path and most `Stmt`s are not
    // `TsEnumDecl`s. We want to avoid overhead of a function call for the
    // common case.
    #[inline]
    fn enter_stmt(&mut self, stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        // Collect enum types here instead of in a separate hook because the TypeScript
        // plugin transforms enum declarations in `enter_stmt`, and we need to collect
        // the enum type before it gets transformed.
        if let Stmt::Decl(Decl::TsEnum(decl)) = stmt {
            self.collect_enum_type(decl);
        }
    }

    fn enter_class(&mut self, class: &mut Class, ctx: &mut TraverseCtx) {
        let should_transform = !class.span.is_dummy();

        let constructor = class.body.iter_mut().find_map(|item| match item {
            ClassMember::Constructor(ctor) => Some(ctor),
            _ => None,
        });

        let metadata = if should_transform {
            if let Some(constructor) = constructor {
                if !class.decorators.is_empty()
                    || constructor.params.iter().any(|param| match param {
                        ParamOrTsParamProp::Param(p) => !p.decorators.is_empty(),
                        ParamOrTsParamProp::TsParamProp(p) => !p.decorators.is_empty(),
                    })
                {
                    let serialized_type =
                        self.serialize_parameters_types_of_node(&constructor.params, ctx);
                    Some(self.create_metadata("design:paramtypes", serialized_type, ctx))
                } else {
                    None
                }
            } else {
                None
            }
        } else {
            None
        };

        self.constructor_metadata_stack.push(metadata);
    }

    fn enter_class_method(&mut self, method: &mut ClassMethod, ctx: &mut TraverseCtx) {
        // Check if this is a constructor
        if method.kind == MethodKind::Method
            && matches!(
                &method.key,
                PropName::Ident(IdentName { sym, .. }) if sym == "constructor"
            )
        {
            // Handle constructor in `enter_class`
            return;
        }

        let is_typescript_syntax = method.function.body.is_none();
        let is_decorated = !is_typescript_syntax
            && (!method.function.decorators.is_empty()
                || method
                    .function
                    .params
                    .iter()
                    .any(|param| !param.decorators.is_empty()));

        let metadata = is_decorated.then(|| {
            // TypeScript only emits `design:returntype` for regular methods,
            // not for getters or setters.

            let (design_type, return_type) = if method.kind == MethodKind::Getter {
                // For getters, the design type is the type of the property
                (
                    self.serialize_return_type_of_node(&method.function, ctx),
                    None,
                )
            } else if method.kind == MethodKind::Setter {
                // For setters, the design type is the type of the first parameter
                if let Some(param) = method.function.params.first() {
                    (self.serialize_parameter_types_of_node(param, ctx), None)
                } else {
                    (Self::global_object(ctx), None)
                }
            } else {
                // For methods, the design type is always `Function`
                (
                    Self::global_function(ctx),
                    Some(self.serialize_return_type_of_node(&method.function, ctx)),
                )
            };

            let param_types =
                self.serialize_parameters_types_of_function(&method.function.params, ctx);

            MethodMetadata {
                r#type: self.create_metadata("design:type", design_type, ctx),
                param_types: self.create_metadata("design:paramtypes", param_types, ctx),
                return_type: return_type.map(|t| self.create_metadata("design:returntype", t, ctx)),
            }
        });

        self.method_metadata_stack.push(metadata);
    }

    #[inline]
    fn enter_class_prop(&mut self, prop: &mut ClassProp, ctx: &mut TraverseCtx) {
        if prop.decorators.is_empty() {
            return;
        }
        prop.decorators
            .push(self.create_design_type_metadata(prop.type_ann.as_deref(), ctx));
    }

    #[inline]
    fn enter_auto_accessor(&mut self, prop: &mut AutoAccessor, ctx: &mut TraverseCtx) {
        if !prop.decorators.is_empty() {
            prop.decorators
                .push(self.create_design_type_metadata(prop.type_ann.as_deref(), ctx));
        }
    }
}

impl LegacyDecoratorMetadata {
    /// Collects enum type information for decorator metadata generation.
    fn collect_enum_type(&mut self, decl: &TsEnumDecl) {
        let name = decl.id.sym.to_string();
        let enum_type = Self::infer_enum_type(&decl.members);
        self.enum_types.insert(name, enum_type);
    }

    /// Infer the type of an enum based on its members
    fn infer_enum_type(members: &[TsEnumMember]) -> EnumType {
        let mut enum_type = EnumType::Object;

        for member in members {
            if let Some(init) = &member.init {
                match &**init {
                    Expr::Lit(Lit::Str(_)) | Expr::Tpl(_) if enum_type != EnumType::Number => {
                        enum_type = EnumType::String;
                    }
                    // TS considers `+x`, `-x`, `~x` to be `Number` type, no matter what `x` is.
                    // All other unary expressions (`!x`, `void x`, `typeof x`, `delete x`) are
                    // illegal in enum initializers, so we can ignore those
                    // cases here and just say all `UnaryExpression`s are numeric.
                    // Bigint literals are also illegal in enum initializers, so we don't need to
                    // consider them here.
                    Expr::Lit(Lit::Num(_)) | Expr::Unary(_) if enum_type != EnumType::String => {
                        enum_type = EnumType::Number;
                    }
                    // For other expressions, we can't determine the type statically
                    _ => return EnumType::Object,
                }
            } else {
                // No initializer means numeric (auto-incrementing from previous member)
                if enum_type == EnumType::String {
                    return EnumType::Object;
                }
                enum_type = EnumType::Number;
            }
        }

        enum_type
    }

    pub fn pop_method_metadata(&mut self) -> Option<MethodMetadata> {
        self.method_metadata_stack.pop().flatten()
    }

    pub fn pop_constructor_metadata(&mut self) -> Option<Expr> {
        self.constructor_metadata_stack.pop().flatten()
    }

    fn serialize_type_annotation(
        &mut self,
        type_annotation: Option<&TsTypeAnn>,
        ctx: &mut TraverseCtx,
    ) -> Expr {
        if let Some(type_annotation) = type_annotation {
            self.serialize_type_node(&type_annotation.type_ann, ctx)
        } else {
            Self::global_object(ctx)
        }
    }

    /// Serializes a type node for use with decorator type metadata.
    ///
    /// Types are serialized in the following fashion:
    /// - Void types point to "undefined" (e.g. "void 0")
    /// - Function and Constructor types point to the global "Function"
    ///   constructor.
    /// - Interface types with a call or construct signature types point to the
    ///   global "Function" constructor.
    /// - Array and Tuple types point to the global "Array" constructor.
    /// - Type predicates and booleans point to the global "Boolean"
    ///   constructor.
    /// - String literal types and strings point to the global "String"
    ///   constructor.
    /// - Enum and number types point to the global "Number" constructor.
    /// - Symbol types point to the global "Symbol" constructor.
    /// - Type references to classes (or class-like variables) point to the
    ///   constructor for the class.
    /// - Anything else points to the global "Object" constructor.
    fn serialize_type_node(&mut self, node: &TsType, ctx: &mut TraverseCtx) -> Expr {
        match &node {
            TsType::TsKeywordType(keyword) => match keyword.kind {
                TsKeywordTypeKind::TsVoidKeyword
                | TsKeywordTypeKind::TsUndefinedKeyword
                | TsKeywordTypeKind::TsNullKeyword
                | TsKeywordTypeKind::TsNeverKeyword => Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: UnaryOp::Void,
                    arg: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 0.0,
                        raw: None,
                    }))),
                }),
                TsKeywordTypeKind::TsBooleanKeyword => Self::global_boolean(ctx),
                TsKeywordTypeKind::TsStringKeyword => Self::global_string(ctx),
                TsKeywordTypeKind::TsNumberKeyword => Self::global_number(ctx),
                TsKeywordTypeKind::TsBigIntKeyword => Self::global_bigint(ctx),
                TsKeywordTypeKind::TsSymbolKeyword => Self::global_symbol(ctx),
                TsKeywordTypeKind::TsObjectKeyword
                | TsKeywordTypeKind::TsAnyKeyword
                | TsKeywordTypeKind::TsUnknownKeyword => Self::global_object(ctx),
                _ => Self::global_object(ctx),
            },
            TsType::TsFnOrConstructorType(_) => Self::global_function(ctx),
            TsType::TsArrayType(_) | TsType::TsTupleType(_) => Self::global_array(ctx),
            TsType::TsTypePredicate(t) => {
                if t.asserts {
                    Expr::Unary(UnaryExpr {
                        span: DUMMY_SP,
                        op: UnaryOp::Void,
                        arg: Box::new(Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: 0.0,
                            raw: None,
                        }))),
                    })
                } else {
                    Self::global_boolean(ctx)
                }
            }
            TsType::TsLitType(literal) => {
                Self::serialize_literal_of_literal_type_node(&literal.lit, ctx)
            }
            TsType::TsTypeRef(t) => self.serialize_type_reference_node(&t.type_name, ctx),
            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsIntersectionType(t)) => {
                self.serialize_union_or_intersection_constituents(
                    &t.types, /* is_intersection */ true, ctx,
                )
            }
            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(t)) => {
                self.serialize_union_or_intersection_constituents(
                    &t.types, /* is_intersection */ false, ctx,
                )
            }
            TsType::TsConditionalType(t) => self.serialize_union_or_intersection_constituents(
                &[t.true_type.clone(), t.false_type.clone()],
                false,
                ctx,
            ),
            TsType::TsTypeOperator(operator) if operator.op == TsTypeOperatorOp::ReadOnly => {
                self.serialize_type_node(&operator.type_ann, ctx)
            }
            TsType::TsParenthesizedType(t) => self.serialize_type_node(&t.type_ann, ctx),
            // Fallback to `Object`
            _ => Self::global_object(ctx),
        }
    }

    /// Serializes the type of a node for use with decorator type metadata.
    fn serialize_parameters_types_of_node(
        &mut self,
        params: &[ParamOrTsParamProp],
        ctx: &mut TraverseCtx,
    ) -> Expr {
        let elements: Vec<_> = params
            .iter()
            .map(|param| match param {
                ParamOrTsParamProp::Param(p) => Some(ExprOrSpread {
                    spread: None,
                    expr: Box::new(self.serialize_parameter_types_of_node(p, ctx)),
                }),
                ParamOrTsParamProp::TsParamProp(p) => Some(ExprOrSpread {
                    spread: None,
                    expr: Box::new(self.serialize_ts_param_prop_param(&p.param, ctx)),
                }),
            })
            .collect();
        Expr::Array(ArrayLit {
            span: DUMMY_SP,
            elems: elements,
        })
    }

    fn serialize_parameters_types_of_function(
        &mut self,
        params: &[Param],
        ctx: &mut TraverseCtx,
    ) -> Expr {
        let elements: Vec<_> = params
            .iter()
            .map(|p| {
                Some(ExprOrSpread {
                    spread: None,
                    expr: Box::new(self.serialize_parameter_types_of_node(p, ctx)),
                })
            })
            .collect();
        Expr::Array(ArrayLit {
            span: DUMMY_SP,
            elems: elements,
        })
    }

    fn serialize_parameter_types_of_node(&mut self, param: &Param, ctx: &mut TraverseCtx) -> Expr {
        let type_annotation = match &param.pat {
            Pat::Assign(pattern) => Self::get_pat_type_ann(&pattern.left),
            _ => Self::get_pat_type_ann(&param.pat),
        };
        self.serialize_type_annotation(type_annotation, ctx)
    }

    fn serialize_ts_param_prop_param(
        &mut self,
        param: &TsParamPropParam,
        ctx: &mut TraverseCtx,
    ) -> Expr {
        let type_annotation = match param {
            TsParamPropParam::Ident(ident) => ident.type_ann.as_ref(),
            TsParamPropParam::Assign(assign) => match assign.left.as_ref() {
                Pat::Ident(ident) => ident.type_ann.as_ref(),
                _ => None,
            },
        };
        self.serialize_type_annotation(type_annotation.map(|v| &**v), ctx)
    }

    /// Get the type annotation from a pattern
    fn get_pat_type_ann(pat: &Pat) -> Option<&TsTypeAnn> {
        match pat {
            Pat::Ident(ident) => ident.type_ann.as_deref(),
            Pat::Array(arr) => arr.type_ann.as_deref(),
            Pat::Object(obj) => obj.type_ann.as_deref(),
            Pat::Rest(rest) => rest.type_ann.as_deref(),
            Pat::Assign(assign) => Self::get_pat_type_ann(&assign.left),
            Pat::Invalid(_) | Pat::Expr(_) => None,
        }
    }

    /// Serializes the return type of a node for use with decorator type
    /// metadata.
    fn serialize_return_type_of_node(&mut self, func: &Function, ctx: &mut TraverseCtx) -> Expr {
        if func.is_async {
            Self::global_promise(ctx)
        } else if let Some(return_type) = &func.return_type {
            self.serialize_type_node(&return_type.type_ann, ctx)
        } else {
            Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: UnaryOp::Void,
                arg: Box::new(Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: 0.0,
                    raw: None,
                }))),
            })
        }
    }

    /// `A.B` -> `typeof (_a$b = typeof A !== "undefined" && A.B) == "function"
    /// ? _a$b : Object`
    fn serialize_type_reference_node(
        &mut self,
        name: &TsEntityName,
        ctx: &mut TraverseCtx,
    ) -> Expr {
        // Check if this is an enum type reference - if so, return the primitive type
        // directly
        if let TsEntityName::Ident(ident) = name {
            if let Some(enum_type) = self.enum_types.get(&ident.sym.to_string()) {
                return match enum_type {
                    EnumType::String => Self::global_string(ctx),
                    EnumType::Number => Self::global_number(ctx),
                    EnumType::Object => Self::global_object(ctx),
                };
            }
        }

        let Some(serialized_type) = self.serialize_entity_name_as_expression_fallback(name, ctx)
        else {
            // Reach here means the referent is a type symbol, so use `Object` as fallback.
            return Self::global_object(ctx);
        };

        let binding = ctx.var_declarations.create_uid_var("ref");
        let target =
            AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent::from(Ident::new(
                Atom::from(binding.as_str()),
                DUMMY_SP,
                SyntaxContext::empty(),
            ))));
        let assignment = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::Assign,
            left: target,
            right: Box::new(serialized_type),
        });
        let type_of = Expr::Unary(UnaryExpr {
            span: DUMMY_SP,
            op: UnaryOp::TypeOf,
            arg: Box::new(assignment),
        });
        let right = Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: "function".into(),
            raw: None,
        }));
        let test = Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: BinaryOp::EqEqEq,
            left: Box::new(type_of),
            right: Box::new(right),
        });
        let consequent = Expr::Ident(Ident::new(
            Atom::from(binding.as_str()),
            DUMMY_SP,
            SyntaxContext::empty(),
        ));
        let alternate = Self::global_object(ctx);
        Expr::Cond(CondExpr {
            span: DUMMY_SP,
            test: Box::new(test),
            cons: Box::new(consequent),
            alt: Box::new(alternate),
        })
    }

    /// Serializes an entity name which may not exist at runtime, but whose
    /// access shouldn't throw
    #[allow(clippy::only_used_in_recursion)]
    fn serialize_entity_name_as_expression_fallback(
        &mut self,
        name: &TsEntityName,
        ctx: &mut TraverseCtx,
    ) -> Option<Expr> {
        match name {
            // `A` -> `typeof A !== "undefined" && A`
            TsEntityName::Ident(ident) => {
                let ident1 = Expr::Ident(ident.clone());
                let ident2 = Expr::Ident(ident.clone());
                Some(Self::create_checked_value(ident1, ident2, ctx))
            }
            TsEntityName::TsQualifiedName(qualified) => {
                if let TsEntityName::Ident(ident) = &qualified.left {
                    // `A.B` -> `typeof A !== "undefined" && A.B`
                    let ident1 = Expr::Ident(ident.clone());
                    let ident2 = Expr::Ident(ident.clone());
                    let member = Expr::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(ident1),
                        prop: MemberProp::Ident(IdentName {
                            span: DUMMY_SP,
                            sym: qualified.right.sym.clone(),
                        }),
                    });
                    Some(Self::create_checked_value(ident2, member, ctx))
                } else {
                    // `A.B.C` -> `typeof A !== "undefined" && (_a = A.B) !== void 0 && _a.C`
                    let mut left =
                        self.serialize_entity_name_as_expression_fallback(&qualified.left, ctx)?;
                    let binding = ctx.var_declarations.create_uid_var("a");

                    if let Expr::Bin(BinExpr {
                        op: BinaryOp::LogicalAnd,
                        right,
                        ..
                    }) = &mut left
                    {
                        let right_expr = std::mem::take(right);
                        // `(_a = A.B)`
                        let assignment = Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: AssignOp::Assign,
                            left: AssignTarget::Simple(SimpleAssignTarget::Ident(
                                BindingIdent::from(Ident::new(
                                    Atom::from(binding.as_str()),
                                    DUMMY_SP,
                                    SyntaxContext::empty(),
                                )),
                            )),
                            right: right_expr,
                        });
                        // `(_a = A.B) !== void 0`
                        *right = Box::new(Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            left: Box::new(assignment),
                            op: BinaryOp::NotEqEq,
                            right: Box::new(Expr::Unary(UnaryExpr {
                                span: DUMMY_SP,
                                op: UnaryOp::Void,
                                arg: Box::new(Expr::Lit(Lit::Num(Number {
                                    span: DUMMY_SP,
                                    value: 0.0,
                                    raw: None,
                                }))),
                            })),
                        }));
                    }

                    let object = Expr::Ident(Ident::new(
                        Atom::from(binding.as_str()),
                        DUMMY_SP,
                        SyntaxContext::empty(),
                    ));
                    let member = Expr::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(object),
                        prop: MemberProp::Ident(IdentName {
                            span: DUMMY_SP,
                            sym: qualified.right.sym.clone(),
                        }),
                    });
                    Some(Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        op: BinaryOp::LogicalAnd,
                        left: Box::new(left),
                        right: Box::new(member),
                    }))
                }
            }
        }
    }

    fn serialize_literal_of_literal_type_node(literal: &TsLit, ctx: &mut TraverseCtx) -> Expr {
        match literal {
            TsLit::Bool(_) => Self::global_boolean(ctx),
            TsLit::Number(_) => Self::global_number(ctx),
            TsLit::BigInt(_) => Self::global_bigint(ctx),
            TsLit::Str(_) | TsLit::Tpl(_) => Self::global_string(ctx),
        }
    }

    fn serialize_union_or_intersection_constituents(
        &mut self,
        types: &[Box<TsType>],
        is_intersection: bool,
        ctx: &mut TraverseCtx,
    ) -> Expr {
        let mut serialized_type = None;

        for t in types {
            let t = Self::without_parenthesized(t);
            match t {
                TsType::TsKeywordType(keyword)
                    if keyword.kind == TsKeywordTypeKind::TsNeverKeyword =>
                {
                    if is_intersection {
                        // Reduce to `never` in an intersection
                        return Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: UnaryOp::Void,
                            arg: Box::new(Expr::Lit(Lit::Num(Number {
                                span: DUMMY_SP,
                                value: 0.0,
                                raw: None,
                            }))),
                        });
                    }
                    // Elide `never` in a union
                    continue;
                }
                TsType::TsKeywordType(keyword)
                    if keyword.kind == TsKeywordTypeKind::TsUnknownKeyword =>
                {
                    if !is_intersection {
                        // Reduce to `unknown` in a union
                        return Self::global_object(ctx);
                    }
                    // Elide `unknown` in an intersection
                    continue;
                }
                TsType::TsKeywordType(keyword)
                    if keyword.kind == TsKeywordTypeKind::TsAnyKeyword =>
                {
                    return Self::global_object(ctx);
                }
                // Unlike TypeScript, we don't have a way to determine what the referent is,
                // so return `Object` early, because once have a type reference, the final
                // type is `Object` anyway.
                TsType::TsTypeRef(_) => return Self::global_object(ctx),
                _ => {}
            }

            let serialized_constituent = self.serialize_type_node(t, ctx);
            if matches!(&serialized_constituent, Expr::Ident(ident) if ident.sym == "Object") {
                // One of the individual is global object, return immediately
                return serialized_constituent;
            }

            // If there exists union that is not `void 0` expression, check if the the
            // common type is identifier. anything more complex and we will just
            // default to Object
            if let Some(ref serialized_type_ref) = &serialized_type {
                // Different types - compare expressions
                if !Self::equate_serialized_type_nodes(serialized_type_ref, &serialized_constituent)
                {
                    return Self::global_object(ctx);
                }
            } else {
                // Initialize the union type
                serialized_type = Some(serialized_constituent);
            }
        }

        // If we were able to find common type, use it
        serialized_type.unwrap_or_else(|| {
            // Fallback is only hit if all union constituents are null/undefined/never
            Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: UnaryOp::Void,
                arg: Box::new(Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: 0.0,
                    raw: None,
                }))),
            })
        })
    }

    /// Compares two serialized type nodes for equality.
    #[inline]
    fn equate_serialized_type_nodes(a: &Expr, b: &Expr) -> bool {
        // Simple structural equality check
        match (a, b) {
            (Expr::Ident(a), Expr::Ident(b)) => a.sym == b.sym,
            _ => false,
        }
    }

    #[inline]
    fn without_parenthesized(node: &TsType) -> &TsType {
        match node {
            TsType::TsParenthesizedType(t) => Self::without_parenthesized(&t.type_ann),
            _ => node,
        }
    }

    #[inline]
    fn create_global_identifier(ident: &str, _ctx: &mut TraverseCtx) -> Expr {
        Expr::Ident(Ident::new(
            Atom::from(ident),
            DUMMY_SP,
            SyntaxContext::empty(),
        ))
    }

    #[inline]
    fn global_object(ctx: &mut TraverseCtx) -> Expr {
        Self::create_global_identifier("Object", ctx)
    }

    #[inline]
    fn global_function(ctx: &mut TraverseCtx) -> Expr {
        Self::create_global_identifier("Function", ctx)
    }

    #[inline]
    fn global_array(ctx: &mut TraverseCtx) -> Expr {
        Self::create_global_identifier("Array", ctx)
    }

    #[inline]
    fn global_boolean(ctx: &mut TraverseCtx) -> Expr {
        Self::create_global_identifier("Boolean", ctx)
    }

    #[inline]
    fn global_string(ctx: &mut TraverseCtx) -> Expr {
        Self::create_global_identifier("String", ctx)
    }

    #[inline]
    fn global_number(ctx: &mut TraverseCtx) -> Expr {
        Self::create_global_identifier("Number", ctx)
    }

    #[inline]
    fn global_bigint(ctx: &mut TraverseCtx) -> Expr {
        Self::create_global_identifier("BigInt", ctx)
    }

    #[inline]
    fn global_symbol(ctx: &mut TraverseCtx) -> Expr {
        Self::create_global_identifier("Symbol", ctx)
    }

    #[inline]
    fn global_promise(ctx: &mut TraverseCtx) -> Expr {
        Self::create_global_identifier("Promise", ctx)
    }

    /// Produces an expression that results in `right` if `left` is not
    /// undefined at runtime:
    ///
    /// ```
    /// typeof left !== "undefined" && right
    /// ```
    ///
    /// We use `typeof L !== "undefined"` (rather than `L !== undefined`) since
    /// `L` may not be declared. It's acceptable for this expression to
    /// result in `false` at runtime, as the result is intended to be
    /// further checked by any containing expression.
    fn create_checked_value(left: Expr, right: Expr, _ctx: &TraverseCtx) -> Expr {
        let undefined = Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: "undefined".into(),
            raw: None,
        }));
        let typeof_left = Expr::Unary(UnaryExpr {
            span: DUMMY_SP,
            op: UnaryOp::TypeOf,
            arg: Box::new(left),
        });
        let left_check = Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: BinaryOp::NotEqEq,
            left: Box::new(typeof_left),
            right: Box::new(undefined),
        });
        Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: BinaryOp::LogicalAnd,
            left: Box::new(left_check),
            right: Box::new(right),
        })
    }

    // `_metadata(key, value)`
    fn create_metadata(&self, key: &str, value: Expr, ctx: &mut TraverseCtx) -> Expr {
        let arguments = vec![
            ExprOrSpread {
                spread: None,
                expr: Box::new(Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    value: key.into(),
                    raw: None,
                }))),
            },
            ExprOrSpread {
                spread: None,
                expr: Box::new(value),
            },
        ];
        // SAFETY: helper_load doesn't actually use the _ctx parameter, so we can safely
        // create separate borrows using raw pointers to bypass the borrow checker
        let callee = unsafe {
            let ctx_ptr = ctx as *mut TraverseCtx;
            let transform_ctx = &(*ctx_ptr).ctx;
            transform_ctx.helper_load(Helper::DecorateMetadata, DUMMY_SP, &mut *ctx_ptr)
        };
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            callee: Callee::Expr(Box::new(callee)),
            args: arguments,
            type_args: None,
        })
    }

    // `_metadata(key, value)` as decorator
    fn create_metadata_decorate(&self, key: &str, value: Expr, ctx: &mut TraverseCtx) -> Decorator {
        Decorator {
            span: DUMMY_SP,
            expr: Box::new(self.create_metadata(key, value, ctx)),
        }
    }

    /// `_metadata("design:type", type)`
    fn create_design_type_metadata(
        &mut self,
        type_annotation: Option<&TsTypeAnn>,
        ctx: &mut TraverseCtx,
    ) -> Decorator {
        let serialized_type = self.serialize_type_annotation(type_annotation, ctx);
        self.create_metadata_decorate("design:type", serialized_type, ctx)
    }
}
