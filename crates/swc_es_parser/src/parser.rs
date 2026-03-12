use swc_atoms::Atom;
use swc_common::{Span, DUMMY_SP};
use swc_es_ast::{
    ArrayExpr, ArrayPat, AssignExpr, AssignOp, AstStore, BigIntLit, BinaryExpr, BinaryOp,
    BlockStmt, BoolLit, CallExpr, Decl, Decorator, EmptyStmt, Expr, ExprOrSpread, ExprStmt, FnDecl,
    ForBinding, ForClassicHead, ForHead, ForInHead, ForInit, ForOfHead, ForStmt, Function, Ident,
    IfStmt, ImportAttribute, ImportAttributeName, KeyValueProp, Lit, MemberExpr, MemberProp,
    ModuleDecl, NullLit, NumberLit, ObjectExpr, OptChainExpr, ParenExpr, Pat, Program, ProgramId,
    ProgramKind, PropName, RestPat, ReturnStmt, Stmt, StrLit, TaggedTemplateExpr, TsArrayType,
    TsFnParam, TsFnType, TsIntersectionType, TsKeywordType, TsModuleDecl, TsModuleName,
    TsNamespaceBody, TsNamespaceDecl, TsParenthesizedType, TsTupleType, TsType, TsTypeAliasDecl,
    TsTypeLit, TsTypeMember, TsTypeMemberKind, TsTypeRef, TsUnionType, UnaryExpr, UnaryOp, VarDecl,
    VarDeclKind, VarDeclarator, WhileStmt, WithStmt, YieldExpr,
};

use crate::{
    context::Context,
    error::{Error, ErrorCode, Severity},
    lexer::{Lexer, LexerCheckpoint},
    token::{Keyword, Token, TokenFlags, TokenKind, TokenValue},
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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum RegexAtomKind {
    None,
    Atom,
    Assertion,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum RegexGroupKind {
    Group,
    Assertion,
}

/// ECMAScript parser producing `swc_es_ast` nodes.
pub struct Parser<'a> {
    lexer: Lexer<'a>,
    cur: Token,
    next: Option<Token>,
    store: AstStore,
    errors: Vec<Error>,
    ctx: Context,
    pending_decorators: Vec<Decorator>,
    string_token_flags: Vec<(Span, TokenFlags)>,
}

struct ParserCheckpoint<'a> {
    lexer: LexerCheckpoint<'a>,
    cur: Token,
    next: Option<Token>,
    errors_len: usize,
}

impl<'a> Parser<'a> {
    /// Creates a parser from lexer.
    pub fn new_from(mut lexer: Lexer<'a>) -> Self {
        let cur = lexer.next_token();
        let mut ctx = Context::TOP_LEVEL | Context::CAN_BE_MODULE;
        if lexer.syntax().dts() {
            ctx.insert(Context::IN_DECLARE);
        }
        Self {
            lexer,
            cur,
            next: None,
            store: AstStore::default(),
            errors: Vec::new(),
            ctx,
            pending_decorators: Vec::new(),
            string_token_flags: Vec::new(),
        }
    }

    /// Returns parser syntax.
    pub fn syntax(&self) -> Syntax {
        self.lexer.syntax()
    }

