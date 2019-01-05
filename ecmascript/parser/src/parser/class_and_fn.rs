use super::{ident::MaybeOptionalIdentParser, *};
use either::Either;
use swc_common::Spanned;

#[parser]
/// Parser for function expression and function declaration.
impl<'a, I: Input> Parser<'a, I> {
    pub(super) fn parse_async_fn_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        let start = cur_pos!();
        expect!("async");
        self.parse_fn(Some(start), vec![])
    }

    /// Parse function expression
    pub(super) fn parse_fn_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        self.parse_fn(None, vec![])
    }

    pub(super) fn parse_async_fn_decl(&mut self, decoraters: Vec<Decorator>) -> PResult<'a, Decl> {
        let start = cur_pos!();
        expect!("async");
        self.parse_fn(Some(start), decoraters)
    }

    pub(super) fn parse_fn_decl(&mut self, decoraters: Vec<Decorator>) -> PResult<'a, Decl> {
        self.parse_fn(None, decoraters)
    }

    pub(super) fn parse_default_async_fn(
        &mut self,
        decoraters: Vec<Decorator>,
    ) -> PResult<'a, ExportDefaultDecl> {
        let start = cur_pos!();
        expect!("async");
        self.parse_fn(Some(start), decoraters)
    }

    pub(super) fn parse_default_fn(
        &mut self,
        decoraters: Vec<Decorator>,
    ) -> PResult<'a, ExportDefaultDecl> {
        self.parse_fn(None, decoraters)
    }

    pub(super) fn parse_class_decl(&mut self, decoraters: Vec<Decorator>) -> PResult<'a, Decl> {
        self.parse_class(decoraters)
    }

    pub(super) fn parse_class_expr(&mut self) -> PResult<'a, Box<Expr>> {
        self.parse_class(vec![])
    }

    pub(super) fn parse_default_class(
        &mut self,
        decoraters: Vec<Decorator>,
    ) -> PResult<'a, ExportDefaultDecl> {
        self.parse_class(decoraters)
    }

    fn parse_class<T>(&mut self, decorators: Vec<Decorator>) -> PResult<'a, T>
    where
        T: OutputType,
        Self: MaybeOptionalIdentParser<'a, T::Ident>,
    {
        self.strict_mode().parse_with(|p| {
            let start = cur_pos!();
            expect!("class");

            let ident = p.parse_maybe_opt_binding_ident()?;
            let type_params = if p.input.syntax().typescript() {
                p.try_parse_ts_type_params()?
            } else {
                None
            };

            let (super_class, super_type_params) = if eat!("extends") {
                let super_class = p.parse_lhs_expr().map(Some)?;
                let super_type_params = if p.input.syntax().typescript() && is!('<') {
                    Some(p.parse_ts_type_args()?)
                } else {
                    None
                };
                (super_class, super_type_params)
            } else {
                (None, None)
            };

            let implements = if p.input.syntax().typescript() && eat!("implements") {
                p.parse_ts_heritage_clause()?
            } else {
                vec![]
            };

            expect!('{');
            let body = p.parse_class_body()?;
            expect!('}');
            let end = last_pos!();
            Ok(T::finish_class(
                ident,
                Class {
                    span: Span::new(start, end, Default::default()),
                    decorators,
                    is_abstract: false,
                    type_params,
                    super_class,
                    super_type_params,
                    body,
                    implements,
                },
            ))
        })
    }

    pub(super) fn parse_decorators(&mut self, allow_export: bool) -> PResult<'a, Vec<Decorator>> {
        if !self.syntax().decorators() {
            return Ok(vec![]);
        }

        let mut decorators = vec![];
        let start = cur_pos!();

        while is!('@') {
            decorators.push(self.parse_decorator()?);
        }
        if decorators.is_empty() {
            return Ok(decorators);
        }

        if is!("export") {
            if !allow_export {
                unexpected!();
            }

            if !self.syntax().decorators_before_export() {
                syntax_error!(span!(start), SyntaxError::DecoratorOnExport);
            }
        } else if !is!("class") {
            // syntax_error!(span!(start), SyntaxError::InvalidLeadingDecorator)
        }

        Ok(decorators)
    }

    fn parse_decorator(&mut self) -> PResult<'a, Decorator> {
        let start = cur_pos!();

        assert_and_bump!('@');

        let expr = if eat!('(') {
            let expr = self.parse_expr()?;
            expect!(')');
            expr
        } else {
            let mut expr = self
                .parse_ident(false, false)
                .map(Expr::from)
                .map(Box::new)?;

            while eat!('.') {
                let ident = self.parse_ident(true, true)?;

                expr = box Expr::Member(MemberExpr {
                    span: span!(start),
                    obj: ExprOrSuper::Expr(expr),
                    computed: false,
                    prop: box Expr::Ident(ident),
                })
            }

            expr
        };

        let expr = self.parse_maybe_decorator_args(expr)?;

        Ok(Decorator {
            span: span!(start),
            expr,
        })
    }

    fn parse_maybe_decorator_args(&mut self, expr: Box<Expr>) -> PResult<'a, Box<Expr>> {
        let type_args = if self.input.syntax().typescript() && is!('<') {
            Some(self.parse_ts_type_args()?)
        } else {
            None
        };

        if type_args.is_none() && !is!('(') {
            return Ok(expr);
        }

        let args = self.parse_args()?;
        Ok(box Expr::Call(CallExpr {
            span: span!(expr.span().lo()),
            callee: ExprOrSuper::Expr(expr),
            args,
            type_args: None,
        }))
    }

    fn parse_class_body(&mut self) -> PResult<'a, Vec<ClassMember>> {
        let mut elems = vec![];
        while !eof!() && !is!('}') {
            if eat_exact!(';') {
                continue;
            }

            elems.push(self.parse_class_member()?);
        }
        Ok(elems)
    }

    pub(super) fn parse_access_modifier(&mut self) -> PResult<'a, Option<Accessibility>> {
        Ok(self
            .parse_ts_modifier(&["public", "protected", "private"])?
            .map(|s| match s {
                "public" => Accessibility::Public,
                "protected" => Accessibility::Protected,
                "private" => Accessibility::Private,
                _ => unreachable!(),
            }))
    }

    fn parse_class_member(&mut self) -> PResult<'a, ClassMember> {
        let decorators = self.parse_decorators(false)?;

        let start = cur_pos!();

        let accessibility = if self.input.syntax().typescript() {
            self.parse_access_modifier()?
        } else {
            None
        };

        let static_token = {
            let start = cur_pos!();
            if eat!("static") {
                Some(span!(start))
            } else {
                None
            }
        };

        if let Some(static_token) = static_token {
            // Handle static(){}
            if self.is_class_method()? {
                let key = Either::Right(PropName::Ident(Ident::new(
                    js_word!("static"),
                    static_token,
                )));
                let is_optional = self.input.syntax().typescript() && eat!('?');
                return self.make_method(
                    |p| p.parse_unique_formal_params(),
                    MakeMethodArgs {
                        start,
                        accessibility,
                        decorators,
                        is_abstract: false,
                        is_optional,
                        is_async: false,
                        is_generator: false,
                        is_static: false,
                        key,
                        kind: MethodKind::Method,
                    },
                );
            } else if self.is_class_property()? {
                // Property named `static`

                let key = Either::Right(PropName::Ident(Ident::new(
                    js_word!("static"),
                    static_token,
                )));
                let is_optional = self.input.syntax().typescript() && eat!('?');
                return self.make_property(
                    start,
                    decorators,
                    accessibility,
                    key,
                    false,
                    is_optional,
                    false,
                    false,
                );
            } else {
                // TODO: error if static contains escape
            }
        }

        self.parse_class_member_with_is_static(accessibility, static_token, decorators)
    }

    fn parse_class_member_with_is_static(
        &mut self,
        accessibility: Option<Accessibility>,
        static_token: Option<Span>,
        decorators: Vec<Decorator>,
    ) -> PResult<'a, ClassMember> {
        let is_static = static_token.is_some();
        let start = static_token.map(|s| s.lo()).unwrap_or(cur_pos!());

        let modifier = self.parse_ts_modifier(&["abstract", "readonly"])?;
        let (is_abstract, readonly) = match modifier {
            Some("abstract") => (true, self.parse_ts_modifier(&["readonly"])?.is_some()),
            Some("readonly") => (self.parse_ts_modifier(&["abstract"])?.is_some(), true),
            _ => (false, false),
        };

        if self.input.syntax().typescript() && !is_abstract && !is_static && accessibility.is_none()
        {
            let idx = self.try_parse_ts_index_signature(start, readonly)?;
            if let Some(idx) = idx {
                return Ok(idx.into());
            }
        }

        if eat!('*') {
            // generator method
            let key = self.parse_class_prop_name()?;
            if readonly {
                syntax_error!(span!(start), SyntaxError::ReadOnlyMethod);
            }
            if is_constructor(&key) {
                unexpected!();
            }
            return self.make_method(
                Parser::parse_unique_formal_params,
                MakeMethodArgs {
                    start,
                    decorators,
                    is_async: false,
                    is_generator: true,
                    accessibility,
                    is_abstract,
                    is_optional: false,
                    is_static,
                    key,
                    kind: MethodKind::Method,
                },
            );
        }

        let key = self.parse_class_prop_name()?;

        let is_private = match key {
            Either::Left(PrivateName { .. }) => true,
            _ => false,
        };
        let is_simple = match key {
            Either::Right(PropName::Ident(..)) => true,
            _ => false,
        };
        let is_optional = self.input.syntax().typescript() && eat!('?');

        if self.is_class_method()? {
            // handle a(){} / get(){} / set(){} / async(){}

            if readonly {
                syntax_error!(span!(start), SyntaxError::ReadOnlyMethod);
            }
            let is_constructor = is_constructor(&key);

            // TODO: check for duplicate constructors
            return self.make_method(
                |p| {
                    if is_constructor {
                        p.parse_constructor_params()
                    } else {
                        p.parse_formal_params()
                    }
                },
                MakeMethodArgs {
                    start,
                    is_optional,
                    accessibility,
                    decorators,
                    is_abstract,
                    is_static,
                    kind: if is_constructor {
                        MethodKind::Constructor
                    } else {
                        MethodKind::Method
                    },
                    key,
                    is_async: false,
                    is_generator: false,
                },
            );
        }

        if self.is_class_property()? {
            return self.make_property(
                start,
                decorators,
                accessibility,
                key,
                is_static,
                is_optional,
                false,
                is_abstract,
            );
        }

        if match key {
            Either::Right(PropName::Ident(ref i)) => i.sym == js_word!("async"),
            _ => false,
        } && !self.input.had_line_break_before_cur()
        {
            // handle async foo(){}

            let is_generator = eat!('*');
            let key = self.parse_class_prop_name()?;
            if is_constructor(&key) {
                syntax_error!(key.span(), SyntaxError::AsyncConstructor)
            }
            if readonly {
                syntax_error!(span!(start), SyntaxError::ReadOnlyMethod);
            }

            // handle async foo(){}
            return self.make_method(
                |p| p.parse_unique_formal_params(),
                MakeMethodArgs {
                    start,
                    is_static,
                    key,
                    is_abstract,
                    accessibility,
                    is_optional,
                    decorators,
                    kind: MethodKind::Method,
                    is_async: true,
                    is_generator,
                },
            );
        }

        let is_next_line_generator = self.input.had_line_break_before_cur() && is!('*');
        match key {
            // `get\n*` is an uninitialized property named 'get' followed by a generator.
            Either::Right(PropName::Ident(ref i))
                if (i.sym == js_word!("get") || i.sym == js_word!("set"))
                    && !is_next_line_generator =>
            {
                // handle get foo(){} / set foo(v){}
                let key = self.parse_class_prop_name()?;

                if readonly {
                    unexpected!()
                }

                return match i.sym {
                    js_word!("get") => self.make_method(
                        |_| Ok(vec![]),
                        MakeMethodArgs {
                            decorators,
                            start,
                            is_abstract,
                            is_async: false,
                            is_generator: false,
                            is_optional,
                            accessibility,
                            is_static,
                            key,
                            kind: MethodKind::Getter,
                        },
                    ),
                    js_word!("set") => self.make_method(
                        |p| p.parse_formal_param().map(|pat| vec![pat]),
                        MakeMethodArgs {
                            decorators,
                            start,
                            is_optional,
                            is_abstract,
                            is_async: false,
                            is_generator: false,
                            accessibility,
                            is_static,
                            key,
                            kind: MethodKind::Setter,
                        },
                    ),
                    _ => unreachable!(),
                };
            }
            _ => {}
        }

        unexpected!()
    }

    fn make_property(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
        accessibility: Option<Accessibility>,
        key: Either<PrivateName, PropName>,
        is_static: bool,
        is_optional: bool,
        readonly: bool,
        is_abstract: bool,
    ) -> PResult<'a, ClassMember> {
        if is_constructor(&key) {
            syntax_error!(key.span(), SyntaxError::PropertyNamedConstructor);
        }
        let definite = self.input.syntax().typescript() && !is_optional && eat!('!');

        let type_ann = self.try_parse_ts_type_ann()?;

        let ctx = Context {
            in_class_prop: true,
            in_method: false,
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_with(|p| {
            let value = if is!('=') {
                if !p.input.syntax().class_props() {
                    syntax_error!(span!(start), SyntaxError::ClassProperty);
                }
                assert_and_bump!('=');
                Some(p.parse_assignment_expr()?)
            } else {
                None
            };

            expect!(';');

            Ok(match key {
                Either::Left(key) => ClassProperty {
                    span: span!(start),
                    key,
                    value,
                    is_static,
                    decorators,
                    accessibility,
                    is_abstract,
                    is_optional,
                    readonly,
                    definite,
                    type_ann,
                }
                .into(),
                Either::Right(key) => ClassProperty {
                    span: span!(start),
                    key: match key {
                        PropName::Ident(i) => box Expr::Ident(i),
                        PropName::Str(s) => box Expr::Lit(Lit::Str(s)),
                        PropName::Num(n) => box Expr::Lit(Lit::Num(n)),
                        PropName::Computed(e) => e,
                    },
                    value,
                    is_static,
                    decorators,
                    accessibility,
                    is_abstract,
                    is_optional,
                    readonly,
                    definite,
                    type_ann,
                }
                .into(),
            })
        })
    }

    #[inline(always)]
    fn is_class_method(&mut self) -> PResult<'a, bool> {
        Ok(is!('(') || (self.input.syntax().typescript() && is!('<')))
    }

    #[inline(always)]
    fn is_class_property(&mut self) -> PResult<'a, bool> {
        Ok((self.input.syntax().typescript() && is_one_of!('!', ':')) || is_one_of!('=', ';', '}'))
    }

    fn parse_fn<T>(
        &mut self,
        start_of_async: Option<BytePos>,
        decorators: Vec<Decorator>,
    ) -> PResult<'a, T>
    where
        T: OutputType,
        Self: MaybeOptionalIdentParser<'a, T::Ident>,
    {
        let start = start_of_async.unwrap_or(cur_pos!());
        assert_and_bump!("function");
        let is_async = start_of_async.is_some();

        let is_generator = {
            let start = cur_pos!();
            if eat!('*') {
                if is_async {
                    syntax_error!(span!(start), SyntaxError::AsyncGenerator {});
                }
                true
            } else {
                false
            }
        };

        let ctx = Context {
            in_async: is_async,
            in_generator: is_generator,
            ..self.ctx()
        };

        let ident = if T::is_fn_expr() {
            //
            self.with_ctx(ctx).parse_maybe_opt_binding_ident()?
        } else {
            // function declaration does not change context for `BindingIdentifier`.
            self.parse_maybe_opt_binding_ident()?
        };
        let is_constructor = T::is_constructor(&ident);

        self.with_ctx(ctx).parse_with(|p| {
            let f = p.parse_fn_args_body(
                is_constructor,
                decorators,
                start,
                |p| {
                    if is_constructor {
                        p.parse_formal_params()
                    } else {
                        p.parse_constructor_params()
                    }
                },
                is_async,
                is_generator,
            )?;
            // expect!('(');
            // let params_ctx = Context {
            //     in_parameters: true,
            //     ..p.ctx()
            // };
            // let params = p.with_ctx(params_ctx).parse_formal_params()?;
            // expect!(')');

            // let body = p.parse_fn_body(is_async, is_generator)?;

            Ok(T::finish_fn(ident, f))
        })
    }

    /// `parse_args` closure should not eat '(' or ')'.
    pub(super) fn parse_fn_args_body<F>(
        &mut self,
        is_constructor: bool,
        decorators: Vec<Decorator>,
        start: BytePos,
        parse_args: F,
        is_async: bool,
        is_generator: bool,
    ) -> PResult<'a, Function>
    where
        F: FnOnce(&mut Self) -> PResult<'a, Vec<PatOrTsParamProp>>,
    {
        let ctx = Context {
            in_async: is_async,
            in_generator: is_generator,
            ..self.ctx()
        };

        self.with_ctx(ctx).parse_with(|p| {
            let type_params = if p.syntax().typescript() && is!('<') {
                //
                Some(p.parse_ts_type_params()?)
            } else {
                None
            };

            expect!('(');

            let arg_ctx = Context {
                in_parameters: true,
                ..p.ctx()
            };
            let params = p.with_ctx(arg_ctx).parse_with(|mut p| parse_args(&mut p))?;

            expect!(')');

            // typescript extension
            let return_type = if p.syntax().typescript() && is!(':') {
                p.parse_ts_type_or_type_predicate_ann(&tok!(':'))
                    .map(Some)?
            } else {
                None
            };

            let body = p.parse_fn_body(is_async, is_generator)?;

            Ok(Function {
                span: span!(start),
                decorators,
                type_params,
                params,
                body,
                is_async,
                is_generator,
                return_type,
            })
        })
    }

    fn parse_class_prop_name(&mut self) -> PResult<'a, Either<PrivateName, PropName>> {
        if is!('#') {
            self.parse_private_name().map(Either::Left)
        } else {
            self.parse_prop_name().map(Either::Right)
        }
    }

    fn make_method<F>(
        &mut self,
        parse_args: F,
        MakeMethodArgs {
            start,
            accessibility,
            is_abstract,
            is_static,
            decorators,
            is_optional,
            key,
            kind,
            is_async,
            is_generator,
        }: MakeMethodArgs,
    ) -> PResult<'a, ClassMember>
    where
        F: FnOnce(&mut Self) -> PResult<'a, Vec<PatOrTsParamProp>>,
    {
        let function = self.parse_fn_args_body(
            kind == MethodKind::Constructor,
            decorators,
            start,
            parse_args,
            is_async,
            is_generator,
        )?;

        match key {
            Either::Left(key) => Ok(ClassMethod {
                span: span!(start),

                accessibility,
                is_abstract,
                is_optional,

                is_static,
                key,
                function,
                kind,
            }
            .into()),
            Either::Right(key) => Ok(ClassMethod {
                span: span!(start),

                accessibility,
                is_abstract,
                is_optional,

                is_static,
                key,
                function,
                kind: MethodKind::Method,
            }
            .into()),
        }
    }

    pub(super) fn parse_fn_body<T>(&mut self, is_async: bool, is_generator: bool) -> PResult<'a, T>
    where
        Self: FnBodyParser<'a, T>,
    {
        let ctx = Context {
            in_async: is_async,
            in_generator: is_generator,
            in_function: true,
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_fn_body_inner()
    }
}

