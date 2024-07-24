use oxc_allocator::{Box, Vec};
use oxc_diagnostics::Result;
use oxc_span::{Atom, GetSpan, Span};
use swc_ecma_ast::*;

use super::{grammar::CoverGrammar, VariableDeclarationContext, VariableDeclarationParent};
use crate::{
    diagnostics, lexer::Kind, modifiers::Modifiers, Context, ParserImpl, StatementContext,
};

impl<'a> ParserImpl<'a> {
    // Section 12
    // The InputElementHashbangOrRegExp goal is used at the start of a Script
    // or Module.
    pub(crate) fn parse_hashbang(&mut self) -> Option<Hashbang<'a>> {
        if self.cur_kind() == Kind::HashbangComment {
            let span = self.start_span();
            self.bump_any();
            let span = self.end_span(span);
            let src = &self.source_text[span.start as usize + 2..span.end as usize];
            Some(self.ast.hashbang(span, Atom::from(src)))
        } else {
            None
        }
    }

    /// <https://tc39.es/ecma262/#prod-StatementList>
    /// `StatementList`[Yield, Await, Return] :
    ///     `StatementListItem`[?Yield, ?Await, ?Return]
    ///     `StatementList`[?Yield, ?Await, ?Return] `StatementListItem`[?Yield,
    /// ?Await, ?Return]
    pub(crate) fn parse_directives_and_statements(
        &mut self,
        is_top_level: bool,
    ) -> Result<(Vec<'a, Directive<'a>>, Vec<'a, Stmt>)> {
        let mut directives = self.ast.vec();
        let mut statements = self.ast.vec();

        let mut expecting_directives = true;
        while !self.at(Kind::Eof) {
            if !is_top_level && self.at(Kind::RCurly) {
                break;
            }
            let stmt = self.parse_statement_list_item(StatementContext::StatementList)?;
            // Section 11.2.1 Directive Prologue
            // The only way to get a correct directive is to parse the statement first and
            // check if it is a string literal. All other method are flawed, see test cases in [babel](https://github.com/babel/babel/blob/main/packages/babel-parser/test/fixtures/core/categorized/not-directive/input.js)
            if expecting_directives {
                if let Stmt::ExpressionStatement(expr) = &stmt {
                    if let Expr::StringLiteral(string) = &expr.expression {
                        // span start will mismatch if they are parenthesized when `preserve_parens
                        // = false`
                        if expr.span.start == string.span.start {
                            let src = &self.source_text
                                [string.span.start as usize + 1..string.span.end as usize - 1];
                            let directive =
                                self.ast
                                    .directive(expr.span, (*string).clone(), Atom::from(src));
                            directives.push(directive);
                            continue;
                        }
                    }
                }
                expecting_directives = false;
            }
            statements.push(stmt);
        }

        Ok((directives, statements))
    }

    /// `StatementListItem`[Yield, Await, Return] :
    ///     Statement[?Yield, ?Await, ?Return]
    ///     Declaration[?Yield, ?Await]
    pub(crate) fn parse_statement_list_item(&mut self, stmt_ctx: StatementContext) -> Result<Stmt> {
        let start_span = self.start_span();

        if self.at(Kind::At) {
            self.eat_decorators()?;
        }

        match self.cur_kind() {
            Kind::LCurly => self.parse_block_statement(),
            Kind::Semicolon => Ok(self.parse_empty_statement()),
            Kind::If => self.parse_if_statement(),
            Kind::Do => self.parse_do_while_statement(),
            Kind::While => self.parse_while_statement(),
            Kind::For => self.parse_for_statement(),
            Kind::Break | Kind::Continue => self.parse_break_or_continue_statement(),
            Kind::With => self.parse_with_statement(),
            Kind::Switch => self.parse_switch_statement(),
            Kind::Throw => self.parse_throw_statement(),
            Kind::Try => self.parse_try_statement(),
            Kind::Debugger => self.parse_debugger_statement(),
            Kind::Class => self.parse_class_statement(stmt_ctx, start_span),
            Kind::Import if !matches!(self.peek_kind(), Kind::Dot | Kind::LParen) => {
                self.parse_import_declaration()
            }
            Kind::Export => self.parse_export_declaration(),
            // [+Return] ReturnStatement[?Yield, ?Await]
            Kind::Return => self.parse_return_statement(),
            Kind::Var => self.parse_variable_statement(stmt_ctx),
            Kind::Const if !(self.ts_enabled() && self.is_at_enum_declaration()) => {
                self.parse_variable_statement(stmt_ctx)
            }
            Kind::Let if !self.cur_token().escaped() => self.parse_let(stmt_ctx),
            Kind::Await
                if self.peek_kind() == Kind::Using && self.nth_kind(2).is_binding_identifier() =>
            {
                self.parse_using()
            }
            Kind::Using if self.peek_kind().is_binding_identifier() => self.parse_using(),
            _ if self.at_function_with_async() => self.parse_function_declaration(stmt_ctx),
            _ if self.ts_enabled() && self.at_start_of_ts_declaration() => {
                self.parse_ts_declaration_statement(start_span)
            }
            _ => self.parse_expression_or_labeled_statement(),
        }
    }

    fn parse_expression_or_labeled_statement(&mut self) -> Result<Stmt> {
        let span = self.start_span();
        let expr = self.parse_expr()?;
        if let Expr::Identifier(ident) = &expr {
            // Section 14.13 Labelled Statement
            // Avoids lookahead for a labeled statement, which is on a hot path
            if self.eat(Kind::Colon) {
                let label = LabelIdentifier {
                    span: ident.span,
                    name: ident.name.clone(),
                };
                let body = self.parse_statement_list_item(StatementContext::Label)?;
                return Ok(self.ast.statement_labeled(self.end_span(span), label, body));
            }
        }
        self.parse_expression_statement(span, expr)
    }

    /// Section 14.2 Block Statement
    pub(crate) fn parse_block(&mut self) -> Result<Box<'a, BlockStmt>> {
        let span = self.start_span();
        self.expect(Kind::LCurly)?;
        let mut body = self.ast.vec();
        while !self.at(Kind::RCurly) && !self.at(Kind::Eof) {
            let stmt = self.parse_statement_list_item(StatementContext::StatementList)?;
            body.push(stmt);
        }
        self.expect(Kind::RCurly)?;
        Ok(self.ast.alloc_block_statement(self.end_span(span), body))
    }

    pub(crate) fn parse_block_statement(&mut self) -> Result<Stmt> {
        let block = self.parse_block()?;
        Ok(Stmt::BlockStatement(block))
    }

    /// Section 14.3.2 Variable Statement
    pub(crate) fn parse_variable_statement(&mut self, stmt_ctx: StatementContext) -> Result<Stmt> {
        let start_span = self.start_span();
        let decl = self.parse_variable_declaration(
            start_span,
            VariableDeclarationContext::new(VariableDeclarationParent::Statement),
            &Modifiers::empty(),
        )?;

        if stmt_ctx.is_single_statement() && decl.kind.is_lexical() {
            self.error(diagnostics::lexical_declaration_single_statement(decl.span));
        }

        Ok(Stmt::VariableDeclaration(decl))
    }

    /// Section 14.4 Empty Statement
    fn parse_empty_statement(&mut self) -> Stmt {
        let span = self.start_span();
        self.bump_any(); // bump `;`
        self.ast.statement_empty(self.end_span(span))
    }

    /// Section 14.5 Expression Statement
    pub(crate) fn parse_expression_statement(
        &mut self,
        span: Span,
        expression: Expr,
    ) -> Result<Stmt> {
        self.asi()?;
        Ok(self
            .ast
            .statement_expression(self.end_span(span), expression))
    }

    /// Section 14.6 If Statement
    fn parse_if_statement(&mut self) -> Result<Stmt> {
        let span = self.start_span();
        self.bump_any(); // bump `if`
        let test = self.parse_paren_expression()?;
        let consequent = self.parse_statement_list_item(StatementContext::If)?;
        let alternate = self
            .eat(Kind::Else)
            .then(|| self.parse_statement_list_item(StatementContext::If))
            .transpose()?;
        Ok(self
            .ast
            .statement_if(self.end_span(span), test, consequent, alternate))
    }

    /// Section 14.7.2 Do-While Statement
    fn parse_do_while_statement(&mut self) -> Result<Stmt> {
        let span = self.start_span();
        self.bump_any(); // advance `do`
        let body = self.parse_statement_list_item(StatementContext::Do)?;
        self.expect(Kind::While)?;
        let test = self.parse_paren_expression()?;
        self.bump(Kind::Semicolon);
        Ok(self.ast.statement_do_while(self.end_span(span), body, test))
    }

    /// Section 14.7.3 While Statement
    fn parse_while_statement(&mut self) -> Result<Stmt> {
        let span = self.start_span();
        self.bump_any(); // bump `while`
        let test = self.parse_paren_expression()?;
        let body = self.parse_statement_list_item(StatementContext::While)?;
        Ok(self.ast.statement_while(self.end_span(span), test, body))
    }

    /// Section 14.7.4 For Statement
    fn parse_for_statement(&mut self) -> Result<Stmt> {
        let span = self.start_span();
        self.bump_any(); // bump `for`

        // [+Await]
        let r#await = self.ctx.has_await() && self.eat(Kind::Await);

        self.expect(Kind::LParen)?;

        // for (;..
        if self.at(Kind::Semicolon) {
            return self.parse_for_loop(span, None, r#await);
        }

        // for (let | for (const | for (var
        // disallow for (let in ..)
        if self.at(Kind::Const)
            || self.at(Kind::Var)
            || (self.at(Kind::Let) && self.peek_kind().is_after_let())
        {
            return self.parse_variable_declaration_for_statement(span, r#await);
        }

        if (self.cur_kind() == Kind::Await && self.peek_kind() == Kind::Using)
            || (self.cur_kind() == Kind::Using && self.peek_kind() == Kind::Ident)
        {
            return self.parse_using_declaration_for_statement(span, r#await);
        }

        let is_let_of = self.at(Kind::Let) && self.peek_at(Kind::Of);
        let is_async_of =
            self.at(Kind::Async) && !self.cur_token().escaped() && self.peek_at(Kind::Of);
        let expr_span = self.start_span();

        if self.at(Kind::RParen) {
            return self.parse_for_loop(span, None, r#await);
        }

        let init_expression =
            self.context(Context::empty(), Context::In, ParserImpl::parse_expr)?;

        // for (a.b in ...), for ([a] in ..), for ({a} in ..)
        if self.at(Kind::In) || self.at(Kind::Of) {
            let target = AssignmentTarget::cover(init_expression, self)
                .map_err(|_| diagnostics::unexpected_token(self.end_span(expr_span)))?;
            let for_stmt_left = ForStatementLeft::from(target);
            if !r#await && is_async_of {
                self.error(diagnostics::for_loop_async_of(self.end_span(expr_span)));
            }
            if is_let_of {
                self.error(diagnostics::unexpected_token(self.end_span(expr_span)));
            }
            return self.parse_for_in_or_of_loop(span, r#await, for_stmt_left);
        }

        self.parse_for_loop(span, Some(ForStatementInit::from(init_expression)), r#await)
    }

    fn parse_variable_declaration_for_statement(
        &mut self,
        span: Span,
        r#await: bool,
    ) -> Result<Stmt> {
        let start_span = self.start_span();
        let init_declaration = self.context(Context::empty(), Context::In, |p| {
            let decl_ctx = VariableDeclarationContext::new(VariableDeclarationParent::For);
            p.parse_variable_declaration(start_span, decl_ctx, &Modifiers::empty())
        })?;

        // for (.. a in) for (.. a of)
        if matches!(self.cur_kind(), Kind::In | Kind::Of) {
            let init = ForStatementLeft::VariableDeclaration(init_declaration);
            return self.parse_for_in_or_of_loop(span, r#await, init);
        }

        let init = Some(ForStatementInit::VariableDeclaration(init_declaration));
        self.parse_for_loop(span, init, r#await)
    }

    fn parse_using_declaration_for_statement(&mut self, span: Span, r#await: bool) -> Result<Stmt> {
        let using_decl = self.parse_using_declaration(StatementContext::For)?;

        if matches!(self.cur_kind(), Kind::In) {
            if using_decl.is_await {
                self.error(
                    diagnostics::await_using_declaration_not_allowed_in_for_in_statement(
                        using_decl.span,
                    ),
                );
            } else {
                self.error(
                    diagnostics::using_declaration_not_allowed_in_for_in_statement(using_decl.span),
                );
            }
        }

        if matches!(self.cur_kind(), Kind::In | Kind::Of) {
            let init = ForStatementLeft::UsingDeclaration(self.ast.alloc(using_decl));
            return self.parse_for_in_or_of_loop(span, r#await, init);
        }

        let init = Some(ForStatementInit::UsingDeclaration(
            self.ast.alloc(using_decl),
        ));
        self.parse_for_loop(span, init, r#await)
    }

    fn parse_for_loop(
        &mut self,
        span: Span,
        init: Option<ForStatementInit<'a>>,
        r#await: bool,
    ) -> Result<Stmt> {
        self.expect(Kind::Semicolon)?;
        let test = if !self.at(Kind::Semicolon) && !self.at(Kind::RParen) {
            Some(self.context(Context::In, Context::empty(), ParserImpl::parse_expr)?)
        } else {
            None
        };
        self.expect(Kind::Semicolon)?;
        let update = if self.at(Kind::RParen) {
            None
        } else {
            Some(self.context(Context::In, Context::empty(), ParserImpl::parse_expr)?)
        };
        self.expect(Kind::RParen)?;
        if r#await {
            self.error(diagnostics::for_await(self.end_span(span)));
        }
        let body = self.parse_statement_list_item(StatementContext::For)?;
        Ok(self
            .ast
            .statement_for(self.end_span(span), init, test, update, body))
    }

    fn parse_for_in_or_of_loop(
        &mut self,
        span: Span,
        r#await: bool,
        left: ForStatementLeft<'a>,
    ) -> Result<Stmt> {
        let is_for_in = self.at(Kind::In);
        self.bump_any(); // bump `in` or `of`
        let right = if is_for_in {
            self.parse_expr()
        } else {
            self.parse_assignment_expression_or_higher()
        }?;
        self.expect(Kind::RParen)?;

        if r#await && is_for_in {
            self.error(diagnostics::for_await(self.end_span(span)));
        }

        let body = self.parse_statement_list_item(StatementContext::For)?;
        let span = self.end_span(span);

        if is_for_in {
            Ok(self.ast.statement_for_in(span, left, right, body))
        } else {
            Ok(self.ast.statement_for_of(span, r#await, left, right, body))
        }
    }

    /// Section 14.8 Continue Statement
    /// Section 14.9 Break Statement
    fn parse_break_or_continue_statement(&mut self) -> Result<Stmt> {
        let span = self.start_span();
        let kind = self.cur_kind();
        self.bump_any(); // bump `break` or `continue`
        let label = if self.can_insert_semicolon() {
            None
        } else {
            Some(self.parse_label_identifier()?)
        };
        self.asi()?;
        let end_span = self.end_span(span);
        match kind {
            Kind::Break => Ok(self.ast.statement_break(end_span, label)),
            Kind::Continue => Ok(self.ast.statement_continue(end_span, label)),
            _ => unreachable!(),
        }
    }

    /// Section 14.10 Return Statement
    /// `ReturnStatement`[Yield, Await] :
    ///   return ;
    ///   return [no `LineTerminator` here] Expression[+In, ?Yield, ?Await] ;
    fn parse_return_statement(&mut self) -> Result<Stmt> {
        let span = self.start_span();
        self.bump_any(); // advance `return`
        let argument = if self.eat(Kind::Semicolon) || self.can_insert_semicolon() {
            None
        } else {
            let expr = self.context(Context::In, Context::empty(), ParserImpl::parse_expr)?;
            self.asi()?;
            Some(expr)
        };
        if !self.ctx.has_return() {
            self.error(diagnostics::return_statement_only_in_function_body(
                Span::new(span.start, span.start + 6),
            ));
        }
        Ok(self.ast.statement_return(self.end_span(span), argument))
    }

    /// Section 14.11 With Statement
    fn parse_with_statement(&mut self) -> Result<Stmt> {
        let span = self.start_span();
        self.bump_any(); // bump `with`
        let object = self.parse_paren_expression()?;
        let body = self.parse_statement_list_item(StatementContext::With)?;
        let span = self.end_span(span);
        Ok(self.ast.statement_with(span, object, body))
    }

    /// Section 14.12 Switch Statement
    fn parse_switch_statement(&mut self) -> Result<Stmt> {
        let span = self.start_span();
        self.bump_any(); // advance `switch`
        let discriminant = self.parse_paren_expression()?;
        let cases = self.parse_normal_list(Kind::LCurly, Kind::RCurly, Self::parse_switch_case)?;
        Ok(self
            .ast
            .statement_switch(self.end_span(span), discriminant, cases))
    }

    pub(crate) fn parse_switch_case(&mut self) -> Result<Option<SwitchCase<'a>>> {
        let span = self.start_span();
        let test = match self.cur_kind() {
            Kind::Default => {
                self.bump_any();
                None
            }
            Kind::Case => {
                self.bump_any();
                let expression = self.parse_expr()?;
                Some(expression)
            }
            _ => return Err(self.unexpected()),
        };
        self.expect(Kind::Colon)?;
        let mut consequent = self.ast.vec();
        while !matches!(
            self.cur_kind(),
            Kind::Case | Kind::Default | Kind::RCurly | Kind::Eof
        ) {
            let stmt = self.parse_statement_list_item(StatementContext::StatementList)?;
            consequent.push(stmt);
        }
        Ok(Some(self.ast.switch_case(
            self.end_span(span),
            test,
            consequent,
        )))
    }

    /// Section 14.14 Throw Statement
    fn parse_throw_statement(&mut self) -> Result<Stmt> {
        let span = self.start_span();
        self.bump_any(); // advance `throw`
        if self.cur_token().is_on_new_line {
            self.error(diagnostics::illegal_newline(
                "throw",
                self.end_span(span),
                self.cur_token().span(),
            ));
        }
        let argument = self.parse_expr()?;
        self.asi()?;
        Ok(self.ast.statement_throw(self.end_span(span), argument))
    }

    /// Section 14.15 Try Statement
    fn parse_try_statement(&mut self) -> Result<Stmt> {
        let span = self.start_span();
        self.bump_any(); // bump `try`

        let block = self.parse_block()?;

        let handler = self
            .at(Kind::Catch)
            .then(|| self.parse_catch_clause())
            .transpose()?;

        let finalizer = self
            .eat(Kind::Finally)
            .then(|| self.parse_block())
            .transpose()?;

        if handler.is_none() && finalizer.is_none() {
            let range = Span::new(block.span.end, block.span.end);
            self.error(diagnostics::expect_catch_finally(range));
        }

        Ok(self
            .ast
            .statement_try(self.end_span(span), block, handler, finalizer))
    }

    fn parse_catch_clause(&mut self) -> Result<Box<'a, CatchClause<'a>>> {
        let span = self.start_span();
        self.bump_any(); // advance `catch`
        let pattern = if self.eat(Kind::LParen) {
            let pattern = self.parse_binding_pattern(false)?;
            self.expect(Kind::RParen)?;
            Some(pattern)
        } else {
            None
        };
        let body = self.parse_block()?;
        let param = pattern.map(|pattern| self.ast.catch_parameter(pattern.kind.span(), pattern));
        Ok(self
            .ast
            .alloc_catch_clause(self.end_span(span), param, body))
    }

    /// Section 14.16 Debugger Statement
    fn parse_debugger_statement(&mut self) -> Result<Stmt> {
        let span = self.start_span();
        self.bump_any();
        self.asi()?;
        Ok(self.ast.statement_debugger(self.end_span(span)))
    }
}
