//! Parser for function expression and function declaration.

use super::*;
use super::ident::MaybeOptionalIdentParser;

#[parser]
impl<I: Input> Parser<I> {
    pub(super) fn parse_async_fn_expr(&mut self) -> PResult<Box<Expr>> {
        let start = cur_pos!();
        expect!("async");
        self.parse_fn(Some(start))
    }

    /// Parse function expression
    pub(super) fn parse_fn_expr(&mut self) -> PResult<Box<Expr>> {
        self.parse_fn(None)
    }

    pub(super) fn parse_async_fn_decl(&mut self) -> PResult<Decl> {
        let start = cur_pos!();
        expect!("async");
        self.parse_fn(Some(start))
    }

    pub(super) fn parse_fn_decl(&mut self) -> PResult<Decl> {
        self.parse_fn(None)
    }

    pub(super) fn parse_default_async_fn(&mut self) -> PResult<ExportDefaultDecl> {
        let start = cur_pos!();
        expect!("async");
        self.parse_fn(Some(start))
    }

    pub(super) fn parse_default_fn(&mut self) -> PResult<ExportDefaultDecl> {
        self.parse_fn(None)
    }

    pub(super) fn parse_class_decl(&mut self) -> PResult<Decl> {
        self.parse_class()
    }

    pub(super) fn parse_class_expr(&mut self) -> PResult<Box<Expr>> {
        self.parse_class()
    }

    pub(super) fn parse_default_class(&mut self) -> PResult<ExportDefaultDecl> {
        self.parse_class()
    }

    fn parse_class<T>(&mut self) -> PResult<T>
    where
        T: OutputType,
        Self: MaybeOptionalIdentParser<T::Ident>,
    {
        let start = cur_pos!();
        expect!("class");

        let ident = self.parse_maybe_opt_binding_ident()?;

        let super_class = if eat!("extends") {
            self.parse_lhs_expr().map(Some)?
        } else {
            None
        };

        expect!('{');
        let body = self.parse_class_body()?;
        expect!('}');
        let end = last_pos!();
        Ok(T::finish_class(
            ident,
            Class {
                span: Span { start, end },
                super_class,
                body,
            },
        ))
    }

    fn parse_class_body(&mut self) -> PResult<Vec<ClassMethod>> {
        let mut elems = vec![];
        while !eof!() && !is!('}') {
            if eat_exact!(';') {
                continue;
            }

            elems.push(self.parse_class_element()?);
        }
        Ok(elems)
    }

    fn parse_class_element(&mut self) -> PResult<ClassMethod> {
        // ignore semi

        let start_of_static = {
            let pos = cur_pos!();
            if eat!("static") {
                Some(pos)
            } else {
                None
            }
        };

        self.parse_method_def(start_of_static)
    }

    fn parse_fn<T>(&mut self, start_of_async: Option<BytePos>) -> PResult<T>
    where
        T: OutputType,
        Self: MaybeOptionalIdentParser<T::Ident>,
    {
        let start = start_of_async.unwrap_or(cur_pos!());
        assert_and_bump!("function");
        let is_async = start_of_async.is_some();

        if is_async && is!('*') {
            syntax_error!(SyntaxError::AsyncGenerator);
        }

        //TODO: Proper handling

        let is_generator = eat!('*');

        let ident = self.parse_maybe_opt_binding_ident()?;

        expect!('(');
        let params = self.parse_formal_params()?;
        expect!(')');

        let body = self.parse_fn_body(is_async, is_generator)?;

        Ok(T::finish_fn(
            ident,
            Function {
                span: Span {
                    start,
                    end: last_pos!(),
                },

                is_async,
                is_generator,
                params,
                body,
            },
        ))
    }

    /// `parse_args` closure should not eat '(' or ')'.
    pub(super) fn parse_fn_args_body<F>(
        &mut self,
        start: BytePos,
        parse_args: F,
        is_async: bool,
        is_generator: bool,
    ) -> PResult<Function>
    where
        F: FnOnce(&mut Self) -> PResult<Vec<Pat>>,
    {
        self.with_ctx(Context {
            in_async: is_async,
            in_generator: is_generator,
            ..self.ctx
        }).parse_with(|mut p| {
            expect!(p, '(');

            let params = parse_args(&mut p)?;

            expect!(p, ')');

            let body = p.parse_fn_body(is_async, is_generator)?;

            Ok(Function {
                span: span!(p, start),
                params,
                body,
                is_async,
                is_generator,
            })
        })
    }

