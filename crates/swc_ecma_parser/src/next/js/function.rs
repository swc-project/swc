//! JavaScript function declarations and expressions.

use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{Decl, Expr, FnDecl, FnExpr, Function, Ident, Stmt};
#[cfg(feature = "flow")]
use swc_ecma_ast::{ObjectPat, Param, Pat};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{
        lexer::config::Config,
        parser::{context::Context, cursor::Parser},
    },
};

impl<C: Config> Parser<'_, C> {
    #[cfg(feature = "flow")]
    pub(crate) fn parse_flow_component_declaration(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let token = self.token();
        if !self.at_identifier_reference() {
            return Err(self.expected_error(Kind::Ident));
        }
        let ident = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.advance();
        let type_params = if self.at(Kind::Lt) {
            Some(self.parse_ts_type_parameters()?)
        } else {
            None
        };
        if !self.expect(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }
        let parameter_start = start;
        while !self.at(Kind::RParen) && !self.at(Kind::Eof) {
            self.advance();
        }
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        let parameter_end = self.previous_end();
        let return_type = if self.at(Kind::Ident) && self.token_source(self.token()) == "renders" {
            let annotation_start = self.token().start();
            self.advance();
            let type_ann = self.parse_ts_type()?;
            Some(Box::new(swc_ecma_ast::TsTypeAnn {
                span: Span::new_with_checked(annotation_start, type_ann.span().hi),
                type_ann,
            }))
        } else {
            None
        };
        let body = self.with_context(
            Context::RETURN,
            Context::TOP_LEVEL | Context::RETURN | Context::YIELD | Context::AWAIT,
            Self::parse_block_statement,
        )?;
        let span = Span::new_with_checked(start, body.span.hi);
        Ok(Stmt::Decl(Decl::Fn(FnDecl {
            ident,
            declare: false,
            function: Box::new(Function {
                params: vec![Param {
                    span: Span::new_with_checked(parameter_start, parameter_end),
                    decorators: Vec::new(),
                    pat: Pat::Object(ObjectPat {
                        span: Span::new_with_checked(parameter_start, parameter_end),
                        props: Vec::new(),
                        optional: false,
                        type_ann: None,
                    }),
                }],
                decorators: Vec::new(),
                span,
                ctxt: SyntaxContext::empty(),
                body: Some(body),
                is_generator: false,
                is_async: false,
                type_params,
                return_type,
            }),
        })))
    }

    pub(crate) fn is_async_function_start(&mut self) -> bool {
        if !self.at(Kind::Async) {
            return false;
        }
        self.lookahead(|parser| {
            parser.advance();
            !parser.token().had_line_break() && parser.at(Kind::Function)
        })
    }

    pub(crate) fn parse_function_declaration(&mut self) -> Result<Stmt, Error> {
        let (identifier, function) = self.parse_function(true)?;
        Ok(Stmt::Decl(Decl::Fn(FnDecl {
            ident: identifier.expect("function declaration must have a name"),
            declare: false,
            function,
        })))
    }

    pub(crate) fn parse_function_expression(&mut self) -> Result<Box<Expr>, Error> {
        let (identifier, function) = self.parse_function(false)?;
        Ok(Box::new(Expr::Fn(FnExpr {
            ident: identifier,
            function,
        })))
    }

    fn parse_function(
        &mut self,
        declaration: bool,
    ) -> Result<(Option<Ident>, Box<Function>), Error> {
        let start = self.token().start();
        let is_async = self.eat(Kind::Async);
        if !self.expect(Kind::Function) {
            return Err(self.expected_error(Kind::Function));
        }
        let is_generator = self.eat(Kind::Asterisk);
        let identifier = if self.at_identifier_reference()
            || (self.at(Kind::Yield) && !is_generator && !self.context().contains(Context::STRICT))
            || (self.at(Kind::Await) && !is_async && !self.context().contains(Context::MODULE))
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

        let mut parameter_context = Context::empty();
        if is_generator {
            parameter_context.insert(Context::YIELD);
        }
        if is_async {
            parameter_context.insert(Context::AWAIT);
        }
        let parameters = self.with_context(
            parameter_context,
            Context::YIELD | Context::AWAIT,
            Self::parse_method_parameters,
        )?;
        #[cfg(feature = "typescript")]
        let return_type = if self.context().contains(Context::TYPESCRIPT) && self.at(Kind::Colon) {
            Some(self.parse_ts_type_annotation()?)
        } else {
            None
        };
        #[cfg(not(feature = "typescript"))]
        let return_type = None;
        #[cfg(feature = "flow")]
        if self.context().contains(Context::FLOW) && self.eat(Kind::Percent) {
            if self.at_identifier_name() {
                self.advance();
            }
            if self.eat(Kind::LParen) {
                self.parse_expression()?;
                if !self.expect(Kind::RParen) {
                    return Err(self.expected_error(Kind::RParen));
                }
            }
        }
        let mut body_context = Context::RETURN;
        if is_generator {
            body_context.insert(Context::YIELD);
        }
        if is_async {
            body_context.insert(Context::AWAIT);
        }
        let body = if self.at(Kind::LBrace) {
            Some(self.with_context(
                body_context,
                Context::TOP_LEVEL | Context::RETURN | Context::YIELD | Context::AWAIT,
                Self::parse_block_statement,
            )?)
        } else if self.context().contains(Context::TYPESCRIPT) {
            self.consume_semicolon()?;
            None
        } else {
            return Err(self.expected_error(Kind::LBrace));
        };
        let end = body
            .as_ref()
            .map_or(self.previous_end(), |body| body.span.hi);
        let span = Span::new_with_checked(start, end);
        Ok((
            identifier,
            Box::new(Function {
                params: parameters,
                decorators: Vec::new(),
                span,
                ctxt: SyntaxContext::empty(),
                body,
                is_generator,
                is_async,
                type_params,
                return_type,
            }),
        ))
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{Decl, Expr, Stmt};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    #[test]
    fn parses_function_declarations_and_expressions_directly() {
        let lexer = Lexer::new(
            "async function* generate(value) { return value; } const identity = function (value) \
             { return value; }; const asyncIdentity = async function (value) { return value; };",
            BytePos(1),
            NoTokens,
        )
        .unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        let Stmt::Decl(Decl::Fn(declaration)) = &script.body[0] else {
            panic!("expected function declaration")
        };
        assert!(declaration.function.is_generator);
        assert!(declaration.function.is_async);
        let Stmt::Decl(Decl::Var(variable)) = &script.body[1] else {
            panic!("expected variable declaration")
        };
        assert!(matches!(
            variable.decls[0].init.as_deref(),
            Some(Expr::Fn(_))
        ));
        let Stmt::Decl(Decl::Var(variable)) = &script.body[2] else {
            panic!("expected async function expression declaration")
        };
        let Some(Expr::Fn(expression)) = variable.decls[0].init.as_deref() else {
            panic!("expected async function expression")
        };
        assert!(expression.function.is_async);
    }

    #[test]
    fn enables_yield_and_await_only_inside_matching_functions() {
        let lexer = Lexer::new(
            "function* generate() { yield* source; } async function load() { return await task; }",
            BytePos(1),
            NoTokens,
        )
        .unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        let Stmt::Decl(Decl::Fn(generator)) = &script.body[0] else {
            panic!("expected generator declaration")
        };
        let generator_body = generator.function.body.as_ref().unwrap();
        assert!(matches!(
            &generator_body.stmts[0],
            Stmt::Expr(statement) if matches!(&*statement.expr, Expr::Yield(yield_expression) if yield_expression.delegate)
        ));

        let Stmt::Decl(Decl::Fn(async_function)) = &script.body[1] else {
            panic!("expected async declaration")
        };
        let async_body = async_function.function.body.as_ref().unwrap();
        assert!(matches!(
            &async_body.stmts[0],
            Stmt::Return(statement) if matches!(statement.arg.as_deref(), Some(Expr::Await(_)))
        ));
    }
}
