use swc_common::Spanned;

use super::*;
use crate::lexer::TokenContext;

/// Parser for function expression and function declaration.
impl<I: Tokens> Parser<I> {
    pub(super) fn parse_async_fn_expr(&mut self) -> PResult<Box<Expr>> {
        let start = cur_pos!(self);
        expect!(self, "async");
        self.parse_fn(None, Some(start), Vec::new())
    }

    /// Parse function expression
    pub(super) fn parse_fn_expr(&mut self) -> PResult<Box<Expr>> {
        self.parse_fn(None, None, Vec::new())
    }

    pub(super) fn parse_async_fn_decl(&mut self, decorators: Vec<Decorator>) -> PResult<Decl> {
        let start = cur_pos!(self);
        expect!(self, "async");
        self.parse_fn(None, Some(start), decorators)
    }

    pub(super) fn parse_fn_decl(&mut self, decorators: Vec<Decorator>) -> PResult<Decl> {
        self.parse_fn(None, None, decorators)
    }

    pub(super) fn parse_default_async_fn(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
    ) -> PResult<ExportDefaultDecl> {
        let start_of_async = cur_pos!(self);
        expect!(self, "async");
        self.parse_fn(Some(start), Some(start_of_async), decorators)
    }

    pub(super) fn parse_default_fn(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
    ) -> PResult<ExportDefaultDecl> {
        self.parse_fn(Some(start), None, decorators)
    }

    pub(super) fn parse_class_decl(
        &mut self,
        start: BytePos,
        class_start: BytePos,
        decorators: Vec<Decorator>,
        is_abstract: bool,
    ) -> PResult<Decl> {
        self.parse_class(start, class_start, decorators, is_abstract)
    }

    pub(super) fn parse_class_expr(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
    ) -> PResult<Box<Expr>> {
        self.parse_class(start, start, decorators, false)
    }

    pub(super) fn parse_default_class(
        &mut self,
        start: BytePos,
        class_start: BytePos,
        decorators: Vec<Decorator>,
        is_abstract: bool,
    ) -> PResult<ExportDefaultDecl> {
        self.parse_class(start, class_start, decorators, is_abstract)
    }

    /// Not generic
    fn parse_class_inner(
        &mut self,
        _start: BytePos,
        class_start: BytePos,
        decorators: Vec<Decorator>,
        is_ident_required: bool,
    ) -> PResult<(Option<Ident>, Box<Class>)> {
        self.strict_mode().parse_with(|p| {
            expect!(p, "class");

            let ident = p
                .parse_maybe_opt_binding_ident(is_ident_required, true)?
                .map(Ident::from);
            if p.input.syntax().typescript() {
                if let Some(span) = ident.invalid_class_name() {
                    p.emit_err(span, SyntaxError::TS2414);
                }
            }

            let type_params = if p.input.syntax().typescript() {
                p.try_parse_ts_type_params(true, true)?
            } else {
                None
            };

            let (mut super_class, mut super_type_params) = if eat!(p, "extends") {
                let (super_class, super_type_params) = p.parse_super_class()?;

                if p.syntax().typescript() && eat!(p, ',') {
                    let exprs = p.parse_ts_heritage_clause()?;

                    for e in &exprs {
                        p.emit_err(e.span(), SyntaxError::TS1174);
                    }
                }

                (Some(super_class), super_type_params)
            } else {
                (None, None)
            };

            // Handle TS1172
            if eat!(p, "extends") {
                p.emit_err(p.input.prev_span(), SyntaxError::TS1172);

                p.parse_super_class()?;
            };

            let implements = if p.input.syntax().typescript() && eat!(p, "implements") {
                p.parse_ts_heritage_clause()?
            } else {
                Vec::new()
            };

            {
                // Handle TS1175
                if p.input.syntax().typescript() && eat!(p, "implements") {
                    p.emit_err(p.input.prev_span(), SyntaxError::TS1175);

                    p.parse_ts_heritage_clause()?;
                }
            }

            // Handle TS1173
            if p.input.syntax().typescript() && eat!(p, "extends") {
                p.emit_err(p.input.prev_span(), SyntaxError::TS1173);

                let (sc, type_params) = p.parse_super_class()?;

                if super_class.is_none() {
                    super_class = Some(sc);
                    if type_params.is_some() {
                        super_type_params = type_params;
                    }
                }
            }

            expect!(p, '{');
            let body = p
                .with_ctx(Context {
                    has_super_class: super_class.is_some(),
                    ..p.ctx()
                })
                .parse_class_body()?;

            if p.input.cur().is_none() {
                let eof_text = p.input.dump_cur();
                p.emit_err(
                    p.input.cur_span(),
                    SyntaxError::Expected(&Token::RBrace, eof_text),
                );
            } else {
                expect!(p, '}');
            }
            let end = last_pos!(p);

            Ok((
                ident,
                Box::new(Class {
                    span: Span::new(class_start, end),
                    decorators,
                    is_abstract: false,
                    type_params,
                    super_class,
                    super_type_params,
                    body,
                    implements,
                    ..Default::default()
                }),
            ))
        })
    }

    fn parse_class<T>(
        &mut self,
        start: BytePos,
        class_start: BytePos,
        decorators: Vec<Decorator>,
        is_abstract: bool,
    ) -> PResult<T>
    where
        T: OutputType,
    {
        let (ident, mut class) = self
            .with_ctx(Context {
                in_class: true,
                ..self.ctx()
            })
            .parse_class_inner(start, class_start, decorators, T::IS_IDENT_REQUIRED)?;

        if is_abstract {
            class.is_abstract = true
        } else {
            for member in class.body.iter() {
                match member {
                    ClassMember::ClassProp(ClassProp {
                        is_abstract: true,
                        span,
                        ..
                    })
                    | ClassMember::Method(ClassMethod {
                        span,
                        is_abstract: true,
                        ..
                    }) => self.emit_err(*span, SyntaxError::TS1244),
                    _ => (),
                }
            }
        }

        match T::finish_class(span!(self, start), ident, class) {
            Ok(v) => Ok(v),
            Err(kind) => syntax_error!(self, kind),
        }
    }

