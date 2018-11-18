//! Parser for function expression and function declaration.

use super::{ident::MaybeOptionalIdentParser, *};

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    pub(super) fn parse_async_fn_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        let start = cur_pos!();
        expect!("async");
        self.parse_fn(Some(start))
    }

    /// Parse function expression
    pub(super) fn parse_fn_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        self.parse_fn(None)
    }

    pub(super) fn parse_async_fn_decl(&mut self) -> PResult<'a, Decl> {
        let start = cur_pos!();
        expect!("async");
        self.parse_fn(Some(start))
    }

    pub(super) fn parse_fn_decl(&mut self) -> PResult<'a, Decl> {
        self.parse_fn(None)
    }

    pub(super) fn parse_default_async_fn(&mut self) -> PResult<'a, ExportDefaultDecl> {
        let start = cur_pos!();
        expect!("async");
        self.parse_fn(Some(start))
    }

    pub(super) fn parse_default_fn(&mut self) -> PResult<'a, ExportDefaultDecl> {
        self.parse_fn(None)
    }

    pub(super) fn parse_class_decl(&mut self) -> PResult<'a, Decl> {
        self.parse_class()
    }

    pub(super) fn parse_class_expr(&mut self) -> PResult<'a, (Box<Expr>)> {
        self.parse_class()
    }

    pub(super) fn parse_default_class(&mut self) -> PResult<'a, ExportDefaultDecl> {
        self.parse_class()
    }

    fn parse_class<T>(&mut self) -> PResult<'a, T>
    where
        T: OutputType,
        Self: MaybeOptionalIdentParser<'a, T::Ident>,
    {
        self.strict_mode().parse_with(|p| {
            let start = cur_pos!();
            expect!("class");

            let ident = p.parse_maybe_opt_binding_ident()?;

            let super_class = if eat!("extends") {
                p.parse_lhs_expr().map(Some)?
            } else {
                None
            };

            expect!('{');
            let body = p.parse_class_body()?;
            expect!('}');
            let end = last_pos!();
            Ok(T::finish_class(
                ident,
                Class {
                    span: Span::new(start, end, Default::default()),
                    super_class,
                    body,
                },
            ))
        })
    }

    fn parse_class_body(&mut self) -> PResult<'a, (Vec<ClassMethod>)> {
        let mut elems = vec![];
        while !eof!() && !is!('}') {
            if eat_exact!(';') {
                continue;
            }

            elems.push(self.parse_class_element()?);
        }
        Ok(elems)
    }

    fn parse_class_element(&mut self) -> PResult<'a, ClassMethod> {
        // ignore semi

        let static_token = {
            let start = cur_pos!();
            if eat!("static") {
                Some(span!(start))
            } else {
                None
            }
        };

        let mut mtd = self.parse_method_def(static_token)?;

        match mtd.key {
            PropName::Ident(Ident {
                sym: js_word!("constructor"),
                ..
            })
            | PropName::Str(Str {
                value: js_word!("constructor"),
                ..
            }) => {
                mtd.kind = ClassMethodKind::Constructor;
            }
            _ => {}
        }

        Ok(mtd)
    }

    fn parse_fn<T>(&mut self, start_of_async: Option<BytePos>) -> PResult<'a, T>
    where
        T: OutputType,
        Self: MaybeOptionalIdentParser<'a, T::Ident>,
    {
        let start = start_of_async.unwrap_or(cur_pos!());
        assert_and_bump!("function");
        let async = start_of_async.map(|start| span!(start));

        let generator = {
            let start = cur_pos!();
            if eat!('*') {
                if async.is_some() {
                    syntax_error!(span!(start), SyntaxError::AsyncGenerator {});
                }
                Some(span!(start))
            } else {
                None
            }
        };

        let ctx = Context {
            in_async: async.is_some(),
            in_generator: generator.is_some(),
            ..self.ctx()
        };

        let ident = if T::is_fn_expr() {
            //
            self.with_ctx(ctx).parse_maybe_opt_binding_ident()?
        } else {
            // function declaration does not change context for `BindingIdentifier`.
            self.parse_maybe_opt_binding_ident()?
        };

        self.with_ctx(ctx).parse_with(|p| {
            expect!('(');
            let params_ctx = Context {
                in_parameters: true,
                ..p.ctx()
            };
            let params = p.with_ctx(params_ctx).parse_formal_params()?;
            expect!(')');

            let body = p.parse_fn_body(async.is_some(), generator.is_some())?;

            Ok(T::finish_fn(
                ident,
                Function {
                    span: span!(start),
                    async,
                    generator,
                    params,
                    body,
                },
            ))
        })
    }

    /// `parse_args` closure should not eat '(' or ')'.
    pub(super) fn parse_fn_args_body<F>(
        &mut self,
        start: BytePos,
        parse_args: F,
        async: Option<Span>,
        generator: Option<Span>,
    ) -> PResult<'a, Function>
    where
        F: FnOnce(&mut Self) -> PResult<'a, (Vec<Pat>)>,
    {
        let ctx = Context {
            in_async: async.is_some(),
            in_generator: generator.is_some(),
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_with(|p| {
            expect!('(');

            let arg_ctx = Context {
                in_parameters: true,
                ..p.ctx()
            };
            let params = p.with_ctx(arg_ctx).parse_with(|mut p| parse_args(&mut p))?;

            expect!(')');

            let body = p.parse_fn_body(async.is_some(), generator.is_some())?;

            Ok(Function {
                span: span!(start),
                params,
                body,
                async,
                generator,
            })
        })
    }

    fn parse_method_def(&mut self, static_token: Option<Span>) -> PResult<'a, ClassMethod> {
        let is_static = static_token.is_some();
        let start = static_token.map(|s| s.lo()).unwrap_or(cur_pos!());

        if eat!('*') {
            let span_of_gen = span!(start);
            let key = self.parse_prop_name()?;
            return self
                .parse_fn_args_body(
                    start,
                    Parser::parse_unique_formal_params,
                    None,
                    Some(span_of_gen),
                )
                .map(|function| ClassMethod {
                    span: span!(start),
                    static_token,
                    key,
                    function,
                    kind: ClassMethodKind::Method,
                });
        }

        // Handle static(){}
        if let Some(static_token) = static_token {
            if is!('(') {
                return self
                    .parse_fn_args_body(start, Parser::parse_unique_formal_params, None, None)
                    .map(|function| ClassMethod {
                        span: span!(start),
                        static_token: None,
                        key: PropName::Ident(Ident {
                            span: static_token,
                            sym: js_word!("static"),
                        }),
                        function,
                        kind: ClassMethodKind::Method,
                    });
            }
        }

        let key = self.parse_prop_name()?;

        // Handle `a(){}` (and async(){} / get(){} / set(){})
        if is!('(') {
            return self
                .parse_fn_args_body(start, Parser::parse_unique_formal_params, None, None)
                .map(|function| ClassMethod {
                    span: span!(start),
                    static_token,
                    key,
                    function,
                    kind: ClassMethodKind::Method,
                });
        }

        let ident = match key {
            PropName::Ident(ident) => ident,
            _ => unexpected!(),
        };

        // get a(){}
        // set a(v){}
        // async a(){}

        match ident.sym {
            js_word!("get") | js_word!("set") | js_word!("async") => {
                let key = self.parse_prop_name()?;

                return match ident.sym {
                    js_word!("get") => self
                        .parse_fn_args_body(start, |_| Ok(vec![]), None, None)
                        .map(|function| ClassMethod {
                            span: span!(start),
                            static_token,
                            key,
                            function,
                            kind: ClassMethodKind::Getter,
                        }),
                    js_word!("set") => self
                        .parse_fn_args_body(
                            start,
                            |p| p.parse_formal_param().map(|pat| vec![pat]),
                            None,
                            None,
                        )
                        .map(|function| ClassMethod {
                            span: span!(start),
                            key,
                            static_token,
                            function,
                            kind: ClassMethodKind::Setter,
                        }),
                    js_word!("async") => self
                        .parse_fn_args_body(
                            start,
                            Parser::parse_unique_formal_params,
                            Some(ident.span),
                            None,
                        )
                        .map(|function| ClassMethod {
                            span: span!(start),
                            static_token,
                            key,
                            function,
                            kind: ClassMethodKind::Method,
                        }),
                    _ => unreachable!(),
                };
            }
            _ => unexpected!(),
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

    fn finish_fn(ident: Option<Ident>, function: Function) -> Self {
        ExportDefaultDecl::Fn(FnExpr { ident, function })
    }
    fn finish_class(ident: Option<Ident>, class: Class) -> Self {
        ExportDefaultDecl::Class(ClassExpr { ident, class })
    }
}

impl OutputType for Decl {
    type Ident = Ident;

    fn finish_fn(ident: Ident, function: Function) -> Self {
        Decl::Fn(FnDecl { ident, function })
    }
    fn finish_class(ident: Ident, class: Class) -> Self {
        Decl::Class(ClassDecl { ident, class })
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

impl<'a, I: Input> FnBodyParser<'a, BlockStmt> for Parser<'a, I> {
    fn parse_fn_body_inner(&mut self) -> PResult<'a, BlockStmt> {
        self.parse_block(true)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::DUMMY_SP;

    fn lhs(s: &'static str) -> Box<Expr> {
        test_parser(s, |p| {
            p.parse_lhs_expr()
                .unwrap_or_else(|()| unreachable!("failed to parse a left-hand-side expression"))
        })
    }

    fn expr(s: &'static str) -> Box<Expr> {
        test_parser(s, |p| {
            p.parse_expr()
                .unwrap_or_else(|()| unreachable!("failed to parse an expression"))
        })
    }

    #[allow(non_upper_case_globals)]
    const span: Span = DUMMY_SP;

    #[test]
    fn class_expr() {
        assert_eq_ignore_span!(
            expr("(class extends a {})"),
            box Expr::Paren(ParenExpr {
                span,
                expr: box Expr::Class(ClassExpr {
                    ident: None,
                    class: Class {
                        span,
                        body: vec![],
                        super_class: Some(expr("a")),
                    },
                }),
            })
        );
    }
}
