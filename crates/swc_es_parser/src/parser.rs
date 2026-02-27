use swc_atoms::Atom;
use swc_common::{Span, DUMMY_SP};
use swc_es_ast::{
    ArrayExpr, ArrayPat, AssignExpr, AssignOp, AstStore, BinaryExpr, BinaryOp, BlockStmt, BoolLit,
    CallExpr, Decl, EmptyStmt, Expr, ExprOrSpread, ExprStmt, FnDecl, ForStmt, Function, Ident,
    IfStmt, KeyValueProp, Lit, MemberExpr, MemberProp, ModuleDecl, NullLit, NumberLit, ObjectExpr,
    Pat, Program, ProgramId, ProgramKind, PropName, RestPat, ReturnStmt, Stmt, StrLit,
    TsKeywordType, TsType, TsTypeAliasDecl, TsTypeRef, UnaryExpr, UnaryOp, VarDecl, VarDeclKind,
    VarDeclarator, WhileStmt,
};

use crate::{
    context::Context,
    error::{Error, ErrorCode, Severity},
    lexer::Lexer,
    token::{Keyword, Token, TokenKind, TokenValue},
    Syntax,
};

/// Parse result type.
pub type PResult<T> = Result<T, Error>;

/// Parser result with owned arena store.
#[derive(Debug)]
pub struct ParsedProgram {
    /// Arena-backed AST storage.
    pub store: AstStore,
    /// Root program id.
    pub program: ProgramId,
}

/// ECMAScript parser producing `swc_es_ast` nodes.
pub struct Parser<'a> {
    lexer: Lexer<'a>,
    cur: Token,
    next: Option<Token>,
    store: AstStore,
    errors: Vec<Error>,
    ctx: Context,
}

impl<'a> Parser<'a> {
    /// Creates a parser from lexer.
    pub fn new_from(mut lexer: Lexer<'a>) -> Self {
        let cur = lexer.next_token();
        Self {
            lexer,
            cur,
            next: None,
            store: AstStore::default(),
            errors: Vec::new(),
            ctx: Context::TOP_LEVEL | Context::CAN_BE_MODULE,
        }
    }

    /// Returns parser syntax.
    pub fn syntax(&self) -> Syntax {
        self.lexer.syntax()
    }

    /// Takes recoverable parser errors.
    pub fn take_errors(&mut self) -> Vec<Error> {
        let mut all = std::mem::take(&mut self.errors);
        all.extend(self.lexer.take_errors());
        all
    }

    /// Parses source as script.
    pub fn parse_script(&mut self) -> PResult<ParsedProgram> {
        self.ctx.insert(Context::TOP_LEVEL);
        self.ctx.remove(Context::MODULE);
        let start = self.cur.span.lo;
        let body = self.parse_stmt_list(false)?;
        let program = self.store.alloc_program(Program {
            span: Span::new_with_checked(start, self.last_pos()),
            kind: ProgramKind::Script,
            body,
        });

        Ok(ParsedProgram {
            store: std::mem::take(&mut self.store),
            program,
        })
    }

    /// Parses source as module.
    pub fn parse_module(&mut self) -> PResult<ParsedProgram> {
        self.ctx
            .insert(Context::MODULE | Context::TOP_LEVEL | Context::STRICT);
        let start = self.cur.span.lo;
        let body = self.parse_stmt_list(true)?;
        let program = self.store.alloc_program(Program {
            span: Span::new_with_checked(start, self.last_pos()),
            kind: ProgramKind::Module,
            body,
        });

        Ok(ParsedProgram {
            store: std::mem::take(&mut self.store),
            program,
        })
    }

    /// Parses source as script-or-module.
    pub fn parse_program(&mut self) -> PResult<ParsedProgram> {
        let start = self.cur.span.lo;
        let mut body = Vec::new();
        let mut has_module_item = false;

        while self.cur.kind != TokenKind::Eof {
            let stmt = if self.is_module_start() {
                has_module_item = true;
                self.parse_module_decl_stmt()?
            } else {
                self.parse_stmt()?
            };
            body.push(stmt);
        }

        let kind = if has_module_item {
            ProgramKind::Module
        } else {
            ProgramKind::Script
        };

        let program = self.store.alloc_program(Program {
            span: Span::new_with_checked(start, self.last_pos()),
            kind,
            body,
        });

        Ok(ParsedProgram {
            store: std::mem::take(&mut self.store),
            program,
        })
    }

    fn parse_stmt_list(&mut self, allow_module: bool) -> PResult<Vec<swc_es_ast::StmtId>> {
        let mut body = Vec::new();

        while self.cur.kind != TokenKind::Eof {
            let parsed = if allow_module && self.is_module_start() {
                self.parse_module_decl_stmt()
            } else {
                self.parse_stmt()
            };

            match parsed {
                Ok(stmt) => body.push(stmt),
                Err(err) => {
                    self.errors.push(err);
                    self.recover_stmt();
                }
            }
        }

        Ok(body)
    }

    fn parse_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let explicit_resource_management = self.syntax().explicit_resource_management();
        let is_await_using = self.cur.kind == TokenKind::Keyword(Keyword::Await)
            && explicit_resource_management
            && self.peek_ident_is("using");
        let is_using = self.cur.kind == TokenKind::Ident
            && explicit_resource_management
            && self.cur_ident_is("using");

