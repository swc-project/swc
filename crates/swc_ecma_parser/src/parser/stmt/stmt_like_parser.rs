use swc_ecma_ast::{Decorator, ExprStmt, ModuleItem, Stmt};

use crate::{
    error::SyntaxError, input::Tokens, lexer::Token, parser::stmt::is_directive::IsDirective,
    Context, PResult, Parser,
};

pub(super) trait StmtLikeParser<'a, Type: IsDirective> {
    fn handle_import_export(
        &mut self,
        top_level: bool,
        decorators: Vec<Decorator>,
    ) -> PResult<Type>;
}

impl<'a, I: Tokens, T> StmtLikeParser<'a, Box<T>> for Parser<I>
where
    T: IsDirective,
    Self: StmtLikeParser<'a, T>,
{
    fn handle_import_export(
        &mut self,
        top_level: bool,
        decorators: Vec<Decorator>,
    ) -> PResult<Box<T>> {
        <Self as StmtLikeParser<T>>::handle_import_export(self, top_level, decorators).map(Box::new)
    }
}

impl<I: Tokens> StmtLikeParser<'_, Stmt> for Parser<I> {
    fn handle_import_export(&mut self, _: bool, _: Vec<Decorator>) -> PResult<Stmt> {
        let start = self.cur_pos();
        if self.input.is(Token::Import) && self.input.peek().is_some_and(|t| t == Token::LParen) {
            let expr = self.parse_expr()?;

            self.input.eat(Token::Semi);

            return Ok(ExprStmt {
                span: span!(self, start),
                expr,
            }
            .into());
        }

        if self.input.is(Token::Import) && self.input.peek().is_some_and(|t| t == Token::Dot) {
            let expr = self.parse_expr()?;

            self.input.eat(Token::Semi);

            return Ok(ExprStmt {
                span: span!(self, start),
                expr,
            }
            .into());
        }

        syntax_error!(self, SyntaxError::ImportExportInScript);
    }
}

pub(crate) fn handle_import_export<I: Tokens>(
    p: &mut Parser<I>,
    decorators: Vec<Decorator>,
) -> PResult<ModuleItem> {
    if !p
        .ctx()
        .intersects(Context::TopLevel.union(Context::TsModuleBlock))
    {
        syntax_error!(p, SyntaxError::NonTopLevelImportExport);
    }

    let decl = if p.input().is(Token::IMPORT) {
        p.parse_import()?
    } else if p.input().is(Token::EXPORT) {
        p.parse_export(decorators).map(ModuleItem::from)?
    } else {
        unreachable!(
            "handle_import_export should not be called if current token isn't import nor export"
        )
    };

    Ok(decl)
}