    fn parse_super_class(&mut self) -> PResult<(Box<Expr>, Option<Box<TsTypeParamInstantiation>>)> {
        let super_class = self.parse_lhs_expr()?;
        match *super_class {
            Expr::TsInstantiation(TsInstantiation {
                expr, type_args, ..
            }) => Ok((expr, Some(type_args))),
            _ => {
                // We still need to parse TS type arguments,
                // because in some cases "super class" returned by `parse_lhs_expr`
                // may not include `TsExprWithTypeArgs`
                // but it's a super class with type params, for example, in JSX.
                if self.syntax().typescript() && is!(self, '<') {
                    Ok((super_class, self.parse_ts_type_args().map(Some)?))
                } else {
                    Ok((super_class, None))
                }
            }
        }
    }

    pub(super) fn parse_decorators(&mut self, allow_export: bool) -> PResult<Vec<Decorator>> {
        if !self.syntax().decorators() {
            return Ok(Vec::new());
        }
        trace_cur!(self, parse_decorators);

        let mut decorators = Vec::new();
        let start = cur_pos!(self);

        while is!(self, '@') {
            decorators.push(self.parse_decorator()?);
        }
        if decorators.is_empty() {
            return Ok(decorators);
        }

        if is!(self, "export") {
            if !self.ctx().in_class && !self.ctx().in_function && !allow_export {
                syntax_error!(self, self.input.cur_span(), SyntaxError::ExportNotAllowed);
            }

            if !self.ctx().in_class
                && !self.ctx().in_function
                && !self.syntax().decorators_before_export()
            {
                syntax_error!(self, span!(self, start), SyntaxError::DecoratorOnExport);
            }
        } else if !is!(self, "class") {
            // syntax_error!(self, span!(self, start),
            // SyntaxError::InvalidLeadingDecorator)
        }

        Ok(decorators)
    }

    fn parse_decorator(&mut self) -> PResult<Decorator> {
        let start = cur_pos!(self);
        trace_cur!(self, parse_decorator);

        assert_and_bump!(self, '@');

        let expr = if eat!(self, '(') {
            let expr = self.parse_expr()?;
            expect!(self, ')');
            expr
        } else {
            let expr = self
                .parse_ident(false, false)
                .map(Expr::from)
                .map(Box::new)?;

            self.parse_subscripts(Callee::Expr(expr), false, true)?
        };

        let expr = self.parse_maybe_decorator_args(expr)?;

        Ok(Decorator {
            span: span!(self, start),
            expr,
        })
    }

    fn parse_maybe_decorator_args(&mut self, expr: Box<Expr>) -> PResult<Box<Expr>> {
        let type_args = if self.input.syntax().typescript() && is!(self, '<') {
            Some(self.parse_ts_type_args()?)
        } else {
            None
        };

        if type_args.is_none() && !is!(self, '(') {
            return Ok(expr);
        }

        let args = self.parse_args(false)?;
        Ok(CallExpr {
            span: span!(self, expr.span_lo()),
            callee: Callee::Expr(expr),
            args,
            ..Default::default()
        }
        .into())
    }

    fn parse_class_body(&mut self) -> PResult<Vec<ClassMember>> {
        let mut elems = Vec::new();
        let mut has_constructor_with_body = false;
        while !eof!(self) && !is!(self, '}') {
            if eat_exact!(self, ';') {
                let span = self.input.prev_span();
                elems.push(ClassMember::Empty(EmptyStmt {
                    span: Span::new(span.lo, span.hi),
                }));
                continue;
            }
            let mut p = self.with_ctx(Context {
                allow_direct_super: true,
                ..self.ctx()
            });
            let elem = p.parse_class_member()?;

            if !p.ctx().in_declare {
                if let ClassMember::Constructor(Constructor {
                    body: Some(..),
                    span,
                    ..
                }) = elem
                {
                    if has_constructor_with_body {
                        p.emit_err(span, SyntaxError::DuplicateConstructor);
                    }
                    has_constructor_with_body = true;
                }
            }
            elems.push(elem);
        }
        Ok(elems)
    }

    pub(super) fn parse_access_modifier(&mut self) -> PResult<Option<Accessibility>> {
        Ok(self
            .parse_ts_modifier(&["public", "protected", "private", "in", "out"], false)?
            .and_then(|s| match s {
                "public" => Some(Accessibility::Public),
                "protected" => Some(Accessibility::Protected),
                "private" => Some(Accessibility::Private),
                other => {
                    self.emit_err(self.input.prev_span(), SyntaxError::TS1274(other.into()));
                    None
                }
            }))
    }

