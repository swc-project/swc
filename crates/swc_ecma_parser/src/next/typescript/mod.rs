//! TypeScript declarations and type productions.

#[cfg(feature = "flow")]
use swc_common::SyntaxContext;
use swc_common::{BytePos, Span, Spanned};
#[cfg(feature = "flow")]
use swc_ecma_ast::{
    AssignPat, FnDecl, Function, KeyValuePatProp, ObjectPat, ObjectPatProp, Param, Pat, PropName,
    RestPat,
};
use swc_ecma_ast::{
    BindingIdent, Decl, Expr, Ident, IdentName, Lit, Stmt, TruePlusMinus, TsArrayType,
    TsCallSignatureDecl, TsConditionalType, TsConstructSignatureDecl, TsConstructorType,
    TsEntityName, TsEnumDecl, TsEnumMember, TsEnumMemberId, TsExprWithTypeArgs, TsFnParam,
    TsFnType, TsGetterSignature, TsImportCallOptions, TsImportType, TsIndexSignature,
    TsIndexedAccessType, TsInferType, TsInterfaceBody, TsInterfaceDecl, TsIntersectionType,
    TsKeywordType, TsKeywordTypeKind, TsLit, TsLitType, TsMappedType, TsMethodSignature,
    TsModuleBlock, TsModuleDecl, TsModuleName, TsNamespaceBody, TsNamespaceDecl, TsOptionalType,
    TsParenthesizedType, TsPropertySignature, TsQualifiedName, TsRestType, TsSetterSignature,
    TsThisType, TsThisTypeOrIdent, TsTplLitType, TsTupleElement, TsTupleType, TsType,
    TsTypeAliasDecl, TsTypeAnn, TsTypeAssertion, TsTypeElement, TsTypeLit, TsTypeOperator,
    TsTypeOperatorOp, TsTypeParam, TsTypeParamDecl, TsTypeParamInstantiation, TsTypePredicate,
    TsTypeQuery, TsTypeQueryExpr, TsTypeRef, TsUnionType,
};

use crate::{
    error::Error,
    next::{
        lexer::{config::Config, TokenKind as Kind},
        parser::{context::Context, cursor::Parser},
    },
};

#[derive(Clone, Copy, PartialEq, Eq)]
enum FlowEnumInitializer {
    Boolean,
    BigInt,
    Number,
    String,
    Invalid,
}

fn flow_enum_initializer_kind(expression: &Expr) -> FlowEnumInitializer {
    match expression {
        Expr::Lit(Lit::Bool(_)) => FlowEnumInitializer::Boolean,
        Expr::Lit(Lit::BigInt(_)) => FlowEnumInitializer::BigInt,
        Expr::Lit(Lit::Num(_)) => FlowEnumInitializer::Number,
        Expr::Lit(Lit::Str(_)) => FlowEnumInitializer::String,
        Expr::Unary(unary)
            if unary.op == swc_ecma_ast::UnaryOp::Minus
                && matches!(&*unary.arg, Expr::Lit(Lit::Num(_))) =>
        {
            FlowEnumInitializer::Number
        }
        _ => FlowEnumInitializer::Invalid,
    }
}

