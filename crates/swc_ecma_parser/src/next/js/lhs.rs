//! Member and call expression chains.

use swc_atoms::Atom;
use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    CallExpr, Callee, ComputedPropName, Expr, ExprOrSpread, IdentName, Import, ImportPhase,
    MemberExpr, MemberProp, MetaPropExpr, MetaPropKind, NewExpr, Super, SuperProp, SuperPropExpr,
    TaggedTpl,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    /// Parse member, computed member, and call suffixes.
    pub(crate) fn parse_left_hand_side_expression(&mut self) -> Result<Box<Expr>, Error> {
        let expression = if matches!(self.kind(), Kind::Super | Kind::Import) {
            self.parse_special_left_hand_side()?
        } else if self.at(Kind::New) {
            self.parse_new_expression()?
        } else {
            self.parse_primary_expression()?
        };
        self.parse_suffixes(expression, true)
    }

    fn parse_suffixes(
        &mut self,
        mut expression: Box<Expr>,
        allow_call: bool,
    ) -> Result<Box<Expr>, Error> {
        loop {
            match self.kind() {
                Kind::Dot => {
                    self.advance();
                    let property_token = self.token();
                    if !self.at_identifier_name() {
                        return Err(self.expected_error(Kind::Ident));
                    }
                    let property = IdentName {
                        span: property_token.span(),
                        sym: Atom::new(self.token_source(property_token)),
                    };
                    self.advance();
                    expression = Box::new(Expr::Member(MemberExpr {
                        span: Span::new_with_checked(expression.span().lo, property.span.hi),
                        obj: expression,
                        prop: MemberProp::Ident(property),
                    }));
                }
                Kind::LBracket => {
                    let bracket_start = self.token().start();
                    self.advance();
                    let property = self.parse_expression()?;
                    if !self.expect(Kind::RBracket) {
                        return Err(self.expected_error(Kind::RBracket));
                    }
                    let end = self.previous_end();
                    expression = Box::new(Expr::Member(MemberExpr {
                        span: Span::new_with_checked(expression.span().lo, end),
                        obj: expression,
                        prop: MemberProp::Computed(ComputedPropName {
                            span: Span::new_with_checked(bracket_start, end),
                            expr: property,
                        }),
                    }));
                }
                Kind::LParen if allow_call => {
                    let start = expression.span().lo;
                    let arguments = self.parse_arguments()?;
                    expression = Box::new(Expr::Call(CallExpr {
                        span: Span::new_with_checked(start, self.previous_end()),
                        ctxt: SyntaxContext::empty(),
                        callee: Callee::Expr(expression),
                        args: arguments,
                        type_args: None,
                    }));
                }
                Kind::NoSubstitutionTemplateLiteral | Kind::TemplateHead => {
                    let start = expression.span().lo;
                    let template = self.parse_template_literal(true)?;
                    let end = template.span.hi;
                    expression = Box::new(Expr::TaggedTpl(TaggedTpl {
                        span: Span::new_with_checked(start, end),
                        ctxt: SyntaxContext::empty(),
                        tag: expression,
                        type_params: None,
                        tpl: Box::new(template),
                    }));
                }
                _ => break,
            }
        }

        Ok(expression)
    }

    fn parse_new_expression(&mut self) -> Result<Box<Expr>, Error> {
        let start = self.token().start();
        self.advance();
        if self.eat(Kind::Dot) {
            let property = self.token();
            if !self.at_identifier_name() || self.token_source(property) != "target" {
                return Err(self.expected_error(Kind::Target));
            }
            self.advance();
            return Ok(Box::new(Expr::MetaProp(MetaPropExpr {
                span: Span::new_with_checked(start, property.end()),
                kind: MetaPropKind::NewTarget,
            })));
        }
        let callee = if self.at(Kind::New) {
            self.parse_new_expression()?
        } else {
            let primary = self.parse_primary_expression()?;
            self.parse_suffixes(primary, false)?
        };
        let arguments = if self.at(Kind::LParen) {
            Some(self.parse_arguments()?)
        } else {
            None
        };
        Ok(Box::new(Expr::New(NewExpr {
            span: Span::new_with_checked(start, self.previous_end()),
            ctxt: SyntaxContext::empty(),
            callee,
            args: arguments,
            type_args: None,
        })))
    }

    fn parse_special_left_hand_side(&mut self) -> Result<Box<Expr>, Error> {
        let token = self.token();
        if self.eat(Kind::Import) {
            if self.eat(Kind::Dot) {
                let property = self.token();
                if !self.at_identifier_name() || self.token_source(property) != "meta" {
                    return Err(self.expected_error(Kind::Meta));
                }
                self.advance();
                return Ok(Box::new(Expr::MetaProp(MetaPropExpr {
                    span: Span::new_with_checked(token.start(), property.end()),
                    kind: MetaPropKind::ImportMeta,
                })));
            }
            if !self.at(Kind::LParen) {
                return Err(self.expected_error(Kind::LParen));
            }
            let arguments = self.parse_arguments()?;
            return Ok(Box::new(Expr::Call(CallExpr {
                span: Span::new_with_checked(token.start(), self.previous_end()),
                ctxt: SyntaxContext::empty(),
                callee: Callee::Import(Import {
                    span: token.span(),
                    phase: ImportPhase::Evaluation,
                }),
                args: arguments,
                type_args: None,
            })));
        }

        debug_assert!(self.eat(Kind::Super));
        let super_object = Super { span: token.span() };
        if self.at(Kind::LParen) {
            let arguments = self.parse_arguments()?;
            return Ok(Box::new(Expr::Call(CallExpr {
                span: Span::new_with_checked(token.start(), self.previous_end()),
                ctxt: SyntaxContext::empty(),
                callee: Callee::Super(super_object),
                args: arguments,
                type_args: None,
            })));
        }
        let property = if self.eat(Kind::Dot) {
            let property_token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let property = SuperProp::Ident(IdentName {
                span: property_token.span(),
                sym: Atom::new(self.token_source(property_token)),
            });
            self.advance();
            property
        } else if self.eat(Kind::LBracket) {
            let start = self.previous_end();
            let expression = self.parse_expression()?;
            if !self.expect(Kind::RBracket) {
                return Err(self.expected_error(Kind::RBracket));
            }
            SuperProp::Computed(ComputedPropName {
                span: Span::new_with_checked(start, self.previous_end()),
                expr: expression,
            })
        } else {
            return Err(self.expected_error(Kind::Dot));
        };
        Ok(Box::new(Expr::SuperProp(SuperPropExpr {
            span: Span::new_with_checked(token.start(), self.previous_end()),
            obj: super_object,
            prop: property,
        })))
    }

    fn parse_arguments(&mut self) -> Result<Vec<ExprOrSpread>, Error> {
        debug_assert!(self.at(Kind::LParen));
        self.advance();
        let mut arguments = Vec::with_capacity(2);

        while !self.at(Kind::RParen) && !self.at(Kind::Eof) {
            let spread = if self.at(Kind::DotDotDot) {
                let span = self.token().span();
                self.advance();
                Some(span)
            } else {
                None
            };
            arguments.push(ExprOrSpread {
                spread,
                expr: self.parse_assignment_expression()?,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }

        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        Ok(arguments)
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{Callee, Expr, MemberProp, MetaPropKind};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    #[test]
    fn builds_member_and_call_chain() {
        let lexer = Lexer::new("foo.bar[0](value, ...rest)", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let expression = parser.parse_expression().unwrap();

        let Expr::Call(call) = &*expression else {
            panic!("expected call")
        };
        assert_eq!(call.args.len(), 2);
        assert!(call.args[1].spread.is_some());
        let Callee::Expr(callee) = &call.callee else {
            panic!("expected expression callee")
        };
        let Expr::Member(computed) = &**callee else {
            panic!("expected computed member")
        };
        assert!(matches!(computed.prop, MemberProp::Computed(_)));
        let Expr::Member(dotted) = &*computed.obj else {
            panic!("expected dotted member")
        };
        assert!(matches!(&dotted.prop, MemberProp::Ident(name) if name.sym == "bar"));
    }

    #[test]
    fn builds_nested_new_and_member_expressions() {
        let lexer = Lexer::new("new new Factory(1).value", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let expression = parser.parse_expression().unwrap();
        let Expr::Member(member) = &*expression else {
            panic!("expected member expression")
        };
        let Expr::New(outer) = &*member.obj else {
            panic!("expected outer new expression")
        };
        assert!(matches!(&*outer.callee, Expr::New(_)));
    }

    #[test]
    fn builds_super_import_and_meta_expressions() {
        let lexer = Lexer::new(
            "super(value); super.member; import('dep'); import.meta; new.target;",
            BytePos(1),
            NoTokens,
        )
        .unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();
        assert!(matches!(
            &script.body[0],
            swc_ecma_ast::Stmt::Expr(statement)
                if matches!(&*statement.expr, Expr::Call(call) if matches!(call.callee, Callee::Super(_)))
        ));
        assert!(matches!(
            &script.body[1],
            swc_ecma_ast::Stmt::Expr(statement) if matches!(&*statement.expr, Expr::SuperProp(_))
        ));
        assert!(matches!(
            &script.body[2],
            swc_ecma_ast::Stmt::Expr(statement)
                if matches!(&*statement.expr, Expr::Call(call) if matches!(call.callee, Callee::Import(_)))
        ));
        assert!(matches!(
            &script.body[3],
            swc_ecma_ast::Stmt::Expr(statement)
                if matches!(&*statement.expr, Expr::MetaProp(meta) if meta.kind == MetaPropKind::ImportMeta)
        ));
        assert!(matches!(
            &script.body[4],
            swc_ecma_ast::Stmt::Expr(statement)
                if matches!(&*statement.expr, Expr::MetaProp(meta) if meta.kind == MetaPropKind::NewTarget)
        ));
    }
}