    fn parse_class_member(&mut self) -> PResult<ClassMember> {
        trace_cur!(self, parse_class_member);

        let start = cur_pos!(self);
        let decorators = self.parse_decorators(false)?;
        let declare = self.syntax().typescript() && eat!(self, "declare");
        let accessibility = if self.input.syntax().typescript() {
            self.parse_access_modifier()?
        } else {
            None
        };
        // Allow `private declare`.
        let declare = declare || self.syntax().typescript() && eat!(self, "declare");

        let declare_token = if declare {
            // Handle declare(){}
            if self.is_class_method() {
                let key = Key::Public(PropName::Ident(IdentName::new(
                    "declare".into(),
                    span!(self, start),
                )));
                let is_optional = self.input.syntax().typescript() && eat!(self, '?');
                return self.make_method(
                    |p| p.parse_unique_formal_params(),
                    MakeMethodArgs {
                        start,
                        accessibility,
                        decorators,
                        is_abstract: false,
                        is_optional,
                        is_override: false,
                        is_async: false,
                        is_generator: false,
                        static_token: None,
                        key,
                        kind: MethodKind::Method,
                    },
                );
            } else if self.is_class_property(/* asi */ true)
                || (self.syntax().typescript() && is!(self, '?'))
            {
                // Property named `declare`

                let key = Key::Public(PropName::Ident(IdentName::new(
                    "declare".into(),
                    span!(self, start),
                )));
                let is_optional = self.input.syntax().typescript() && eat!(self, '?');
                return self.make_property(
                    start,
                    decorators,
                    accessibility,
                    key,
                    false,
                    None,
                    is_optional,
                    false,
                    false,
                    false,
                    false,
                );
            } else {
                Some(span!(self, start))
            }
        } else {
            None
        };

        let static_token = {
            let start = cur_pos!(self);
            if eat!(self, "static") {
                Some(span!(self, start))
            } else {
                None
            }
        };

        let accessor_token = if self.syntax().auto_accessors() {
            let start = cur_pos!(self);
            if eat!(self, "accessor") {
                Some(span!(self, start))
            } else {
                None
            }
        } else {
            None
        };

        if let Some(accessor_token) = accessor_token {
            // Handle accessor(){}
            if self.is_class_method() {
                let key = Key::Public(PropName::Ident(IdentName::new(
                    "accessor".into(),
                    accessor_token,
                )));
                let is_optional = self.input.syntax().typescript() && eat!(self, '?');
                return self.make_method(
                    |p| p.parse_unique_formal_params(),
                    MakeMethodArgs {
                        start,
                        accessibility,
                        decorators,
                        is_abstract: false,
                        is_optional,
                        is_override: false,
                        is_async: false,
                        is_generator: false,
                        static_token,
                        key,
                        kind: MethodKind::Method,
                    },
                );
            } else if self.is_class_property(/* asi */ true)
                || (self.syntax().typescript() && is!(self, '?'))
            {
                // Property named `accessor`

                let key = Key::Public(PropName::Ident(IdentName::new(
                    "accessor".into(),
                    accessor_token,
                )));
                let is_optional = self.input.syntax().typescript() && eat!(self, '?');
                let is_static = static_token.is_some();
                return self.make_property(
                    start,
                    decorators,
                    accessibility,
                    key,
                    is_static,
                    None,
                    is_optional,
                    false,
                    declare,
                    false,
                    false,
                );
            }
        }

        if let Some(static_token) = static_token {
            // Handle static(){}
            if self.is_class_method() {
                let key = Key::Public(PropName::Ident(IdentName::new(
                    "static".into(),
                    static_token,
                )));
                let is_optional = self.input.syntax().typescript() && eat!(self, '?');
                return self.make_method(
                    |p| p.parse_unique_formal_params(),
                    MakeMethodArgs {
                        start,
                        accessibility,
                        decorators,
                        is_abstract: false,
                        is_optional,
                        is_override: false,
                        is_async: false,
                        is_generator: false,
                        static_token: None,
                        key,
                        kind: MethodKind::Method,
                    },
                );
            } else if self.is_class_property(/* asi */ false)
                || (self.syntax().typescript() && is!(self, '?'))
            {
                // Property named `static`

                // Avoid to parse
                //   static
                //   {}
                let is_parsing_static_blocks = is!(self, '{');
                if !is_parsing_static_blocks {
                    let key = Key::Public(PropName::Ident(IdentName::new(
                        "static".into(),
                        static_token,
                    )));
                    let is_optional = self.input.syntax().typescript() && eat!(self, '?');
                    return self.make_property(
                        start,
                        decorators,
                        accessibility,
                        key,
                        false,
                        accessor_token,
                        is_optional,
                        false,
                        declare,
                        false,
                        false,
                    );
                }
            } else {
                // TODO: error if static contains escape
            }
        }

        self.parse_class_member_with_is_static(
            start,
            declare_token,
            accessibility,
            static_token,
            accessor_token,
            decorators,
        )
    }

    fn parse_static_block(&mut self, start: BytePos) -> PResult<ClassMember> {
        let body = self
            .with_ctx(Context {
                in_static_block: true,
                in_class_field: true,
                allow_using_decl: true,
                ..self.ctx()
            })
            .parse_block(false)?;

        let span = span!(self, start);
        Ok(StaticBlock { span, body }.into())
    }