trait OutputType {
    type Ident;

    fn is_constructor(ident: &Self::Ident) -> bool;

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

    fn finish_fn(ident: Self::Ident, f: Function) -> Self;
    fn finish_class(ident: Self::Ident, class: Class) -> Self;
}

impl OutputType for Box<Expr> {
    type Ident = Option<Ident>;

    fn is_constructor(ident: &Self::Ident) -> bool {
        match *ident {
            Some(ref i) => i.sym == js_word!("constructor"),
            _ => false,
        }
    }

    fn is_fn_expr() -> bool {
        true
    }

    fn finish_fn(ident: Option<Ident>, function: Function) -> Self {
        box Expr::Fn(FnExpr { ident, function })
    }
    fn finish_class(ident: Option<Ident>, class: Class) -> Self {
        box Expr::Class(ClassExpr { ident, class })
    }
}

impl OutputType for ExportDefaultDecl {
    type Ident = Option<Ident>;

    fn is_constructor(ident: &Self::Ident) -> bool {
        match *ident {
            Some(ref i) => i.sym == js_word!("constructor"),
            _ => false,
        }
    }

    fn finish_fn(ident: Option<Ident>, function: Function) -> Self {
        ExportDefaultDecl::Fn(FnExpr { ident, function })
    }
    fn finish_class(ident: Option<Ident>, class: Class) -> Self {
        ExportDefaultDecl::Class(ClassExpr { ident, class })
    }
}

