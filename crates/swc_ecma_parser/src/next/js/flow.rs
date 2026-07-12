//! Flow expression extensions and their deterministic SWC AST lowering.

use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    ArrayLit, BinExpr, BinaryOp, BindingIdent, BlockStmt, Bool, CallExpr, Callee, ComputedPropName,
    Decl, Expr, ExprOrSpread, FnExpr, Function, Ident, IdentName, IfStmt, Lit, MemberExpr,
    MemberProp, NewExpr, Null, Number, Pat, PropName, ReturnStmt, Stmt, Str, ThrowStmt, UnaryExpr,
    UnaryOp, VarDecl, VarDeclKind, VarDeclarator,
};

use crate::{
    error::Error,
    next::lexer::TokenKind as Kind,
    next::{
        lexer::config::Config,
        parser::{context::Context, cursor::Parser},
    },
};

#[derive(Debug, Clone)]
enum FlowMatchPattern {
    Wildcard,
    Value(Box<Expr>),
    Binding(FlowMatchBinding),
    Object {
        props: Vec<(PropName, FlowMatchPattern)>,
        rest: Option<Option<FlowMatchBinding>>,
    },
    Array {
        elems: Vec<FlowMatchPattern>,
        rest: Option<Option<FlowMatchBinding>>,
    },
    Or(Vec<FlowMatchPattern>),
    As {
        inner: Box<FlowMatchPattern>,
        binding: FlowMatchBinding,
    },
}

#[derive(Debug, Clone)]
struct FlowMatchBinding {
    kind: VarDeclKind,
    pat: Pat,
    span: Span,
}

#[derive(Debug)]
struct FlowMatchBindingInit {
    kind: VarDeclKind,
    pat: Pat,
    init: Box<Expr>,
    span: Span,
}

#[derive(Debug)]
struct FlowMatchLowered {
    predicate: Box<Expr>,
    bindings: Vec<FlowMatchBindingInit>,
}

