//! JavaScript class declarations, expressions, and public members.

use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    Accessibility, AutoAccessor, BindingIdent, Class, ClassDecl, ClassExpr, ClassMember,
    ClassMethod, ClassProp, Constructor, Decl, Decorator, Expr, Function, Ident,
    Key as ClassMemberKey, MethodKind, Param, ParamOrTsParamProp, Pat, PrivateMethod, PrivateName,
    PrivateProp, PropName, RestPat, StaticBlock, Stmt, Str, TsFnParam, TsIndexSignature,
    TsParamProp, TsParamPropParam,
};

use crate::{
    error::Error,
    next::{
        lexer::{config::Config, TokenKind as Kind},
        parser::{context::Context, cursor::Parser},
    },
};

impl<C: Config> Parser<'_, C> {
    pub(crate) fn parse_decorators(&mut self) -> Result<Vec<Decorator>, Error> {
        let mut decorators = Vec::new();
        while self.at(Kind::At) {
            let start = self.token().start();
            if self.context().contains(Context::FLOW)
                && !self.context().contains(Context::FLOW_DECORATORS)
            {
                self.emit_error(Error::new(
                    self.token().span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "decorator".into(),
                        expected: "Flow decorators option",
                    },
                ));
            }
            self.advance();
            let mut expression = self.parse_left_hand_side_expression()?;
            while let Expr::Paren(parenthesized) = *expression {
                expression = parenthesized.expr;
            }
            decorators.push(Decorator {
                span: Span::new_with_checked(start, expression.span().hi),
                expr: expression,
            });
        }
        Ok(decorators)
    }

    pub(crate) fn parse_class_declaration(&mut self) -> Result<Stmt, Error> {
        let (identifier, class) = self.parse_class(true)?;
        Ok(Stmt::Decl(Decl::Class(ClassDecl {
            ident: identifier.expect("class declaration must have a name"),
            declare: false,
            class,
        })))
    }

    pub(crate) fn parse_class_expression(&mut self) -> Result<Box<Expr>, Error> {
        let (identifier, class) = self.parse_class(false)?;
        Ok(Box::new(Expr::Class(ClassExpr {
            ident: identifier,
            class,
        })))
    }

    fn parse_class(&mut self, declaration: bool) -> Result<(Option<Ident>, Box<Class>), Error> {
        let start = self.token().start();
        self.advance();
        let identifier = if self.at_identifier_reference()
            && !(self.context().contains(Context::TYPESCRIPT)
                && !declaration
                && self.at(Kind::Implements))
        {
            let token = self.token();
            let identifier = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
            self.advance();
            Some(identifier)
        } else if declaration {
            return Err(self.expected_error(Kind::Ident));
        } else {
            None
        };
        #[cfg(feature = "typescript")]
        let type_params = if self.context().contains(Context::TYPESCRIPT) && self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        #[cfg(not(feature = "typescript"))]
        let type_params = None;
        let mut super_type_params = None;
        let super_class = if self.eat(Kind::Extends) {
            if self.at(Kind::Class) {
                Some(self.parse_class_expression()?)
            } else if self.context().contains(Context::TYPESCRIPT) {
                let heritage = self.parse_ts_expression_with_type_arguments()?;
                super_type_params = heritage.type_args;
                Some(heritage.expr)
            } else {
                Some(self.parse_left_hand_side_expression()?)
            }
        } else {
            None
        };
        if self.context().contains(Context::FLOW)
            && self.at(Kind::Ident)
            && self.token_source(self.token()) == "mixins"
        {
            self.advance();
            loop {
                self.parse_ts_expression_with_type_arguments()?;
                if !self.eat(Kind::Comma) {
                    break;
                }
            }
        }
        let mut implements = Vec::new();
        if self.context().contains(Context::TYPESCRIPT) && self.eat(Kind::Implements) {
            loop {
                implements.push(self.parse_ts_expression_with_type_arguments()?);
                if !self.eat(Kind::Comma) {
                    break;
                }
            }
        }
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }

        self.begin_private_scope();
        let mut body = Vec::with_capacity(32);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            if self.at(Kind::Semi) {
                let span = self.token().span();
                self.advance();
                body.push(ClassMember::Empty(swc_ecma_ast::EmptyStmt { span }));
                continue;
            }
            body.push(self.with_context(
                Context::STRICT
                    | Context::NEW_TARGET
                    | Context::CLASS_MEMBER
                    | if super_class.is_some() {
                        Context::CLASS_HAS_SUPER
                    } else {
                        Context::empty()
                    },
                Context::TOP_LEVEL,
                Self::parse_class_member,
            )?);
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        self.end_private_scope();
        self.validate_class_body(&body);
        Ok((
            identifier,
            Box::new(Class {
                span: Span::new_with_checked(start, self.previous_end()),
                ctxt: SyntaxContext::empty(),
                decorators: Vec::new(),
                body,
                super_class,
                is_abstract: false,
                type_params,
                super_type_params,
                implements,
            }),
        ))
    }

    fn validate_class_body(&mut self, body: &[ClassMember]) {
        let mut has_constructor = false;
        let mut private_names: Vec<(swc_atoms::Atom, u8)> = Vec::new();

        for member in body {
            match member {
                ClassMember::Constructor(constructor) => {
                    // TypeScript overload signatures have no body and may
                    // precede the single constructor implementation.
                    if constructor.body.is_some() && has_constructor {
                        self.emit_error(Error::new(
                            constructor.span,
                            crate::error::SyntaxError::DuplicateConstructor,
                        ));
                    }
                    has_constructor |= constructor.body.is_some();
                }
                ClassMember::Method(method) => {
                    let name = public_class_key_name(&method.key);
                    if !method.is_static
                        && name == Some("constructor")
                        && (method.function.is_async || method.function.is_generator)
                    {
                        self.emit_error(Error::new(
                            method.span,
                            crate::error::SyntaxError::DuplicateConstructor,
                        ));
                    }
                    if method.is_static && name == Some("prototype") {
                        self.emit_error(Error::new(
                            method.span,
                            crate::error::SyntaxError::Expected(
                                "non-prototype static class member".into(),
                                "prototype".into(),
                            ),
                        ));
                    }
                    if method.kind == MethodKind::Getter && method.function.type_params.is_some() {
                        self.emit_error(Error::new(
                            method.span,
                            crate::error::SyntaxError::Expected(
                                "getter without type parameters".into(),
                                "polymorphic getter".into(),
                            ),
                        ));
                    }
                }
                ClassMember::ClassProp(property) => {
                    let name = public_class_key_name(&property.key);
                    if name == Some("constructor")
                        || (property.is_static && name == Some("prototype"))
                        || (self.context().contains(Context::FLOW) && property.is_optional)
                        || (property.declare && property.value.is_some())
                        || (self.context().contains(Context::FLOW | Context::AMBIENT)
                            && property.type_ann.is_none())
                    {
                        self.emit_error(Error::new(
                            property.span,
                            crate::error::SyntaxError::Expected(
                                "valid class property".into(),
                                name.unwrap_or("optional property").into(),
                            ),
                        ));
                    }
                }
                ClassMember::PrivateProp(property) => {
                    self.validate_private_name(
                        &mut private_names,
                        &property.key.name,
                        1,
                        property.span,
                    );
                }
                ClassMember::PrivateMethod(method) => {
                    let flag = match method.kind {
                        MethodKind::Getter => 2,
                        MethodKind::Setter => 4,
                        MethodKind::Method => 8,
                    };
                    self.validate_private_name(
                        &mut private_names,
                        &method.key.name,
                        flag,
                        method.span,
                    );
                }
                _ => {}
            }
        }
    }

    fn validate_private_name(
        &mut self,
        private_names: &mut Vec<(swc_atoms::Atom, u8)>,
        name: &swc_atoms::Atom,
        flag: u8,
        span: Span,
    ) {
        if let Some((_, previous)) = private_names
            .iter_mut()
            .find(|(previous_name, _)| previous_name == name)
        {
            let accessor_pair = (*previous | flag) == 6 && (*previous & flag) == 0;
            if !accessor_pair {
                self.emit_error(Error::new(
                    span,
                    crate::error::SyntaxError::Expected(
                        "unique private name".into(),
                        name.to_string(),
                    ),
                ));
            }
            *previous |= flag;
        } else {
            private_names.push((name.clone(), flag));
        }
    }

    fn parse_class_member(&mut self) -> Result<ClassMember, Error> {
        let start = self.token().start();
        let decorators = if self.context().contains(Context::FLOW)
            && self.at(Kind::At)
            && self.lookahead(|parser| {
                parser.advance();
                parser.at(Kind::At)
            }) {
            Vec::new()
        } else {
            self.parse_decorators()?
        };
        let mut is_static = false;
        let mut accessibility = None;
        let mut member_abstract = false;
        let mut readonly = false;
        let mut declare = false;
        let mut is_override = false;
        let mut is_auto_accessor = false;
        if self.context().contains(Context::FLOW)
            && self.at(Kind::Ident)
            && self.token_source(self.token()) == "proto"
            && self.lookahead(|parser| {
                parser.advance();
                !matches!(parser.kind(), Kind::Colon | Kind::LParen | Kind::Eq)
            })
        {
            let invalid_target = self.lookahead(|parser| {
                parser.advance();
                if parser.at(Kind::LBracket) {
                    return true;
                }
                if parser.at_identifier_name() {
                    parser.advance();
                    return matches!(parser.kind(), Kind::LParen | Kind::Lt);
                }
                false
            });
            if invalid_target {
                self.emit_error(Error::new(
                    self.token().span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "proto modifier on non-property".into(),
                        expected: "proto modifier only on a declare class property",
                    },
                ));
            }
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
        }
        let mut seen_modifiers = 0_u16;
        let mut previous_modifier_rank = 0_u8;
        if self.context().contains(Context::TYPESCRIPT) {
            loop {
                let modifier = self.kind();
                if !matches!(
                    modifier,
                    Kind::Static
                        | Kind::Public
                        | Kind::Protected
                        | Kind::Private
                        | Kind::Abstract
                        | Kind::Readonly
                        | Kind::Declare
                        | Kind::Override
                        | Kind::Accessor
                        | Kind::In
                        | Kind::Out
                ) || !self.lookahead(|parser| {
                    parser.advance();
                    !matches!(
                        parser.kind(),
                        Kind::LParen
                            | Kind::Lt
                            | Kind::Colon
                            | Kind::QuestionMark
                            | Kind::Bang
                            | Kind::Eq
                            | Kind::Semi
                            | Kind::RBrace
                    )
                }) {
                    break;
                }
                let modifier_bit = 1_u16
                    << match modifier {
                        Kind::Static => 0,
                        Kind::Public => 1,
                        Kind::Protected => 2,
                        Kind::Private => 3,
                        Kind::Abstract => 4,
                        Kind::Readonly => 5,
                        Kind::Declare => 6,
                        Kind::Override => 7,
                        Kind::Accessor => 8,
                        Kind::In => 9,
                        Kind::Out => 10,
                        _ => unreachable!(),
                    };
                if seen_modifiers & modifier_bit != 0 {
                    self.emit_error(Error::new(
                        self.token().span(),
                        crate::error::SyntaxError::Expected(
                            "non-duplicated class modifier".into(),
                            modifier.to_string(),
                        ),
                    ));
                }
                if self.context().contains(Context::FLOW)
                    && matches!(modifier, Kind::Public | Kind::Protected | Kind::Private)
                {
                    self.emit_error(Error::new(
                        self.token().span(),
                        crate::error::SyntaxError::Unexpected {
                            got: modifier.to_string(),
                            expected: "Flow class member without TypeScript accessibility",
                        },
                    ));
                }
                let modifier_rank = match modifier {
                    Kind::Public | Kind::Protected | Kind::Private => 1,
                    Kind::Static => 2,
                    Kind::Abstract | Kind::Declare => 3,
                    Kind::Override => 4,
                    Kind::Readonly | Kind::Accessor => 5,
                    Kind::In | Kind::Out => previous_modifier_rank,
                    _ => unreachable!(),
                };
                if modifier_rank < previous_modifier_rank && !self.context().contains(Context::FLOW)
                {
                    self.emit_error(Error::new(
                        self.token().span(),
                        crate::error::SyntaxError::Expected(
                            "class modifiers in canonical order".into(),
                            modifier.to_string(),
                        ),
                    ));
                }
                previous_modifier_rank = modifier_rank;
                seen_modifiers |= modifier_bit;
                self.advance();
                match modifier {
                    Kind::Static => is_static = true,
                    Kind::Public => accessibility = Some(Accessibility::Public),
                    Kind::Protected => accessibility = Some(Accessibility::Protected),
                    Kind::Private => accessibility = Some(Accessibility::Private),
                    Kind::Abstract => member_abstract = true,
                    Kind::Readonly => readonly = true,
                    Kind::Declare => declare = true,
                    Kind::Override => is_override = true,
                    Kind::Accessor => is_auto_accessor = true,
                    Kind::In | Kind::Out => {}
                    _ => unreachable!(),
                }
            }
        } else if self.at(Kind::Static)
            && self.lookahead(|parser| {
                parser.advance();
                !matches!(
                    parser.kind(),
                    Kind::LParen | Kind::Eq | Kind::Semi | Kind::RBrace
                )
            })
        {
            self.advance();
            is_static = true;
        }
        if self.context().contains(Context::FLOW) {
            if self.eat(Kind::Plus) {
                readonly = true;
                flow_variance = true;
            } else {
                flow_variance |= self.eat(Kind::Minus);
            }
        }
        if is_static && self.at(Kind::LBrace) {
            let body = self.parse_block_statement()?;
            return Ok(ClassMember::StaticBlock(StaticBlock {
                span: Span::new_with_checked(start, body.span.hi),
                body,
            }));
        }
        if self.context().contains(Context::TYPESCRIPT)
            && self.at(Kind::LBracket)
            && self.lookahead(|parser| {
                parser.advance();
                parser.advance();
                parser.at(Kind::Colon)
            })
        {
            self.advance();
            let token = self.token();
            if !self.at_identifier_reference() {
                return Err(self.expected_error(Kind::Ident));
            }
            let mut binding = BindingIdent {
                id: Ident::new_no_ctxt(self.identifier_atom(token), token.span()),
                type_ann: None,
            };
            self.advance();
            binding.type_ann = Some(self.parse_ts_type_annotation()?);
            if !self.expect(Kind::RBracket) {
                return Err(self.expected_error(Kind::RBracket));
            }
            let type_ann = if self.at(Kind::Colon) {
                Some(self.parse_ts_type_annotation()?)
            } else {
                None
            };
            self.eat(Kind::Semi);
            return Ok(ClassMember::TsIndexSignature(TsIndexSignature {
                params: vec![TsFnParam::Ident(binding)],
                type_ann,
                readonly,
                is_static,
                span: Span::new_with_checked(start, self.previous_end()),
            }));
        }
        let is_async = if self.at(Kind::Async)
            && self.lookahead(|parser| {
                parser.advance();
                !parser.token().had_line_break()
                    && !matches!(
                        parser.kind(),
                        Kind::LParen
                            | Kind::Lt
                            | Kind::Colon
                            | Kind::QuestionMark
                            | Kind::Bang
                            | Kind::Eq
                            | Kind::Semi
                            | Kind::RBrace
                    )
            }) {
            self.advance();
            true
        } else {
            false
        };
        let is_generator = self.eat(Kind::Asterisk);
        if self.context().contains(Context::TYPESCRIPT)
            && self.at(Kind::Override)
            && self.lookahead(|parser| {
                parser.advance();
                !matches!(
                    parser.kind(),
                    Kind::LParen
                        | Kind::Lt
                        | Kind::Colon
                        | Kind::QuestionMark
                        | Kind::Bang
                        | Kind::Eq
                        | Kind::Semi
                        | Kind::RBrace
                )
            })
        {
            self.advance();
            is_override = true;
        }
        let method_kind = if !is_async && !is_generator && self.is_method_kind_prefix() {
            let kind = if self.at(Kind::Get) {
                MethodKind::Getter
            } else {
                MethodKind::Setter
            };
            self.advance();
            kind
        } else {
            MethodKind::Method
        };
        let key = self.parse_class_key()?;
        let key_span = key.span();
        if declare
            && !self.context().contains(Context::FLOW)
            && matches!(&key, ClassKey::Private(_))
        {
            self.emit_error(Error::new(
                key_span,
                crate::error::SyntaxError::Expected(
                    "public name for a declare member".into(),
                    "private name".into(),
                ),
            ));
        }
        if accessibility.is_some() && matches!(&key, ClassKey::Private(_)) {
            self.emit_error(Error::new(
                key_span,
                crate::error::SyntaxError::Expected(
                    "private name without an accessibility modifier".into(),
                    "accessibility modifier on private name".into(),
                ),
            ));
        }
        if matches!(&key, ClassKey::Private(name) if name.name == "constructor") {
            self.emit_error(Error::new(
                key_span,
                crate::error::SyntaxError::DuplicateConstructor,
            ));
        }
        let is_constructor = !is_static
            && !is_async
            && !is_generator
            && method_kind == MethodKind::Method
            && (matches!(
                &key,
                ClassKey::Public(PropName::Ident(name)) if name.sym == "constructor"
            ) || matches!(
            &key,
            ClassKey::Public(PropName::Str(name)) if name.value == "constructor"
            ));
        if !is_static
            && method_kind != MethodKind::Method
            && matches!(&key, ClassKey::Public(PropName::Ident(name)) if name.sym == "constructor")
        {
            self.emit_error(Error::new(
                key_span,
                crate::error::SyntaxError::DuplicateConstructor,
            ));
        }
        if is_override && (!self.context().contains(Context::CLASS_HAS_SUPER) || is_constructor) {
            self.emit_error(Error::new(
                key_span,
                crate::error::SyntaxError::Expected(
                    "override member in a derived class".into(),
                    "override".into(),
                ),
            ));
        }

        #[cfg(feature = "typescript")]
        let is_optional =
            self.context().contains(Context::TYPESCRIPT) && self.eat(Kind::QuestionMark);
        #[cfg(not(feature = "typescript"))]
        let is_optional = false;
        if is_optional && self.at(Kind::Bang) {
            self.emit_error(Error::new(
                self.token().span(),
                crate::error::SyntaxError::Expected("either ? or !".into(), "both ? and !".into()),
            ));
        }
        #[cfg(feature = "typescript")]
        let method_type_params =
            if self.context().contains(Context::TYPESCRIPT) && self.at(Kind::Lt) {
                Some(self.parse_ts_type_parameters()?)
            } else {
                None
            };
        #[cfg(not(feature = "typescript"))]
        let method_type_params = None;

        if self.at(Kind::LParen) {
            if flow_variance || readonly || declare || (is_async && is_override) {
                self.emit_error(Error::new(
                    key_span,
                    crate::error::SyntaxError::Expected(
                        "valid method modifiers".into(),
                        "invalid method modifier".into(),
                    ),
                ));
            }
            let mut parameter_context = Context::NEW_TARGET | Context::PARAMETERS;
            if self.context().contains(Context::FLOW | Context::AMBIENT) {
                parameter_context.insert(Context::FLOW_FUNCTION_TYPE);
            }
            if is_async {
                parameter_context.insert(Context::AWAIT | Context::ASYNC);
            }
            if is_generator {
                parameter_context.insert(Context::YIELD);
            }
            if is_constructor && self.context().contains(Context::CLASS_HAS_SUPER) {
                parameter_context.insert(Context::SUPER_CALL);
            }
            let mut constructor_parameters = None;
            let parameters = if is_constructor {
                constructor_parameters = Some(self.with_context(
                    parameter_context,
                    Context::YIELD | Context::AWAIT | Context::ASYNC,
                    Self::parse_constructor_parameters,
                )?);
                Vec::new()
            } else {
                self.with_context(
                    parameter_context,
                    Context::YIELD | Context::AWAIT | Context::ASYNC,
                    Self::parse_method_parameters,
                )?
            };
            if method_kind == MethodKind::Getter && !parameters.is_empty() {
                self.emit_error(Error::new(key_span, crate::error::SyntaxError::GetterParam));
            }
            if method_kind == MethodKind::Setter {
                if parameters.len() != 1 {
                    self.emit_error(Error::new(key_span, crate::error::SyntaxError::SetterParam));
                } else if matches!(parameters[0].pat, Pat::Rest(_)) {
                    self.emit_error(Error::new(
                        parameters[0].span,
                        crate::error::SyntaxError::RestPatInSetter,
                    ));
                }
            }
            if self.context().contains(Context::FLOW)
                && matches!(method_kind, MethodKind::Getter | MethodKind::Setter)
            {
                for parameter in &parameters {
                    if is_this_pattern(&parameter.pat) {
                        self.emit_error(Error::new(
                            parameter.span,
                            crate::error::SyntaxError::Unexpected {
                                got: "this parameter on accessor".into(),
                                expected: "accessor without an explicit this parameter",
                            },
                        ));
                    }
                }
            }
            #[cfg(feature = "typescript")]
            let return_type =
                if self.context().contains(Context::TYPESCRIPT) && self.at(Kind::Colon) {
                    Some(self.with_context(
                        Context::FLOW_RETURN_TYPE,
                        Context::empty(),
                        Self::parse_ts_type_annotation,
                    )?)
                } else {
                    None
                };
            #[cfg(not(feature = "typescript"))]
            let return_type = None;
            if self.context().contains(Context::TYPESCRIPT)
                && !self.at(Kind::LBrace)
                && (self.eat(Kind::Semi)
                    || (self.context().contains(Context::FLOW) && self.eat(Kind::Comma))
                    || self.token().had_line_break()
                    || self.at(Kind::RBrace))
            {
                let span = Span::new_with_checked(start, self.previous_end());
                if is_constructor {
                    let ClassKey::Public(key) = key else {
                        unreachable!()
                    };
                    return Ok(ClassMember::Constructor(Constructor {
                        span,
                        ctxt: SyntaxContext::empty(),
                        key,
                        params: constructor_parameters
                            .take()
                            .expect("constructor parameters must be parsed"),
                        body: None,
                        accessibility,
                        is_optional,
                    }));
                }
                let function = Box::new(Function {
                    params: parameters,
                    decorators,
                    span,
                    ctxt: SyntaxContext::empty(),
                    body: None,
                    is_generator,
                    is_async,
                    type_params: method_type_params,
                    return_type,
                });
                return Ok(match key {
                    ClassKey::Public(key) => ClassMember::Method(ClassMethod {
                        span,
                        key,
                        function,
                        kind: method_kind,
                        is_static,
                        accessibility,
                        is_abstract: member_abstract,
                        is_optional,
                        is_override,
                    }),
                    ClassKey::Private(key) => ClassMember::PrivateMethod(PrivateMethod {
                        span,
                        key,
                        function,
                        kind: method_kind,
                        is_static,
                        accessibility,
                        is_abstract: member_abstract,
                        is_optional,
                        is_override,
                    }),
                });
            }
            if !self.at(Kind::LBrace) {
                return Err(self.expected_error(Kind::LBrace));
            }
            if member_abstract {
                self.emit_error(Error::new(
                    self.token().span(),
                    crate::error::SyntaxError::TS1245,
                ));
            }
            let mut method_context = Context::RETURN | Context::NEW_TARGET;
            if is_async {
                method_context.insert(Context::AWAIT | Context::ASYNC);
            }
            if is_generator {
                method_context.insert(Context::YIELD);
            }
            if is_constructor {
                method_context.insert(Context::SUPER_CALL);
            }
            let body = self.with_context(
                method_context,
                Context::TOP_LEVEL
                    | Context::RETURN
                    | Context::YIELD
                    | Context::AWAIT
                    | Context::ASYNC
                    | Context::SUPER_CALL
                    | Context::CLASS_MEMBER,
                Self::parse_function_body,
            )?;
            let span = Span::new_with_checked(start, body.span.hi);
            if is_constructor {
                let ClassKey::Public(key) = key else {
                    unreachable!()
                };
                return Ok(ClassMember::Constructor(Constructor {
                    span,
                    ctxt: SyntaxContext::empty(),
                    key,
                    params: constructor_parameters
                        .take()
                        .expect("constructor parameters must be parsed"),
                    body: Some(body),
                    accessibility,
                    is_optional: false,
                }));
            }
            let function = Box::new(Function {
                params: parameters,
                decorators,
                span,
                ctxt: SyntaxContext::empty(),
                body: Some(body),
                is_generator,
                is_async,
                type_params: method_type_params,
                return_type,
            });
            return Ok(match key {
                ClassKey::Public(key) => ClassMember::Method(ClassMethod {
                    span,
                    key,
                    function,
                    kind: method_kind,
                    is_static,
                    accessibility,
                    is_abstract: member_abstract,
                    is_optional,
                    is_override,
                }),
                ClassKey::Private(key) => ClassMember::PrivateMethod(PrivateMethod {
                    span,
                    key,
                    function,
                    kind: method_kind,
                    is_static,
                    accessibility,
                    is_abstract: member_abstract,
                    is_optional,
                    is_override,
                }),
            });
        }

        if is_async || is_generator || method_kind != MethodKind::Method {
            return Err(self.expected_error(Kind::LParen));
        }
        #[cfg(feature = "typescript")]
        let definite = self.context().contains(Context::TYPESCRIPT) && self.eat(Kind::Bang);
        #[cfg(not(feature = "typescript"))]
        let definite = false;
        #[cfg(feature = "typescript")]
        let type_ann = if self.context().contains(Context::TYPESCRIPT) && self.at(Kind::Colon) {
            Some(self.parse_ts_type_annotation()?)
        } else {
            None
        };
        #[cfg(not(feature = "typescript"))]
        let type_ann = None;
        let value = if self.eat(Kind::Eq) {
            if member_abstract {
                self.emit_error(Error::new(
                    self.token().span(),
                    crate::error::SyntaxError::TS1267,
                ));
            }
            Some(self.parse_assignment_expression()?)
        } else {
            None
        };
        let end = value.as_ref().map_or(key_span.hi, |value| value.span().hi);
        if self.context().contains(Context::FLOW) && self.eat(Kind::Comma) {
            // Flow permits comma-delimited ambient class members.
        } else if !(self.context().contains(Context::FLOW) && self.at_identifier_reference()) {
            self.consume_semicolon()?;
        }
        let span = Span::new_with_checked(start, end);
        if is_auto_accessor {
            let key = match key {
                ClassKey::Public(key) => ClassMemberKey::Public(key),
                ClassKey::Private(key) => ClassMemberKey::Private(key),
            };
            return Ok(ClassMember::AutoAccessor(AutoAccessor {
                span,
                key,
                value,
                type_ann,
                is_static,
                decorators,
                accessibility,
                is_abstract: member_abstract,
                is_override,
                definite,
            }));
        }
        Ok(match key {
            ClassKey::Public(key) => ClassMember::ClassProp(ClassProp {
                span,
                key,
                value,
                type_ann,
                is_static,
                decorators,
                accessibility,
                is_abstract: member_abstract,
                is_optional,
                is_override,
                readonly,
                declare,
                definite,
            }),
            ClassKey::Private(key) => ClassMember::PrivateProp(PrivateProp {
                span,
                ctxt: SyntaxContext::empty(),
                key,
                value,
                type_ann,
                is_static,
                decorators,
                accessibility,
                is_optional,
                is_override,
                readonly,
                definite,
            }),
        })
    }

    fn is_method_kind_prefix(&mut self) -> bool {
        matches!(self.kind(), Kind::Get | Kind::Set)
            && self.lookahead(|parser| {
                parser.advance();
                !matches!(
                    parser.kind(),
                    Kind::LParen
                        | Kind::Lt
                        | Kind::Colon
                        | Kind::Eq
                        | Kind::Semi
                        | Kind::Comma
                        | Kind::RBrace
                )
            })
    }

    fn parse_class_key(&mut self) -> Result<ClassKey, Error> {
        if self.context().contains(Context::FLOW)
            && self.at(Kind::At)
            && self.lookahead(|parser| {
                parser.advance();
                parser.at(Kind::At)
            })
        {
            let start = self.token().start();
            self.advance();
            self.advance();
            let token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let value = format!("@@{}", self.identifier_atom(token));
            self.advance();
            return Ok(ClassKey::Public(PropName::Str(Str {
                span: Span::new_with_checked(start, token.end()),
                value: value.into(),
                raw: None,
            })));
        }
        if self.at(Kind::Hash) {
            let hash = self.token();
            let start = hash.start();
            self.advance();
            let token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            if token.start() != hash.end() {
                self.emit_error(Error::new(
                    Span::new_with_checked(hash.start(), token.end()),
                    crate::error::SyntaxError::Unexpected {
                        got: "whitespace after #".into(),
                        expected: "private name adjacent to #",
                    },
                ));
            }
            let key = PrivateName {
                span: Span::new_with_checked(start, token.end()),
                name: self.identifier_atom(token),
            };
            self.record_private_declaration(key.name.clone(), key.span);
            self.advance();
            return Ok(ClassKey::Private(key));
        }
        self.parse_property_name().map(ClassKey::Public)
    }

    pub(crate) fn parse_method_parameters(&mut self) -> Result<Vec<Param>, Error> {
        if !self.expect(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }
        let mut parameters = Vec::with_capacity(4);
        while !self.at(Kind::RParen) && !self.at(Kind::Eof) {
            let decorators = self.parse_decorators()?;
            let parameter_start = decorators
                .first()
                .map_or(self.token().start(), |decorator| decorator.span.lo);
            #[cfg(feature = "flow")]
            let flow_bare_anonymous = self.context().contains(Context::FLOW_FUNCTION_TYPE)
                && self.at_identifier_reference()
                && !self.context().contains(Context::FLOW_OBJECT_SIGNATURE)
                && !self.at_flow_type_parameter();
            #[cfg(not(feature = "flow"))]
            let flow_bare_anonymous = false;
            let flow_anonymous = ((self.context().contains(Context::FLOW_FUNCTION_TYPE)
                && (self.at(Kind::LParen)
                    || self.at(Kind::LBrace)
                    || self.at(Kind::LBracket)
                    || self.at(Kind::QuestionMark)
                    || matches!(
                        self.kind(),
                        Kind::Any
                            | Kind::Unknown
                            | Kind::Number
                            | Kind::Object
                            | Kind::Boolean
                            | Kind::Bigint
                            | Kind::String
                            | Kind::Symbol
                            | Kind::Void
                            | Kind::Undefined
                            | Kind::Null
                            | Kind::Never
                            | Kind::This
                    )
                    || (self.at(Kind::Ident)
                        && self.token_source(self.token()) == "renders"
                        && self.lookahead(|parser| {
                            parser.advance();
                            matches!(parser.kind(), Kind::Asterisk | Kind::QuestionMark)
                        }))
                    || (self.at_identifier_reference()
                        && self.lookahead(|parser| {
                            parser.advance();
                            matches!(parser.kind(), Kind::Lt | Kind::Dot)
                        }))
                    || flow_bare_anonymous))
                || (self.context().contains(Context::FLOW)
                    && matches!(
                        self.kind(),
                        Kind::LParen
                            | Kind::Any
                            | Kind::Unknown
                            | Kind::Number
                            | Kind::Object
                            | Kind::Boolean
                            | Kind::Bigint
                            | Kind::String
                            | Kind::Symbol
                            | Kind::Void
                            | Kind::Undefined
                            | Kind::Null
                            | Kind::Never
                    )))
                && !self.at(Kind::DotDotDot)
                && !((self.at_identifier_reference() || self.at(Kind::This))
                    && self.lookahead(|parser| {
                        parser.advance();
                        if parser.at(Kind::Colon) {
                            return true;
                        }
                        parser.eat(Kind::QuestionMark) && parser.at(Kind::Colon)
                    }));
            let mut pattern = if flow_anonymous {
                let start = self.token().start();
                let type_ann = self.parse_ts_type()?;
                swc_ecma_ast::Pat::Ident(BindingIdent {
                    id: Ident::new_no_ctxt(
                        format!("__flow_anon_param_{}", parameters.len()).into(),
                        Span::new_with_checked(start, start),
                    ),
                    type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                        span: type_ann.span(),
                        type_ann,
                    })),
                })
            } else if self.at(Kind::DotDotDot) {
                let dot3_token = self.token().span();
                self.advance();
                if self.context().contains(Context::FLOW_FUNCTION_TYPE)
                    && !(self.at_identifier_reference()
                        && self.lookahead(|parser| {
                            parser.advance();
                            parser.at(Kind::Colon)
                        }))
                {
                    let type_ann = self.parse_ts_type()?;
                    let end = type_ann.span().hi;
                    let argument = swc_ecma_ast::Pat::Ident(BindingIdent {
                        id: Ident::new_no_ctxt(
                            format!("__flow_anon_param_{}", parameters.len()).into(),
                            Span::new_with_checked(dot3_token.lo, dot3_token.lo),
                        ),
                        type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                            span: type_ann.span(),
                            type_ann,
                        })),
                    });
                    swc_ecma_ast::Pat::Rest(RestPat {
                        span: Span::new_with_checked(dot3_token.lo, end),
                        dot3_token,
                        arg: Box::new(argument),
                        type_ann: None,
                    })
                } else {
                    let mut argument = self.parse_binding_pattern(false)?;
                    #[cfg(feature = "typescript")]
                    let type_ann = match &mut argument {
                        swc_ecma_ast::Pat::Ident(pattern) => pattern.type_ann.take(),
                        swc_ecma_ast::Pat::Array(pattern) => pattern.type_ann.take(),
                        swc_ecma_ast::Pat::Object(pattern) => pattern.type_ann.take(),
                        _ => None,
                    };
                    #[cfg(not(feature = "typescript"))]
                    let type_ann = None;
                    let span = Span::new_with_checked(dot3_token.lo, argument.span().hi);
                    swc_ecma_ast::Pat::Rest(RestPat {
                        span,
                        dot3_token,
                        arg: Box::new(argument),
                        type_ann,
                    })
                }
            } else {
                self.parse_binding_pattern(true)?
            };
            #[cfg(feature = "typescript")]
            if self.context().contains(Context::TYPESCRIPT) && self.eat(Kind::QuestionMark) {
                match &mut pattern {
                    swc_ecma_ast::Pat::Ident(pattern) => pattern.id.optional = true,
                    swc_ecma_ast::Pat::Array(pattern) => pattern.optional = true,
                    swc_ecma_ast::Pat::Object(pattern) => pattern.optional = true,
                    _ => {}
                }
                if self.at(Kind::Colon) {
                    let type_ann = self.parse_ts_type_annotation()?;
                    match &mut pattern {
                        swc_ecma_ast::Pat::Ident(pattern) => pattern.type_ann = Some(type_ann),
                        swc_ecma_ast::Pat::Array(pattern) => pattern.type_ann = Some(type_ann),
                        swc_ecma_ast::Pat::Object(pattern) => pattern.type_ann = Some(type_ann),
                        swc_ecma_ast::Pat::Rest(pattern) => pattern.type_ann = Some(type_ann),
                        _ => {}
                    }
                }
            }
            let is_rest = matches!(pattern, Pat::Rest(_));
            if self.eat(Kind::Eq) {
                if is_rest {
                    return Err(Error::new(
                        pattern.span(),
                        crate::error::SyntaxError::NonLastRestParam,
                    ));
                }
                let start = pattern.span().lo;
                let right = self.parse_assignment_expression()?;
                pattern = swc_ecma_ast::Pat::Assign(swc_ecma_ast::AssignPat {
                    span: Span::new_with_checked(start, right.span().hi),
                    left: Box::new(pattern),
                    right,
                });
            }
            if self.context().contains(Context::FLOW) && is_this_pattern(&pattern) {
                if !parameters.is_empty() {
                    self.emit_error(Error::new(
                        pattern.span(),
                        crate::error::SyntaxError::Unexpected {
                            got: "non-leading this parameter".into(),
                            expected: "this as the first parameter",
                        },
                    ));
                }
                if !this_pattern_has_annotation(&pattern) {
                    self.emit_error(Error::new(
                        pattern.span(),
                        crate::error::SyntaxError::Unexpected {
                            got: "untyped this parameter".into(),
                            expected: "type annotation on this parameter",
                        },
                    ));
                }
                if matches!(&pattern, Pat::Ident(binding) if binding.id.optional) {
                    self.emit_error(Error::new(
                        pattern.span(),
                        crate::error::SyntaxError::Unexpected {
                            got: "optional this parameter".into(),
                            expected: "required this parameter",
                        },
                    ));
                }
            }
            parameters.push(Param {
                span: Span::new_with_checked(parameter_start, pattern.span().hi),
                decorators,
                pat: pattern,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
            if matches!(
                parameters.last().map(|parameter| &parameter.pat),
                Some(Pat::Rest(_))
            ) {
                return Err(self.expected_error(Kind::RParen));
            }
        }
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        Ok(parameters)
    }

    fn parse_constructor_parameters(&mut self) -> Result<Vec<ParamOrTsParamProp>, Error> {
        if !self.expect(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }
        let mut parameters = Vec::with_capacity(4);
        while !self.at(Kind::RParen) && !self.at(Kind::Eof) {
            let decorators = self.parse_decorators()?;
            let parameter_start = decorators
                .first()
                .map_or(self.token().start(), |decorator| decorator.span.lo);
            let mut accessibility = None;
            let mut readonly = false;
            let mut is_override = false;
            let mut previous_modifier_rank = 0_u8;
            if self.context().contains(Context::TYPESCRIPT) {
                loop {
                    let modifier = self.kind();
                    if !matches!(
                        modifier,
                        Kind::Public
                            | Kind::Protected
                            | Kind::Private
                            | Kind::Readonly
                            | Kind::Override
                    ) || !self.lookahead(|parser| {
                        parser.advance();
                        !matches!(
                            parser.kind(),
                            Kind::Colon
                                | Kind::Comma
                                | Kind::RParen
                                | Kind::Eq
                                | Kind::QuestionMark
                        )
                    }) {
                        break;
                    }
                    match modifier {
                        Kind::Public => accessibility = Some(Accessibility::Public),
                        Kind::Protected => accessibility = Some(Accessibility::Protected),
                        Kind::Private => accessibility = Some(Accessibility::Private),
                        Kind::Readonly => readonly = true,
                        Kind::Override => is_override = true,
                        _ => unreachable!(),
                    }
                    let modifier_rank = match modifier {
                        Kind::Public | Kind::Protected | Kind::Private => 1,
                        Kind::Override => 2,
                        Kind::Readonly => 3,
                        _ => unreachable!(),
                    };
                    if modifier_rank < previous_modifier_rank {
                        self.emit_error(Error::new(
                            self.token().span(),
                            crate::error::SyntaxError::Expected(
                                "parameter-property modifiers in canonical order".into(),
                                modifier.to_string(),
                            ),
                        ));
                    }
                    previous_modifier_rank = modifier_rank;
                    self.advance();
                }
            }
            let mut pattern = if self.at(Kind::DotDotDot) {
                let dot3_token = self.token().span();
                self.advance();
                let mut argument = self.parse_binding_pattern(false)?;
                let type_ann = match &mut argument {
                    swc_ecma_ast::Pat::Ident(pattern) => pattern.type_ann.take(),
                    swc_ecma_ast::Pat::Array(pattern) => pattern.type_ann.take(),
                    swc_ecma_ast::Pat::Object(pattern) => pattern.type_ann.take(),
                    _ => None,
                };
                let span = Span::new_with_checked(dot3_token.lo, argument.span().hi);
                swc_ecma_ast::Pat::Rest(RestPat {
                    span,
                    dot3_token,
                    arg: Box::new(argument),
                    type_ann,
                })
            } else {
                self.parse_binding_pattern(true)?
            };
            if self.eat(Kind::QuestionMark) {
                match &mut pattern {
                    swc_ecma_ast::Pat::Ident(pattern) => pattern.id.optional = true,
                    swc_ecma_ast::Pat::Array(pattern) => pattern.optional = true,
                    swc_ecma_ast::Pat::Object(pattern) => pattern.optional = true,
                    _ => {}
                }
            }
            if self.at(Kind::Colon) {
                let type_ann = self.parse_ts_type_annotation()?;
                match &mut pattern {
                    swc_ecma_ast::Pat::Ident(pattern) => pattern.type_ann = Some(type_ann),
                    swc_ecma_ast::Pat::Array(pattern) => pattern.type_ann = Some(type_ann),
                    swc_ecma_ast::Pat::Object(pattern) => pattern.type_ann = Some(type_ann),
                    swc_ecma_ast::Pat::Rest(pattern) => pattern.type_ann = Some(type_ann),
                    _ => {}
                }
            }
            if self.context().contains(Context::FLOW) && is_this_pattern(&pattern) {
                self.emit_error(Error::new(
                    pattern.span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "this parameter in constructor".into(),
                        expected: "constructor without an explicit this parameter",
                    },
                ));
            }
            let span = Span::new_with_checked(parameter_start, pattern.span().hi);
            if accessibility.is_some() || readonly || is_override {
                let param = match pattern {
                    swc_ecma_ast::Pat::Ident(pattern) => TsParamPropParam::Ident(pattern),
                    swc_ecma_ast::Pat::Assign(pattern) => TsParamPropParam::Assign(pattern),
                    _ => return Err(self.expected_error(Kind::Ident)),
                };
                parameters.push(ParamOrTsParamProp::TsParamProp(TsParamProp {
                    span,
                    decorators,
                    accessibility,
                    is_override,
                    readonly,
                    param,
                }));
            } else {
                parameters.push(ParamOrTsParamProp::Param(Param {
                    span,
                    decorators,
                    pat: pattern,
                }));
            }
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        Ok(parameters)
    }
}