    fn parse_method_def(&mut self, start_of_static: Option<BytePos>) -> PResult<ClassMethod> {
        let is_static = start_of_static.is_some();
        let start = start_of_static.unwrap_or(cur_pos!());

        if eat!('*') {
            let key = self.parse_prop_name()?;
            return self.parse_fn_args_body(start, Parser::parse_unique_formal_params, false, true)
                .map(|function| ClassMethod {
                    is_static,
                    key,
                    function,
                    kind: ClassMethodKind::Method,
                });
        }

        // Handle static(){}
        if let Some(start_of_static) = start_of_static {
            if is!('(') {
                let span_of_static = span!(start_of_static);
                return self.parse_fn_args_body(
                    start,
                    Parser::parse_unique_formal_params,
                    false,
                    false,
                ).map(|function| ClassMethod {
                    is_static: false,
                    key: PropName::Ident(Ident {
                        span: span_of_static,
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
            return self.parse_fn_args_body(start, Parser::parse_unique_formal_params, false, false)
                .map(|function| ClassMethod {
                    is_static,
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
                    js_word!("get") => self.parse_fn_args_body(start, |_| Ok(vec![]), false, false)
                        .map(|function| ClassMethod {
                            is_static,
                            key,
                            function,
                            kind: ClassMethodKind::Getter,
                        }),
                    js_word!("set") => self.parse_fn_args_body(
                        start,
                        |p| p.parse_formal_param().map(|pat| vec![pat]),
                        false,
                        false,
                    ).map(|function| ClassMethod {
                        key,
                        is_static,
                        function,
                        kind: ClassMethodKind::Setter,
                    }),
                    js_word!("async") => self.parse_fn_args_body(
                        start,
                        Parser::parse_unique_formal_params,
                        true,
                        false,
                    ).map(|function| ClassMethod {
                        is_static,
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

    pub(super) fn parse_fn_body<T>(&mut self, is_async: bool, is_generator: bool) -> PResult<T>
    where
        Self: FnBodyParser<T>,
    {
        self.with_ctx(Context {
            in_async: is_async,
            in_generator: is_generator,
            ..self.ctx
        }).parse_fn_body_inner()
    }
}

trait OutputType {
    type Ident;

    fn finish_fn(ident: Self::Ident, f: Function) -> Self;
    fn finish_class(ident: Self::Ident, class: Class) -> Self;
}

impl OutputType for Box<Expr> {
    type Ident = Option<Ident>;

    fn finish_fn(ident: Option<Ident>, function: Function) -> Self {
        box Expr {
            span: function.span,
            node: ExprKind::Function(FnExpr { ident, function }),
        }
    }
    fn finish_class(ident: Option<Ident>, class: Class) -> Self {
        box Expr {
            span: class.span,
            node: ExprKind::Class(ClassExpr { ident, class }),
        }
    }
}

impl OutputType for ExportDefaultDecl {
    type Ident = Option<Ident>;

    fn finish_fn(ident: Option<Ident>, function: Function) -> Self {
        ExportDefaultDecl::Fn { ident, function }
    }
    fn finish_class(ident: Option<Ident>, class: Class) -> Self {
        ExportDefaultDecl::Class { ident, class }
    }
}

impl OutputType for Decl {
    type Ident = Ident;

    fn finish_fn(ident: Ident, function: Function) -> Self {
        Decl::Fn { ident, function }
    }
    fn finish_class(ident: Ident, class: Class) -> Self {
        Decl::Class(ClassDecl { ident, class })
    }
}

pub(super) trait FnBodyParser<Body> {
    fn parse_fn_body_inner(&mut self) -> PResult<Body>;
}

#[parser]
impl<I: Input> FnBodyParser<BlockStmtOrExpr> for Parser<I> {
    fn parse_fn_body_inner(&mut self) -> PResult<BlockStmtOrExpr> {
        if is!('{') {
            self.parse_block().map(BlockStmtOrExpr::BlockStmt)
        } else {
            self.parse_assignment_expr().map(BlockStmtOrExpr::Expr)
        }
    }
}

impl<I: Input> FnBodyParser<BlockStmt> for Parser<I> {
    fn parse_fn_body_inner(&mut self) -> PResult<BlockStmt> {
        self.parse_block()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use lexer::Lexer;

    fn mk<'a>(s: &'static str) -> Parser<impl 'a + Input> {
        let logger = ::testing::logger().new(o!("src" => s));
        Parser::new_for_module(logger.clone(), Lexer::new_from_str(logger, s))
    }

    fn lhs(s: &'static str) -> Box<Expr> {
        mk(s)
            .parse_lhs_expr()
            .expect("failed to parse lhs expression")
    }

    fn expr(s: &'static str) -> Box<Expr> {
        mk(s).parse_expr().expect("failed to parse an expression")
    }

    #[allow(non_upper_case_globals)]
    const span: Span = Span::DUMMY;

    #[test]
    fn class_expr() {
        assert_eq_ignore_span!(
            expr("(class extends a {})"),
            box Expr {
                span,
                node: ExprKind::Paren(box Expr {
                    span,
                    node: ExprKind::Class(ClassExpr {
                        ident: None,
                        class: Class {
                            span,
                            body: vec![],
                            super_class: Some(expr("a")),
                        },
                    }),
                }),
            }
        );
    }
}
