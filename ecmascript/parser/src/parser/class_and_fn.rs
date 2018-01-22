//! Parser for function expression and function declaration.

use super::*;
use super::ident::MaybeOptionalIdentParser;

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    pub(super) fn parse_async_fn_expr(&mut self) -> PResult<'a, Box<Expr>> {
        let start = cur_pos!();
        expect!("async");
        self.parse_fn(Some(start))
    }

    /// Parse function expression
    pub(super) fn parse_fn_expr(&mut self) -> PResult<'a, Box<Expr>> {
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

    pub(super) fn parse_class_expr(&mut self) -> PResult<'a, Box<Expr>> {
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
                span: Span::new(start, end, Default::default()),
                super_class,
                body,
            },
        ))
    }

    fn parse_class_body(&mut self) -> PResult<'a, Vec<ClassMethod>> {
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

    fn parse_fn<T>(&mut self, start_of_async: Option<BytePos>) -> PResult<'a, T>
    where
        T: OutputType,
        Self: MaybeOptionalIdentParser<'a, T::Ident>,
    {
        let start = start_of_async.unwrap_or(cur_pos!());
        assert_and_bump!("function");
        let is_async = start_of_async.is_some();

        if is_async && is!('*') {
            syntax_error!(SyntaxError::AsyncGenerator {});
        }

        let is_generator = eat!('*');

        let ident = self.parse_maybe_opt_binding_ident()?;

        expect!('(');
        let params = self.parse_formal_params()?;
        expect!(')');

        let body = self.parse_fn_body(is_async, is_generator)?;

        Ok(T::finish_fn(
            ident,
            Function {
                span: span!(start),
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
    ) -> PResult<'a, Function>
    where
        F: FnOnce(&mut Self) -> PResult<'a, Vec<Pat>>,
    {
        let ctx = Context {
            in_async: is_async,
            in_generator: is_generator,
            ..self.ctx
        };
        self.with_ctx(ctx).parse_with(|mut p| {
            expect!('(');

            let params = parse_args(&mut p)?;

            expect!(')');

            let body = p.parse_fn_body(is_async, is_generator)?;

            Ok(Function {
                span: span!(start),
                params,
                body,
                is_async,
                is_generator,
            })
        })
    }

    fn parse_method_def(&mut self, start_of_static: Option<BytePos>) -> PResult<'a, ClassMethod> {
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

    pub(super) fn parse_fn_body<T>(&mut self, is_async: bool, is_generator: bool) -> PResult<'a, T>
    where
        Self: FnBodyParser<'a, T>,
    {
        let ctx = Context {
            in_async: is_async,
            in_generator: is_generator,
            ..self.ctx
        };
        self.with_ctx(ctx).parse_fn_body_inner()
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
            node: ExprKind::Fn(FnExpr { ident, function }),
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
            self.parse_block().map(BlockStmtOrExpr::BlockStmt)
        } else {
            self.parse_assignment_expr().map(BlockStmtOrExpr::Expr)
        }
    }
}

impl<'a, I: Input> FnBodyParser<'a, BlockStmt> for Parser<'a, I> {
    fn parse_fn_body_inner(&mut self) -> PResult<'a, BlockStmt> {
        self.parse_block()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::DUMMY_SP;

    fn lhs(s: &'static str) -> Box<Expr> {
        test_parser(s, |p| {
            p.parse_lhs_expr().unwrap_or_else(|err| {
                err.emit();
                unreachable!("failed to parse a left-hand-side expression")
            })
        })
    }

    fn expr(s: &'static str) -> Box<Expr> {
        test_parser(s, |p| {
            p.parse_expr().unwrap_or_else(|err| {
                err.emit();
                unreachable!("failed to parse an expression")
            })
        })
    }

    #[allow(non_upper_case_globals)]
    const span: Span = DUMMY_SP;

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