impl OutputType for Decl {
    type Ident = Ident;

    fn is_constructor(i: &Self::Ident) -> bool {
        i.sym == js_word!("constructor")
    }

    fn finish_fn(ident: Ident, function: Function) -> Self {
        Decl::Fn(FnDecl {
            declare: false,
            ident,
            function,
        })
    }
    fn finish_class(ident: Ident, class: Class) -> Self {
        Decl::Class(ClassDecl {
            declare: false,
            ident,
            class,
        })
    }
}

pub(super) trait FnBodyParser<'a, Body> {
    fn parse_fn_body_inner(&mut self) -> PResult<'a, Body>;
}

#[parser]
impl<'a, I: Input> FnBodyParser<'a, BlockStmtOrExpr> for Parser<'a, I> {
    fn parse_fn_body_inner(&mut self) -> PResult<'a, BlockStmtOrExpr> {
        if is!('{') {
            self.parse_block(false).map(BlockStmtOrExpr::BlockStmt)
        } else {
            self.parse_assignment_expr().map(BlockStmtOrExpr::Expr)
        }
    }
}

#[parser]
impl<'a, I: Input> FnBodyParser<'a, Option<BlockStmt>> for Parser<'a, I> {
    fn parse_fn_body_inner(&mut self) -> PResult<'a, Option<BlockStmt>> {
        // allow omitting body and allow placing `{` on next line
        if self.input.syntax().typescript() && !is!('{') && eat!(';') {
            return Ok(None);
        }
        self.parse_block(true).map(Some)
    }
}