impl<C: Config> Parser<'_, C> {
    pub(crate) fn validate_flow_type_binding(&mut self, identifier: &Ident) {
        if self.context().contains(Context::FLOW) && is_flow_reserved_type_binding(&identifier.sym)
        {
            self.emit_error(Error::new(
                identifier.span,
                crate::error::SyntaxError::Unexpected {
                    got: identifier.sym.to_string(),
                    expected: "non-reserved Flow type binding",
                },
            ));
        }
    }

    #[cfg(feature = "flow")]
    fn flow_mark_pattern_optional(pattern: &mut Pat) {
        match pattern {
            Pat::Ident(binding) => binding.id.optional = true,
            Pat::Array(array) => array.optional = true,
            Pat::Object(object) => object.optional = true,
            _ => {}
        }
    }

    #[cfg(feature = "flow")]
    fn flow_apply_type_annotation(pattern: &mut Pat, type_ann: Box<TsTypeAnn>) {
        match pattern {
            Pat::Ident(binding) => binding.type_ann = Some(type_ann),
            Pat::Array(array) => array.type_ann = Some(type_ann),
            Pat::Object(object) => object.type_ann = Some(type_ann),
            Pat::Rest(rest) => rest.type_ann = Some(type_ann),
            Pat::Assign(assign) => Self::flow_apply_type_annotation(&mut assign.left, type_ann),
            _ => {}
        }
    }

    #[cfg(feature = "flow")]
    pub(crate) fn parse_flow_component_props(
        &mut self,
        require_type_annotation: bool,
        string_key_requires_as: bool,
        allow_rest_type: bool,
    ) -> Result<Vec<ObjectPatProp>, Error> {
        if !self.expect(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }
        let mut props = Vec::with_capacity(4);
        while !self.at(Kind::RParen) && !self.at(Kind::Eof) {
            let parameter_start = self.token().start();
            if self.at(Kind::DotDotDot) {
                let dot3_token = self.token().span();
                self.advance();
                if allow_rest_type {
                    let checkpoint = self.checkpoint();
                    if let Ok(type_ann) = self.parse_ts_type() {
                        if matches!(self.kind(), Kind::Comma | Kind::RParen) {
                            let end = type_ann.span().hi;
                            props.push(ObjectPatProp::Rest(RestPat {
                                span: Span::new_with_checked(parameter_start, end),
                                dot3_token,
                                arg: Box::new(Pat::Ident(BindingIdent {
                                    id: Ident::new_no_ctxt(
                                        "component_rest".into(),
                                        Span::new_with_checked(parameter_start, end),
                                    ),
                                    type_ann: None,
                                })),
                                type_ann: Some(Box::new(TsTypeAnn {
                                    span: type_ann.span(),
                                    type_ann,
                                })),
                            }));
                            if self.eat(Kind::Comma) {
                                continue;
                            }
                            break;
                        }
                    }
                    self.rewind(checkpoint);
                }
                let mut argument = self.parse_binding_pattern(false)?;
                if self.eat(Kind::QuestionMark) {
                    Self::flow_mark_pattern_optional(&mut argument);
                }
                let mut type_ann = match &mut argument {
                    Pat::Ident(binding) => binding.type_ann.take(),
                    Pat::Array(array) => array.type_ann.take(),
                    Pat::Object(object) => object.type_ann.take(),
                    _ => None,
                };
                if type_ann.is_none() && self.at(Kind::Colon) {
                    type_ann = Some(self.parse_ts_type_annotation()?);
                }
                if require_type_annotation && type_ann.is_none() {
                    self.emit_error(Error::new(
                        argument.span(),
                        crate::error::SyntaxError::Unexpected {
                            got: "untyped component rest parameter".into(),
                            expected: "component parameter type annotation",
                        },
                    ));
                }
                let end = argument.span().hi;
                props.push(ObjectPatProp::Rest(RestPat {
                    span: Span::new_with_checked(parameter_start, end),
                    dot3_token,
                    arg: Box::new(argument),
                    type_ann,
                }));
            } else {
                let key = self.parse_property_name()?;
                let optional = self.eat(Kind::QuestionMark);
                let has_as = self.eat(Kind::As);
                if string_key_requires_as && matches!(&key, PropName::Str(_)) && !has_as {
                    self.emit_error(Error::new(
                        key.span(),
                        crate::error::SyntaxError::Unexpected {
                            got: "string component parameter without rename".into(),
                            expected: "`as` binding for string component parameter",
                        },
                    ));
                }
                let mut value = if has_as {
                    self.parse_binding_pattern(false)?
                } else if let PropName::Ident(key) = &key {
                    Pat::Ident(BindingIdent {
                        id: Ident::new_no_ctxt(key.sym.clone(), key.span),
                        type_ann: None,
                    })
                } else {
                    Pat::Ident(BindingIdent {
                        id: Ident::new_no_ctxt("component_prop".into(), key.span()),
                        type_ann: None,
                    })
                };
                if optional {
                    Self::flow_mark_pattern_optional(&mut value);
                }
                let mut has_type_annotation = false;
                if self.at(Kind::Colon) {
                    let type_ann = self.parse_ts_type_annotation()?;
                    Self::flow_apply_type_annotation(&mut value, type_ann);
                    has_type_annotation = true;
                }
                if require_type_annotation && !has_type_annotation {
                    self.emit_error(Error::new(
                        value.span(),
                        crate::error::SyntaxError::Unexpected {
                            got: "untyped component parameter".into(),
                            expected: "component parameter type annotation",
                        },
                    ));
                }
                if self.eat(Kind::Eq) {
                    let right = self.parse_assignment_expression()?;
                    value = Pat::Assign(AssignPat {
                        span: Span::new_with_checked(parameter_start, right.span().hi),
                        left: Box::new(value),
                        right,
                    });
                }
                props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                    key,
                    value: Box::new(value),
                }));
            }
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        Ok(props)
    }

    #[cfg(feature = "flow")]
    fn parse_flow_component_renders_annotation(
        &mut self,
        start: BytePos,
    ) -> Result<Option<Box<TsTypeAnn>>, Error> {
        if !(self.at(Kind::Ident) && self.token_source(self.token()) == "renders") {
            return Ok(None);
        }
        self.advance();
        let type_ann = self.parse_ts_type()?;
        Ok(Some(Box::new(TsTypeAnn {
            span: Span::new_with_checked(start, type_ann.span().hi),
            type_ann,
        })))
    }

    #[cfg(feature = "flow")]
    pub(crate) fn parse_flow_component_declaration(&mut self) -> Result<Stmt, Error> {
        self.parse_flow_component_declaration_inner(false)
    }

    #[cfg(feature = "flow")]
    pub(crate) fn parse_flow_declare_component(&mut self) -> Result<Stmt, Error> {
        self.parse_flow_component_declaration_inner(true)
    }

    #[cfg(feature = "flow")]
    pub(crate) fn parse_flow_hook_declaration(&mut self) -> Result<Stmt, Error> {
        self.parse_flow_hook_declaration_inner(false)
    }

    #[cfg(feature = "flow")]
    pub(crate) fn parse_flow_declare_hook(&mut self) -> Result<Stmt, Error> {
        self.parse_flow_hook_declaration_inner(true)
    }

    #[cfg(feature = "flow")]
    fn parse_flow_hook_declaration_inner(&mut self, declare: bool) -> Result<Stmt, Error> {
        let start = self.token().start();
        if !self.context().contains(Context::FLOW_COMPONENTS) {
            self.emit_error(Error::new(
                self.token().span(),
                crate::error::SyntaxError::Unexpected {
                    got: "hook declaration".into(),
                    expected: "Flow components option",
                },
            ));
        }
        self.advance();
        let name = self.token();
        if !self.at_identifier_reference() {
            return Err(self.expected_error(Kind::Ident));
        }
        let ident = Ident::new_no_ctxt(self.identifier_atom(name), name.span());
        self.advance();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        let params = self.parse_method_parameters()?;
        let return_type = if self.at(Kind::Colon) {
            Some(self.parse_ts_type_annotation()?)
        } else {
            None
        };
        let body = if declare {
            self.consume_semicolon()?;
            None
        } else {
            if !self.at(Kind::LBrace) {
                return Err(self.expected_error(Kind::LBrace));
            }
            Some(self.with_context(
                Context::RETURN,
                Context::TOP_LEVEL
                    | Context::RETURN
                    | Context::YIELD
                    | Context::AWAIT
                    | Context::ASYNC,
                Self::parse_block_statement,
            )?)
        };
        let end = body
            .as_ref()
            .map_or(self.previous_end(), |block| block.span.hi);
        Ok(Stmt::Decl(Decl::Fn(FnDecl {
            ident,
            declare,
            function: Box::new(Function {
                params,
                decorators: Vec::new(),
                span: Span::new_with_checked(start, end),
                ctxt: SyntaxContext::empty(),
                body,
                is_generator: false,
                is_async: false,
                type_params,
                return_type,
            }),
        })))
    }

    #[cfg(feature = "flow")]
    fn parse_flow_component_declaration_inner(&mut self, declare: bool) -> Result<Stmt, Error> {
        let start = self.token().start();
        if !self.context().contains(Context::FLOW_COMPONENTS) {
            self.emit_error(Error::new(
                self.token().span(),
                crate::error::SyntaxError::Unexpected {
                    got: "component declaration".into(),
                    expected: "Flow components option",
                },
            ));
        }
        self.advance();
        let name = self.token();
        if !self.at_identifier_reference() {
            return Err(self.expected_error(Kind::Ident));
        }
        let ident = Ident::new_no_ctxt(self.identifier_atom(name), name.span());
        self.advance();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        let props = self.parse_flow_component_props(declare, !declare, declare)?;
        let parameter_end = self.previous_end();
        let return_type = self.parse_flow_component_renders_annotation(start)?;
        let body = if declare {
            self.consume_semicolon()?;
            None
        } else {
            if !self.at(Kind::LBrace) {
                return Err(self.expected_error(Kind::LBrace));
            }
            Some(self.with_context(
                Context::RETURN,
                Context::TOP_LEVEL
                    | Context::RETURN
                    | Context::YIELD
                    | Context::AWAIT
                    | Context::ASYNC,
                Self::parse_block_statement,
            )?)
        };
        let end = body
            .as_ref()
            .map_or(self.previous_end(), |block| block.span.hi);
        Ok(Stmt::Decl(Decl::Fn(FnDecl {
            ident,
            declare,
            function: Box::new(Function {
                params: vec![Param {
                    span: Span::new_with_checked(start, parameter_end),
                    decorators: Vec::new(),
                    pat: Pat::Object(ObjectPat {
                        span: Span::new_with_checked(start, parameter_end),
                        props,
                        optional: false,
                        type_ann: None,
                    }),
                }],
                decorators: Vec::new(),
                span: Span::new_with_checked(start, end),
                ctxt: SyntaxContext::empty(),
                body,
                is_generator: false,
                is_async: false,
                type_params,
                return_type,
            }),
        })))
    }

    #[cfg(feature = "flow")]
    pub(crate) fn parse_flow_module_exports(
        &mut self,
        start: swc_common::BytePos,
    ) -> Result<Stmt, Error> {
        self.advance();
        if !self.expect(Kind::Dot) {
            return Err(self.expected_error(Kind::Dot));
        }
        self.advance();
        let type_ann = self.parse_ts_type_annotation()?;
        self.consume_semicolon()?;
        let end = self.previous_end();
        Ok(Stmt::Decl(Decl::TsTypeAlias(Box::new(TsTypeAliasDecl {
            span: Span::new_with_checked(start, end),
            declare: true,
            id: Ident::new_no_ctxt(
                "__flow_module_exports".into(),
                Span::new_with_checked(start, end),
            ),
            type_params: None,
            type_ann: type_ann.type_ann,
        }))))
    }

    pub(crate) fn parse_ts_global_declaration(&mut self, declare: bool) -> Result<Stmt, Error> {
        let token = self.token();
        debug_assert!(self.at(Kind::Global));
        self.advance();
        let id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        let body = self.parse_ts_module_block()?;
        Ok(Stmt::Decl(Decl::TsModule(Box::new(TsModuleDecl {
            span: Span::new_with_checked(token.start(), body.span.hi),
            declare,
            global: true,
            namespace: false,
            id: TsModuleName::Ident(id),
            body: Some(TsNamespaceBody::TsModuleBlock(body)),
        }))))
    }

    pub(crate) fn parse_ts_module_declaration(&mut self, declare: bool) -> Result<Stmt, Error> {
        let start = self.token().start();
        let namespace = self.at(Kind::Namespace);
        self.advance();
        let id = if self.at(Kind::Str) {
            let expression = self.parse_primary_expression()?;
            let Expr::Lit(Lit::Str(value)) = *expression else {
                unreachable!()
            };
            TsModuleName::Str(value)
        } else {
            let token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let ident = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
            self.advance();
            TsModuleName::Ident(ident)
        };
        let body = if self.eat(Kind::Dot) {
            Some(TsNamespaceBody::TsNamespaceDecl(
                self.parse_ts_nested_namespace(false)?,
            ))
        } else if self.at(Kind::LBrace) {
            Some(TsNamespaceBody::TsModuleBlock(
                self.parse_ts_module_block()?,
            ))
        } else {
            self.consume_semicolon()?;
            None
        };
        let end = body.as_ref().map_or(self.previous_end(), Spanned::span_hi);
        Ok(Stmt::Decl(Decl::TsModule(Box::new(TsModuleDecl {
            span: Span::new_with_checked(start, end),
            declare,
            global: false,
            namespace,
            id,
            body,
        }))))
    }

    fn parse_ts_nested_namespace(&mut self, declare: bool) -> Result<TsNamespaceDecl, Error> {
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.validate_flow_type_binding(&id);
        self.advance();
        let body = if self.eat(Kind::Dot) {
            TsNamespaceBody::TsNamespaceDecl(self.parse_ts_nested_namespace(declare)?)
        } else {
            TsNamespaceBody::TsModuleBlock(self.parse_ts_module_block()?)
        };
        Ok(TsNamespaceDecl {
            span: Span::new_with_checked(token.start(), body.span_hi()),
            declare,
            global: false,
            id,
            body: Box::new(body),
        })
    }

    fn parse_ts_module_block(&mut self) -> Result<TsModuleBlock, Error> {
        let start = self.token().start();
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let mut body = Vec::with_capacity(8);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            body.push(match self.kind() {
                Kind::Import => {
                    swc_ecma_ast::ModuleItem::ModuleDecl(self.parse_import_declaration()?)
                }
                Kind::Export => {
                    swc_ecma_ast::ModuleItem::ModuleDecl(self.parse_export_declaration()?)
                }
                _ => swc_ecma_ast::ModuleItem::Stmt(self.parse_statement()?),
            });
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok(TsModuleBlock {
            span: Span::new_with_checked(start, self.previous_end()),
            body,
        })
    }

    pub(crate) fn parse_ts_type_assertion(&mut self) -> Result<Box<Expr>, Error> {
        let start = self.token().start();
        if self
            .context()
            .contains(Context::DISALLOW_AMBIGUOUS_JSX_LIKE)
        {
            self.emit_error(Error::new(
                self.token().span(),
                crate::error::SyntaxError::Expected(
                    "unambiguous TypeScript expression".into(),
                    "angle-bracket type assertion".into(),
                ),
            ));
        }
        self.advance();
        let type_ann = self.parse_ts_type()?;
        self.expect_ts_right_angle()?;
        let expr = self.parse_unary_expression()?;
        if matches!(
            &*type_ann,
            TsType::TsTypeRef(TsTypeRef {
                type_name: TsEntityName::Ident(identifier),
                type_params: None,
                ..
            }) if identifier.sym == "const"
        ) {
            return Ok(Box::new(Expr::TsConstAssertion(
                swc_ecma_ast::TsConstAssertion {
                    span: Span::new_with_checked(start, expr.span().hi),
                    expr,
                },
            )));
        }
        Ok(Box::new(Expr::TsTypeAssertion(TsTypeAssertion {
            span: Span::new_with_checked(start, expr.span().hi),
            expr,
            type_ann,
        })))
    }

    pub(crate) fn parse_ts_interface_declaration(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        debug_assert!(self.at(Kind::Interface));
        self.advance();
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.validate_flow_type_binding(&id);
        self.advance();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        if type_params
            .as_ref()
            .is_some_and(|parameters| parameters.params.iter().any(|parameter| parameter.is_const))
        {
            self.emit_error(Error::new(
                type_params.as_ref().unwrap().span,
                crate::error::SyntaxError::Expected(
                    "non-const interface type parameter".into(),
                    "const".into(),
                ),
            ));
        }
        let mut extends = Vec::new();
        if self.eat(Kind::Extends) {
            loop {
                extends.push(self.parse_ts_expression_with_type_arguments()?);
                if !self.eat(Kind::Comma) {
                    break;
                }
            }
        }
        let (body_span, body) = self.parse_ts_type_members()?;
        if self.context().contains(Context::FLOW)
            && body.iter().any(|member| {
                matches!(member, TsTypeElement::TsPropertySignature(property) if matches!(&*property.key, Expr::Ident(identifier) if identifier.sym == "__flow_spread"))
            })
        {
            self.emit_error(Error::new(
                body_span,
                crate::error::SyntaxError::Unexpected {
                    got: "interface object spread".into(),
                    expected: "Flow interface members without spread",
                },
            ));
        }
        Ok(Stmt::Decl(Decl::TsInterface(Box::new(TsInterfaceDecl {
            span: Span::new_with_checked(start, body_span.hi),
            id,
            declare: false,
            type_params,
            extends,
            body: TsInterfaceBody {
                span: body_span,
                body,
            },
        }))))
    }

    pub(crate) fn parse_ts_expression_with_type_arguments(
        &mut self,
    ) -> Result<TsExprWithTypeArgs, Error> {
        if self.context().contains(Context::FLOW) && self.at_identifier_name() {
            let token = self.token();
            let expr = Box::new(Expr::Ident(Ident::new_no_ctxt(
                self.identifier_atom(token),
                token.span(),
            )));
            if let Expr::Ident(identifier) = &*expr {
                self.validate_flow_type_binding(identifier);
            }
            self.advance();
            let type_args = if self.at(Kind::Lt) {
                Some(self.parse_ts_type_arguments()?)
            } else {
                None
            };
            return Ok(TsExprWithTypeArgs {
                span: Span::new_with_checked(token.start(), self.previous_end()),
                expr,
                type_args,
            });
        }
        let parsed = self.parse_left_hand_side_expression()?;
        let (expr, type_args) = match *parsed {
            Expr::TsInstantiation(instantiation) => {
                (instantiation.expr, Some(instantiation.type_args))
            }
            expression => {
                let type_args = if self.at(Kind::Lt) {
                    Some(self.parse_ts_type_arguments()?)
                } else {
                    None
                };
                (Box::new(expression), type_args)
            }
        };
        if matches!(&*expr, Expr::OptChain(_)) {
            self.emit_error(Error::new(
                expr.span(),
                crate::error::SyntaxError::Expected(
                    "non-optional interface heritage expression".into(),
                    "optional chain".into(),
                ),
            ));
        }
        Ok(TsExprWithTypeArgs {
            span: Span::new_with_checked(expr.span().lo, self.previous_end()),
            expr,
            type_args,
        })
    }

    pub(crate) fn parse_ts_enum_declaration(&mut self, is_const: bool) -> Result<Stmt, Error> {
        let start = self.token().start();
        let is_flow = self.context().contains(Context::FLOW);
        if is_flow && !self.context().contains(Context::FLOW_ENUMS) {
            self.emit_error(Error::new(
                self.token().span(),
                crate::error::SyntaxError::Unexpected {
                    got: "enum".into(),
                    expected: "Flow enums option",
                },
            ));
        }
        if is_flow && is_const {
            self.emit_error(Error::new(
                self.token().span(),
                crate::error::SyntaxError::Unexpected {
                    got: "const enum".into(),
                    expected: "Flow enum",
                },
            ));
        }
        if is_const {
            debug_assert!(self.at(Kind::Const));
            self.advance();
        }
        if !self.expect(Kind::Enum) {
            return Err(self.expected_error(Kind::Enum));
        }
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        if is_flow && matches!(&*id.sym, "class" | "function" | "enum") {
            self.emit_error(Error::new(
                id.span,
                crate::error::SyntaxError::Unexpected {
                    got: id.sym.to_string(),
                    expected: "non-reserved enum name",
                },
            ));
        }
        self.advance();
        let flow_enum_type = if is_flow && self.eat(Kind::Of) {
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let enum_type = self.identifier_atom(self.token());
            if !matches!(
                &*enum_type,
                "bigint" | "boolean" | "number" | "string" | "symbol"
            ) {
                self.emit_error(Error::new(
                    self.token().span(),
                    crate::error::SyntaxError::Unexpected {
                        got: enum_type.to_string(),
                        expected: "bigint, boolean, number, string, or symbol enum type",
                    },
                ));
            }
            self.advance();
            Some(enum_type)
        } else {
            None
        };
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let mut members = Vec::with_capacity(8);
        let mut has_unknown_members = false;
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            if is_flow && self.at(Kind::DotDotDot) {
                let unknown_span = self.token().span();
                self.advance();
                has_unknown_members = true;
                if self.eat(Kind::Comma) || !self.at(Kind::RBrace) {
                    self.emit_error(Error::new(
                        unknown_span,
                        crate::error::SyntaxError::Unexpected {
                            got: "...".into(),
                            expected: "final enum element without a trailing comma",
                        },
                    ));
                }
                continue;
            }
            let member_start = self.token().start();
            let token = self.token();
            let computed = self.eat(Kind::LBracket);
            let id = if self.at(Kind::Str) {
                let expression = self.parse_primary_expression()?;
                let Expr::Lit(Lit::Str(value)) = *expression else {
                    unreachable!("string enum member must produce a string literal")
                };
                TsEnumMemberId::Str(value)
            } else if self.at(Kind::NoSubstitutionTemplateLiteral) {
                let template = self.parse_template_literal(false)?;
                let quasi = template
                    .quasis
                    .into_iter()
                    .next()
                    .expect("template literal must contain one quasi");
                TsEnumMemberId::Str(swc_ecma_ast::Str {
                    span: quasi.span,
                    value: quasi.cooked.unwrap_or_default(),
                    raw: None,
                })
            } else if self.at_identifier_name() {
                let id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
                self.advance();
                TsEnumMemberId::Ident(id)
            } else {
                return Err(self.expected_error(Kind::Ident));
            };
            if computed && !self.expect(Kind::RBracket) {
                return Err(self.expected_error(Kind::RBracket));
            }
            let init = if self.eat(Kind::Eq) {
                Some(self.parse_assignment_expression()?)
            } else {
                None
            };
            let end = init
                .as_ref()
                .map_or_else(|| id.span().hi, |expression| expression.span().hi);
            members.push(TsEnumMember {
                span: Span::new_with_checked(member_start, end),
                id,
                init,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        if is_flow {
            self.validate_flow_enum(
                &id,
                flow_enum_type.as_deref(),
                &members,
                has_unknown_members,
            );
        }
        Ok(Stmt::Decl(Decl::TsEnum(Box::new(TsEnumDecl {
            span: Span::new_with_checked(start, self.previous_end()),
            declare: false,
            is_const,
            id,
            members,
        }))))
    }

    fn validate_flow_enum(
        &mut self,
        id: &Ident,
        explicit_type: Option<&str>,
        members: &[TsEnumMember],
        _has_unknown_members: bool,
    ) {
        let mut names = Vec::with_capacity(members.len());
        let mut first_initializer_kind = None;
        let mut saw_initializer = false;
        let mut saw_default = false;

        for member in members {
            let name = match &member.id {
                TsEnumMemberId::Ident(identifier) => Some(identifier.sym.clone()),
                TsEnumMemberId::Str(string) => string.value.as_str().map(Into::into),
            };
            if let Some(name) = name {
                if name
                    .chars()
                    .next()
                    .is_some_and(|character| character.is_ascii_lowercase())
                {
                    self.emit_error(Error::new(
                        member.span,
                        crate::error::SyntaxError::Unexpected {
                            got: name.to_string(),
                            expected: "enum member name beginning with an uppercase letter",
                        },
                    ));
                }
                if names.iter().any(|previous| previous == &name) {
                    self.emit_error(Error::new(
                        member.span,
                        crate::error::SyntaxError::Unexpected {
                            got: name.to_string(),
                            expected: "unique enum member name",
                        },
                    ));
                }
                names.push(name);
            }

            let initializer_kind = member.init.as_deref().map(flow_enum_initializer_kind);
            saw_initializer |= initializer_kind.is_some();
            saw_default |= initializer_kind.is_none();
            if let Some(kind) = initializer_kind {
                if let Some(previous) = first_initializer_kind {
                    if previous != kind {
                        self.emit_error(Error::new(
                            id.span,
                            crate::error::SyntaxError::Unexpected {
                                got: "mixed enum member initializers".into(),
                                expected: "consistent enum member initializer literals",
                            },
                        ));
                    }
                } else {
                    first_initializer_kind = Some(kind);
                }
            }

            let valid = match explicit_type {
                Some("boolean") => initializer_kind == Some(FlowEnumInitializer::Boolean),
                Some("bigint") => initializer_kind == Some(FlowEnumInitializer::BigInt),
                Some("number") => initializer_kind == Some(FlowEnumInitializer::Number),
                Some("string") => {
                    matches!(initializer_kind, None | Some(FlowEnumInitializer::String))
                }
                Some("symbol") => initializer_kind.is_none(),
                Some(_) => false,
                None => matches!(
                    initializer_kind,
                    None | Some(FlowEnumInitializer::Boolean)
                        | Some(FlowEnumInitializer::BigInt)
                        | Some(FlowEnumInitializer::Number)
                        | Some(FlowEnumInitializer::String)
                ),
            };
            if !valid {
                self.emit_error(Error::new(
                    member.span,
                    crate::error::SyntaxError::Unexpected {
                        got: "invalid enum member initializer".into(),
                        expected: "literal matching the enum type",
                    },
                ));
            }
        }

        if saw_initializer && saw_default && explicit_type != Some("symbol") {
            self.emit_error(Error::new(
                id.span,
                crate::error::SyntaxError::Unexpected {
                    got: "partially initialized enum".into(),
                    expected: "all enum members initialized or all defaulted",
                },
            ));
        }
    }

    pub(crate) fn parse_ts_type_alias_declaration(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        debug_assert!(self.at(Kind::Type));
        self.advance();
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.validate_flow_type_binding(&id);
        self.advance();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        if !self.expect(Kind::Eq) {
            return Err(self.expected_error(Kind::Eq));
        }
        let type_ann =
            self.with_flow_type_parameter_scope(type_params.as_deref(), Self::parse_ts_type)?;
        self.consume_semicolon()?;
        let end = self.previous_end();
        Ok(Stmt::Decl(Decl::TsTypeAlias(Box::new(TsTypeAliasDecl {
            span: Span::new_with_checked(start, end),
            declare: false,
            id,
            type_params,
            type_ann,
        }))))
    }

    #[cfg(feature = "flow")]
    pub(crate) fn parse_flow_opaque_type(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        if !self.expect(Kind::Type) {
            return Err(self.expected_error(Kind::Type));
        }
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.validate_flow_type_binding(&id);
        self.advance();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        if self.eat(Kind::Colon) {
            self.parse_ts_type()?;
        }
        let equals_span = self.token().span();
        let type_ann = if self.eat(Kind::Eq) {
            if self.context().contains(Context::AMBIENT) {
                self.emit_error(Error::new(
                    equals_span,
                    crate::error::SyntaxError::Unexpected {
                        got: "opaque type implementation in declare context".into(),
                        expected: "opaque type without implementation",
                    },
                ));
            }
            self.parse_ts_type()?
        } else {
            Box::new(TsType::TsKeywordType(TsKeywordType {
                span: Span::new_with_checked(start, self.previous_end()),
                kind: TsKeywordTypeKind::TsAnyKeyword,
            }))
        };
        self.consume_semicolon()?;
        let end = self.previous_end();
        Ok(Stmt::Decl(Decl::TsTypeAlias(Box::new(TsTypeAliasDecl {
            span: Span::new_with_checked(start, end),
            declare: false,
            id,
            type_params,
            type_ann,
        }))))
    }

    pub(crate) fn parse_ts_type(&mut self) -> Result<Box<TsType>, Error> {
        let predicate_start = self.context().contains(Context::FLOW)
            && ((self.at(Kind::Ident) && self.token_source(self.token()) == "implies")
                || self.at(Kind::Asserts)
                || self.at(Kind::This)
                || self.at_identifier_name());
        if self.context().contains(Context::FLOW)
            && self.at(Kind::Ident)
            && self.token_source(self.token()) == "implies"
            && self.lookahead(|parser| {
                parser.advance();
                if !(parser.at_identifier_name() || parser.at(Kind::This)) {
                    return false;
                }
                parser.advance();
                parser.at(Kind::Is)
            })
        {
            if !self.context().contains(Context::FLOW_RETURN_TYPE) {
                self.emit_error(Error::new(
                    self.token().span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "Flow type predicate outside return position".into(),
                        expected: "type predicate as a function return type",
                    },
                ));
            }
            self.advance();
            return self.parse_ts_type_predicate(true);
        }
        if (self.at(Kind::Asserts)
            && (!self.context().contains(Context::FLOW)
                || self.lookahead(|parser| {
                    parser.advance();
                    parser.at_identifier_name() || parser.at(Kind::This)
                })))
            || ((self.at(Kind::This) || self.at_identifier_name())
                && self.lookahead(|parser| {
                    parser.advance();
                    parser.at(Kind::Is)
                }))
        {
            if self.context().contains(Context::FLOW) {
                if !self.context().contains(Context::FLOW_RETURN_TYPE) && predicate_start {
                    self.emit_error(Error::new(
                        self.token().span(),
                        crate::error::SyntaxError::Unexpected {
                            got: "Flow type predicate outside return position".into(),
                            expected: "type predicate as a function return type",
                        },
                    ));
                }
            }
            return self.parse_ts_type_predicate(false);
        }
        let check_type = self.parse_ts_union_type()?;
        if self.context().contains(Context::DISALLOW_CONDITIONAL_TYPES) || !self.eat(Kind::Extends)
        {
            return Ok(check_type);
        }
        let extends_type = self.with_context(
            Context::DISALLOW_CONDITIONAL_TYPES,
            Context::empty(),
            Self::parse_ts_union_type,
        )?;
        if !self.expect(Kind::QuestionMark) {
            return Err(self.expected_error(Kind::QuestionMark));
        }
        let true_type = self.parse_ts_type()?;
        if !self.expect(Kind::Colon) {
            return Err(self.expected_error(Kind::Colon));
        }
        let false_type = self.parse_ts_type()?;
        Ok(Box::new(TsType::TsConditionalType(TsConditionalType {
            span: Span::new_with_checked(check_type.span().lo, false_type.span().hi),
            check_type,
            extends_type,
            true_type,
            false_type,
        })))
    }

    fn parse_ts_type_predicate(&mut self, implies: bool) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        let asserts = self.eat(Kind::Asserts);
        let token = self.token();
        let param_name = if self.at(Kind::This) {
            self.advance();
            TsThisTypeOrIdent::TsThisType(TsThisType { span: token.span() })
        } else if self.at_identifier_name() {
            let ident = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
            if self.context().contains(Context::FLOW)
                && (ident.sym == "implies" || (!implies && ident.sym == "in"))
            {
                self.emit_error(Error::new(
                    ident.span,
                    crate::error::SyntaxError::Unexpected {
                        got: ident.sym.to_string(),
                        expected: "non-keyword Flow type predicate parameter",
                    },
                ));
            }
            self.advance();
            TsThisTypeOrIdent::Ident(ident)
        } else {
            return Err(self.expected_error(Kind::Ident));
        };
        let type_ann = if self.eat(Kind::Is) {
            let type_ann = self.parse_ts_type()?;
            Some(Box::new(TsTypeAnn {
                span: Span::new_with_checked(token.end(), type_ann.span().hi),
                type_ann,
            }))
        } else {
            None
        };
        let end = type_ann.as_ref().map_or(token.end(), |ty| ty.span.hi);
        Ok(Box::new(TsType::TsTypePredicate(TsTypePredicate {
            span: Span::new_with_checked(start, end),
            asserts,
            param_name,
            type_ann,
        })))
    }

    pub(crate) fn parse_ts_type_annotation(&mut self) -> Result<Box<TsTypeAnn>, Error> {
        let start = self.token().start();
        if !self.expect(Kind::Colon) {
            return Err(self.expected_error(Kind::Colon));
        }
        let type_ann = self.parse_ts_type()?;
        Ok(Box::new(TsTypeAnn {
            span: Span::new_with_checked(start, type_ann.span().hi),
            type_ann,
        }))
    }

    fn parse_ts_return_type_annotation(&mut self) -> Result<Box<TsTypeAnn>, Error> {
        self.with_context(
            Context::FLOW_RETURN_TYPE,
            Context::empty(),
            Self::parse_ts_type_annotation,
        )
    }

    fn parse_ts_nested_type_annotation(&mut self) -> Result<Box<TsTypeAnn>, Error> {
        self.with_context(
            Context::empty(),
            Context::TS_ARROW_RETURN_TYPE,
            Self::parse_ts_type_annotation,
        )
    }

    fn with_flow_type_parameter_scope<T>(
        &mut self,
        _params: Option<&TsTypeParamDecl>,
        production: impl FnOnce(&mut Self) -> T,
    ) -> T {
        #[cfg(feature = "flow")]
        let previous_len = self.flow_type_parameters_len();
        #[cfg(feature = "flow")]
        if self.context().contains(Context::FLOW) {
            if let Some(params) = _params {
                for parameter in &params.params {
                    self.push_flow_type_parameter(parameter.name.sym.clone());
                }
            }
        }
        let result = production(self);
        #[cfg(feature = "flow")]
        self.truncate_flow_type_parameters(previous_len);
        result
    }

    pub(crate) fn parse_ts_type_parameters(&mut self) -> Result<Box<TsTypeParamDecl>, Error> {
        let start = self.token().start();
        debug_assert!(self.at(Kind::Lt));
        self.advance();
        let mut params = Vec::with_capacity(2);
        let mut saw_default = false;
        if self.context().contains(Context::FLOW)
            && matches!(self.kind(), Kind::Gt | Kind::RShift | Kind::ZeroFillRShift)
        {
            self.emit_error(Error::new(
                self.token().span(),
                crate::error::SyntaxError::Unexpected {
                    got: "empty type parameter list".into(),
                    expected: "at least one Flow type parameter",
                },
            ));
        }
        while !matches!(
            self.kind(),
            Kind::Gt | Kind::RShift | Kind::ZeroFillRShift | Kind::Eof
        ) {
            let parameter_start = self.token().start();
            if self.at(Kind::Public) {
                self.emit_error(Error::new(
                    self.token().span(),
                    crate::error::SyntaxError::Expected(
                        "type parameter name".into(),
                        "public".into(),
                    ),
                ));
            }
            let mut is_in = false;
            let mut is_out = false;
            let mut is_const = false;
            loop {
                match self.kind() {
                    Kind::In
                        if self.lookahead(|parser| {
                            parser.advance();
                            parser.at_identifier_name()
                        }) =>
                    {
                        is_in = true
                    }
                    Kind::Out
                        if self.lookahead(|parser| {
                            parser.advance();
                            parser.at_identifier_name()
                        }) =>
                    {
                        is_out = true
                    }
                    Kind::Const => {
                        if self.context().contains(Context::FLOW) && (is_in || is_out) {
                            self.emit_error(Error::new(
                                self.token().span(),
                                crate::error::SyntaxError::Unexpected {
                                    got: "const after variance modifier".into(),
                                    expected: "const before Flow variance modifier",
                                },
                            ));
                        }
                        is_const = true;
                    }
                    Kind::Plus if self.context().contains(Context::FLOW) => is_out = true,
                    Kind::Minus if self.context().contains(Context::FLOW) => is_in = true,
                    Kind::Public | Kind::Private | Kind::Protected => {}
                    _ => break,
                }
                self.advance();
            }
            let token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let name = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
            self.validate_flow_type_binding(&name);
            self.advance();
            let constraint = if self.eat(Kind::Extends)
                || (self.context().contains(Context::FLOW) && self.eat(Kind::Colon))
            {
                Some(self.parse_ts_type()?)
            } else {
                None
            };
            let default = if self.eat(Kind::Eq) {
                Some(self.parse_ts_type()?)
            } else {
                None
            };
            if self.context().contains(Context::FLOW) && saw_default && default.is_none() {
                self.emit_error(Error::new(
                    name.span,
                    crate::error::SyntaxError::Unexpected {
                        got: "required type parameter after defaulted parameter".into(),
                        expected: "default type for subsequent Flow type parameter",
                    },
                ));
            }
            saw_default |= default.is_some();
            let end = default
                .as_ref()
                .or(constraint.as_ref())
                .map_or(name.span.hi, |ty| ty.span().hi);
            params.push(TsTypeParam {
                span: Span::new_with_checked(parameter_start, end),
                name,
                is_in,
                is_out,
                is_const,
                constraint,
                default,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        self.expect_ts_right_angle()?;
        Ok(Box::new(TsTypeParamDecl {
            span: Span::new_with_checked(start, self.previous_end()),
            params,
        }))
    }

    pub(crate) fn parse_ts_type_arguments(
        &mut self,
    ) -> Result<Box<TsTypeParamInstantiation>, Error> {
        let start = self.token().start();
        if !self.expect(Kind::Lt) {
            return Err(self.expected_error(Kind::Lt));
        }
        let mut params = Vec::with_capacity(2);
        if matches!(self.kind(), Kind::Gt | Kind::RShift | Kind::ZeroFillRShift) {
            if !self.context().contains(Context::FLOW) {
                return Err(Error::new(
                    self.token().span(),
                    crate::error::SyntaxError::EmptyTypeArgumentList,
                ));
            }
            self.expect_ts_right_angle()?;
            return Ok(Box::new(TsTypeParamInstantiation {
                span: Span::new_with_checked(start, self.previous_end()),
                params,
            }));
        }
        loop {
            params.push(self.with_context(
                if self.context().contains(Context::FLOW) {
                    Context::FLOW_TYPE_ARGUMENT
                } else {
                    Context::empty()
                },
                Context::TS_ARROW_RETURN_TYPE,
                Self::parse_ts_type,
            )?);
            if !self.eat(Kind::Comma) {
                break;
            }
            if matches!(self.kind(), Kind::Gt | Kind::RShift | Kind::ZeroFillRShift) {
                break;
            }
        }
        self.expect_ts_right_angle()?;
        Ok(Box::new(TsTypeParamInstantiation {
            span: Span::new_with_checked(start, self.previous_end()),
            params,
        }))
    }

    fn parse_ts_union_type(&mut self) -> Result<Box<TsType>, Error> {
        let leading = self.eat(Kind::Pipe);
        let first = self.parse_ts_intersection_type()?;
        let flow_exact_end = self.context().contains(Context::FLOW)
            && self.at(Kind::Pipe)
            && self.lookahead(|parser| {
                parser.advance();
                parser.at(Kind::RBrace)
            });
        if (!leading || self.context().contains(Context::FLOW))
            && (!self.at(Kind::Pipe) || flow_exact_end)
        {
            return Ok(first);
        }
        let start = first.span().lo;
        let mut types = Vec::with_capacity(2);
        types.push(first);
        while self.at(Kind::Pipe)
            && !(self.context().contains(Context::FLOW)
                && self.lookahead(|parser| {
                    parser.advance();
                    parser.at(Kind::RBrace)
                }))
        {
            self.advance();
            types.push(self.parse_ts_intersection_type()?);
        }
        let end = types.last().unwrap().span().hi;
        Ok(Box::new(TsType::TsUnionOrIntersectionType(
            swc_ecma_ast::TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                span: Span::new_with_checked(start, end),
                types,
            }),
        )))
    }

    fn parse_ts_intersection_type(&mut self) -> Result<Box<TsType>, Error> {
        let leading = self.eat(Kind::Ampersand);
        let first = self.parse_ts_array_type()?;
        if !leading && !self.at(Kind::Ampersand) {
            return Ok(first);
        }
        let start = first.span().lo;
        let mut types = Vec::with_capacity(2);
        types.push(first);
        while self.eat(Kind::Ampersand) {
            types.push(self.parse_ts_array_type()?);
        }
        let end = types.last().unwrap().span().hi;
        Ok(Box::new(TsType::TsUnionOrIntersectionType(
            swc_ecma_ast::TsUnionOrIntersectionType::TsIntersectionType(TsIntersectionType {
                span: Span::new_with_checked(start, end),
                types,
            }),
        )))
    }

    fn parse_ts_array_type(&mut self) -> Result<Box<TsType>, Error> {
        let mut ty = self.parse_ts_primary_type()?;
        while self.at(Kind::LBracket)
            || (self.context().contains(Context::FLOW)
                && self.at(Kind::OptionalChain)
                && self.lookahead(|parser| {
                    parser.advance();
                    parser.at(Kind::LBracket)
                }))
        {
            let start = ty.span().lo;
            if self.eat(Kind::OptionalChain) {
                if !self.expect(Kind::LBracket) {
                    return Err(self.expected_error(Kind::LBracket));
                }
            } else {
                debug_assert!(self.at(Kind::LBracket));
                self.advance();
            }
            if self.eat(Kind::RBracket) {
                ty = Box::new(TsType::TsArrayType(TsArrayType {
                    span: Span::new_with_checked(start, self.previous_end()),
                    elem_type: ty,
                }));
            } else {
                let index_type = self.parse_ts_type()?;
                if !self.expect(Kind::RBracket) {
                    return Err(self.expected_error(Kind::RBracket));
                }
                ty = Box::new(TsType::TsIndexedAccessType(TsIndexedAccessType {
                    span: Span::new_with_checked(start, self.previous_end()),
                    readonly: false,
                    obj_type: ty,
                    index_type,
                }));
            }
        }
        if self.context().contains(Context::FLOW)
            && !self.context().contains(Context::TS_ARROW_RETURN_TYPE)
            && self.eat(Kind::Arrow)
        {
            let start = ty.span().lo;
            let parameter_end = ty.span().hi;
            let return_type = self.parse_ts_type()?;
            let end = return_type.span().hi;
            let parameter = if matches!(ty.as_ref(), TsType::TsThisType(_)) {
                BindingIdent {
                    id: Ident::new_no_ctxt(
                        "this".into(),
                        Span::new_with_checked(start, parameter_end),
                    ),
                    type_ann: None,
                }
            } else {
                BindingIdent {
                    id: Ident::new_no_ctxt(
                        "__flow_anon_param_0".into(),
                        Span::new_with_checked(start, start),
                    ),
                    type_ann: Some(Box::new(TsTypeAnn {
                        span: Span::new_with_checked(start, parameter_end),
                        type_ann: ty,
                    })),
                }
            };
            ty = Box::new(TsType::TsFnOrConstructorType(
                swc_ecma_ast::TsFnOrConstructorType::TsFnType(TsFnType {
                    span: Span::new_with_checked(start, end),
                    params: vec![TsFnParam::Ident(parameter)],
                    type_params: None,
                    type_ann: Box::new(TsTypeAnn {
                        span: Span::new_with_checked(parameter_end, end),
                        type_ann: return_type,
                    }),
                }),
            ));
        }
        Ok(ty)
    }

    fn parse_ts_primary_type(&mut self) -> Result<Box<TsType>, Error> {
        let token = self.token();
        #[cfg(feature = "flow")]
        if self.context().contains(Context::FLOW)
            && token.kind() == Kind::Ident
            && self.token_source(token) == "component"
            && self.lookahead(|parser| {
                parser.advance();
                matches!(parser.kind(), Kind::LParen | Kind::Lt)
            })
        {
            return self.parse_flow_component_type();
        }
        #[cfg(feature = "flow")]
        if self.context().contains(Context::FLOW)
            && token.kind() == Kind::Ident
            && self.token_source(token) == "hook"
            && self.lookahead(|parser| {
                parser.advance();
                matches!(parser.kind(), Kind::LParen | Kind::Lt)
            })
        {
            return self.parse_flow_hook_type();
        }
        if self.context().contains(Context::FLOW)
            && token.kind() == Kind::Interface
            && self.lookahead(|parser| {
                parser.advance();
                parser.at(Kind::LBrace)
            })
        {
            self.advance();
            let (span, members) = self.parse_ts_type_members()?;
            return Ok(Box::new(TsType::TsTypeLit(TsTypeLit { span, members })));
        }
        if self.context().contains(Context::FLOW) && token.kind() == Kind::QuestionMark {
            self.advance();
            let type_ann = self.parse_ts_primary_type()?;
            let end = type_ann.span().hi;
            return Ok(Box::new(TsType::TsUnionOrIntersectionType(
                swc_ecma_ast::TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                    span: Span::new_with_checked(token.start(), end),
                    types: vec![
                        type_ann,
                        Box::new(TsType::TsKeywordType(TsKeywordType {
                            span: Span::new_with_checked(token.start(), end),
                            kind: TsKeywordTypeKind::TsNullKeyword,
                        })),
                        Box::new(TsType::TsKeywordType(TsKeywordType {
                            span: Span::new_with_checked(token.start(), end),
                            kind: TsKeywordTypeKind::TsUndefinedKeyword,
                        })),
                    ],
                }),
            )));
        }
        if self.context().contains(Context::FLOW)
            && token.kind() == Kind::Ident
            && self.token_source(token) == "renders"
        {
            let renders_end = token.end();
            self.advance();
            if self.at(Kind::Asterisk)
                || (self.at(Kind::QuestionMark) && self.token().start() == renders_end)
            {
                self.advance();
            }
            return self.parse_ts_primary_type();
        }
        if self.context().contains(Context::FLOW) && token.kind() == Kind::Asterisk {
            self.advance();
            return Ok(Box::new(TsType::TsKeywordType(TsKeywordType {
                span: token.span(),
                kind: TsKeywordTypeKind::TsAnyKeyword,
            })));
        }
        if token.kind() == Kind::This {
            self.advance();
            return Ok(Box::new(TsType::TsThisType(TsThisType {
                span: token.span(),
            })));
        }
        if token.kind() == Kind::Infer {
            self.advance();
            let parameter_start = self.token().start();
            let name_token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let name = Ident::new_no_ctxt(self.identifier_atom(name_token), name_token.span());
            self.advance();
            let constraint = if self.at(Kind::Extends) {
                let checkpoint = self.checkpoint();
                self.advance();
                let constraint = self.parse_ts_union_type()?;
                if self.at(Kind::QuestionMark)
                    && !self.context().contains(Context::DISALLOW_CONDITIONAL_TYPES)
                {
                    self.rewind(checkpoint);
                    None
                } else {
                    Some(constraint)
                }
            } else {
                None
            };
            let end = constraint.as_ref().map_or(name.span.hi, |ty| ty.span().hi);
            return Ok(Box::new(TsType::TsInferType(TsInferType {
                span: Span::new_with_checked(token.start(), end),
                type_param: TsTypeParam {
                    span: Span::new_with_checked(parameter_start, end),
                    name,
                    is_in: false,
                    is_out: false,
                    is_const: false,
                    constraint,
                    default: None,
                },
            })));
        }
        if token.kind() == Kind::Minus {
            self.advance();
            let number_token = self.token();
            if self.context().contains(Context::FLOW)
                && number_token.kind() == Kind::Num
                && crate::next::js::is_legacy_integer_literal(self.token_source(number_token))
            {
                self.emit_error(Error::new(
                    number_token.span(),
                    crate::error::SyntaxError::Unexpected {
                        got: self.token_source(number_token).into(),
                        expected: "non-legacy numeric Flow literal type",
                    },
                ));
            }
            let expression = self.parse_primary_expression()?;
            let (lit, end) = match *expression {
                Expr::Lit(Lit::Num(mut number)) => {
                    number.value = -number.value;
                    number.span = Span::new_with_checked(token.start(), number_token.end());
                    number.raw = number.raw.map(|raw| format!("-{raw}").into());
                    (TsLit::Number(number), number_token.end())
                }
                Expr::Lit(Lit::BigInt(mut bigint)) => {
                    bigint.value = Box::new(-*bigint.value);
                    bigint.span = Span::new_with_checked(token.start(), number_token.end());
                    bigint.raw = bigint.raw.map(|raw| format!("-{raw}").into());
                    (TsLit::BigInt(bigint), number_token.end())
                }
                _ => return Err(self.expected_error(Kind::Num)),
            };
            return Ok(Box::new(TsType::TsLitType(TsLitType {
                span: Span::new_with_checked(token.start(), end),
                lit,
            })));
        }
        if matches!(token.kind(), Kind::Keyof | Kind::Readonly | Kind::Unique) {
            let op = match token.kind() {
                Kind::Keyof => TsTypeOperatorOp::KeyOf,
                Kind::Readonly => TsTypeOperatorOp::ReadOnly,
                Kind::Unique => TsTypeOperatorOp::Unique,
                _ => unreachable!(),
            };
            self.advance();
            let type_ann = self.parse_ts_array_type()?;
            return Ok(Box::new(TsType::TsTypeOperator(TsTypeOperator {
                span: Span::new_with_checked(token.start(), type_ann.span().hi),
                op,
                type_ann,
            })));
        }
        if token.kind() == Kind::TypeOf {
            self.advance();
            let parenthesized = self.context().contains(Context::FLOW) && self.eat(Kind::LParen);
            let expr_name = if self.at(Kind::Import) {
                TsTypeQueryExpr::Import(self.parse_ts_import_type()?)
            } else {
                TsTypeQueryExpr::TsEntityName(self.parse_ts_entity_name()?)
            };
            if parenthesized && !self.expect(Kind::RParen) {
                return Err(self.expected_error(Kind::RParen));
            }
            let type_args = if self.at(Kind::Lt) && !self.token().had_line_break() {
                Some(self.parse_ts_type_arguments()?)
            } else {
                None
            };
            return Ok(Box::new(TsType::TsTypeQuery(TsTypeQuery {
                span: Span::new_with_checked(token.start(), self.previous_end()),
                expr_name,
                type_args,
            })));
        }
        if token.kind() == Kind::Import {
            return Ok(Box::new(TsType::TsImportType(self.parse_ts_import_type()?)));
        }
        if matches!(
            token.kind(),
            Kind::NoSubstitutionTemplateLiteral | Kind::TemplateHead
        ) {
            if self.context().contains(Context::FLOW) {
                self.emit_error(Error::new(
                    token.span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "template literal type".into(),
                        expected: "Flow type without TypeScript template literal syntax",
                    },
                ));
            }
            let template = self.parse_ts_template_literal_type()?;
            let span = template.span;
            return Ok(Box::new(TsType::TsLitType(TsLitType {
                span,
                lit: TsLit::Tpl(template),
            })));
        }
        if self.at(Kind::Lt) && self.is_ts_function_type_start() {
            return self.parse_ts_function_type();
        }
        if self.at(Kind::New) {
            return self.parse_ts_constructor_type(false);
        }
        if let Some(kind) = ts_keyword_type(token.kind()) {
            self.advance();
            return Ok(Box::new(TsType::TsKeywordType(TsKeywordType {
                span: token.span(),
                kind,
            })));
        }
        if matches!(
            token.kind(),
            Kind::Str | Kind::Num | Kind::BigInt | Kind::True | Kind::False
        ) {
            if self.context().contains(Context::FLOW)
                && token.kind() == Kind::Str
                && has_legacy_octal_escape(self.token_source(token))
            {
                self.emit_error(Error::new(
                    token.span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "legacy octal escape in string literal type".into(),
                        expected: "string literal type without legacy octal escape",
                    },
                ));
            }
            if self.context().contains(Context::FLOW)
                && token.kind() == Kind::Num
                && crate::next::js::is_legacy_integer_literal(self.token_source(token))
            {
                self.emit_error(Error::new(
                    token.span(),
                    crate::error::SyntaxError::Unexpected {
                        got: self.token_source(token).into(),
                        expected: "non-legacy numeric Flow literal type",
                    },
                ));
            }
            let expression = self.parse_primary_expression()?;
            let lit = match *expression {
                Expr::Lit(Lit::Str(value)) => TsLit::Str(value),
                Expr::Lit(Lit::Num(value)) => TsLit::Number(value),
                Expr::Lit(Lit::BigInt(value)) => TsLit::BigInt(value),
                Expr::Lit(Lit::Bool(value)) => TsLit::Bool(value),
                _ => unreachable!("TypeScript literal token must produce a literal expression"),
            };
            return Ok(Box::new(TsType::TsLitType(TsLitType {
                span: token.span(),
                lit,
            })));
        }
        let flow_named_arrow_return = self.context().contains(Context::FLOW)
            && self.context().contains(Context::TS_ARROW_RETURN_TYPE)
            && self.at(Kind::LParen)
            && self.lookahead(|parser| {
                parser.advance();
                if !parser.at_identifier_name() {
                    return false;
                }
                parser.advance();
                parser.eat(Kind::QuestionMark);
                parser.at(Kind::Colon)
            });
        if self.at(Kind::LParen)
            && (!self.context().contains(Context::TS_ARROW_RETURN_TYPE) || flow_named_arrow_return)
            && self.is_ts_function_type_start()
        {
            return self.parse_ts_function_type();
        }
        if self.eat(Kind::LParen) {
            let start = token.start();
            let type_ann = self.with_context(
                Context::empty(),
                Context::DISALLOW_CONDITIONAL_TYPES | Context::TS_ARROW_RETURN_TYPE,
                Self::parse_ts_type,
            )?;
            if !self.expect(Kind::RParen) {
                return Err(self.expected_error(Kind::RParen));
            }
            return Ok(Box::new(TsType::TsParenthesizedType(TsParenthesizedType {
                span: Span::new_with_checked(start, self.previous_end()),
                type_ann,
            })));
        }
        if self.at(Kind::LBracket) {
            return self.parse_ts_tuple_type();
        }
        if self.at(Kind::LBrace) {
            let flow_variance = self.context().contains(Context::FLOW)
                && self.lookahead(|parser| {
                    parser.advance();
                    matches!(parser.kind(), Kind::Plus | Kind::Minus)
                });
            if !flow_variance && self.is_ts_mapped_type_start() {
                return self.parse_ts_mapped_type();
            }
            let (span, members) = self.parse_ts_type_members()?;
            return Ok(Box::new(TsType::TsTypeLit(TsTypeLit { span, members })));
        }
        self.parse_ts_type_reference()
    }

    #[cfg(feature = "flow")]
    fn parse_flow_component_type(&mut self) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        self.advance();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        let props = self.parse_flow_component_props(false, false, true)?;
        let return_type = self.parse_flow_component_renders_annotation(start)?;
        let end = self.previous_end();
        Ok(Box::new(TsType::TsFnOrConstructorType(
            swc_ecma_ast::TsFnOrConstructorType::TsFnType(TsFnType {
                span: Span::new_with_checked(start, end),
                params: vec![TsFnParam::Object(ObjectPat {
                    span: Span::new_with_checked(start, end),
                    props,
                    optional: false,
                    type_ann: None,
                })],
                type_params,
                type_ann: return_type.unwrap_or_else(|| {
                    Box::new(TsTypeAnn {
                        span: Span::new_with_checked(start, end),
                        type_ann: Box::new(TsType::TsKeywordType(TsKeywordType {
                            span: Span::new_with_checked(start, end),
                            kind: TsKeywordTypeKind::TsAnyKeyword,
                        })),
                    })
                }),
            }),
        )))
    }

    #[cfg(feature = "flow")]
    fn parse_flow_hook_type(&mut self) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        self.advance();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        let params = Self::ts_fn_params(self.parse_ts_signature_parameters()?);
        if !self.expect(Kind::Arrow) {
            return Err(self.expected_error(Kind::Arrow));
        }
        let type_ann =
            self.with_flow_type_parameter_scope(type_params.as_deref(), Self::parse_ts_type)?;
        let end = type_ann.span().hi;
        Ok(Box::new(TsType::TsFnOrConstructorType(
            swc_ecma_ast::TsFnOrConstructorType::TsFnType(TsFnType {
                span: Span::new_with_checked(start, end),
                params,
                type_params,
                type_ann: Box::new(TsTypeAnn {
                    span: Span::new_with_checked(start, end),
                    type_ann,
                }),
            }),
        )))
    }

    fn parse_ts_import_type(&mut self) -> Result<TsImportType, Error> {
        let start = self.token().start();
        self.advance();
        if !self.expect(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }
        let expression = self.parse_primary_expression()?;
        let Expr::Lit(Lit::Str(arg)) = *expression else {
            return Err(self.expected_error(Kind::Str));
        };
        let attributes = if self.eat(Kind::Comma) && self.at(Kind::LBrace) {
            let attributes_start = self.token().start();
            self.advance();
            if !self.expect(Kind::With) {
                return Err(self.expected_error(Kind::With));
            }
            if !self.expect(Kind::Colon) {
                return Err(self.expected_error(Kind::Colon));
            }
            let value = self.parse_object_literal()?;
            let Expr::Object(with) = *value else {
                unreachable!("import attributes must contain an object literal")
            };
            self.eat(Kind::Comma);
            if !self.expect(Kind::RBrace) {
                return Err(self.expected_error(Kind::RBrace));
            }
            Some(TsImportCallOptions {
                span: Span::new_with_checked(attributes_start, self.previous_end()),
                with: Box::new(with),
            })
        } else {
            None
        };
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        let qualifier = if self.eat(Kind::Dot) {
            Some(self.parse_ts_entity_name()?)
        } else {
            None
        };
        let type_args = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_arguments()?)
        } else {
            None
        };
        Ok(TsImportType {
            span: Span::new_with_checked(start, self.previous_end()),
            arg,
            qualifier,
            type_args,
            attributes,
        })
    }

    fn parse_ts_template_literal_type(&mut self) -> Result<TsTplLitType, Error> {
        use crate::next::js::template::template_element;

        let start = self.token().start();
        if self.at(Kind::NoSubstitutionTemplateLiteral) {
            let token = self.token();
            let source = self.token_source(token);
            let raw = &source[1..source.len() - 1];
            let quasi = template_element(token, raw, BytePos(1), BytePos(1), true, false)?;
            self.advance();
            return Ok(TsTplLitType {
                span: token.span(),
                types: Vec::new(),
                quasis: vec![quasi],
            });
        }

        let head = self.token();
        let source = self.token_source(head);
        let raw = &source[1..source.len() - 2];
        let mut quasis = Vec::with_capacity(2);
        quasis.push(template_element(
            head,
            raw,
            BytePos(1),
            BytePos(2),
            false,
            false,
        )?);
        self.advance();
        let mut types = Vec::with_capacity(2);
        loop {
            types.push(self.parse_ts_type()?);
            if !self.at(Kind::RBrace) {
                return Err(self.expected_error(Kind::RBrace));
            }
            let token = self.re_lex_template_substitution_tail();
            let tail = self.at(Kind::TemplateTail);
            if !tail && !self.at(Kind::TemplateMiddle) {
                return Err(self.expected_error(Kind::TemplateTail));
            }
            let source = self.token_source(token);
            let suffix = if tail { 1 } else { 2 };
            let raw = &source[1..source.len() - suffix];
            quasis.push(template_element(
                token,
                raw,
                BytePos(1),
                BytePos(suffix as u32),
                tail,
                false,
            )?);
            let end = token.end();
            self.advance();
            if tail {
                return Ok(TsTplLitType {
                    span: Span::new_with_checked(start, end),
                    types,
                    quasis,
                });
            }
        }
    }

    fn parse_ts_constructor_type(&mut self, is_abstract: bool) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        self.advance();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        let params = self
            .parse_ts_signature_parameters()?
            .into_iter()
            .map(|param| match param.pat {
                swc_ecma_ast::Pat::Ident(value) => TsFnParam::Ident(value),
                swc_ecma_ast::Pat::Array(value) => TsFnParam::Array(value),
                swc_ecma_ast::Pat::Rest(value) => TsFnParam::Rest(value),
                swc_ecma_ast::Pat::Object(value) => TsFnParam::Object(value),
                _ => unreachable!("constructor type parameters are binding patterns"),
            })
            .collect();
        if !self.expect(Kind::Arrow) {
            return Err(self.expected_error(Kind::Arrow));
        }
        let type_ann = self.parse_ts_type()?;
        let end = type_ann.span().hi;
        Ok(Box::new(TsType::TsFnOrConstructorType(
            swc_ecma_ast::TsFnOrConstructorType::TsConstructorType(TsConstructorType {
                span: Span::new_with_checked(start, end),
                params,
                type_params,
                type_ann: Box::new(TsTypeAnn {
                    span: Span::new_with_checked(start, end),
                    type_ann,
                }),
                is_abstract,
            }),
        )))
    }

    fn is_ts_mapped_type_start(&mut self) -> bool {
        self.lookahead(|parser| {
            parser.advance();
            if matches!(parser.kind(), Kind::Plus | Kind::Minus) {
                parser.advance();
            }
            parser.eat(Kind::Readonly);
            if !parser.eat(Kind::LBracket) || !parser.at_identifier_name() {
                return false;
            }
            parser.advance();
            parser.at(Kind::In)
        })
    }

    fn parse_ts_mapped_type(&mut self) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        self.advance();
        let readonly = self.parse_ts_mapped_modifier(Kind::Readonly)?;
        if !self.expect(Kind::LBracket) {
            return Err(self.expected_error(Kind::LBracket));
        }
        let parameter_start = self.token().start();
        let name_token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let name = Ident::new_no_ctxt(self.identifier_atom(name_token), name_token.span());
        self.advance();
        if !self.expect(Kind::In) {
            return Err(self.expected_error(Kind::In));
        }
        let constraint = self.with_context(
            Context::empty(),
            Context::DISALLOW_CONDITIONAL_TYPES,
            Self::parse_ts_type,
        )?;
        let name_type = if self.eat(Kind::As) {
            Some(self.with_context(
                Context::empty(),
                Context::DISALLOW_CONDITIONAL_TYPES,
                Self::parse_ts_type,
            )?)
        } else {
            None
        };
        if !self.expect(Kind::RBracket) {
            return Err(self.expected_error(Kind::RBracket));
        }
        let optional = self.parse_ts_mapped_modifier(Kind::QuestionMark)?;
        let type_ann = if self.eat(Kind::Colon) {
            Some(self.parse_ts_type()?)
        } else {
            None
        };
        self.eat(Kind::Semi);
        if self.context().contains(Context::FLOW) {
            self.eat(Kind::Comma);
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok(Box::new(TsType::TsMappedType(TsMappedType {
            span: Span::new_with_checked(start, self.previous_end()),
            readonly,
            type_param: TsTypeParam {
                span: Span::new_with_checked(parameter_start, constraint.span().hi),
                name,
                is_in: false,
                is_out: false,
                is_const: false,
                constraint: Some(constraint),
                default: None,
            },
            name_type,
            optional,
            type_ann,
        })))
    }

    fn parse_ts_mapped_modifier(&mut self, keyword: Kind) -> Result<Option<TruePlusMinus>, Error> {
        if self.eat(keyword) {
            return Ok(Some(TruePlusMinus::True));
        }
        let modifier = match self.kind() {
            Kind::Plus => TruePlusMinus::Plus,
            Kind::Minus => TruePlusMinus::Minus,
            _ => return Ok(None),
        };
        self.advance();
        if self.context().contains(Context::FLOW)
            && keyword == Kind::Readonly
            && self.at(Kind::LBracket)
        {
            return Ok(Some(modifier));
        }
        if !self.expect(keyword) {
            return Err(self.expected_error(keyword));
        }
        Ok(Some(modifier))
    }

    fn parse_ts_tuple_type(&mut self) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        self.advance();
        let mut elem_types = Vec::with_capacity(4);
        let mut saw_optional = false;
        while !self.at(Kind::RBracket) && !self.at(Kind::Eof) {
            let element_start = self.token().start();
            if self.context().contains(Context::FLOW)
                && self.at_identifier_name()
                && self.lookahead(|parser| {
                    parser.advance();
                    parser.at(Kind::QuestionMark)
                })
                && !self.lookahead(|parser| {
                    parser.advance();
                    parser.advance();
                    parser.at(Kind::Colon)
                })
            {
                self.emit_error(Error::new(
                    self.token().span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "optional tuple label without type".into(),
                        expected: "colon and tuple element type",
                    },
                ));
            }
            let flow_variance = if self.context().contains(Context::FLOW)
                && matches!(self.kind(), Kind::Plus | Kind::Minus)
            {
                let span = self.token().span();
                self.advance();
                Some(span)
            } else {
                None
            };
            let dot3_token = if self.at(Kind::DotDotDot) {
                let span = self.token().span();
                self.advance();
                Some(span)
            } else {
                None
            };
            let label = if self.at_identifier_name()
                && self.lookahead(|parser| {
                    parser.advance();
                    parser.eat(Kind::QuestionMark);
                    parser.at(Kind::Colon)
                }) {
                let token = self.token();
                let mut id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
                self.advance();
                id.optional = self.eat(Kind::QuestionMark);
                if !self.expect(Kind::Colon) {
                    return Err(self.expected_error(Kind::Colon));
                }
                let ident = swc_ecma_ast::Pat::Ident(BindingIdent { id, type_ann: None });
                if let Some(dot3_token) = dot3_token {
                    Some(swc_ecma_ast::Pat::Rest(swc_ecma_ast::RestPat {
                        span: Span::new_with_checked(element_start, self.previous_end()),
                        dot3_token,
                        arg: Box::new(ident),
                        type_ann: None,
                    }))
                } else {
                    Some(ident)
                }
            } else {
                None
            };
            if dot3_token.is_some()
                && matches!(&label, Some(swc_ecma_ast::Pat::Rest(rest)) if matches!(&*rest.arg, swc_ecma_ast::Pat::Ident(identifier) if identifier.id.optional))
            {
                self.emit_error(Error::new(
                    label.as_ref().unwrap().span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "optional rest tuple label".into(),
                        expected: "required rest tuple label",
                    },
                ));
            }
            if let Some(variance_span) = flow_variance {
                if label.is_none() {
                    self.emit_error(Error::new(
                        variance_span,
                        crate::error::SyntaxError::Unexpected {
                            got: "variance on unlabeled tuple element".into(),
                            expected: "labeled tuple element after variance",
                        },
                    ));
                }
            }
            let mut ty = if dot3_token.is_some() && self.at(Kind::RBracket) {
                Box::new(TsType::TsKeywordType(TsKeywordType {
                    span: Span::new_with_checked(element_start, self.previous_end()),
                    kind: TsKeywordTypeKind::TsAnyKeyword,
                }))
            } else {
                self.with_context(
                    Context::empty(),
                    Context::TS_ARROW_RETURN_TYPE,
                    Self::parse_ts_type,
                )?
            };
            if label.is_none() && self.eat(Kind::QuestionMark) {
                ty = Box::new(TsType::TsOptionalType(TsOptionalType {
                    span: Span::new_with_checked(element_start, self.previous_end()),
                    type_ann: ty,
                }));
            }
            if label.is_none() && dot3_token.is_some() {
                ty = Box::new(TsType::TsRestType(TsRestType {
                    span: Span::new_with_checked(element_start, ty.span().hi),
                    type_ann: ty,
                }));
            }
            let is_optional = matches!(&*ty, TsType::TsOptionalType(_))
                || matches!(&label, Some(swc_ecma_ast::Pat::Ident(identifier)) if identifier.id.optional);
            if saw_optional && !is_optional && dot3_token.is_none() {
                self.emit_error(Error::new(
                    ty.span(),
                    crate::error::SyntaxError::TsRequiredAfterOptional,
                ));
            }
            saw_optional |= is_optional;
            elem_types.push(TsTupleElement {
                span: Span::new_with_checked(element_start, ty.span().hi),
                label,
                ty,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RBracket) {
            return Err(self.expected_error(Kind::RBracket));
        }
        Ok(Box::new(TsType::TsTupleType(TsTupleType {
            span: Span::new_with_checked(start, self.previous_end()),
            elem_types,
        })))
    }

    fn is_ts_function_type_start(&mut self) -> bool {
        self.lookahead(|parser| {
            if parser.at(Kind::Lt) && parser.parse_ts_type_parameters().is_err() {
                return false;
            }
            parser.parse_ts_signature_parameters().is_ok() && parser.at(Kind::Arrow)
        })
    }

    fn parse_ts_function_type(&mut self) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        let (params, type_ann, end) = self.with_flow_type_parameter_scope(
            type_params.as_deref(),
            |parser| -> Result<_, Error> {
                let params = parser
                    .parse_ts_signature_parameters()?
                    .into_iter()
                    .map(|param| match param.pat {
                        swc_ecma_ast::Pat::Ident(value) => TsFnParam::Ident(value),
                        swc_ecma_ast::Pat::Array(value) => TsFnParam::Array(value),
                        swc_ecma_ast::Pat::Rest(value) => TsFnParam::Rest(value),
                        swc_ecma_ast::Pat::Object(value) => TsFnParam::Object(value),
                        _ => unreachable!("function type parameters are binding patterns"),
                    })
                    .collect();
                if !parser.expect(Kind::Arrow) {
                    return Err(parser.expected_error(Kind::Arrow));
                }
                let type_ann = parser.with_context(
                    Context::FLOW_RETURN_TYPE,
                    Context::empty(),
                    Self::parse_ts_type,
                )?;
                let end = type_ann.span().hi;
                Ok((params, type_ann, end))
            },
        )?;
        Ok(Box::new(TsType::TsFnOrConstructorType(
            swc_ecma_ast::TsFnOrConstructorType::TsFnType(TsFnType {
                span: Span::new_with_checked(start, end),
                params,
                type_params,
                type_ann: Box::new(TsTypeAnn {
                    span: Span::new_with_checked(start, end),
                    type_ann,
                }),
            }),
        )))
    }

    pub(crate) fn parse_ts_entity_name(&mut self) -> Result<TsEntityName, Error> {
        let start = self.token().start();
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let mut name = TsEntityName::Ident(Ident::new_no_ctxt(
            self.identifier_atom(token),
            token.span(),
        ));
        self.advance();
        while self.eat(Kind::Dot) {
            let token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let right = IdentName {
                span: token.span(),
                sym: self.identifier_atom(token),
            };
            self.advance();
            name = TsEntityName::TsQualifiedName(Box::new(TsQualifiedName {
                span: Span::new_with_checked(start, right.span.hi),
                left: name,
                right,
            }));
        }
        Ok(name)
    }

    fn parse_ts_type_members(&mut self) -> Result<(Span, Vec<TsTypeElement>), Error> {
        let start = self.token().start();
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let flow_empty_exact = self.context().contains(Context::FLOW) && self.eat(Kind::LogicalOr);
        let flow_exact =
            flow_empty_exact || (self.context().contains(Context::FLOW) && self.eat(Kind::Pipe));
        let mut members = Vec::with_capacity(8);
        while !self.at(Kind::RBrace)
            && !(flow_exact
                && self.at(Kind::Pipe)
                && self.lookahead(|parser| {
                    parser.advance();
                    parser.at(Kind::RBrace)
                }))
            && !self.at(Kind::Eof)
        {
            let member_start = self.token().start();
            let mut readonly = self.at(Kind::Readonly)
                && self.lookahead(|parser| {
                    parser.advance();
                    !matches!(
                        parser.kind(),
                        Kind::Colon | Kind::QuestionMark | Kind::LParen | Kind::Lt
                    )
                });
            if readonly {
                self.advance();
            }
            let mut flow_variance = false;
            if self.context().contains(Context::FLOW) {
                if self.eat(Kind::Plus) {
                    readonly = true;
                    flow_variance = true;
                } else {
                    flow_variance = self.eat(Kind::Minus);
                }
                if self.eat(Kind::DotDotDot) {
                    if readonly {
                        self.emit_error(Error::new(
                            Span::new_with_checked(member_start, self.previous_end()),
                            crate::error::SyntaxError::Unexpected {
                                got: "variance on object type spread".into(),
                                expected: "object type spread without variance",
                            },
                        ));
                    }
                    let type_ann = if !matches!(
                        self.kind(),
                        Kind::RBrace | Kind::Pipe | Kind::Comma | Kind::Semi
                    ) {
                        let type_ann = self.parse_ts_primary_type()?;
                        Some(Box::new(TsTypeAnn {
                            span: Span::new_with_checked(member_start, type_ann.span().hi),
                            type_ann,
                        }))
                    } else {
                        None
                    };
                    if flow_exact && type_ann.is_none() {
                        self.emit_error(Error::new(
                            Span::new_with_checked(member_start, self.previous_end()),
                            crate::error::SyntaxError::Expected(
                                "exact object type without an inexact marker".into(),
                                "...".into(),
                            ),
                        ));
                    }
                    let end = type_ann
                        .as_ref()
                        .map_or(self.previous_end(), |annotation| annotation.span.hi);
                    let inexact_marker = type_ann.is_none();
                    members.push(TsTypeElement::TsPropertySignature(TsPropertySignature {
                        span: Span::new_with_checked(member_start, end),
                        readonly: false,
                        key: Box::new(Expr::Ident(Ident::new_no_ctxt(
                            "__flow_spread".into(),
                            Span::new_with_checked(member_start, self.previous_end()),
                        ))),
                        computed: false,
                        optional: false,
                        type_ann,
                    }));
                    self.eat(Kind::Comma);
                    self.eat(Kind::Semi);
                    if inexact_marker
                        && !self.at(Kind::RBrace)
                        && !(flow_exact && self.at(Kind::Pipe))
                    {
                        self.emit_error(Error::new(
                            self.token().span(),
                            crate::error::SyntaxError::Unexpected {
                                got: "object member after inexact marker".into(),
                                expected: "inexact marker as final object type member",
                            },
                        ));
                    }
                    continue;
                }
            }

            if flow_variance
                && self.at(Kind::LBracket)
                && self.lookahead(|parser| {
                    parser.advance();
                    parser.at(Kind::LBracket)
                })
            {
                self.emit_error(Error::new(
                    self.token().span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "variance on internal slot".into(),
                        expected: "internal slot without variance",
                    },
                ));
            }

            if self.at(Kind::LParen) || self.at(Kind::Lt) {
                if readonly || flow_variance {
                    self.emit_error(Error::new(
                        self.token().span(),
                        crate::error::SyntaxError::Expected(
                            "non-readonly type method".into(),
                            "readonly".into(),
                        ),
                    ));
                }
                let type_params = if self.at(Kind::Lt) {
                    Some(self.parse_ts_type_parameters()?)
                } else {
                    None
                };
                let params = Self::ts_fn_params(self.parse_ts_object_signature_parameters()?);
                let type_ann = if self.at(Kind::Colon) {
                    Some(self.parse_ts_return_type_annotation()?)
                } else {
                    None
                };
                if self.context().contains(Context::FLOW) && type_ann.is_none() {
                    self.emit_error(Error::new(
                        Span::new_with_checked(member_start, self.previous_end()),
                        crate::error::SyntaxError::Unexpected {
                            got: "call property without return type".into(),
                            expected: "Flow call property return type",
                        },
                    ));
                }
                let end = type_ann
                    .as_ref()
                    .map_or(self.previous_end(), |annotation| annotation.span.hi);
                members.push(TsTypeElement::TsCallSignatureDecl(TsCallSignatureDecl {
                    span: Span::new_with_checked(member_start, end),
                    params,
                    type_ann,
                    type_params,
                }));
                self.parse_ts_type_member_separator()?;
                continue;
            }

            if self.context().contains(Context::FLOW)
                && self.at(Kind::LBracket)
                && self.lookahead(|parser| {
                    parser.advance();
                    if !parser.at_identifier_name() {
                        return false;
                    }
                    parser.advance();
                    parser.at(Kind::In)
                })
            {
                self.advance();
                self.advance();
                self.advance();
                self.parse_ts_type()?;
                if !self.expect(Kind::RBracket) {
                    return Err(self.expected_error(Kind::RBracket));
                }
                let optional = self.eat(Kind::QuestionMark);
                let type_ann = Some(self.parse_ts_type_annotation()?);
                let end = type_ann.as_ref().unwrap().span.hi;
                members.push(TsTypeElement::TsPropertySignature(TsPropertySignature {
                    span: Span::new_with_checked(member_start, end),
                    readonly,
                    key: Box::new(Expr::Ident(Ident::new_no_ctxt(
                        "__flow_mapped".into(),
                        Span::new_with_checked(member_start, end),
                    ))),
                    computed: false,
                    optional,
                    type_ann,
                }));
                self.parse_ts_type_member_separator()?;
                continue;
            }

            if self.at(Kind::New)
                && self.lookahead(|parser| {
                    parser.advance();
                    matches!(parser.kind(), Kind::LParen | Kind::Lt)
                })
            {
                self.advance();
                let type_params = if self.at(Kind::Lt) {
                    Some(self.parse_ts_type_parameters()?)
                } else {
                    None
                };
                let params = Self::ts_fn_params(self.parse_ts_object_signature_parameters()?);
                let type_ann = if self.at(Kind::Colon) {
                    Some(self.parse_ts_return_type_annotation()?)
                } else {
                    None
                };
                let end = type_ann
                    .as_ref()
                    .map_or(self.previous_end(), |annotation| annotation.span.hi);
                members.push(TsTypeElement::TsConstructSignatureDecl(
                    TsConstructSignatureDecl {
                        span: Span::new_with_checked(member_start, end),
                        params,
                        type_ann,
                        type_params,
                    },
                ));
                self.parse_ts_type_member_separator()?;
                continue;
            }

            if self.at(Kind::LBracket)
                && self.lookahead(|parser| {
                    parser.advance();
                    if !parser.at_identifier_name() {
                        return false;
                    }
                    parser.advance();
                    parser.at(Kind::Colon)
                })
            {
                self.advance();
                let token = self.token();
                let id = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
                self.advance();
                let type_ann = self.parse_ts_type_annotation()?;
                let parameter = TsFnParam::Ident(BindingIdent {
                    id,
                    type_ann: Some(type_ann),
                });
                if !self.expect(Kind::RBracket) {
                    return Err(self.expected_error(Kind::RBracket));
                }
                let result = if self.at(Kind::Colon) {
                    Some(self.parse_ts_type_annotation()?)
                } else {
                    None
                };
                let end = result
                    .as_ref()
                    .map_or(self.previous_end(), |annotation| annotation.span.hi);
                members.push(TsTypeElement::TsIndexSignature(TsIndexSignature {
                    params: vec![parameter],
                    type_ann: result,
                    readonly,
                    is_static: false,
                    span: Span::new_with_checked(member_start, end),
                }));
                self.parse_ts_type_member_separator()?;
                continue;
            }

            if self.context().contains(Context::FLOW)
                && self.at(Kind::LBracket)
                && !self.lookahead(|parser| {
                    parser.advance();
                    parser.at(Kind::LBracket)
                })
                && !self.lookahead(|parser| {
                    parser.advance();
                    if !parser.at_identifier_name() {
                        return false;
                    }
                    parser.advance();
                    parser.at(Kind::In)
                })
            {
                self.advance();
                let parameter_type = self.parse_ts_type()?;
                let parameter_start = parameter_type.span().lo;
                let parameter_end = parameter_type.span().hi;
                if !self.expect(Kind::RBracket) {
                    return Err(self.expected_error(Kind::RBracket));
                }
                let result = if self.at(Kind::Colon) {
                    Some(self.parse_ts_type_annotation()?)
                } else {
                    None
                };
                let end = result
                    .as_ref()
                    .map_or(self.previous_end(), |annotation| annotation.span.hi);
                members.push(TsTypeElement::TsIndexSignature(TsIndexSignature {
                    params: vec![TsFnParam::Ident(BindingIdent {
                        id: Ident::new_no_ctxt(
                            "__flow_anon_param_0".into(),
                            Span::new_with_checked(parameter_start, parameter_start),
                        ),
                        type_ann: Some(Box::new(TsTypeAnn {
                            span: Span::new_with_checked(parameter_start, parameter_end),
                            type_ann: parameter_type,
                        })),
                    })],
                    type_ann: result,
                    readonly,
                    is_static: false,
                    span: Span::new_with_checked(member_start, end),
                }));
                self.parse_ts_type_member_separator()?;
                continue;
            }

            if matches!(self.kind(), Kind::Get | Kind::Set)
                && self.lookahead(|parser| {
                    parser.advance();
                    !matches!(
                        parser.kind(),
                        Kind::LParen
                            | Kind::Lt
                            | Kind::Colon
                            | Kind::QuestionMark
                            | Kind::Semi
                            | Kind::Comma
                            | Kind::RBrace
                    )
                })
            {
                if readonly || flow_variance {
                    self.emit_error(Error::new(
                        self.token().span(),
                        crate::error::SyntaxError::Expected(
                            "non-readonly type accessor".into(),
                            "readonly".into(),
                        ),
                    ));
                }
                let getter = self.at(Kind::Get);
                self.advance();
                let key_token = self.token();
                let (key, computed) = if self.eat(Kind::LBracket) {
                    let key = self.parse_expression()?;
                    if !self.expect(Kind::RBracket) {
                        return Err(self.expected_error(Kind::RBracket));
                    }
                    (key, true)
                } else if self.at_identifier_name() {
                    let key = Box::new(Expr::Ident(Ident::new_no_ctxt(
                        self.identifier_atom(key_token),
                        key_token.span(),
                    )));
                    self.advance();
                    (key, false)
                } else if matches!(self.kind(), Kind::Str | Kind::Num | Kind::BigInt) {
                    (self.parse_primary_expression()?, false)
                } else {
                    return Err(self.expected_error(Kind::Ident));
                };
                let mut params = Self::ts_fn_params(self.parse_ts_object_signature_parameters()?);
                if getter {
                    if !params.is_empty() {
                        self.emit_error(Error::new(
                            Span::new_with_checked(member_start, self.previous_end()),
                            crate::error::SyntaxError::Unexpected {
                                got: "getter parameters".into(),
                                expected: "getter without parameters",
                            },
                        ));
                    }
                    let type_ann = if self.at(Kind::Colon) {
                        Some(self.parse_ts_return_type_annotation()?)
                    } else {
                        None
                    };
                    let end = type_ann
                        .as_ref()
                        .map_or(self.previous_end(), |annotation| annotation.span.hi);
                    members.push(TsTypeElement::TsGetterSignature(TsGetterSignature {
                        span: Span::new_with_checked(member_start, end),
                        key,
                        computed,
                        type_ann,
                    }));
                } else {
                    let Some(param) = params.pop() else {
                        return Err(self.expected_error(Kind::Ident));
                    };
                    if self.at(Kind::Colon) {
                        self.parse_ts_type_annotation()?;
                    }
                    members.push(TsTypeElement::TsSetterSignature(TsSetterSignature {
                        span: Span::new_with_checked(member_start, self.previous_end()),
                        key,
                        computed,
                        param,
                    }));
                }
                self.parse_ts_type_member_separator()?;
                continue;
            }

            let key_token = self.token();
            let (key, computed) = if self.eat(Kind::LBracket) {
                let key = self.parse_expression()?;
                if !self.expect(Kind::RBracket) {
                    return Err(self.expected_error(Kind::RBracket));
                }
                (key, true)
            } else if self.at_identifier_name() {
                let expression = Expr::Ident(Ident::new_no_ctxt(
                    self.identifier_atom(key_token),
                    key_token.span(),
                ));
                self.advance();
                (Box::new(expression), false)
            } else if matches!(self.kind(), Kind::Str | Kind::Num | Kind::BigInt) {
                (self.parse_primary_expression()?, false)
            } else {
                return Err(self.expected_error(Kind::Ident));
            };
            let optional = self.eat(Kind::QuestionMark);
            let type_params = if self.at(Kind::Lt) {
                Some(self.parse_ts_type_parameters()?)
            } else {
                None
            };
            if self.at(Kind::LParen) {
                if readonly || flow_variance {
                    self.emit_error(Error::new(
                        self.token().span(),
                        crate::error::SyntaxError::Expected(
                            "non-readonly type method".into(),
                            "readonly".into(),
                        ),
                    ));
                }
                let params = Self::ts_fn_params(self.parse_ts_object_signature_parameters()?);
                let type_ann = if self.at(Kind::Colon) {
                    Some(self.parse_ts_return_type_annotation()?)
                } else {
                    None
                };
                let end = type_ann
                    .as_ref()
                    .map_or(self.previous_end(), |annotation| annotation.span.hi);
                members.push(TsTypeElement::TsMethodSignature(TsMethodSignature {
                    span: Span::new_with_checked(member_start, end),
                    key,
                    computed,
                    optional,
                    params,
                    type_ann,
                    type_params,
                }));
                self.parse_ts_type_member_separator()?;
                continue;
            }
            if type_params.is_some() {
                return Err(self.expected_error(Kind::LParen));
            }
            let type_ann = if self.at(Kind::Colon) {
                Some(self.parse_ts_nested_type_annotation()?)
            } else {
                None
            };
            if self.context().contains(Context::FLOW) && type_ann.is_none() {
                self.emit_error(Error::new(
                    key.span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "object type property without annotation".into(),
                        expected: "property type annotation",
                    },
                ));
            }
            let end = type_ann.as_ref().map_or(key.span().hi, |ann| ann.span.hi);
            members.push(TsTypeElement::TsPropertySignature(TsPropertySignature {
                span: Span::new_with_checked(member_start, end),
                readonly,
                key,
                computed,
                optional,
                type_ann,
            }));
            self.parse_ts_type_member_separator()?;
        }
        if flow_exact && !flow_empty_exact {
            self.eat(Kind::Pipe);
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok((Span::new_with_checked(start, self.previous_end()), members))
    }

    fn parse_ts_type_member_separator(&mut self) -> Result<(), Error> {
        if !self.eat(Kind::Semi)
            && !self.eat(Kind::Comma)
            && !self.at(Kind::RBrace)
            && !(self.context().contains(Context::FLOW)
                && self.at(Kind::Pipe)
                && self.lookahead(|parser| {
                    parser.advance();
                    parser.at(Kind::RBrace)
                }))
            && !self.token().had_line_break()
        {
            return Err(self.expected_error(Kind::Semi));
        }
        Ok(())
    }

    fn ts_fn_params(params: Vec<swc_ecma_ast::Param>) -> Vec<TsFnParam> {
        params
            .into_iter()
            .map(|param| match param.pat {
                swc_ecma_ast::Pat::Ident(value) => TsFnParam::Ident(value),
                swc_ecma_ast::Pat::Array(value) => TsFnParam::Array(value),
                swc_ecma_ast::Pat::Rest(value) => TsFnParam::Rest(value),
                swc_ecma_ast::Pat::Object(value) => TsFnParam::Object(value),
                _ => unreachable!("type member parameters are binding patterns"),
            })
            .collect()
    }

    fn parse_ts_signature_parameters(&mut self) -> Result<Vec<swc_ecma_ast::Param>, Error> {
        let add = if self.context().contains(Context::FLOW) {
            Context::FLOW_FUNCTION_TYPE
        } else {
            Context::empty()
        };
        self.with_context(add, Context::empty(), Self::parse_method_parameters)
    }

    fn parse_ts_object_signature_parameters(&mut self) -> Result<Vec<swc_ecma_ast::Param>, Error> {
        self.with_context(
            Context::FLOW_OBJECT_SIGNATURE,
            Context::empty(),
            Self::parse_ts_signature_parameters,
        )
    }

    fn parse_ts_type_reference(&mut self) -> Result<Box<TsType>, Error> {
        let start = self.token().start();
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let mut type_name = TsEntityName::Ident(Ident::new_no_ctxt(
            self.identifier_atom(token),
            token.span(),
        ));
        if self.context().contains(Context::FLOW) {
            let name = self.token_source(token);
            if matches!(name, "function" | "static" | "interface" | "extends")
                || (name == "_" && !self.context().contains(Context::FLOW_TYPE_ARGUMENT))
            {
                self.emit_error(Error::new(
                    token.span(),
                    crate::error::SyntaxError::Unexpected {
                        got: name.into(),
                        expected: "valid Flow type reference",
                    },
                ));
            }
        }
        self.advance();
        while self.eat(Kind::Dot) {
            let token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let right = IdentName {
                span: token.span(),
                sym: self.identifier_atom(token),
            };
            self.advance();
            type_name = TsEntityName::TsQualifiedName(Box::new(TsQualifiedName {
                span: Span::new_with_checked(start, right.span.hi),
                left: type_name,
                right,
            }));
        }
        if self.at(Kind::LShift) && !self.token().had_line_break() {
            self.re_lex_ts_left_angle();
        }
        let type_params = if self.at(Kind::Lt)
            && (!self.token().had_line_break() || self.context().contains(Context::FLOW))
        {
            Some(self.parse_ts_type_arguments()?)
        } else {
            None
        };
        Ok(Box::new(TsType::TsTypeRef(TsTypeRef {
            span: Span::new_with_checked(start, self.previous_end()),
            type_name,
            type_params,
        })))
    }

    fn expect_ts_right_angle(&mut self) -> Result<(), Error> {
        if matches!(self.kind(), Kind::RShift | Kind::ZeroFillRShift) {
            self.re_lex_ts_right_angle();
        }
        if !self.expect(Kind::Gt) {
            return Err(self.expected_error(Kind::Gt));
        }
        Ok(())
    }
}

