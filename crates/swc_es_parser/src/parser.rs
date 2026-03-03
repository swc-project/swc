use swc_atoms::Atom;
use swc_common::{Span, DUMMY_SP};
use swc_es_ast::{
    ArrayExpr, ArrayPat, AssignExpr, AssignOp, AstStore, BinaryExpr, BinaryOp, BlockStmt, BoolLit,
    CallExpr, Decl, EmptyStmt, Expr, ExprOrSpread, ExprStmt, FnDecl, ForBinding, ForClassicHead,
    ForHead, ForInHead, ForInit, ForOfHead, ForStmt, Function, Ident, IfStmt, KeyValueProp, Lit,
    MemberExpr, MemberProp, ModuleDecl, NullLit, NumberLit, ObjectExpr, Pat, Program, ProgramId,
    ProgramKind, PropName, RestPat, ReturnStmt, Stmt, StrLit, TsArrayType, TsFnParam, TsFnType,
    TsIntersectionType, TsKeywordType, TsParenthesizedType, TsTupleType, TsType, TsTypeAliasDecl,
    TsTypeLit, TsTypeRef, TsUnionType, UnaryExpr, UnaryOp, VarDecl, VarDeclKind, VarDeclarator,
    WhileStmt, WithStmt,
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
        self.ctx.remove(Context::MODULE | Context::CAN_BE_MODULE);
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
        self.ctx.insert(Context::CAN_BE_MODULE);
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
        let is_labeled = self.cur.kind == TokenKind::Ident && self.peek_kind() == TokenKind::Colon;
        let is_const_enum = self.cur.kind == TokenKind::Keyword(Keyword::Const)
            && self.syntax().typescript()
            && self.peek_kind() == TokenKind::Keyword(Keyword::Enum);
        let is_dynamic_import = self.cur.kind == TokenKind::Keyword(Keyword::Import)
            && matches!(self.peek_kind(), TokenKind::LParen | TokenKind::Dot);

        match self.cur.kind {
            TokenKind::At if self.syntax().decorators() => self.parse_decorated_stmt(),
            TokenKind::Semi => {
                let span = self.cur.span;
                self.bump();
                Ok(self.store.alloc_stmt(Stmt::Empty(EmptyStmt { span })))
            }
            TokenKind::LBrace => self.parse_block_stmt(),
            TokenKind::Keyword(Keyword::If) => self.parse_if_stmt(),
            TokenKind::Keyword(Keyword::While) => self.parse_while_stmt(),
            TokenKind::Keyword(Keyword::Do) => self.parse_do_while_stmt(),
            TokenKind::Keyword(Keyword::Switch) => self.parse_switch_stmt(),
            TokenKind::Keyword(Keyword::Try) => self.parse_try_stmt(),
            TokenKind::Keyword(Keyword::Throw) => self.parse_throw_stmt(),
            TokenKind::Keyword(Keyword::With) => self.parse_with_compat_stmt(),
            TokenKind::Keyword(Keyword::Break) => self.parse_break_stmt(),
            TokenKind::Keyword(Keyword::Continue) => self.parse_continue_stmt(),
            TokenKind::Keyword(Keyword::Debugger) => self.parse_debugger_stmt(),
            TokenKind::Keyword(Keyword::For) => self.parse_for_stmt(),
            TokenKind::Keyword(Keyword::Return) => self.parse_return_stmt(),
            TokenKind::Keyword(Keyword::Function) => self.parse_function_decl_stmt(),
            TokenKind::Keyword(Keyword::Class) => self.parse_class_decl_stmt(),
            TokenKind::Keyword(Keyword::Const) if is_const_enum => self.parse_ts_enum_decl_stmt(),
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
            TokenKind::Keyword(Keyword::Interface) if self.syntax().typescript() => {
                self.parse_ts_interface_decl_stmt()
            }
            TokenKind::Keyword(Keyword::Enum) if self.syntax().typescript() => {
                self.parse_ts_enum_decl_stmt()
            }
            TokenKind::Keyword(Keyword::Namespace | Keyword::Module | Keyword::Declare)
                if self.syntax().typescript() =>
            {
                self.parse_ts_skip_decl_stmt()
            }
            TokenKind::Keyword(Keyword::Import | Keyword::Export)
                if !self.ctx.contains(Context::MODULE) && !is_dynamic_import =>
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
            TokenKind::Ident if is_labeled => self.parse_labeled_stmt(),
            _ => self.parse_expr_stmt(),
        }
    }

    fn parse_decorated_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        self.skip_decorators()?;
        if self.cur.kind == TokenKind::Keyword(Keyword::Export)
            && (self.ctx.contains(Context::MODULE) || self.ctx.contains(Context::CAN_BE_MODULE))
        {
            return self.parse_module_decl_stmt();
        }
        if self.cur.kind == TokenKind::Keyword(Keyword::Class) {
            return self.parse_class_decl_stmt();
        }
        self.parse_stmt()
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
        let mut specifiers = Vec::new();
        let src = if self.cur.kind == TokenKind::Str {
            let src = self.cur_string_value();
            self.bump();
            src
        } else {
            if self.cur.kind == TokenKind::Ident {
                let local = self.expect_ident()?;
                specifiers.push(swc_es_ast::ImportSpecifier::Default(
                    swc_es_ast::ImportDefaultSpecifier { local },
                ));
                if self.cur.kind == TokenKind::Comma {
                    self.bump();
                }
            }

            if self.cur.kind == TokenKind::Star {
                self.bump();
                if self.cur.kind == TokenKind::Keyword(Keyword::As) {
                    self.bump();
                }
                let local = self.expect_ident()?;
                specifiers.push(swc_es_ast::ImportSpecifier::Namespace(
                    swc_es_ast::ImportNamespaceSpecifier { local },
                ));
            } else if self.cur.kind == TokenKind::LBrace {
                self.bump();
                while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
                    let imported = self.parse_module_export_name()?;
                    let local = if self.cur.kind == TokenKind::Keyword(Keyword::As) {
                        self.bump();
                        self.expect_ident()?
                    } else {
                        imported.clone()
                    };
                    specifiers.push(swc_es_ast::ImportSpecifier::Named(
                        swc_es_ast::ImportNamedSpecifier {
                            local,
                            imported: Some(imported),
                        },
                    ));
                    if self.cur.kind == TokenKind::Comma {
                        self.bump();
                    } else {
                        break;
                    }
                }
                let _ = self.expect(TokenKind::RBrace, "}")?;
            }

            if self.cur.kind == TokenKind::Keyword(Keyword::From) {
                self.bump();
            }

            if self.cur.kind == TokenKind::Str {
                let src = self.cur_string_value();
                self.bump();
                src
            } else {
                StrLit {
                    span: DUMMY_SP,
                    value: Atom::new(""),
                }
            }
        };

        while self.cur.kind != TokenKind::Semi && self.cur.kind != TokenKind::Eof {
            self.bump();
        }
        self.eat_semi();

        Ok(ModuleDecl::Import(swc_es_ast::ImportDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            specifiers,
            src,
        }))
    }

    fn parse_export_decl(&mut self, start: swc_common::BytePos) -> PResult<ModuleDecl> {
        self.bump();

        if self.cur.kind == TokenKind::Keyword(Keyword::Default) {
            self.bump();
            if self.cur.kind == TokenKind::Keyword(Keyword::Function) {
                let fn_start = self.cur.span.lo;
                self.bump();
                if self.cur.kind == TokenKind::Star {
                    self.bump();
                }
                let ident = if self.cur.kind == TokenKind::Ident {
                    self.expect_ident()?
                } else {
                    Ident::new(
                        Span::new_with_checked(fn_start, fn_start),
                        Atom::new("default"),
                    )
                };
                let (params, body) = self.parse_function_parts()?;
                let decl = self.store.alloc_decl(Decl::Fn(FnDecl {
                    span: Span::new_with_checked(fn_start, self.last_pos()),
                    ident,
                    params,
                    body,
                }));
                self.eat_semi();
                return Ok(ModuleDecl::ExportDefaultDecl(
                    swc_es_ast::ExportDefaultDecl {
                        span: Span::new_with_checked(start, self.last_pos()),
                        decl,
                    },
                ));
            }
            if self.cur.kind == TokenKind::Keyword(Keyword::Class) {
                let class_expr = self.parse_class_expr()?;
                let Some(Expr::Class(class_id)) = self.store.expr(class_expr).cloned() else {
                    return Err(Error::new(
                        self.cur.span,
                        Severity::Fatal,
                        ErrorCode::InvalidStatement,
                        "expected class declaration",
                    ));
                };
                let ident = match self.store.class(class_id).and_then(|c| c.ident.clone()) {
                    Some(ident) => ident,
                    None => Ident::new(Span::new_with_checked(start, start), Atom::new("default")),
                };
                let decl = self.store.alloc_decl(Decl::Class(swc_es_ast::ClassDecl {
                    span: Span::new_with_checked(start, self.last_pos()),
                    ident,
                    class: class_id,
                }));
                self.eat_semi();
                return Ok(ModuleDecl::ExportDefaultDecl(
                    swc_es_ast::ExportDefaultDecl {
                        span: Span::new_with_checked(start, self.last_pos()),
                        decl,
                    },
                ));
            }
            let expr = self.parse_expr()?;
            self.eat_semi();
            return Ok(ModuleDecl::ExportDefaultExpr(
                swc_es_ast::ExportDefaultExprDecl {
                    span: Span::new_with_checked(start, self.last_pos()),
                    expr,
                },
            ));
        }

        if self.cur.kind == TokenKind::Star {
            self.bump();
            if self.cur.kind == TokenKind::Keyword(Keyword::As) {
                self.bump();
                let _ = self.parse_module_export_name()?;
            }
            if self.cur.kind == TokenKind::Keyword(Keyword::From) {
                self.bump();
            }
            let src = if self.cur.kind == TokenKind::Str {
                let src = self.cur_string_value();
                self.bump();
                src
            } else {
                StrLit {
                    span: DUMMY_SP,
                    value: Atom::new(""),
                }
            };
            self.eat_semi();
            return Ok(ModuleDecl::ExportAll(swc_es_ast::ExportAllDecl {
                span: Span::new_with_checked(start, self.last_pos()),
                src,
            }));
        }

        if self.cur.kind == TokenKind::LBrace {
            self.bump();
            let mut specifiers = Vec::new();
            while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
                let local = self.parse_module_export_name()?;
                let exported = if self.cur.kind == TokenKind::Keyword(Keyword::As) {
                    self.bump();
                    Some(self.parse_module_export_name()?)
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

        if self.syntax().typescript()
            && self.cur.kind == TokenKind::Keyword(Keyword::Const)
            && self.peek_keyword_is(Keyword::Enum)
        {
            let decl = self.parse_ts_enum_decl()?;
            return Ok(ModuleDecl::ExportDecl(swc_es_ast::ExportDecl {
                span: Span::new_with_checked(start, self.last_pos()),
                decl,
            }));
        }

        let decl = self.parse_decl()?;
        Ok(ModuleDecl::ExportDecl(swc_es_ast::ExportDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            decl,
        }))
    }

    fn parse_decl(&mut self) -> PResult<swc_es_ast::DeclId> {
        let is_const_enum = self.cur.kind == TokenKind::Keyword(Keyword::Const)
            && self.syntax().typescript()
            && self.peek_kind() == TokenKind::Keyword(Keyword::Enum);
        match self.cur.kind {
            TokenKind::Keyword(Keyword::Const) if is_const_enum => self.parse_ts_enum_decl(),
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
            TokenKind::Keyword(Keyword::Class) => {
                let stmt = self.parse_class_decl_stmt()?;
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
            TokenKind::Keyword(Keyword::Interface) if self.syntax().typescript() => {
                let stmt = self.parse_ts_interface_decl_stmt()?;
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
            TokenKind::Keyword(Keyword::Enum) if self.syntax().typescript() => {
                let stmt = self.parse_ts_enum_decl_stmt()?;
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

    fn parse_do_while_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();

        let old_ctx = self.ctx;
        self.ctx.insert(Context::IN_LOOP);
        let body = self.parse_stmt()?;
        self.ctx = old_ctx;

        let _ = self.expect(TokenKind::Keyword(Keyword::While), "while")?;
        let _ = self.expect(TokenKind::LParen, "(")?;
        let test = self.parse_expr()?;
        let _ = self.expect(TokenKind::RParen, ")")?;
        self.eat_semi();

        Ok(self
            .store
            .alloc_stmt(Stmt::DoWhile(swc_es_ast::DoWhileStmt {
                span: Span::new_with_checked(start, self.last_pos()),
                body,
                test,
            })))
    }

    fn parse_switch_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();
        let _ = self.expect(TokenKind::LParen, "(")?;
        let discriminant = self.parse_expr()?;
        let _ = self.expect(TokenKind::RParen, ")")?;
        let _ = self.expect(TokenKind::LBrace, "{")?;

        let mut cases = Vec::new();
        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            let case_start = self.cur.span.lo;
            let test = match self.cur.kind {
                TokenKind::Keyword(Keyword::Case) => {
                    self.bump();
                    let expr = self.parse_expr()?;
                    let _ = self.expect(TokenKind::Colon, ":")?;
                    Some(expr)
                }
                TokenKind::Keyword(Keyword::Default) => {
                    self.bump();
                    let _ = self.expect(TokenKind::Colon, ":")?;
                    None
                }
                _ => {
                    self.bump();
                    continue;
                }
            };

            let mut cons = Vec::new();
            while !matches!(
                self.cur.kind,
                TokenKind::Keyword(Keyword::Case | Keyword::Default)
                    | TokenKind::RBrace
                    | TokenKind::Eof
            ) {
                cons.push(self.parse_stmt()?);
            }

            cases.push(swc_es_ast::SwitchCase {
                span: Span::new_with_checked(case_start, self.last_pos()),
                test,
                cons,
            });
        }

        let _ = self.expect(TokenKind::RBrace, "}")?;

        Ok(self.store.alloc_stmt(Stmt::Switch(swc_es_ast::SwitchStmt {
            span: Span::new_with_checked(start, self.last_pos()),
            discriminant,
            cases,
        })))
    }

    fn parse_try_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();
        let block = self.parse_block_stmt()?;

        let handler = if self.cur.kind == TokenKind::Keyword(Keyword::Catch) {
            let catch_start = self.cur.span.lo;
            self.bump();
            let param = if self.cur.kind == TokenKind::LParen {
                self.bump();
                let mut pat = self.parse_binding_pat()?;
                if self.syntax().typescript() {
                    pat = self.parse_ts_pat_suffix(pat)?;
                }
                let _ = self.expect(TokenKind::RParen, ")")?;
                Some(pat)
            } else {
                None
            };
            let body = self.parse_block_stmt()?;
            Some(swc_es_ast::CatchClause {
                span: Span::new_with_checked(catch_start, self.last_pos()),
                param,
                body,
            })
        } else {
            None
        };

        let finalizer = if self.cur.kind == TokenKind::Keyword(Keyword::Finally) {
            self.bump();
            Some(self.parse_block_stmt()?)
        } else {
            None
        };

        Ok(self.store.alloc_stmt(Stmt::Try(swc_es_ast::TryStmt {
            span: Span::new_with_checked(start, self.last_pos()),
            block,
            handler,
            finalizer,
        })))
    }

    fn parse_throw_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();

        let arg = if self.cur.had_line_break_before || self.cur.kind == TokenKind::Semi {
            self.store
                .alloc_expr(Expr::Lit(Lit::Null(NullLit { span: DUMMY_SP })))
        } else {
            self.parse_expr()?
        };
        self.eat_semi();

        Ok(self.store.alloc_stmt(Stmt::Throw(swc_es_ast::ThrowStmt {
            span: Span::new_with_checked(start, self.last_pos()),
            arg,
        })))
    }

    fn parse_with_compat_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();
        let _ = self.expect(TokenKind::LParen, "(")?;
        let obj = self.parse_expr()?;
        let _ = self.expect(TokenKind::RParen, ")")?;
        let body = self.parse_stmt()?;
        Ok(self.store.alloc_stmt(Stmt::With(WithStmt {
            span: Span::new_with_checked(start, self.last_pos()),
            obj,
            body,
        })))
    }

    fn parse_break_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();
        let label = if self.cur.kind == TokenKind::Ident {
            let ident = self.cur_ident_value();
            self.bump();
            Some(ident)
        } else {
            None
        };
        self.eat_semi();

        Ok(self.store.alloc_stmt(Stmt::Break(swc_es_ast::BreakStmt {
            span: Span::new_with_checked(start, self.last_pos()),
            label,
        })))
    }

    fn parse_continue_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();
        let label = if self.cur.kind == TokenKind::Ident {
            let ident = self.cur_ident_value();
            self.bump();
            Some(ident)
        } else {
            None
        };
        self.eat_semi();

        Ok(self
            .store
            .alloc_stmt(Stmt::Continue(swc_es_ast::ContinueStmt {
                span: Span::new_with_checked(start, self.last_pos()),
                label,
            })))
    }

    fn parse_debugger_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let span = self.cur.span;
        self.bump();
        self.eat_semi();
        Ok(self
            .store
            .alloc_stmt(Stmt::Debugger(swc_es_ast::DebuggerStmt { span })))
    }

    fn parse_labeled_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        let label = self.expect_ident()?;
        let _ = self.expect(TokenKind::Colon, ":")?;
        let body = self.parse_stmt()?;

        Ok(self
            .store
            .alloc_stmt(Stmt::Labeled(swc_es_ast::LabeledStmt {
                span: Span::new_with_checked(start, self.last_pos()),
                label,
                body,
            })))
    }

    fn parse_for_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();
        let is_await = if self.cur.kind == TokenKind::Keyword(Keyword::Await) {
            self.bump();
            true
        } else {
            false
        };
        let _ = self.expect(TokenKind::LParen, "(")?;

        let head = if self.cur.kind == TokenKind::Semi {
            self.bump();
            let test = if self.cur.kind == TokenKind::Semi {
                None
            } else {
                Some(self.parse_expr()?)
            };
            let _ = self.expect(TokenKind::Semi, ";")?;
            let update = if self.cur.kind == TokenKind::RParen {
                None
            } else {
                let expr = self.parse_expr()?;
                if matches!(self.cur.kind, TokenKind::PlusPlus | TokenKind::MinusMinus) {
                    self.bump();
                }
                Some(expr)
            };
            ForHead::Classic(ForClassicHead {
                init: None,
                test,
                update,
            })
        } else {
            let init = self.parse_for_init()?;
            if self.cur.kind == TokenKind::Keyword(Keyword::In) {
                self.bump();
                let right = self.parse_expr()?;
                ForHead::In(ForInHead {
                    left: self.for_init_to_binding(init),
                    right,
                })
            } else if self.cur_ident_is("of") {
                self.bump();
                let right = self.parse_expr()?;
                ForHead::Of(ForOfHead {
                    is_await,
                    left: self.for_init_to_binding(init),
                    right,
                })
            } else {
                if is_await {
                    self.errors.push(Error::new(
                        self.cur.span,
                        Severity::Error,
                        ErrorCode::UnexpectedToken,
                        "for await requires an of-clause",
                    ));
                }
                let _ = self.expect(TokenKind::Semi, ";")?;
                let test = if self.cur.kind == TokenKind::Semi {
                    None
                } else {
                    Some(self.parse_expr()?)
                };
                let _ = self.expect(TokenKind::Semi, ";")?;
                let update = if self.cur.kind == TokenKind::RParen {
                    None
                } else {
                    let expr = self.parse_expr()?;
                    if matches!(self.cur.kind, TokenKind::PlusPlus | TokenKind::MinusMinus) {
                        self.bump();
                    }
                    Some(expr)
                };
                ForHead::Classic(ForClassicHead {
                    init: Some(init),
                    test,
                    update,
                })
            }
        };
        let _ = self.expect(TokenKind::RParen, ")")?;

        let old_ctx = self.ctx;
        self.ctx.insert(Context::IN_LOOP);
        let body = self.parse_stmt()?;
        self.ctx = old_ctx;

        Ok(self.store.alloc_stmt(Stmt::For(ForStmt {
            span: Span::new_with_checked(start, self.last_pos()),
            head,
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
        if self.cur.kind == TokenKind::Star {
            self.bump();
        }

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

    fn parse_class_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        let class_expr = self.parse_class_expr()?;
        let Some(Expr::Class(class_id)) = self.store.expr(class_expr).cloned() else {
            return Err(Error::new(
                self.cur.span,
                Severity::Fatal,
                ErrorCode::InvalidStatement,
                "expected class expression",
            ));
        };
        let Some(class) = self.store.class(class_id).cloned() else {
            return Err(Error::new(
                self.cur.span,
                Severity::Fatal,
                ErrorCode::InvalidStatement,
                "missing class node",
            ));
        };
        let Some(ident) = class.ident else {
            return Err(Error::new(
                self.cur.span,
                Severity::Fatal,
                ErrorCode::InvalidIdentifier,
                "class declaration requires a name",
            ));
        };

        let decl = self.store.alloc_decl(Decl::Class(swc_es_ast::ClassDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            ident,
            class: class_id,
        }));
        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_function_parts(
        &mut self,
    ) -> PResult<(Vec<swc_es_ast::PatId>, Vec<swc_es_ast::StmtId>)> {
        let _ = self.expect(TokenKind::LParen, "(")?;
        let mut params = Vec::new();

        while self.cur.kind != TokenKind::RParen && self.cur.kind != TokenKind::Eof {
            params.push(self.parse_parameter_pat()?);
            if self.cur.kind != TokenKind::RParen {
                let _ = self.expect(TokenKind::Comma, ",")?;
            }
        }
        let _ = self.expect(TokenKind::RParen, ")")?;
        if self.syntax().typescript() && self.cur.kind == TokenKind::Colon {
            self.bump();
            let _ = self.parse_ts_type()?;
        }

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

        let declarators = self.parse_var_declarators(start, false)?;
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

        let declarators = self.parse_var_declarators(start, false)?;
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

    fn parse_for_init(&mut self) -> PResult<ForInit> {
        if matches!(
            self.cur.kind,
            TokenKind::Keyword(Keyword::Var | Keyword::Let | Keyword::Const)
        ) {
            let decl = self.parse_var_decl_for_head()?;
            return Ok(ForInit::Decl(decl));
        }

        if self.syntax().explicit_resource_management() {
            if self.cur.kind == TokenKind::Keyword(Keyword::Await) && self.peek_ident_is("using") {
                let decl = self.parse_using_decl_for_head(true)?;
                return Ok(ForInit::Decl(decl));
            }
            if self.cur.kind == TokenKind::Ident && self.cur_ident_is("using") {
                let decl = self.parse_using_decl_for_head(false)?;
                return Ok(ForInit::Decl(decl));
            }
        }

        let expr = self.parse_expr()?;
        Ok(ForInit::Expr(expr))
    }

    fn for_init_to_binding(&mut self, init: ForInit) -> ForBinding {
        match init {
            ForInit::Decl(decl) => ForBinding::Decl(decl),
            ForInit::Expr(expr) => match self.store.expr(expr).cloned() {
                Some(Expr::Ident(_)) => ForBinding::Pat(self.expr_to_assign_pat(expr)),
                _ => ForBinding::Expr(expr),
            },
        }
    }

    fn parse_var_decl_for_head(&mut self) -> PResult<swc_es_ast::DeclId> {
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

        let declarators = self.parse_var_declarators(start, true)?;
        Ok(self.store.alloc_decl(Decl::Var(VarDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            kind,
            declarators,
        })))
    }

    fn parse_using_decl_for_head(&mut self, has_await: bool) -> PResult<swc_es_ast::DeclId> {
        let start = self.cur.span.lo;
        if has_await {
            self.bump();
        }
        if self.cur.kind != TokenKind::Ident || !self.cur_ident_is("using") {
            return Err(self.expected("using"));
        }
        self.bump();

        let kind = if has_await {
            VarDeclKind::AwaitUsing
        } else {
            VarDeclKind::Using
        };
        let declarators = self.parse_var_declarators(start, true)?;
        Ok(self.store.alloc_decl(Decl::Var(VarDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            kind,
            declarators,
        })))
    }

    fn parse_var_declarators(
        &mut self,
        start: swc_common::BytePos,
        for_head: bool,
    ) -> PResult<Vec<VarDeclarator>> {
        let mut declarators = Vec::new();
        while self.cur.kind != TokenKind::Eof {
            if self.cur.kind == TokenKind::Semi || self.cur.kind == TokenKind::RParen {
                break;
            }
            if for_head
                && (self.cur.kind == TokenKind::Keyword(Keyword::In)
                    || (self.cur.kind == TokenKind::Ident && self.cur_ident_is("of")))
            {
                break;
            }

            let mut pat = self.parse_binding_pat()?;
            if self.syntax().typescript() {
                pat = self.parse_ts_pat_suffix(pat)?;
            }
            let init = if self.cur.kind == TokenKind::Eq {
                self.bump();
                Some(self.parse_assignment_expr()?)
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

        if declarators.is_empty() {
            return Err(Error::new(
                self.cur.span,
                Severity::Fatal,
                ErrorCode::InvalidStatement,
                "expected at least one declarator",
            ));
        }

        Ok(declarators)
    }

    fn parse_ts_type_alias_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump(); // type
        let ident = self.expect_ident()?;
        let type_params = if self.cur.kind == TokenKind::Lt {
            self.parse_ts_type_params()?
        } else {
            Vec::new()
        };
        let _ = self.expect(TokenKind::Eq, "=")?;
        let ty = self.parse_ts_type()?;
        self.eat_semi();

        let decl = self.store.alloc_decl(Decl::TsTypeAlias(TsTypeAliasDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            ident,
            type_params,
            ty,
        }));

        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_ts_interface_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump(); // interface
        let ident = self.expect_ident()?;
        let type_params = if self.cur.kind == TokenKind::Lt {
            self.parse_ts_type_params()?
        } else {
            Vec::new()
        };

        let mut extends = Vec::new();
        if self.cur.kind == TokenKind::Keyword(Keyword::Extends) {
            self.bump();
            loop {
                extends.push(self.parse_ts_type_name());
                if self.cur.kind == TokenKind::Comma {
                    self.bump();
                } else {
                    break;
                }
            }
        }

        let _ = self.expect(TokenKind::LBrace, "{")?;
        let mut member_count = 0usize;
        let mut nested = 0usize;
        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            member_count += 1;
            while self.cur.kind != TokenKind::Eof {
                match self.cur.kind {
                    TokenKind::LParen | TokenKind::LBracket | TokenKind::LBrace => {
                        nested += 1;
                        self.bump();
                    }
                    TokenKind::RParen | TokenKind::RBracket if nested > 0 => {
                        nested -= 1;
                        self.bump();
                    }
                    TokenKind::RBrace if nested > 0 => {
                        nested -= 1;
                        self.bump();
                    }
                    TokenKind::RBrace => break,
                    TokenKind::Semi | TokenKind::Comma if nested == 0 => {
                        self.bump();
                        break;
                    }
                    _ => self.bump(),
                }
            }
        }
        let _ = self.expect(TokenKind::RBrace, "}")?;

        let decl = self
            .store
            .alloc_decl(Decl::TsInterface(swc_es_ast::TsInterfaceDecl {
                span: Span::new_with_checked(start, self.last_pos()),
                ident,
                type_params,
                extends,
                body_member_count: member_count,
            }));
        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_ts_enum_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let decl = self.parse_ts_enum_decl()?;
        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_ts_enum_decl(&mut self) -> PResult<swc_es_ast::DeclId> {
        let start = self.cur.span.lo;
        if self.cur.kind == TokenKind::Keyword(Keyword::Const) {
            self.bump();
        }
        if self.cur.kind == TokenKind::Keyword(Keyword::Enum) {
            self.bump();
        } else {
            return Err(self.expected("enum"));
        }
        let ident = self.expect_ident()?;
        let _ = self.expect(TokenKind::LBrace, "{")?;

        let mut members = Vec::new();
        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            let member_start = self.cur.span.lo;
            let name = match self.cur.kind {
                TokenKind::Ident => {
                    let value = self.cur_ident_value();
                    self.bump();
                    swc_es_ast::TsEnumMemberName::Ident(value)
                }
                TokenKind::Str => {
                    let value = self.cur_string_value();
                    self.bump();
                    swc_es_ast::TsEnumMemberName::Str(value)
                }
                TokenKind::Num => {
                    let value = self.cur_number_value();
                    self.bump();
                    swc_es_ast::TsEnumMemberName::Num(value)
                }
                _ => {
                    self.bump();
                    continue;
                }
            };

            let init = if self.cur.kind == TokenKind::Eq {
                self.bump();
                Some(self.parse_assignment_expr()?)
            } else {
                None
            };

            members.push(swc_es_ast::TsEnumMember {
                span: Span::new_with_checked(member_start, self.last_pos()),
                name,
                init,
            });

            if self.cur.kind == TokenKind::Comma {
                self.bump();
            } else {
                break;
            }
        }

        let _ = self.expect(TokenKind::RBrace, "}")?;
        Ok(self.store.alloc_decl(Decl::TsEnum(swc_es_ast::TsEnumDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            ident,
            members,
        })))
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
            TokenKind::Ident | TokenKind::Keyword(_) => {
                let ident = self.expect_ident()?;
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
            TokenKind::LBrace => {
                let start = self.cur.span.lo;
                self.bump();
                let mut props = Vec::new();

                while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
                    if self.cur.kind == TokenKind::Comma {
                        self.bump();
                        continue;
                    }

                    if self.cur.kind == TokenKind::DotDotDot {
                        let rest_start = self.cur.span.lo;
                        self.bump();
                        let arg = self.parse_binding_pat()?;
                        props.push(swc_es_ast::ObjectPatProp::Rest(RestPat {
                            span: Span::new_with_checked(rest_start, self.last_pos()),
                            arg,
                        }));
                        if self.cur.kind == TokenKind::Comma {
                            self.bump();
                        }
                        continue;
                    }

                    let key_start = self.cur.span.lo;
                    let key = match self.cur.kind {
                        TokenKind::Ident => {
                            let ident = self.cur_ident_value();
                            self.bump();
                            PropName::Ident(ident)
                        }
                        TokenKind::Keyword(keyword) => {
                            let span = self.cur.span;
                            self.bump();
                            PropName::Ident(Ident {
                                span,
                                sym: Atom::new(Self::keyword_text(keyword)),
                            })
                        }
                        TokenKind::Str => {
                            let value = self.cur_string_value();
                            self.bump();
                            PropName::Str(value)
                        }
                        TokenKind::Num => {
                            let value = self.cur_number_value();
                            self.bump();
                            PropName::Num(value)
                        }
                        TokenKind::LBracket => {
                            self.bump();
                            let expr = self.parse_expr()?;
                            let _ = self.expect(TokenKind::RBracket, "]")?;
                            PropName::Computed(expr)
                        }
                        _ => {
                            self.bump();
                            continue;
                        }
                    };

                    if self.cur.kind == TokenKind::Colon {
                        self.bump();
                        let value = self.parse_binding_pat()?;
                        props.push(swc_es_ast::ObjectPatProp::KeyValue(
                            swc_es_ast::ObjectPatKeyValue {
                                span: Span::new_with_checked(key_start, self.last_pos()),
                                key,
                                value,
                            },
                        ));
                    } else if let PropName::Ident(ident) = key {
                        let value = if self.cur.kind == TokenKind::Eq {
                            self.bump();
                            Some(self.parse_expr()?)
                        } else {
                            None
                        };
                        props.push(swc_es_ast::ObjectPatProp::Assign(
                            swc_es_ast::ObjectPatAssign {
                                span: Span::new_with_checked(key_start, self.last_pos()),
                                key: ident,
                                value,
                            },
                        ));
                    } else {
                        let null = self
                            .store
                            .alloc_expr(Expr::Lit(Lit::Null(NullLit { span: DUMMY_SP })));
                        let value = self.store.alloc_pat(Pat::Expr(null));
                        props.push(swc_es_ast::ObjectPatProp::KeyValue(
                            swc_es_ast::ObjectPatKeyValue {
                                span: Span::new_with_checked(key_start, self.last_pos()),
                                key,
                                value,
                            },
                        ));
                    }

                    if self.cur.kind == TokenKind::Comma {
                        self.bump();
                    }
                }

                let _ = self.expect(TokenKind::RBrace, "}")?;
                Ok(self.store.alloc_pat(Pat::Object(swc_es_ast::ObjectPat {
                    span: Span::new_with_checked(start, self.last_pos()),
                    props,
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
        self.parse_sequence_expr()
    }

    fn parse_sequence_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;
        let mut exprs = vec![self.parse_assignment_expr()?];

        while self.cur.kind == TokenKind::Comma {
            self.bump();
            exprs.push(self.parse_assignment_expr()?);
        }

        if exprs.len() == 1 {
            Ok(exprs[0])
        } else {
            Ok(self.store.alloc_expr(Expr::Seq(swc_es_ast::SeqExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                exprs,
            })))
        }
    }

    fn parse_assignment_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        if self.syntax().typescript() && self.cur.kind == TokenKind::Lt {
            let checkpoint = self.lexer.checkpoint_save();
            let cur = self.cur.clone();
            let next = self.next.clone();
            let errors_len = self.errors.len();

            let type_params_ok = self.parse_ts_type_params().is_ok();
            let parenthesized = self.cur.kind == TokenKind::LParen;
            let can_arrow = if parenthesized {
                self.paren_followed_by_arrow()
            } else {
                self.cur.kind == TokenKind::Ident && self.peek_kind() == TokenKind::Arrow
            };
            if type_params_ok && can_arrow {
                return self.parse_arrow_expr(false, parenthesized);
            }

            self.lexer.checkpoint_load(checkpoint);
            self.cur = cur;
            self.next = next;
            self.errors.truncate(errors_len);
        }

        if self.cur.kind == TokenKind::Ident && self.peek_kind() == TokenKind::Arrow {
            return self.parse_arrow_expr(false, false);
        }
        if self.cur.kind == TokenKind::LParen && self.paren_followed_by_arrow() {
            return self.parse_arrow_expr(false, true);
        }
        if self.cur.kind == TokenKind::Ident
            && self.cur_ident_is("async")
            && self.ident_followed_by_arrow()
        {
            self.bump();
            if self.cur.kind == TokenKind::LParen {
                return self.parse_arrow_expr(true, true);
            }
            return self.parse_arrow_expr(true, false);
        }

        let left = self.parse_conditional_expr()?;
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

        let mut expr = left;
        while self.syntax().typescript() && self.cur.kind == TokenKind::Keyword(Keyword::As) {
            let start = self.cur.span.lo;
            self.bump();
            let ty = self.parse_ts_type()?;
            expr = self.store.alloc_expr(Expr::TsAs(swc_es_ast::TsAsExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                expr,
                ty,
            }));
        }

        Ok(expr)
    }

    fn parse_conditional_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_logical_or_expr()?;

        if self.cur.kind == TokenKind::Question {
            let start = self.cur.span.lo;
            self.bump();
            let cons = self.parse_assignment_expr()?;
            let _ = self.expect(TokenKind::Colon, ":")?;
            let alt = self.parse_assignment_expr()?;
            expr = self.store.alloc_expr(Expr::Cond(swc_es_ast::CondExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                test: expr,
                cons,
                alt,
            }));
        }

        Ok(expr)
    }

    fn parse_arrow_expr(
        &mut self,
        is_async: bool,
        parenthesized_params: bool,
    ) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;
        let params = if parenthesized_params {
            let _ = self.expect(TokenKind::LParen, "(")?;
            let mut params = Vec::new();
            while self.cur.kind != TokenKind::RParen && self.cur.kind != TokenKind::Eof {
                params.push(self.parse_parameter_pat()?);
                if self.cur.kind == TokenKind::Comma {
                    self.bump();
                } else {
                    break;
                }
            }
            let _ = self.expect(TokenKind::RParen, ")")?;
            params
        } else {
            vec![self.parse_parameter_pat()?]
        };
        if self.syntax().typescript() && self.cur.kind == TokenKind::Colon {
            self.bump();
            let _ = self.parse_ts_type()?;
        }
        let _ = self.expect(TokenKind::Arrow, "=>")?;

        let body = if self.cur.kind == TokenKind::LBrace {
            let old_ctx = self.ctx;
            self.ctx.insert(Context::IN_FUNCTION);
            let body_stmt = self.parse_block_stmt()?;
            self.ctx = old_ctx;
            let stmts = match self.store.stmt(body_stmt).cloned() {
                Some(Stmt::Block(block)) => block.stmts,
                _ => Vec::new(),
            };
            swc_es_ast::ArrowBody::Block(stmts)
        } else {
            swc_es_ast::ArrowBody::Expr(self.parse_assignment_expr()?)
        };

        Ok(self.store.alloc_expr(Expr::Arrow(swc_es_ast::ArrowExpr {
            span: Span::new_with_checked(start, self.last_pos()),
            params,
            body,
            is_async,
        })))
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

        if matches!(self.cur.kind, TokenKind::PlusPlus | TokenKind::MinusMinus) {
            let op = if self.cur.kind == TokenKind::PlusPlus {
                swc_es_ast::UpdateOp::PlusPlus
            } else {
                swc_es_ast::UpdateOp::MinusMinus
            };
            self.bump();
            let arg = self.parse_unary_expr()?;
            return Ok(self.store.alloc_expr(Expr::Update(swc_es_ast::UpdateExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op,
                arg,
                prefix: true,
            })));
        }

        if self.cur.kind == TokenKind::Keyword(Keyword::Await) {
            self.bump();
            let arg = self.parse_unary_expr()?;
            return Ok(self.store.alloc_expr(Expr::Await(swc_es_ast::AwaitExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                arg,
            })));
        }

        if self.cur.kind == TokenKind::Keyword(Keyword::Yield) {
            self.bump();
            let is_delegate = self.cur.kind == TokenKind::Star;
            if is_delegate {
                self.bump();
            }
            let arg = if self.cur.kind == TokenKind::Semi
                || self.cur.kind == TokenKind::RBrace
                || self.cur.kind == TokenKind::Eof
                || self.cur.had_line_break_before
            {
                None
            } else {
                Some(self.parse_assignment_expr()?)
            };
            let callee = self.store.alloc_expr(Expr::Ident(Ident {
                span: Span::new_with_checked(start, start),
                sym: Atom::new(if is_delegate { "yield*" } else { "yield" }),
            }));
            return Ok(self.store.alloc_expr(Expr::Call(CallExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                callee,
                args: arg
                    .into_iter()
                    .map(|expr| ExprOrSpread {
                        spread: false,
                        expr,
                    })
                    .collect(),
            })));
        }

        if self.cur.kind == TokenKind::Keyword(Keyword::New) {
            return self.parse_new_expr();
        }

        let op = match self.cur.kind {
            TokenKind::Plus => Some(UnaryOp::Plus),
            TokenKind::Minus => Some(UnaryOp::Minus),
            TokenKind::Bang => Some(UnaryOp::Bang),
            TokenKind::Tilde => Some(UnaryOp::Tilde),
            TokenKind::Keyword(Keyword::TypeOf) => Some(UnaryOp::TypeOf),
            TokenKind::Keyword(Keyword::Void) => Some(UnaryOp::Void),
            TokenKind::Keyword(Keyword::Delete) => Some(UnaryOp::Delete),
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
                    let ident = if self.cur.kind == TokenKind::Hash {
                        self.parse_private_ident()?
                    } else {
                        self.expect_ident()?
                    };
                    expr = self.store.alloc_expr(Expr::Member(MemberExpr {
                        span: Span::new_with_checked(start, self.last_pos()),
                        obj: expr,
                        prop: MemberProp::Ident(ident),
                    }));
                }
                TokenKind::QuestionDot => {
                    let start = self.cur.span.lo;
                    self.bump();
                    match self.cur.kind {
                        TokenKind::LParen => {
                            self.bump();
                            let mut args = Vec::new();
                            while self.cur.kind != TokenKind::RParen
                                && self.cur.kind != TokenKind::Eof
                            {
                                let spread = self.cur.kind == TokenKind::DotDotDot;
                                if spread {
                                    self.bump();
                                }
                                let arg = self.parse_assignment_expr()?;
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
                        TokenKind::LBracket => {
                            self.bump();
                            let prop = self.parse_expr()?;
                            let _ = self.expect(TokenKind::RBracket, "]")?;
                            expr = self.store.alloc_expr(Expr::Member(MemberExpr {
                                span: Span::new_with_checked(start, self.last_pos()),
                                obj: expr,
                                prop: MemberProp::Computed(prop),
                            }));
                        }
                        _ => {
                            let ident = if self.cur.kind == TokenKind::Hash {
                                self.parse_private_ident()?
                            } else {
                                self.expect_ident()?
                            };
                            expr = self.store.alloc_expr(Expr::Member(MemberExpr {
                                span: Span::new_with_checked(start, self.last_pos()),
                                obj: expr,
                                prop: MemberProp::Ident(ident),
                            }));
                        }
                    }
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
                        let arg = self.parse_assignment_expr()?;
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
                TokenKind::Lt if self.syntax().typescript() => {
                    let checkpoint = self.lexer.checkpoint_save();
                    let cur = self.cur.clone();
                    let next = self.next.clone();
                    let errors_len = self.errors.len();

                    let parsed =
                        self.parse_ts_type_args().is_ok() && self.cur.kind == TokenKind::LParen;
                    if parsed {
                        let start = self.cur.span.lo;
                        self.bump();
                        let mut args = Vec::new();
                        while self.cur.kind != TokenKind::RParen && self.cur.kind != TokenKind::Eof
                        {
                            let spread = self.cur.kind == TokenKind::DotDotDot;
                            if spread {
                                self.bump();
                            }
                            let arg = self.parse_assignment_expr()?;
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
                        continue;
                    }

                    self.lexer.checkpoint_load(checkpoint);
                    self.cur = cur;
                    self.next = next;
                    self.errors.truncate(errors_len);
                    break;
                }
                TokenKind::PlusPlus | TokenKind::MinusMinus if !self.cur.had_line_break_before => {
                    let start = self.cur.span.lo;
                    let op = if self.cur.kind == TokenKind::PlusPlus {
                        swc_es_ast::UpdateOp::PlusPlus
                    } else {
                        swc_es_ast::UpdateOp::MinusMinus
                    };
                    self.bump();
                    expr = self.store.alloc_expr(Expr::Update(swc_es_ast::UpdateExpr {
                        span: Span::new_with_checked(start, self.last_pos()),
                        op,
                        arg: expr,
                        prefix: false,
                    }));
                }
                _ => break,
            }
        }

        Ok(expr)
    }

    fn parse_new_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;
        self.bump();

        if self.cur.kind == TokenKind::Dot {
            self.bump();
            let prop = self.expect_ident()?;
            let obj = self.store.alloc_expr(Expr::Ident(Ident {
                span: Span::new_with_checked(start, start),
                sym: Atom::new("new"),
            }));
            return Ok(self.store.alloc_expr(Expr::Member(MemberExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                obj,
                prop: MemberProp::Ident(prop),
            })));
        }

        let callee = self.parse_postfix_expr()?;
        let args = if self.cur.kind == TokenKind::LParen {
            self.bump();
            let mut args = Vec::new();
            while self.cur.kind != TokenKind::RParen && self.cur.kind != TokenKind::Eof {
                let spread = self.cur.kind == TokenKind::DotDotDot;
                if spread {
                    self.bump();
                }
                let arg = self.parse_assignment_expr()?;
                args.push(ExprOrSpread { spread, expr: arg });
                if self.cur.kind == TokenKind::Comma {
                    self.bump();
                } else {
                    break;
                }
            }
            let _ = self.expect(TokenKind::RParen, ")")?;
            args
        } else {
            Vec::new()
        };

        Ok(self.store.alloc_expr(Expr::New(swc_es_ast::NewExpr {
            span: Span::new_with_checked(start, self.last_pos()),
            callee,
            args,
        })))
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
            TokenKind::Template => {
                let lit = self.cur_string_value();
                let span = self.cur.span;
                self.bump();
                Ok(self
                    .store
                    .alloc_expr(Expr::Template(swc_es_ast::TemplateExpr {
                        span,
                        quasis: vec![lit],
                        exprs: Vec::new(),
                    })))
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
            TokenKind::Keyword(Keyword::Import) => {
                let span = self.cur.span;
                self.bump();
                Ok(self.store.alloc_expr(Expr::Ident(Ident {
                    span,
                    sym: Atom::new("import"),
                })))
            }
            TokenKind::Keyword(Keyword::New) => self.parse_new_expr(),
            TokenKind::Keyword(Keyword::Function) => self.parse_function_expr(),
            TokenKind::Keyword(Keyword::Class) => self.parse_class_expr(),
            TokenKind::LBracket => self.parse_array_expr(),
            TokenKind::LBrace => self.parse_object_expr(),
            TokenKind::Lt if self.syntax().jsx() => self.parse_jsx_element_expr(),
            TokenKind::Slash => {
                let start = self.cur.span.lo;
                self.bump();
                let mut in_class = false;
                while self.cur.kind != TokenKind::Eof {
                    match self.cur.kind {
                        TokenKind::LBracket => {
                            in_class = true;
                            self.bump();
                        }
                        TokenKind::RBracket => {
                            in_class = false;
                            self.bump();
                        }
                        TokenKind::Slash if !in_class => {
                            self.bump();
                            if matches!(self.cur.kind, TokenKind::Ident | TokenKind::Keyword(_)) {
                                self.bump();
                            }
                            break;
                        }
                        _ => self.bump(),
                    }
                }
                Ok(self.store.alloc_expr(Expr::Lit(Lit::Str(StrLit {
                    span: Span::new_with_checked(start, self.last_pos()),
                    value: Atom::new("/regex/"),
                }))))
            }
            TokenKind::LParen => {
                self.bump();
                let expr = self.parse_expr()?;
                let _ = self.expect(TokenKind::RParen, ")")?;
                Ok(expr)
            }
            TokenKind::Keyword(keyword) if Self::keyword_can_be_ident(keyword) => {
                let span = self.cur.span;
                let sym = Atom::new(Self::keyword_text(keyword));
                self.bump();
                Ok(self.store.alloc_expr(Expr::Ident(Ident { span, sym })))
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
        let is_generator = if self.cur.kind == TokenKind::Star {
            self.bump();
            true
        } else {
            false
        };

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
            is_generator,
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
            if self.cur.kind == TokenKind::At && self.syntax().decorators() {
                self.skip_decorators()?;
                if self.cur.kind == TokenKind::RBrace || self.cur.kind == TokenKind::Eof {
                    break;
                }
            }
            if self.cur.kind == TokenKind::Semi || self.cur.kind == TokenKind::Comma {
                self.bump();
                continue;
            }

            let member_start = self.cur.span.lo;
            let mut is_static = false;
            let mut is_async = false;

            while self.syntax().typescript()
                && matches!(
                    self.cur.kind,
                    TokenKind::Keyword(Keyword::Public | Keyword::Private | Keyword::Protected)
                )
            {
                self.bump();
            }

            if matches!(
                self.cur.kind,
                TokenKind::Ident | TokenKind::Keyword(Keyword::Static)
            ) && self
                .cur_name_atom()
                .is_some_and(|sym| sym.as_ref() == "static")
                && !matches!(self.peek_kind(), TokenKind::LParen)
            {
                is_static = true;
                self.bump();
            }

            if self.cur.kind == TokenKind::LBrace && is_static {
                let block_stmt = self.parse_block_stmt()?;
                let body = match self.store.stmt(block_stmt).cloned() {
                    Some(Stmt::Block(block)) => block.stmts,
                    _ => Vec::new(),
                };
                let function = self.store.alloc_function(Function {
                    span: Span::new_with_checked(member_start, self.last_pos()),
                    params: Vec::new(),
                    body,
                    is_async: false,
                    is_generator: false,
                });
                members.push(
                    self.store
                        .alloc_class_member(swc_es_ast::ClassMember::Method(
                            swc_es_ast::ClassMethod {
                                span: Span::new_with_checked(member_start, self.last_pos()),
                                key: PropName::Ident(Ident {
                                    span: Span::new_with_checked(member_start, member_start),
                                    sym: Atom::new("static"),
                                }),
                                function,
                                is_static: true,
                                kind: swc_es_ast::MethodKind::Method,
                            },
                        )),
                );
                continue;
            }

            let mut kind = swc_es_ast::MethodKind::Method;
            if self.cur.kind == TokenKind::Ident
                && self.cur_ident_is("get")
                && self.peek_starts_property_name()
            {
                kind = swc_es_ast::MethodKind::Getter;
                self.bump();
            } else if self.cur.kind == TokenKind::Ident
                && self.cur_ident_is("set")
                && self.peek_starts_property_name()
            {
                kind = swc_es_ast::MethodKind::Setter;
                self.bump();
            } else if self.cur.kind == TokenKind::Ident
                && self.cur_ident_is("async")
                && self.peek_starts_property_name()
            {
                is_async = true;
                self.bump();
            }

            let key = self.parse_prop_name()?;
            if self.cur.kind == TokenKind::LParen {
                let function = self.parse_class_method_function(member_start, is_async)?;
                if kind == swc_es_ast::MethodKind::Method
                    && !is_static
                    && matches!(&key, PropName::Ident(ident) if ident.sym.as_ref() == "constructor")
                {
                    kind = swc_es_ast::MethodKind::Constructor;
                }
                members.push(
                    self.store
                        .alloc_class_member(swc_es_ast::ClassMember::Method(
                            swc_es_ast::ClassMethod {
                                span: Span::new_with_checked(member_start, self.last_pos()),
                                key,
                                function,
                                is_static,
                                kind,
                            },
                        )),
                );
            } else {
                let value = if self.cur.kind == TokenKind::Eq {
                    self.bump();
                    Some(self.parse_expr()?)
                } else {
                    None
                };
                self.eat_semi();
                members.push(self.store.alloc_class_member(swc_es_ast::ClassMember::Prop(
                    swc_es_ast::ClassProp {
                        span: Span::new_with_checked(member_start, self.last_pos()),
                        key,
                        value,
                        is_static,
                    },
                )));
            }
        }
        if self.cur.kind == TokenKind::RBrace {
            self.bump();
        }

        let class = self.store.alloc_class(swc_es_ast::Class {
            span: Span::new_with_checked(start, self.last_pos()),
            ident,
            super_class,
            body: members,
        });

        Ok(self.store.alloc_expr(Expr::Class(class)))
    }

    fn parse_class_method_function(
        &mut self,
        start: swc_common::BytePos,
        is_async: bool,
    ) -> PResult<swc_es_ast::FunctionId> {
        let _ = self.expect(TokenKind::LParen, "(")?;
        let mut params = Vec::new();
        while self.cur.kind != TokenKind::RParen && self.cur.kind != TokenKind::Eof {
            params.push(self.parse_parameter_pat()?);
            if self.cur.kind == TokenKind::Comma {
                self.bump();
            } else {
                break;
            }
        }
        let _ = self.expect(TokenKind::RParen, ")")?;
        if self.syntax().typescript() && self.cur.kind == TokenKind::Colon {
            self.bump();
            let _ = self.parse_ts_type()?;
        }

        let old_ctx = self.ctx;
        self.ctx.insert(Context::IN_FUNCTION);
        let body_stmt = self.parse_block_stmt()?;
        self.ctx = old_ctx;

        let body = match self.store.stmt(body_stmt).cloned() {
            Some(Stmt::Block(block)) => block.stmts,
            _ => Vec::new(),
        };

        Ok(self.store.alloc_function(Function {
            span: Span::new_with_checked(start, self.last_pos()),
            params: params
                .into_iter()
                .map(|pat| swc_es_ast::Param {
                    span: Span::new_with_checked(start, start),
                    pat,
                })
                .collect(),
            body,
            is_async,
            is_generator: false,
        }))
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
            let expr = self.parse_assignment_expr()?;
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
            if self.cur.kind == TokenKind::Comma {
                self.bump();
                continue;
            }

            if self.cur.kind == TokenKind::DotDotDot {
                let spread_start = self.cur.span.lo;
                self.bump();
                let spread_expr = self.parse_assignment_expr()?;
                props.push(KeyValueProp {
                    span: Span::new_with_checked(spread_start, self.last_pos()),
                    key: PropName::Ident(Ident {
                        span: Span::new_with_checked(spread_start, spread_start),
                        sym: Atom::new("__spread__"),
                    }),
                    value: spread_expr,
                });
                if self.cur.kind == TokenKind::Comma {
                    self.bump();
                }
                continue;
            }

            let prop_start = self.cur.span.lo;
            let mut is_async = false;
            let mut force_method = false;
            let mut key = self.parse_prop_name()?;
            let starts_property_name = matches!(
                self.cur.kind,
                TokenKind::Ident
                    | TokenKind::Str
                    | TokenKind::Num
                    | TokenKind::LBracket
                    | TokenKind::Keyword(_)
                    | TokenKind::Hash
            );

            if let PropName::Ident(ident) = &key {
                if (ident.sym.as_ref() == "get" || ident.sym.as_ref() == "set")
                    && starts_property_name
                {
                    key = self.parse_prop_name()?;
                    force_method = true;
                } else if ident.sym.as_ref() == "async"
                    && !self.cur.had_line_break_before
                    && starts_property_name
                {
                    key = self.parse_prop_name()?;
                    force_method = true;
                    is_async = true;
                }
            }

            let value = if self.cur.kind == TokenKind::Colon {
                self.bump();
                self.parse_assignment_expr()?
            } else if self.cur.kind == TokenKind::LParen || force_method {
                let function = self.parse_class_method_function(prop_start, is_async)?;
                self.store.alloc_expr(Expr::Function(function))
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
                span: Span::new_with_checked(prop_start, self.last_pos()),
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
                            self.parse_assignment_expr()?
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
                    self.parse_assignment_expr()?
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
            if !self.jsx_names_match(&opening_name, &name) {
                self.errors.push(Error::new(
                    self.cur.span,
                    Severity::Error,
                    ErrorCode::UnexpectedToken,
                    "jsx closing tag does not match opening tag",
                ));
            }
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
        let start = self.cur.span.lo;
        let Some(first) = self.cur_name_atom() else {
            return Err(self.expected("jsx name"));
        };
        self.bump();

        let mut text = first.to_string();
        let mut has_separator = false;

        while matches!(self.cur.kind, TokenKind::Dot | TokenKind::Colon) {
            has_separator = true;
            let sep = if self.cur.kind == TokenKind::Dot {
                '.'
            } else {
                ':'
            };
            self.bump();
            let Some(segment) = self.cur_name_atom() else {
                return Err(self.expected("jsx name segment"));
            };
            text.push(sep);
            text.push_str(segment.as_ref());
            self.bump();
        }

        if has_separator {
            Ok(swc_es_ast::JSXElementName::Qualified(Atom::new(text)))
        } else {
            Ok(swc_es_ast::JSXElementName::Ident(Ident {
                span: Span::new_with_checked(start, self.last_pos()),
                sym: Atom::new(text),
            }))
        }
    }

    fn parse_ts_type_params(&mut self) -> PResult<Vec<Ident>> {
        let _ = self.expect(TokenKind::Lt, "<")?;
        let mut params = Vec::new();

        while self.cur.kind != TokenKind::Gt && self.cur.kind != TokenKind::Eof {
            params.push(self.expect_ident()?);

            if self.cur.kind == TokenKind::Keyword(Keyword::Extends) {
                self.bump();
                let _ = self.parse_ts_type()?;
            }
            if self.cur.kind == TokenKind::Eq {
                self.bump();
                let _ = self.parse_ts_type()?;
            }

            if self.cur.kind == TokenKind::Comma {
                self.bump();
            } else {
                break;
            }
        }

        let _ = self.expect(TokenKind::Gt, ">")?;
        Ok(params)
    }

    fn parse_ts_type(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        self.parse_ts_conditional_type()
    }

    fn parse_ts_conditional_type(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        let check = self.parse_ts_union_type()?;
        if self.cur.kind == TokenKind::Keyword(Keyword::Extends) {
            self.bump();
            let _ = self.parse_ts_union_type()?;
            if self.cur.kind == TokenKind::Question {
                self.bump();
                let _ = self.parse_ts_type()?;
                let _ = self.expect(TokenKind::Colon, ":")?;
                let _ = self.parse_ts_type()?;
            }
        }
        Ok(check)
    }

    fn parse_ts_union_type(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        let start = self.cur.span.lo;
        let mut types = vec![self.parse_ts_intersection_type()?];

        while self.cur.kind == TokenKind::Pipe {
            self.bump();
            types.push(self.parse_ts_intersection_type()?);
        }

        if types.len() == 1 {
            return Ok(types[0]);
        }

        Ok(self.store.alloc_ts_type(TsType::Union(TsUnionType {
            span: Span::new_with_checked(start, self.last_pos()),
            types,
        })))
    }

    fn parse_ts_intersection_type(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        let start = self.cur.span.lo;
        let mut types = vec![self.parse_ts_postfix_type()?];

        while self.cur.kind == TokenKind::Amp {
            self.bump();
            types.push(self.parse_ts_postfix_type()?);
        }

        if types.len() == 1 {
            return Ok(types[0]);
        }

        Ok(self
            .store
            .alloc_ts_type(TsType::Intersection(TsIntersectionType {
                span: Span::new_with_checked(start, self.last_pos()),
                types,
            })))
    }

    fn parse_ts_postfix_type(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        let start = self.cur.span.lo;
        let mut ty = self.parse_ts_primary_type()?;

        while self.cur.kind == TokenKind::LBracket && self.peek_kind() == TokenKind::RBracket {
            self.bump();
            self.bump();
            ty = self.store.alloc_ts_type(TsType::Array(TsArrayType {
                span: Span::new_with_checked(start, self.last_pos()),
                elem_type: ty,
            }));
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
            TokenKind::Keyword(Keyword::New) => {
                self.bump();
                if self.cur.kind == TokenKind::LParen {
                    let fn_ty = self.parse_ts_function_type()?;
                    return Ok(fn_ty);
                }
                TsType::Keyword(TsKeywordType::Any)
            }
            TokenKind::Ident | TokenKind::Keyword(_) => self.parse_ts_type_ref(start)?,
            TokenKind::LParen if self.paren_followed_by_arrow() => {
                return self.parse_ts_function_type();
            }
            TokenKind::LParen => {
                self.bump();
                let inner = self.parse_ts_type()?;
                let _ = self.expect(TokenKind::RParen, ")")?;
                TsType::Parenthesized(TsParenthesizedType {
                    span: Span::new_with_checked(start, self.last_pos()),
                    ty: inner,
                })
            }
            TokenKind::LBrace => return self.parse_ts_type_lit(),
            TokenKind::LBracket => {
                self.bump();
                let mut elem_types = Vec::new();
                while self.cur.kind != TokenKind::RBracket && self.cur.kind != TokenKind::Eof {
                    if self.cur.kind == TokenKind::Comma {
                        self.bump();
                        continue;
                    }
                    let is_rest = if self.cur.kind == TokenKind::DotDotDot {
                        self.bump();
                        true
                    } else {
                        false
                    };
                    if matches!(self.cur.kind, TokenKind::Ident | TokenKind::Keyword(_))
                        && matches!(self.peek_kind(), TokenKind::Colon | TokenKind::Question)
                    {
                        self.bump();
                        if self.cur.kind == TokenKind::Question {
                            self.bump();
                        }
                        if self.cur.kind == TokenKind::Colon {
                            self.bump();
                        }
                    }
                    let elem = self.parse_ts_type()?;
                    elem_types.push(elem);
                    if is_rest {
                        break;
                    }
                    if self.cur.kind == TokenKind::Comma {
                        self.bump();
                    } else {
                        break;
                    }
                }
                let _ = self.expect(TokenKind::RBracket, "]")?;
                TsType::Tuple(TsTupleType {
                    span: Span::new_with_checked(start, self.last_pos()),
                    elem_types,
                })
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
                TsType::Keyword(TsKeywordType::Any)
            }
        };

        Ok(self.store.alloc_ts_type(ty))
    }

    fn parse_ts_function_type(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        let start = self.cur.span.lo;
        let _ = self.expect(TokenKind::LParen, "(")?;
        let mut params = Vec::new();

        while self.cur.kind != TokenKind::RParen && self.cur.kind != TokenKind::Eof {
            let param_start = self.cur.span.lo;
            let is_rest = if self.cur.kind == TokenKind::DotDotDot {
                self.bump();
                true
            } else {
                false
            };

            let mut name = None;
            let mut optional = false;
            let ty = if self.cur.kind == TokenKind::Ident {
                let param_name = self.cur_ident_value();
                self.bump();
                optional = if self.cur.kind == TokenKind::Question {
                    self.bump();
                    true
                } else {
                    false
                };

                if self.cur.kind == TokenKind::Colon {
                    self.bump();
                    name = Some(param_name);
                    Some(self.parse_ts_type()?)
                } else {
                    name = Some(param_name);
                    None
                }
            } else if self.cur.kind == TokenKind::LBrace {
                self.skip_balanced(TokenKind::LBrace, TokenKind::RBrace);
                if self.cur.kind == TokenKind::Colon {
                    self.bump();
                    Some(self.parse_ts_type()?)
                } else {
                    None
                }
            } else if self.cur.kind == TokenKind::LBracket {
                self.skip_balanced(TokenKind::LBracket, TokenKind::RBracket);
                if self.cur.kind == TokenKind::Colon {
                    self.bump();
                    Some(self.parse_ts_type()?)
                } else {
                    None
                }
            } else {
                Some(self.parse_ts_type()?)
            };

            if self.cur.kind == TokenKind::Eq {
                self.bump();
                while self.cur.kind != TokenKind::Comma
                    && self.cur.kind != TokenKind::RParen
                    && self.cur.kind != TokenKind::Eof
                {
                    self.bump();
                }
            }

            params.push(TsFnParam {
                span: Span::new_with_checked(param_start, self.last_pos()),
                name,
                ty,
                is_rest,
                optional,
            });

            if self.cur.kind == TokenKind::Comma {
                self.bump();
            } else {
                break;
            }
        }

        let _ = self.expect(TokenKind::RParen, ")")?;
        let _ = self.expect(TokenKind::Arrow, "=>")?;
        let return_type = self.parse_ts_type()?;

        Ok(self.store.alloc_ts_type(TsType::Fn(TsFnType {
            span: Span::new_with_checked(start, self.last_pos()),
            params,
            return_type,
        })))
    }

    fn paren_followed_by_arrow(&self) -> bool {
        if self.cur.kind != TokenKind::LParen {
            return false;
        }

        let mut lexer = self.lexer.clone();
        let mut cur = self.cur.clone();
        let mut next = self.next.clone();
        let mut depth = 0usize;

        let bump =
            |cur: &mut Token, next: &mut Option<Token>, lexer: &mut Lexer<'a>| -> TokenKind {
                *cur = next.take().unwrap_or_else(|| lexer.next_token());
                cur.kind
            };

        while cur.kind != TokenKind::Eof {
            match cur.kind {
                TokenKind::LParen => depth += 1,
                TokenKind::RParen => {
                    depth = depth.saturating_sub(1);
                    if depth == 0 {
                        bump(&mut cur, &mut next, &mut lexer);
                        break;
                    }
                }
                _ => {}
            }
            bump(&mut cur, &mut next, &mut lexer);
        }

        if self.syntax().typescript() && cur.kind == TokenKind::Colon {
            bump(&mut cur, &mut next, &mut lexer);
            let mut nested = 0usize;
            while cur.kind != TokenKind::Eof {
                match cur.kind {
                    TokenKind::LParen | TokenKind::LBracket | TokenKind::LBrace | TokenKind::Lt => {
                        nested += 1;
                    }
                    TokenKind::RParen | TokenKind::RBracket | TokenKind::RBrace | TokenKind::Gt => {
                        nested = nested.saturating_sub(1);
                    }
                    TokenKind::Arrow if nested == 0 => break,
                    _ => {}
                }
                bump(&mut cur, &mut next, &mut lexer);
            }
        }

        cur.kind == TokenKind::Arrow
    }

    fn ident_followed_by_arrow(&self) -> bool {
        if self.cur.kind != TokenKind::Ident {
            return false;
        }

        let mut lexer = self.lexer.clone();
        let mut cur = self.cur.clone();
        let mut next = self.next.clone();

        let bump =
            |cur: &mut Token, next: &mut Option<Token>, lexer: &mut Lexer<'a>| -> TokenKind {
                *cur = next.take().unwrap_or_else(|| lexer.next_token());
                cur.kind
            };

        bump(&mut cur, &mut next, &mut lexer);
        if cur.kind == TokenKind::Ident {
            bump(&mut cur, &mut next, &mut lexer);
            return cur.kind == TokenKind::Arrow;
        }

        if cur.kind != TokenKind::LParen {
            return false;
        }
        let mut depth = 1usize;
        bump(&mut cur, &mut next, &mut lexer);
        while cur.kind != TokenKind::Eof {
            match cur.kind {
                TokenKind::LParen => depth += 1,
                TokenKind::RParen => {
                    depth = depth.saturating_sub(1);
                    if depth == 0 {
                        bump(&mut cur, &mut next, &mut lexer);
                        break;
                    }
                }
                _ => {}
            }
            bump(&mut cur, &mut next, &mut lexer);
        }
        cur.kind == TokenKind::Arrow
    }

    fn peek_starts_property_name(&mut self) -> bool {
        matches!(
            self.peek_kind(),
            TokenKind::Ident
                | TokenKind::Str
                | TokenKind::Num
                | TokenKind::LBracket
                | TokenKind::Keyword(_)
        )
    }

    fn parse_prop_name(&mut self) -> PResult<PropName> {
        match self.cur.kind {
            TokenKind::Hash => {
                let ident = self.parse_private_ident()?;
                Ok(PropName::Ident(ident))
            }
            TokenKind::Ident => {
                let ident = self.cur_ident_value();
                self.bump();
                Ok(PropName::Ident(ident))
            }
            TokenKind::Keyword(keyword) => {
                let span = self.cur.span;
                let sym = Atom::new(Self::keyword_text(keyword));
                self.bump();
                Ok(PropName::Ident(Ident { span, sym }))
            }
            TokenKind::Str => {
                let value = self.cur_string_value();
                self.bump();
                Ok(PropName::Str(value))
            }
            TokenKind::Num => {
                let value = self.cur_number_value();
                self.bump();
                Ok(PropName::Num(value))
            }
            TokenKind::LBracket => {
                self.bump();
                let expr = self.parse_expr()?;
                let _ = self.expect(TokenKind::RBracket, "]")?;
                Ok(PropName::Computed(expr))
            }
            _ => Err(self.expected("property name")),
        }
    }

    fn parse_ts_type_ref(&mut self, start: swc_common::BytePos) -> PResult<TsType> {
        let name = self.parse_ts_type_name();
        let type_args = if self.cur.kind == TokenKind::Lt {
            self.parse_ts_type_args()?
        } else {
            Vec::new()
        };

        Ok(TsType::TypeRef(TsTypeRef {
            span: Span::new_with_checked(start, self.last_pos()),
            name,
            type_args,
        }))
    }

    fn parse_ts_type_args(&mut self) -> PResult<Vec<swc_es_ast::TsTypeId>> {
        let _ = self.expect(TokenKind::Lt, "<")?;
        let mut args = Vec::new();

        while self.cur.kind != TokenKind::Gt && self.cur.kind != TokenKind::Eof {
            args.push(self.parse_ts_type()?);
            if self.cur.kind == TokenKind::Comma {
                self.bump();
            } else {
                break;
            }
        }

        let _ = self.expect(TokenKind::Gt, ">")?;
        Ok(args)
    }

    fn parse_ts_type_lit(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        let start = self.cur.span.lo;
        let _ = self.expect(TokenKind::LBrace, "{")?;
        let mut member_count = 0usize;

        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            member_count += 1;
            let mut nested = 0usize;
            while self.cur.kind != TokenKind::Eof {
                match self.cur.kind {
                    TokenKind::LParen | TokenKind::LBracket | TokenKind::LBrace => {
                        nested += 1;
                        self.bump();
                    }
                    TokenKind::RParen | TokenKind::RBracket if nested > 0 => {
                        nested -= 1;
                        self.bump();
                    }
                    TokenKind::RBrace if nested > 0 => {
                        nested -= 1;
                        self.bump();
                    }
                    TokenKind::RBrace => break,
                    TokenKind::Semi | TokenKind::Comma if nested == 0 => {
                        self.bump();
                        break;
                    }
                    _ => self.bump(),
                }
            }
        }

        let _ = self.expect(TokenKind::RBrace, "}")?;
        Ok(self.store.alloc_ts_type(TsType::TypeLit(TsTypeLit {
            span: Span::new_with_checked(start, self.last_pos()),
            member_count,
        })))
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

    fn parse_parameter_pat(&mut self) -> PResult<swc_es_ast::PatId> {
        if self.cur.kind == TokenKind::At && self.syntax().decorators() {
            self.skip_decorators()?;
        }
        while self.syntax().typescript()
            && matches!(
                self.cur.kind,
                TokenKind::Keyword(Keyword::Public | Keyword::Private | Keyword::Protected)
            )
        {
            self.bump();
        }

        let mut pat = if self.cur.kind == TokenKind::DotDotDot {
            let rest_start = self.cur.span.lo;
            self.bump();
            let arg = self.parse_binding_pat()?;
            self.store.alloc_pat(Pat::Rest(RestPat {
                span: Span::new_with_checked(rest_start, self.last_pos()),
                arg,
            }))
        } else {
            self.parse_binding_pat()?
        };

        if self.syntax().typescript() {
            pat = self.parse_ts_pat_suffix(pat)?;
        }
        Ok(pat)
    }

    fn parse_ts_pat_suffix(&mut self, pat: swc_es_ast::PatId) -> PResult<swc_es_ast::PatId> {
        if self.cur.kind == TokenKind::Question {
            self.bump();
        }
        if self.cur.kind == TokenKind::Colon {
            self.bump();
            let _ = self.parse_ts_type()?;
        }
        if self.cur.kind == TokenKind::Eq {
            let start = self.cur.span.lo;
            self.bump();
            let right = self.parse_assignment_expr()?;
            return Ok(self.store.alloc_pat(Pat::Assign(swc_es_ast::AssignPat {
                span: Span::new_with_checked(start, self.last_pos()),
                left: pat,
                right,
            })));
        }
        Ok(pat)
    }

    fn skip_decorators(&mut self) -> PResult<()> {
        while self.cur.kind == TokenKind::At {
            self.bump();
            let _ = self.parse_assignment_expr()?;
            self.eat_semi();
        }
        Ok(())
    }

    fn parse_private_ident(&mut self) -> PResult<Ident> {
        let start = self.cur.span.lo;
        if self.cur.kind == TokenKind::Hash {
            self.bump();
        }
        let ident = self.expect_ident()?;
        Ok(Ident {
            span: Span::new_with_checked(start, ident.span.hi),
            sym: Atom::new(format!("#{}", ident.sym)),
        })
    }

    fn parse_module_export_name(&mut self) -> PResult<Ident> {
        if self.cur.kind == TokenKind::Str {
            let lit = self.cur_string_value();
            self.bump();
            return Ok(Ident {
                span: lit.span,
                sym: lit.value,
            });
        }
        self.expect_ident()
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
            _ => self.store.alloc_pat(Pat::Expr(expr)),
        }
    }

    fn is_module_start(&mut self) -> bool {
        match self.cur.kind {
            TokenKind::Keyword(Keyword::Export) => true,
            TokenKind::Keyword(Keyword::Import) => {
                !matches!(self.peek_kind(), TokenKind::LParen | TokenKind::Dot)
            }
            _ => false,
        }
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

    fn jsx_names_match(
        &self,
        left: &swc_es_ast::JSXElementName,
        right: &swc_es_ast::JSXElementName,
    ) -> bool {
        self.jsx_name_text(left) == self.jsx_name_text(right)
    }

    fn jsx_name_text(&self, name: &swc_es_ast::JSXElementName) -> Atom {
        match name {
            swc_es_ast::JSXElementName::Ident(ident) => ident.sym.clone(),
            swc_es_ast::JSXElementName::Qualified(atom) => atom.clone(),
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

    fn peek_keyword_is(&mut self, keyword: Keyword) -> bool {
        matches!(self.peek_kind(), TokenKind::Keyword(value) if value == keyword)
    }

    fn expect_ident(&mut self) -> PResult<Ident> {
        if self.cur.kind == TokenKind::Ident {
            let ident = self.cur_ident_value();
            self.bump();
            return Ok(ident);
        }
        if let TokenKind::Keyword(keyword) = self.cur.kind {
            let ident = Ident {
                span: self.cur.span,
                sym: Atom::new(Self::keyword_text(keyword)),
            };
            self.bump();
            return Ok(ident);
        }

        Err(self.expected("identifier"))
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

    fn keyword_can_be_ident(keyword: Keyword) -> bool {
        matches!(
            keyword,
            Keyword::From
                | Keyword::As
                | Keyword::Interface
                | Keyword::Type
                | Keyword::Enum
                | Keyword::Implements
                | Keyword::Public
                | Keyword::Private
                | Keyword::Protected
                | Keyword::Static
                | Keyword::Declare
                | Keyword::Namespace
                | Keyword::Module
                | Keyword::Any
                | Keyword::Number
                | Keyword::String
                | Keyword::Boolean
                | Keyword::Unknown
                | Keyword::Never
        )
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

    #[test]
    fn parses_for_in_and_for_of_heads() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Custom("for-heads.js".into()).into(),
            "for (let k in obj) {} for (item of items) {}",
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

        assert_eq!(program.body.len(), 2);
        let Some(Stmt::For(first)) = parsed.store.stmt(program.body[0]) else {
            panic!("first statement should be for");
        };
        let Some(Stmt::For(second)) = parsed.store.stmt(program.body[1]) else {
            panic!("second statement should be for");
        };

        assert!(matches!(first.head, ForHead::In(..)));
        assert!(matches!(second.head, ForHead::Of(..)));
    }

    #[test]
    fn parses_jsx_qualified_names_and_reports_mismatch() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Custom("jsx-names.jsx".into()).into(),
            "<Foo.Bar />; <Baz></Qux>;",
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
        assert_eq!(program.body.len(), 2);

        let errors = parser.take_errors();
        assert!(
            errors
                .iter()
                .any(|error| error.message().contains("closing tag")),
            "expected mismatch closing tag error"
        );
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

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_typescript_function_and_generic_types() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Custom("types-complex.ts".into()).into(),
            "type Fn<T> = (arg: T) => T[] | [number, string]; type Box = Promise<string>;",
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

        let Some(Stmt::Decl(first_decl)) = parsed.store.stmt(program.body[0]) else {
            panic!("first statement should be declaration");
        };
        let Some(Decl::TsTypeAlias(alias)) = parsed.store.decl(*first_decl) else {
            panic!("first declaration should be type alias");
        };
        assert_eq!(alias.type_params.len(), 1);

        let ty = parsed.store.ts_type(alias.ty).expect("type should exist");
        assert!(matches!(ty, TsType::Fn(..)));
    }
}
