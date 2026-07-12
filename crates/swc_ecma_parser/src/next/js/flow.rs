//! Flow expression extensions and their deterministic SWC AST lowering.

use swc_common::SyntaxContext;
use swc_ecma_ast::{
    BinExpr, BinaryOp, BindingIdent, BlockStmt, CallExpr, Callee, Decl, Expr, ExprOrSpread, FnExpr,
    Function, Ident, IfStmt, Lit, NewExpr, Pat, ReturnStmt, Stmt, Str, ThrowStmt, VarDecl,
    VarDeclKind, VarDeclarator,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    /// Parse Flow's `match` expression and lower it to ordinary SWC nodes.
    pub(crate) fn parse_flow_match_expression(&mut self) -> Result<Box<Expr>, Error> {
        let start = self.token().start();
        let lowering_span = self.token().span();
        self.advance();
        if !self.expect(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }
        let subject = self.parse_assignment_expression()?;
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }

        let temp = Ident::new_no_ctxt(format!("__match_subject_{}", start.0).into(), lowering_span);
        let mut statements = Vec::with_capacity(4);
        statements.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: lowering_span,
            ctxt: SyntaxContext::empty(),
            kind: VarDeclKind::Const,
            declare: false,
            decls: vec![VarDeclarator {
                span: lowering_span,
                name: Pat::Ident(BindingIdent {
                    id: temp.clone(),
                    type_ann: None,
                }),
                init: Some(subject),
                definite: false,
            }],
        }))));

        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            let pattern = self.parse_conditional_expression()?;
            if !self.eat(Kind::Arrow) && !self.eat(Kind::Colon) {
                return Err(self.expected_error(Kind::Arrow));
            }
            let value = self.parse_assignment_expression()?;
            statements.push(Stmt::If(IfStmt {
                span: lowering_span,
                test: Box::new(Expr::Bin(BinExpr {
                    span: lowering_span,
                    op: BinaryOp::EqEqEq,
                    left: Box::new(Expr::Ident(temp.clone())),
                    right: pattern,
                })),
                cons: Box::new(Stmt::Block(BlockStmt {
                    span: lowering_span,
                    ctxt: SyntaxContext::empty(),
                    stmts: vec![Stmt::Return(ReturnStmt {
                        span: lowering_span,
                        arg: Some(value),
                    })],
                })),
                alt: None,
            }));
            self.eat(Kind::Comma);
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }

        statements.push(Stmt::Throw(ThrowStmt {
            span: lowering_span,
            arg: Box::new(Expr::New(NewExpr {
                span: lowering_span,
                ctxt: SyntaxContext::empty(),
                callee: Box::new(Expr::Ident(Ident::new_no_ctxt(
                    "Error".into(),
                    lowering_span,
                ))),
                args: Some(vec![ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Lit(Lit::Str(Str {
                        span: lowering_span,
                        value: "Non-exhaustive match".into(),
                        raw: None,
                    }))),
                }]),
                type_args: None,
            })),
        }));

        let function = Box::new(Expr::Fn(FnExpr {
            ident: None,
            function: Box::new(Function {
                params: Vec::new(),
                decorators: Vec::new(),
                span: lowering_span,
                ctxt: SyntaxContext::empty(),
                body: Some(BlockStmt {
                    span: lowering_span,
                    ctxt: SyntaxContext::empty(),
                    stmts: statements,
                }),
                is_generator: false,
                is_async: false,
                type_params: None,
                return_type: None,
            }),
        }));
        Ok(Box::new(Expr::Call(CallExpr {
            span: lowering_span,
            ctxt: SyntaxContext::empty(),
            callee: Callee::Expr(function),
            args: Vec::new(),
            type_args: None,
        })))
    }
}