    fn parse_class_member_with_is_static(
        &mut self,
        start: BytePos,
        declare_token: Option<Span>,
        accessibility: Option<Accessibility>,
        static_token: Option<Span>,
        accessor_token: Option<Span>,
        decorators: Vec<Decorator>,
    ) -> PResult<ClassMember> {
        let mut is_static = static_token.is_some();

        let mut is_abstract = false;
        let mut is_override = false;
        let mut readonly = None;
        let mut modifier_span = None;
        let declare = declare_token.is_some();
        while let Some(modifier) =
            self.parse_ts_modifier(&["abstract", "readonly", "override", "static"], true)?
        {
            modifier_span = Some(self.input.prev_span());
            match modifier {
                "abstract" => {
                    if is_abstract {
                        self.emit_err(
                            self.input.prev_span(),
                            SyntaxError::TS1030("abstract".into()),
                        );
                    } else if is_override {
                        self.emit_err(
                            self.input.prev_span(),
                            SyntaxError::TS1029("abstract".into(), "override".into()),
                        );
                    }
                    is_abstract = true;
                }
                "override" => {
                    if is_override {
                        self.emit_err(
                            self.input.prev_span(),
                            SyntaxError::TS1030("override".into()),
                        );
                    } else if readonly.is_some() {
                        self.emit_err(
                            self.input.prev_span(),
                            SyntaxError::TS1029("override".into(), "readonly".into()),
                        );
                    } else if declare {
                        self.emit_err(
                            self.input.prev_span(),
                            SyntaxError::TS1243("override".into(), "declare".into()),
                        );
                    } else if !self.ctx().has_super_class {
                        self.emit_err(self.input.prev_span(), SyntaxError::TS4112);
                    }
                    is_override = true;
                }
                "readonly" => {
                    let readonly_span = self.input.prev_span();
                    if readonly.is_some() {
                        self.emit_err(readonly_span, SyntaxError::TS1030("readonly".into()));
                    } else {
                        readonly = Some(readonly_span);
                    }
                }
                "static" => {
                    if is_override {
                        self.emit_err(
                            self.input.prev_span(),
                            SyntaxError::TS1029("static".into(), "override".into()),
                        );
                    }

                    is_static = true;
                }
                _ => {}
            }
        }

        let accessor_token = accessor_token.or_else(|| {
            if self.syntax().auto_accessors() && readonly.is_none() {
                let start = cur_pos!(self);
                if eat!(self, "accessor") {
                    Some(span!(self, start))
                } else {
                    None
                }
            } else {
                None
            }
        });

        if is_static && is!(self, '{') {
            if let Some(span) = declare_token {
                self.emit_err(span, SyntaxError::TS1184);
            }
            if accessibility.is_some() {
                self.emit_err(self.input.cur_span(), SyntaxError::TS1184);
            }
            return self.parse_static_block(start);
        }
        if is!(self, "static") && peeked_is!(self, '{') {
            // For "readonly", "abstract" and "override"
            if let Some(span) = modifier_span {
                self.emit_err(span, SyntaxError::TS1184);
            }
            if let Some(span) = static_token {
                self.emit_err(span, SyntaxError::TS1184);
            }
            bump!(self); // consume "static"
            return self.parse_static_block(start);
        }

        if self.input.syntax().typescript()
            && !is_abstract
            && !is_override
            && accessibility.is_none()
        {
            let idx = self.try_parse_ts_index_signature(start, readonly.is_some(), is_static)?;
            if let Some(idx) = idx {
                return Ok(idx.into());
            }
        }

        if eat!(self, '*') {
            // generator method
            let key = self.parse_class_prop_name()?;
            if readonly.is_some() {
                self.emit_err(span!(self, start), SyntaxError::ReadOnlyMethod);
            }
            if is_constructor(&key) {
                self.emit_err(span!(self, start), SyntaxError::GeneratorConstructor);
            }

            return self.make_method(
                |p| p.parse_unique_formal_params(),
                MakeMethodArgs {
                    start,
                    decorators,
                    is_async: false,
                    is_generator: true,
                    accessibility,
                    is_abstract,
                    is_override,
                    is_optional: false,
                    static_token,
                    key,
                    kind: MethodKind::Method,
                },
            );
        }

        trace_cur!(self, parse_class_member_with_is_static__normal_class_member);
        let key = if readonly.is_some() && is_one_of!(self, '!', ':') {
            Key::Public(PropName::Ident(IdentName::new(
                "readonly".into(),
                readonly.unwrap(),
            )))
        } else {
            self.parse_class_prop_name()?
        };
        let is_optional = self.input.syntax().typescript() && eat!(self, '?');

        if self.is_class_method() {
            // handle a(){} / get(){} / set(){} / async(){}

            trace_cur!(self, parse_class_member_with_is_static__normal_class_method);

            if let Some(token) = declare_token {
                self.emit_err(token, SyntaxError::TS1031)
            }

            if readonly.is_some() {
                syntax_error!(self, span!(self, start), SyntaxError::ReadOnlyMethod);
            }
            let is_constructor = is_constructor(&key);

            if is_constructor {
                if self.syntax().typescript() && is_override {
                    self.emit_err(span!(self, start), SyntaxError::TS1089("override".into()));
                }

                if self.syntax().typescript() && is!(self, '<') {
                    let start = cur_pos!(self);
                    if peeked_is!(self, '>') {
                        assert_and_bump!(self, '<');
                        let start2 = cur_pos!(self);
                        assert_and_bump!(self, '>');

                        self.emit_err(span!(self, start), SyntaxError::TS1098);
                        self.emit_err(span!(self, start2), SyntaxError::TS1092);
                    } else {
                        let type_params = self.try_parse_ts_type_params(false, true)?;

                        if let Some(type_params) = type_params {
                            for param in type_params.params {
                                self.emit_err(param.span(), SyntaxError::TS1092);
                            }
                        }
                    }
                }

                expect!(self, '(');
                let params = self.parse_constructor_params()?;
                expect!(self, ')');

                if self.syntax().typescript() && is!(self, ':') {
                    let start = cur_pos!(self);
                    let type_ann = self.parse_ts_type_ann(true, start)?;

                    self.emit_err(type_ann.type_ann.span(), SyntaxError::TS1093);
                }

                let body: Option<_> =
                    self.parse_fn_body(false, false, false, params.is_simple_parameter_list())?;

                if body.is_none() {
                    for param in params.iter() {
                        if param.is_ts_param_prop() {
                            self.emit_err(param.span(), SyntaxError::TS2369)
                        }
                    }
                }

                if self.syntax().typescript() && body.is_none() {
                    // Declare constructors cannot have assignment pattern in parameters
                    for p in &params {
                        // TODO: Search deeply for assignment pattern using a Visitor

                        let span = match *p {
                            ParamOrTsParamProp::Param(ref param) => match param.pat {
                                Pat::Assign(ref p) => Some(p.span()),
                                _ => None,
                            },
                            ParamOrTsParamProp::TsParamProp(TsParamProp {
                                param: TsParamPropParam::Assign(ref p),
                                ..
                            }) => Some(p.span()),
                            _ => None,
                        };

                        if let Some(span) = span {
                            self.emit_err(span, SyntaxError::TS2371)
                        }
                    }
                }

                if let Some(static_token) = static_token {
                    self.emit_err(static_token, SyntaxError::TS1089("static".into()))
                }

                if let Some(span) = modifier_span {
                    if is_abstract {
                        self.emit_err(span, SyntaxError::TS1242);
                    }
                }

                return Ok(ClassMember::Constructor(Constructor {
                    span: span!(self, start),
                    accessibility,
                    key: match key {
                        Key::Public(key) => key,
                        _ => unreachable!("is_constructor() returns false for PrivateName"),
                    },
                    is_optional,
                    params,
                    body,
                    ..Default::default()
                }));
            } else {
                return self.make_method(
                    |p| p.parse_formal_params(),
                    MakeMethodArgs {
                        start,
                        is_optional,
                        accessibility,
                        decorators,
                        is_abstract,
                        is_override,
                        static_token,
                        kind: MethodKind::Method,
                        key,
                        is_async: false,
                        is_generator: false,
                    },
                );
            }
        }

        let is_next_line_generator = self.input.had_line_break_before_cur() && is!(self, '*');
        let getter_or_setter_ident = match key {
            // `get\n*` is an uninitialized property named 'get' followed by a generator.
            Key::Public(PropName::Ident(ref i))
                if (i.sym == "get" || i.sym == "set")
                    && !self.is_class_property(/* asi */ false)
                    && !is_next_line_generator =>
            {
                Some(i)
            }
            _ => None,
        };

        if getter_or_setter_ident.is_none() && self.is_class_property(/* asi */ true) {
            return self.make_property(
                start,
                decorators,
                accessibility,
                key,
                is_static,
                accessor_token,
                is_optional,
                readonly.is_some(),
                declare,
                is_abstract,
                is_override,
            );
        }

        if match key {
            Key::Public(PropName::Ident(ref i)) => i.sym == "async",
            _ => false,
        } && !self.input.had_line_break_before_cur()
        {
            // handle async foo(){}

            if self.parse_ts_modifier(&["override"], false)?.is_some() {
                is_override = true;
                self.emit_err(
                    self.input.prev_span(),
                    SyntaxError::TS1029("override".into(), "async".into()),
                );
            }

            let is_generator = eat!(self, '*');
            let key = self.parse_class_prop_name()?;
            if is_constructor(&key) {
                syntax_error!(self, key.span(), SyntaxError::AsyncConstructor)
            }
            if readonly.is_some() {
                syntax_error!(self, span!(self, start), SyntaxError::ReadOnlyMethod);
            }

            // handle async foo(){}
            let is_optional = is_optional || self.input.syntax().typescript() && eat!(self, '?');
            return self.make_method(
                |p| p.parse_unique_formal_params(),
                MakeMethodArgs {
                    start,
                    static_token,
                    key,
                    is_abstract,
                    accessibility,
                    is_optional,
                    is_override,
                    decorators,
                    kind: MethodKind::Method,
                    is_async: true,
                    is_generator,
                },
            );
        }

        if let Some(i) = getter_or_setter_ident {
            let key_span = key.span();

            // handle get foo(){} / set foo(v){}
            let key = self.parse_class_prop_name()?;

            if readonly.is_some() {
                self.emit_err(key_span, SyntaxError::GetterSetterCannotBeReadonly);
            }

            if is_constructor(&key) {
                self.emit_err(key_span, SyntaxError::ConstructorAccessor);
            }

            return match &*i.sym {
                "get" => self.make_method(
                    |p| {
                        let params = p.parse_formal_params()?;

                        if params.iter().filter(|p| is_not_this(p)).count() != 0 {
                            p.emit_err(key_span, SyntaxError::GetterParam);
                        }

                        Ok(params)
                    },
                    MakeMethodArgs {
                        decorators,
                        start,
                        is_abstract,
                        is_async: false,
                        is_generator: false,
                        is_optional,
                        is_override,
                        accessibility,
                        static_token,
                        key,
                        kind: MethodKind::Getter,
                    },
                ),
                "set" => self.make_method(
                    |p| {
                        let params = p.parse_formal_params()?;

                        if params.iter().filter(|p| is_not_this(p)).count() != 1 {
                            p.emit_err(key_span, SyntaxError::SetterParam);
                        }

                        if !params.is_empty() {
                            if let Pat::Rest(..) = params[0].pat {
                                p.emit_err(params[0].pat.span(), SyntaxError::RestPatInSetter);
                            }
                        }

                        Ok(params)
                    },
                    MakeMethodArgs {
                        decorators,
                        start,
                        is_optional,
                        is_abstract,
                        is_override,
                        is_async: false,
                        is_generator: false,
                        accessibility,
                        static_token,
                        key,
                        kind: MethodKind::Setter,
                    },
                ),
                _ => unreachable!(),
            };
        }

        unexpected!(self, "* for generator, private key, identifier or async")
    }

