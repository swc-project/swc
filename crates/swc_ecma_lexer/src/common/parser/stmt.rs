use swc_ecma_ast::*;

use super::{buffer::Buffer, PResult, Parser};
use crate::{
    common::{context::Context, lexer::token::TokenFactory},
    error::SyntaxError,
};

#[allow(clippy::enum_variant_names)]
pub enum TempForHead {
    For {
        init: Option<VarDeclOrExpr>,
        test: Option<Box<Expr>>,
        update: Option<Box<Expr>>,
    },
    ForIn {
        left: ForHead,
        right: Box<Expr>,
    },
    ForOf {
        left: ForHead,
        right: Box<Expr>,
    },
}

pub fn parse_normal_for_head<'a, P: Parser<'a>>(
    p: &mut P,
    init: Option<VarDeclOrExpr>,
) -> PResult<TempForHead> {
    let test = if p.input_mut().eat(&P::Token::SEMI) {
        None
    } else {
        let test = p.include_in_expr(true).parse_expr().map(Some)?;
        p.input_mut().eat(&P::Token::SEMI);
        test
    };

    let update = if p.input_mut().is(&P::Token::RPAREN) {
        None
    } else {
        p.include_in_expr(true).parse_expr().map(Some)?
    };

    Ok(TempForHead::For { init, test, update })
}

pub fn parse_for_each_head<'a, P: Parser<'a>>(p: &mut P, left: ForHead) -> PResult<TempForHead> {
    let is_of = p.bump().is_of();
    if is_of {
        let right = p.include_in_expr(true).parse_assignment_expr()?;
        Ok(TempForHead::ForOf { left, right })
    } else {
        if let ForHead::UsingDecl(d) = &left {
            p.emit_err(d.span, SyntaxError::UsingDeclNotAllowedForForInLoop)
        }
        let right = p.include_in_expr(true).parse_expr()?;
        Ok(TempForHead::ForIn { left, right })
    }
}

pub fn parse_return_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let start = p.cur_pos();

    let stmt = p.parse_with(|p| {
        p.assert_and_bump(&P::Token::RETURN)?;

        let arg = if p.is_general_semi() {
            None
        } else {
            p.include_in_expr(true).parse_expr().map(Some)?
        };
        p.expect_general_semi()?;
        Ok(ReturnStmt {
            span: p.span(start),
            arg,
        }
        .into())
    });

    if !p.ctx().contains(Context::InFunction) && !p.input().syntax().allow_return_outside_function()
    {
        p.emit_err(p.span(start), SyntaxError::ReturnNotAllowed);
    }

    stmt
}
