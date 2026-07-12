//! JavaScript statements and script bodies.

use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    BlockStmt, BreakStmt, CatchClause, ContinueStmt, DebuggerStmt, Decl, DoWhileStmt, EmptyStmt,
    ExprStmt, ForHead, ForInStmt, ForOfStmt, ForStmt, Ident, IfStmt, LabeledStmt, ReturnStmt,
    Script, Stmt, SwitchCase, SwitchStmt, ThrowStmt, TryStmt, VarDecl, VarDeclKind, VarDeclOrExpr,
    VarDeclarator, WhileStmt, WithStmt,
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
    /// Parse a script body using the independent lexer and direct SWC AST
    /// nodes.
    pub(crate) fn parse_script(&mut self) -> Result<Script, Error> {
        let start = self.token().start();
        let mut body = Vec::with_capacity(8);
        while !self.at(Kind::Eof) {
            body.push(self.parse_statement()?);
        }
        Ok(Script {
            span: Span::new_with_checked(start, self.token().end()),
            body,
            shebang: None,
        })
    }

    pub(crate) fn parse_statement(&mut self) -> Result<Stmt, Error> {
        match self.kind() {
            Kind::At => {
                let start = self.token().start();
                let decorators = self.parse_decorators()?;
                let mut statement = self.parse_statement()?;
                let Stmt::Decl(Decl::Class(class)) = &mut statement else {
                    return Err(self.expected_error(Kind::Class));
                };
                class.class.span = Span::new_with_checked(start, class.class.span.hi);
                class.class.decorators = decorators;
                Ok(statement)
            }
            Kind::Semi => {
                let span = self.token().span();
                self.advance();
                Ok(Stmt::Empty(EmptyStmt { span }))
            }
            Kind::LBrace => self.parse_block_statement().map(Stmt::Block),
            Kind::Break | Kind::Continue => self.parse_jump_statement(),
            Kind::Class => self.parse_class_declaration(),
            #[cfg(feature = "typescript")]
            Kind::Declare if self.context().contains(Context::TYPESCRIPT) => {
                self.parse_ts_declare_statement()
            }
            #[cfg(feature = "typescript")]
            Kind::Abstract | Kind::Declare
                if self.context().contains(Context::TYPESCRIPT)
                    && self.lookahead(|parser| {
                        parser.advance();
                        if parser.at(Kind::Abstract) || parser.at(Kind::Declare) {
                            parser.advance();
                        }
                        parser.at(Kind::Class)
                    }) =>
            {
                let mut declare = false;
                let mut abstract_class = false;
                while matches!(self.kind(), Kind::Abstract | Kind::Declare) {
                    declare |= self.at(Kind::Declare);
                    abstract_class |= self.at(Kind::Abstract);
                    self.advance();
                }
                let mut statement = self.parse_class_declaration()?;
                let Stmt::Decl(Decl::Class(class)) = &mut statement else {
                    unreachable!("class modifier must produce a class declaration")
                };
                class.declare = declare;
                class.class.is_abstract = abstract_class;
                Ok(statement)
            }
            Kind::Debugger => self.parse_debugger_statement(),
            Kind::For => self.parse_for_statement(),
            Kind::Function => self.parse_function_declaration(),
            Kind::Async if self.is_async_function_start() => self.parse_function_declaration(),
            Kind::If => self.parse_if_statement(),
            Kind::Return => self.parse_return_statement(),
            Kind::Switch => self.parse_switch_statement(),
            Kind::Throw => self.parse_throw_statement(),
            Kind::Try => self.parse_try_statement(),
            #[cfg(feature = "typescript")]
            Kind::Namespace | Kind::Module
                if self.context().contains(Context::TYPESCRIPT)
                    && self.lookahead(|parser| {
                        parser.advance();
                        parser.at_identifier_name() || parser.at(Kind::Str)
                    }) =>
            {
                self.parse_ts_module_declaration(false)
            }
            #[cfg(feature = "typescript")]
            Kind::Global if self.context().contains(Context::TYPESCRIPT) => {
                self.parse_ts_global_declaration(false)
            }
            #[cfg(feature = "typescript")]
            Kind::Type
                if self.context().contains(Context::TYPESCRIPT)
                    && self.lookahead(|parser| {
                        parser.advance();
                        !parser.token().had_line_break() && parser.at_identifier_name()
                    }) =>
            {
                self.parse_ts_type_alias_declaration()
            }
            #[cfg(feature = "flow")]
            Kind::Ident
                if self.context().contains(Context::FLOW)
                    && self.token_source(self.token()) == "opaque" =>
            {
                self.parse_flow_opaque_type()
            }
            #[cfg(feature = "flow")]
            Kind::Ident
                if self.context().contains(Context::FLOW)
                    && self.token_source(self.token()) == "component" =>
            {
                self.parse_flow_component_declaration()
            }
            #[cfg(feature = "typescript")]
            Kind::Enum if self.context().contains(Context::TYPESCRIPT) => {
                self.parse_ts_enum_declaration(false)
            }
            #[cfg(feature = "typescript")]
            Kind::Interface if self.context().contains(Context::TYPESCRIPT) => {
                self.parse_ts_interface_declaration()
            }
            #[cfg(feature = "typescript")]
            Kind::Const
                if self.context().contains(Context::TYPESCRIPT)
                    && self.lookahead(|parser| {
                        parser.advance();
                        parser.at(Kind::Enum)
                    }) =>
            {
                self.parse_ts_enum_declaration(true)
            }
            Kind::Var | Kind::Const => self.parse_variable_statement(),
            Kind::Let if self.is_let_declaration_start() => self.parse_variable_statement(),
            Kind::While => self.parse_while_statement(),
            Kind::Do => self.parse_do_while_statement(),
            Kind::With => self.parse_with_statement(),
            _ if self.is_labeled_statement_start() => self.parse_labeled_statement(),
            _ => self.parse_expression_statement(),
        }
    }

    fn is_labeled_statement_start(&mut self) -> bool {
        self.at_identifier_reference()
            && self.lookahead(|parser| {
                parser.advance();
                parser.at(Kind::Colon)
            })
    }

    fn is_let_declaration_start(&mut self) -> bool {
        debug_assert!(self.at(Kind::Let));
        if self.context().intersects(Context::STRICT | Context::MODULE) {
            return true;
        }
        self.lookahead(|parser| {
            parser.advance();
            matches!(parser.kind(), Kind::LBracket | Kind::LBrace)
                || parser.at_identifier_reference()
        })
    }

    fn parse_labeled_statement(&mut self) -> Result<Stmt, Error> {
        let token = self.token();
        debug_assert!(self.at_identifier_reference());
        let label = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.advance();
        if !self.expect(Kind::Colon) {
            return Err(self.expected_error(Kind::Colon));
        }
        let body = Box::new(self.parse_statement()?);
        Ok(Stmt::Labeled(LabeledStmt {
            span: Span::new_with_checked(token.start(), body.span().hi),
            label,
            body,
        }))
    }

    fn parse_with_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let object = self.parse_parenthesized_expression()?;
        let body = Box::new(self.parse_statement()?);
        Ok(Stmt::With(WithStmt {
            span: Span::new_with_checked(start, body.span().hi),
            obj: object,
            body,
        }))
    }

    fn parse_parenthesized_expression(&mut self) -> Result<Box<swc_ecma_ast::Expr>, Error> {
        if !self.expect(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }
        let expression = self.parse_expression()?;
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        Ok(expression)
    }

    pub(crate) fn parse_block_statement(&mut self) -> Result<BlockStmt, Error> {
        let start = self.token().start();
        self.advance();
        let mut statements = Vec::with_capacity(8);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            statements.push(self.parse_statement()?);
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok(BlockStmt {
            span: Span::new_with_checked(start, self.previous_end()),
            ctxt: SyntaxContext::empty(),
            stmts: statements,
        })
    }

    fn parse_return_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let argument = if self.token().had_line_break()
            || matches!(self.kind(), Kind::Semi | Kind::RBrace | Kind::Eof)
        {
            None
        } else {
            Some(self.parse_expression()?)
        };
        self.consume_semicolon()?;
        let end = argument
            .as_ref()
            .map_or(self.previous_end(), |expression| expression.span().hi);
        Ok(Stmt::Return(ReturnStmt {
            span: Span::new_with_checked(start, end),
            arg: argument,
        }))
    }

    fn parse_debugger_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        self.consume_semicolon()?;
        Ok(Stmt::Debugger(DebuggerStmt {
            span: Span::new_with_checked(start, self.previous_end()),
        }))
    }

    fn parse_jump_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        let is_break = self.at(Kind::Break);
        self.advance();
        let label = if self.token().had_line_break()
            || matches!(self.kind(), Kind::Semi | Kind::RBrace | Kind::Eof)
        {
            None
        } else {
            let token = self.token();
            if !self.at_identifier_reference() {
                return Err(self.expected_error(Kind::Ident));
            }
            let label = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
            self.advance();
            Some(label)
        };
        self.consume_semicolon()?;
        let span = Span::new_with_checked(start, self.previous_end());

        // Labeled jump validation is added with labeled statements. Unlabeled
        // jumps can be checked immediately from the production context.
        if label.is_none() {
            let allowed = if is_break {
                self.context().contains(Context::BREAK)
            } else {
                self.context().contains(Context::CONTINUE)
            };
            if !allowed {
                self.emit_error(Error::new(
                    span,
                    if is_break {
                        crate::error::SyntaxError::TS1105
                    } else {
                        crate::error::SyntaxError::TS1115
                    },
                ));
            }
        }

        Ok(if is_break {
            Stmt::Break(BreakStmt { span, label })
        } else {
            Stmt::Continue(ContinueStmt { span, label })
        })
    }

    fn parse_if_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let test = self.parse_parenthesized_expression()?;
        let consequent = Box::new(self.parse_statement()?);
        let alternate = if self.eat(Kind::Else) {
            Some(Box::new(self.parse_statement()?))
        } else {
            None
        };
        let end = alternate
            .as_ref()
            .map_or_else(|| consequent.span().hi, |statement| statement.span().hi);
        Ok(Stmt::If(IfStmt {
            span: Span::new_with_checked(start, end),
            test,
            cons: consequent,
            alt: alternate,
        }))
    }

    fn parse_for_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let is_await = self.eat(Kind::Await);
        if !self.expect(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }

        let init = if self.at(Kind::Semi) {
            None
        } else if matches!(self.kind(), Kind::Var | Kind::Const)
            || (self.at(Kind::Let) && self.is_let_declaration_start())
        {
            Some(VarDeclOrExpr::VarDecl(self.with_context(
                Context::empty(),
                Context::IN,
                Self::parse_variable_declaration,
            )?))
        } else {
            Some(VarDeclOrExpr::Expr(self.with_context(
                Context::empty(),
                Context::IN,
                Self::parse_expression,
            )?))
        };

        if matches!(self.kind(), Kind::In | Kind::Of) {
            let operator = self.kind();
            if is_await && operator != Kind::Of {
                return Err(self.expected_error(Kind::Of));
            }
            let Some(init) = init else {
                return Err(self.expected_error(Kind::Ident));
            };
            // Plugin builds consume a non-exhaustive AST enum from another
            // crate, while workspace builds see the current variants.
            #[allow(unreachable_patterns)]
            let left = match init {
                VarDeclOrExpr::VarDecl(declaration) => ForHead::VarDecl(declaration),
                VarDeclOrExpr::Expr(expression) => {
                    ForHead::Pat(Box::new(self.reparse_assignment_pattern(expression)?))
                }
                _ => return Err(self.expected_error(Kind::Ident)),
            };
            self.advance();
            let right = self.parse_expression()?;
            if !self.expect(Kind::RParen) {
                return Err(self.expected_error(Kind::RParen));
            }
            let body = Box::new(self.with_context(
                Context::BREAK | Context::CONTINUE,
                Context::empty(),
                Self::parse_statement,
            )?);
            let span = Span::new_with_checked(start, body.span().hi);
            return Ok(if operator == Kind::In {
                Stmt::ForIn(ForInStmt {
                    span,
                    left,
                    right,
                    body,
                })
            } else {
                Stmt::ForOf(ForOfStmt {
                    span,
                    is_await,
                    left,
                    right,
                    body,
                })
            });
        }

        if is_await {
            return Err(self.expected_error(Kind::Of));
        }
        if !self.expect(Kind::Semi) {
            return Err(self.expected_error(Kind::Semi));
        }
        let test = if self.at(Kind::Semi) {
            None
        } else {
            Some(self.parse_expression()?)
        };
        if !self.expect(Kind::Semi) {
            return Err(self.expected_error(Kind::Semi));
        }
        let update = if self.at(Kind::RParen) {
            None
        } else {
            Some(self.parse_expression()?)
        };
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        let body = Box::new(self.with_context(
            Context::BREAK | Context::CONTINUE,
            Context::empty(),
            Self::parse_statement,
        )?);
        Ok(Stmt::For(ForStmt {
            span: Span::new_with_checked(start, body.span().hi),
            init,
            test,
            update,
            body,
        }))
    }

    fn parse_throw_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        if self.token().had_line_break() {
            return Err(Error::new(
                self.token().span(),
                crate::error::SyntaxError::LineBreakInThrow,
            ));
        }
        let argument = self.parse_expression()?;
        let end = argument.span().hi;
        self.consume_semicolon()?;
        Ok(Stmt::Throw(ThrowStmt {
            span: Span::new_with_checked(start, end),
            arg: argument,
        }))
    }

    fn parse_switch_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let discriminant = self.parse_parenthesized_expression()?;
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }

        let mut cases = Vec::with_capacity(4);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            let case_start = self.token().start();
            let test = if self.eat(Kind::Case) {
                Some(self.parse_expression()?)
            } else if self.eat(Kind::Default) {
                None
            } else {
                return Err(self.expected_error(Kind::Case));
            };
            if !self.expect(Kind::Colon) {
                return Err(self.expected_error(Kind::Colon));
            }

            let mut consequent = Vec::with_capacity(8);
            while !matches!(
                self.kind(),
                Kind::Case | Kind::Default | Kind::RBrace | Kind::Eof
            ) {
                consequent.push(self.with_context(
                    Context::BREAK,
                    Context::empty(),
                    Self::parse_statement,
                )?);
            }
            let end = consequent
                .last()
                .map_or(self.previous_end(), |statement| statement.span().hi);
            cases.push(SwitchCase {
                span: Span::new_with_checked(case_start, end),
                test,
                cons: consequent,
            });
        }

        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok(Stmt::Switch(SwitchStmt {
            span: Span::new_with_checked(start, self.previous_end()),
            discriminant,
            cases,
        }))
    }

    fn parse_try_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        if !self.at(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let block = self.parse_block_statement()?;

        let catch_start = self.token().start();
        let handler = if self.eat(Kind::Catch) {
            let parameter = if self.eat(Kind::LParen) {
                let pattern = self.parse_binding_pattern(false)?;
                if !self.expect(Kind::RParen) {
                    return Err(self.expected_error(Kind::RParen));
                }
                Some(pattern)
            } else {
                None
            };
            if !self.at(Kind::LBrace) {
                return Err(self.expected_error(Kind::LBrace));
            }
            let body = self.parse_block_statement()?;
            Some(CatchClause {
                span: Span::new_with_checked(catch_start, body.span.hi),
                param: parameter,
                body,
            })
        } else {
            None
        };

        let finalizer = if self.eat(Kind::Finally) {
            if !self.at(Kind::LBrace) {
                return Err(self.expected_error(Kind::LBrace));
            }
            Some(self.parse_block_statement()?)
        } else {
            None
        };
        if handler.is_none() && finalizer.is_none() {
            return Err(self.expected_error(Kind::Catch));
        }
        let end = finalizer
            .as_ref()
            .map_or_else(|| handler.as_ref().unwrap().span.hi, |block| block.span.hi);
        Ok(Stmt::Try(Box::new(TryStmt {
            span: Span::new_with_checked(start, end),
            block,
            handler,
            finalizer,
        })))
    }

    fn parse_while_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let test = self.parse_parenthesized_expression()?;
        let body = Box::new(self.with_context(
            Context::BREAK | Context::CONTINUE,
            Context::empty(),
            Self::parse_statement,
        )?);
        Ok(Stmt::While(WhileStmt {
            span: Span::new_with_checked(start, body.span().hi),
            test,
            body,
        }))
    }

    fn parse_do_while_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let body = Box::new(self.with_context(
            Context::BREAK | Context::CONTINUE,
            Context::empty(),
            Self::parse_statement,
        )?);
        if !self.expect(Kind::While) {
            return Err(self.expected_error(Kind::While));
        }
        let test = self.parse_parenthesized_expression()?;
        self.eat(Kind::Semi);
        Ok(Stmt::DoWhile(DoWhileStmt {
            span: Span::new_with_checked(start, self.previous_end()),
            test,
            body,
        }))
    }

    fn parse_variable_statement(&mut self) -> Result<Stmt, Error> {
        let declaration = self.parse_variable_declaration()?;
        self.consume_semicolon()?;
        Ok(Stmt::Decl(Decl::Var(declaration)))
    }

    #[cfg(feature = "typescript")]
    fn parse_ts_declare_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        debug_assert!(self.eat(Kind::Declare));
        let abstract_class = self.eat(Kind::Abstract);
        #[cfg(feature = "flow")]
        let flow_export = self.context().contains(Context::FLOW) && self.eat(Kind::Export);
        #[cfg(feature = "flow")]
        let flow_default = flow_export && self.eat(Kind::Default);
        #[cfg(feature = "flow")]
        if flow_export
            && (self.at(Kind::LBrace)
                || self.at(Kind::Asterisk)
                || (flow_default
                    && ((matches!(self.kind(), Kind::Function | Kind::Class)
                        && self.lookahead(|parser| {
                            parser.advance();
                            matches!(parser.kind(), Kind::LParen | Kind::LBrace)
                        }))
                        || (self.at(Kind::Async)
                            && self.lookahead(|parser| {
                                parser.advance();
                                parser.eat(Kind::Function) && parser.at(Kind::LParen)
                            })))))
        {
            return self.parse_flow_declare_export_fallback(start, flow_default);
        }
        #[cfg(feature = "flow")]
        if flow_default
            && !matches!(
                self.kind(),
                Kind::Function | Kind::Async | Kind::Class | Kind::Interface
            )
        {
            let type_ann = self.parse_ts_type()?;
            self.consume_semicolon()?;
            return Ok(self.flow_synthetic_type_alias(
                start,
                "__flow_default_export".into(),
                type_ann,
            ));
        }
        #[cfg(feature = "flow")]
        if self.context().contains(Context::FLOW)
            && self.at(Kind::Module)
            && self.lookahead(|parser| {
                parser.advance();
                if !parser.eat(Kind::Dot) || !parser.at_identifier_name() {
                    return false;
                }
                let exports = parser.token_source(parser.token()) == "exports";
                parser.advance();
                exports && parser.at(Kind::Colon)
            })
        {
            return self.parse_flow_module_exports(start);
        }
        if self.at(Kind::Global) {
            return self.parse_ts_global_declaration(true);
        }
        if self.at(Kind::Const)
            && self.lookahead(|parser| {
                parser.advance();
                parser.at(Kind::Enum)
            })
        {
            let mut statement = self.parse_ts_enum_declaration(true)?;
            let Stmt::Decl(Decl::TsEnum(declaration)) = &mut statement else {
                unreachable!("enum parser must produce an enum declaration")
            };
            declaration.declare = true;
            return Ok(statement);
        }
        let mut statement = match self.kind() {
            Kind::Var | Kind::Let | Kind::Const => self.parse_variable_statement()?,
            Kind::Function | Kind::Async => self.parse_function_declaration()?,
            Kind::Class => self.parse_class_declaration()?,
            Kind::Interface => self.parse_ts_interface_declaration()?,
            Kind::Type => self.parse_ts_type_alias_declaration()?,
            Kind::Enum => self.parse_ts_enum_declaration(false)?,
            Kind::Namespace | Kind::Module => self.parse_ts_module_declaration(true)?,
            #[cfg(feature = "flow")]
            Kind::Ident
                if self.context().contains(Context::FLOW)
                    && self.token_source(self.token()) == "opaque" =>
            {
                self.parse_flow_opaque_type()?
            }
            _ => return Err(self.expected_error(Kind::Var)),
        };
        if let Stmt::Decl(declaration) = &mut statement {
            match declaration {
                Decl::Var(value) => value.declare = true,
                Decl::Fn(value) => value.declare = true,
                Decl::Class(value) => {
                    value.declare = true;
                    value.class.is_abstract = abstract_class;
                }
                Decl::TsInterface(value) => value.declare = true,
                Decl::TsTypeAlias(value) => value.declare = true,
                Decl::TsEnum(value) => value.declare = true,
                _ => {}
            }
        }
        Ok(statement)
    }

    #[cfg(feature = "flow")]
    fn parse_flow_declare_export_fallback(
        &mut self,
        start: swc_common::BytePos,
        is_default: bool,
    ) -> Result<Stmt, Error> {
        let mut depth = 0u32;
        loop {
            if self.at(Kind::Eof) || (depth == 0 && self.token().had_line_break()) {
                break;
            }
            match self.kind() {
                Kind::LBrace | Kind::LParen | Kind::LBracket => depth += 1,
                Kind::RBrace | Kind::RParen | Kind::RBracket => depth = depth.saturating_sub(1),
                Kind::Semi if depth == 0 => {
                    self.advance();
                    break;
                }
                _ => {}
            }
            self.advance();
        }
        let name = if is_default {
            "__flow_default_export".into()
        } else {
            format!("__flow_declare_export_{}", start.0).into()
        };
        let any = Box::new(swc_ecma_ast::TsType::TsKeywordType(
            swc_ecma_ast::TsKeywordType {
                span: Span::new_with_checked(start, self.previous_end()),
                kind: swc_ecma_ast::TsKeywordTypeKind::TsAnyKeyword,
            },
        ));
        Ok(self.flow_synthetic_type_alias(start, name, any))
    }

    #[cfg(feature = "flow")]
    fn flow_synthetic_type_alias(
        &self,
        start: swc_common::BytePos,
        name: swc_atoms::Atom,
        type_ann: Box<swc_ecma_ast::TsType>,
    ) -> Stmt {
        let end = type_ann.span().hi;
        Stmt::Decl(Decl::TsTypeAlias(Box::new(swc_ecma_ast::TsTypeAliasDecl {
            span: Span::new_with_checked(start, end),
            declare: true,
            id: Ident::new_no_ctxt(name, Span::new_with_checked(start, end)),
            type_params: None,
            type_ann,
        })))
    }

    fn parse_variable_declaration(&mut self) -> Result<Box<VarDecl>, Error> {
        let start = self.token().start();
        let kind = match self.kind() {
            Kind::Var => VarDeclKind::Var,
            Kind::Let => VarDeclKind::Let,
            Kind::Const => VarDeclKind::Const,
            _ => unreachable!(),
        };
        self.advance();
        let mut declarations = Vec::with_capacity(4);

        loop {
            let mut pattern = self.parse_binding_pattern(false)?;
            #[cfg(feature = "typescript")]
            let definite = if self.context().contains(Context::TYPESCRIPT) && self.eat(Kind::Bang) {
                if self.at(Kind::Colon) {
                    let type_ann = self.parse_ts_type_annotation()?;
                    match &mut pattern {
                        swc_ecma_ast::Pat::Ident(pattern) => pattern.type_ann = Some(type_ann),
                        swc_ecma_ast::Pat::Array(pattern) => pattern.type_ann = Some(type_ann),
                        swc_ecma_ast::Pat::Object(pattern) => pattern.type_ann = Some(type_ann),
                        _ => return Err(self.expected_error(Kind::Ident)),
                    }
                }
                true
            } else {
                false
            };
            #[cfg(not(feature = "typescript"))]
            let definite = false;
            let initializer = if self.eat(Kind::Eq) {
                Some(self.parse_assignment_expression()?)
            } else {
                None
            };
            let end = initializer
                .as_ref()
                .map_or(pattern.span().hi, |expression| expression.span().hi);
            declarations.push(VarDeclarator {
                span: Span::new_with_checked(pattern.span().lo, end),
                name: pattern,
                init: initializer,
                definite,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }

        Ok(Box::new(VarDecl {
            span: Span::new_with_checked(start, self.previous_end()),
            ctxt: SyntaxContext::empty(),
            kind,
            declare: false,
            decls: declarations,
        }))
    }

    fn parse_expression_statement(&mut self) -> Result<Stmt, Error> {
        let expression = self.parse_expression()?;
        let span = expression.span();
        self.consume_semicolon()?;
        Ok(Stmt::Expr(ExprStmt {
            span,
            expr: expression,
        }))
    }

    pub(crate) fn consume_semicolon(&mut self) -> Result<(), Error> {
        if self.eat(Kind::Semi)
            || self.at(Kind::RBrace)
            || self.at(Kind::Eof)
            || self.token().had_line_break()
        {
            Ok(())
        } else {
            Err(self.expected_error(Kind::Semi))
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{Decl, Expr, Stmt, VarDeclKind};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    #[test]
    fn parses_basic_script_directly() {
        let lexer = Lexer::new(
            "const answer = 40 + 2; { answer; return\nanswer; }",
            BytePos(1),
            NoTokens,
        )
        .unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        assert_eq!(script.body.len(), 2);
        let Stmt::Decl(Decl::Var(declaration)) = &script.body[0] else {
            panic!("expected variable declaration")
        };
        assert_eq!(declaration.kind, VarDeclKind::Const);
        assert!(matches!(
            declaration.decls[0].init.as_deref(),
            Some(Expr::Bin(_))
        ));
        let Stmt::Block(block) = &script.body[1] else {
            panic!("expected block")
        };
        assert_eq!(block.stmts.len(), 3);
        let Stmt::Return(return_statement) = &block.stmts[1] else {
            panic!("expected return")
        };
        assert!(return_statement.arg.is_none());
    }

    #[test]
    fn parses_control_flow_statements_directly() {
        let source = "if (ready) while (active) { debugger; break; continue outer; } else do \
                      throw error; while (retry);";
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        let Stmt::If(if_statement) = &script.body[0] else {
            panic!("expected if statement")
        };
        let Stmt::While(while_statement) = &*if_statement.cons else {
            panic!("expected while statement")
        };
        let Stmt::Block(block) = &*while_statement.body else {
            panic!("expected loop block")
        };
        assert!(matches!(block.stmts[1], Stmt::Break(_)));
        let Stmt::Continue(continue_statement) = &block.stmts[2] else {
            panic!("expected continue statement")
        };
        assert_eq!(continue_statement.label.as_ref().unwrap().sym, "outer");
        let Some(alternate) = &if_statement.alt else {
            panic!("expected alternate")
        };
        assert!(matches!(&**alternate, Stmt::DoWhile(_)));
    }

    #[test]
    fn parses_labeled_and_with_statements_directly() {
        let lexer = Lexer::new(
            "outer: while (ready) break outer; with (scope) value;",
            BytePos(1),
            NoTokens,
        )
        .unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();
        assert!(matches!(
            &script.body[0],
            Stmt::Labeled(label) if label.label.sym == "outer" && matches!(&*label.body, Stmt::While(_))
        ));
        assert!(matches!(&script.body[1], Stmt::With(_)));
    }

    #[test]
    fn rejects_line_break_after_throw() {
        let lexer = Lexer::new("throw\nerror;", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let error = parser.parse_script().unwrap_err();

        assert!(matches!(
            error.kind(),
            crate::error::SyntaxError::LineBreakInThrow
        ));
    }

    #[test]
    fn parses_switch_and_try_statements_directly() {
        let source = "switch (value) { case 1: break; default: throw error; } try { work(); } \
                      catch (error) { recover(error); } finally { cleanup(); }";
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        let Stmt::Switch(switch_statement) = &script.body[0] else {
            panic!("expected switch statement")
        };
        assert_eq!(switch_statement.cases.len(), 2);
        assert!(switch_statement.cases[1].test.is_none());
        let Stmt::Try(try_statement) = &script.body[1] else {
            panic!("expected try statement")
        };
        assert!(try_statement.handler.is_some());
        assert!(try_statement.finalizer.is_some());
    }

    #[test]
    fn parses_for_statement_variants_directly() {
        let source = "for (let index = 0; index < 3; index = index + 1) work(index); for (const \
                      key in object) useKey(key); for await (const value of values) \
                      consume(value);";
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        assert!(matches!(script.body[0], Stmt::For(_)));
        assert!(matches!(script.body[1], Stmt::ForIn(_)));
        let Stmt::ForOf(for_of) = &script.body[2] else {
            panic!("expected for-of statement")
        };
        assert!(for_of.is_await);
    }
}