    fn make_property(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
        accessibility: Option<Accessibility>,
        key: Key,
        is_static: bool,
        accessor_token: Option<Span>,
        is_optional: bool,
        readonly: bool,
        declare: bool,
        is_abstract: bool,
        is_override: bool,
    ) -> PResult<ClassMember> {
        if is_constructor(&key) {
            syntax_error!(self, key.span(), SyntaxError::PropertyNamedConstructor);
        }
        if key.is_private() {
            if declare {
                self.emit_err(
                    key.span(),
                    SyntaxError::PrivateNameModifier("declare".into()),
                )
            }
            if is_abstract {
                self.emit_err(
                    key.span(),
                    SyntaxError::PrivateNameModifier("abstract".into()),
                )
            }
        }
        let definite = self.input.syntax().typescript() && !is_optional && eat!(self, '!');

        let type_ann = self.try_parse_ts_type_ann()?;

        let ctx = Context {
            include_in_expr: true,
            in_class_field: true,
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_with(|p| {
            let value = if is!(p, '=') {
                assert_and_bump!(p, '=');
                Some(p.parse_assignment_expr()?)
            } else {
                None
            };

            if !eat!(p, ';') {
                p.emit_err(p.input.cur_span(), SyntaxError::TS1005);
            }

            if accessor_token.is_some() {
                return Ok(ClassMember::AutoAccessor(AutoAccessor {
                    span: span!(p, start),
                    key,
                    value,
                    type_ann,
                    is_static,
                    decorators,
                    accessibility,
                    is_abstract,
                    is_override,
                    definite,
                }));
            }

            Ok(match key {
                Key::Private(key) => {
                    let span = span!(p, start);
                    if accessibility.is_some() {
                        p.emit_err(span.with_hi(key.span_hi()), SyntaxError::TS18010);
                    }

                    PrivateProp {
                        span: span!(p, start),
                        key,
                        value,
                        is_static,
                        decorators,
                        accessibility,
                        is_optional,
                        is_override,
                        readonly,
                        type_ann,
                        definite,
                        ctxt: Default::default(),
                    }
                    .into()
                }
                Key::Public(key) => {
                    let span = span!(p, start);
                    if is_abstract && value.is_some() {
                        p.emit_err(span, SyntaxError::TS1267)
                    }
                    ClassProp {
                        span,
                        key,
                        value,
                        is_static,
                        decorators,
                        accessibility,
                        is_abstract,
                        is_optional,
                        is_override,
                        readonly,
                        declare,
                        definite,
                        type_ann,
                    }
                    .into()
                }
            })
        })
    }

    fn is_class_method(&mut self) -> bool {
        is!(self, '(')
            || (self.input.syntax().typescript() && is!(self, '<'))
            || (self.input.syntax().typescript() && is!(self, JSXTagStart))
    }

    fn is_class_property(&mut self, asi: bool) -> bool {
        (self.input.syntax().typescript() && is_one_of!(self, '!', ':'))
            || is_one_of!(self, '=', '}')
            || if asi {
                is!(self, ';')
            } else {
                is_exact!(self, ';')
            }
    }

    fn parse_fn_inner(
        &mut self,
        _start_of_output_type: Option<BytePos>,
        start_of_async: Option<BytePos>,
        decorators: Vec<Decorator>,
        is_fn_expr: bool,
        is_ident_required: bool,
    ) -> PResult<(Option<Ident>, Box<Function>)> {
        let start = start_of_async.unwrap_or_else(|| cur_pos!(self));
        assert_and_bump!(self, "function");
        let is_async = start_of_async.is_some();

        let is_generator = eat!(self, '*');

        let ident = if is_fn_expr {
            //
            self.with_ctx(Context {
                in_async: is_async,
                in_generator: is_generator,
                allow_direct_super: false,
                in_class_field: false,
                ..self.ctx()
            })
            .parse_maybe_opt_binding_ident(is_ident_required, false)?
        } else {
            // function declaration does not change context for `BindingIdentifier`.
            self.with_ctx(Context {
                allow_direct_super: false,
                in_class_field: false,
                ..self.ctx()
            })
            .parse_maybe_opt_binding_ident(is_ident_required, false)?
        }
        .map(Ident::from);

        self.with_ctx(Context {
            allow_direct_super: false,
            in_class_field: false,
            will_expect_colon_for_cond: false,
            ..self.ctx()
        })
        .parse_with(|p| {
            let f = p.parse_fn_args_body(
                decorators,
                start,
                |p| p.parse_formal_params(),
                is_async,
                is_generator,
            )?;

            if is_fn_expr && f.body.is_none() {
                unexpected!(p, "{");
            }

            Ok((ident, f))
        })
    }

    fn parse_fn<T>(
        &mut self,
        start_of_output_type: Option<BytePos>,
        start_of_async: Option<BytePos>,
        decorators: Vec<Decorator>,
    ) -> PResult<T>
    where
        T: OutputType,
    {
        let start = start_of_async.unwrap_or_else(|| cur_pos!(self));
        let (ident, f) = self.parse_fn_inner(
            start_of_output_type,
            start_of_async,
            decorators,
            T::is_fn_expr(),
            T::IS_IDENT_REQUIRED,
        )?;

        match T::finish_fn(span!(self, start_of_output_type.unwrap_or(start)), ident, f) {
            Ok(v) => Ok(v),
            Err(kind) => syntax_error!(self, kind),
        }
    }

    /// If `required` is `true`, this never returns `None`.
    fn parse_maybe_opt_binding_ident(
        &mut self,
        required: bool,
        disallow_let: bool,
    ) -> PResult<Option<Ident>> {
        if required {
            self.parse_binding_ident(disallow_let)
                .map(|v| v.id)
                .map(Some)
        } else {
            self.parse_opt_binding_ident(disallow_let)
                .map(|v| v.map(|v| v.id))
        }
    }

    /// `parse_args` closure should not eat '(' or ')'.
    pub(super) fn parse_fn_args_body<F>(
        &mut self,
        decorators: Vec<Decorator>,
        start: BytePos,
        parse_args: F,
        is_async: bool,
        is_generator: bool,
    ) -> PResult<Box<Function>>
    where
        F: FnOnce(&mut Self) -> PResult<Vec<Param>>,
    {
        trace_cur!(self, parse_fn_args_body);
        // let prev_in_generator = self.ctx().in_generator;
        let ctx = Context {
            in_async: is_async,
            in_generator: is_generator,
            ..self.ctx()
        };

        self.with_ctx(ctx).parse_with(|p| {
            let type_params = if p.syntax().typescript() {
                p.in_type().parse_with(|p| {
                    trace_cur!(p, parse_fn_args_body__type_params);

                    Ok(if is!(p, '<') {
                        Some(p.parse_ts_type_params(false, true)?)
                    } else if is!(p, JSXTagStart) {
                        debug_assert_eq!(
                            p.input.token_context().current(),
                            Some(TokenContext::JSXOpeningTag)
                        );
                        p.input.token_context_mut().pop();
                        debug_assert_eq!(
                            p.input.token_context().current(),
                            Some(TokenContext::JSXExpr)
                        );
                        p.input.token_context_mut().pop();

                        Some(p.parse_ts_type_params(false, true)?)
                    } else {
                        None
                    })
                })?
            } else {
                None
            };

            expect!(p, '(');

            let arg_ctx = Context {
                in_parameters: true,
                in_function: false,
                in_async: is_async,
                in_generator: is_generator,
                ..p.ctx()
            };
            let params = p.with_ctx(arg_ctx).parse_with(|p| parse_args(p))?;

            expect!(p, ')');

            // typescript extension
            let return_type = if p.syntax().typescript() && is!(p, ':') {
                p.parse_ts_type_or_type_predicate_ann(&tok!(':'))
                    .map(Some)?
            } else {
                None
            };

            let body: Option<_> = p.parse_fn_body(
                is_async,
                is_generator,
                false,
                params.is_simple_parameter_list(),
            )?;

            if p.syntax().typescript() && body.is_none() {
                // Declare functions cannot have assignment pattern in parameters
                for param in &params {
                    // TODO: Search deeply for assignment pattern using a Visitor

                    let span = match &param.pat {
                        Pat::Assign(ref p) => Some(p.span()),
                        _ => None,
                    };

                    if let Some(span) = span {
                        p.emit_err(span, SyntaxError::TS2371)
                    }
                }
            }

            Ok(Box::new(Function {
                span: span!(p, start),
                decorators,
                type_params,
                params,
                body,
                is_async,
                is_generator,
                return_type,
                ctxt: Default::default(),
            }))
        })
    }

    fn parse_class_prop_name(&mut self) -> PResult<Key> {
        if is!(self, '#') {
            let name = self.parse_private_name()?;
            if name.name == "constructor" {
                self.emit_err(name.span, SyntaxError::PrivateConstructor);
            }
            Ok(Key::Private(name))
        } else {
            self.parse_prop_name().map(Key::Public)
        }
    }

    pub(super) fn parse_fn_body<T>(
        &mut self,
        is_async: bool,
        is_generator: bool,
        is_arrow_function: bool,
        is_simple_parameter_list: bool,
    ) -> PResult<T>
    where
        Self: FnBodyParser<T>,
    {
        if self.ctx().in_declare && self.syntax().typescript() && is!(self, '{') {
            //            self.emit_err(
            //                self.ctx().span_of_fn_name.expect("we are not in function"),
            //                SyntaxError::TS1183,
            //            );
            self.emit_err(self.input.cur_span(), SyntaxError::TS1183);
        }

        let ctx = Context {
            in_async: is_async,
            in_generator: is_generator,
            inside_non_arrow_function_scope: if is_arrow_function {
                self.ctx().inside_non_arrow_function_scope
            } else {
                true
            },
            in_function: true,
            in_static_block: false,
            is_break_allowed: false,
            is_continue_allowed: false,
            ..self.ctx()
        };
        let state = State {
            labels: Vec::new(),
            ..Default::default()
        };
        self.with_ctx(ctx)
            .with_state(state)
            .parse_fn_body_inner(is_simple_parameter_list)
    }
}

impl<I: Tokens> Parser<I> {
    fn make_method<F>(
        &mut self,
        parse_args: F,
        MakeMethodArgs {
            start,
            accessibility,
            is_abstract,
            static_token,
            decorators,
            is_optional,
            is_override,
            key,
            kind,
            is_async,
            is_generator,
        }: MakeMethodArgs,
    ) -> PResult<ClassMember>
    where
        F: FnOnce(&mut Self) -> PResult<Vec<Param>>,
    {
        trace_cur!(self, make_method);

        let is_static = static_token.is_some();
        let function = self
            .with_ctx(Context {
                allow_direct_super: true,
                in_class_field: false,
                ..self.ctx()
            })
            .parse_with(|p| {
                p.parse_fn_args_body(decorators, start, parse_args, is_async, is_generator)
            })?;

        match kind {
            MethodKind::Getter | MethodKind::Setter
                if self.input.syntax().typescript() && self.input.target() == EsVersion::Es3 =>
            {
                self.emit_err(key.span(), SyntaxError::TS1056);
            }
            _ => {}
        }

        match key {
            Key::Private(key) => {
                let span = span!(self, start);
                if accessibility.is_some() {
                    self.emit_err(span.with_hi(key.span_hi()), SyntaxError::TS18010);
                }

                Ok(PrivateMethod {
                    span,

                    accessibility,
                    is_abstract,
                    is_optional,
                    is_override,

                    is_static,
                    key,
                    function,
                    kind,
                }
                .into())
            }
            Key::Public(key) => {
                let span = span!(self, start);
                if is_abstract && function.body.is_some() {
                    self.emit_err(span, SyntaxError::TS1245)
                }
                Ok(ClassMethod {
                    span,

                    accessibility,
                    is_abstract,
                    is_optional,
                    is_override,

                    is_static,
                    key,
                    function,
                    kind,
                }
                .into())
            }
        }
    }
}

trait IsInvalidClassName {
    fn invalid_class_name(&self) -> Option<Span>;
}

impl IsInvalidClassName for Ident {
    fn invalid_class_name(&self) -> Option<Span> {
        match &*self.sym {
            "string" | "null" | "number" | "object" | "any" | "unknown" | "boolean" | "bigint"
            | "symbol" | "void" | "never" | "intrinsic" => Some(self.span),
            _ => None,
        }
    }
}
impl IsInvalidClassName for Option<Ident> {
    fn invalid_class_name(&self) -> Option<Span> {
        if let Some(i) = self.as_ref() {
            return i.invalid_class_name();
        }

        None
    }
}

trait OutputType: Sized {
    const IS_IDENT_REQUIRED: bool;

