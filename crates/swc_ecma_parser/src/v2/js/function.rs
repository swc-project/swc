use std::cell::Cell;

use swc_common::Span;
use swc_ecma_ast::*;

use super::{
    super::{
        lexer::Kind,
        modifiers::{ModifierFlags, ModifierKind, Modifiers},
        Context, ParserImpl, StatementContext,
    },
    FunctionKind,
};
use crate::v2::{diagnostics, diagnostics::Result};

impl FunctionKind {
    pub(crate) fn is_id_required(self) -> bool {
        matches!(self, Self::Declaration)
    }

    pub(crate) fn is_expression(self) -> bool {
        self == Self::Expression
    }
}

impl<'a> ParserImpl<'a> {
    pub(crate) fn at_function_with_async(&mut self) -> bool {
        self.at(Kind::Function)
            || self.at(Kind::Async)
                && self.peek_at(Kind::Function)
                && !self.peek_token().is_on_new_line
    }

    pub(crate) fn parse_function_body(&mut self) -> Result<Box<FunctionBody<'a>>> {
        let span = self.start_span();
        self.expect(Kind::LCurly)?;

        let (directives, statements) = self.context(Context::Return, Context::empty(), |p| {
            p.parse_directives_and_statements(/* is_top_level */ false)
        })?;

