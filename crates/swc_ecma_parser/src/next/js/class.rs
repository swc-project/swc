//! JavaScript class declarations, expressions, and public members.

use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    Class, ClassDecl, ClassExpr, ClassMember, ClassMethod, ClassProp, Constructor, Decl, Expr,
    Function, Ident, MethodKind, Param, ParamOrTsParamProp, PrivateMethod, PrivateName,
    PrivateProp, PropName, RestPat, StaticBlock, Stmt,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{
        lexer::config::Config,
        parser::{context::Context, cursor::Parser},
    },
};

impl<C: Config> Parser<'_, C> {
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
        let identifier = if self.at_identifier_reference() {
            let token = self.token();
            let identifier = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
            self.advance();
            Some(identifier)
        } else if declaration {
            return Err(self.expected_error(Kind::Ident));
        } else {
            None
        };
        let super_class = if self.eat(Kind::Extends) {
            Some(self.parse_expression()?)
        } else {
            None
        };
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }

        let mut body = Vec::with_capacity(32);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            if self.eat(Kind::Semi) {
                continue;
            }
            body.push(self.with_context(
                Context::STRICT,
                Context::TOP_LEVEL,
                Self::parse_class_member,
            )?);
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok((
            identifier,
            Box::new(Class {
                span: Span::new_with_checked(start, self.previous_end()),
                ctxt: SyntaxContext::empty(),
                decorators: Vec::new(),
                body,
                super_class,
                is_abstract: false,
                type_params: None,
                super_type_params: None,
                implements: Vec::new(),
            }),
        ))
    }

    fn parse_class_member(&mut self) -> Result<ClassMember, Error> {
        let start = self.token().start();
        let is_static = if self.at(Kind::Static)
            && self.lookahead(|parser| {
                parser.advance();
                !matches!(
                    parser.kind(),
                    Kind::LParen | Kind::Eq | Kind::Semi | Kind::RBrace
                )
            }) {
            self.advance();
            true
        } else {
            false
        };
        if is_static && self.at(Kind::LBrace) {
            let body = self.parse_block_statement()?;
            return Ok(ClassMember::StaticBlock(StaticBlock {
                span: Span::new_with_checked(start, body.span.hi),
                body,
            }));
        }
        let is_async = if self.at(Kind::Async)
            && self.lookahead(|parser| {
                parser.advance();
                !parser.token().had_line_break() && !parser.at(Kind::LParen)
            }) {
            self.advance();
            true
        } else {
            false
        };
        let is_generator = self.eat(Kind::Asterisk);
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

        if self.at(Kind::LParen) {
            let mut parameter_context = Context::empty();
            if is_async {
                parameter_context.insert(Context::AWAIT);
            }
            if is_generator {
                parameter_context.insert(Context::YIELD);
            }
            let parameters = self.with_context(
                parameter_context,
                Context::YIELD | Context::AWAIT,
                Self::parse_method_parameters,
            )?;
            if !self.at(Kind::LBrace) {
                return Err(self.expected_error(Kind::LBrace));
            }
            let mut method_context = Context::RETURN;
            if is_async {
                method_context.insert(Context::AWAIT);
            }
            if is_generator {
                method_context.insert(Context::YIELD);
            }
            let body = self.with_context(
                method_context,
                Context::TOP_LEVEL | Context::RETURN | Context::YIELD | Context::AWAIT,
                Self::parse_block_statement,
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
                    params: parameters
                        .into_iter()
                        .map(ParamOrTsParamProp::Param)
                        .collect(),
                    body: Some(body),
                    accessibility: None,
                    is_optional: false,
                }));
            }
            let function = Box::new(Function {
                params: parameters,
                decorators: Vec::new(),
                span,
                ctxt: SyntaxContext::empty(),
                body: Some(body),
                is_generator,
                is_async,
                type_params: None,
                return_type: None,
            });
            return Ok(match key {
                ClassKey::Public(key) => ClassMember::Method(ClassMethod {
                    span,
                    key,
                    function,
                    kind: method_kind,
                    is_static,
                    accessibility: None,
                    is_abstract: false,
                    is_optional: false,
                    is_override: false,
                }),
                ClassKey::Private(key) => ClassMember::PrivateMethod(PrivateMethod {
                    span,
                    key,
                    function,
                    kind: method_kind,
                    is_static,
                    accessibility: None,
                    is_abstract: false,
                    is_optional: false,
                    is_override: false,
                }),
            });
        }

        if is_async || is_generator || method_kind != MethodKind::Method {
            return Err(self.expected_error(Kind::LParen));
        }
        let value = if self.eat(Kind::Eq) {
            Some(self.parse_assignment_expression()?)
        } else {
            None
        };
        let end = value.as_ref().map_or(key_span.hi, |value| value.span().hi);
        self.consume_semicolon()?;
        let span = Span::new_with_checked(start, end);
        Ok(match key {
            ClassKey::Public(key) => ClassMember::ClassProp(ClassProp {
                span,
                key,
                value,
                type_ann: None,
                is_static,
                decorators: Vec::new(),
                accessibility: None,
                is_abstract: false,
                is_optional: false,
                is_override: false,
                readonly: false,
                declare: false,
                definite: false,
            }),
            ClassKey::Private(key) => ClassMember::PrivateProp(PrivateProp {
                span,
                ctxt: SyntaxContext::empty(),
                key,
                value,
                type_ann: None,
                is_static,
                decorators: Vec::new(),
                accessibility: None,
                is_optional: false,
                is_override: false,
                readonly: false,
                definite: false,
            }),
        })
    }

    fn is_method_kind_prefix(&mut self) -> bool {
        matches!(self.kind(), Kind::Get | Kind::Set)
            && self.lookahead(|parser| {
                parser.advance();
                !parser.at(Kind::LParen) && !parser.token().had_line_break()
            })
    }

    fn parse_class_key(&mut self) -> Result<ClassKey, Error> {
        if self.at(Kind::Hash) {
            let start = self.token().start();
            self.advance();
            let token = self.token();
            if !self.at_identifier_name() {
                return Err(self.expected_error(Kind::Ident));
            }
            let key = PrivateName {
                span: Span::new_with_checked(start, token.end()),
                name: self.identifier_atom(token),
            };
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
            let pattern = if self.at(Kind::DotDotDot) {
                let dot3_token = self.token().span();
                self.advance();
                let argument = self.parse_binding_pattern(false)?;
                let span = Span::new_with_checked(dot3_token.lo, argument.span().hi);
                swc_ecma_ast::Pat::Rest(RestPat {
                    span,
                    dot3_token,
                    arg: Box::new(argument),
                    type_ann: None,
                })
            } else {
                self.parse_binding_pattern(true)?
            };
            parameters.push(Param {
                span: pattern.span(),
                decorators: Vec::new(),
                pat: pattern,
            });
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