    /// From babel..
    ///
    /// When parsing function expression, the binding identifier is parsed
    /// according to the rules inside the function.
    /// e.g. (function* yield() {}) is invalid because "yield" is disallowed in
    /// generators.
    /// This isn't the case with function declarations: function* yield() {} is
    /// valid because yield is parsed as if it was outside the generator.
    /// Therefore, this.state.inGenerator is set before or after parsing the
    /// function id according to the "isStatement" parameter.
    fn is_fn_expr() -> bool {
        false
    }

    fn finish_fn(span: Span, ident: Option<Ident>, f: Box<Function>) -> Result<Self, SyntaxError>;

    fn finish_class(
        span: Span,
        ident: Option<Ident>,
        class: Box<Class>,
    ) -> Result<Self, SyntaxError>;
}

impl OutputType for Box<Expr> {
    const IS_IDENT_REQUIRED: bool = false;

    fn is_fn_expr() -> bool {
        true
    }

    fn finish_fn(
        _span: Span,
        ident: Option<Ident>,
        function: Box<Function>,
    ) -> Result<Self, SyntaxError> {
        Ok(FnExpr { ident, function }.into())
    }

    fn finish_class(
        _span: Span,
        ident: Option<Ident>,
        class: Box<Class>,
    ) -> Result<Self, SyntaxError> {
        Ok(ClassExpr { ident, class }.into())
    }
}

impl OutputType for ExportDefaultDecl {
    const IS_IDENT_REQUIRED: bool = false;