impl<C: Config> Parser<'_, C> {
    /// Return whether the current identifier starts Flow's pattern-matching
    /// proposal. The mandatory whitespace before `(` keeps ordinary calls to
    /// an identifier named `match` unambiguous.
    pub(crate) fn is_flow_match_start(&mut self) -> bool {
        if !self.at(Kind::Ident) || self.token_source(self.token()) != "match" {
            return false;
        }
        let match_end = self.token().end();
        self.lookahead(|parser| {
            parser.advance();
            parser.at(Kind::LParen) && parser.token().start() > match_end
        })
    }

    fn flow_match_true_expr(&self, span: Span) -> Box<Expr> {
        Box::new(Expr::Lit(Lit::Bool(Bool { span, value: true })))
    }

    fn flow_match_bin_expr(
        &self,
        span: Span,
        op: BinaryOp,
        left: Box<Expr>,
        right: Box<Expr>,
    ) -> Box<Expr> {
        Box::new(Expr::Bin(BinExpr {
            span,
            op,
            left,
            right,
        }))
    }

    fn flow_match_and_expr(&self, span: Span, left: Box<Expr>, right: Box<Expr>) -> Box<Expr> {
        self.flow_match_bin_expr(span, BinaryOp::LogicalAnd, left, right)
    }

    fn flow_match_or_expr(&self, span: Span, left: Box<Expr>, right: Box<Expr>) -> Box<Expr> {
        self.flow_match_bin_expr(span, BinaryOp::LogicalOr, left, right)
    }

    fn flow_match_eq_expr(&self, span: Span, left: Box<Expr>, right: Box<Expr>) -> Box<Expr> {
        self.flow_match_bin_expr(span, BinaryOp::EqEqEq, left, right)
    }

    fn flow_match_prop_key_expr(&self, key: &PropName) -> Box<Expr> {
        match key {
            PropName::Ident(id) => Box::new(Expr::Lit(Lit::Str(Str {
                span: id.span,
                value: id.sym.clone().into(),
                raw: None,
            }))),
            PropName::Str(value) => Box::new(Expr::Lit(Lit::Str(value.clone()))),
            PropName::Num(value) => Box::new(Expr::Lit(Lit::Num(value.clone()))),
            PropName::BigInt(value) => Box::new(Expr::Lit(Lit::BigInt(value.clone()))),
            PropName::Computed(value) => value.expr.clone(),
        }
    }

    fn flow_match_member_expr(&self, span: Span, obj: Box<Expr>, key: &PropName) -> Box<Expr> {
        let prop = match key {
            PropName::Ident(id) => MemberProp::Ident(id.clone()),
            _ => MemberProp::Computed(ComputedPropName {
                span,
                expr: self.flow_match_prop_key_expr(key),
            }),
        };
        Box::new(Expr::Member(MemberExpr { span, obj, prop }))
    }

    fn flow_match_lower_pattern(
        &self,
        span: Span,
        value: Box<Expr>,
        pattern: &FlowMatchPattern,
    ) -> FlowMatchLowered {
        match pattern {
            FlowMatchPattern::Wildcard => FlowMatchLowered {
                predicate: self.flow_match_true_expr(span),
                bindings: Vec::new(),
            },
            FlowMatchPattern::Value(expected) => FlowMatchLowered {
                predicate: self.flow_match_eq_expr(span, value, expected.clone()),
                bindings: Vec::new(),
            },
            FlowMatchPattern::Binding(binding) => FlowMatchLowered {
                predicate: self.flow_match_true_expr(span),
                bindings: vec![FlowMatchBindingInit {
                    kind: binding.kind,
                    pat: binding.pat.clone(),
                    init: value,
                    span: binding.span,
                }],
            },
            FlowMatchPattern::As { inner, binding } => {
                let mut lowered = self.flow_match_lower_pattern(span, value.clone(), inner);
                lowered.bindings.push(FlowMatchBindingInit {
                    kind: binding.kind,
                    pat: binding.pat.clone(),
                    init: value,
                    span: binding.span,
                });
                lowered
            }
            FlowMatchPattern::Or(patterns) => {
                let mut patterns = patterns.iter();
                let mut result = self.flow_match_lower_pattern(
                    span,
                    value.clone(),
                    patterns.next().expect("or pattern is non-empty"),
                );
                // Bindings inside alternatives cannot be initialized
                // deterministically. The reference parser reports a recovery
                // diagnostic and drops them from the lowering.
                result.bindings.clear();
                for pattern in patterns {
                    let mut lowered = self.flow_match_lower_pattern(span, value.clone(), pattern);
                    lowered.bindings.clear();
                    result.predicate =
                        self.flow_match_or_expr(span, result.predicate, lowered.predicate);
                }
                result
            }
            FlowMatchPattern::Object { props, rest } => {
                let mut predicate = self.flow_match_and_expr(
                    span,
                    self.flow_match_eq_expr(
                        span,
                        Box::new(Expr::Unary(UnaryExpr {
                            span,
                            op: UnaryOp::TypeOf,
                            arg: value.clone(),
                        })),
                        Box::new(Expr::Lit(Lit::Str(Str {
                            span,
                            value: "object".into(),
                            raw: None,
                        }))),
                    ),
                    self.flow_match_bin_expr(
                        span,
                        BinaryOp::NotEqEq,
                        value.clone(),
                        Box::new(Expr::Lit(Lit::Null(Null { span }))),
                    ),
                );
                let mut bindings = Vec::new();
                for (key, pattern) in props {
                    predicate = self.flow_match_and_expr(
                        span,
                        predicate,
                        self.flow_match_bin_expr(
                            span,
                            BinaryOp::In,
                            self.flow_match_prop_key_expr(key),
                            value.clone(),
                        ),
                    );
                    let lowered = self.flow_match_lower_pattern(
                        span,
                        self.flow_match_member_expr(span, value.clone(), key),
                        pattern,
                    );
                    predicate = self.flow_match_and_expr(span, predicate, lowered.predicate);
                    bindings.extend(lowered.bindings);
                }
                if let Some(Some(binding)) = rest {
                    bindings.push(FlowMatchBindingInit {
                        kind: binding.kind,
                        pat: binding.pat.clone(),
                        init: value,
                        span: binding.span,
                    });
                }
                FlowMatchLowered {
                    predicate,
                    bindings,
                }
            }
            FlowMatchPattern::Array { elems, rest } => {
                let is_array = Box::new(Expr::Member(MemberExpr {
                    span,
                    obj: Box::new(Expr::Ident(Ident::new_no_ctxt("Array".into(), span))),
                    prop: MemberProp::Ident(IdentName::new("isArray".into(), span)),
                }));
                let mut predicate = Box::new(Expr::Call(CallExpr {
                    span,
                    ctxt: SyntaxContext::empty(),
                    callee: Callee::Expr(is_array),
                    args: vec![ExprOrSpread {
                        spread: None,
                        expr: value.clone(),
                    }],
                    type_args: None,
                }));
                let length = self.flow_match_member_expr(
                    span,
                    value.clone(),
                    &PropName::Ident(IdentName::new("length".into(), span)),
                );
                predicate = self.flow_match_and_expr(
                    span,
                    predicate,
                    self.flow_match_bin_expr(
                        span,
                        BinaryOp::GtEq,
                        length,
                        Box::new(Expr::Lit(Lit::Num(Number {
                            span,
                            value: elems.len() as f64,
                            raw: None,
                        }))),
                    ),
                );
                let mut bindings = Vec::new();
                for (index, pattern) in elems.iter().enumerate() {
                    let element = self.flow_match_member_expr(
                        span,
                        value.clone(),
                        &PropName::Num(Number {
                            span,
                            value: index as f64,
                            raw: None,
                        }),
                    );
                    let lowered = self.flow_match_lower_pattern(span, element, pattern);
                    predicate = self.flow_match_and_expr(span, predicate, lowered.predicate);
                    bindings.extend(lowered.bindings);
                }
                if let Some(Some(binding)) = rest {
                    let slice = Box::new(Expr::Member(MemberExpr {
                        span,
                        obj: value,
                        prop: MemberProp::Ident(IdentName::new("slice".into(), span)),
                    }));
                    bindings.push(FlowMatchBindingInit {
                        kind: binding.kind,
                        pat: binding.pat.clone(),
                        init: Box::new(Expr::Call(CallExpr {
                            span,
                            ctxt: SyntaxContext::empty(),
                            callee: Callee::Expr(slice),
                            args: vec![ExprOrSpread {
                                spread: None,
                                expr: Box::new(Expr::Lit(Lit::Num(Number {
                                    span,
                                    value: elems.len() as f64,
                                    raw: None,
                                }))),
                            }],
                            type_args: None,
                        })),
                        span: binding.span,
                    });
                }
                FlowMatchLowered {
                    predicate,
                    bindings,
                }
            }
        }
    }

    fn flow_match_parse_binding(
        &mut self,
        default_kind: Option<VarDeclKind>,
    ) -> Result<FlowMatchBinding, Error> {
        let start = self.token().start();
        let kind = match self.kind() {
            Kind::Const => {
                self.advance();
                VarDeclKind::Const
            }
            Kind::Let => {
                self.advance();
                VarDeclKind::Let
            }
            Kind::Var => {
                self.advance();
                VarDeclKind::Var
            }
            _ => default_kind.ok_or_else(|| self.expected_error(Kind::Const))?,
        };
        // The following `:` separates the case from its body; it is not a
        // Flow/TypeScript annotation on the binding.
        let pat = self.with_context(Context::empty(), Context::TYPESCRIPT, |parser| {
            parser.parse_binding_pattern(false)
        })?;
        Ok(FlowMatchBinding {
            kind,
            span: Span::new_with_checked(start, pat.span().hi),
            pat,
        })
    }

    fn flow_match_parse_member_value_pattern(&mut self) -> Result<FlowMatchPattern, Error> {
        let start = self.token().start();
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let mut expression = Box::new(Expr::Ident(Ident::new_no_ctxt(
            self.identifier_atom(token),
            token.span(),
        )));
        self.advance();
        loop {
            if self.eat(Kind::Dot) {
                let token = self.token();
                if !self.at_identifier_name() {
                    return Err(self.expected_error(Kind::Ident));
                }
                let property = IdentName::new(self.identifier_atom(token), token.span());
                self.advance();
                expression = Box::new(Expr::Member(MemberExpr {
                    span: Span::new_with_checked(start, property.span.hi),
                    obj: expression,
                    prop: MemberProp::Ident(property),
                }));
                continue;
            }
            if self.eat(Kind::LBracket) {
                let property = self.parse_assignment_expression()?;
                if !self.expect(Kind::RBracket) {
                    return Err(self.expected_error(Kind::RBracket));
                }
                expression = Box::new(Expr::Member(MemberExpr {
                    span: Span::new_with_checked(start, self.previous_end()),
                    obj: expression,
                    prop: MemberProp::Computed(ComputedPropName {
                        span: Span::new_with_checked(start, self.previous_end()),
                        expr: property,
                    }),
                }));
                continue;
            }
            break;
        }
        Ok(FlowMatchPattern::Value(expression))
    }

    fn flow_match_parse_object_pattern(&mut self) -> Result<FlowMatchPattern, Error> {
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let mut props = Vec::with_capacity(4);
        let mut rest = None;
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            if self.eat(Kind::DotDotDot) {
                let binding = if matches!(self.kind(), Kind::Comma | Kind::RBrace) {
                    None
                } else {
                    Some(self.flow_match_parse_binding(Some(VarDeclKind::Const))?)
                };
                rest = Some(binding);
            } else if matches!(self.kind(), Kind::Const | Kind::Let | Kind::Var) {
                let binding = self.flow_match_parse_binding(None)?;
                let Pat::Ident(identifier) = &binding.pat else {
                    return Err(self.expected_error(Kind::Ident));
                };
                props.push((
                    PropName::Ident(IdentName::new(
                        identifier.id.sym.clone(),
                        identifier.id.span,
                    )),
                    FlowMatchPattern::Binding(binding),
                ));
            } else {
                let key = self.parse_property_name()?;
                let pattern = if self.eat(Kind::Colon) {
                    self.flow_match_parse_pattern()?
                } else if let PropName::Ident(identifier) = &key {
                    FlowMatchPattern::Value(Box::new(Expr::Ident(Ident::new_no_ctxt(
                        identifier.sym.clone(),
                        identifier.span,
                    ))))
                } else {
                    FlowMatchPattern::Wildcard
                };
                props.push((key, pattern));
            }
            if self.at(Kind::RBrace) {
                break;
            }
            if !self.expect(Kind::Comma) {
                return Err(self.expected_error(Kind::Comma));
            }
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok(FlowMatchPattern::Object { props, rest })
    }

    fn flow_match_parse_array_pattern(&mut self) -> Result<FlowMatchPattern, Error> {
        if !self.expect(Kind::LBracket) {
            return Err(self.expected_error(Kind::LBracket));
        }
        let mut elems = Vec::with_capacity(4);
        let mut rest = None;
        while !self.at(Kind::RBracket) && !self.at(Kind::Eof) {
            if self.eat(Kind::Comma) {
                continue;
            }
            if self.eat(Kind::DotDotDot) {
                let binding = if matches!(self.kind(), Kind::Comma | Kind::RBracket) {
                    None
                } else {
                    Some(self.flow_match_parse_binding(Some(VarDeclKind::Const))?)
                };
                rest = Some(binding);
                if self.at(Kind::RBracket) {
                    break;
                }
                if !self.expect(Kind::Comma) {
                    return Err(self.expected_error(Kind::Comma));
                }
                continue;
            }
            elems.push(self.flow_match_parse_pattern()?);
            if self.at(Kind::RBracket) {
                break;
            }
            if !self.expect(Kind::Comma) {
                return Err(self.expected_error(Kind::Comma));
            }
        }
        if !self.expect(Kind::RBracket) {
            return Err(self.expected_error(Kind::RBracket));
        }
        Ok(FlowMatchPattern::Array { elems, rest })
    }

    fn flow_match_parse_primary_pattern(&mut self) -> Result<FlowMatchPattern, Error> {
        let start = self.token().start();
        if self.eat(Kind::LParen) {
            let pattern = self.flow_match_parse_pattern()?;
            if !self.expect(Kind::RParen) {
                return Err(self.expected_error(Kind::RParen));
            }
            return Ok(pattern);
        }
        if self.at(Kind::LBrace) {
            return self.flow_match_parse_object_pattern();
        }
        if self.at(Kind::LBracket) {
            return self.flow_match_parse_array_pattern();
        }
        if matches!(self.kind(), Kind::Const | Kind::Let | Kind::Var) {
            return self
                .flow_match_parse_binding(None)
                .map(FlowMatchPattern::Binding);
        }
        if self.at(Kind::Ident) && self.token_source(self.token()) == "_" {
            self.advance();
            return Ok(FlowMatchPattern::Wildcard);
        }
        if matches!(self.kind(), Kind::Plus | Kind::Minus) {
            let op = if self.at(Kind::Plus) {
                UnaryOp::Plus
            } else {
                UnaryOp::Minus
            };
            self.advance();
            if !matches!(self.kind(), Kind::Num | Kind::BigInt) {
                return Err(self.expected_error(Kind::Num));
            }
            let argument = self.parse_primary_expression()?;
            return Ok(FlowMatchPattern::Value(Box::new(Expr::Unary(UnaryExpr {
                span: Span::new_with_checked(start, argument.span().hi),
                op,
                arg: argument,
            }))));
        }
        if matches!(
            self.kind(),
            Kind::Str | Kind::Num | Kind::BigInt | Kind::True | Kind::False | Kind::Null
        ) {
            return self.parse_primary_expression().map(FlowMatchPattern::Value);
        }
        if self.at_identifier_name() {
            return self.flow_match_parse_member_value_pattern();
        }
        Err(self.expected_error(Kind::Ident))
    }

    fn flow_match_parse_pattern(&mut self) -> Result<FlowMatchPattern, Error> {
        let mut pattern = self.flow_match_parse_primary_pattern()?;
        while self.eat(Kind::Pipe) {
            let right = self.flow_match_parse_primary_pattern()?;
            pattern = match pattern {
                FlowMatchPattern::Or(mut patterns) => {
                    patterns.push(right);
                    FlowMatchPattern::Or(patterns)
                }
                _ => FlowMatchPattern::Or(vec![pattern, right]),
            };
        }
        if self.eat(Kind::As) {
            pattern = FlowMatchPattern::As {
                inner: Box::new(pattern),
                binding: self.flow_match_parse_binding(Some(VarDeclKind::Const))?,
            };
        }
        Ok(pattern)
    }

    fn flow_match_expect_case_separator(&mut self) -> Result<(), Error> {
        if self.eat(Kind::Colon) || self.eat(Kind::Arrow) {
            Ok(())
        } else {
            Err(self.expected_error(Kind::Colon))
        }
    }

    fn flow_match_parse_subject(&mut self, start: swc_common::BytePos) -> Result<Box<Expr>, Error> {
        debug_assert!(self.is_flow_match_start());
        self.advance();
        if !self.expect(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }
        if self.at(Kind::RParen) {
            return Err(self.expected_error(Kind::Ident));
        }
        let mut subjects = Vec::with_capacity(2);
        loop {
            if self.at(Kind::DotDotDot) {
                return Err(self.expected_error(Kind::Ident));
            }
            subjects.push(ExprOrSpread {
                spread: None,
                expr: self.parse_assignment_expression()?,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        if subjects.len() == 1 {
            Ok(subjects.pop().expect("single match subject").expr)
        } else {
            Ok(Box::new(Expr::Array(ArrayLit {
                span: Span::new_with_checked(start, self.previous_end()),
                elems: subjects.into_iter().map(Some).collect(),
            })))
        }
    }

    fn flow_match_make_temp_decl(&self, span: Span, ident: &Ident, init: Box<Expr>) -> Stmt {
        Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span,
            ctxt: SyntaxContext::empty(),
            kind: VarDeclKind::Const,
            declare: false,
            decls: vec![VarDeclarator {
                span,
                name: Pat::Ident(BindingIdent {
                    id: ident.clone(),
                    type_ann: None,
                }),
                init: Some(init),
                definite: false,
            }],
        })))
    }

    fn flow_match_binding_to_stmt(&self, binding: FlowMatchBindingInit) -> Stmt {
        Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: binding.span,
            ctxt: SyntaxContext::empty(),
            kind: binding.kind,
            declare: false,
            decls: vec![VarDeclarator {
                span: binding.span,
                name: binding.pat,
                init: Some(binding.init),
                definite: false,
            }],
        })))
    }

    fn flow_match_non_exhaustive_throw(&self, span: Span) -> Stmt {
        Stmt::Throw(ThrowStmt {
            span,
            arg: Box::new(Expr::New(NewExpr {
                span,
                ctxt: SyntaxContext::empty(),
                callee: Box::new(Expr::Ident(Ident::new_no_ctxt("Error".into(), span))),
                args: Some(vec![ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Lit(Lit::Str(Str {
                        span,
                        value: "Non-exhaustive match".into(),
                        raw: None,
                    }))),
                }]),
                type_args: None,
            })),
        })
    }

    fn flow_match_make_iife(&self, span: Span, stmts: Vec<Stmt>) -> Box<Expr> {
        Box::new(Expr::Call(CallExpr {
            span,
            ctxt: SyntaxContext::empty(),
            callee: Callee::Expr(Box::new(Expr::Fn(FnExpr {
                ident: None,
                function: Box::new(Function {
                    params: Vec::new(),
                    decorators: Vec::new(),
                    span,
                    ctxt: SyntaxContext::empty(),
                    body: Some(BlockStmt {
                        span,
                        ctxt: SyntaxContext::empty(),
                        stmts,
                    }),
                    is_generator: false,
                    is_async: false,
                    type_params: None,
                    return_type: None,
                }),
            }))),
            args: Vec::new(),
            type_args: None,
        }))
    }

    /// Parse a Flow match expression and lower it directly into standard SWC
    /// expression and statement nodes.
    pub(crate) fn parse_flow_match_expression(&mut self) -> Result<Box<Expr>, Error> {
        let start = self.token().start();
        let span = self.token().span();
        let subject = self.flow_match_parse_subject(start)?;
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let temp = Ident::new_no_ctxt(format!("__match_subject_{}", span.lo.0).into(), span);
        let temp_expr = Box::new(Expr::Ident(temp.clone()));
        let mut statements = vec![self.flow_match_make_temp_decl(span, &temp, subject)];
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            let pattern = self.flow_match_parse_pattern()?;
            let guard = if self.eat(Kind::If) {
                Some(self.parse_expression()?)
            } else {
                None
            };
            self.flow_match_expect_case_separator()?;
            let body = self.parse_assignment_expression()?;
            let lowered = self.flow_match_lower_pattern(span, temp_expr.clone(), &pattern);
            let test = if let Some(guard) = guard {
                self.flow_match_and_expr(span, lowered.predicate, guard)
            } else {
                lowered.predicate
            };
            let mut consequent = lowered
                .bindings
                .into_iter()
                .map(|binding| self.flow_match_binding_to_stmt(binding))
                .collect::<Vec<_>>();
            consequent.push(Stmt::Return(ReturnStmt {
                span,
                arg: Some(body),
            }));
            statements.push(Stmt::If(IfStmt {
                span,
                test,
                cons: Box::new(Stmt::Block(BlockStmt {
                    span,
                    ctxt: SyntaxContext::empty(),
                    stmts: consequent,
                })),
                alt: None,
            }));
            self.eat(Kind::Comma);
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        statements.push(self.flow_match_non_exhaustive_throw(span));
        Ok(self.flow_match_make_iife(span, statements))
    }

    /// Parse a Flow match statement and lower its cases into a single
    /// temporary declaration followed by an if/else-if chain.
    pub(crate) fn parse_flow_match_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        let span = self.token().span();
        let subject = self.flow_match_parse_subject(start)?;
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let temp = Ident::new_no_ctxt(format!("__match_subject_{}", span.lo.0).into(), span);
        let temp_expr = Box::new(Expr::Ident(temp.clone()));
        let mut cases = Vec::with_capacity(4);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            let pattern = self.flow_match_parse_pattern()?;
            let guard = if self.eat(Kind::If) {
                Some(self.parse_expression()?)
            } else {
                None
            };
            self.flow_match_expect_case_separator()?;
            if !self.at(Kind::LBrace) {
                return Err(self.expected_error(Kind::LBrace));
            }
            let body = self.parse_block_statement()?;
            let lowered = self.flow_match_lower_pattern(span, temp_expr.clone(), &pattern);
            let test = if let Some(guard) = guard {
                self.flow_match_and_expr(span, lowered.predicate, guard)
            } else {
                lowered.predicate
            };
            let mut statements = lowered
                .bindings
                .into_iter()
                .map(|binding| self.flow_match_binding_to_stmt(binding))
                .collect::<Vec<_>>();
            statements.extend(body.stmts);
            cases.push(IfStmt {
                span,
                test,
                cons: Box::new(Stmt::Block(BlockStmt {
                    span,
                    ctxt: SyntaxContext::empty(),
                    stmts: statements,
                })),
                alt: None,
            });
            self.eat(Kind::Comma);
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        let mut tail = None;
        for mut case in cases.into_iter().rev() {
            case.alt = tail;
            tail = Some(Box::new(Stmt::If(case)));
        }
        let mut statements = vec![self.flow_match_make_temp_decl(span, &temp, subject)];
        if let Some(statement) = tail {
            statements.push(*statement);
        }
        Ok(Stmt::Block(BlockStmt {
            span,
            ctxt: SyntaxContext::empty(),
            stmts: statements,
        }))
    }
}