fn is_constructor(key: &Either<PrivateName, PropName>) -> bool {
    match *key {
        Either::Right(PropName::Ident(Ident {
            sym: js_word!("constructor"),
            ..
        }))
        | Either::Right(PropName::Str(Str {
            value: js_word!("constructor"),
            ..
        })) => true,
        _ => false,
    }
}

struct MakeMethodArgs {
    start: BytePos,
    accessibility: Option<Accessibility>,
    is_abstract: bool,
    is_static: bool,
    decorators: Vec<Decorator>,
    is_optional: bool,
    key: Either<PrivateName, PropName>,
    kind: MethodKind,
    is_async: bool,
    is_generator: bool,
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::DUMMY_SP as span;

    fn lhs(s: &'static str) -> Box<Expr> {
        test_parser(s, Syntax::Es, |p| {
            p.parse_lhs_expr().map_err(|e| {
                e.emit();
                ()
            })
        })
    }

    fn expr(s: &'static str) -> Box<Expr> {
        test_parser(s, Syntax::Es, |p| {
            p.parse_expr().map_err(|e| {
                e.emit();
                ()
            })
        })
    }

    #[test]
    fn class_expr() {
        assert_eq_ignore_span!(
            expr("(class extends a {})"),
            box Expr::Paren(ParenExpr {
                span,
                expr: box Expr::Class(ClassExpr {
                    ident: None,
                    class: Class {
                        decorators: vec![],
                        span,
                        body: vec![],
                        super_class: Some(expr("a")),
                        implements: vec![],
                        is_abstract: false,
                        super_type_params: None,
                        type_params: None,
                    },
                }),
            })
        );
    }
}