        match self.cur.kind {
            TokenKind::Semi => {
                let span = self.cur.span;
                self.bump();
                Ok(self.store.alloc_stmt(Stmt::Empty(EmptyStmt { span })))
            }
            TokenKind::LBrace => self.parse_block_stmt(),
            TokenKind::Keyword(Keyword::If) => self.parse_if_stmt(),
            TokenKind::Keyword(Keyword::While) => self.parse_while_stmt(),
            TokenKind::Keyword(Keyword::For) => self.parse_for_stmt(),
            TokenKind::Keyword(Keyword::Return) => self.parse_return_stmt(),
            TokenKind::Keyword(Keyword::Function) => self.parse_function_decl_stmt(),
            TokenKind::Keyword(Keyword::Var | Keyword::Let | Keyword::Const) => {
                self.parse_var_decl_stmt()
            }
            TokenKind::Keyword(Keyword::Await) if is_await_using => {
                self.parse_using_decl_stmt(true)
            }
            TokenKind::Ident if is_using => self.parse_using_decl_stmt(false),
            TokenKind::Keyword(Keyword::Type) if self.syntax().typescript() => {
                self.parse_ts_type_alias_decl_stmt()
            }
            TokenKind::Keyword(
                Keyword::Interface
                | Keyword::Enum
                | Keyword::Namespace
                | Keyword::Module
                | Keyword::Declare,
            ) if self.syntax().typescript() => self.parse_ts_skip_decl_stmt(),
            TokenKind::Keyword(Keyword::Import | Keyword::Export)
                if !self.ctx.contains(Context::MODULE) =>
            {
                let err = Error::new(
                    self.cur.span,
                    Severity::Error,
                    ErrorCode::ImportExportInScript,
                    "import/export is not allowed in script mode",
                );
                self.errors.push(err);
                self.parse_expr_stmt()
            }
            _ => self.parse_expr_stmt(),
        }
    }

    fn parse_module_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        let module_decl = match self.cur.kind {
            TokenKind::Keyword(Keyword::Import) => self.parse_import_decl(start)?,
            TokenKind::Keyword(Keyword::Export) => self.parse_export_decl(start)?,
            _ => {
                return Err(Error::new(
                    self.cur.span,
                    Severity::Fatal,
                    ErrorCode::InvalidStatement,
                    "expected module declaration",
                ));
            }
        };

        let module_decl_id = self.store.alloc_module_decl(module_decl);
        Ok(self.store.alloc_stmt(Stmt::ModuleDecl(module_decl_id)))
    }

    fn parse_import_decl(&mut self, start: swc_common::BytePos) -> PResult<ModuleDecl> {
        self.bump();
        let mut src = None;

        while self.cur.kind != TokenKind::Semi && self.cur.kind != TokenKind::Eof {
            if self.cur.kind == TokenKind::Str {
                src = Some(self.cur_string_value());
            }
            self.bump();
        }
        self.eat_semi();

        Ok(ModuleDecl::Import(swc_es_ast::ImportDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            src: src.unwrap_or(StrLit {
                span: DUMMY_SP,
                value: Atom::new(""),
            }),
        }))
    }

    fn parse_export_decl(&mut self, start: swc_common::BytePos) -> PResult<ModuleDecl> {
        self.bump();

        if self.cur.kind == TokenKind::Keyword(Keyword::Default) {
            self.bump();
            let expr = self.parse_expr()?;
            self.eat_semi();
            return Ok(ModuleDecl::ExportDefaultExpr(
                swc_es_ast::ExportDefaultExprDecl {
                    span: Span::new_with_checked(start, self.last_pos()),
                    expr,
                },
            ));
        }

        if self.cur.kind == TokenKind::LBrace {
            self.bump();
            let mut specifiers = Vec::new();
            while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
                let local = self.expect_ident()?;
                let exported = if self.cur.kind == TokenKind::Keyword(Keyword::As) {
                    self.bump();
                    Some(self.expect_ident()?)
                } else {
                    None
                };
                specifiers.push(swc_es_ast::ExportSpecifier { local, exported });

                if self.cur.kind != TokenKind::RBrace {
                    let _ = self.expect(TokenKind::Comma, ",")?;
                }
            }
            let _ = self.expect(TokenKind::RBrace, "}")?;

            let src = if self.cur.kind == TokenKind::Keyword(Keyword::From) {
                self.bump();
                Some(self.expect_string()?)
            } else {
                None
            };
            self.eat_semi();

            return Ok(ModuleDecl::ExportNamed(swc_es_ast::ExportNamedDecl {
                span: Span::new_with_checked(start, self.last_pos()),
                src,
                specifiers,
                decl: None,
            }));
        }

        let decl = self.parse_decl()?;
        Ok(ModuleDecl::ExportDecl(swc_es_ast::ExportDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            decl,
        }))
    }

    fn parse_decl(&mut self) -> PResult<swc_es_ast::DeclId> {
        match self.cur.kind {
            TokenKind::Keyword(Keyword::Var | Keyword::Let | Keyword::Const) => {
                let stmt = self.parse_var_decl_stmt()?;
                let Stmt::Decl(decl) = self
                    .store
                    .stmt(stmt)
                    .cloned()
                    .unwrap_or(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                else {
                    return Err(Error::new(
                        self.cur.span,
                        Severity::Fatal,
                        ErrorCode::InvalidStatement,
                        "expected declaration",
                    ));
                };
                Ok(decl)
            }
            TokenKind::Keyword(Keyword::Function) => {
                let stmt = self.parse_function_decl_stmt()?;
                let Stmt::Decl(decl) = self
                    .store
                    .stmt(stmt)
                    .cloned()
                    .unwrap_or(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                else {
                    return Err(Error::new(
                        self.cur.span,
                        Severity::Fatal,
                        ErrorCode::InvalidStatement,
                        "expected declaration",
                    ));
                };
                Ok(decl)
            }
            TokenKind::Keyword(Keyword::Type) if self.syntax().typescript() => {
                let stmt = self.parse_ts_type_alias_decl_stmt()?;
                let Stmt::Decl(decl) = self
                    .store
                    .stmt(stmt)
                    .cloned()
                    .unwrap_or(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                else {
                    return Err(Error::new(
                        self.cur.span,
                        Severity::Fatal,
                        ErrorCode::InvalidStatement,
                        "expected declaration",
                    ));
                };
                Ok(decl)
            }
            _ => Err(Error::new(
                self.cur.span,
                Severity::Fatal,
                ErrorCode::InvalidStatement,
                "expected declaration",
            )),
        }
    }

    fn parse_block_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        let _ = self.expect(TokenKind::LBrace, "{")?;
        let mut stmts = Vec::new();
        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            if self.ctx.contains(Context::MODULE) && self.is_module_start() {
                stmts.push(self.parse_module_decl_stmt()?);
            } else {
                stmts.push(self.parse_stmt()?);
            }
        }
        let _ = self.expect(TokenKind::RBrace, "}")?;

        Ok(self.store.alloc_stmt(Stmt::Block(BlockStmt {
            span: Span::new_with_checked(start, self.last_pos()),
            stmts,
        })))
    }

    fn parse_if_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();
        let _ = self.expect(TokenKind::LParen, "(")?;
        let test = self.parse_expr()?;
        let _ = self.expect(TokenKind::RParen, ")")?;
        let cons = self.parse_stmt()?;
        let alt = if self.cur.kind == TokenKind::Keyword(Keyword::Else) {
            self.bump();
            Some(self.parse_stmt()?)
        } else {
            None
        };

        Ok(self.store.alloc_stmt(Stmt::If(IfStmt {
            span: Span::new_with_checked(start, self.last_pos()),
            test,
            cons,
            alt,
        })))
    }

    fn parse_while_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();
        let _ = self.expect(TokenKind::LParen, "(")?;
        let test = self.parse_expr()?;
        let _ = self.expect(TokenKind::RParen, ")")?;

        let old_ctx = self.ctx;
        self.ctx.insert(Context::IN_LOOP);
        let body = self.parse_stmt()?;
        self.ctx = old_ctx;

        Ok(self.store.alloc_stmt(Stmt::While(WhileStmt {
            span: Span::new_with_checked(start, self.last_pos()),
            test,
            body,
        })))
    }

    fn parse_for_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();
        let _ = self.expect(TokenKind::LParen, "(")?;

        let mut depth = 1usize;
        while depth > 0 && self.cur.kind != TokenKind::Eof {
            match self.cur.kind {
                TokenKind::LParen => depth += 1,
                TokenKind::RParen => {
                    depth -= 1;
                    if depth == 0 {
                        self.bump();
                        break;
                    }
                }
                _ => {}
            }
            self.bump();
        }

        let old_ctx = self.ctx;
        self.ctx.insert(Context::IN_LOOP);
        let body = self.parse_stmt()?;
        self.ctx = old_ctx;

        Ok(self.store.alloc_stmt(Stmt::For(ForStmt {
            span: Span::new_with_checked(start, self.last_pos()),
            body,
        })))
    }

    fn parse_return_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();

        if !self.ctx.contains(Context::IN_FUNCTION)
            && !self.syntax().allow_return_outside_function()
        {
            self.errors.push(Error::new(
                Span::new_with_checked(start, self.last_pos()),
                Severity::Error,
                ErrorCode::ReturnOutsideFunction,
                "return statement is only valid inside a function",
            ));
        }

        let arg = if self.cur.kind == TokenKind::Semi
            || self.cur.kind == TokenKind::RBrace
            || self.cur.kind == TokenKind::Eof
            || self.cur.had_line_break_before
        {
            None
        } else {
            Some(self.parse_expr()?)
        };
        self.eat_semi();

        Ok(self.store.alloc_stmt(Stmt::Return(ReturnStmt {
            span: Span::new_with_checked(start, self.last_pos()),
            arg,
        })))
    }

    fn parse_function_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();

        let ident = self.expect_ident()?;
        let (params, body) = self.parse_function_parts()?;

        let decl = self.store.alloc_decl(Decl::Fn(FnDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            ident,
            params,
            body,
        }));

        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_function_parts(
        &mut self,
    ) -> PResult<(Vec<swc_es_ast::PatId>, Vec<swc_es_ast::StmtId>)> {
        let _ = self.expect(TokenKind::LParen, "(")?;
        let mut params = Vec::new();

        while self.cur.kind != TokenKind::RParen && self.cur.kind != TokenKind::Eof {
            params.push(self.parse_binding_pat()?);
            if self.cur.kind != TokenKind::RParen {
                let _ = self.expect(TokenKind::Comma, ",")?;
            }
        }
        let _ = self.expect(TokenKind::RParen, ")")?;

        let old_ctx = self.ctx;
        self.ctx.insert(Context::IN_FUNCTION);
        let body_stmt = self.parse_block_stmt()?;
        self.ctx = old_ctx;

        let body = match self.store.stmt(body_stmt).cloned() {
            Some(Stmt::Block(block)) => block.stmts,
            _ => Vec::new(),
        };

        Ok((params, body))
    }

    fn parse_var_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        let kind = match self.cur.kind {
            TokenKind::Keyword(Keyword::Var) => VarDeclKind::Var,
            TokenKind::Keyword(Keyword::Let) => VarDeclKind::Let,
            TokenKind::Keyword(Keyword::Const) => VarDeclKind::Const,
            _ => {
                return Err(Error::new(
                    self.cur.span,
                    Severity::Fatal,
                    ErrorCode::InvalidStatement,
                    "expected variable declaration",
                ));
            }
        };
        self.bump();

        let mut declarators = Vec::new();
        while self.cur.kind != TokenKind::Semi && self.cur.kind != TokenKind::Eof {
            let pat = self.parse_binding_pat()?;
            let init = if self.cur.kind == TokenKind::Eq {
                self.bump();
                Some(self.parse_expr()?)
            } else {
                None
            };

            declarators.push(VarDeclarator {
                span: Span::new_with_checked(start, self.last_pos()),
                name: pat,
                init,
            });

            if self.cur.kind != TokenKind::Comma {
                break;
            }
            self.bump();
        }
        self.eat_semi();

        let decl = self.store.alloc_decl(Decl::Var(VarDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            kind,
            declarators,
        }));

        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_using_decl_stmt(&mut self, has_await: bool) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        if has_await {
            self.bump();
        }
        if self.cur.kind != TokenKind::Ident || !self.cur_ident_is("using") {
            return Err(self.expected("using"));
        }
        self.bump();

        let mut declarators = Vec::new();
        while self.cur.kind != TokenKind::Semi && self.cur.kind != TokenKind::Eof {
            let pat = self.parse_binding_pat()?;
            let init = if self.cur.kind == TokenKind::Eq {
                self.bump();
                Some(self.parse_expr()?)
            } else {
                None
            };
            declarators.push(VarDeclarator {
                span: Span::new_with_checked(start, self.last_pos()),
                name: pat,
                init,
            });

            if self.cur.kind != TokenKind::Comma {
                break;
            }
            self.bump();
        }
        self.eat_semi();

        let decl = self.store.alloc_decl(Decl::Var(VarDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            kind: if has_await {
                VarDeclKind::AwaitUsing
            } else {
                VarDeclKind::Using
            },
            declarators,
        }));

        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_ts_type_alias_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump(); // type
        let ident = self.expect_ident()?;
        if self.cur.kind == TokenKind::Lt {
            self.skip_balanced(TokenKind::Lt, TokenKind::Gt);
        }
        let _ = self.expect(TokenKind::Eq, "=")?;
        let ty = self.parse_ts_type()?;
        self.eat_semi();

        let decl = self.store.alloc_decl(Decl::TsTypeAlias(TsTypeAliasDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            ident,
            ty,
        }));

        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_ts_skip_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();

        let mut depth = 0usize;
        loop {
            match self.cur.kind {
                TokenKind::Eof => break,
                TokenKind::LBrace => {
                    depth += 1;
                    self.bump();
                }
                TokenKind::RBrace => {
                    if depth == 0 {
                        break;
                    }
                    depth -= 1;
                    self.bump();
                    if depth == 0 {
                        break;
                    }
                }
                TokenKind::Semi if depth == 0 => {
                    self.bump();
                    break;
                }
                _ if depth == 0 && self.cur.had_line_break_before => break,
                _ => self.bump(),
            }
        }

        Ok(self.store.alloc_stmt(Stmt::Empty(EmptyStmt {
            span: Span::new_with_checked(start, self.last_pos()),
        })))
    }

    fn parse_binding_pat(&mut self) -> PResult<swc_es_ast::PatId> {
        match self.cur.kind {
            TokenKind::Ident => {
                let ident = self.cur_ident_value();
                self.bump();
                let base = self.store.alloc_pat(Pat::Ident(Ident {
                    span: ident.span,
                    sym: ident.sym,
                }));

                if self.cur.kind == TokenKind::Eq {
                    let start = self.cur.span.lo;
                    self.bump();
                    let right = self.parse_expr()?;
                    return Ok(self.store.alloc_pat(Pat::Assign(swc_es_ast::AssignPat {
                        span: Span::new_with_checked(start, self.last_pos()),
                        left: base,
                        right,
                    })));
                }

                Ok(base)
            }
            TokenKind::LBracket => {
                let start = self.cur.span.lo;
                self.bump();
                let mut elems = Vec::new();
                while self.cur.kind != TokenKind::RBracket && self.cur.kind != TokenKind::Eof {
                    if self.cur.kind == TokenKind::Comma {
                        self.bump();
                        elems.push(None);
                        continue;
                    }

                    if self.cur.kind == TokenKind::DotDotDot {
                        let rest_start = self.cur.span.lo;
                        self.bump();
                        let arg = self.parse_binding_pat()?;
                        let rest = self.store.alloc_pat(Pat::Rest(RestPat {
                            span: Span::new_with_checked(rest_start, self.last_pos()),
                            arg,
                        }));
                        elems.push(Some(rest));
                        break;
                    }

                    elems.push(Some(self.parse_binding_pat()?));
                    if self.cur.kind == TokenKind::Comma {
                        self.bump();
                    } else {
                        break;
                    }
                }
                let _ = self.expect(TokenKind::RBracket, "]")?;
                Ok(self.store.alloc_pat(Pat::Array(ArrayPat {
                    span: Span::new_with_checked(start, self.last_pos()),
                    elems,
                })))
            }
            _ => Err(Error::new(
                self.cur.span,
                Severity::Fatal,
                ErrorCode::InvalidIdentifier,
                "expected binding pattern",
            )),
        }
    }

    fn parse_expr_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        let expr = self.parse_expr()?;
        self.eat_semi();

        Ok(self.store.alloc_stmt(Stmt::Expr(ExprStmt {
            span: Span::new_with_checked(start, self.last_pos()),
            expr,
        })))
    }

    fn parse_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        self.parse_assignment_expr()
    }

    fn parse_assignment_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let left = self.parse_logical_or_expr()?;
        let op = match self.cur.kind {
            TokenKind::Eq => Some(AssignOp::Assign),
            TokenKind::PlusEq => Some(AssignOp::AddAssign),
            TokenKind::MinusEq => Some(AssignOp::SubAssign),
            TokenKind::StarEq => Some(AssignOp::MulAssign),
            TokenKind::SlashEq => Some(AssignOp::DivAssign),
            TokenKind::PercentEq => Some(AssignOp::ModAssign),
            _ => None,
        };

        if let Some(op) = op {
            let start = self.cur.span.lo;
            self.bump();
            let right = self.parse_assignment_expr()?;
            let left_pat = self.expr_to_assign_pat(left);
            return Ok(self.store.alloc_expr(Expr::Assign(AssignExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                left: left_pat,
                op,
                right,
            })));
        }

        if self.syntax().typescript() && self.cur.kind == TokenKind::Keyword(Keyword::As) {
            let start = self.cur.span.lo;
            self.bump();
            let ty = self.parse_ts_type()?;
            return Ok(self.store.alloc_expr(Expr::TsAs(swc_es_ast::TsAsExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                expr: left,
                ty,
            })));
        }

        Ok(left)
    }

    fn parse_logical_or_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_logical_and_expr()?;

        while self.cur.kind == TokenKind::OrOr || self.cur.kind == TokenKind::Nullish {
            let start = self.cur.span.lo;
            let op = match self.cur.kind {
                TokenKind::OrOr => BinaryOp::LogicalOr,
                TokenKind::Nullish => BinaryOp::LogicalOr,
                _ => unreachable!(),
            };
            self.bump();
            let right = self.parse_logical_and_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op,
                left: expr,
                right,
            }));
        }

        Ok(expr)
    }

    fn parse_logical_and_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_equality_expr()?;

        while self.cur.kind == TokenKind::AndAnd {
            let start = self.cur.span.lo;
            self.bump();
            let right = self.parse_equality_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op: BinaryOp::LogicalAnd,
                left: expr,
                right,
            }));
        }

        Ok(expr)
    }

    fn parse_equality_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_relational_expr()?;

        while matches!(
            self.cur.kind,
            TokenKind::EqEq | TokenKind::EqEqEq | TokenKind::NotEq | TokenKind::NotEqEq
        ) {
            let start = self.cur.span.lo;
            let op = match self.cur.kind {
                TokenKind::EqEq => BinaryOp::EqEq,
                TokenKind::EqEqEq => BinaryOp::EqEqEq,
                TokenKind::NotEq => BinaryOp::NotEq,
                TokenKind::NotEqEq => BinaryOp::NotEqEq,
                _ => unreachable!(),
            };
            self.bump();
            let right = self.parse_relational_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op,
                left: expr,
                right,
            }));
        }

        Ok(expr)
    }

    fn parse_relational_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_additive_expr()?;

        while matches!(
            self.cur.kind,
            TokenKind::Lt | TokenKind::Gt | TokenKind::LtEq | TokenKind::GtEq
        ) {
            let start = self.cur.span.lo;
            let op = match self.cur.kind {
                TokenKind::Lt => BinaryOp::Lt,
                TokenKind::Gt => BinaryOp::Gt,
                TokenKind::LtEq => BinaryOp::LtEq,
                TokenKind::GtEq => BinaryOp::GtEq,
                _ => unreachable!(),
            };
            self.bump();
            let right = self.parse_additive_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op,
                left: expr,
                right,
            }));
        }

        Ok(expr)
    }

    fn parse_additive_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_multiplicative_expr()?;

        while self.cur.kind == TokenKind::Plus || self.cur.kind == TokenKind::Minus {
            let start = self.cur.span.lo;
            let op = if self.cur.kind == TokenKind::Plus {
                BinaryOp::Add
            } else {
                BinaryOp::Sub
            };
            self.bump();
            let right = self.parse_multiplicative_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op,
                left: expr,
                right,
            }));
        }

        Ok(expr)
    }

    fn parse_multiplicative_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_unary_expr()?;

        while matches!(
            self.cur.kind,
            TokenKind::Star | TokenKind::Slash | TokenKind::Percent
        ) {
            let start = self.cur.span.lo;
            let op = match self.cur.kind {
                TokenKind::Star => BinaryOp::Mul,
                TokenKind::Slash => BinaryOp::Div,
                TokenKind::Percent => BinaryOp::Mod,
                _ => unreachable!(),
            };
            self.bump();
            let right = self.parse_unary_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op,
                left: expr,
                right,
            }));
        }

        Ok(expr)
    }

    fn parse_unary_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;

        let op = match self.cur.kind {
            TokenKind::Plus => Some(UnaryOp::Plus),
            TokenKind::Minus => Some(UnaryOp::Minus),
            TokenKind::Bang => Some(UnaryOp::Bang),
            TokenKind::Keyword(Keyword::TypeOf) => Some(UnaryOp::TypeOf),
            TokenKind::Keyword(Keyword::Void) => Some(UnaryOp::Void),
            _ => None,
        };

        if let Some(op) = op {
            self.bump();
            let arg = self.parse_unary_expr()?;
            return Ok(self.store.alloc_expr(Expr::Unary(UnaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op,
                arg,
            })));
        }

        self.parse_postfix_expr()
    }

    fn parse_postfix_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_primary_expr()?;

        loop {
            match self.cur.kind {
                TokenKind::Dot => {
                    let start = self.cur.span.lo;
                    self.bump();
                    let ident = self.expect_ident()?;
                    expr = self.store.alloc_expr(Expr::Member(MemberExpr {
                        span: Span::new_with_checked(start, self.last_pos()),
                        obj: expr,
                        prop: MemberProp::Ident(ident),
                    }));
                }
                TokenKind::LBracket => {
                    let start = self.cur.span.lo;
                    self.bump();
                    let prop = self.parse_expr()?;
                    let _ = self.expect(TokenKind::RBracket, "]")?;
                    expr = self.store.alloc_expr(Expr::Member(MemberExpr {
                        span: Span::new_with_checked(start, self.last_pos()),
                        obj: expr,
                        prop: MemberProp::Computed(prop),
                    }));
                }
                TokenKind::LParen => {
                    let start = self.cur.span.lo;
                    self.bump();
                    let mut args = Vec::new();
                    while self.cur.kind != TokenKind::RParen && self.cur.kind != TokenKind::Eof {
                        let spread = self.cur.kind == TokenKind::DotDotDot;
                        if spread {
                            self.bump();
                        }
                        let arg = self.parse_expr()?;
                        args.push(ExprOrSpread { spread, expr: arg });
                        if self.cur.kind != TokenKind::RParen {
                            let _ = self.expect(TokenKind::Comma, ",")?;
                        }
                    }
                    let _ = self.expect(TokenKind::RParen, ")")?;
                    expr = self.store.alloc_expr(Expr::Call(CallExpr {
                        span: Span::new_with_checked(start, self.last_pos()),
                        callee: expr,
                        args,
                    }));
                }
                _ => break,
            }
        }

        Ok(expr)
    }

    fn parse_primary_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        match self.cur.kind {
            TokenKind::Ident => {
                let ident = self.cur_ident_value();
                self.bump();
                Ok(self.store.alloc_expr(Expr::Ident(ident)))
            }
            TokenKind::Num => {
                let lit = self.cur_number_value();
                self.bump();
                Ok(self.store.alloc_expr(Expr::Lit(Lit::Num(lit))))
            }
            TokenKind::Str => {
                let lit = self.cur_string_value();
                self.bump();
                Ok(self.store.alloc_expr(Expr::Lit(Lit::Str(lit))))
            }
            TokenKind::Keyword(Keyword::True) => {
                let span = self.cur.span;
                self.bump();
                Ok(self
                    .store
                    .alloc_expr(Expr::Lit(Lit::Bool(BoolLit { span, value: true }))))
            }
            TokenKind::Keyword(Keyword::False) => {
                let span = self.cur.span;
                self.bump();
                Ok(self
                    .store
                    .alloc_expr(Expr::Lit(Lit::Bool(BoolLit { span, value: false }))))
            }
            TokenKind::Keyword(Keyword::Null) => {
                let span = self.cur.span;
                self.bump();
                Ok(self
                    .store
                    .alloc_expr(Expr::Lit(Lit::Null(NullLit { span }))))
            }
            TokenKind::Keyword(Keyword::This) | TokenKind::Keyword(Keyword::Super) => {
                let span = self.cur.span;
                let sym = match self.cur.kind {
                    TokenKind::Keyword(Keyword::This) => Atom::new("this"),
                    _ => Atom::new("super"),
                };
                self.bump();
                Ok(self.store.alloc_expr(Expr::Ident(Ident { span, sym })))
            }
            TokenKind::Keyword(Keyword::Function) => self.parse_function_expr(),
            TokenKind::Keyword(Keyword::Class) => self.parse_class_expr(),
            TokenKind::LBracket => self.parse_array_expr(),
            TokenKind::LBrace => self.parse_object_expr(),
            TokenKind::Lt if self.syntax().jsx() => self.parse_jsx_element_expr(),
            TokenKind::LParen => {
                self.bump();
                let expr = self.parse_expr()?;
                let _ = self.expect(TokenKind::RParen, ")")?;
                Ok(expr)
            }
            TokenKind::Eof => Err(Error::new(
                self.cur.span,
                Severity::Fatal,
                ErrorCode::Eof,
                "unexpected eof",
            )),
            _ => {
                let err = Error::new(
                    self.cur.span,
                    Severity::Error,
                    ErrorCode::UnexpectedToken,
                    "unexpected token while parsing expression",
                );
                self.errors.push(err);

                // Recover by consuming one token and returning a sentinel literal.
                self.bump();
                Ok(self
                    .store
                    .alloc_expr(Expr::Lit(Lit::Null(NullLit { span: DUMMY_SP }))))
            }
        }
    }

    fn parse_function_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;
        self.bump();

        let _ident = if self.cur.kind == TokenKind::Ident {
            let ident = self.cur_ident_value();
            self.bump();
            Some(ident)
        } else {
            None
        };

        let (params, body) = self.parse_function_parts()?;
        let function = self.store.alloc_function(Function {
            span: Span::new_with_checked(start, self.last_pos()),
            params: params
                .into_iter()
                .map(|pat| swc_es_ast::Param {
                    span: Span::new_with_checked(start, start),
                    pat,
                })
                .collect(),
            body,
            is_async: false,
            is_generator: false,
        });

        Ok(self.store.alloc_expr(Expr::Function(function)))
    }

    fn parse_class_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;
        self.bump();

        let ident = if self.cur.kind == TokenKind::Ident {
            let ident = self.cur_ident_value();
            self.bump();
            Some(ident)
        } else {
            None
        };

        let super_class = if self.cur.kind == TokenKind::Keyword(Keyword::Extends) {
            self.bump();
            Some(self.parse_expr()?)
        } else {
            None
        };

        let _ = self.expect(TokenKind::LBrace, "{")?;
        let mut members = Vec::new();
        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            // This bootstrap parser skips full class member parsing and stores
            // placeholders to keep tree shape stable.
            let member_start = self.cur.span.lo;
            let key = if self.cur.kind == TokenKind::Ident {
                swc_es_ast::PropName::Ident(self.cur_ident_value())
            } else {
                swc_es_ast::PropName::Str(StrLit {
                    span: self.cur.span,
                    value: Atom::new("member"),
                })
            };

            while self.cur.kind != TokenKind::Semi
                && self.cur.kind != TokenKind::RBrace
                && self.cur.kind != TokenKind::Eof
            {
                self.bump();
            }
            self.eat_semi();

            members.push(self.store.alloc_class_member(swc_es_ast::ClassMember::Prop(
                swc_es_ast::ClassProp {
                    span: Span::new_with_checked(member_start, self.last_pos()),
                    key,
                    value: None,
                    is_static: false,
                },
            )));
        }
        let _ = self.expect(TokenKind::RBrace, "}")?;

        let class = self.store.alloc_class(swc_es_ast::Class {
            span: Span::new_with_checked(start, self.last_pos()),
            ident,
            super_class,
            body: members,
        });

        Ok(self.store.alloc_expr(Expr::Class(class)))
    }

    fn parse_array_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;
        let _ = self.expect(TokenKind::LBracket, "[")?;
        let mut elems = Vec::new();

        while self.cur.kind != TokenKind::RBracket && self.cur.kind != TokenKind::Eof {
            if self.cur.kind == TokenKind::Comma {
                self.bump();
                elems.push(None);
                continue;
            }

            let spread = self.cur.kind == TokenKind::DotDotDot;
            if spread {
                self.bump();
            }
            let expr = self.parse_expr()?;
            elems.push(Some(ExprOrSpread { spread, expr }));

            if self.cur.kind == TokenKind::Comma {
                self.bump();
            } else {
                break;
            }
        }
        let _ = self.expect(TokenKind::RBracket, "]")?;

        Ok(self.store.alloc_expr(Expr::Array(ArrayExpr {
            span: Span::new_with_checked(start, self.last_pos()),
            elems,
        })))
    }

    fn parse_object_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;
        let _ = self.expect(TokenKind::LBrace, "{")?;
        let mut props = Vec::new();

        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            let key = match self.cur.kind {
                TokenKind::Ident => {
                    let ident = self.cur_ident_value();
                    self.bump();
                    PropName::Ident(ident)
                }
                TokenKind::Str => {
                    let str_lit = self.cur_string_value();
                    self.bump();
                    PropName::Str(str_lit)
                }
                TokenKind::Num => {
                    let num_lit = self.cur_number_value();
                    self.bump();
                    PropName::Num(num_lit)
                }
                TokenKind::LBracket => {
                    self.bump();
                    let expr = self.parse_expr()?;
                    let _ = self.expect(TokenKind::RBracket, "]")?;
                    PropName::Computed(expr)
                }
                _ => {
                    let err = Error::new(
                        self.cur.span,
                        Severity::Error,
                        ErrorCode::UnexpectedToken,
                        "invalid object key",
                    );
                    self.errors.push(err);
                    self.bump();
                    continue;
                }
            };

            let value = if self.cur.kind == TokenKind::Colon {
                self.bump();
                self.parse_expr()?
            } else {
                match &key {
                    PropName::Ident(ident) => self.store.alloc_expr(Expr::Ident(ident.clone())),
                    PropName::Str(str_lit) => {
                        self.store.alloc_expr(Expr::Lit(Lit::Str(str_lit.clone())))
                    }
                    PropName::Num(num_lit) => self.store.alloc_expr(Expr::Lit(Lit::Num(*num_lit))),
                    PropName::Computed(expr) => *expr,
                }
            };

            props.push(KeyValueProp {
                span: Span::new_with_checked(start, self.last_pos()),
                key,
                value,
            });

            if self.cur.kind == TokenKind::Comma {
                self.bump();
            } else {
                break;
            }
        }
        let _ = self.expect(TokenKind::RBrace, "}")?;

        Ok(self.store.alloc_expr(Expr::Object(ObjectExpr {
            span: Span::new_with_checked(start, self.last_pos()),
            props,
        })))
    }

    fn parse_jsx_element_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;
        let _ = self.expect(TokenKind::Lt, "<")?;
        let opening_name = self.parse_jsx_name()?;
        let mut attrs = Vec::new();

        while self.cur.kind != TokenKind::Gt
            && self.cur.kind != TokenKind::Eof
            && !(self.cur.kind == TokenKind::Slash && self.peek_kind() == TokenKind::Gt)
        {
            if let Some(name) = self.cur_name_atom() {
                let attr_span_lo = self.cur.span.lo;
                self.bump();
                let value = if self.cur.kind == TokenKind::Eq {
                    self.bump();
                    if self.cur.kind == TokenKind::Str {
                        let str_lit = self.cur_string_value();
                        self.bump();
                        Some(self.store.alloc_expr(Expr::Lit(Lit::Str(str_lit))))
                    } else if self.cur.kind == TokenKind::LBrace {
                        self.bump();
                        let expr = if self.cur.kind == TokenKind::RBrace {
                            self.store.alloc_expr(Expr::Lit(Lit::Null(NullLit {
                                span: self.cur.span,
                            })))
                        } else {
                            self.parse_expr()?
                        };
                        let _ = self.expect(TokenKind::RBrace, "}")?;
                        Some(expr)
                    } else {
                        Some(self.parse_primary_expr()?)
                    }
                } else {
                    None
                };
                attrs.push(swc_es_ast::JSXAttr {
                    span: Span::new_with_checked(attr_span_lo, self.last_pos()),
                    name,
                    value,
                });
            } else {
                self.bump();
            }
        }

        let self_closing = if self.cur.kind == TokenKind::Slash && self.peek_kind() == TokenKind::Gt
        {
            self.bump();
            let _ = self.expect(TokenKind::Gt, ">")?;
            true
        } else {
            let _ = self.expect(TokenKind::Gt, ">")?;
            false
        };

        if self_closing {
            let jsx_element = self.store.alloc_jsx_element(swc_es_ast::JSXElement {
                span: Span::new_with_checked(start, self.last_pos()),
                opening: swc_es_ast::JSXOpeningElement {
                    span: Span::new_with_checked(start, self.last_pos()),
                    name: opening_name,
                    attrs,
                    self_closing: true,
                },
                children: Vec::new(),
                closing: None,
            });
            return Ok(self.store.alloc_expr(Expr::JSXElement(jsx_element)));
        }

        let mut children = Vec::new();
        while self.cur.kind != TokenKind::Eof {
            if self.cur.kind == TokenKind::Lt && self.peek_kind() == TokenKind::Slash {
                break;
            }
            if self.cur.kind == TokenKind::Lt {
                let child = self.parse_jsx_element_expr()?;
                if let Some(Expr::JSXElement(id)) = self.store.expr(child).cloned() {
                    children.push(swc_es_ast::JSXElementChild::Element(id));
                } else {
                    children.push(swc_es_ast::JSXElementChild::Expr(child));
                }
                continue;
            }
            if self.cur.kind == TokenKind::LBrace {
                self.bump();
                let expr = if self.cur.kind == TokenKind::RBrace {
                    self.store.alloc_expr(Expr::Lit(Lit::Null(NullLit {
                        span: self.cur.span,
                    })))
                } else {
                    self.parse_expr()?
                };
                let _ = self.expect(TokenKind::RBrace, "}")?;
                children.push(swc_es_ast::JSXElementChild::Expr(expr));
                continue;
            }

            if let Some(text) = self.cur_name_atom() {
                children.push(swc_es_ast::JSXElementChild::Text(text));
                self.bump();
            } else {
                self.bump();
            }
        }

        let closing = if self.cur.kind == TokenKind::Lt && self.peek_kind() == TokenKind::Slash {
            self.bump();
            self.bump();
            let name = self.parse_jsx_name()?;
            let _ = self.expect(TokenKind::Gt, ">")?;
            Some(name)
        } else {
            None
        };

        let jsx_element = self.store.alloc_jsx_element(swc_es_ast::JSXElement {
            span: Span::new_with_checked(start, self.last_pos()),
            opening: swc_es_ast::JSXOpeningElement {
                span: Span::new_with_checked(start, self.last_pos()),
                name: opening_name,
                attrs,
                self_closing: false,
            },
            children,
            closing,
        });

        Ok(self.store.alloc_expr(Expr::JSXElement(jsx_element)))
    }

    fn parse_jsx_name(&mut self) -> PResult<swc_es_ast::JSXElementName> {
        if let Some(atom) = self.cur_name_atom() {
            self.bump();
            Ok(swc_es_ast::JSXElementName::Qualified(atom))
        } else {
            Err(self.expected("jsx name"))
        }
    }

    fn parse_ts_type(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        let start = self.cur.span.lo;
        let mut ty = self.parse_ts_primary_type()?;
        let mut complex = false;

        if self.cur.kind == TokenKind::Lt {
            complex = true;
            self.skip_balanced(TokenKind::Lt, TokenKind::Gt);
        }

        while self.cur.kind == TokenKind::LBracket && self.peek_kind() == TokenKind::RBracket {
            complex = true;
            self.bump();
            self.bump();
        }

        while matches!(self.cur.kind, TokenKind::Pipe | TokenKind::Amp) {
            complex = true;
            self.bump();
            let _ = self.parse_ts_primary_type()?;

            if self.cur.kind == TokenKind::Lt {
                self.skip_balanced(TokenKind::Lt, TokenKind::Gt);
            }

            while self.cur.kind == TokenKind::LBracket && self.peek_kind() == TokenKind::RBracket {
                self.bump();
                self.bump();
            }
        }

        if self.cur.kind == TokenKind::Arrow {
            complex = true;
            self.bump();
            let _ = self.parse_ts_type()?;
        }

        if complex {
            ty = self.alloc_ts_type_ref(start, "__complex");
        }

        Ok(ty)
    }

    fn parse_ts_primary_type(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        let start = self.cur.span.lo;
        let ty = match self.cur.kind {
            TokenKind::Keyword(Keyword::Any) => {
                self.bump();
                TsType::Keyword(TsKeywordType::Any)
            }
            TokenKind::Keyword(Keyword::Unknown) => {
                self.bump();
                TsType::Keyword(TsKeywordType::Unknown)
            }
            TokenKind::Keyword(Keyword::Never) => {
                self.bump();
                TsType::Keyword(TsKeywordType::Never)
            }
            TokenKind::Keyword(Keyword::Void) => {
                self.bump();
                TsType::Keyword(TsKeywordType::Void)
            }
            TokenKind::Keyword(Keyword::String) => {
                self.bump();
                TsType::Keyword(TsKeywordType::String)
            }
            TokenKind::Keyword(Keyword::Number) => {
                self.bump();
                TsType::Keyword(TsKeywordType::Number)
            }
            TokenKind::Keyword(Keyword::Boolean) => {
                self.bump();
                TsType::Keyword(TsKeywordType::Boolean)
            }
            TokenKind::Str => {
                let lit = self.cur_string_value();
                self.bump();
                TsType::Lit(swc_es_ast::TsLitType::Str(lit))
            }
            TokenKind::Num => {
                let lit = self.cur_number_value();
                self.bump();
                TsType::Lit(swc_es_ast::TsLitType::Num(lit))
            }
            TokenKind::Keyword(Keyword::True) => {
                let lit = BoolLit {
                    span: self.cur.span,
                    value: true,
                };
                self.bump();
                TsType::Lit(swc_es_ast::TsLitType::Bool(lit))
            }
            TokenKind::Keyword(Keyword::False) => {
                let lit = BoolLit {
                    span: self.cur.span,
                    value: false,
                };
                self.bump();
                TsType::Lit(swc_es_ast::TsLitType::Bool(lit))
            }
            TokenKind::Ident | TokenKind::Keyword(_) => {
                let name = self.parse_ts_type_name();
                TsType::TypeRef(TsTypeRef {
                    span: Span::new_with_checked(start, self.last_pos()),
                    name,
                })
            }
            TokenKind::LParen => {
                self.skip_balanced(TokenKind::LParen, TokenKind::RParen);
                return Ok(self.alloc_ts_type_ref(start, "__group"));
            }
            TokenKind::LBrace => {
                self.skip_balanced(TokenKind::LBrace, TokenKind::RBrace);
                return Ok(self.alloc_ts_type_ref(start, "__object"));
            }
            TokenKind::LBracket => {
                self.skip_balanced(TokenKind::LBracket, TokenKind::RBracket);
                return Ok(self.alloc_ts_type_ref(start, "__tuple"));
            }
            _ => {
                self.errors.push(Error::new(
                    self.cur.span,
                    Severity::Error,
                    ErrorCode::UnexpectedToken,
                    "unexpected token in TypeScript type",
                ));
                if self.cur.kind != TokenKind::Eof {
                    self.bump();
                }
                return Ok(self.alloc_ts_type_ref(start, "any"));
            }
        };

        Ok(self.store.alloc_ts_type(ty))
    }

    fn parse_ts_type_name(&mut self) -> Ident {
        let start = self.cur.span.lo;
        let mut name = String::new();

        loop {
            let Some(segment) = self.cur_name_atom() else {
                break;
            };
            if !name.is_empty() {
                name.push('.');
            }
            name.push_str(segment.as_ref());
            self.bump();

            if self.cur.kind != TokenKind::Dot {
                break;
            }
            self.bump();
        }

        if name.is_empty() {
            name.push('_');
        }

        Ident {
            span: Span::new_with_checked(start, self.last_pos()),
            sym: Atom::new(name),
        }
    }

    fn alloc_ts_type_ref(
        &mut self,
        start: swc_common::BytePos,
        name: &str,
    ) -> swc_es_ast::TsTypeId {
        let span = Span::new_with_checked(start, self.last_pos());
        self.store.alloc_ts_type(TsType::TypeRef(TsTypeRef {
            span,
            name: Ident {
                span,
                sym: Atom::new(name),
            },
        }))
    }

    fn recover_stmt(&mut self) {
        while self.cur.kind != TokenKind::Eof {
            match self.cur.kind {
                TokenKind::Semi => {
                    self.bump();
                    break;
                }
                TokenKind::RBrace => break,
                _ => self.bump(),
            }
        }
    }

    fn skip_balanced(&mut self, open: TokenKind, close: TokenKind) {
        if self.cur.kind != open {
            return;
        }

        let mut depth = 0usize;
        while self.cur.kind != TokenKind::Eof {
            if self.cur.kind == open {
                depth += 1;
                self.bump();
                continue;
            }

            if self.cur.kind == close {
                depth = depth.saturating_sub(1);
                self.bump();
                if depth == 0 {
                    break;
                }
                continue;
            }

            self.bump();
        }
    }

    fn expr_to_assign_pat(&mut self, expr: swc_es_ast::ExprId) -> swc_es_ast::PatId {
        match self.store.expr(expr).cloned() {
            Some(Expr::Ident(ident)) => self.store.alloc_pat(Pat::Ident(ident)),
            _ => {
                self.errors.push(Error::new(
                    self.cur.span,
                    Severity::Error,
                    ErrorCode::InvalidAssignTarget,
                    "invalid assignment target",
                ));
                self.store.alloc_pat(Pat::Expr(expr))
            }
        }
    }

    fn is_module_start(&self) -> bool {
        matches!(
            self.cur.kind,
            TokenKind::Keyword(Keyword::Import | Keyword::Export)
        )
    }

    fn cur_ident_value(&self) -> Ident {
        let sym = match &self.cur.value {
            Some(TokenValue::Ident(sym)) => sym.clone(),
            _ => Atom::new("_"),
        };
        Ident {
            span: self.cur.span,
            sym,
        }
    }

    fn cur_number_value(&self) -> NumberLit {
        NumberLit {
            span: self.cur.span,
            value: match self.cur.value {
                Some(TokenValue::Num(value)) => value,
                _ => 0.0,
            },
        }
    }

    fn cur_string_value(&self) -> StrLit {
        StrLit {
            span: self.cur.span,
            value: match &self.cur.value {
                Some(TokenValue::Str(value)) => value.clone(),
                _ => Atom::new(""),
            },
        }
    }

    fn cur_ident_is(&self, value: &str) -> bool {
        if self.cur.kind != TokenKind::Ident {
            return false;
        }
        match &self.cur.value {
            Some(TokenValue::Ident(sym)) => sym.as_ref() == value,
            _ => false,
        }
    }

    fn cur_name_atom(&self) -> Option<Atom> {
        match self.cur.kind {
            TokenKind::Ident => match &self.cur.value {
                Some(TokenValue::Ident(sym)) => Some(sym.clone()),
                _ => None,
            },
            TokenKind::Keyword(keyword) => Some(Atom::new(Self::keyword_text(keyword))),
            TokenKind::Str => match &self.cur.value {
                Some(TokenValue::Str(value)) => Some(value.clone()),
                _ => None,
            },
            TokenKind::Num => match self.cur.value {
                Some(TokenValue::Num(value)) => Some(Atom::new(value.to_string())),
                _ => None,
            },
            _ => None,
        }
    }

    fn peek_token(&mut self) -> &Token {
        if self.next.is_none() {
            self.next = Some(self.lexer.next_token());
        }
        self.next.as_ref().expect("peek token should exist")
    }

    fn peek_kind(&mut self) -> TokenKind {
        self.peek_token().kind
    }

    fn peek_ident_is(&mut self, value: &str) -> bool {
        let token = self.peek_token();
        if token.kind != TokenKind::Ident {
            return false;
        }
        match &token.value {
            Some(TokenValue::Ident(sym)) => sym.as_ref() == value,
            _ => false,
        }
    }

    fn expect_ident(&mut self) -> PResult<Ident> {
        if self.cur.kind != TokenKind::Ident {
            return Err(self.expected("identifier"));
        }
        let ident = self.cur_ident_value();
        self.bump();
        Ok(ident)
    }

    fn expect_string(&mut self) -> PResult<StrLit> {
        if self.cur.kind != TokenKind::Str {
            return Err(self.expected("string literal"));
        }
        let value = self.cur_string_value();
        self.bump();
        Ok(value)
    }

    fn expect(&mut self, kind: TokenKind, expected: &'static str) -> PResult<Span> {
        if self.cur.kind != kind {
            return Err(self.expected(expected));
        }
        let span = self.cur.span;
        self.bump();
        Ok(span)
    }

    fn expected(&self, expected: &'static str) -> Error {
        Error::new(
            self.cur.span,
            Severity::Fatal,
            ErrorCode::UnexpectedToken,
            format!("expected {expected}, got {:?}", self.cur.kind),
        )
    }

    fn eat_semi(&mut self) {
        if self.cur.kind == TokenKind::Semi {
            self.bump();
        }
    }

    fn bump(&mut self) {
        self.cur = self.next.take().unwrap_or_else(|| self.lexer.next_token());
    }

    fn last_pos(&self) -> swc_common::BytePos {
        self.cur.span.hi
    }

    fn keyword_text(keyword: Keyword) -> &'static str {
        match keyword {
            Keyword::Await => "await",
            Keyword::Break => "break",
            Keyword::Case => "case",
            Keyword::Catch => "catch",
            Keyword::Class => "class",
            Keyword::Const => "const",
            Keyword::Continue => "continue",
            Keyword::Debugger => "debugger",
            Keyword::Default => "default",
            Keyword::Delete => "delete",
            Keyword::Do => "do",
            Keyword::Else => "else",
            Keyword::Export => "export",
            Keyword::Extends => "extends",
            Keyword::False => "false",
            Keyword::Finally => "finally",
            Keyword::For => "for",
            Keyword::From => "from",
            Keyword::Function => "function",
            Keyword::If => "if",
            Keyword::Import => "import",
            Keyword::In => "in",
            Keyword::InstanceOf => "instanceof",
            Keyword::Let => "let",
            Keyword::New => "new",
            Keyword::Null => "null",
            Keyword::Return => "return",
            Keyword::Super => "super",
            Keyword::Switch => "switch",
            Keyword::This => "this",
            Keyword::Throw => "throw",
            Keyword::True => "true",
            Keyword::Try => "try",
            Keyword::TypeOf => "typeof",
            Keyword::Var => "var",
            Keyword::Void => "void",
            Keyword::While => "while",
            Keyword::With => "with",
            Keyword::Yield => "yield",
            Keyword::As => "as",
            Keyword::Interface => "interface",
            Keyword::Type => "type",
            Keyword::Enum => "enum",
            Keyword::Implements => "implements",
            Keyword::Public => "public",
            Keyword::Private => "private",
            Keyword::Protected => "protected",
            Keyword::Static => "static",
            Keyword::Declare => "declare",
            Keyword::Namespace => "namespace",
            Keyword::Module => "module",
            Keyword::Any => "any",
            Keyword::Number => "number",
            Keyword::String => "string",
            Keyword::Boolean => "boolean",
            Keyword::Unknown => "unknown",
            Keyword::Never => "never",
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{input::StringInput, FileName, SourceMap};

    use super::*;
    #[cfg(feature = "typescript")]
    use crate::syntax::TsSyntax;
    use crate::syntax::{EsSyntax, Syntax};

    #[test]
    fn parses_simple_script() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Custom("test.js".into()).into(),
            "let a = 1; a += 2;",
        );

        let lexer = Lexer::new(
            Syntax::Es(EsSyntax::default()),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let parsed = parser.parse_script().expect("script should parse");
        let program = parsed
            .store
            .program(parsed.program)
            .expect("program should exist");

        assert_eq!(program.kind, ProgramKind::Script);
        assert_eq!(program.body.len(), 2);
    }

    #[test]
    fn parses_module_import_export() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Custom("test.mjs".into()).into(),
            "import 'a'; export default 1;",
        );

        let lexer = Lexer::new(Syntax::default(), StringInput::from(&*fm), None);
        let mut parser = Parser::new_from(lexer);

        let parsed = parser.parse_program().expect("program should parse");
        let program = parsed
            .store
            .program(parsed.program)
            .expect("program should exist");

        assert_eq!(program.kind, ProgramKind::Module);
        assert_eq!(program.body.len(), 2);
    }

    #[test]
    fn parses_for_array_and_object_literals() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Custom("for.js".into()).into(),
            "for (let i = 0; i < 3; i++) { const arr = [1, 2]; const obj = { arr }; }",
        );

        let lexer = Lexer::new(
            Syntax::Es(EsSyntax::default()),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let parsed = parser.parse_script().expect("script should parse");
        let program = parsed
            .store
            .program(parsed.program)
            .expect("program should exist");

        assert_eq!(program.body.len(), 1);
        let stmt = parsed
            .store
            .stmt(program.body[0])
            .expect("for statement should exist");
        assert!(matches!(stmt, Stmt::For(..)));
    }

    #[test]
    fn parses_jsx_element_expression() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Custom("component.jsx".into()).into(),
            "<Button disabled>{label}</Button>;",
        );

        let lexer = Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let parsed = parser.parse_script().expect("jsx should parse");
        let program = parsed
            .store
            .program(parsed.program)
            .expect("program should exist");

        assert_eq!(program.body.len(), 1);
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_typescript_type_alias_and_as_expression() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Custom("types.ts".into()).into(),
            "type Box<T> = string | number; const value = input as Box;",
        );

        let lexer = Lexer::new(
            Syntax::Typescript(TsSyntax::default()),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let parsed = parser.parse_program().expect("typescript should parse");
        let program = parsed
            .store
            .program(parsed.program)
            .expect("program should exist");

        assert_eq!(program.body.len(), 2);
    }
}