fn ts_keyword_type(kind: Kind) -> Option<TsKeywordTypeKind> {
    Some(match kind {
        Kind::Any => TsKeywordTypeKind::TsAnyKeyword,
        Kind::Unknown => TsKeywordTypeKind::TsUnknownKeyword,
        Kind::Number => TsKeywordTypeKind::TsNumberKeyword,
        Kind::Object => TsKeywordTypeKind::TsObjectKeyword,
        Kind::Boolean => TsKeywordTypeKind::TsBooleanKeyword,
        Kind::Bigint => TsKeywordTypeKind::TsBigIntKeyword,
        Kind::String => TsKeywordTypeKind::TsStringKeyword,
        Kind::Symbol => TsKeywordTypeKind::TsSymbolKeyword,
        Kind::Void => TsKeywordTypeKind::TsVoidKeyword,
        Kind::Undefined => TsKeywordTypeKind::TsUndefinedKeyword,
        Kind::Null => TsKeywordTypeKind::TsNullKeyword,
        Kind::Never => TsKeywordTypeKind::TsNeverKeyword,
        Kind::Intrinsic => TsKeywordTypeKind::TsIntrinsicKeyword,
        _ => return None,
    })
}

fn is_flow_reserved_type_binding(name: &str) -> bool {
    matches!(
        name,
        "any"
            | "bigint"
            | "boolean"
            | "empty"
            | "enum"
            | "extends"
            | "interface"
            | "keyof"
            | "mixed"
            | "never"
            | "null"
            | "number"
            | "object"
            | "readonly"
            | "static"
            | "string"
            | "symbol"
            | "undefined"
            | "unknown"
            | "void"
            | "_"
    )
}

fn has_legacy_octal_escape(raw: &str) -> bool {
    let bytes = raw.as_bytes();
    let mut index = 0;
    while index < bytes.len() {
        if bytes[index] != b'\\' {
            index += 1;
            continue;
        }
        let start = index;
        while index < bytes.len() && bytes[index] == b'\\' {
            index += 1;
        }
        if (index - start) % 2 == 1 && index < bytes.len() && matches!(bytes[index], b'0'..=b'7') {
            return true;
        }
    }
    false
}
