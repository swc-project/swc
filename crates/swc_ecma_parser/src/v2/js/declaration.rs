use oxc_allocator::Box;
use swc_common::Span;
use swc_ecma_ast::{Stmt, *};

use super::{VarDeclarationContext, VarDeclarationParent};
use crate::v2::{
    diagnostics,
    diagnostics::Result,
    lexer::Kind,
    modifiers::{ModifierFlags, Modifiers},
    ParserImpl, StatementContext,
};

impl<'a> ParserImpl<'a> {
    pub(crate) fn parse_let(&mut self, stmt_ctx: StatementContext) -> Result<Stmt> {
        let span = self.start_span();
        let peeked = self.peek_kind();
        // let = foo, let instanceof x, let + 1
        if peeked.is_assignment_operator() || peeked.is_binary_operator() {
            let expr = self.parse_assignment_expression_or_higher()?;
            self.parse_expression_statement(span, expr)
        // let.a = 1, let()[a] = 1
        } else if matches!(peeked, Kind::Dot | Kind::LParen) {
            let expr = self.parse_expr()?;
            Ok(self.ast.statement_expression(self.end_span(span), expr))
        // single statement let declaration: while (0) let
        } else if (stmt_ctx.is_single_statement() && peeked != Kind::LBrack)
            || peeked == Kind::Semicolon
        {
            let expr = self.parse_identifier_expression()?;
            self.parse_expression_statement(span, expr)
        } else {
            self.parse_variable_statement(stmt_ctx)
        }
    }

    pub(crate) fn parse_using(&mut self) -> Result<Stmt> {
        let using_decl = self.parse_using_declaration(StatementContext::StatementList)?;

        self.asi()?;

        Ok(Stmt::UsingDeclaration(self.ast.alloc(using_decl)))
    }

    pub(crate) fn parse_variable_declaration(
        &mut self,
        start_span: Span,
        decl_ctx: VarDeclarationContext,
        modifiers: &Modifiers<'a>,
    ) -> Result<Box<VarDecl>> {
        let kind = match self.cur_kind() {
            Kind::Var => VarDeclKind::Var,
            Kind::Const => VarDeclKind::Const,
            Kind::Let => VarDeclKind::Let,
            _ => return Err(self.unexpected()),
        };
        self.bump_any();

        let mut declarations = self.ast.vec();
        loop {
            let declaration = self.parse_variable_declarator(decl_ctx, kind)?;
            declarations.push(declaration);
            if !self.eat(Kind::Comma) {
                break;
            }
        }

        if matches!(
            decl_ctx.parent,
            VarDeclarationParent::Statement | VarDeclarationParent::Clause
        ) {
            self.asi()?;
        }

        self.verify_modifiers(
            modifiers,
            ModifierFlags::DECLARE,
            diagnostics::modifier_cannot_be_used_here,
        );

        Ok(self.ast.alloc_variable_declaration(
            self.end_span(start_span),
            kind,
            declarations,
            modifiers.contains_declare(),
        ))
    }

    fn parse_variable_declarator(
        &mut self,
        decl_ctx: VarDeclarationContext,
        kind: VarDeclKind,
    ) -> Result<VarDeclarator> {
        let span = self.start_span();

        let mut binding_kind = self.parse_binding_pattern_kind()?;

        let (id, definite) = if self.ts_enabled() {
            // const x!: number = 1
            //        ^ definite
            let mut definite = false;
            if binding_kind.is_binding_identifier()
                && self.at(Kind::Bang)
                && !self.cur_token().is_on_new_line
            {
                self.eat(Kind::Bang);
                definite = true;
            }
            let optional = self.eat(Kind::Question); // not allowed, but checked in checker/typescript.rs
            let type_annotation = self.parse_ts_type_annotation()?;
            if let Some(type_annotation) = &type_annotation {
                Self::extend_binding_pattern_span_end(type_annotation.span, &mut binding_kind);
            }
            (
                self.ast
                    .binding_pattern(binding_kind, type_annotation, optional),
                definite,
            )
        } else {
            (
                self.ast
                    .binding_pattern(binding_kind, Option::<TsTypeAnn>::None, false),
                false,
            )
        };

        let init = self
            .eat(Kind::Eq)
            .then(|| self.parse_assignment_expression_or_higher())
            .transpose()?;

        if init.is_none() && decl_ctx.parent == VarDeclarationParent::Statement {
            // LexicalBinding[In, Yield, Await] :
            //   BindingIdent[?Yield, ?Await] Initializer[?In, ?Yield, ?Await] opt
            //   BindingPattern[?Yield, ?Await] Initializer[?In, ?Yield, ?Await]
            // the grammar forbids `let []`, `let {}`
            if !matches!(id.kind, BindingPatternKind::BindingIdent(_)) {
                self.error(diagnostics::invalid_destrucuring_declaration(id.span()));
            } else if kind == VarDeclKind::Const && !self.ctx.has_ambient() {
                // It is a Syntax Error if Initializer is not present and IsConstantDeclaration
                // of the LexicalDeclaration containing this LexicalBinding is true.
                self.error(diagnostics::missinginitializer_in_const(id.span()));
            }
        }

        Ok(self
            .ast
            .variable_declarator(self.end_span(span), kind, id, init, definite))
    }

    /// Section 14.3.1 Let, Const, and Using Declarations
    /// UsingDeclaration[In, Yield, Await] :
    /// using [no LineTerminator here] [lookahead ≠ await] BindingList[?In,
    /// ?Yield, ?Await, ~Pattern] ;
    pub(crate) fn parse_using_declaration(
        &mut self,
        statement_ctx: StatementContext,
    ) -> Result<UsingDecl> {
        let span = self.start_span();

        let is_await = self.eat(Kind::Await);

        self.expect(Kind::Using)?;

        // `[no LineTerminator here]`
        if self.cur_token().is_on_new_line {
            self.error(diagnostics::line_terminator_before_using_declaration(
                self.cur_token().span(),
            ));
        }

        // [lookahead ≠ await]
        if self.cur_kind() == Kind::Await {
            self.error(diagnostics::await_in_using_declaration(
                self.cur_token().span(),
            ));
            self.eat(Kind::Await);
        }

        // BindingList[?In, ?Yield, ?Await, ~Pattern]
        let mut declarations: oxc_allocator::Vec<'_, VarDeclarator> = self.ast.vec();
        loop {
            let declaration = self.parse_variable_declarator(
                VarDeclarationContext::new(VarDeclarationParent::Statement),
                VarDeclKind::Var,
            )?;

            match declaration.id.kind {
                BindingPatternKind::BindingIdent(_) => {}
                _ => {
                    self.error(diagnostics::invalid_identifier_in_using_declaration(
                        declaration.id.span(),
                    ));
                }
            }

            // Excluding `for` loops, an initializer is required in a UsingDeclaration.
            if declaration.init.is_none() && !matches!(statement_ctx, StatementContext::For) {
                self.error(diagnostics::using_declarations_must_be_initialized(
                    declaration.id.span(),
                ));
            }

            declarations.push(declaration);
            if !self.eat(Kind::Comma) {
                break;
            }
        }

        Ok(self
            .ast
            .using_declaration(self.end_span(span), is_await, declarations))
    }
}