    #[inline]
    fn checkpoint_save(&self) -> ParserCheckpoint<'a> {
        ParserCheckpoint {
            lexer: self.lexer.checkpoint_save(),
            cur: self.cur.clone(),
            next: self.next.clone(),
            errors_len: self.errors.len(),
        }
    }

    #[inline]
    fn checkpoint_load(&mut self, checkpoint: ParserCheckpoint<'a>) {
        self.lexer.checkpoint_load(checkpoint.lexer);
        self.cur = checkpoint.cur;
        self.next = checkpoint.next;
        self.errors.truncate(checkpoint.errors_len);
    }

    /// Takes recoverable parser errors.
    pub fn take_errors(&mut self) -> Vec<Error> {
        if self.syntax().typescript() && !self.syntax().early_errors() {
            self.errors.clear();
            self.lexer.take_errors();
            return Vec::new();
        }
        let mut all = std::mem::take(&mut self.errors);
        all.extend(self.lexer.take_errors());
        all
    }

    /// Parses source as script.
    pub fn parse_script(&mut self) -> PResult<ParsedProgram> {
        self.ctx.insert(Context::TOP_LEVEL);
        self.ctx.remove(Context::MODULE | Context::CAN_BE_MODULE);
        let start = self.cur.span.lo;
        let (body, _) = self.parse_stmt_list(false, true)?;
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
        let (body, _) = self.parse_stmt_list(true, true)?;
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
        let (body, has_module_item) = self.parse_stmt_list(true, true)?;

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

    fn parse_stmt_list(
        &mut self,
        allow_module: bool,
        enable_directive_prologue: bool,
    ) -> PResult<(Vec<swc_es_ast::StmtId>, bool)> {
        let mut body = Vec::new();
        let mut has_module_item = false;
        let mut in_directive_prologue = enable_directive_prologue;
        let mut directive_octal_spans = Vec::new();

        while self.cur.kind != TokenKind::Eof {
            let parsed = if allow_module && self.is_module_start() {
                has_module_item = true;
                self.parse_module_decl_stmt()
            } else {
                self.parse_stmt()
            };

            match parsed {
                Ok(stmt) => {
                    if in_directive_prologue {
                        self.update_directive_prologue(
                            stmt,
                            &mut in_directive_prologue,
                            &mut directive_octal_spans,
                        );
                    }
                    body.push(stmt);
                }
                Err(err) => {
                    if err.severity() == Severity::Fatal && self.syntax().early_errors() {
                        return Err(err);
                    }
                    if self.syntax().early_errors() {
                        self.errors.push(err);
                    }
                    in_directive_prologue = false;
                    self.recover_stmt();
                }
            }
        }

        Ok((body, has_module_item))
    }

    fn parse_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let explicit_resource_management = self.syntax().explicit_resource_management();
        let is_await_using = explicit_resource_management && self.is_await_using_decl_start();
        let is_using = self.cur.kind == TokenKind::Ident
            && explicit_resource_management
            && self.is_using_decl_start();
        let is_async_function = self.at_async_function_start();
        let is_labeled = self.cur.kind == TokenKind::Ident && self.peek_kind() == TokenKind::Colon;
        let is_const_enum = self.cur.kind == TokenKind::Keyword(Keyword::Const)
            && self.syntax().typescript()
            && self.peek_kind() == TokenKind::Keyword(Keyword::Enum);
        let is_dynamic_import = self.cur.kind == TokenKind::Keyword(Keyword::Import)
            && matches!(self.peek_kind(), TokenKind::LParen | TokenKind::Dot);
        let is_let_decl =
            self.cur.kind == TokenKind::Keyword(Keyword::Let) && self.is_let_decl_start();

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
            TokenKind::Keyword(Keyword::With) => self.parse_with_stmt(),
            TokenKind::Keyword(Keyword::Break) => self.parse_break_stmt(),
            TokenKind::Keyword(Keyword::Continue) => self.parse_continue_stmt(),
            TokenKind::Keyword(Keyword::Debugger) => self.parse_debugger_stmt(),
            TokenKind::Keyword(Keyword::For) => self.parse_for_stmt(),
            TokenKind::Keyword(Keyword::Return) => self.parse_return_stmt(),
            TokenKind::Keyword(Keyword::Function) => self.parse_function_decl_stmt(),
            TokenKind::Ident if is_async_function => self.parse_async_function_decl_stmt(),
            TokenKind::Keyword(Keyword::Class) => self.parse_class_decl_stmt(),
            TokenKind::Keyword(Keyword::Const) if is_const_enum => self.parse_ts_enum_decl_stmt(),
            TokenKind::Keyword(Keyword::Declare) if self.syntax().typescript() => {
                self.parse_ts_declare_stmt()
            }
            TokenKind::Keyword(Keyword::Var | Keyword::Const) => self.parse_var_decl_stmt(),
            TokenKind::Keyword(Keyword::Let) if is_let_decl => self.parse_var_decl_stmt(),
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
            TokenKind::Keyword(Keyword::Enum | Keyword::Namespace | Keyword::Module)
                if self.syntax().typescript() =>
            {
                self.parse_ts_non_decl_stmt()
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
        let decorators = self.parse_decorators()?;
        self.pending_decorators.extend(decorators);

        if self.cur.kind == TokenKind::Keyword(Keyword::Export)
            && (self.ctx.contains(Context::MODULE) || self.ctx.contains(Context::CAN_BE_MODULE))
        {
            if !self.syntax().decorators_before_export() {
                self.errors.push(Error::new(
                    self.cur.span,
                    Severity::Error,
                    ErrorCode::InvalidStatement,
                    "decorators before export are disabled by syntax option",
                ));
            }
            return self.parse_module_decl_stmt();
        }
        if self.cur.kind == TokenKind::Keyword(Keyword::Class) {
            return self.parse_class_decl_stmt();
        }
        let stmt = self.parse_stmt();
        if !self.pending_decorators.is_empty() {
            self.errors.push(Error::new(
                self.cur.span,
                Severity::Error,
                ErrorCode::InvalidStatement,
                "decorators can only be applied to class declarations",
            ));
            self.pending_decorators.clear();
        }
        stmt
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
        if !self.pending_decorators.is_empty() {
            self.errors.push(Error::new(
                Span::new_with_checked(start, self.last_pos()),
                Severity::Error,
                ErrorCode::InvalidStatement,
                "decorators can only be applied to class declarations",
            ));
            self.pending_decorators.clear();
        }
        Ok(self.store.alloc_stmt(Stmt::ModuleDecl(module_decl_id)))
    }

    fn parse_import_decl(&mut self, start: swc_common::BytePos) -> PResult<ModuleDecl> {
        self.bump();
        let mut specifiers = Vec::new();
        let mut type_only = false;
        if self.syntax().typescript() && self.cur.kind == TokenKind::Keyword(Keyword::Type) {
            type_only = true;
            self.bump();
        }
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
                    let is_type_only = self.syntax().typescript()
                        && self.cur.kind == TokenKind::Keyword(Keyword::Type)
                        && self.peek_kind() != TokenKind::Keyword(Keyword::As);
                    if is_type_only {
                        self.bump();
                    }
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
                            is_type_only,
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

        let with = self.parse_import_attributes_clause();

        while self.cur.kind != TokenKind::Semi && self.cur.kind != TokenKind::Eof {
            self.bump();
        }
        self.eat_semi();

        Ok(ModuleDecl::Import(swc_es_ast::ImportDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            specifiers,
            type_only,
            src,
            with,
        }))
    }

    fn parse_export_decl(&mut self, start: swc_common::BytePos) -> PResult<ModuleDecl> {
        self.bump();
        let mut type_only = false;
        if self.syntax().typescript() && self.cur.kind == TokenKind::Keyword(Keyword::Type) {
            let next_kind = self.peek_kind();
            if matches!(next_kind, TokenKind::LBrace | TokenKind::Star) {
                type_only = true;
                self.bump();
            }
        }

        if self.cur.kind == TokenKind::Keyword(Keyword::Default) {
            let default_span = self.cur.span;
            self.bump();
            if self.cur.kind == TokenKind::Keyword(Keyword::Function)
                || self.at_async_function_start()
            {
                let is_async = self.at_async_function_start();
                let fn_start = self.cur.span.lo;
                if is_async {
                    self.bump();
                }
                let _ = self.expect(TokenKind::Keyword(Keyword::Function), "function")?;
                let is_generator = if self.cur.kind == TokenKind::Star {
                    self.bump();
                    true
                } else {
                    false
                };
                let ident = if matches!(self.cur.kind, TokenKind::Ident | TokenKind::Keyword(_)) {
                    self.expect_ident()?
                } else {
                    Ident::new(
                        Span::new_with_checked(fn_start, fn_start),
                        Atom::new("default"),
                    )
                };
                let (params, body) = self.parse_function_parts(is_async, is_generator)?;
                let decl = self.store.alloc_decl(Decl::Fn(FnDecl {
                    span: Span::new_with_checked(fn_start, self.last_pos()),
                    ident,
                    declare: false,
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
                    declare: false,
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
            let parse_export_default_from = self.syntax().export_default_from()
                && match self.cur.kind {
                    TokenKind::Comma => true,
                    // Keep `export default from;` on the default-expression path.
                    TokenKind::Keyword(Keyword::From) => self.peek_nth_kind(1) == TokenKind::Str,
                    _ => false,
                };
            if parse_export_default_from {
                let mut specifiers = vec![swc_es_ast::ExportSpecifier {
                    local: Ident::new(default_span, Atom::new("default")),
                    exported: None,
                    is_type_only: false,
                }];

                if self.cur.kind == TokenKind::Comma {
                    self.bump();
                    if self.cur.kind == TokenKind::LBrace {
                        self.bump();
                        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof
                        {
                            let is_specifier_type_only = self.syntax().typescript()
                                && self.cur.kind == TokenKind::Keyword(Keyword::Type)
                                && self.peek_kind() != TokenKind::Keyword(Keyword::As);
                            if is_specifier_type_only {
                                self.bump();
                            }
                            let local = self.parse_module_export_name()?;
                            let exported = if self.cur.kind == TokenKind::Keyword(Keyword::As) {
                                self.bump();
                                Some(self.parse_module_export_name()?)
                            } else {
                                None
                            };
                            specifiers.push(swc_es_ast::ExportSpecifier {
                                local,
                                exported,
                                is_type_only: is_specifier_type_only,
                            });

                            if self.cur.kind != TokenKind::RBrace {
                                let _ = self.expect(TokenKind::Comma, ",")?;
                            }
                        }
                        let _ = self.expect(TokenKind::RBrace, "}")?;
                    } else if self.cur.kind == TokenKind::Star {
                        self.errors.push(Error::new(
                            self.cur.span,
                            Severity::Error,
                            ErrorCode::InvalidStatement,
                            "`export default, * as ns from` is not supported by swc_es_ast \
                             ExportSpecifier model",
                        ));
                        self.bump();
                        if self.cur.kind == TokenKind::Keyword(Keyword::As) {
                            self.bump();
                            let _ = self.parse_module_export_name()?;
                        }
                    } else {
                        return Err(self.expected("{"));
                    }
                }

                if self.cur.kind != TokenKind::Keyword(Keyword::From) {
                    return Err(self.expected("from"));
                }
                self.bump();
                let src = self.expect_string()?;
                let with = self.parse_import_attributes_clause();
                self.eat_semi();

                return Ok(ModuleDecl::ExportNamed(swc_es_ast::ExportNamedDecl {
                    span: Span::new_with_checked(start, self.last_pos()),
                    src: Some(src),
                    specifiers,
                    type_only: false,
                    decl: None,
                    with,
                }));
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
            let exported = if self.cur.kind == TokenKind::Keyword(Keyword::As) {
                self.bump();
                Some(self.parse_module_export_name()?)
            } else {
                None
            };
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
            let with = self.parse_import_attributes_clause();
            self.eat_semi();
            return Ok(ModuleDecl::ExportAll(swc_es_ast::ExportAllDecl {
                span: Span::new_with_checked(start, self.last_pos()),
                src,
                type_only,
                exported,
                with,
            }));
        }

        if self.cur.kind == TokenKind::LBrace {
            self.bump();
            let mut specifiers = Vec::new();
            while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
                let is_specifier_type_only = self.syntax().typescript()
                    && self.cur.kind == TokenKind::Keyword(Keyword::Type)
                    && self.peek_kind() != TokenKind::Keyword(Keyword::As);
                if is_specifier_type_only {
                    self.bump();
                }
                let local = self.parse_module_export_name()?;
                let exported = if self.cur.kind == TokenKind::Keyword(Keyword::As) {
                    self.bump();
                    Some(self.parse_module_export_name()?)
                } else {
                    None
                };
                specifiers.push(swc_es_ast::ExportSpecifier {
                    local,
                    exported,
                    is_type_only: type_only || is_specifier_type_only,
                });

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
            let with = self.parse_import_attributes_clause();
            self.eat_semi();

            return Ok(ModuleDecl::ExportNamed(swc_es_ast::ExportNamedDecl {
                span: Span::new_with_checked(start, self.last_pos()),
                src,
                specifiers,
                type_only,
                decl: None,
                with,
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
        let is_async_function = self.at_async_function_start();
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
            TokenKind::Ident if is_async_function => {
                let stmt = self.parse_async_function_decl_stmt()?;
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
            TokenKind::Keyword(Keyword::Namespace | Keyword::Module)
                if self.syntax().typescript() =>
            {
                let stmt = self.parse_ts_module_decl_stmt()?;
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
            TokenKind::Keyword(Keyword::Declare) if self.syntax().typescript() => {
                let stmt = self.parse_ts_declare_stmt()?;
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
        self.parse_block_stmt_with_directives(false)
    }

    fn parse_block_stmt_with_directives(
        &mut self,
        enable_directive_prologue: bool,
    ) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        let _ = self.expect(TokenKind::LBrace, "{")?;
        let mut stmts = Vec::new();
        let mut in_directive_prologue = enable_directive_prologue;
        let mut directive_octal_spans = Vec::new();
        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            let parsed = if self.ctx.contains(Context::MODULE) && self.is_module_start() {
                self.parse_module_decl_stmt()
            } else {
                self.parse_stmt()
            };

            match parsed {
                Ok(stmt) => {
                    if in_directive_prologue {
                        self.update_directive_prologue(
                            stmt,
                            &mut in_directive_prologue,
                            &mut directive_octal_spans,
                        );
                    }
                    stmts.push(stmt);
                }
                Err(err) => {
                    if err.severity() == Severity::Fatal && self.syntax().early_errors() {
                        return Err(err);
                    }
                    if self.syntax().early_errors() {
                        self.errors.push(err);
                    }
                    in_directive_prologue = false;
                    self.recover_stmt();
                }
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

    fn parse_with_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
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
        let starts_with_let_keyword = self.cur.kind == TokenKind::Keyword(Keyword::Let);

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
                if starts_with_let_keyword
                    && matches!(
                        init,
                        ForInit::Expr(expr) if self.expr_is_let_member(expr)
                    )
                {
                    return Err(Error::new(
                        self.cur.span,
                        Severity::Fatal,
                        ErrorCode::InvalidStatement,
                        "invalid left-hand side in for-of statement",
                    ));
                }
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
        self.parse_function_decl_stmt_with_declare(false)
    }

    fn parse_function_decl_stmt_with_declare(
        &mut self,
        declare: bool,
    ) -> PResult<swc_es_ast::StmtId> {
        self.parse_function_decl_stmt_with_options(declare, false)
    }

    fn parse_async_function_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        self.parse_async_function_decl_stmt_with_declare(false)
    }

    fn parse_async_function_decl_stmt_with_declare(
        &mut self,
        declare: bool,
    ) -> PResult<swc_es_ast::StmtId> {
        self.parse_function_decl_stmt_with_options(declare, true)
    }

    fn parse_function_decl_stmt_with_options(
        &mut self,
        declare: bool,
        is_async: bool,
    ) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        if is_async {
            self.bump();
        }
        let _ = self.expect(TokenKind::Keyword(Keyword::Function), "function")?;
        let is_generator = if self.cur.kind == TokenKind::Star {
            self.bump();
            true
        } else {
            false
        };

        let ident = self.expect_ident()?;
        let (params, body) = self.parse_function_parts(is_async, is_generator)?;

        let decl = self.store.alloc_decl(Decl::Fn(FnDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            ident,
            declare,
            params,
            body,
        }));

        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_class_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        self.parse_class_decl_stmt_with_declare(false)
    }

    fn parse_class_decl_stmt_with_declare(&mut self, declare: bool) -> PResult<swc_es_ast::StmtId> {
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
            declare,
            class: class_id,
        }));
        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_function_parts(
        &mut self,
        is_async: bool,
        is_generator: bool,
    ) -> PResult<(Vec<swc_es_ast::PatId>, Vec<swc_es_ast::StmtId>)> {
        if self.syntax().typescript() && self.cur.kind == TokenKind::Lt {
            let _ = self.parse_ts_type_params()?;
        }
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

        if self.syntax().typescript() && self.cur.kind == TokenKind::Semi {
            self.bump();
            return Ok((params, Vec::new()));
        }

        let old_ctx = self.ctx;
        self.ctx.insert(Context::IN_FUNCTION);
        self.ctx.remove(Context::ALLOW_DIRECT_SUPER);
        if is_async {
            self.ctx.insert(Context::IN_ASYNC);
        }
        if is_generator {
            self.ctx.insert(Context::IN_GENERATOR);
        }
        let body_stmt = self.parse_block_stmt_with_directives(true)?;
        self.ctx = old_ctx;

        let body = match self.store.stmt(body_stmt).cloned() {
            Some(Stmt::Block(block)) => block.stmts,
            _ => Vec::new(),
        };

        Ok((params, body))
    }

    fn parse_var_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        self.parse_var_decl_stmt_with_declare(false)
    }

    fn parse_var_decl_stmt_with_declare(&mut self, declare: bool) -> PResult<swc_es_ast::StmtId> {
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
            declare,
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
            declare: false,
            declarators,
        }));

        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_for_init(&mut self) -> PResult<ForInit> {
        if matches!(
            self.cur.kind,
            TokenKind::Keyword(Keyword::Var | Keyword::Const)
        ) || (self.cur.kind == TokenKind::Keyword(Keyword::Let)
            && self.is_let_decl_for_head_start())
        {
            let decl = self.parse_var_decl_for_head()?;
            return Ok(ForInit::Decl(decl));
        }

        if self.syntax().explicit_resource_management() {
            if self.is_await_using_decl_start() {
                let decl = self.parse_using_decl_for_head(true)?;
                return Ok(ForInit::Decl(decl));
            }
            if self.is_using_decl_start() {
                let decl = self.parse_using_decl_for_head(false)?;
                return Ok(ForInit::Decl(decl));
            }
        }

        let old_ctx = self.ctx;
        self.ctx.insert(Context::IN_FOR_HEAD);
        let expr = self.parse_expr()?;
        self.ctx = old_ctx;
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
            declare: false,
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
            declare: false,
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
                    || (self.cur.kind == TokenKind::Ident
                        && self.cur_ident_is("of")
                        && !declarators.is_empty()))
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

    fn parse_ts_non_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        match self.cur.kind {
            TokenKind::Keyword(Keyword::Enum) => self.parse_ts_enum_decl_stmt(),
            TokenKind::Keyword(Keyword::Namespace | Keyword::Module) => {
                self.parse_ts_module_decl_stmt()
            }
            _ => Err(self.expected("typescript declaration")),
        }
    }

    fn parse_ts_declare_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        let start = self.cur.span.lo;
        self.bump();
        let is_const_enum = self.cur.kind == TokenKind::Keyword(Keyword::Const)
            && self.peek_kind() == TokenKind::Keyword(Keyword::Enum);
        let is_async_function = self.at_async_function_start();

        let old_ctx = self.ctx;
        self.ctx.insert(Context::IN_DECLARE);
        let out = match self.cur.kind {
            TokenKind::Keyword(Keyword::Const) if is_const_enum => {
                self.parse_ts_enum_decl_stmt_with_declare(true)
            }
            TokenKind::Keyword(Keyword::Var | Keyword::Let | Keyword::Const) => {
                self.parse_var_decl_stmt_with_declare(true)
            }
            TokenKind::Keyword(Keyword::Function) => {
                self.parse_function_decl_stmt_with_declare(true)
            }
            TokenKind::Ident if is_async_function => {
                self.parse_async_function_decl_stmt_with_declare(true)
            }
            TokenKind::Keyword(Keyword::Class) => self.parse_class_decl_stmt_with_declare(true),
            TokenKind::Keyword(Keyword::Type) => {
                self.parse_ts_type_alias_decl_stmt_with_declare(true)
            }
            TokenKind::Keyword(Keyword::Interface) => {
                self.parse_ts_interface_decl_stmt_with_declare(true)
            }
            TokenKind::Keyword(Keyword::Enum) => self.parse_ts_enum_decl_stmt_with_declare(true),
            TokenKind::Keyword(Keyword::Namespace | Keyword::Module) => {
                self.parse_ts_module_decl_stmt_with_declare(true)
            }
            _ => Ok(self.store.alloc_stmt(Stmt::Empty(EmptyStmt {
                span: Span::new_with_checked(start, self.last_pos()),
            }))),
        };
        self.ctx = old_ctx;
        out
    }

    fn parse_ts_type_alias_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        self.parse_ts_type_alias_decl_stmt_with_declare(false)
    }

    fn parse_ts_type_alias_decl_stmt_with_declare(
        &mut self,
        declare: bool,
    ) -> PResult<swc_es_ast::StmtId> {
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
            declare,
            type_params,
            ty,
        }));

        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_ts_interface_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        self.parse_ts_interface_decl_stmt_with_declare(false)
    }

    fn parse_ts_interface_decl_stmt_with_declare(
        &mut self,
        declare: bool,
    ) -> PResult<swc_es_ast::StmtId> {
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
                let name = self.parse_ts_type_name();
                if self.cur.kind == TokenKind::Lt {
                    let _ = self.parse_ts_type_args()?;
                }
                extends.push(name);
                if self.cur.kind == TokenKind::Comma {
                    self.bump();
                } else {
                    break;
                }
            }
        }

        let _ = self.expect(TokenKind::LBrace, "{")?;
        let mut body = Vec::new();
        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            body.push(self.parse_ts_type_member()?);
        }
        let _ = self.expect(TokenKind::RBrace, "}")?;

        let decl = self
            .store
            .alloc_decl(Decl::TsInterface(swc_es_ast::TsInterfaceDecl {
                span: Span::new_with_checked(start, self.last_pos()),
                ident,
                declare,
                type_params,
                extends,
                body,
            }));
        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_ts_enum_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        self.parse_ts_enum_decl_stmt_with_declare(false)
    }

    fn parse_ts_enum_decl_stmt_with_declare(
        &mut self,
        declare: bool,
    ) -> PResult<swc_es_ast::StmtId> {
        let decl = self.parse_ts_enum_decl_with_declare(declare)?;
        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_ts_enum_decl(&mut self) -> PResult<swc_es_ast::DeclId> {
        self.parse_ts_enum_decl_with_declare(false)
    }

    fn parse_ts_enum_decl_with_declare(&mut self, declare: bool) -> PResult<swc_es_ast::DeclId> {
        let start = self.cur.span.lo;
        let is_const = if self.cur.kind == TokenKind::Keyword(Keyword::Const) {
            self.bump();
            true
        } else {
            false
        };
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
            declare,
            is_const,
            members,
        })))
    }

    fn parse_ts_module_decl_stmt(&mut self) -> PResult<swc_es_ast::StmtId> {
        self.parse_ts_module_decl_stmt_with_declare(false)
    }

    fn parse_ts_module_decl_stmt_with_declare(
        &mut self,
        declare: bool,
    ) -> PResult<swc_es_ast::StmtId> {
        let decl = self.parse_ts_module_decl_with_declare(declare)?;
        Ok(self.store.alloc_stmt(Stmt::Decl(decl)))
    }

    fn parse_ts_module_decl_with_declare(&mut self, declare: bool) -> PResult<swc_es_ast::DeclId> {
        let start = self.cur.span.lo;
        let namespace = self.cur.kind == TokenKind::Keyword(Keyword::Namespace);
        self.bump();

        let id = match self.cur.kind {
            TokenKind::Ident | TokenKind::Keyword(_) => TsModuleName::Ident(self.expect_ident()?),
            TokenKind::Str => TsModuleName::Str(self.expect_string()?),
            _ => return Err(self.expected("module name")),
        };

        let body = if self.cur.kind == TokenKind::Dot {
            // namespace A.B { ... }
            let TsModuleName::Ident(root_id) = &id else {
                return Err(self.expected("identifier"));
            };
            let nested = self.parse_ts_namespace_chain(declare)?;
            Some(TsNamespaceBody::Namespace(Box::new(TsNamespaceDecl {
                span: Span::new_with_checked(start, self.last_pos()),
                declare,
                global: false,
                id: root_id.clone(),
                body: Box::new(nested),
            })))
        } else if self.cur.kind == TokenKind::LBrace {
            self.bump();
            let body = self.parse_ts_module_block_stmts()?;
            let _ = self.expect(TokenKind::RBrace, "}")?;
            Some(TsNamespaceBody::ModuleBlock(body))
        } else {
            self.eat_semi();
            None
        };

        Ok(self.store.alloc_decl(Decl::TsModule(TsModuleDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            declare,
            global: false,
            namespace,
            id,
            body,
        })))
    }

    fn parse_ts_namespace_chain(&mut self, declare: bool) -> PResult<TsNamespaceBody> {
        let _ = self.expect(TokenKind::Dot, ".")?;
        let start = self.cur.span.lo;
        let id = self.expect_ident()?;
        let body = if self.cur.kind == TokenKind::Dot {
            self.parse_ts_namespace_chain(declare)?
        } else if self.cur.kind == TokenKind::LBrace {
            self.bump();
            let body = self.parse_ts_module_block_stmts()?;
            let _ = self.expect(TokenKind::RBrace, "}")?;
            TsNamespaceBody::ModuleBlock(body)
        } else {
            return Err(self.expected("{"));
        };
        Ok(TsNamespaceBody::Namespace(Box::new(TsNamespaceDecl {
            span: Span::new_with_checked(start, self.last_pos()),
            declare,
            global: false,
            id,
            body: Box::new(body),
        })))
    }

    fn parse_ts_module_block_stmts(&mut self) -> PResult<Vec<swc_es_ast::StmtId>> {
        let mut body = Vec::new();
        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            let parsed = if self.is_module_start() {
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

    fn parse_ts_type_member(&mut self) -> PResult<TsTypeMember> {
        let start = self.cur.span.lo;
        let mut readonly = false;
        if self.cur.kind == TokenKind::Ident
            && self.cur_ident_is("readonly")
            && (self.peek_kind() == TokenKind::LBracket || self.peek_starts_property_name())
        {
            readonly = true;
            self.bump();
        }

        if self.cur.kind == TokenKind::LParen {
            let params = self.parse_ts_fn_params()?;
            let ty = if self.cur.kind == TokenKind::Colon {
                self.bump();
                Some(self.parse_ts_type()?)
            } else {
                None
            };
            self.eat_comma_or_semi();
            return Ok(TsTypeMember {
                span: Span::new_with_checked(start, self.last_pos()),
                kind: TsTypeMemberKind::Call,
                name: None,
                optional: false,
                readonly,
                params,
                ty,
            });
        }

        if self.cur.kind == TokenKind::Keyword(Keyword::New)
            && self.peek_kind() == TokenKind::LParen
        {
            self.bump();
            let params = self.parse_ts_fn_params()?;
            let ty = if self.cur.kind == TokenKind::Colon {
                self.bump();
                Some(self.parse_ts_type()?)
            } else {
                None
            };
            self.eat_comma_or_semi();
            return Ok(TsTypeMember {
                span: Span::new_with_checked(start, self.last_pos()),
                kind: TsTypeMemberKind::Construct,
                name: None,
                optional: false,
                readonly,
                params,
                ty,
            });
        }

        if self.cur.kind == TokenKind::LBracket {
            self.bump();
            let param_name = if matches!(self.cur.kind, TokenKind::Ident | TokenKind::Keyword(_)) {
                Some(self.expect_ident()?)
            } else {
                None
            };
            let param_ty = if self.cur.kind == TokenKind::Colon {
                self.bump();
                Some(self.parse_ts_type()?)
            } else {
                None
            };
            let _ = self.expect(TokenKind::RBracket, "]")?;
            let ty = if self.cur.kind == TokenKind::Colon {
                self.bump();
                Some(self.parse_ts_type()?)
            } else {
                None
            };
            self.eat_comma_or_semi();
            let mut params = Vec::new();
            if let Some(name) = param_name {
                params.push(TsFnParam {
                    span: name.span,
                    name: Some(name),
                    ty: param_ty,
                    is_rest: false,
                    optional: false,
                });
            }
            return Ok(TsTypeMember {
                span: Span::new_with_checked(start, self.last_pos()),
                kind: TsTypeMemberKind::Index,
                name: None,
                optional: false,
                readonly,
                params,
                ty,
            });
        }

        let name = self.parse_prop_name()?;
        let optional = if self.cur.kind == TokenKind::Question {
            self.bump();
            true
        } else {
            false
        };
        if self.cur.kind == TokenKind::LParen {
            let params = self.parse_ts_fn_params()?;
            let ty = if self.cur.kind == TokenKind::Colon {
                self.bump();
                Some(self.parse_ts_type()?)
            } else {
                None
            };
            self.eat_comma_or_semi();
            return Ok(TsTypeMember {
                span: Span::new_with_checked(start, self.last_pos()),
                kind: TsTypeMemberKind::Method,
                name: Some(name),
                optional,
                readonly,
                params,
                ty,
            });
        }

        let ty = if self.cur.kind == TokenKind::Colon {
            self.bump();
            Some(self.parse_ts_type()?)
        } else {
            None
        };
        self.eat_comma_or_semi();
        Ok(TsTypeMember {
            span: Span::new_with_checked(start, self.last_pos()),
            kind: TsTypeMemberKind::Property,
            name: Some(name),
            optional,
            readonly,
            params: Vec::new(),
            ty,
        })
    }

    fn parse_ts_fn_params(&mut self) -> PResult<Vec<TsFnParam>> {
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
            if matches!(self.cur.kind, TokenKind::Ident | TokenKind::Keyword(_)) {
                let ident = self.expect_ident()?;
                optional = if self.cur.kind == TokenKind::Question {
                    self.bump();
                    true
                } else {
                    false
                };
                name = Some(ident);
            } else if self.cur.kind == TokenKind::LBrace {
                self.skip_balanced(TokenKind::LBrace, TokenKind::RBrace);
            } else if self.cur.kind == TokenKind::LBracket {
                self.skip_balanced(TokenKind::LBracket, TokenKind::RBracket);
            }
            let ty = if self.cur.kind == TokenKind::Colon {
                self.bump();
                Some(self.parse_ts_type()?)
            } else {
                None
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
        Ok(params)
    }

    fn eat_comma_or_semi(&mut self) {
        if self.cur.kind == TokenKind::Comma {
            self.bump();
            return;
        }
        self.eat_semi();
    }

    fn parse_binding_pat(&mut self) -> PResult<swc_es_ast::PatId> {
        match self.cur.kind {
            TokenKind::Ident | TokenKind::Keyword(_) => {
                let ident = self.expect_ident()?;
                let base = self.store.alloc_pat(Pat::Ident(Ident {
                    span: ident.span,
                    sym: ident.sym,
                }));

                if matches!(
                    self.cur.kind,
                    TokenKind::Dot | TokenKind::QuestionDot | TokenKind::LBracket
                ) {
                    return Err(Error::new(
                        self.cur.span,
                        Severity::Fatal,
                        ErrorCode::InvalidAssignTarget,
                        "member access is not allowed in binding patterns",
                    ));
                }

                if self.cur.kind == TokenKind::Eq {
                    let start = self.cur.span.lo;
                    self.bump();
                    let right = self.parse_assignment_expr()?;
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
                            Some(self.parse_assignment_expr()?)
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
            let checkpoint = self.checkpoint_save();
            let ambiguous_start = self.cur.span;

            let type_params_ok = self.parse_ts_type_params().is_ok();
            let parenthesized = self.cur.kind == TokenKind::LParen;
            let can_arrow = if parenthesized {
                self.paren_followed_by_arrow()
            } else {
                self.cur_can_be_arrow_param() && self.peek_kind() == TokenKind::Arrow
            };
            if type_params_ok && can_arrow {
                if self.syntax().disallow_ambiguous_jsx_like() {
                    self.errors.push(Error::new(
                        ambiguous_start,
                        Severity::Error,
                        ErrorCode::InvalidStatement,
                        "ambiguous TypeScript arrow type-parameter syntax is disallowed",
                    ));
                }
                return self.parse_arrow_expr(false, parenthesized);
            }

            self.checkpoint_load(checkpoint);
        }

        if self.syntax().typescript()
            && self.cur.kind == TokenKind::Ident
            && self.cur_ident_is("async")
            && self.peek_kind() == TokenKind::Lt
        {
            let checkpoint = self.checkpoint_save();

            self.bump();
            let type_params_ok = self.parse_ts_type_params().is_ok();
            if type_params_ok
                && self.cur.kind == TokenKind::LParen
                && self.paren_followed_by_arrow()
            {
                return self.parse_arrow_expr(true, true);
            }

            self.checkpoint_load(checkpoint);
        }

        if self.cur_can_be_arrow_param() && self.peek_kind() == TokenKind::Arrow {
            return self.parse_arrow_expr(false, false);
        }
        if self.cur.kind == TokenKind::LParen && self.can_parse_parenthesized_arrow_head() {
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
            TokenKind::LtLtEq => Some(AssignOp::LShiftAssign),
            TokenKind::GtGtEq => Some(AssignOp::RShiftAssign),
            TokenKind::GtGtGtEq => Some(AssignOp::ZeroFillRShiftAssign),
            TokenKind::PipeEq => Some(AssignOp::BitOrAssign),
            TokenKind::CaretEq => Some(AssignOp::BitXorAssign),
            TokenKind::AmpEq => Some(AssignOp::BitAndAssign),
            TokenKind::StarStarEq => Some(AssignOp::ExpAssign),
            TokenKind::AndAndEq => Some(AssignOp::AndAssign),
            TokenKind::OrOrEq => Some(AssignOp::OrAssign),
            TokenKind::NullishEq => Some(AssignOp::NullishAssign),
            _ => None,
        };

        if let Some(op) = op {
            if op == AssignOp::Assign {
                self.validate_assignment_target_expr(left);
            }
            if self.expr_is_optional_chain(left) {
                return Err(Error::new(
                    self.cur.span,
                    Severity::Fatal,
                    ErrorCode::InvalidOptionalChainTarget,
                    "optional chain cannot be assigned",
                ));
            }
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
        while self.syntax().typescript() {
            if self.cur.kind == TokenKind::Keyword(Keyword::As) {
                let start = self.cur.span.lo;
                self.bump();
                let ty = self.parse_ts_type()?;
                expr = self.store.alloc_expr(Expr::TsAs(swc_es_ast::TsAsExpr {
                    span: Span::new_with_checked(start, self.last_pos()),
                    expr,
                    ty,
                }));
                continue;
            }

            if self.cur_ident_is("satisfies") {
                let start = self.cur.span.lo;
                self.bump();
                let ty = self.parse_ts_type()?;
                expr = self
                    .store
                    .alloc_expr(Expr::TsSatisfies(swc_es_ast::TsSatisfiesExpr {
                        span: Span::new_with_checked(start, self.last_pos()),
                        expr,
                        ty,
                    }));
                continue;
            }

            break;
        }

        Ok(expr)
    }

    fn parse_conditional_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_nullish_expr()?;

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

    fn parse_nullish_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_logical_or_expr()?;

        while self.cur.kind == TokenKind::Nullish {
            let start = self.cur.span.lo;
            self.bump();
            let right = self.parse_logical_or_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op: BinaryOp::NullishCoalescing,
                left: expr,
                right,
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
            let body_stmt = self.parse_block_stmt_with_directives(true)?;
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

        while self.cur.kind == TokenKind::OrOr {
            let start = self.cur.span.lo;
            self.bump();
            let right = self.parse_logical_and_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op: BinaryOp::LogicalOr,
                left: expr,
                right,
            }));
        }

        Ok(expr)
    }

    fn parse_logical_and_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_bitwise_or_expr()?;

        while self.cur.kind == TokenKind::AndAnd {
            let start = self.cur.span.lo;
            self.bump();
            let right = self.parse_bitwise_or_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op: BinaryOp::LogicalAnd,
                left: expr,
                right,
            }));
        }

        Ok(expr)
    }

    fn parse_bitwise_or_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_bitwise_xor_expr()?;

        while self.cur.kind == TokenKind::Pipe {
            let start = self.cur.span.lo;
            self.bump();
            let right = self.parse_bitwise_xor_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op: BinaryOp::BitOr,
                left: expr,
                right,
            }));
        }

        Ok(expr)
    }

    fn parse_bitwise_xor_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_bitwise_and_expr()?;

        while self.cur.kind == TokenKind::Caret {
            let start = self.cur.span.lo;
            self.bump();
            let right = self.parse_bitwise_and_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op: BinaryOp::BitXor,
                left: expr,
                right,
            }));
        }

        Ok(expr)
    }

    fn parse_bitwise_and_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_equality_expr()?;

        while self.cur.kind == TokenKind::Amp {
            let start = self.cur.span.lo;
            self.bump();
            let right = self.parse_equality_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op: BinaryOp::BitAnd,
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
        let mut expr = self.parse_shift_expr()?;

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
            let right = self.parse_shift_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op,
                left: expr,
                right,
            }));
        }

        while (!self.ctx.contains(Context::IN_FOR_HEAD)
            && self.cur.kind == TokenKind::Keyword(Keyword::In))
            || self.cur.kind == TokenKind::Keyword(Keyword::InstanceOf)
        {
            let start = self.cur.span.lo;
            let op = if self.cur.kind == TokenKind::Keyword(Keyword::In) {
                BinaryOp::In
            } else {
                BinaryOp::InstanceOf
            };
            self.bump();
            let right = self.parse_shift_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op,
                left: expr,
                right,
            }));
        }

        Ok(expr)
    }

    fn parse_shift_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let mut expr = self.parse_additive_expr()?;

        while matches!(
            self.cur.kind,
            TokenKind::LtLt | TokenKind::GtGt | TokenKind::GtGtGt
        ) {
            let start = self.cur.span.lo;
            let op = match self.cur.kind {
                TokenKind::LtLt => BinaryOp::LShift,
                TokenKind::GtGt => BinaryOp::RShift,
                TokenKind::GtGtGt => BinaryOp::ZeroFillRShift,
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
        let mut expr = self.parse_exponent_expr()?;

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
            let right = self.parse_exponent_expr()?;
            expr = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                op,
                left: expr,
                right,
            }));
        }

        Ok(expr)
    }

    fn parse_exponent_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let left = self.parse_unary_expr()?;
        if self.cur.kind != TokenKind::StarStar {
            return Ok(left);
        }

        let start = self.cur.span.lo;
        self.bump();
        let right = self.parse_exponent_expr()?;
        Ok(self.store.alloc_expr(Expr::Binary(BinaryExpr {
            span: Span::new_with_checked(start, self.last_pos()),
            op: BinaryOp::Exp,
            left,
            right,
        })))
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

        if self.cur.kind == TokenKind::Keyword(Keyword::Yield)
            && self.ctx.contains(Context::IN_GENERATOR)
        {
            let start = self.cur.span.lo;
            self.bump();
            let is_delegate = self.cur.kind == TokenKind::Star;
            if is_delegate {
                self.bump();
            }
            let arg = if self.cur.kind == TokenKind::Semi
                || self.cur.kind == TokenKind::RBrace
                || self.cur.kind == TokenKind::RBracket
                || self.cur.kind == TokenKind::RParen
                || self.cur.kind == TokenKind::Comma
                || self.cur.kind == TokenKind::Colon
                || self.cur.kind == TokenKind::Eof
                || self.cur.had_line_break_before
            {
                None
            } else {
                Some(self.parse_assignment_expr()?)
            };
            return Ok(self.store.alloc_expr(Expr::Yield(YieldExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                arg,
                delegate: is_delegate,
            })));
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
                    self.ensure_super_property_or_call_allowed(expr)?;
                    let start = self.cur.span.lo;
                    self.bump();
                    let is_private = self.cur.kind == TokenKind::Hash;
                    let ident = if is_private {
                        self.parse_private_ident()?
                    } else {
                        self.expect_ident()?
                    };
                    expr = self.store.alloc_expr(Expr::Member(MemberExpr {
                        span: Span::new_with_checked(start, self.last_pos()),
                        obj: expr,
                        prop: if is_private {
                            MemberProp::Private(ident)
                        } else {
                            MemberProp::Ident(ident)
                        },
                    }));
                }
                TokenKind::QuestionDot => {
                    self.ensure_super_property_or_call_allowed(expr)?;
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
                                let old_ctx = self.ctx;
                                self.ctx.remove(Context::IN_FOR_HEAD);
                                let arg = self.parse_assignment_expr()?;
                                self.ctx = old_ctx;
                                args.push(ExprOrSpread { spread, expr: arg });
                                if self.cur.kind != TokenKind::RParen {
                                    let _ = self.expect(TokenKind::Comma, ",")?;
                                }
                            }
                            let _ = self.expect(TokenKind::RParen, ")")?;
                            let call = self.store.alloc_expr(Expr::Call(CallExpr {
                                span: Span::new_with_checked(start, self.last_pos()),
                                callee: expr,
                                args,
                            }));
                            expr = self.store.alloc_expr(Expr::OptChain(OptChainExpr {
                                span: Span::new_with_checked(start, self.last_pos()),
                                base: call,
                            }));
                        }
                        TokenKind::LBracket => {
                            self.bump();
                            let old_ctx = self.ctx;
                            self.ctx.remove(Context::IN_FOR_HEAD);
                            let prop = self.parse_expr()?;
                            self.ctx = old_ctx;
                            let _ = self.expect(TokenKind::RBracket, "]")?;
                            let member = self.store.alloc_expr(Expr::Member(MemberExpr {
                                span: Span::new_with_checked(start, self.last_pos()),
                                obj: expr,
                                prop: MemberProp::Computed(prop),
                            }));
                            expr = self.store.alloc_expr(Expr::OptChain(OptChainExpr {
                                span: Span::new_with_checked(start, self.last_pos()),
                                base: member,
                            }));
                        }
                        _ => {
                            let is_private = self.cur.kind == TokenKind::Hash;
                            let ident = if is_private {
                                self.parse_private_ident()?
                            } else {
                                self.expect_ident()?
                            };
                            let member = self.store.alloc_expr(Expr::Member(MemberExpr {
                                span: Span::new_with_checked(start, self.last_pos()),
                                obj: expr,
                                prop: if is_private {
                                    MemberProp::Private(ident)
                                } else {
                                    MemberProp::Ident(ident)
                                },
                            }));
                            expr = self.store.alloc_expr(Expr::OptChain(OptChainExpr {
                                span: Span::new_with_checked(start, self.last_pos()),
                                base: member,
                            }));
                        }
                    }
                }
                TokenKind::LBracket => {
                    self.ensure_super_property_or_call_allowed(expr)?;
                    let start = self.cur.span.lo;
                    self.bump();
                    let old_ctx = self.ctx;
                    self.ctx.remove(Context::IN_FOR_HEAD);
                    let prop = self.parse_expr()?;
                    self.ctx = old_ctx;
                    let _ = self.expect(TokenKind::RBracket, "]")?;
                    expr = self.store.alloc_expr(Expr::Member(MemberExpr {
                        span: Span::new_with_checked(start, self.last_pos()),
                        obj: expr,
                        prop: MemberProp::Computed(prop),
                    }));
                }
                TokenKind::LParen => {
                    self.ensure_super_property_or_call_allowed(expr)?;
                    let start = self.cur.span.lo;
                    self.bump();
                    let mut args = Vec::new();
                    while self.cur.kind != TokenKind::RParen && self.cur.kind != TokenKind::Eof {
                        let spread = self.cur.kind == TokenKind::DotDotDot;
                        if spread {
                            self.bump();
                        }
                        let old_ctx = self.ctx;
                        self.ctx.remove(Context::IN_FOR_HEAD);
                        let arg = self.parse_assignment_expr()?;
                        self.ctx = old_ctx;
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
                TokenKind::Template => {
                    let start = self.cur.span.lo;
                    let template_lit = self.cur_string_value();
                    let template_span = self.cur.span;
                    self.bump();
                    expr = self
                        .store
                        .alloc_expr(Expr::TaggedTemplate(TaggedTemplateExpr {
                            span: Span::new_with_checked(start, self.last_pos()),
                            tag: expr,
                            template: swc_es_ast::TemplateExpr {
                                span: template_span,
                                quasis: vec![template_lit],
                                exprs: Vec::new(),
                            },
                        }));
                }
                TokenKind::Lt if self.syntax().typescript() => {
                    let checkpoint = self.checkpoint_save();

                    if self.parse_ts_type_args().is_ok() {
                        if self.cur.kind == TokenKind::LParen {
                            let start = self.cur.span.lo;
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
                            continue;
                        }

                        if self.can_follow_ts_instantiation_expr() {
                            continue;
                        }
                    }

                    self.checkpoint_load(checkpoint);
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
                TokenKind::Bang
                    if self.syntax().typescript() && !self.cur.had_line_break_before =>
                {
                    let start = self.cur.span.lo;
                    self.bump();
                    expr = self
                        .store
                        .alloc_expr(Expr::TsNonNull(swc_es_ast::TsNonNullExpr {
                            span: Span::new_with_checked(start, self.last_pos()),
                            expr,
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
            if self.cur.kind == TokenKind::Ident
                && matches!(
                    &self.cur.value,
                    Some(TokenValue::Ident(sym)) if sym.as_ref() == "target"
                )
            {
                self.bump();
                return Ok(self
                    .store
                    .alloc_expr(Expr::MetaProp(swc_es_ast::MetaPropExpr {
                        span: Span::new_with_checked(start, self.last_pos()),
                        kind: swc_es_ast::MetaPropKind::NewTarget,
                    })));
            }
            return Err(Error::new(
                self.cur.span,
                Severity::Fatal,
                ErrorCode::UnexpectedToken,
                "expected `target` after `new.`",
            ));
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
                let old_ctx = self.ctx;
                self.ctx.remove(Context::IN_FOR_HEAD);
                let arg = self.parse_assignment_expr()?;
                self.ctx = old_ctx;
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

    fn parse_regex_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;
        self.next = None;
        let regex = self.lexer.rescan_regex_literal(start)?;
        self.cur = self.lexer.next_token();

        let lit = swc_es_ast::RegexLit {
            span: regex.span,
            exp: regex.exp,
            flags: regex.flags,
        };
        self.validate_regex_literal(&lit);

        Ok(self.store.alloc_expr(Expr::Lit(Lit::Regex(lit))))
    }

    fn parse_primary_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let is_async_function = self.at_async_function_start();
        match self.cur.kind {
            TokenKind::Ident if is_async_function => self.parse_async_function_expr(),
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
            TokenKind::BigInt => {
                let lit = self.cur_bigint_value();
                self.bump();
                Ok(self.store.alloc_expr(Expr::Lit(Lit::BigInt(lit))))
            }
            TokenKind::Str => {
                let lit = self.cur_string_value();
                let flags = self.cur.flags;
                self.record_string_token_flags(lit.span, flags);
                if flags.contains_legacy_octal_escape && self.ctx.contains(Context::STRICT) {
                    self.push_strict_octal_error(lit.span);
                }
                self.bump();
                Ok(self.store.alloc_expr(Expr::Lit(Lit::Str(lit))))
            }
            TokenKind::Template => {
                let lit = self.cur_string_value();
                let span = self.cur.span;
                let flags = self.cur.flags;
                self.record_string_token_flags(lit.span, flags);
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
                if self.cur.kind == TokenKind::Dot
                    && self.peek_kind() == TokenKind::Ident
                    && self.peek_ident_is("meta")
                {
                    self.bump();
                    self.bump();
                    return Ok(self
                        .store
                        .alloc_expr(Expr::MetaProp(swc_es_ast::MetaPropExpr {
                            span: Span::new_with_checked(span.lo, self.last_pos()),
                            kind: swc_es_ast::MetaPropKind::ImportMeta,
                        })));
                }
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
            TokenKind::Slash | TokenKind::SlashEq => self.parse_regex_expr(),
            TokenKind::LParen => {
                let start = self.cur.span.lo;
                self.bump();
                let old_ctx = self.ctx;
                self.ctx.remove(Context::IN_FOR_HEAD);
                let expr = self.parse_expr()?;
                self.ctx = old_ctx;
                let _ = self.expect(TokenKind::RParen, ")")?;
                Ok(self.store.alloc_expr(Expr::Paren(ParenExpr {
                    span: Span::new_with_checked(start, self.last_pos()),
                    expr,
                })))
            }
            TokenKind::Keyword(keyword) if self.keyword_can_be_ident(keyword) => {
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
        self.parse_function_expr_with_options(false)
    }

    fn parse_async_function_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        self.parse_function_expr_with_options(true)
    }

    fn parse_function_expr_with_options(&mut self, is_async: bool) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;
        if is_async {
            self.bump();
        }
        let _ = self.expect(TokenKind::Keyword(Keyword::Function), "function")?;
        let is_generator = if self.cur.kind == TokenKind::Star {
            self.bump();
            true
        } else {
            false
        };

        let _ident = if matches!(self.cur.kind, TokenKind::Ident | TokenKind::Keyword(_)) {
            Some(self.expect_ident()?)
        } else {
            None
        };

        let (params, body) = self.parse_function_parts(is_async, is_generator)?;
        let function = self.store.alloc_function(Function {
            span: Span::new_with_checked(start, self.last_pos()),
            params: params
                .into_iter()
                .map(|pat| swc_es_ast::Param {
                    span: Span::new_with_checked(start, start),
                    decorators: Vec::new(),
                    pat,
                })
                .collect(),
            body,
            is_async,
            is_generator,
        });

        Ok(self.store.alloc_expr(Expr::Function(function)))
    }

    fn parse_class_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;
        let class_decorators = self.take_pending_decorators();
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
            if self.syntax().typescript()
                && matches!(self.cur.kind, TokenKind::Ident | TokenKind::Keyword(_))
            {
                let checkpoint = self.checkpoint_save();

                if let Ok(expr) = self.parse_ts_heritage_expr() {
                    if self.cur.kind == TokenKind::LBrace {
                        Some(expr)
                    } else {
                        self.checkpoint_load(checkpoint);
                        Some(self.parse_expr()?)
                    }
                } else {
                    self.checkpoint_load(checkpoint);
                    Some(self.parse_expr()?)
                }
            } else {
                Some(self.parse_expr()?)
            }
        } else {
            None
        };

        let _ = self.expect(TokenKind::LBrace, "{")?;
        let mut members = Vec::new();
        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            let member_decorators = if self.cur.kind == TokenKind::At && self.syntax().decorators()
            {
                self.parse_decorators()?
            } else {
                Vec::new()
            };
            if self.cur.kind == TokenKind::RBrace || self.cur.kind == TokenKind::Eof {
                break;
            }
            if self.cur.kind == TokenKind::Semi || self.cur.kind == TokenKind::Comma {
                self.bump();
                continue;
            }

            let member_start = self.cur.span.lo;
            let mut is_static = false;
            let mut is_async = false;
            let mut is_generator = false;

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
                && !(self.syntax().typescript() && self.peek_kind() == TokenKind::Lt)
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
                if !member_decorators.is_empty() {
                    self.errors.push(Error::new(
                        Span::new_with_checked(member_start, self.last_pos()),
                        Severity::Error,
                        ErrorCode::InvalidStatement,
                        "decorators are not allowed on static blocks",
                    ));
                }
                members.push(
                    self.store
                        .alloc_class_member(swc_es_ast::ClassMember::StaticBlock(
                            swc_es_ast::ClassStaticBlock {
                                span: Span::new_with_checked(member_start, self.last_pos()),
                                body,
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
                if self.cur.kind == TokenKind::Star {
                    is_generator = true;
                    self.bump();
                }
            }

            if self.cur.kind == TokenKind::Star {
                is_generator = true;
                self.bump();
            }

            let key = self.parse_prop_name()?;
            if self.cur.kind == TokenKind::LParen
                || (self.syntax().typescript() && self.cur.kind == TokenKind::Lt)
            {
                let function =
                    self.parse_class_method_function(member_start, is_async, is_generator)?;
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
                                decorators: member_decorators,
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
                if !self.syntax().typescript() && ident.is_none() {
                    self.errors.push(Error::new(
                        Span::new_with_checked(member_start, self.last_pos()),
                        Severity::Error,
                        ErrorCode::UnexpectedToken,
                        "class fields are not enabled in this syntax mode",
                    ));
                }
                self.eat_semi();
                members.push(self.store.alloc_class_member(swc_es_ast::ClassMember::Prop(
                    swc_es_ast::ClassProp {
                        span: Span::new_with_checked(member_start, self.last_pos()),
                        decorators: member_decorators,
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
            decorators: class_decorators,
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
        is_generator: bool,
    ) -> PResult<swc_es_ast::FunctionId> {
        let old_ctx = self.ctx;
        self.ctx.insert(Context::IN_FUNCTION);
        self.ctx.insert(Context::ALLOW_DIRECT_SUPER);
        if is_async {
            self.ctx.insert(Context::IN_ASYNC);
        }
        if is_generator {
            self.ctx.insert(Context::IN_GENERATOR);
        }

        if self.syntax().typescript() && self.cur.kind == TokenKind::Lt {
            let _ = self.parse_ts_type_params()?;
        }
        let _ = self.expect(TokenKind::LParen, "(")?;
        let mut params = Vec::new();
        while self.cur.kind != TokenKind::RParen && self.cur.kind != TokenKind::Eof {
            params.push(self.parse_parameter()?);
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

        let body_stmt = self.parse_block_stmt_with_directives(true)?;
        self.ctx = old_ctx;

        let body = match self.store.stmt(body_stmt).cloned() {
            Some(Stmt::Block(block)) => block.stmts,
            _ => Vec::new(),
        };

        Ok(self.store.alloc_function(Function {
            span: Span::new_with_checked(start, self.last_pos()),
            params,
            body,
            is_async,
            is_generator,
        }))
    }

    fn can_parse_parenthesized_arrow_head(&mut self) -> bool {
        if self.try_parse_parenthesized_arrow_head() {
            return true;
        }

        self.parenthesized_head_followed_by_arrow()
    }

    fn try_parse_parenthesized_arrow_head(&mut self) -> bool {
        let checkpoint = self.checkpoint_save();

        let parsed = (|| -> PResult<()> {
            let _ = self.expect(TokenKind::LParen, "(")?;
            while self.cur.kind != TokenKind::RParen && self.cur.kind != TokenKind::Eof {
                let _ = self.parse_parameter_pat()?;
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
            let _ = self.expect(TokenKind::Arrow, "=>")?;
            Ok(())
        })()
        .is_ok();

        self.checkpoint_load(checkpoint);
        parsed
    }

    fn parenthesized_head_followed_by_arrow(&mut self) -> bool {
        let checkpoint = self.checkpoint_save();

        let parsed = if self.cur.kind == TokenKind::LParen {
            self.skip_balanced(TokenKind::LParen, TokenKind::RParen);
            self.cur.kind == TokenKind::Arrow
        } else {
            false
        };

        self.checkpoint_load(checkpoint);
        parsed
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
                if spread && self.peek_kind() == TokenKind::RBracket {
                    self.errors.push(Error::new(
                        self.cur.span,
                        Severity::Error,
                        ErrorCode::InvalidStatement,
                        "rest element must be the last element",
                    ));
                }
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
            let mut is_generator = false;
            let mut force_method = false;
            if self.cur.kind == TokenKind::Star {
                is_generator = true;
                force_method = true;
                self.bump();
            }
            let mut key = self.parse_prop_name()?;
            let starts_property_name = matches!(
                self.cur.kind,
                TokenKind::Ident
                    | TokenKind::Str
                    | TokenKind::Num
                    | TokenKind::LBracket
                    | TokenKind::Keyword(_)
                    | TokenKind::Star
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
                    force_method = true;
                    is_async = true;
                    if self.cur.kind == TokenKind::Star {
                        is_generator = true;
                        self.bump();
                    }
                    key = self.parse_prop_name()?;
                }
            }

            let value = if matches!(self.cur.kind, TokenKind::Colon | TokenKind::Eq) {
                self.bump();
                self.parse_assignment_expr()?
            } else if self.cur.kind == TokenKind::LParen
                || (self.syntax().typescript() && self.cur.kind == TokenKind::Lt)
                || force_method
            {
                let function =
                    self.parse_class_method_function(prop_start, is_async, is_generator)?;
                self.store.alloc_expr(Expr::Function(function))
            } else {
                match &key {
                    PropName::Ident(ident) => self.store.alloc_expr(Expr::Ident(ident.clone())),
                    PropName::Private(ident) => self.store.alloc_expr(Expr::Ident(ident.clone())),
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
        let opening_name =
            if self.cur.kind == TokenKind::Gt || self.is_jsx_tag_end_token(self.cur.kind) {
                swc_es_ast::JSXElementName::Qualified(Atom::new(""))
            } else {
                self.parse_jsx_name()?
            };
        if self.syntax().typescript() && self.cur.kind == TokenKind::Lt {
            let _ = self.parse_ts_type_args()?;
        }
        let mut attrs = Vec::new();

        while self.cur.kind != TokenKind::Gt
            && self.cur.kind != TokenKind::Eof
            && !(self.cur.kind == TokenKind::Slash && self.peek_kind() == TokenKind::Gt)
        {
            if self.cur.kind == TokenKind::LBrace {
                let attr_span_lo = self.cur.span.lo;
                self.bump();
                if self.cur.kind == TokenKind::DotDotDot {
                    self.bump();
                    let expr = self.parse_assignment_expr()?;
                    let _ = self.expect(TokenKind::RBrace, "}")?;
                    attrs.push(swc_es_ast::JSXAttr {
                        span: Span::new_with_checked(attr_span_lo, self.last_pos()),
                        name: Atom::new("..."),
                        value: Some(expr),
                    });
                    continue;
                }
                while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
                    self.bump();
                }
                if self.cur.kind == TokenKind::RBrace {
                    self.bump();
                }
                continue;
            }

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

        let peek_kind = self.peek_kind();
        let self_closing =
            if self.cur.kind == TokenKind::Slash && self.is_jsx_tag_end_token(peek_kind) {
                self.bump();
                self.eat_jsx_tag_end()?;
                true
            } else {
                self.eat_jsx_tag_end()?;
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
                } else if self.cur.kind == TokenKind::DotDotDot {
                    self.bump();
                    self.parse_assignment_expr()?
                } else {
                    self.parse_assignment_expr()?
                };
                let _ = self.expect(TokenKind::RBrace, "}")?;
                children.push(swc_es_ast::JSXElementChild::Expr(expr));
                continue;
            }

            if let Some(text) = self.jsx_text_atom_for_current() {
                children.push(swc_es_ast::JSXElementChild::Text(text));
                self.bump();
            } else {
                self.bump();
            }
        }

        let closing = if self.cur.kind == TokenKind::Lt && self.peek_kind() == TokenKind::Slash {
            self.bump();
            self.bump();
            let name = if self.cur.kind == TokenKind::Gt || self.is_jsx_tag_end_token(self.cur.kind)
            {
                swc_es_ast::JSXElementName::Qualified(Atom::new(""))
            } else {
                self.parse_jsx_name()?
            };
            self.eat_jsx_tag_end()?;
            let opening_text = self.jsx_name_text(&opening_name);
            let closing_text = self.jsx_name_text(&name);
            if !self.jsx_names_match(&opening_name, &name)
                && !opening_text.is_empty()
                && !closing_text.is_empty()
            {
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

        let mut text: Option<String> = None;
        let mut has_separator = false;

        while matches!(
            self.cur.kind,
            TokenKind::Dot | TokenKind::Colon | TokenKind::Minus
        ) {
            let sep = if self.cur.kind == TokenKind::Dot {
                has_separator = true;
                '.'
            } else if self.cur.kind == TokenKind::Colon {
                has_separator = true;
                ':'
            } else {
                '-'
            };
            self.bump();
            let Some(segment) = self.cur_name_atom() else {
                return Err(self.expected("jsx name segment"));
            };
            let buf = text.get_or_insert_with(|| {
                let mut buf = String::with_capacity(first.len() + 8);
                buf.push_str(first.as_ref());
                buf
            });
            buf.push(sep);
            buf.push_str(segment.as_ref());
            self.bump();
        }

        if let Some(text) = text {
            if has_separator {
                Ok(swc_es_ast::JSXElementName::Qualified(Atom::new(text)))
            } else {
                Ok(swc_es_ast::JSXElementName::Ident(Ident {
                    span: Span::new_with_checked(start, self.last_pos()),
                    sym: Atom::new(text),
                }))
            }
        } else {
            Ok(swc_es_ast::JSXElementName::Ident(Ident {
                span: Span::new_with_checked(start, self.last_pos()),
                sym: first,
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

        self.eat_ts_type_angle_close()?;
        Ok(params)
    }

    fn parse_ts_type(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        self.parse_ts_conditional_type()
    }

    fn parse_ts_conditional_type(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        let start = self.cur.span.lo;
        let check = self.parse_ts_union_type()?;
        if self.cur.kind == TokenKind::Keyword(Keyword::Extends) {
            self.bump();
            let extends_type = self.parse_ts_union_type()?;
            if self.cur.kind == TokenKind::Question {
                self.bump();
                let true_type = self.parse_ts_type()?;
                let _ = self.expect(TokenKind::Colon, ":")?;
                let false_type = self.parse_ts_type()?;
                return Ok(self.store.alloc_ts_type(TsType::Conditional(
                    swc_es_ast::TsConditionalType {
                        span: Span::new_with_checked(start, self.last_pos()),
                        check_type: check,
                        extends_type,
                        true_type,
                        false_type,
                    },
                )));
            }
        }
        Ok(check)
    }

    fn parse_ts_union_type(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        let start = self.cur.span.lo;
        while self.cur.kind == TokenKind::Pipe {
            self.bump();
        }
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
        while self.cur.kind == TokenKind::Amp {
            self.bump();
        }
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

        while self.cur.kind == TokenKind::LBracket {
            self.bump();
            if self.cur.kind == TokenKind::RBracket {
                self.bump();
                ty = self.store.alloc_ts_type(TsType::Array(TsArrayType {
                    span: Span::new_with_checked(start, self.last_pos()),
                    elem_type: ty,
                }));
                continue;
            }

            let index_type = self.parse_ts_type()?;
            let _ = self.expect(TokenKind::RBracket, "]")?;
            ty = self
                .store
                .alloc_ts_type(TsType::IndexedAccess(swc_es_ast::TsIndexedAccessType {
                    span: Span::new_with_checked(start, self.last_pos()),
                    obj_type: ty,
                    index_type,
                }));
        }

        Ok(ty)
    }

    fn parse_ts_primary_type(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        let start = self.cur.span.lo;
        let paren_is_arrow = self.cur.kind == TokenKind::LParen && self.paren_followed_by_arrow();
        if self.cur.kind == TokenKind::Keyword(Keyword::TypeOf) || self.cur_ident_is("typeof") {
            self.bump();
            let expr_name = self.parse_ts_type_name();
            return Ok(self
                .store
                .alloc_ts_type(TsType::TypeQuery(swc_es_ast::TsTypeQuery {
                    span: Span::new_with_checked(start, self.last_pos()),
                    expr_name,
                    type_args: Vec::new(),
                })));
        }

        if self.cur_ident_is("keyof")
            || self.cur_ident_is("readonly")
            || self.cur_ident_is("unique")
        {
            let op = if self.cur_ident_is("keyof") {
                swc_es_ast::TsTypeOperatorOp::KeyOf
            } else if self.cur_ident_is("readonly") {
                swc_es_ast::TsTypeOperatorOp::ReadOnly
            } else {
                swc_es_ast::TsTypeOperatorOp::Unique
            };
            self.bump();
            let ty = self.parse_ts_primary_type()?;
            return Ok(self.store.alloc_ts_type(TsType::TypeOperator(
                swc_es_ast::TsTypeOperatorType {
                    span: Span::new_with_checked(start, self.last_pos()),
                    op,
                    ty,
                },
            )));
        }

        if self.cur_ident_is("infer") {
            self.bump();
            let type_param = self.expect_ident()?;
            return Ok(self
                .store
                .alloc_ts_type(TsType::Infer(swc_es_ast::TsInferType {
                    span: Span::new_with_checked(start, self.last_pos()),
                    type_param,
                })));
        }

        if self.cur.kind == TokenKind::Keyword(Keyword::Import)
            && self.peek_kind() == TokenKind::LParen
            && !matches!(self.peek_nth_kind(2), TokenKind::Dot)
        {
            self.bump();
            let _ = self.expect(TokenKind::LParen, "(")?;
            let arg = self.expect_string()?;
            let _ = self.expect(TokenKind::RParen, ")")?;
            let qualifier = if self.cur.kind == TokenKind::Dot {
                self.bump();
                Some(self.parse_ts_type_name())
            } else {
                None
            };
            let type_args = if self.cur.kind == TokenKind::Lt {
                self.parse_ts_type_args()?
            } else {
                Vec::new()
            };
            return Ok(self
                .store
                .alloc_ts_type(TsType::Import(swc_es_ast::TsImportType {
                    span: Span::new_with_checked(start, self.last_pos()),
                    arg,
                    qualifier,
                    type_args,
                })));
        }

        if self.cur.kind == TokenKind::Minus && self.peek_kind() == TokenKind::Num {
            let start = self.cur.span.lo;
            self.bump();
            let mut lit = self.cur_number_value();
            lit.span = Span::new_with_checked(start, lit.span.hi);
            lit.value = -lit.value;
            self.bump();
            return Ok(self
                .store
                .alloc_ts_type(TsType::Lit(swc_es_ast::TsLitType::Num(lit))));
        }

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
            TokenKind::Ident if self.cur_ident_is("symbol") => {
                self.bump();
                TsType::Keyword(TsKeywordType::Symbol)
            }
            TokenKind::Ident if self.cur_ident_is("object") => {
                self.bump();
                TsType::Keyword(TsKeywordType::Object)
            }
            TokenKind::Ident if self.cur_ident_is("bigint") => {
                self.bump();
                TsType::Keyword(TsKeywordType::BigInt)
            }
            TokenKind::Ident if self.cur_ident_is("undefined") => {
                self.bump();
                TsType::Keyword(TsKeywordType::Undefined)
            }
            TokenKind::Ident if self.cur_ident_is("intrinsic") => {
                self.bump();
                TsType::Keyword(TsKeywordType::Intrinsic)
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
            TokenKind::LParen if paren_is_arrow => {
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

    fn paren_followed_by_arrow(&mut self) -> bool {
        if self.cur.kind != TokenKind::LParen {
            return false;
        }

        let checkpoint = self.lexer.checkpoint_save();
        let mut depth = 0usize;
        let mut cur_kind = self.cur.kind;
        let mut next_kind = self.next.as_ref().map(|token| token.kind);

        let bump =
            |cur_kind: &mut TokenKind, next_kind: &mut Option<TokenKind>, lexer: &mut Lexer<'a>| {
                *cur_kind = next_kind.take().unwrap_or_else(|| lexer.next_token().kind);
            };

        while cur_kind != TokenKind::Eof {
            match cur_kind {
                TokenKind::LParen => depth += 1,
                TokenKind::RParen => {
                    depth = depth.saturating_sub(1);
                    if depth == 0 {
                        bump(&mut cur_kind, &mut next_kind, &mut self.lexer);
                        break;
                    }
                }
                _ => {}
            }
            bump(&mut cur_kind, &mut next_kind, &mut self.lexer);
        }

        if self.syntax().typescript() && cur_kind == TokenKind::Colon {
            bump(&mut cur_kind, &mut next_kind, &mut self.lexer);
            let mut nested = 0usize;
            while cur_kind != TokenKind::Eof {
                match cur_kind {
                    TokenKind::LParen | TokenKind::LBracket | TokenKind::LBrace | TokenKind::Lt => {
                        nested += 1;
                    }
                    TokenKind::RParen | TokenKind::RBracket | TokenKind::RBrace | TokenKind::Gt => {
                        nested = nested.saturating_sub(1);
                    }
                    TokenKind::Arrow if nested == 0 => break,
                    _ => {}
                }
                bump(&mut cur_kind, &mut next_kind, &mut self.lexer);
            }
        }

        let result = cur_kind == TokenKind::Arrow;
        self.lexer.checkpoint_load(checkpoint);
        result
    }

    fn ident_followed_by_arrow(&mut self) -> bool {
        if !matches!(self.cur.kind, TokenKind::Ident | TokenKind::Keyword(_)) {
            return false;
        }

        let checkpoint = self.lexer.checkpoint_save();
        let mut cur_kind = self.cur.kind;
        let mut next_kind = self.next.as_ref().map(|token| token.kind);

        let bump =
            |cur_kind: &mut TokenKind, next_kind: &mut Option<TokenKind>, lexer: &mut Lexer<'a>| {
                *cur_kind = next_kind.take().unwrap_or_else(|| lexer.next_token().kind);
            };

        bump(&mut cur_kind, &mut next_kind, &mut self.lexer);
        let result = if matches!(cur_kind, TokenKind::Ident | TokenKind::Keyword(_)) {
            bump(&mut cur_kind, &mut next_kind, &mut self.lexer);
            cur_kind == TokenKind::Arrow
        } else if cur_kind != TokenKind::LParen {
            false
        } else {
            let mut depth = 1usize;
            bump(&mut cur_kind, &mut next_kind, &mut self.lexer);
            while cur_kind != TokenKind::Eof {
                match cur_kind {
                    TokenKind::LParen => depth += 1,
                    TokenKind::RParen => {
                        depth = depth.saturating_sub(1);
                        if depth == 0 {
                            bump(&mut cur_kind, &mut next_kind, &mut self.lexer);
                            break;
                        }
                    }
                    _ => {}
                }
                bump(&mut cur_kind, &mut next_kind, &mut self.lexer);
            }

            if self.syntax().typescript() && cur_kind == TokenKind::Colon {
                bump(&mut cur_kind, &mut next_kind, &mut self.lexer);
                let mut nested = 0usize;
                while cur_kind != TokenKind::Eof {
                    match cur_kind {
                        TokenKind::LParen
                        | TokenKind::LBracket
                        | TokenKind::LBrace
                        | TokenKind::Lt => {
                            nested += 1;
                        }
                        TokenKind::RParen
                        | TokenKind::RBracket
                        | TokenKind::RBrace
                        | TokenKind::Gt => {
                            nested = nested.saturating_sub(1);
                        }
                        TokenKind::Arrow if nested == 0 => break,
                        _ => {}
                    }
                    bump(&mut cur_kind, &mut next_kind, &mut self.lexer);
                }
            }

            cur_kind == TokenKind::Arrow
        };

        self.lexer.checkpoint_load(checkpoint);
        result
    }

    fn peek_starts_property_name(&mut self) -> bool {
        matches!(
            self.peek_kind(),
            TokenKind::Ident
                | TokenKind::Str
                | TokenKind::Num
                | TokenKind::LBracket
                | TokenKind::Star
                | TokenKind::Keyword(_)
        )
    }

    fn parse_prop_name(&mut self) -> PResult<PropName> {
        match self.cur.kind {
            TokenKind::Hash => {
                let ident = self.parse_private_ident()?;
                Ok(PropName::Private(ident))
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

        self.eat_ts_type_angle_close()?;
        Ok(args)
    }

    fn parse_ts_type_lit(&mut self) -> PResult<swc_es_ast::TsTypeId> {
        let start = self.cur.span.lo;
        let _ = self.expect(TokenKind::LBrace, "{")?;
        let mut members = Vec::new();

        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            members.push(self.parse_ts_type_member()?);
        }

        let _ = self.expect(TokenKind::RBrace, "}")?;
        Ok(self.store.alloc_ts_type(TsType::TypeLit(TsTypeLit {
            span: Span::new_with_checked(start, self.last_pos()),
            members,
        })))
    }

    fn parse_ts_type_name(&mut self) -> Ident {
        let start = self.cur.span.lo;
        let Some(first) = self.cur_name_atom() else {
            return Ident {
                span: Span::new_with_checked(start, self.last_pos()),
                sym: Atom::new("_"),
            };
        };
        self.bump();

        if self.cur.kind != TokenKind::Dot {
            return Ident {
                span: Span::new_with_checked(start, self.last_pos()),
                sym: first,
            };
        }

        let mut name = String::with_capacity(first.len() + 8);
        name.push_str(first.as_ref());
        while self.cur.kind == TokenKind::Dot {
            self.bump();
            let Some(segment) = self.cur_name_atom() else {
                break;
            };
            name.push('.');
            name.push_str(segment.as_ref());
            self.bump();
        }

        Ident {
            span: Span::new_with_checked(start, self.last_pos()),
            sym: Atom::new(name),
        }
    }

    fn parse_ts_heritage_expr(&mut self) -> PResult<swc_es_ast::ExprId> {
        let start = self.cur.span.lo;
        let ident = self.expect_ident()?;
        let mut expr = self.store.alloc_expr(Expr::Ident(ident));

        while self.cur.kind == TokenKind::Dot {
            self.bump();
            let prop = self.expect_ident()?;
            expr = self.store.alloc_expr(Expr::Member(MemberExpr {
                span: Span::new_with_checked(start, self.last_pos()),
                obj: expr,
                prop: MemberProp::Ident(prop),
            }));
        }

        if self.cur.kind == TokenKind::Lt {
            let _ = self.parse_ts_type_args()?;
        }

        Ok(expr)
    }

    fn parse_parameter(&mut self) -> PResult<swc_es_ast::Param> {
        let start = self.cur.span.lo;
        let decorators = if self.cur.kind == TokenKind::At && self.syntax().decorators() {
            self.parse_decorators()?
        } else {
            Vec::new()
        };

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
        if self.cur.kind == TokenKind::Eq {
            let start = self.cur.span.lo;
            self.bump();
            let right = self.parse_assignment_expr()?;
            pat = self.store.alloc_pat(Pat::Assign(swc_es_ast::AssignPat {
                span: Span::new_with_checked(start, self.last_pos()),
                left: pat,
                right,
            }));
        }
        Ok(swc_es_ast::Param {
            span: Span::new_with_checked(start, self.last_pos()),
            decorators,
            pat,
        })
    }

    fn parse_parameter_pat(&mut self) -> PResult<swc_es_ast::PatId> {
        Ok(self.parse_parameter()?.pat)
    }

    fn parse_ts_pat_suffix(&mut self, pat: swc_es_ast::PatId) -> PResult<swc_es_ast::PatId> {
        if self.cur.kind == TokenKind::Question {
            let allow_optional = matches!(self.store.pat(pat), Some(Pat::Ident(_)))
                || self.syntax().dts()
                || self.ctx.contains(Context::IN_DECLARE);
            if !allow_optional {
                self.errors.push(Error::new(
                    self.cur.span,
                    Severity::Error,
                    ErrorCode::InvalidAssignTarget,
                    "optional marker is allowed only on identifier bindings outside declaration \
                     contexts",
                ));
            }
            self.bump();
        }
        if self.cur.kind == TokenKind::Colon {
            self.bump();
            let _ = self.parse_ts_type()?;
        }
        Ok(pat)
    }

    fn parse_decorators(&mut self) -> PResult<Vec<Decorator>> {
        let mut decorators = Vec::new();
        while self.cur.kind == TokenKind::At {
            let start = self.cur.span.lo;
            self.bump();
            let expr = self.parse_assignment_expr()?;
            decorators.push(Decorator {
                span: Span::new_with_checked(start, self.last_pos()),
                expr,
            });
        }
        Ok(decorators)
    }

    fn take_pending_decorators(&mut self) -> Vec<Decorator> {
        std::mem::take(&mut self.pending_decorators)
    }

    fn parse_private_ident(&mut self) -> PResult<Ident> {
        let start = self.cur.span.lo;
        if self.cur.kind == TokenKind::Hash {
            self.bump();
        }
        let ident = self.expect_ident()?;
        let ident_sym = ident.sym.as_ref();
        let mut sym = String::with_capacity(ident_sym.len() + 1);
        sym.push('#');
        sym.push_str(ident_sym);
        Ok(Ident {
            span: Span::new_with_checked(start, ident.span.hi),
            sym: Atom::new(sym),
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

    fn parse_import_attributes_clause(&mut self) -> Vec<ImportAttribute> {
        let is_with =
            self.cur.kind == TokenKind::Keyword(Keyword::With) || self.cur_ident_is("with");
        let is_assert = self.cur_ident_is("assert");
        if !is_with && !is_assert {
            return Vec::new();
        }

        self.bump();
        if self.cur.kind != TokenKind::LBrace {
            return Vec::new();
        }
        self.bump();

        let mut attrs = Vec::new();
        while self.cur.kind != TokenKind::RBrace && self.cur.kind != TokenKind::Eof {
            let attr_start = self.cur.span.lo;
            let key = match self.cur.kind {
                TokenKind::Str => {
                    let lit = self.cur_string_value();
                    self.bump();
                    ImportAttributeName::Str(lit)
                }
                TokenKind::Ident | TokenKind::Keyword(_) => {
                    let ident = self.expect_ident().unwrap_or_else(|_| Ident {
                        span: self.cur.span,
                        sym: Atom::new(""),
                    });
                    ImportAttributeName::Ident(ident)
                }
                _ => {
                    self.errors.push(self.expected("import attribute key"));
                    self.bump();
                    if self.cur.kind == TokenKind::Comma {
                        self.bump();
                    }
                    continue;
                }
            };

            if self.cur.kind != TokenKind::Colon {
                self.errors.push(self.expected(":"));
            } else {
                self.bump();
            }

            let value = if self.cur.kind == TokenKind::Str {
                let lit = self.cur_string_value();
                self.bump();
                lit
            } else {
                if self.cur.kind != TokenKind::Eof {
                    self.bump();
                }
                StrLit {
                    span: Span::new_with_checked(attr_start, self.last_pos()),
                    value: Atom::new(""),
                }
            };

            attrs.push(ImportAttribute {
                span: Span::new_with_checked(attr_start, self.last_pos()),
                key,
                value,
            });

            if self.cur.kind == TokenKind::Comma {
                self.bump();
            } else {
                break;
            }
        }
        if self.cur.kind == TokenKind::RBrace {
            self.bump();
        }
        attrs
    }

    fn update_directive_prologue(
        &mut self,
        stmt: swc_es_ast::StmtId,
        in_directive_prologue: &mut bool,
        directive_octal_spans: &mut Vec<Span>,
    ) {
        let Some((lit, flags)) = self.directive_string_literal(stmt) else {
            *in_directive_prologue = false;
            directive_octal_spans.clear();
            return;
        };

        if flags.contains_legacy_octal_escape {
            directive_octal_spans.push(lit.span);
        }

        if !flags.escaped && lit.value.as_ref() == "use strict" {
            self.ctx.insert(Context::STRICT);

            if flags.contains_legacy_octal_escape {
                self.push_strict_octal_error(lit.span);
            }
            for span in directive_octal_spans.drain(..) {
                self.push_strict_octal_error(span);
            }
        }
    }

    fn directive_string_literal(&self, stmt: swc_es_ast::StmtId) -> Option<(StrLit, TokenFlags)> {
        let Stmt::Expr(expr_stmt) = self.store.stmt(stmt)?.clone() else {
            return None;
        };
        let Expr::Lit(Lit::Str(lit)) = self.store.expr(expr_stmt.expr)?.clone() else {
            return None;
        };
        let flags = self.string_token_flags(lit.span);
        Some((lit, flags))
    }

    fn push_strict_octal_error(&mut self, span: Span) {
        self.errors.push(Error::new(
            span,
            Severity::Error,
            ErrorCode::StrictModeViolation,
            "legacy octal escape sequences are not allowed in strict mode",
        ));
    }

    fn validate_regex_literal(&mut self, lit: &swc_es_ast::RegexLit) {
        let flags = lit.flags.as_ref();
        let mut has_u = false;
        let mut seen_flags = 0u8;
        for flag in flags.chars() {
            let bit = match flag {
                'd' => 1 << 0,
                'g' => 1 << 1,
                'i' => 1 << 2,
                'm' => 1 << 3,
                's' => 1 << 4,
                'u' => {
                    has_u = true;
                    1 << 5
                }
                'v' => 1 << 6,
                'y' => 1 << 7,
                _ => {
                    self.errors.push(Error::new(
                        lit.span,
                        Severity::Error,
                        ErrorCode::InvalidRegex,
                        format!("unknown regular expression flag `{flag}`"),
                    ));
                    return;
                }
            };

            if (seen_flags & bit) != 0 {
                self.errors.push(Error::new(
                    lit.span,
                    Severity::Error,
                    ErrorCode::InvalidRegex,
                    format!("duplicated regular expression flag `{flag}`"),
                ));
                return;
            }
            seen_flags |= bit;
        }

        if has_u {
            self.validate_unicode_regex_pattern(lit.span, lit.exp.as_ref());
        }
    }

    fn validate_unicode_regex_pattern(&mut self, span: Span, pattern: &str) {
        let mut chars = pattern.chars().peekable();
        let mut in_class = false;
        let mut escaped = false;
        let mut group_stack = Vec::<RegexGroupKind>::new();
        let mut last_atom = RegexAtomKind::None;

        while let Some(ch) = chars.next() {
            if escaped {
                escaped = false;
                if ch.is_ascii_digit() {
                    self.errors.push(Error::new(
                        span,
                        Severity::Error,
                        ErrorCode::InvalidRegex,
                        "decimal escapes are not allowed in unicode regular expressions",
                    ));
                    return;
                }
                if ch == 'u' && chars.peek().copied() == Some('{') {
                    let mut probe = chars.clone();
                    let _ = probe.next();
                    let mut consumed = 1usize;
                    let mut saw_digit = false;
                    let mut closed = false;
                    for value in probe {
                        consumed += 1;
                        if value.is_ascii_hexdigit() {
                            saw_digit = true;
                            continue;
                        }
                        if value == '}' && saw_digit {
                            closed = true;
                            break;
                        }
                        break;
                    }
                    if closed {
                        for _ in 0..consumed {
                            let _ = chars.next();
                        }
                        if !in_class {
                            last_atom = RegexAtomKind::Atom;
                        }
                        continue;
                    }
                }
                if !in_class {
                    last_atom = if matches!(ch, 'b' | 'B') {
                        RegexAtomKind::Assertion
                    } else {
                        RegexAtomKind::Atom
                    };
                }
                continue;
            }

            if in_class {
                match ch {
                    '\\' => escaped = true,
                    ']' => {
                        in_class = false;
                        last_atom = RegexAtomKind::Atom;
                    }
                    _ => {}
                }
                continue;
            }

            match ch {
                '\\' => {
                    escaped = true;
                }
                '[' => {
                    in_class = true;
                }
                '(' => {
                    let kind = if chars.peek().copied() == Some('?') {
                        let mut probe = chars.clone();
                        let _ = probe.next();
                        match probe.next() {
                            Some('=') | Some('!') => RegexGroupKind::Assertion,
                            Some('<') if matches!(probe.next(), Some('=') | Some('!')) => {
                                RegexGroupKind::Assertion
                            }
                            _ => RegexGroupKind::Group,
                        }
                    } else {
                        RegexGroupKind::Group
                    };
                    group_stack.push(kind);
                    last_atom = RegexAtomKind::None;
                }
                ')' => {
                    let Some(kind) = group_stack.pop() else {
                        self.errors.push(Error::new(
                            span,
                            Severity::Error,
                            ErrorCode::InvalidRegex,
                            "unmatched `)` in regular expression",
                        ));
                        return;
                    };
                    last_atom = if kind == RegexGroupKind::Assertion {
                        RegexAtomKind::Assertion
                    } else {
                        RegexAtomKind::Atom
                    };
                }
                '|' => {
                    last_atom = RegexAtomKind::None;
                }
                '*' | '+' | '?' => {
                    if last_atom != RegexAtomKind::Atom {
                        self.errors.push(Error::new(
                            span,
                            Severity::Error,
                            ErrorCode::InvalidRegex,
                            "quantifier has no valid target",
                        ));
                        return;
                    }
                    last_atom = RegexAtomKind::Atom;
                }
                '{' => {
                    if Self::consume_regex_brace_quantifier(&mut chars) {
                        if last_atom != RegexAtomKind::Atom {
                            self.errors.push(Error::new(
                                span,
                                Severity::Error,
                                ErrorCode::InvalidRegex,
                                "quantifier has no valid target",
                            ));
                            return;
                        }
                        last_atom = RegexAtomKind::Atom;
                    } else {
                        self.errors.push(Error::new(
                            span,
                            Severity::Error,
                            ErrorCode::InvalidRegex,
                            "invalid `{` in unicode regular expression",
                        ));
                        return;
                    }
                }
                '}' => {
                    self.errors.push(Error::new(
                        span,
                        Severity::Error,
                        ErrorCode::InvalidRegex,
                        "invalid `}` in unicode regular expression",
                    ));
                    return;
                }
                '^' | '$' => {
                    last_atom = RegexAtomKind::Assertion;
                }
                _ => {
                    last_atom = RegexAtomKind::Atom;
                }
            }
        }

        if escaped || in_class || !group_stack.is_empty() {
            self.errors.push(Error::new(
                span,
                Severity::Error,
                ErrorCode::InvalidRegex,
                "unterminated regular expression pattern",
            ));
        }
    }

    fn consume_regex_brace_quantifier(
        chars: &mut std::iter::Peekable<std::str::Chars<'_>>,
    ) -> bool {
        let mut lower_digits = 0usize;
        while matches!(chars.peek(), Some(ch) if ch.is_ascii_digit()) {
            lower_digits += 1;
            let _ = chars.next();
        }
        if lower_digits == 0 {
            return false;
        }

        if chars.peek().copied() == Some(',') {
            let _ = chars.next();
            while matches!(chars.peek(), Some(ch) if ch.is_ascii_digit()) {
                let _ = chars.next();
            }
        }

        if chars.peek().copied() != Some('}') {
            return false;
        }
        let _ = chars.next();
        if chars.peek().copied() == Some('?') {
            let _ = chars.next();
        }
        true
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

    fn validate_assignment_target_expr(&mut self, expr: swc_es_ast::ExprId) {
        match self.store.expr(expr).cloned() {
            Some(Expr::Array(array)) => {
                for (index, elem) in array.elems.iter().enumerate() {
                    let Some(elem) = elem else {
                        continue;
                    };

                    if elem.spread && index + 1 < array.elems.len() {
                        self.errors.push(Error::new(
                            self.expr_span(elem.expr),
                            Severity::Error,
                            ErrorCode::InvalidStatement,
                            "rest element must be the last element",
                        ));
                    }

                    self.validate_assignment_target_expr(elem.expr);
                }
            }
            Some(Expr::Object(object)) => {
                for (index, prop) in object.props.iter().enumerate() {
                    if self.is_object_spread_prop(prop) && index + 1 < object.props.len() {
                        self.errors.push(Error::new(
                            self.expr_span(prop.value),
                            Severity::Error,
                            ErrorCode::InvalidStatement,
                            "rest element must be the last element",
                        ));
                    }

                    self.validate_assignment_target_expr(prop.value);
                }
            }
            Some(Expr::Paren(paren)) => self.validate_assignment_target_expr(paren.expr),
            Some(Expr::TsAs(expr)) => self.validate_assignment_target_expr(expr.expr),
            Some(Expr::TsNonNull(expr)) => self.validate_assignment_target_expr(expr.expr),
            Some(Expr::TsSatisfies(expr)) => self.validate_assignment_target_expr(expr.expr),
            _ => {}
        }
    }

    fn expr_span(&self, expr: swc_es_ast::ExprId) -> Span {
        match self.store.expr(expr).cloned() {
            Some(Expr::Ident(ident)) => ident.span,
            Some(Expr::Lit(lit)) => match lit {
                Lit::Str(lit) => lit.span,
                Lit::Bool(lit) => lit.span,
                Lit::Null(lit) => lit.span,
                Lit::Num(lit) => lit.span,
                Lit::BigInt(lit) => lit.span,
                Lit::Regex(lit) => lit.span,
            },
            Some(Expr::TsAs(expr)) => expr.span,
            Some(Expr::TsNonNull(expr)) => expr.span,
            Some(Expr::TsSatisfies(expr)) => expr.span,
            Some(Expr::Array(array)) => array.span,
            Some(Expr::Object(object)) => object.span,
            Some(Expr::Unary(expr)) => expr.span,
            Some(Expr::Binary(expr)) => expr.span,
            Some(Expr::Assign(expr)) => expr.span,
            Some(Expr::Call(expr)) => expr.span,
            Some(Expr::Member(expr)) => expr.span,
            Some(Expr::Cond(expr)) => expr.span,
            Some(Expr::Seq(expr)) => expr.span,
            Some(Expr::New(expr)) => expr.span,
            Some(Expr::Update(expr)) => expr.span,
            Some(Expr::Await(expr)) => expr.span,
            Some(Expr::Arrow(expr)) => expr.span,
            Some(Expr::Template(expr)) => expr.span,
            Some(Expr::Yield(expr)) => expr.span,
            Some(Expr::TaggedTemplate(expr)) => expr.span,
            Some(Expr::MetaProp(expr)) => expr.span,
            Some(Expr::OptChain(expr)) => expr.span,
            Some(Expr::Paren(expr)) => expr.span,
            Some(Expr::Function(_)) | Some(Expr::Class(_)) | Some(Expr::JSXElement(_)) | None => {
                DUMMY_SP
            }
        }
    }

    fn is_object_spread_prop(&self, prop: &KeyValueProp) -> bool {
        matches!(
            &prop.key,
            PropName::Ident(ident) if ident.sym.as_ref() == "__spread__"
        )
    }

    fn expr_to_assign_pat(&mut self, expr: swc_es_ast::ExprId) -> swc_es_ast::PatId {
        match self.store.expr(expr).cloned() {
            Some(Expr::Ident(ident)) => self.store.alloc_pat(Pat::Ident(ident)),
            _ => self.store.alloc_pat(Pat::Expr(expr)),
        }
    }

    fn expr_is_optional_chain(&self, expr: swc_es_ast::ExprId) -> bool {
        match self.store.expr(expr) {
            Some(Expr::OptChain(_)) => true,
            Some(Expr::Paren(paren)) => self.expr_is_optional_chain(paren.expr),
            Some(Expr::TsAs(value)) => self.expr_is_optional_chain(value.expr),
            Some(Expr::TsNonNull(value)) => self.expr_is_optional_chain(value.expr),
            Some(Expr::TsSatisfies(value)) => self.expr_is_optional_chain(value.expr),
            Some(Expr::Member(member)) => self.expr_is_optional_chain(member.obj),
            Some(Expr::Call(call)) => self.expr_is_optional_chain(call.callee),
            _ => false,
        }
    }

    fn expr_is_super_reference(&self, expr: swc_es_ast::ExprId) -> bool {
        match self.store.expr(expr) {
            Some(Expr::Ident(ident)) => ident.sym.as_ref() == "super",
            Some(Expr::Paren(paren)) => self.expr_is_super_reference(paren.expr),
            Some(Expr::TsAs(value)) => self.expr_is_super_reference(value.expr),
            Some(Expr::TsNonNull(value)) => self.expr_is_super_reference(value.expr),
            Some(Expr::TsSatisfies(value)) => self.expr_is_super_reference(value.expr),
            _ => false,
        }
    }

    fn ensure_super_property_or_call_allowed(&self, expr: swc_es_ast::ExprId) -> PResult<()> {
        if !self.expr_is_super_reference(expr) {
            return Ok(());
        }
        if self.syntax().allow_super_outside_method()
            || self.ctx.contains(Context::ALLOW_DIRECT_SUPER)
        {
            return Ok(());
        }

        Err(Error::new(
            self.cur.span,
            Severity::Fatal,
            ErrorCode::InvalidStatement,
            "`super` is not allowed outside methods in current syntax mode",
        ))
    }

    fn expr_is_let_member(&self, expr: swc_es_ast::ExprId) -> bool {
        let Some(Expr::Member(member)) = self.store.expr(expr) else {
            return false;
        };
        matches!(
            self.store.expr(member.obj),
            Some(Expr::Ident(ident)) if ident.sym.as_ref() == "let"
        )
    }

    fn is_await_using_decl_start(&mut self) -> bool {
        if self.cur.kind != TokenKind::Keyword(Keyword::Await)
            || !self.peek_nth_ident_is(1, "using")
        {
            return false;
        }
        let third = self.peek_nth_kind(2);
        if matches!(third, TokenKind::Ident) && self.peek_nth_ident_is(2, "of") {
            return false;
        }
        matches!(
            third,
            TokenKind::Ident | TokenKind::LBracket | TokenKind::LBrace
        )
    }

    fn is_using_decl_start(&mut self) -> bool {
        if self.cur.kind != TokenKind::Ident || !self.cur_ident_is("using") {
            return false;
        }

        let next = self.peek_nth_kind(1);
        if matches!(next, TokenKind::Ident) && self.peek_nth_ident_is(1, "of") {
            return false;
        }

        matches!(
            next,
            TokenKind::Ident | TokenKind::LBracket | TokenKind::LBrace
        )
    }

    fn is_let_decl_start(&mut self) -> bool {
        if self.cur.kind != TokenKind::Keyword(Keyword::Let) {
            return false;
        }

        matches!(
            self.peek_nth_kind(1),
            TokenKind::Ident | TokenKind::LBracket | TokenKind::LBrace | TokenKind::Keyword(_)
        )
    }

    fn is_let_decl_for_head_start(&mut self) -> bool {
        if self.cur.kind != TokenKind::Keyword(Keyword::Let) {
            return false;
        }

        let next = self.peek_nth_kind(1);
        if matches!(next, TokenKind::Ident) && self.peek_nth_ident_is(1, "of") {
            return false;
        }
        if next == TokenKind::Keyword(Keyword::In) {
            return false;
        }

        matches!(
            next,
            TokenKind::Ident | TokenKind::LBracket | TokenKind::LBrace | TokenKind::Keyword(_)
        )
    }

    fn peek_nth_ident_is(&mut self, n: usize, value: &str) -> bool {
        if n == 0 {
            if self.cur.kind != TokenKind::Ident || self.cur.flags.escaped {
                return false;
            }
            return matches!(&self.cur.value, Some(TokenValue::Ident(sym)) if sym.as_ref() == value);
        }

        if n == 1 {
            let token = self.peek_token();
            if token.kind != TokenKind::Ident || token.flags.escaped {
                return false;
            }
            return matches!(&token.value, Some(TokenValue::Ident(sym)) if sym.as_ref() == value);
        }

        let _ = self.peek_token();
        let checkpoint = self.lexer.checkpoint_save();
        let mut token = self.lexer.next_token();
        for _ in 3..=n {
            token = self.lexer.next_token();
        }
        self.lexer.checkpoint_load(checkpoint);

        let matched = if token.kind != TokenKind::Ident || token.flags.escaped {
            false
        } else {
            matches!(&token.value, Some(TokenValue::Ident(sym)) if sym.as_ref() == value)
        };
        matched
    }

    fn peek_nth_kind(&mut self, n: usize) -> TokenKind {
        if n == 0 {
            return self.cur.kind;
        }
        if n == 1 {
            return self.peek_kind();
        }
        let _ = self.peek_token();
        let checkpoint = self.lexer.checkpoint_save();
        let mut kind = self.lexer.next_token().kind;
        for _ in 3..=n {
            kind = self.lexer.next_token().kind;
        }
        self.lexer.checkpoint_load(checkpoint);
        kind
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

    fn cur_bigint_value(&self) -> BigIntLit {
        BigIntLit {
            span: self.cur.span,
            value: match &self.cur.value {
                Some(TokenValue::BigInt(value)) => value.clone(),
                _ => Atom::new("0"),
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

    fn record_string_token_flags(&mut self, span: Span, flags: TokenFlags) {
        self.string_token_flags.push((span, flags));
    }

    fn string_token_flags(&self, span: Span) -> TokenFlags {
        self.string_token_flags
            .iter()
            .rev()
            .find_map(|(lit_span, flags)| {
                if *lit_span == span {
                    Some(*flags)
                } else {
                    None
                }
            })
            .unwrap_or_default()
    }

    fn cur_ident_is(&self, value: &str) -> bool {
        if self.cur.kind != TokenKind::Ident || self.cur.flags.escaped {
            return false;
        }
        match &self.cur.value {
            Some(TokenValue::Ident(sym)) => sym.as_ref() == value,
            _ => false,
        }
    }

    fn cur_can_be_arrow_param(&self) -> bool {
        match self.cur.kind {
            TokenKind::Ident => true,
            TokenKind::Keyword(keyword) => self.keyword_can_be_ident(keyword),
            _ => false,
        }
    }

    fn at_async_function_start(&mut self) -> bool {
        if self.cur.kind != TokenKind::Ident || !self.cur_ident_is("async") {
            return false;
        }

        let next = self.peek_token();
        !next.had_line_break_before && next.kind == TokenKind::Keyword(Keyword::Function)
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

    fn is_jsx_tag_end_token(&self, kind: TokenKind) -> bool {
        matches!(
            kind,
            TokenKind::Gt
                | TokenKind::GtEq
                | TokenKind::GtGt
                | TokenKind::GtGtEq
                | TokenKind::GtGtGt
                | TokenKind::GtGtGtEq
        )
    }

    fn eat_jsx_tag_end(&mut self) -> PResult<()> {
        if self.cur.kind == TokenKind::Gt {
            self.bump();
            return Ok(());
        }

        let next = match self.cur.kind {
            TokenKind::GtEq => Some(TokenKind::Eq),
            TokenKind::GtGt => Some(TokenKind::Gt),
            TokenKind::GtGtEq => Some(TokenKind::GtEq),
            TokenKind::GtGtGt => Some(TokenKind::GtGt),
            TokenKind::GtGtGtEq => Some(TokenKind::GtGtEq),
            _ => None,
        };

        if let Some(next_kind) = next {
            self.cur.kind = next_kind;
            self.cur.value = None;
            return Ok(());
        }

        Err(self.expected(">"))
    }

    fn eat_ts_type_angle_close(&mut self) -> PResult<()> {
        if self.cur.kind == TokenKind::Gt {
            self.bump();
            return Ok(());
        }

        let next = match self.cur.kind {
            TokenKind::GtGt => Some(TokenKind::Gt),
            TokenKind::GtGtEq => Some(TokenKind::GtEq),
            TokenKind::GtGtGt => Some(TokenKind::GtGt),
            TokenKind::GtGtGtEq => Some(TokenKind::GtGtEq),
            _ => None,
        };

        if let Some(next_kind) = next {
            self.cur.kind = next_kind;
            self.cur.value = None;
            return Ok(());
        }

        Err(self.expected(">"))
    }

    fn can_follow_ts_instantiation_expr(&self) -> bool {
        matches!(
            self.cur.kind,
            TokenKind::Semi
                | TokenKind::Comma
                | TokenKind::Colon
                | TokenKind::RParen
                | TokenKind::RBracket
                | TokenKind::RBrace
                | TokenKind::Eof
                | TokenKind::Dot
                | TokenKind::QuestionDot
                | TokenKind::LBracket
                | TokenKind::Template
                | TokenKind::Keyword(Keyword::As)
        ) || self.cur_ident_is("satisfies")
    }

    fn jsx_text_atom_for_current(&self) -> Option<Atom> {
        if let Some(atom) = self.cur_name_atom() {
            return Some(atom);
        }

        let text = match self.cur.kind {
            TokenKind::Eq => "=",
            TokenKind::Gt => ">",
            TokenKind::Lt => "<",
            TokenKind::GtEq => ">=",
            TokenKind::LtEq => "<=",
            TokenKind::GtGt => ">>",
            TokenKind::GtGtEq => ">>=",
            TokenKind::GtGtGt => ">>>",
            TokenKind::GtGtGtEq => ">>>=",
            TokenKind::Plus => "+",
            TokenKind::Minus => "-",
            TokenKind::Star => "*",
            TokenKind::Slash => "/",
            TokenKind::Percent => "%",
            TokenKind::Amp => "&",
            TokenKind::Pipe => "|",
            TokenKind::Caret => "^",
            TokenKind::Bang => "!",
            TokenKind::Question => "?",
            TokenKind::Colon => ":",
            TokenKind::Semi => ";",
            TokenKind::Comma => ",",
            TokenKind::Dot => ".",
            TokenKind::DotDotDot => "...",
            TokenKind::LParen => "(",
            TokenKind::RParen => ")",
            TokenKind::LBracket => "[",
            TokenKind::RBracket => "]",
            _ => return None,
        };

        Some(Atom::new(text))
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
        if token.kind != TokenKind::Ident || token.flags.escaped {
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

    fn keyword_can_be_ident(&self, keyword: Keyword) -> bool {
        matches!(
            keyword,
            Keyword::Let
                | Keyword::Yield
                | Keyword::Await
                | Keyword::From
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
        ) && (keyword != Keyword::Let || !self.ctx.contains(Context::STRICT))
            && (keyword != Keyword::Yield || !self.ctx.contains(Context::IN_GENERATOR))
            && (keyword != Keyword::Await
                || (!self.ctx.contains(Context::IN_ASYNC) && !self.ctx.contains(Context::MODULE)))
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{input::StringInput, FileName, SourceMap};

    use super::*;
    #[cfg(feature = "typescript")]
    use crate::syntax::TsSyntax;
    use crate::syntax::{EsSyntax, Syntax};

    fn parse_program_with_syntax(
        src: &str,
        syntax: Syntax,
    ) -> (PResult<ParsedProgram>, Vec<Error>) {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(FileName::Custom("test.js".into()).into(), src.to_string());
        let lexer = Lexer::new(syntax, StringInput::from(&*fm), None);
        let mut parser = Parser::new_from(lexer);
        let program = parser.parse_program();
        let errors = parser.take_errors();
        (program, errors)
    }

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

    #[test]
    fn parses_using_identifier_in_for_of_heads() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Custom("using-for-of.js".into()).into(),
            "for (using of of); for (using o\\u0066 of of);",
        );

        let lexer = Lexer::new(
            Syntax::Es(EsSyntax {
                explicit_resource_management: true,
                ..Default::default()
            }),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let parsed = parser.parse_script().expect("script should parse");
        let program = parsed
            .store
            .program(parsed.program)
            .expect("program should exist");
        let errors = parser.take_errors();

        assert_eq!(program.body.len(), 2);
        assert!(errors.is_empty(), "unexpected recovered errors: {errors:?}");
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

    #[test]
    fn parses_with_statement() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Custom("with.js".into()).into(),
            "with (obj) doThing();",
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
        let Some(Stmt::With(with_stmt)) = parsed.store.stmt(program.body[0]) else {
            panic!("first statement should be with");
        };
        assert!(parsed.store.expr(with_stmt.obj).is_some());
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_typescript_declare_module_and_members() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Custom("declare.ts".into()).into(),
            "declare module A.B { interface Box { value: string; run(a: number): void; } }",
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
        let Some(Stmt::Decl(decl)) = parsed.store.stmt(program.body[0]) else {
            panic!("first statement should be declaration");
        };
        let Some(Decl::TsModule(module_decl)) = parsed.store.decl(*decl) else {
            panic!("first declaration should be ts module");
        };
        assert!(module_decl.declare);
        assert!(module_decl.body.is_some());
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_class_decorators_static_block_and_private_member() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(
            FileName::Custom("decorators.ts".into()).into(),
            "@sealed class A { @dec #x = 1; static { this.x = 1; } method(@p x: number) { return \
             this.#x; } }",
        );

        let lexer = Lexer::new(
            Syntax::Typescript(TsSyntax {
                decorators: true,
                ..Default::default()
            }),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let parsed = parser.parse_program().expect("typescript should parse");
        let program = parsed
            .store
            .program(parsed.program)
            .expect("program should exist");
        let Some(Stmt::Decl(decl)) = parsed.store.stmt(program.body[0]) else {
            panic!("first statement should be declaration");
        };
        let Some(Decl::Class(class_decl)) = parsed.store.decl(*decl) else {
            panic!("first declaration should be class");
        };
        let class = parsed
            .store
            .class(class_decl.class)
            .expect("class should exist");
        assert_eq!(class.decorators.len(), 1);
        assert!(class.body.iter().any(|member| matches!(
            parsed.store.class_member(*member),
            Some(swc_es_ast::ClassMember::StaticBlock(_))
        )));
    }

    #[test]
    fn enforces_decorators_before_export_option() {
        let (parsed, errors) = parse_program_with_syntax(
            "@dec export class A {}",
            Syntax::Es(EsSyntax {
                decorators: true,
                decorators_before_export: false,
                ..Default::default()
            }),
        );

        assert!(parsed.is_ok(), "parser should recover and produce module");
        assert!(
            errors.iter().any(|error| error
                .message()
                .contains("decorators before export are disabled")),
            "expected decorators-before-export option diagnostic, got: {errors:?}"
        );
    }

    #[test]
    fn supports_export_default_from_when_enabled() {
        let (parsed, errors) = parse_program_with_syntax(
            "export default from 'mod';",
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..Default::default()
            }),
        );

        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics: {errors:?}"
        );
        let parsed = parsed.expect("module should parse");
        let program = parsed
            .store
            .program(parsed.program)
            .expect("program should exist");
        let Some(Stmt::ModuleDecl(decl_id)) = parsed.store.stmt(program.body[0]) else {
            panic!("first statement should be module declaration");
        };
        let Some(ModuleDecl::ExportNamed(named)) = parsed.store.module_decl(*decl_id) else {
            panic!("first module declaration should be named export");
        };
        assert!(named.src.is_some(), "re-export source should exist");
        assert_eq!(named.specifiers.len(), 1);
        assert_eq!(named.specifiers[0].local.sym.as_ref(), "default");
    }

    #[test]
    fn allow_super_outside_method_option_controls_super_member_access() {
        let (disabled, _) = parse_program_with_syntax(
            "super.foo;",
            Syntax::Es(EsSyntax {
                allow_super_outside_method: false,
                ..Default::default()
            }),
        );
        assert!(
            disabled.is_err(),
            "super outside methods should be rejected"
        );

        let (enabled, errors) = parse_program_with_syntax(
            "super.foo;",
            Syntax::Es(EsSyntax {
                allow_super_outside_method: true,
                ..Default::default()
            }),
        );
        assert!(
            enabled.is_ok(),
            "super outside methods should parse if option is enabled"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn dts_option_allows_optional_non_identifier_parameter_patterns() {
        let src = "function f({ a }?) {}";

        let (_without_dts, errors_without_dts) =
            parse_program_with_syntax(src, Syntax::Typescript(TsSyntax::default()));
        assert!(
            errors_without_dts
                .iter()
                .any(|error| error.message().contains("optional marker")),
            "expected optional-marker diagnostic without dts mode"
        );

        let (with_dts, errors_with_dts) = parse_program_with_syntax(
            src,
            Syntax::Typescript(TsSyntax {
                dts: true,
                ..Default::default()
            }),
        );
        assert!(with_dts.is_ok(), "dts mode should still parse");
        assert!(
            errors_with_dts.is_empty(),
            "dts mode should allow optional marker without diagnostics: {errors_with_dts:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn disallow_ambiguous_jsx_like_option_reports_ambiguous_typescript_forms() {
        let src = "<T>(value: T) => value;";

        let (_parsed, errors) = parse_program_with_syntax(
            src,
            Syntax::Typescript(TsSyntax {
                disallow_ambiguous_jsx_like: true,
                ..Default::default()
            }),
        );
        assert!(
            errors.iter().any(|error| error
                .message()
                .contains("ambiguous TypeScript arrow type-parameter syntax")),
            "expected ambiguous-arrow diagnostic, got: {errors:?}"
        );
    }

    #[test]
    fn parses_regex_literals_used_in_benchmark_fixtures() {
        let (parsed, errors) = parse_program_with_syntax(
            "const a = /\\=[\\x20\\t\\r\\n\\f]*([^'\"\\]]*)[\\x20\\t\\r\\n\\f]*\\]/g; const b = \
             /OS ([^\\s]*)/; const c = /\\\\/g;",
            Syntax::Es(EsSyntax::default()),
        );

        assert!(parsed.is_ok(), "regex literals should parse");
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for regex literals: {errors:?}"
        );
    }

    #[test]
    fn accepts_unicode_escape_braces_in_unicode_regex_literals() {
        let (parsed, errors) = parse_program_with_syntax(
            "const a = /\\uD834\\uDF06\\u{1d306}/u; const b = /[\\u{61}-b]\\u{1ffff}/u;",
            Syntax::Es(EsSyntax::default()),
        );

        assert!(
            parsed.is_ok(),
            "unicode regex literals should parse: parsed={parsed:?}, errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for unicode regex literals: {errors:?}"
        );
    }

    #[test]
    fn parses_nested_object_pattern_initializer() {
        let (parsed, errors) = parse_program_with_syntax(
            "const { options = {}, range: { pos } } = change;",
            Syntax::Es(EsSyntax::default()),
        );

        assert!(parsed.is_ok(), "nested object pattern should parse");
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for nested object pattern: {errors:?}"
        );
    }

    #[test]
    fn parses_async_function_declarations_and_expressions() {
        let (parsed, errors) = parse_program_with_syntax(
            "async function load(value) { return value; } const run = async function (value) { \
             return value; };",
            Syntax::Es(EsSyntax::default()),
        );

        assert!(parsed.is_ok(), "async functions should parse");
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for async functions: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_typed_object_parameter_with_array_union_type() {
        let (parsed, errors) = parse_program_with_syntax(
            "function VariantsTable({ children }: { children: ReactElement<RowProps> | \
             ReactElement<RowProps>[]; }) {}",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(parsed.is_ok(), "typed object parameter should parse");
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for typed object parameter: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_async_arrow_with_typed_parameter_and_block_body() {
        let (parsed, errors) = parse_program_with_syntax(
            "const withAppDirSsg = <T extends Record<string, any>>(getStaticProps: \
             GetStaticProps<T>) => async (context: GetStaticPropsContext) => { const ssgResponse \
             = await getStaticProps(context); return ssgResponse; };",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "async arrow with typed parameter should parse: parsed={parsed:?}, errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for async arrow with typed parameter: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_typescript_generic_function_declarations_and_methods() {
        let (parsed, errors) = parse_program_with_syntax(
            "export function WithLayout<T extends Record<string, any>>({ value }: T) { return \
             value; } class Example { method<T>(value: T) { return value; } static<T>(value: T) { \
             return value; } } const obj = { method<T>(value: T) { return value; } };",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "generic function declarations and methods should parse: parsed={parsed:?}, \
             errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for generic function declarations and methods: \
             {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_async_generic_arrow_with_conditional_type_parameter() {
        let (parsed, errors) = parse_program_with_syntax(
            "const build = async <P extends \"P\" | \"L\">(p: P extends \"P\" ? PageProps : \
             LayoutProps) => { return p; };",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "async generic arrow with conditional type parameter should parse: parsed={parsed:?}, \
             errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for async generic arrow with conditional type \
             parameter: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_async_arrow_with_return_type_annotation() {
        let (parsed, errors) = parse_program_with_syntax(
            "const build = async (context: GetServerSidePropsContext): Promise<Result> => { \
             return load(context); };",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "async arrow with return type annotation should parse: parsed={parsed:?}, \
             errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for async arrow with return type annotation: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_typescript_instantiation_expressions() {
        let (parsed, errors) = parse_program_with_syntax(
            "const page = WithLayout({ getLayout })<\"L\">; const name = factory<string>.name;",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "TypeScript instantiation expressions should parse: parsed={parsed:?}, \
             errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for TypeScript instantiation expressions: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_type_only_named_imports() {
        let (parsed, errors) = parse_program_with_syntax(
            "import type { InputHTMLAttributes, ReactNode } from \"react\";",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "type-only named imports should parse: parsed={parsed:?}, errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for type-only named imports: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_jsx_opening_elements_with_type_arguments() {
        let (parsed, errors) = parse_program_with_syntax(
            "const el = <Select<LocationOption> name=\"location\" components={{ Option: () => \
             <Option /> }} />;",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "jsx opening elements with type arguments should parse: parsed={parsed:?}, \
             errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for jsx opening elements with type arguments: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_readonly_optional_type_members() {
        let (parsed, errors) = parse_program_with_syntax(
            "interface ICustomUsernameProps { readonly?: boolean; readonly value?: string; }",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "readonly optional type members should parse: parsed={parsed:?}, errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for readonly optional type members: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_typescript_heritage_clauses_with_type_arguments() {
        let (parsed, errors) = parse_program_with_syntax(
            "interface LinkIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> \
             {} class Button extends React.Component<Props> { static async getInitialProps(ctx: \
             DocumentContext) { return ctx; } }",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "TypeScript heritage clauses with type arguments should parse: parsed={parsed:?}, \
             errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for TypeScript heritage clauses with type arguments: \
             {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_typescript_unions_with_leading_pipes() {
        let (parsed, errors) = parse_program_with_syntax(
            "type ShouldHighlight = | { slug: string; shouldHighlight: true; } | { \
             shouldHighlight?: never; slug?: never; };",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "TypeScript unions with leading pipes should parse: parsed={parsed:?}, \
             errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for TypeScript unions with leading pipes: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_typescript_function_overload_signatures() {
        let (parsed, errors) = parse_program_with_syntax(
            "export function QueryCell<TData, TError extends ErrorLike>(opts: \
             QueryCellOptionsWithEmpty<TData, TError>): JSXElementOrNull; export function \
             QueryCell<TData, TError extends ErrorLike>(opts: QueryCellOptionsNoEmpty<TData, \
             TError>) { return opts as any; }",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "TypeScript function overload signatures should parse: parsed={parsed:?}, \
             errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for TypeScript function overload signatures: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_typescript_negative_numeric_literal_types() {
        let (parsed, errors) = parse_program_with_syntax(
            "async function moveEventType(index: number, increment: 1 | -1) { return index + \
             increment; }",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "TypeScript negative numeric literal types should parse: parsed={parsed:?}, \
             errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for TypeScript negative numeric literal types: \
             {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parses_arrow_with_typed_destructured_parameter_and_return_type() {
        let (parsed, errors) = parse_program_with_syntax(
            "export const EventTypeList = ({\n  group,\n  groupIndex,\n  readOnly,\n  types,\n  \
             bookerUrl,\n}: EventTypeListProps): JSX.Element => { return <div />; };",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "arrow with typed destructured parameter and return type should parse: \
             parsed={parsed:?}, errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for arrow with typed destructured parameter and return \
             type: {errors:?}"
        );
    }

    #[cfg(feature = "typescript")]
    #[test]
    fn parenthesized_jsx_in_conditional_expression_is_not_treated_as_arrow_parameters() {
        let (parsed, errors) = parse_program_with_syntax(
            "const render = () => { return ready ? (<div onClick={() => setOpen(true)} />) : \
             (<></>); };",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        );

        assert!(
            parsed.is_ok(),
            "parenthesized jsx conditional branches should parse: parsed={parsed:?}, \
             errors={errors:?}"
        );
        assert!(
            errors.is_empty(),
            "unexpected parse diagnostics for parenthesized jsx conditional branches: {errors:?}"
        );
    }
}