    fn finish_fn(
        span: Span,
        ident: Option<Ident>,
        function: Box<Function>,
    ) -> Result<Self, SyntaxError> {
        Ok(ExportDefaultDecl {
            span,
            decl: DefaultDecl::Fn(FnExpr { ident, function }),
        })
    }

    fn finish_class(
        span: Span,
        ident: Option<Ident>,
        class: Box<Class>,
    ) -> Result<Self, SyntaxError> {
        Ok(ExportDefaultDecl {
            span,
            decl: DefaultDecl::Class(ClassExpr { ident, class }),
        })
    }
}

impl OutputType for Decl {
    const IS_IDENT_REQUIRED: bool = true;

    fn finish_fn(
        _span: Span,
        ident: Option<Ident>,
        function: Box<Function>,
    ) -> Result<Self, SyntaxError> {
        let ident = ident.ok_or(SyntaxError::ExpectedIdent)?;

        Ok(FnDecl {
            declare: false,
            ident,
            function,
        }
        .into())
    }

    fn finish_class(_: Span, ident: Option<Ident>, class: Box<Class>) -> Result<Self, SyntaxError> {
        let ident = ident.ok_or(SyntaxError::ExpectedIdent)?;

        Ok(ClassDecl {
            declare: false,
            ident,
            class,
        }
        .into())
    }
}

pub(super) trait FnBodyParser<Body> {
    fn parse_fn_body_inner(&mut self, is_simple_parameter_list: bool) -> PResult<Body>;
}
fn has_use_strict(block: &BlockStmt) -> Option<Span> {
    block
        .stmts
        .iter()
        .take_while(|s| s.can_precede_directive())
        .find_map(|s| {
            if s.is_use_strict() {
                Some(s.span())
            } else {
                None
            }
        })
}
impl<I: Tokens> FnBodyParser<Box<BlockStmtOrExpr>> for Parser<I> {
    fn parse_fn_body_inner(
        &mut self,
        is_simple_parameter_list: bool,
    ) -> PResult<Box<BlockStmtOrExpr>> {
        if is!(self, '{') {
            self.parse_block(false)
                .map(|block_stmt| {
                    if !is_simple_parameter_list {
                        if let Some(span) = has_use_strict(&block_stmt) {
                            self.emit_err(span, SyntaxError::IllegalLanguageModeDirective);
                        }
                    }
                    BlockStmtOrExpr::BlockStmt(block_stmt)
                })
                .map(Box::new)
        } else {
            self.parse_assignment_expr()
                .map(BlockStmtOrExpr::Expr)
                .map(Box::new)
        }
    }
}

impl<I: Tokens> FnBodyParser<Option<BlockStmt>> for Parser<I> {
    fn parse_fn_body_inner(
        &mut self,
        is_simple_parameter_list: bool,
    ) -> PResult<Option<BlockStmt>> {
        // allow omitting body and allow placing `{` on next line
        if self.input.syntax().typescript() && !is!(self, '{') && eat!(self, ';') {
            return Ok(None);
        }
        let block = self.include_in_expr(true).parse_block(true);
        block.map(|block_stmt| {
            if !is_simple_parameter_list {
                if let Some(span) = has_use_strict(&block_stmt) {
                    self.emit_err(span, SyntaxError::IllegalLanguageModeDirective);
                }
            }
            Some(block_stmt)
        })
    }
}

pub(super) trait IsSimpleParameterList {
    fn is_simple_parameter_list(&self) -> bool;
}
impl IsSimpleParameterList for Vec<Param> {
    fn is_simple_parameter_list(&self) -> bool {
        self.iter().all(|param| matches!(param.pat, Pat::Ident(_)))
    }
}
impl IsSimpleParameterList for Vec<Pat> {
    fn is_simple_parameter_list(&self) -> bool {
        self.iter().all(|pat| matches!(pat, Pat::Ident(_)))
    }
}
impl IsSimpleParameterList for Vec<ParamOrTsParamProp> {
    fn is_simple_parameter_list(&self) -> bool {
        self.iter().all(|param| {
            matches!(
                param,
                ParamOrTsParamProp::TsParamProp(..)
                    | ParamOrTsParamProp::Param(Param {
                        pat: Pat::Ident(_),
                        ..
                    })
            )
        })
    }
}

fn is_constructor(key: &Key) -> bool {
    matches!(
        &key,
        Key::Public(PropName::Ident(IdentName {
            sym: constructor,
            ..
        })) | Key::Public(PropName::Str(Str {
            value: constructor,
            ..
        })) if &**constructor == "constructor"
    )
}

pub(crate) fn is_not_this(p: &Param) -> bool {
    !matches!(
        &p.pat,
        Pat::Ident(BindingIdent {
            id: Ident{ sym: this, .. },
            ..
        })if &**this == "this"
    )
}

struct MakeMethodArgs {
    start: BytePos,
    accessibility: Option<Accessibility>,
    is_abstract: bool,
    static_token: Option<Span>,
    decorators: Vec<Decorator>,
    is_optional: bool,
    is_override: bool,
    key: Key,
    kind: MethodKind,
    is_async: bool,
    is_generator: bool,
}

#[cfg(test)]
#[allow(unused)]
mod tests {

    use swc_common::DUMMY_SP as span;
    use swc_ecma_visit::assert_eq_ignore_span;

    use super::*;

    fn lhs(s: &'static str) -> Box<Expr> {
        test_parser(s, Syntax::default(), |p| p.parse_lhs_expr())
    }

    fn expr(s: &'static str) -> Box<Expr> {
        test_parser(s, Syntax::default(), |p| p.parse_expr())
    }

    #[test]
    fn class_expr() {
        assert_eq_ignore_span!(
            expr("(class extends a {})"),
            Box::new(Expr::Paren(ParenExpr {
                span,
                expr: Box::new(Expr::Class(ClassExpr {
                    ident: None,
                    class: Box::new(Class {
                        decorators: Vec::new(),
                        span,
                        body: Vec::new(),
                        super_class: Some(expr("a")),
                        implements: Vec::new(),
                        is_abstract: false,
                        ..Default::default()
                    }),
                })),
            }))
        );
    }
}