        self.expect(Kind::RCurly)?;
        Ok(self
            .ast
            .alloc_function_body(self.end_span(span), directives, statements))
    }

    pub(crate) fn parse_formal_parameters(
        &mut self,
        params_kind: FormalParamKind,
    ) -> Result<(Option<TsThisParam<'a>>, Box<FormalParams<'a>>)> {
        let span = self.start_span();
        self.expect(Kind::LParen)?;
        let this_param = if self.ts_enabled() && self.at(Kind::This) {
            let param = self.parse_ts_this_parameter()?;
            if !self.at(Kind::RParen) {
                self.expect(Kind::Comma)?;
            }
            Some(param)
        } else {
            None
        };
        let (list, rest) = self.parse_delimited_list_with_rest(
            Kind::RParen,
            Self::parse_formal_parameter,
            Self::parse_rest_parameter,
        )?;
        self.expect(Kind::RParen)?;
        let formal_parameters =
            self.ast
                .alloc_formal_parameters(self.end_span(span), params_kind, list, rest);
        Ok((this_param, formal_parameters))
    }

    fn parse_parameter_modifiers(&mut self) -> Modifiers<'a> {
        let modifiers = self.parse_class_element_modifiers(true);
        self.verify_modifiers(
            &modifiers,
            ModifierFlags::ACCESSIBILITY
                .union(ModifierFlags::READONLY)
                .union(ModifierFlags::OVERRIDE),
            diagnostics::cannot_appear_on_a_parameter,
        );
        modifiers
    }

    fn parse_formal_parameter(&mut self) -> Result<FormalParam<'a>> {
        let span = self.start_span();
        self.eat_decorators()?;
        let modifiers = self.parse_parameter_modifiers();
        let pattern = self.parse_binding_pattern_with_initializer()?;
        let decorators = self.consume_decorators();
        Ok(self.ast.formal_parameter(
            self.end_span(span),
            decorators,
            pattern,
            modifiers.accessibility(),
            modifiers.contains_readonly(),
            modifiers.contains_override(),
        ))
    }

    fn parse_rest_parameter(&mut self) -> Result<BindingRestElement<'a>> {
        let element = self.parse_rest_element()?;
        if self.at(Kind::Comma) {
            if matches!(self.peek_kind(), Kind::RCurly | Kind::RBrack) {
                let span = self.cur_token().span();
                self.bump_any();
                self.error(diagnostics::binding_rest_element_trailing_comma(span));
            }
            if !self.ctx.has_ambient() {
                self.error(diagnostics::rest_parameter_last(element.span));
            }
        }
        Ok(element)
    }

    pub(crate) fn parse_function(
        &mut self,
        span: Span,
        id: Option<BindingIdent<'a>>,
        is_async: bool,
        generator: bool,
        func_kind: FunctionKind,
        modifiers: &Modifiers<'a>,
    ) -> Result<Box<Function>> {
        let ctx = self.ctx;
        self.ctx = self
            .ctx
            .and_in(true)
            .and_await(is_async)
            .and_yield(generator);

        let type_parameters = self.parse_ts_type_parameters()?;

        let (this_param, params) = self.parse_formal_parameters(FormalParamKind::FormalParam)?;

        let return_type =
            self.parse_ts_return_type_annotation(Kind::Colon, /* is_type */ true)?;

        let body = if self.at(Kind::LCurly) {
            Some(self.parse_function_body()?)
        } else {
            None
        };

        self.ctx = self
            .ctx
            .and_in(ctx.has_in())
            .and_await(ctx.has_await())
            .and_yield(ctx.has_yield());

        if !self.ts_enabled() && body.is_none() {
            return Err(self.unexpected());
        }

        let function_type = match func_kind {
            FunctionKind::Declaration | FunctionKind::DefaultExport => {
                if body.is_none() {
                    FunctionType::TsDeclareFunction
                } else {
                    FunctionType::FunctionDeclaration
                }
            }
            FunctionKind::Expression { .. } => {
                if body.is_none() {
                    FunctionType::TsEmptyBodyFunctionExpression
                } else {
                    FunctionType::FunctionExpression
                }
            }
            FunctionKind::TsDeclaration { .. } => FunctionType::TsDeclareFunction,
        };

        if FunctionType::TsDeclareFunction == function_type
            || FunctionType::TsEmptyBodyFunctionExpression == function_type
        {
            self.asi()?;
        }

        self.verify_modifiers(
            modifiers,
            ModifierFlags::DECLARE | ModifierFlags::ASYNC,
            diagnostics::modifier_cannot_be_used_here,
        );

        Ok(self.ast.alloc_function(
            function_type,
            self.end_span(span),
            id,
            generator,
            is_async,
            modifiers.contains_declare(),
            type_parameters,
            this_param,
            params,
            return_type,
            body,
        ))
    }

    /// [Function Declaration](https://tc39.es/ecma262/#prod-FunctionDeclaration)
    pub(crate) fn parse_function_declaration(
        &mut self,
        stmt_ctx: StatementContext,
    ) -> Result<Stmt> {
        let func_kind = FunctionKind::Declaration;
        let decl = self.parse_function_impl(func_kind)?;
        if stmt_ctx.is_single_statement() {
            if decl.is_async {
                self.error(diagnostics::async_function_declaration(Span::new(
                    decl.span.lo,
                    decl.params.span.hi,
                )));
            } else if decl.generator {
                self.error(diagnostics::generator_function_declaration(Span::new(
                    decl.span.lo,
                    decl.params.span.hi,
                )));
            }
        }

        Ok(Stmt::FunctionDeclaration(decl))
    }

    /// Parse function implementation in Javascript, cursor
    /// at `function` or `async function`
    pub(crate) fn parse_function_impl(&mut self, func_kind: FunctionKind) -> Result<Box<Function>> {
        let span = self.start_span();
        let is_async = self.eat(Kind::Async);
        self.expect(Kind::Function)?;
        let generator = self.eat(Kind::Star);
        let id = self.parse_function_id(func_kind, is_async, generator)?;
        self.parse_function(
            span,
            id,
            is_async,
            generator,
            func_kind,
            &Modifiers::empty(),
        )
    }

    /// Parse function implementation in Typescript, cursor
    /// at `function`
    pub(crate) fn parse_ts_function_impl(
        &mut self,
        start_span: Span,
        func_kind: FunctionKind,
        modifiers: &Modifiers<'a>,
    ) -> Result<Box<Function>> {
        let is_async = modifiers.contains(ModifierKind::Async);
        self.expect(Kind::Function)?;
        let generator = self.eat(Kind::Star);
        let id = self.parse_function_id(func_kind, is_async, generator)?;
        self.parse_function(start_span, id, is_async, generator, func_kind, modifiers)
    }

    /// [Function Expression](https://tc39.es/ecma262/#prod-FunctionExpression)
    pub(crate) fn parse_function_expression(&mut self, span: Span, is_async: bool) -> Result<Expr> {
        let func_kind = FunctionKind::Expression;
        self.expect(Kind::Function)?;

        let generator = self.eat(Kind::Star);
        let id = self.parse_function_id(func_kind, is_async, generator)?;
        let function = self.parse_function(
            span,
            id,
            is_async,
            generator,
            func_kind,
            &Modifiers::empty(),
        )?;

        Ok(self.ast.expr_from_function(function))
    }

    /// Section 15.4 Method Definitions
    /// `ClassMemberName` ( `UniqueFormalParams` ) { `FunctionBody` }
    /// `GeneratorMethod`
    ///   * `ClassMemberName`
    /// `AsyncMethod`
    ///   async `ClassMemberName`
    /// `AsyncGeneratorMethod`
    ///   async * `ClassMemberName`
    pub(crate) fn parse_method(
        &mut self,
        is_async: bool,
        generator: bool,
    ) -> Result<Box<Function>> {
        let span = self.start_span();
        self.parse_function(
            span,
            None,
            is_async,
            generator,
            FunctionKind::Expression,
            &Modifiers::empty(),
        )
    }

    /// Section 15.5 Yield Expression
    /// yield
    /// yield [no `LineTerminator` here] `AssignExpression`
    /// yield [no `LineTerminator` here] * `AssignExpression`
    pub(crate) fn parse_yield_expression(&mut self) -> Result<Expr> {
        let span = self.start_span();
        self.bump_any(); // advance `yield`

        let has_yield = self.ctx.has_yield();
        if !has_yield {
            self.error(diagnostics::yield_expression(Span::new(
                span.lo,
                span.lo + 5,
            )));
        }

        let mut delegate = false;
        let mut argument = None;

        if !self.cur_token().is_on_new_line {
            delegate = self.eat(Kind::Star);
            let not_assignment_expr = matches!(
                self.cur_kind(),
                Kind::Semicolon
                    | Kind::Eof
                    | Kind::RCurly
                    | Kind::RParen
                    | Kind::RBrack
                    | Kind::Colon
                    | Kind::Comma
            );
            if !not_assignment_expr || delegate {
                self.ctx = self.ctx.union_yield_if(true);
                argument = Some(self.parse_assignment_expression_or_higher()?);
                self.ctx = self.ctx.and_yield(has_yield);
            }
        }

        Ok(self.ast.expr_yield(self.end_span(span), delegate, argument))
    }

    // id: None - for AnonymousDefaultExportedFunctionDeclaration
    pub(crate) fn parse_function_id(
        &mut self,
        kind: FunctionKind,
        is_async: bool,
        generator: bool,
    ) -> Result<Option<BindingIdent<'a>>> {
        let ctx = self.ctx;
        if kind.is_expression() {
            self.ctx = self.ctx.and_await(is_async).and_yield(generator);
        }
        let id = self.cur_kind().is_binding_identifier().then(|| {
            let (span, name) = self.parse_identifier_kind(Kind::Ident);
            self.check_identifier(span, &name);
            BindingIdent {
                span,
                name,
                symbol_id: Cell::default(),
            }
        });
        self.ctx = ctx;

        if kind.is_id_required() && id.is_none() {
            match self.cur_kind() {
                Kind::LParen => {
                    self.error(diagnostics::expect_function_name(self.cur_token().span()));
                }
                kind if kind.is_reserved_keyword() => self.expect_without_advance(Kind::Ident)?,
                _ => {}
            }
        }

        Ok(id)
    }
}