fn is_this_pattern(pattern: &Pat) -> bool {
    match pattern {
        Pat::Ident(binding) => binding.id.sym == "this",
        Pat::Assign(assignment) => is_this_pattern(&assignment.left),
        Pat::Rest(rest) => is_this_pattern(&rest.arg),
        _ => false,
    }
}

fn this_pattern_has_annotation(pattern: &Pat) -> bool {
    match pattern {
        Pat::Ident(binding) => binding.type_ann.is_some(),
        Pat::Assign(assignment) => this_pattern_has_annotation(&assignment.left),
        Pat::Rest(rest) => rest.type_ann.is_some() || this_pattern_has_annotation(&rest.arg),
        _ => false,
    }
}

enum ClassKey {
    Public(PropName),
    Private(PrivateName),
}

impl ClassKey {
    fn span(&self) -> Span {
        match self {
            Self::Public(key) => key.span(),
            Self::Private(key) => key.span,
        }
    }
}

fn public_class_key_name(key: &PropName) -> Option<&str> {
    match key {
        PropName::Ident(identifier) => Some(&identifier.sym),
        PropName::Str(string) => string.value.as_str(),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{ClassMember, Decl, Expr, Stmt};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    #[test]
    fn parses_class_declarations_and_expressions_directly() {
        let source = "class Counter extends Base { static initial = 1; constructor(value) { \
                      this.value = value; } *values() { return this.value; } } const Anonymous = \
                      class { field; };";
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        let Stmt::Decl(Decl::Class(declaration)) = &script.body[0] else {
            panic!("expected class declaration")
        };
        assert!(declaration.class.super_class.is_some());
        assert_eq!(declaration.class.body.len(), 3);
        assert!(matches!(
            declaration.class.body[1],
            ClassMember::Constructor(_)
        ));
        let Stmt::Decl(Decl::Var(variable)) = &script.body[1] else {
            panic!("expected class expression declaration")
        };
        assert!(matches!(
            variable.decls[0].init.as_deref(),
            Some(Expr::Class(_))
        ));
    }

    #[test]
    fn parses_modern_class_members_directly() {
        let source = "class Example { static { boot(); } #value = 1; async load({ item }) { \
                      return await item; } get value() { return this.value; } set value(next) { \
                      this.value = next; } *[iterator](...args) {} }";
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();
        let Stmt::Decl(Decl::Class(declaration)) = &script.body[0] else {
            panic!("expected class declaration")
        };
        assert!(matches!(
            declaration.class.body[0],
            ClassMember::StaticBlock(_)
        ));
        assert!(matches!(
            declaration.class.body[1],
            ClassMember::PrivateProp(_)
        ));
        assert!(matches!(
            &declaration.class.body[2],
            ClassMember::Method(method) if method.function.is_async
        ));
        assert!(matches!(
            &declaration.class.body[3],
            ClassMember::Method(method) if method.kind == swc_ecma_ast::MethodKind::Getter
        ));
        assert!(matches!(
            &declaration.class.body[4],
            ClassMember::Method(method) if method.kind == swc_ecma_ast::MethodKind::Setter
        ));
    }
}
