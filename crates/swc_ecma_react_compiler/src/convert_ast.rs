// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

use std::cell::RefCell;

use react_compiler_ast::{
    common::{BaseNode, Comment, CommentData, Position, RawNode, SourceLocation},
    declarations::*,
    expressions::*,
    jsx::*,
    literals::*,
    operators::*,
    patterns::*,
    statements::*,
    File, InterpreterDirective, Program, SourceType,
};
use swc_common::{
    comments::{Comment as SwcComment, CommentKind, SingleThreadedComments},
    util::take::Take,
    Span, Spanned,
};
use swc_ecma_ast as swc;

use crate::preserved_ast::PreservedAst;

pub struct ConvertResult {
    pub file: File,
    pub preserved_ast: PreservedAst,
}

/// Converts an SWC AST to the React compiler's Babel-compatible AST.
pub fn convert_program(
    program: &swc::Program,
    source_text: &str,
    comments: Option<&SingleThreadedComments>,
) -> ConvertResult {
    let ctx = ConvertCtx::new(source_text);
    let comments = convert_swc_comments(&ctx, comments);
    let mut ctx = ctx.with_comments(comments);
    let file = ctx.convert_program(program);

    ConvertResult {
        file,
        preserved_ast: ctx.preserved_ast.into_inner(),
    }
}

struct ConvertCtx<'a> {
    source_text: &'a str,
    line_offsets: Vec<u32>,
    comments: Vec<Comment>,
    preserved_ast: RefCell<PreservedAst>,
}

impl<'a> ConvertCtx<'a> {
    fn new(source_text: &'a str) -> Self {
        let mut line_offsets = vec![0u32];
        for (i, ch) in source_text.char_indices() {
            let next = i + ch.len_utf8();
            if ch == '\n' {
                line_offsets.push(next as u32);
            }
        }
        Self {
            source_text,
            line_offsets,
            comments: Default::default(),
            preserved_ast: Default::default(),
        }
    }

    fn with_comments(mut self, comments: Vec<Comment>) -> Self {
        self.comments = comments;
        self
    }

    fn make_base_node(&self, span: Span) -> BaseNode {
        BaseNode {
            node_type: None,
            start: Some(span.lo.0),
            end: Some(span.hi.0),
            loc: Some(self.source_location(span)),
            range: None,
            extra: None,
            node_id: Some(span.lo.0),
            leading_comments: None,
            inner_comments: None,
            trailing_comments: None,
        }
    }

    /// Converts a SWC span to a Babel-compatible position.
    ///
    /// SWC `BytePos` values are byte offsets and 1-based. Base node offsets
    /// stay 1-based so scope keys can use `span.lo` directly, while `loc`
    /// follows Babel's 1-based lines and 0-based columns/indices.
    ///
    /// Assumption: the React Compiler does not receive the original source text
    /// from this bridge, so UTF-8 byte offsets are enough for `column` and
    /// `index`. If that changes, switch these offsets to UTF-16 code units.
    fn position(&self, offset: u32) -> Position {
        let offset = offset.saturating_sub(1).min(self.source_text.len() as u32);
        let line_idx = match self.line_offsets.binary_search(&offset) {
            Ok(idx) => idx,
            Err(idx) => idx.saturating_sub(1),
        };
        let line_start = self.line_offsets[line_idx];
        Position {
            line: line_idx as u32 + 1,
            column: offset - line_start,
            index: Some(offset),
        }
    }

    fn source_location(&self, span: Span) -> SourceLocation {
        SourceLocation {
            start: self.position(span.lo.0),
            end: self.position(span.hi.0),
            filename: None,
            identifier_name: None,
        }
    }

    fn convert_program(&mut self, program: &swc::Program) -> File {
        let root_span = match program {
            swc::Program::Module(module) => module.span,
            swc::Program::Script(script) => script.span,
        };
        let base = self.make_base_node(root_span);

        let (body, directives) = match program {
            swc::Program::Module(module) => {
                self.convert_module_item_list_with_directives(&module.body)
            }
            swc::Program::Script(script) => self.convert_stmt_list_with_directives(&script.body),
        };

        let source_type = match program {
            swc::Program::Module(_) => SourceType::Module,
            swc::Program::Script(_) => SourceType::Script,
        };
        let interpreter = match program {
            swc::Program::Module(module) => module.shebang.as_ref(),
            swc::Program::Script(script) => script.shebang.as_ref(),
        }
        .and_then(|shebang| {
            self.source_text.starts_with("#!").then(|| {
                let end = self
                    .source_text
                    .find('\n')
                    .unwrap_or(self.source_text.len()) as u32;
                let span = Span::new(swc_common::BytePos(1), swc_common::BytePos(1 + end));
                InterpreterDirective {
                    base: self.make_base_node(span),
                    value: shebang.to_string(),
                }
            })
        });

        File {
            base: self.make_base_node(root_span),
            program: Program {
                base,
                body,
                directives,
                source_type,
                interpreter,
                source_file: None,
            },
            comments: self.comments.take(),
            errors: vec![],
        }
    }

    fn convert_stmt_directive(&self, stmt: &swc::Stmt) -> Option<Directive> {
        if !stmt.can_precede_directive() {
            return None;
        }

        let swc::Stmt::Expr(expr_stmt) = stmt else {
            return None;
        };

        let swc::Expr::Lit(swc::Lit::Str(s)) = &*expr_stmt.expr else {
            return None;
        };

        self.preserved_ast.borrow_mut().save_directive(s);

        let value_start = s.span.lo.0 as usize;
        let value_end = s.span.hi.0.saturating_sub(2) as usize;

        Some(Directive {
            base: self.make_base_node(stmt.span()),
            value: DirectiveLiteral {
                base: self.make_base_node(s.span),
                value: self
                    .source_text
                    .get(value_start..value_end)
                    .map_or_else(|| wtf8_to_string(&s.value), str::to_string),
            },
        })
    }

    fn convert_stmt_list_with_directives(
        &self,
        stmts: &[swc::Stmt],
    ) -> (Vec<Statement>, Vec<Directive>) {
        let mut body = Vec::with_capacity(stmts.len());
        let mut directives = Vec::new();
        let mut past_directives = false;

        for stmt in stmts {
            if !past_directives {
                if let Some(dir) = self.convert_stmt_directive(stmt) {
                    directives.push(dir);
                    continue;
                }
                past_directives = true;
            }
            body.push(self.convert_stmt(stmt));
        }

        (body, directives)
    }

    fn convert_module_item_list_with_directives(
        &self,
        items: &[swc::ModuleItem],
    ) -> (Vec<Statement>, Vec<Directive>) {
        let mut body = Vec::with_capacity(items.len());
        let mut directives = Vec::new();
        let mut past_directives = false;

        for item in items {
            if !past_directives {
                let directive = match item {
                    swc::ModuleItem::Stmt(stmt) => self.convert_stmt_directive(stmt),
                    swc::ModuleItem::ModuleDecl(_) => None,
                };
                if let Some(dir) = directive {
                    directives.push(dir);
                    continue;
                }
                past_directives = true;
            }
            body.push(self.convert_module_item(item));
        }

        (body, directives)
    }

    // ===== Statements =====

    fn convert_module_item(&self, item: &swc::ModuleItem) -> Statement {
        match item {
            swc::ModuleItem::Stmt(stmt) => self.convert_stmt(stmt),
            swc::ModuleItem::ModuleDecl(decl) => self.convert_module_decl(decl),
        }
    }

    fn convert_module_decl(&self, decl: &swc::ModuleDecl) -> Statement {
        match decl {
            swc::ModuleDecl::Import(d) => Statement::ImportDeclaration(self.convert_import_decl(d)),
            swc::ModuleDecl::ExportDecl(d) => {
                Statement::ExportNamedDeclaration(self.convert_export_decl(d))
            }
            swc::ModuleDecl::ExportNamed(d) => {
                Statement::ExportNamedDeclaration(self.convert_named_export(d))
            }
            swc::ModuleDecl::ExportDefaultDecl(d) => {
                Statement::ExportDefaultDeclaration(self.convert_export_default_decl(d))
            }
            swc::ModuleDecl::ExportDefaultExpr(d) => {
                Statement::ExportDefaultDeclaration(self.convert_export_default_expr(d))
            }
            swc::ModuleDecl::ExportAll(d) => {
                Statement::ExportAllDeclaration(self.convert_export_all(d))
            }
            swc::ModuleDecl::TsImportEquals(d) => {
                self.preserved_ast.borrow_mut().save_ts_import_equals(d);
                Statement::TSModuleDeclaration(self.convert_ts_declaration_passthrough(
                    d.span,
                    false,
                    Some(self.convert_ident_json(&d.id)),
                ))
            }
            swc::ModuleDecl::TsExportAssignment(d) => {
                self.preserved_ast.borrow_mut().save_ts_export_assignment(d);
                Statement::TSModuleDeclaration(
                    self.convert_ts_declaration_passthrough(d.span, false, None),
                )
            }
            swc::ModuleDecl::TsNamespaceExport(d) => {
                self.preserved_ast.borrow_mut().save_ts_namespace_export(d);
                Statement::TSModuleDeclaration(self.convert_ts_declaration_passthrough(
                    d.span,
                    false,
                    Some(self.convert_ident_json(&d.id)),
                ))
            }
        }
    }

    fn convert_stmt(&self, stmt: &swc::Stmt) -> Statement {
        match stmt {
            swc::Stmt::Block(s) => Statement::BlockStatement(self.convert_block_stmt(s)),
            swc::Stmt::Break(s) => Statement::BreakStatement(self.convert_break_stmt(s)),
            swc::Stmt::Continue(s) => Statement::ContinueStatement(self.convert_continue_stmt(s)),
            swc::Stmt::Debugger(s) => Statement::DebuggerStatement(DebuggerStatement {
                base: self.make_base_node(s.span),
            }),
            swc::Stmt::DoWhile(s) => Statement::DoWhileStatement(self.convert_do_while_stmt(s)),
            swc::Stmt::Empty(s) => Statement::EmptyStatement(EmptyStatement {
                base: self.make_base_node(s.span),
            }),
            swc::Stmt::Expr(s) => Statement::ExpressionStatement(self.convert_expr_stmt(s)),
            swc::Stmt::ForIn(s) => Statement::ForInStatement(self.convert_for_in_stmt(s)),
            swc::Stmt::ForOf(s) => Statement::ForOfStatement(self.convert_for_of_stmt(s)),
            swc::Stmt::For(s) => Statement::ForStatement(self.convert_for_stmt(s)),
            swc::Stmt::If(s) => Statement::IfStatement(self.convert_if_stmt(s)),
            swc::Stmt::Labeled(s) => Statement::LabeledStatement(self.convert_labeled_stmt(s)),
            swc::Stmt::Return(s) => Statement::ReturnStatement(self.convert_return_stmt(s)),
            swc::Stmt::Switch(s) => Statement::SwitchStatement(self.convert_switch_stmt(s)),
            swc::Stmt::Throw(s) => Statement::ThrowStatement(self.convert_throw_stmt(s)),
            swc::Stmt::Try(s) => Statement::TryStatement(self.convert_try_stmt(s)),
            swc::Stmt::While(s) => Statement::WhileStatement(self.convert_while_stmt(s)),
            swc::Stmt::With(s) => Statement::WithStatement(self.convert_with_stmt(s)),
            swc::Stmt::Decl(d) => self.convert_decl_as_statement(d),
        }
    }

    fn convert_decl_as_statement(&self, decl: &swc::Decl) -> Statement {
        match self.convert_decl(decl) {
            Declaration::VariableDeclaration(d) => Statement::VariableDeclaration(d),
            Declaration::FunctionDeclaration(d) => Statement::FunctionDeclaration(d),
            Declaration::ClassDeclaration(d) => Statement::ClassDeclaration(d),
            Declaration::TSDeclareFunction(d) => Statement::TSDeclareFunction(d),
            Declaration::TSTypeAliasDeclaration(d) => Statement::TSTypeAliasDeclaration(d),
            Declaration::TSInterfaceDeclaration(d) => Statement::TSInterfaceDeclaration(d),
            Declaration::TSEnumDeclaration(d) => Statement::TSEnumDeclaration(d),
            Declaration::TSModuleDeclaration(d) => Statement::TSModuleDeclaration(d),
            Declaration::TypeAlias(_)
            | Declaration::OpaqueType(_)
            | Declaration::InterfaceDeclaration(_)
            | Declaration::EnumDeclaration(_) => {
                unreachable!("SWC declaration conversion does not produce Flow declarations")
            }
        }
    }

    fn convert_decl(&self, decl: &swc::Decl) -> Declaration {
        match decl {
            swc::Decl::Var(v) => Declaration::VariableDeclaration(self.convert_var_decl(v)),
            swc::Decl::Fn(f) => {
                if f.function.body.is_none() {
                    Declaration::TSDeclareFunction(self.convert_fn_decl_as_ts_declare_function(f))
                } else {
                    Declaration::FunctionDeclaration(self.convert_fn_decl(f))
                }
            }
            swc::Decl::Class(c) => Declaration::ClassDeclaration(self.convert_class_decl(c)),
            swc::Decl::TsTypeAlias(d) => {
                Declaration::TSTypeAliasDeclaration(self.convert_ts_type_alias_decl(d))
            }
            swc::Decl::TsInterface(d) => {
                Declaration::TSInterfaceDeclaration(self.convert_ts_interface_decl(d))
            }
            swc::Decl::TsEnum(d) => Declaration::TSEnumDeclaration(self.convert_ts_enum_decl(d)),
            swc::Decl::TsModule(d) => {
                Declaration::TSModuleDeclaration(self.convert_ts_module_decl(d))
            }
            swc::Decl::Using(u) => Declaration::VariableDeclaration(self.convert_using_decl(u)),
        }
    }

    fn convert_block_stmt(&self, block: &swc::BlockStmt) -> BlockStatement {
        let (body, directives) = self.convert_stmt_list_with_directives(&block.stmts);

        BlockStatement {
            base: self.make_base_node(block.span),
            body,
            directives,
        }
    }

    fn convert_return_stmt(&self, ret: &swc::ReturnStmt) -> ReturnStatement {
        ReturnStatement {
            base: self.make_base_node(ret.span),
            argument: ret.arg.as_ref().map(|a| Box::new(self.convert_expr(a))),
        }
    }

    fn convert_if_stmt(&self, if_stmt: &swc::IfStmt) -> IfStatement {
        IfStatement {
            base: self.make_base_node(if_stmt.span),
            test: Box::new(self.convert_expr(&if_stmt.test)),
            consequent: Box::new(self.convert_stmt(&if_stmt.cons)),
            alternate: if_stmt.alt.as_ref().map(|a| Box::new(self.convert_stmt(a))),
        }
    }

    fn convert_for_stmt(&self, for_stmt: &swc::ForStmt) -> ForStatement {
        ForStatement {
            base: self.make_base_node(for_stmt.span),
            init: for_stmt.init.as_ref().map(|i| {
                Box::new(match i {
                    swc::VarDeclOrExpr::VarDecl(v) => {
                        ForInit::VariableDeclaration(self.convert_var_decl(v))
                    }
                    swc::VarDeclOrExpr::Expr(e) => {
                        ForInit::Expression(Box::new(self.convert_expr(e)))
                    }
                })
            }),
            test: for_stmt
                .test
                .as_ref()
                .map(|t| Box::new(self.convert_expr(t))),
            update: for_stmt
                .update
                .as_ref()
                .map(|u| Box::new(self.convert_expr(u))),
            body: Box::new(self.convert_stmt(&for_stmt.body)),
        }
    }

    fn convert_while_stmt(&self, while_stmt: &swc::WhileStmt) -> WhileStatement {
        WhileStatement {
            base: self.make_base_node(while_stmt.span),
            test: Box::new(self.convert_expr(&while_stmt.test)),
            body: Box::new(self.convert_stmt(&while_stmt.body)),
        }
    }

    fn convert_do_while_stmt(&self, do_while: &swc::DoWhileStmt) -> DoWhileStatement {
        DoWhileStatement {
            base: self.make_base_node(do_while.span),
            test: Box::new(self.convert_expr(&do_while.test)),
            body: Box::new(self.convert_stmt(&do_while.body)),
        }
    }

    fn convert_for_in_stmt(&self, for_in: &swc::ForInStmt) -> ForInStatement {
        ForInStatement {
            base: self.make_base_node(for_in.span),
            left: Box::new(self.convert_for_head(&for_in.left)),
            right: Box::new(self.convert_expr(&for_in.right)),
            body: Box::new(self.convert_stmt(&for_in.body)),
        }
    }

    fn convert_for_of_stmt(&self, for_of: &swc::ForOfStmt) -> ForOfStatement {
        ForOfStatement {
            base: self.make_base_node(for_of.span),
            left: Box::new(self.convert_for_head(&for_of.left)),
            right: Box::new(self.convert_expr(&for_of.right)),
            body: Box::new(self.convert_stmt(&for_of.body)),
            is_await: for_of.is_await,
        }
    }

    fn convert_catch_clause(&self, clause: &swc::CatchClause) -> CatchClause {
        self.preserved_ast.borrow_mut().save_catch_clause(clause);

        CatchClause {
            base: self.make_base_node(clause.span),
            param: clause.param.as_ref().map(|p| self.convert_pat(p)),
            body: self.convert_block_stmt(&clause.body),
        }
    }

    fn convert_switch_stmt(&self, switch: &swc::SwitchStmt) -> SwitchStatement {
        SwitchStatement {
            base: self.make_base_node(switch.span),
            discriminant: Box::new(self.convert_expr(&switch.discriminant)),
            cases: switch
                .cases
                .iter()
                .map(|c| self.convert_switch_case(c))
                .collect(),
        }
    }

    fn convert_switch_case(&self, case: &swc::SwitchCase) -> SwitchCase {
        SwitchCase {
            base: self.make_base_node(case.span),
            test: case.test.as_ref().map(|t| Box::new(self.convert_expr(t))),
            consequent: case.cons.iter().map(|s| self.convert_stmt(s)).collect(),
        }
    }

    fn convert_throw_stmt(&self, throw: &swc::ThrowStmt) -> ThrowStatement {
        ThrowStatement {
            base: self.make_base_node(throw.span),
            argument: Box::new(self.convert_expr(&throw.arg)),
        }
    }

    fn convert_try_stmt(&self, try_stmt: &swc::TryStmt) -> TryStatement {
        TryStatement {
            base: self.make_base_node(try_stmt.span),
            block: self.convert_block_stmt(&try_stmt.block),
            handler: try_stmt
                .handler
                .as_ref()
                .map(|h| self.convert_catch_clause(h)),
            finalizer: try_stmt
                .finalizer
                .as_ref()
                .map(|f| self.convert_block_stmt(f)),
        }
    }

    fn convert_break_stmt(&self, brk: &swc::BreakStmt) -> BreakStatement {
        BreakStatement {
            base: self.make_base_node(brk.span),
            label: brk.label.as_ref().map(|l| self.convert_ident(l)),
        }
    }

    fn convert_continue_stmt(&self, cont: &swc::ContinueStmt) -> ContinueStatement {
        ContinueStatement {
            base: self.make_base_node(cont.span),
            label: cont.label.as_ref().map(|l| self.convert_ident(l)),
        }
    }

    fn convert_labeled_stmt(&self, labeled: &swc::LabeledStmt) -> LabeledStatement {
        LabeledStatement {
            base: self.make_base_node(labeled.span),
            label: self.convert_ident(&labeled.label),
            body: Box::new(self.convert_stmt(&labeled.body)),
        }
    }

    fn convert_expr_stmt(&self, expr_stmt: &swc::ExprStmt) -> ExpressionStatement {
        ExpressionStatement {
            base: self.make_base_node(expr_stmt.span),
            expression: Box::new(self.convert_expr(&expr_stmt.expr)),
        }
    }

    fn convert_with_stmt(&self, with: &swc::WithStmt) -> WithStatement {
        WithStatement {
            base: self.make_base_node(with.span),
            object: Box::new(self.convert_expr(&with.obj)),
            body: Box::new(self.convert_stmt(&with.body)),
        }
    }

    fn convert_for_head(&self, head: &swc::ForHead) -> ForInOfLeft {
        match head {
            swc::ForHead::VarDecl(v) => ForInOfLeft::VariableDeclaration(self.convert_var_decl(v)),
            swc::ForHead::Pat(p) => ForInOfLeft::Pattern(Box::new(self.convert_pat(p))),
            swc::ForHead::UsingDecl(u) => {
                ForInOfLeft::VariableDeclaration(self.convert_using_decl(u))
            }
        }
    }

    fn convert_var_decl(&self, decl: &swc::VarDecl) -> VariableDeclaration {
        self.preserved_ast.borrow_mut().save_var_decl(decl);

        VariableDeclaration {
            base: self.make_base_node(decl.span),
            declarations: decl
                .decls
                .iter()
                .map(|d| self.convert_var_declarator(d))
                .collect(),
            kind: match decl.kind {
                swc::VarDeclKind::Var => VariableDeclarationKind::Var,
                swc::VarDeclKind::Let => VariableDeclarationKind::Let,
                swc::VarDeclKind::Const => VariableDeclarationKind::Const,
            },
            declare: decl.declare.then_some(true),
        }
    }

    fn convert_using_decl(&self, decl: &swc::UsingDecl) -> VariableDeclaration {
        VariableDeclaration {
            base: self.make_base_node(decl.span),
            declarations: decl
                .decls
                .iter()
                .map(|d| self.convert_var_declarator(d))
                .collect(),
            kind: VariableDeclarationKind::Using,
            declare: None,
        }
    }

    fn convert_var_declarator(&self, d: &swc::VarDeclarator) -> VariableDeclarator {
        VariableDeclarator {
            base: self.make_base_node(d.span),
            id: self.convert_pat(&d.name),
            init: d.init.as_ref().map(|e| Box::new(self.convert_expr(e))),
            definite: d.definite.then_some(true),
        }
    }

    // ===== Expressions =====

    fn convert_expr(&self, expr: &swc::Expr) -> Expression {
        match expr {
            swc::Expr::Lit(lit) => match lit {
                swc::Lit::Str(s) => Expression::StringLiteral(StringLiteral {
                    base: self.make_base_node(s.span),
                    value: wtf8_to_string(&s.value).into(),
                }),
                swc::Lit::Bool(b) => Expression::BooleanLiteral(BooleanLiteral {
                    base: self.make_base_node(b.span),
                    value: b.value,
                }),
                swc::Lit::Null(n) => Expression::NullLiteral(NullLiteral {
                    base: self.make_base_node(n.span),
                }),
                swc::Lit::Num(n) => Expression::NumericLiteral(NumericLiteral {
                    base: self.make_base_node(n.span),
                    value: n.value,
                    extra: None,
                }),
                swc::Lit::BigInt(b) => Expression::BigIntLiteral(self.convert_big_int(b)),
                swc::Lit::Regex(r) => Expression::RegExpLiteral(RegExpLiteral {
                    base: self.make_base_node(r.span),
                    pattern: r.exp.to_string(),
                    flags: r.flags.to_string(),
                }),
                swc::Lit::JSXText(t) => Expression::StringLiteral(StringLiteral {
                    base: self.make_base_node(t.span),
                    value: decode_jsx_entities(t.value.as_ref()).into(),
                }),
            },
            swc::Expr::Ident(id) => Expression::Identifier(self.convert_ident(id)),
            swc::Expr::This(t) => Expression::ThisExpression(ThisExpression {
                base: self.make_base_node(t.span),
            }),
            swc::Expr::Array(arr) => Expression::ArrayExpression(self.convert_array_lit(arr)),
            swc::Expr::Object(obj) => Expression::ObjectExpression(self.convert_object_lit(obj)),
            swc::Expr::Fn(f) => Expression::FunctionExpression(self.convert_fn_expr(f)),
            swc::Expr::Unary(un) => Expression::UnaryExpression(self.convert_unary_expr(un)),
            swc::Expr::Update(up) => Expression::UpdateExpression(self.convert_update_expr(up)),
            swc::Expr::Bin(bin) => {
                if matches!(
                    bin.op,
                    swc::BinaryOp::LogicalOr
                        | swc::BinaryOp::LogicalAnd
                        | swc::BinaryOp::NullishCoalescing
                ) {
                    Expression::LogicalExpression(self.convert_bin_expr_as_logical(bin))
                } else if bin.op == swc::BinaryOp::In
                    && matches!(&*bin.left, swc::Expr::PrivateName(_))
                {
                    Expression::BinaryExpression(self.convert_bin_expr_as_private_in(bin))
                } else {
                    Expression::BinaryExpression(self.convert_bin_expr(bin))
                }
            }
            swc::Expr::Assign(a) => Expression::AssignmentExpression(self.convert_assign_expr(a)),
            swc::Expr::Member(m) => Expression::MemberExpression(self.convert_member_expr(m)),
            swc::Expr::SuperProp(sp) => {
                Expression::MemberExpression(self.convert_super_prop_expr(sp))
            }
            swc::Expr::Cond(c) => Expression::ConditionalExpression(self.convert_cond_expr(c)),
            swc::Expr::Call(call) => Expression::CallExpression(self.convert_call_expr(call)),
            swc::Expr::New(n) => Expression::NewExpression(self.convert_new_expr(n)),
            swc::Expr::Seq(seq) => Expression::SequenceExpression(self.convert_seq_expr(seq)),
            swc::Expr::Arrow(arrow) => {
                Expression::ArrowFunctionExpression(self.convert_arrow_expr(arrow))
            }
            swc::Expr::Class(class) => Expression::ClassExpression(self.convert_class_expr(class)),
            swc::Expr::Yield(y) => Expression::YieldExpression(self.convert_yield_expr(y)),
            swc::Expr::Await(a) => Expression::AwaitExpression(self.convert_await_expr(a)),
            swc::Expr::MetaProp(mp) => Expression::MetaProperty(self.convert_meta_prop_expr(mp)),
            swc::Expr::Tpl(tpl) => Expression::TemplateLiteral(self.convert_tpl(tpl)),
            swc::Expr::TaggedTpl(tag) => {
                Expression::TaggedTemplateExpression(self.convert_tagged_tpl(tag))
            }
            swc::Expr::Paren(p) => Expression::ParenthesizedExpression(self.convert_paren_expr(p)),
            swc::Expr::OptChain(chain) => self.convert_opt_chain_expr(chain),
            swc::Expr::PrivateName(p) => Expression::PrivateName(self.convert_private_name(p)),
            swc::Expr::JSXElement(el) => {
                Expression::JSXElement(Box::new(self.convert_jsx_element(el)))
            }
            swc::Expr::JSXFragment(frag) => {
                Expression::JSXFragment(self.convert_jsx_fragment(frag))
            }
            swc::Expr::JSXEmpty(e) => Expression::Identifier(Identifier {
                base: self.make_base_node(e.span),
                name: "undefined".to_string(),
                type_annotation: None,
                optional: None,
                decorators: None,
            }),
            swc::Expr::JSXMember(m) => Expression::Identifier(Identifier {
                base: self.make_base_node(m.prop.span),
                name: m.prop.sym.to_string(),
                type_annotation: None,
                optional: None,
                decorators: None,
            }),
            swc::Expr::JSXNamespacedName(n) => Expression::Identifier(Identifier {
                base: self.make_base_node(n.name.span),
                name: format!("{}:{}", n.ns.sym, n.name.sym),
                type_annotation: None,
                optional: None,
                decorators: None,
            }),
            swc::Expr::TsAs(e) => Expression::TSAsExpression(self.convert_ts_as_expr(e)),
            swc::Expr::TsSatisfies(e) => {
                Expression::TSSatisfiesExpression(self.convert_ts_satisfies_expr(e))
            }
            swc::Expr::TsTypeAssertion(e) => {
                Expression::TSTypeAssertion(self.convert_ts_type_assertion(e))
            }
            swc::Expr::TsNonNull(e) => {
                Expression::TSNonNullExpression(self.convert_ts_non_null_expr(e))
            }
            swc::Expr::TsInstantiation(e) => {
                Expression::TSInstantiationExpression(self.convert_ts_instantiation(e))
            }
            swc::Expr::TsConstAssertion(e) => {
                // "as const" → TSAsExpression with typeAnnotation: TSTypeReference { typeName:
                // Identifier { name: "const" } } This matches Babel's AST
                // representation of `as const`.
                let type_ann = serde_json::json!({
                    "type": "TSTypeReference",
                    "typeName": {
                        "type": "Identifier",
                        "name": "const"
                    }
                });
                Expression::TSAsExpression(TSAsExpression {
                    base: self.make_base_node(e.span),
                    expression: Box::new(self.convert_expr(&e.expr)),
                    type_annotation: RawNode::from_value(&type_ann),
                })
            }
            swc::Expr::Invalid(i) => {
                unreachable!("SWC invalid expressions should not be converted: {:?}", i)
            }
        }
    }

    // ===== Optional chaining =====

    fn convert_opt_chain_expr(&self, chain: &swc::OptChainExpr) -> Expression {
        match &*chain.base {
            swc::OptChainBase::Member(m) => {
                let (property, computed) = self.convert_member_prop(&m.prop);
                Expression::OptionalMemberExpression(OptionalMemberExpression {
                    base: self.make_base_node(chain.span),
                    object: Box::new(self.convert_expr_in_chain(&m.obj)),
                    property: Box::new(property),
                    computed,
                    optional: chain.optional,
                })
            }
            swc::OptChainBase::Call(call) => {
                self.preserved_ast
                    .borrow_mut()
                    .save_opt_call(chain.span, call);

                Expression::OptionalCallExpression(OptionalCallExpression {
                    base: self.make_base_node(chain.span),
                    callee: Box::new(self.convert_expr_in_chain(&call.callee)),
                    arguments: call
                        .args
                        .iter()
                        .map(|a| self.convert_expr_or_spread(a))
                        .collect(),
                    optional: chain.optional,
                    type_parameters: call
                        .type_args
                        .as_ref()
                        .map(|t| self.convert_ts_type_param_instantiation_json(t)),
                    type_arguments: None,
                })
            }
        }
    }

    fn convert_expr_in_chain(&self, expr: &swc::Expr) -> Expression {
        if Self::expr_contains_optional(expr) {
            if let swc::Expr::OptChain(chain) = expr {
                return self.convert_opt_chain_expr(chain);
            }
        }
        self.convert_expr(expr)
    }

    fn expr_contains_optional(expr: &swc::Expr) -> bool {
        matches!(expr, swc::Expr::OptChain(_))
    }

    fn convert_member_expr(&self, member: &swc::MemberExpr) -> MemberExpression {
        let (property, computed) = self.convert_member_prop(&member.prop);
        MemberExpression {
            base: self.make_base_node(member.span),
            object: Box::new(self.convert_expr(&member.obj)),
            property: Box::new(property),
            computed,
        }
    }

    fn convert_super_prop_expr(&self, super_prop: &swc::SuperPropExpr) -> MemberExpression {
        let (property, computed) = self.convert_super_prop(&super_prop.prop);
        MemberExpression {
            base: self.make_base_node(super_prop.span),
            object: Box::new(Expression::Super(Super {
                base: self.make_base_node(super_prop.obj.span),
            })),
            property: Box::new(property),
            computed,
        }
    }

    fn convert_member_prop(&self, prop: &swc::MemberProp) -> (Expression, bool) {
        match prop {
            swc::MemberProp::Ident(id) => {
                (Expression::Identifier(self.convert_ident_name(id)), false)
            }
            swc::MemberProp::Computed(c) => (self.convert_expr(&c.expr), true),
            swc::MemberProp::PrivateName(p) => {
                (Expression::PrivateName(self.convert_private_name(p)), false)
            }
        }
    }

    fn convert_super_prop(&self, prop: &swc::SuperProp) -> (Expression, bool) {
        match prop {
            swc::SuperProp::Ident(id) => {
                (Expression::Identifier(self.convert_ident_name(id)), false)
            }
            swc::SuperProp::Computed(c) => (self.convert_expr(&c.expr), true),
        }
    }

    fn convert_private_name(&self, private_name: &swc::PrivateName) -> PrivateName {
        PrivateName {
            base: self.make_base_node(private_name.span),
            id: Identifier {
                base: self.make_base_node(private_name.span),
                name: private_name.name.to_string(),
                type_annotation: None,
                optional: None,
                decorators: None,
            },
        }
    }

    // ===== Call expression =====

    fn convert_call_expr(&self, call: &swc::CallExpr) -> CallExpression {
        self.preserved_ast.borrow_mut().save_call(call);

        let callee = match &call.callee {
            swc::Callee::Expr(e) => self.convert_expr(e),
            swc::Callee::Super(s) => Expression::Super(Super {
                base: self.make_base_node(s.span),
            }),
            swc::Callee::Import(i) => Expression::Import(Import {
                base: self.make_base_node(i.span),
            }),
        };
        CallExpression {
            base: self.make_base_node(call.span),
            callee: Box::new(callee),
            arguments: call
                .args
                .iter()
                .map(|a| self.convert_expr_or_spread(a))
                .collect(),
            type_parameters: call
                .type_args
                .as_ref()
                .map(|t| self.convert_ts_type_param_instantiation_json(t)),
            type_arguments: None,
            optional: None,
        }
    }

    fn convert_expr_or_spread(&self, arg: &swc::ExprOrSpread) -> Expression {
        if let Some(spread_span) = arg.spread {
            Expression::SpreadElement(SpreadElement {
                base: self.make_base_node(Span::new(spread_span.lo, arg.expr.span().hi)),
                argument: Box::new(self.convert_expr(&arg.expr)),
            })
        } else {
            self.convert_expr(&arg.expr)
        }
    }

    fn convert_await_expr(&self, await_expr: &swc::AwaitExpr) -> AwaitExpression {
        AwaitExpression {
            base: self.make_base_node(await_expr.span),
            argument: Box::new(self.convert_expr(&await_expr.arg)),
        }
    }

    fn convert_bin_expr(&self, binary: &swc::BinExpr) -> BinaryExpression {
        BinaryExpression {
            base: self.make_base_node(binary.span),
            operator: self.convert_binary_op(binary.op),
            left: Box::new(self.convert_expr(&binary.left)),
            right: Box::new(self.convert_expr(&binary.right)),
        }
    }

    fn convert_bin_expr_as_private_in(&self, private_in: &swc::BinExpr) -> BinaryExpression {
        BinaryExpression {
            base: self.make_base_node(private_in.span),
            operator: BinaryOperator::In,
            left: Box::new(self.convert_expr(&private_in.left)),
            right: Box::new(self.convert_expr(&private_in.right)),
        }
    }

    fn convert_cond_expr(&self, cond: &swc::CondExpr) -> ConditionalExpression {
        ConditionalExpression {
            base: self.make_base_node(cond.span),
            test: Box::new(self.convert_expr(&cond.test)),
            consequent: Box::new(self.convert_expr(&cond.cons)),
            alternate: Box::new(self.convert_expr(&cond.alt)),
        }
    }

    fn convert_bin_expr_as_logical(&self, logical: &swc::BinExpr) -> LogicalExpression {
        LogicalExpression {
            base: self.make_base_node(logical.span),
            operator: self.convert_binary_op_as_logical_op(logical.op),
            left: Box::new(self.convert_expr(&logical.left)),
            right: Box::new(self.convert_expr(&logical.right)),
        }
    }

    fn convert_new_expr(&self, new: &swc::NewExpr) -> NewExpression {
        self.preserved_ast.borrow_mut().save_new(new);

        NewExpression {
            base: self.make_base_node(new.span),
            callee: Box::new(self.convert_expr(&new.callee)),
            arguments: new.args.as_ref().map_or_else(Vec::new, |args| {
                args.iter()
                    .map(|a| self.convert_expr_or_spread(a))
                    .collect()
            }),
            type_parameters: new
                .type_args
                .as_ref()
                .map(|t| self.convert_ts_type_param_instantiation_json(t)),
            type_arguments: None,
        }
    }

    fn convert_paren_expr(&self, paren: &swc::ParenExpr) -> ParenthesizedExpression {
        ParenthesizedExpression {
            base: self.make_base_node(paren.span),
            expression: Box::new(self.convert_expr(&paren.expr)),
        }
    }

    fn convert_seq_expr(&self, seq: &swc::SeqExpr) -> SequenceExpression {
        SequenceExpression {
            base: self.make_base_node(seq.span),
            expressions: seq.exprs.iter().map(|e| self.convert_expr(e)).collect(),
        }
    }

    fn convert_tagged_tpl(&self, tagged: &swc::TaggedTpl) -> TaggedTemplateExpression {
        self.preserved_ast.borrow_mut().save_tagged_tpl(tagged);

        TaggedTemplateExpression {
            base: self.make_base_node(tagged.span),
            tag: Box::new(self.convert_expr(&tagged.tag)),
            quasi: self.convert_tpl(&tagged.tpl),
            type_parameters: tagged
                .type_params
                .as_ref()
                .map(|t| self.convert_ts_type_param_instantiation_json(t)),
        }
    }

    fn convert_unary_expr(&self, unary: &swc::UnaryExpr) -> UnaryExpression {
        UnaryExpression {
            base: self.make_base_node(unary.span),
            operator: self.convert_unary_op(unary.op),
            prefix: true,
            argument: Box::new(self.convert_expr(&unary.arg)),
        }
    }

    fn convert_update_expr(&self, update: &swc::UpdateExpr) -> UpdateExpression {
        UpdateExpression {
            base: self.make_base_node(update.span),
            operator: self.convert_update_op(update.op),
            argument: Box::new(self.convert_expr_as_simple_assign_target(&update.arg)),
            prefix: update.prefix,
        }
    }

    fn convert_expr_as_simple_assign_target(&self, target: &swc::Expr) -> Expression {
        match target {
            swc::Expr::Ident(id) => Expression::Identifier(self.convert_ident(id)),
            swc::Expr::Member(m) => Expression::MemberExpression(self.convert_member_expr(m)),
            swc::Expr::SuperProp(sp) => {
                Expression::MemberExpression(self.convert_super_prop_expr(sp))
            }
            swc::Expr::TsAs(ts_as) => self.convert_expr(&ts_as.expr),
            swc::Expr::TsSatisfies(ts_sat) => self.convert_expr(&ts_sat.expr),
            swc::Expr::TsNonNull(ts_non_null) => self.convert_expr(&ts_non_null.expr),
            swc::Expr::TsTypeAssertion(ts_assert) => self.convert_expr(&ts_assert.expr),
            swc::Expr::TsInstantiation(ts_instantiation) => {
                self.convert_expr_as_simple_assign_target(&ts_instantiation.expr)
            }
            swc::Expr::Paren(paren) => self.convert_expr_as_simple_assign_target(&paren.expr),
            other => self.convert_expr(other),
        }
    }

    fn convert_yield_expr(&self, yield_expr: &swc::YieldExpr) -> YieldExpression {
        YieldExpression {
            base: self.make_base_node(yield_expr.span),
            argument: yield_expr
                .arg
                .as_ref()
                .map(|a| Box::new(self.convert_expr(a))),
            delegate: yield_expr.delegate,
        }
    }

    fn convert_prop_name_as_expression(&self, key: &swc::PropName) -> Expression {
        match key {
            swc::PropName::Computed(c) => self.convert_expr(&c.expr),
            _ => unreachable!("non-computed property key is handled directly"),
        }
    }

    fn convert_prop_name_computed(&self, key: &swc::PropName) -> bool {
        matches!(key, swc::PropName::Computed(_))
    }

    // ===== Function helpers =====

    fn convert_fn_decl(&self, func: &swc::FnDecl) -> FunctionDeclaration {
        let f = &func.function;
        self.preserved_ast.borrow_mut().save_function(f);

        FunctionDeclaration {
            base: self.make_base_node(f.span),
            id: Some(self.convert_ident(&func.ident)),
            params: self.convert_param_list(&f.params),
            body: self.convert_block_stmt_as_optional_function_body(f.body.as_ref(), f.span),
            generator: f.is_generator,
            is_async: f.is_async,
            declare: func.declare.then_some(true),
            return_type: f
                .return_type
                .as_ref()
                .map(|t| self.convert_ts_type_ann_json(t)),
            type_parameters: f.type_params.as_ref().map(|_| RawNode::null()),
            predicate: None,
            component_declaration: false,
            hook_declaration: false,
        }
    }

    fn convert_fn_decl_as_ts_declare_function(&self, func: &swc::FnDecl) -> TSDeclareFunction {
        let f = &func.function;
        self.preserved_ast.borrow_mut().save_function(f);

        TSDeclareFunction {
            base: self.make_base_node(f.span),
            id: Some(self.convert_ident(&func.ident)),
            params: self
                .convert_param_list(&f.params)
                .into_iter()
                .map(|param| {
                    RawNode::from_value(
                        &serde_json::to_value(param).unwrap_or(serde_json::Value::Null),
                    )
                })
                .collect(),
            is_async: f.is_async.then_some(true),
            declare: func.declare.then_some(true),
            generator: f.is_generator.then_some(true),
            return_type: f
                .return_type
                .as_ref()
                .map(|t| self.convert_ts_type_ann_json(t)),
            type_parameters: f.type_params.as_ref().map(|_| RawNode::null()),
        }
    }

    fn convert_fn_expr(&self, func: &swc::FnExpr) -> FunctionExpression {
        let f = &func.function;
        self.preserved_ast.borrow_mut().save_function(f);

        FunctionExpression {
            base: self.make_base_node(f.span),
            id: func.ident.as_ref().map(|id| self.convert_ident(id)),
            params: self.convert_param_list(&f.params),
            body: self.convert_block_stmt_as_optional_function_body(f.body.as_ref(), f.span),
            generator: f.is_generator,
            is_async: f.is_async,
            return_type: f
                .return_type
                .as_ref()
                .map(|t| self.convert_ts_type_ann_json(t)),
            type_parameters: f.type_params.as_ref().map(|_| RawNode::null()),
            predicate: None,
        }
    }

    fn convert_arrow_expr(&self, arrow: &swc::ArrowExpr) -> ArrowFunctionExpression {
        self.preserved_ast.borrow_mut().save_arrow(arrow);

        let is_expression = matches!(&*arrow.body, swc::BlockStmtOrExpr::Expr(_));
        let body = match &*arrow.body {
            swc::BlockStmtOrExpr::BlockStmt(block) => {
                ArrowFunctionBody::BlockStatement(self.convert_block_stmt(block))
            }
            swc::BlockStmtOrExpr::Expr(expr) => {
                ArrowFunctionBody::Expression(Box::new(self.convert_expr(expr)))
            }
        };
        ArrowFunctionExpression {
            base: self.make_base_node(arrow.span),
            params: arrow.params.iter().map(|p| self.convert_pat(p)).collect(),
            body: Box::new(body),
            id: None,
            generator: arrow.is_generator,
            is_async: arrow.is_async,
            expression: Some(is_expression),
            return_type: arrow
                .return_type
                .as_ref()
                .map(|t| self.convert_ts_type_ann_json(t)),
            type_parameters: arrow.type_params.as_ref().map(|_| RawNode::null()),
            predicate: None,
        }
    }

    fn convert_param_list(&self, params: &[swc::Param]) -> Vec<PatternLike> {
        params.iter().map(|p| self.convert_param(p)).collect()
    }

    fn convert_param(&self, param: &swc::Param) -> PatternLike {
        self.convert_pat(&param.pat)
    }

    fn convert_block_stmt_as_optional_function_body(
        &self,
        body: Option<&swc::BlockStmt>,
        span: Span,
    ) -> BlockStatement {
        body.map_or_else(
            || BlockStatement {
                base: self.make_base_node(span),
                body: vec![],
                directives: vec![],
            },
            |b| self.convert_block_stmt(b),
        )
    }

    // ===== Patterns =====

    fn convert_pat(&self, pat: &swc::Pat) -> PatternLike {
        match pat {
            swc::Pat::Ident(id) => {
                let mut pattern = PatternLike::Identifier(self.convert_ident(&id.id));
                if let Some(type_annotation) = &id.type_ann {
                    Self::set_pattern_type_annotation(
                        &mut pattern,
                        self.convert_ts_type_ann_json(type_annotation),
                    );
                }
                pattern
            }
            swc::Pat::Array(arr) => PatternLike::ArrayPattern(self.convert_array_pat(arr)),
            swc::Pat::Object(obj) => PatternLike::ObjectPattern(self.convert_object_pat(obj)),
            swc::Pat::Assign(a) => PatternLike::AssignmentPattern(self.convert_assign_pat(a)),
            swc::Pat::Rest(r) => PatternLike::RestElement(self.convert_rest_pat(r)),
            swc::Pat::Expr(e) => self.convert_expr_as_pat(e),
            swc::Pat::Invalid(invalid) => {
                unreachable!(
                    "SWC invalid patterns should not be converted: {:?}",
                    invalid
                )
            }
        }
    }

    fn convert_expr_as_pat(&self, expr: &swc::Expr) -> PatternLike {
        match expr {
            swc::Expr::Ident(id) => PatternLike::Identifier(self.convert_ident(id)),
            swc::Expr::Member(m) => PatternLike::MemberExpression(self.convert_member_expr(m)),
            swc::Expr::SuperProp(sp) => {
                PatternLike::MemberExpression(self.convert_super_prop_expr(sp))
            }
            swc::Expr::TsAs(e) => PatternLike::TSAsExpression(self.convert_ts_as_expr(e)),
            swc::Expr::TsSatisfies(e) => {
                PatternLike::TSSatisfiesExpression(self.convert_ts_satisfies_expr(e))
            }
            swc::Expr::TsNonNull(e) => {
                PatternLike::TSNonNullExpression(self.convert_ts_non_null_expr(e))
            }
            swc::Expr::TsTypeAssertion(e) => {
                PatternLike::TSTypeAssertion(self.convert_ts_type_assertion(e))
            }
            swc::Expr::TsInstantiation(e) => {
                // PatternLike has no TSInstantiation variant. SWC validates the
                // wrapped expression as the assignment target, so convert that target.
                self.convert_expr_as_pat(&e.expr)
            }
            swc::Expr::Paren(e) => self.convert_expr_as_pat(&e.expr),
            swc::Expr::Invalid(invalid) => {
                unreachable!(
                    "SWC invalid expressions should not be converted: {:?}",
                    invalid
                )
            }
            other => unreachable!(
                "Only certain expressions are valid patterns. Unexpected expression: {:?}",
                other
            ),
        }
    }

    fn convert_object_pat(&self, obj: &swc::ObjectPat) -> ObjectPattern {
        let properties = obj
            .props
            .iter()
            .map(|p| self.convert_object_pat_prop(p))
            .collect();
        ObjectPattern {
            base: self.make_base_node(obj.span),
            properties,
            type_annotation: obj
                .type_ann
                .as_ref()
                .map(|t| self.convert_ts_type_ann_json(t)),
            decorators: None,
        }
    }

    fn convert_object_pat_prop(&self, prop: &swc::ObjectPatProp) -> ObjectPatternProperty {
        match prop {
            swc::ObjectPatProp::KeyValue(kv) => {
                ObjectPatternProperty::ObjectProperty(ObjectPatternProp {
                    base: self.make_base_node(kv.span()),
                    key: Box::new(self.convert_prop_name(&kv.key)),
                    value: Box::new(self.convert_pat(&kv.value)),
                    computed: self.convert_prop_name_computed(&kv.key),
                    shorthand: false,
                    decorators: None,
                    method: None,
                })
            }
            swc::ObjectPatProp::Assign(a) => {
                let id = self.convert_ident(&a.key.id);
                let value = if let Some(ref init) = a.value {
                    Box::new(PatternLike::AssignmentPattern(AssignmentPattern {
                        base: self.make_base_node(a.span),
                        left: Box::new(PatternLike::Identifier(id.clone())),
                        right: Box::new(self.convert_expr(init)),
                        type_annotation: None,
                        decorators: None,
                    }))
                } else {
                    Box::new(PatternLike::Identifier(id.clone()))
                };
                ObjectPatternProperty::ObjectProperty(ObjectPatternProp {
                    base: self.make_base_node(a.span),
                    key: Box::new(Expression::Identifier(id)),
                    value,
                    computed: false,
                    shorthand: true,
                    decorators: None,
                    method: None,
                })
            }
            swc::ObjectPatProp::Rest(r) => {
                ObjectPatternProperty::RestElement(self.convert_rest_pat(r))
            }
        }
    }

    fn convert_array_pat(&self, arr: &swc::ArrayPat) -> ArrayPattern {
        ArrayPattern {
            base: self.make_base_node(arr.span),
            elements: arr
                .elems
                .iter()
                .map(|e| e.as_ref().map(|p| self.convert_pat(p)))
                .collect(),
            type_annotation: arr
                .type_ann
                .as_ref()
                .map(|t| self.convert_ts_type_ann_json(t)),
            decorators: None,
        }
    }

    fn convert_assign_pat(&self, assign: &swc::AssignPat) -> AssignmentPattern {
        AssignmentPattern {
            base: self.make_base_node(assign.span),
            left: Box::new(self.convert_pat(&assign.left)),
            right: Box::new(self.convert_expr(&assign.right)),
            type_annotation: None,
            decorators: None,
        }
    }

    fn convert_rest_pat(&self, rest: &swc::RestPat) -> RestElement {
        RestElement {
            base: self.make_base_node(rest.span),
            argument: Box::new(self.convert_pat(&rest.arg)),
            type_annotation: rest
                .type_ann
                .as_ref()
                .map(|t| self.convert_ts_type_ann_json(t)),
            decorators: None,
        }
    }

    fn set_pattern_type_annotation(pattern: &mut PatternLike, type_annotation: RawNode) {
        match pattern {
            PatternLike::Identifier(id) => {
                id.type_annotation = Some(type_annotation);
            }
            PatternLike::ObjectPattern(obj) => {
                obj.type_annotation = Some(type_annotation);
            }
            PatternLike::ArrayPattern(arr) => {
                arr.type_annotation = Some(type_annotation);
            }
            PatternLike::AssignmentPattern(assign) => {
                assign.type_annotation = Some(type_annotation);
            }
            PatternLike::RestElement(rest) => {
                rest.type_annotation = Some(type_annotation);
            }
            PatternLike::MemberExpression(_)
            | PatternLike::TSAsExpression(_)
            | PatternLike::TSSatisfiesExpression(_)
            | PatternLike::TSNonNullExpression(_)
            | PatternLike::TSTypeAssertion(_)
            | PatternLike::TypeCastExpression(_) => {}
        }
    }

    // ===== AssignTarget =====

    fn convert_assign_target(&self, target: &swc::AssignTarget) -> PatternLike {
        match target {
            swc::AssignTarget::Simple(swc::SimpleAssignTarget::Ident(id)) => {
                let mut ident = self.convert_ident(&id.id);
                ident.type_annotation = id
                    .type_ann
                    .as_ref()
                    .map(|ann| self.convert_ts_type_ann_json(ann));
                PatternLike::Identifier(ident)
            }
            swc::AssignTarget::Simple(swc::SimpleAssignTarget::Member(m)) => {
                PatternLike::MemberExpression(self.convert_member_expr(m))
            }
            swc::AssignTarget::Simple(swc::SimpleAssignTarget::SuperProp(sp)) => {
                PatternLike::MemberExpression(self.convert_super_prop_expr(sp))
            }
            swc::AssignTarget::Simple(swc::SimpleAssignTarget::Paren(p)) => {
                self.convert_expr_as_pat(&p.expr)
            }
            swc::AssignTarget::Simple(swc::SimpleAssignTarget::OptChain(_)) => {
                unreachable!("optional chaining is not a valid assignment target")
            }
            swc::AssignTarget::Simple(swc::SimpleAssignTarget::TsAs(e)) => {
                PatternLike::TSAsExpression(self.convert_ts_as_expr(e))
            }
            swc::AssignTarget::Simple(swc::SimpleAssignTarget::TsSatisfies(e)) => {
                PatternLike::TSSatisfiesExpression(self.convert_ts_satisfies_expr(e))
            }
            swc::AssignTarget::Simple(swc::SimpleAssignTarget::TsNonNull(e)) => {
                PatternLike::TSNonNullExpression(self.convert_ts_non_null_expr(e))
            }
            swc::AssignTarget::Simple(swc::SimpleAssignTarget::TsTypeAssertion(e)) => {
                PatternLike::TSTypeAssertion(self.convert_ts_type_assertion(e))
            }
            swc::AssignTarget::Simple(swc::SimpleAssignTarget::TsInstantiation(e)) => {
                // PatternLike cannot represent TSInstantiation directly. Preserve a
                // valid target by converting the wrapped expression, matching SWC's
                // assignment-target validation.
                self.convert_expr_as_pat(&e.expr)
            }
            swc::AssignTarget::Simple(swc::SimpleAssignTarget::Invalid(invalid)) => {
                unreachable!(
                    "SWC invalid assignment targets should not be converted: {:?}",
                    invalid
                )
            }
            swc::AssignTarget::Pat(swc::AssignTargetPat::Array(a)) => {
                self.convert_array_pat_as_assign_target(a)
            }
            swc::AssignTarget::Pat(swc::AssignTargetPat::Object(o)) => {
                PatternLike::ObjectPattern(self.convert_object_pat(o))
            }
            swc::AssignTarget::Pat(swc::AssignTargetPat::Invalid(invalid)) => {
                unreachable!(
                    "SWC invalid assignment targets should not be converted: {:?}",
                    invalid
                )
            }
        }
    }

    fn convert_array_pat_as_assign_target(&self, arr: &swc::ArrayPat) -> PatternLike {
        PatternLike::ArrayPattern(ArrayPattern {
            base: self.make_base_node(arr.span),
            elements: arr
                .elems
                .iter()
                .map(|e| {
                    e.as_ref().map(|p| match p {
                        swc::Pat::Assign(assign) => {
                            PatternLike::AssignmentPattern(self.convert_assign_pat(assign))
                        }
                        other => self.convert_pat_as_assign_target_maybe_default(other),
                    })
                })
                .collect(),
            type_annotation: arr
                .type_ann
                .as_ref()
                .map(|t| self.convert_ts_type_ann_json(t)),
            decorators: None,
        })
    }

    fn convert_pat_as_assign_target_maybe_default(&self, target: &swc::Pat) -> PatternLike {
        match target {
            swc::Pat::Assign(_) => unreachable!("handled separately"),
            other => self.convert_pat(other),
        }
    }

    fn convert_assign_expr(&self, assign: &swc::AssignExpr) -> AssignmentExpression {
        AssignmentExpression {
            base: self.make_base_node(assign.span),
            operator: self.convert_assign_op(assign.op),
            left: Box::new(self.convert_assign_target(&assign.left)),
            right: Box::new(self.convert_expr(&assign.right)),
        }
    }

    // ===== Object expression =====

    fn convert_object_lit(&self, obj: &swc::ObjectLit) -> ObjectExpression {
        ObjectExpression {
            base: self.make_base_node(obj.span),
            properties: obj
                .props
                .iter()
                .map(|p| self.convert_prop_or_spread(p))
                .collect(),
        }
    }

    fn convert_prop_or_spread(&self, prop: &swc::PropOrSpread) -> ObjectExpressionProperty {
        match prop {
            swc::PropOrSpread::Spread(s) => {
                ObjectExpressionProperty::SpreadElement(SpreadElement {
                    base: self.make_base_node(s.span()),
                    argument: Box::new(self.convert_expr(&s.expr)),
                })
            }
            swc::PropOrSpread::Prop(p) => match &**p {
                swc::Prop::Shorthand(id) => {
                    let ident = self.convert_ident(id);
                    ObjectExpressionProperty::ObjectProperty(ObjectProperty {
                        base: self.make_base_node(id.span),
                        key: Box::new(Expression::Identifier(ident.clone())),
                        value: Box::new(Expression::Identifier(ident)),
                        computed: false,
                        shorthand: true,
                        decorators: None,
                        method: Some(false),
                    })
                }
                swc::Prop::KeyValue(kv) => {
                    ObjectExpressionProperty::ObjectProperty(self.convert_key_value_prop(kv))
                }
                swc::Prop::Getter(g) => ObjectExpressionProperty::ObjectMethod(ObjectMethod {
                    base: self.make_base_node(g.span),
                    method: false,
                    kind: ObjectMethodKind::Get,
                    key: Box::new(self.convert_prop_name(&g.key)),
                    params: vec![],
                    body: self
                        .convert_block_stmt_as_optional_function_body(g.body.as_ref(), g.span),
                    computed: self.convert_prop_name_computed(&g.key),
                    id: None,
                    generator: false,
                    is_async: false,
                    decorators: None,
                    return_type: g
                        .type_ann
                        .as_ref()
                        .map(|t| self.convert_ts_type_ann_json(t)),
                    type_parameters: None,
                    predicate: None,
                }),
                swc::Prop::Setter(s) => ObjectExpressionProperty::ObjectMethod(ObjectMethod {
                    base: self.make_base_node(s.span),
                    method: false,
                    kind: ObjectMethodKind::Set,
                    key: Box::new(self.convert_prop_name(&s.key)),
                    params: vec![self.convert_pat(&s.param)],
                    body: self
                        .convert_block_stmt_as_optional_function_body(s.body.as_ref(), s.span),
                    computed: self.convert_prop_name_computed(&s.key),
                    id: None,
                    generator: false,
                    is_async: false,
                    decorators: None,
                    return_type: None,
                    type_parameters: None,
                    predicate: None,
                }),
                swc::Prop::Method(m) => {
                    self.preserved_ast.borrow_mut().save_function(&m.function);

                    ObjectExpressionProperty::ObjectMethod(ObjectMethod {
                        base: self.make_base_node(m.span()),
                        method: true,
                        kind: ObjectMethodKind::Method,
                        key: Box::new(self.convert_prop_name(&m.key)),
                        params: self.convert_param_list(&m.function.params),
                        body: self.convert_block_stmt_as_optional_function_body(
                            m.function.body.as_ref(),
                            m.function.span,
                        ),
                        computed: self.convert_prop_name_computed(&m.key),
                        id: None,
                        generator: m.function.is_generator,
                        is_async: m.function.is_async,
                        decorators: None,
                        return_type: m
                            .function
                            .return_type
                            .as_ref()
                            .map(|t| self.convert_ts_type_ann_json(t)),
                        type_parameters: m.function.type_params.as_ref().map(|_| RawNode::null()),
                        predicate: None,
                    })
                }
                swc::Prop::Assign(a) => {
                    let ident = self.convert_ident(&a.key);
                    ObjectExpressionProperty::ObjectProperty(ObjectProperty {
                        base: self.make_base_node(a.span),
                        key: Box::new(Expression::Identifier(ident.clone())),
                        value: Box::new(Expression::AssignmentExpression(AssignmentExpression {
                            base: self.make_base_node(a.span),
                            operator: AssignmentOperator::Assign,
                            left: Box::new(PatternLike::Identifier(ident)),
                            right: Box::new(self.convert_expr(&a.value)),
                        })),
                        computed: false,
                        shorthand: true,
                        decorators: None,
                        method: Some(false),
                    })
                }
            },
        }
    }

    fn convert_key_value_prop(&self, kv: &swc::KeyValueProp) -> ObjectProperty {
        ObjectProperty {
            base: self.make_base_node(kv.span()),
            key: Box::new(self.convert_prop_name(&kv.key)),
            value: Box::new(self.convert_expr(&kv.value)),
            computed: self.convert_prop_name_computed(&kv.key),
            shorthand: false,
            decorators: None,
            method: Some(false),
        }
    }

    fn convert_array_lit(&self, arr: &swc::ArrayLit) -> ArrayExpression {
        ArrayExpression {
            base: self.make_base_node(arr.span),
            elements: arr
                .elems
                .iter()
                .map(|e| {
                    e.as_ref().map(|elem| {
                        if elem.spread.is_some() {
                            self.convert_expr_or_spread(elem)
                        } else {
                            self.convert_expr(&elem.expr)
                        }
                    })
                })
                .collect(),
        }
    }

    fn convert_tpl(&self, tpl: &swc::Tpl) -> TemplateLiteral {
        TemplateLiteral {
            base: self.make_base_node(tpl.span),
            quasis: tpl
                .quasis
                .iter()
                .map(|q| self.convert_tpl_element(q))
                .collect(),
            expressions: tpl.exprs.iter().map(|e| self.convert_expr(e)).collect(),
        }
    }

    fn convert_tpl_element(&self, element: &swc::TplElement) -> TemplateElement {
        TemplateElement {
            base: self.make_base_node(element.span),
            value: TemplateElementValue {
                raw: element.raw.to_string(),
                cooked: element.cooked.as_ref().map(wtf8_to_string),
            },
            tail: element.tail,
        }
    }

    fn convert_meta_prop_expr(&self, meta: &swc::MetaPropExpr) -> MetaProperty {
        let (meta_name, prop_name) = match meta.kind {
            swc::MetaPropKind::NewTarget => ("new", "target"),
            swc::MetaPropKind::ImportMeta => ("import", "meta"),
        };
        MetaProperty {
            base: self.make_base_node(meta.span),
            meta: Identifier {
                base: self.make_base_node(meta.span),
                name: meta_name.to_string(),
                type_annotation: None,
                optional: None,
                decorators: None,
            },
            property: Identifier {
                base: self.make_base_node(meta.span),
                name: prop_name.to_string(),
                type_annotation: None,
                optional: None,
                decorators: None,
            },
        }
    }

    fn convert_ts_as_expr(&self, ts_as: &swc::TsAsExpr) -> TSAsExpression {
        self.preserved_ast.borrow_mut().save_ts_as_expr(ts_as);

        TSAsExpression {
            base: self.make_base_node(ts_as.span),
            expression: Box::new(self.convert_expr(&ts_as.expr)),
            type_annotation: self.convert_ts_type_json(&ts_as.type_ann),
        }
    }

    fn convert_ts_satisfies_expr(&self, ts_sat: &swc::TsSatisfiesExpr) -> TSSatisfiesExpression {
        self.preserved_ast
            .borrow_mut()
            .save_ts_satisfies_expr(ts_sat);

        TSSatisfiesExpression {
            base: self.make_base_node(ts_sat.span),
            expression: Box::new(self.convert_expr(&ts_sat.expr)),
            type_annotation: self.convert_ts_type_json(&ts_sat.type_ann),
        }
    }

    fn convert_ts_type_assertion(&self, ts_assert: &swc::TsTypeAssertion) -> TSTypeAssertion {
        self.preserved_ast
            .borrow_mut()
            .save_ts_type_assertion(ts_assert);

        TSTypeAssertion {
            base: self.make_base_node(ts_assert.span),
            expression: Box::new(self.convert_expr(&ts_assert.expr)),
            type_annotation: self.convert_ts_type_json(&ts_assert.type_ann),
        }
    }

    fn convert_ts_non_null_expr(&self, ts_non_null: &swc::TsNonNullExpr) -> TSNonNullExpression {
        TSNonNullExpression {
            base: self.make_base_node(ts_non_null.span),
            expression: Box::new(self.convert_expr(&ts_non_null.expr)),
        }
    }

    fn convert_ts_instantiation(
        &self,
        ts_instantiation: &swc::TsInstantiation,
    ) -> TSInstantiationExpression {
        self.preserved_ast
            .borrow_mut()
            .save_ts_instantiation(ts_instantiation);

        TSInstantiationExpression {
            base: self.make_base_node(ts_instantiation.span),
            expression: Box::new(self.convert_expr(&ts_instantiation.expr)),
            type_parameters: self
                .convert_ts_type_param_instantiation_json(&ts_instantiation.type_args),
        }
    }

    // ===== Class =====

    /// Builds `Null` placeholders for metadata arrays that are not lowered yet.
    fn convert_raw_node_null_placeholders(&self, len: usize) -> Option<Vec<RawNode>> {
        if len == 0 {
            None
        } else {
            Some(vec![RawNode::null(); len])
        }
    }

    fn convert_class_decl(&self, class: &swc::ClassDecl) -> ClassDeclaration {
        let c = &class.class;
        self.preserved_ast.borrow_mut().save_class(c);

        ClassDeclaration {
            base: self.make_base_node(c.span),
            id: Some(self.convert_ident(&class.ident)),
            super_class: c
                .super_class
                .as_ref()
                .map(|s| Box::new(self.convert_expr(s))),
            body: ClassBody {
                base: self.make_base_node(c.span),
                body: vec![],
            },
            decorators: self.convert_raw_node_null_placeholders(c.decorators.len()),
            is_abstract: c.is_abstract.then_some(true),
            declare: class.declare.then_some(true),
            implements: self.convert_raw_node_null_placeholders(c.implements.len()),
            super_type_parameters: c.super_type_params.as_ref().map(|_| RawNode::null()),
            type_parameters: c.type_params.as_ref().map(|_| RawNode::null()),
            mixins: None,
        }
    }

    fn convert_class_expr(&self, class: &swc::ClassExpr) -> ClassExpression {
        let c = &class.class;
        self.preserved_ast.borrow_mut().save_class(c);

        ClassExpression {
            base: self.make_base_node(c.span),
            id: class.ident.as_ref().map(|id| self.convert_ident(id)),
            super_class: c
                .super_class
                .as_ref()
                .map(|s| Box::new(self.convert_expr(s))),
            body: ClassBody {
                base: self.make_base_node(c.span),
                body: vec![],
            },
            decorators: self.convert_raw_node_null_placeholders(c.decorators.len()),
            implements: self.convert_raw_node_null_placeholders(c.implements.len()),
            super_type_parameters: c.super_type_params.as_ref().map(|_| RawNode::null()),
            type_parameters: c.type_params.as_ref().map(|_| RawNode::null()),
        }
    }

    fn convert_big_int(&self, lit: &swc::BigInt) -> BigIntLiteral {
        BigIntLiteral {
            base: self.make_base_node(lit.span),
            value: lit.value.to_string(),
        }
    }

    // ===== JSX =====

    fn convert_jsx_element(&self, el: &swc::JSXElement) -> JSXElement {
        let self_closing = el.closing.is_none();
        JSXElement {
            base: self.make_base_node(el.span),
            opening_element: self.convert_jsx_opening_element(&el.opening, self_closing),
            closing_element: el
                .closing
                .as_ref()
                .map(|c| self.convert_jsx_closing_element(c)),
            children: el
                .children
                .iter()
                .map(|c| self.convert_jsx_element_child(c))
                .collect(),
            self_closing: Some(self_closing),
        }
    }

    fn convert_jsx_opening_element(
        &self,
        el: &swc::JSXOpeningElement,
        self_closing: bool,
    ) -> JSXOpeningElement {
        self.preserved_ast.borrow_mut().save_jsx_opening_element(el);

        JSXOpeningElement {
            base: self.make_base_node(el.span),
            name: self.convert_jsx_element_name(&el.name),
            attributes: el
                .attrs
                .iter()
                .map(|a| self.convert_jsx_attr_or_spread(a))
                .collect(),
            self_closing,
            type_parameters: el.type_args.as_ref().map(|_| RawNode::null()),
        }
    }

    fn convert_jsx_closing_element(&self, el: &swc::JSXClosingElement) -> JSXClosingElement {
        JSXClosingElement {
            base: self.make_base_node(el.span),
            name: self.convert_jsx_element_name(&el.name),
        }
    }

    fn convert_jsx_element_name(&self, name: &swc::JSXElementName) -> JSXElementName {
        match name {
            swc::JSXElementName::Ident(id) => {
                JSXElementName::JSXIdentifier(self.make_jsx_identifier(id.span, id.sym.as_ref()))
            }
            swc::JSXElementName::JSXMemberExpr(m) => {
                JSXElementName::JSXMemberExpression(self.convert_jsx_member_expr(m))
            }
            swc::JSXElementName::JSXNamespacedName(ns) => {
                JSXElementName::JSXNamespacedName(self.convert_jsx_namespaced_name(ns))
            }
        }
    }

    fn convert_jsx_member_expr(&self, m: &swc::JSXMemberExpr) -> JSXMemberExpression {
        JSXMemberExpression {
            base: self.make_base_node(m.span()),
            object: Box::new(self.convert_jsx_object(&m.obj)),
            property: self.make_jsx_identifier(m.prop.span, m.prop.sym.as_ref()),
        }
    }

    fn convert_jsx_object(&self, obj: &swc::JSXObject) -> JSXMemberExprObject {
        match obj {
            swc::JSXObject::Ident(id) => JSXMemberExprObject::JSXIdentifier(
                self.make_jsx_identifier(id.span, id.sym.as_ref()),
            ),
            swc::JSXObject::JSXMemberExpr(m) => {
                JSXMemberExprObject::JSXMemberExpression(Box::new(self.convert_jsx_member_expr(m)))
            }
        }
    }

    fn convert_jsx_attr_or_spread(&self, attr: &swc::JSXAttrOrSpread) -> JSXAttributeItem {
        match attr {
            swc::JSXAttrOrSpread::JSXAttr(a) => {
                JSXAttributeItem::JSXAttribute(self.convert_jsx_attr(a))
            }
            swc::JSXAttrOrSpread::SpreadElement(s) => {
                JSXAttributeItem::JSXSpreadAttribute(JSXSpreadAttribute {
                    base: self.make_base_node(s.span()),
                    argument: Box::new(self.convert_expr(&s.expr)),
                })
            }
        }
    }

    fn convert_jsx_attr(&self, attr: &swc::JSXAttr) -> JSXAttribute {
        JSXAttribute {
            base: self.make_base_node(attr.span),
            name: self.convert_jsx_attr_name(&attr.name),
            value: attr.value.as_ref().map(|v| self.convert_jsx_attr_value(v)),
        }
    }

    fn convert_jsx_attr_name(&self, name: &swc::JSXAttrName) -> JSXAttributeName {
        match name {
            swc::JSXAttrName::Ident(id) => {
                JSXAttributeName::JSXIdentifier(self.make_jsx_identifier(id.span, id.sym.as_ref()))
            }
            swc::JSXAttrName::JSXNamespacedName(ns) => {
                JSXAttributeName::JSXNamespacedName(self.convert_jsx_namespaced_name(ns))
            }
        }
    }

    fn convert_jsx_namespaced_name(&self, ns: &swc::JSXNamespacedName) -> JSXNamespacedName {
        JSXNamespacedName {
            base: self.make_base_node(ns.span()),
            namespace: self.make_jsx_identifier(ns.ns.span, ns.ns.sym.as_ref()),
            name: self.make_jsx_identifier(ns.name.span, ns.name.sym.as_ref()),
        }
    }

    fn convert_jsx_attr_value(&self, value: &swc::JSXAttrValue) -> JSXAttributeValue {
        match value {
            swc::JSXAttrValue::Str(s) => JSXAttributeValue::StringLiteral(StringLiteral {
                base: self.make_base_node(s.span),
                value: decode_jsx_entities(&s.value.to_string_lossy()).into(),
            }),
            swc::JSXAttrValue::JSXExprContainer(ec) => {
                JSXAttributeValue::JSXExpressionContainer(self.convert_jsx_expr_container(ec))
            }
            swc::JSXAttrValue::JSXElement(el) => {
                JSXAttributeValue::JSXElement(Box::new(self.convert_jsx_element(el)))
            }
            swc::JSXAttrValue::JSXFragment(frag) => {
                JSXAttributeValue::JSXFragment(self.convert_jsx_fragment(frag))
            }
        }
    }

    fn convert_jsx_expr_container(&self, ec: &swc::JSXExprContainer) -> JSXExpressionContainer {
        JSXExpressionContainer {
            base: self.make_base_node(ec.span),
            expression: match &ec.expr {
                swc::JSXExpr::JSXEmptyExpr(e) => {
                    JSXExpressionContainerExpr::JSXEmptyExpression(JSXEmptyExpression {
                        base: self.make_base_node(e.span),
                    })
                }
                swc::JSXExpr::Expr(e) => {
                    JSXExpressionContainerExpr::Expression(Box::new(self.convert_expr(e)))
                }
            },
        }
    }

    fn convert_jsx_element_child(&self, child: &swc::JSXElementChild) -> JSXChild {
        match child {
            swc::JSXElementChild::JSXText(t) => JSXChild::JSXText(JSXText {
                base: self.make_base_node(t.span),
                // SWC stores the Babel-compatible decoded JSX text value here.
                // Future parser refactors must preserve that decoded value contract.
                value: decode_jsx_entities(t.value.as_ref()),
            }),
            swc::JSXElementChild::JSXExprContainer(ec) => {
                JSXChild::JSXExpressionContainer(self.convert_jsx_expr_container(ec))
            }
            swc::JSXElementChild::JSXSpreadChild(s) => JSXChild::JSXSpreadChild(JSXSpreadChild {
                base: self.make_base_node(s.span),
                expression: Box::new(self.convert_expr(&s.expr)),
            }),
            swc::JSXElementChild::JSXElement(el) => {
                JSXChild::JSXElement(Box::new(self.convert_jsx_element(el)))
            }
            swc::JSXElementChild::JSXFragment(frag) => {
                JSXChild::JSXFragment(self.convert_jsx_fragment(frag))
            }
        }
    }

    fn convert_jsx_fragment(&self, frag: &swc::JSXFragment) -> JSXFragment {
        JSXFragment {
            base: self.make_base_node(frag.span),
            opening_fragment: JSXOpeningFragment {
                base: self.make_base_node(frag.opening.span),
            },
            closing_fragment: JSXClosingFragment {
                base: self.make_base_node(frag.closing.span),
            },
            children: frag
                .children
                .iter()
                .map(|c| self.convert_jsx_element_child(c))
                .collect(),
        }
    }

    fn make_jsx_identifier(&self, span: Span, name: &str) -> JSXIdentifier {
        JSXIdentifier {
            base: self.make_base_node(span),
            name: name.to_string(),
        }
    }

    // ===== Import/Export =====

    fn convert_import_decl(&self, decl: &swc::ImportDecl) -> ImportDeclaration {
        self.preserved_ast.borrow_mut().save_import(decl);

        ImportDeclaration {
            base: self.make_base_node(decl.span),
            specifiers: decl
                .specifiers
                .iter()
                .map(|s| self.convert_import_specifier(s))
                .collect(),
            source: StringLiteral {
                base: self.make_base_node(decl.src.span),
                value: wtf8_to_string(&decl.src.value).into(),
            },
            import_kind: decl.type_only.then_some(ImportKind::Type),
            assertions: None,
            attributes: self.convert_import_attributes(decl.with.as_deref()),
        }
    }

    fn convert_import_attributes(
        &self,
        with: Option<&swc::ObjectLit>,
    ) -> Option<Vec<ImportAttribute>> {
        with.and_then(swc::ObjectLit::as_import_with).map(|with| {
            with.values
                .iter()
                .map(|attr| self.convert_import_with_item(attr))
                .collect()
        })
    }

    fn convert_import_with_item(&self, attr: &swc::ImportWithItem) -> ImportAttribute {
        ImportAttribute {
            base: self.make_base_node(attr.key.span.to(attr.value.span)),
            key: self.convert_ident_name(&attr.key),
            value: StringLiteral {
                base: self.make_base_node(attr.value.span),
                value: wtf8_to_string(&attr.value.value).into(),
            },
        }
    }

    fn convert_import_specifier(&self, spec: &swc::ImportSpecifier) -> ImportSpecifier {
        match spec {
            swc::ImportSpecifier::Named(s) => {
                let local = self.convert_ident(&s.local);
                let imported = s.imported.as_ref().map_or_else(
                    || ModuleExportName::Identifier(local.clone()),
                    |i| self.convert_module_export_name(i),
                );
                ImportSpecifier::ImportSpecifier(ImportSpecifierData {
                    base: self.make_base_node(s.span),
                    local,
                    imported,
                    import_kind: s.is_type_only.then_some(ImportKind::Type),
                })
            }
            swc::ImportSpecifier::Default(s) => {
                ImportSpecifier::ImportDefaultSpecifier(ImportDefaultSpecifierData {
                    base: self.make_base_node(s.span),
                    local: self.convert_ident(&s.local),
                })
            }
            swc::ImportSpecifier::Namespace(s) => {
                ImportSpecifier::ImportNamespaceSpecifier(ImportNamespaceSpecifierData {
                    base: self.make_base_node(s.span),
                    local: self.convert_ident(&s.local),
                })
            }
        }
    }

    fn convert_export_decl(&self, decl: &swc::ExportDecl) -> ExportNamedDeclaration {
        let declaration = self.convert_decl(&decl.decl);

        let is_type = match &decl.decl {
            swc_ecma_ast::Decl::Class(class_decl) => class_decl.declare,
            swc_ecma_ast::Decl::Fn(fn_decl) => fn_decl.declare,
            swc_ecma_ast::Decl::Var(var_decl) => var_decl.declare,
            swc_ecma_ast::Decl::Using(..) => false,
            swc_ecma_ast::Decl::TsInterface(..) => true,
            swc_ecma_ast::Decl::TsTypeAlias(..) => true,
            swc_ecma_ast::Decl::TsEnum(ts_enum_decl) => ts_enum_decl.declare,
            swc_ecma_ast::Decl::TsModule(ts_module_decl) => ts_module_decl.declare,
        };

        ExportNamedDeclaration {
            base: self.make_base_node(decl.span),
            declaration: Some(Box::new(declaration)),
            specifiers: vec![],
            source: None,
            export_kind: is_type.then_some(ExportKind::Type),
            assertions: None,
            attributes: None,
        }
    }

    fn convert_named_export(&self, decl: &swc::NamedExport) -> ExportNamedDeclaration {
        ExportNamedDeclaration {
            base: self.make_base_node(decl.span),
            declaration: None,
            specifiers: decl
                .specifiers
                .iter()
                .map(|s| self.convert_export_specifier(s))
                .collect(),
            source: decl.src.as_ref().map(|s| StringLiteral {
                base: self.make_base_node(s.span),
                value: s.value.to_string_lossy().into_owned().into(),
            }),
            export_kind: Some(if decl.type_only {
                ExportKind::Type
            } else {
                ExportKind::Value
            }),
            assertions: None,
            attributes: self.convert_import_attributes(decl.with.as_deref()),
        }
    }

    fn convert_export_default_decl(
        &self,
        decl: &swc::ExportDefaultDecl,
    ) -> ExportDefaultDeclaration {
        let declaration = match &decl.decl {
            swc::DefaultDecl::Fn(f) => {
                let func = &f.function;
                self.preserved_ast.borrow_mut().save_function(func);

                ExportDefaultDecl::FunctionDeclaration(FunctionDeclaration {
                    base: self.make_base_node(func.span),
                    id: f.ident.as_ref().map(|id| self.convert_ident(id)),
                    params: self.convert_param_list(&func.params),
                    body: self.convert_block_stmt_as_optional_function_body(
                        func.body.as_ref(),
                        func.span,
                    ),
                    generator: func.is_generator,
                    is_async: func.is_async,
                    declare: None,
                    return_type: func
                        .return_type
                        .as_ref()
                        .map(|t| self.convert_ts_type_ann_json(t)),
                    type_parameters: func.type_params.as_ref().map(|_| RawNode::null()),
                    predicate: None,
                    component_declaration: false,
                    hook_declaration: false,
                })
            }
            swc::DefaultDecl::Class(c) => {
                let class = &c.class;
                self.preserved_ast.borrow_mut().save_class(class);

                ExportDefaultDecl::ClassDeclaration(ClassDeclaration {
                    base: self.make_base_node(class.span),
                    id: c.ident.as_ref().map(|id| self.convert_ident(id)),
                    super_class: class
                        .super_class
                        .as_ref()
                        .map(|s| Box::new(self.convert_expr(s))),
                    body: ClassBody {
                        base: self.make_base_node(class.span),
                        body: vec![],
                    },
                    decorators: self.convert_raw_node_null_placeholders(class.decorators.len()),
                    is_abstract: class.is_abstract.then_some(true),
                    declare: None,
                    implements: self.convert_raw_node_null_placeholders(class.implements.len()),
                    super_type_parameters: class
                        .super_type_params
                        .as_ref()
                        .map(|_| RawNode::null()),
                    type_parameters: class.type_params.as_ref().map(|_| RawNode::null()),
                    mixins: None,
                })
            }
            swc::DefaultDecl::TsInterfaceDecl(interface) => {
                self.preserved_ast
                    .borrow_mut()
                    .save_export_default_ts_interface(decl.span, interface);
                ExportDefaultDecl::Expression(Box::new(Expression::NullLiteral(NullLiteral {
                    base: self.make_base_node(decl.span),
                })))
            }
        };
        ExportDefaultDeclaration {
            base: self.make_base_node(decl.span),
            declaration: Box::new(declaration),
            export_kind: None,
        }
    }

    fn convert_export_default_expr(&self, d: &swc::ExportDefaultExpr) -> ExportDefaultDeclaration {
        ExportDefaultDeclaration {
            base: self.make_base_node(d.span),
            declaration: Box::new(ExportDefaultDecl::Expression(Box::new(
                self.convert_expr(&d.expr),
            ))),
            export_kind: None,
        }
    }

    fn convert_export_all(&self, decl: &swc::ExportAll) -> ExportAllDeclaration {
        ExportAllDeclaration {
            base: self.make_base_node(decl.span),
            source: StringLiteral {
                base: self.make_base_node(decl.src.span),
                value: decl.src.value.to_string_lossy().into_owned().into(),
            },
            export_kind: Some(if decl.type_only {
                ExportKind::Type
            } else {
                ExportKind::Value
            }),
            assertions: None,
            attributes: self.convert_import_attributes(decl.with.as_deref()),
        }
    }

    fn convert_export_specifier(&self, spec: &swc::ExportSpecifier) -> ExportSpecifier {
        match spec {
            swc::ExportSpecifier::Named(s) => {
                let local = self.convert_module_export_name(&s.orig);
                let exported = s
                    .exported
                    .as_ref()
                    .map_or_else(|| local.clone(), |e| self.convert_module_export_name(e));
                ExportSpecifier::ExportSpecifier(ExportSpecifierData {
                    base: self.make_base_node(s.span),
                    local,
                    exported,
                    export_kind: Some(if s.is_type_only {
                        ExportKind::Type
                    } else {
                        ExportKind::Value
                    }),
                })
            }
            swc::ExportSpecifier::Default(s) => {
                ExportSpecifier::ExportDefaultSpecifier(ExportDefaultSpecifierData {
                    base: self.make_base_node(s.exported.span),
                    exported: self.convert_ident(&s.exported),
                })
            }
            swc::ExportSpecifier::Namespace(s) => {
                ExportSpecifier::ExportNamespaceSpecifier(ExportNamespaceSpecifierData {
                    base: self.make_base_node(s.span),
                    exported: self.convert_module_export_name(&s.name),
                })
            }
        }
    }

    fn convert_module_export_name(&self, name: &swc::ModuleExportName) -> ModuleExportName {
        match name {
            swc::ModuleExportName::Ident(id) => {
                ModuleExportName::Identifier(self.convert_ident(id))
            }
            swc::ModuleExportName::Str(s) => ModuleExportName::StringLiteral(StringLiteral {
                base: self.make_base_node(s.span),
                value: wtf8_to_string(&s.value).into(),
            }),
        }
    }

    // ===== TS declarations =====

    fn make_typed_json_base(
        &self,
        type_name: &str,
        span: Span,
    ) -> serde_json::Map<String, serde_json::Value> {
        let mut obj = serde_json::Map::new();
        let base = self.make_base_node(span);
        obj.insert(
            "type".to_string(),
            serde_json::Value::String(type_name.to_string()),
        );
        obj.insert(
            "start".to_string(),
            serde_json::Value::from(base.start.unwrap_or_default()),
        );
        obj.insert(
            "end".to_string(),
            serde_json::Value::from(base.end.unwrap_or_default()),
        );
        obj.insert(
            "loc".to_string(),
            serde_json::to_value(base.loc).unwrap_or(serde_json::Value::Null),
        );
        obj.insert(
            "_nodeId".to_string(),
            serde_json::Value::from(base.node_id.unwrap_or_default()),
        );
        obj
    }

    fn convert_ts_type_ann_json(&self, type_annotation: &swc::TsTypeAnn) -> RawNode {
        let mut obj = self.make_typed_json_base("TSTypeAnnotation", type_annotation.span);
        obj.insert(
            "typeAnnotation".to_string(),
            self.convert_ts_type_json_value(&type_annotation.type_ann),
        );
        RawNode::from_value(&serde_json::Value::Object(obj))
    }

    fn convert_ts_type_param_instantiation_json(
        &self,
        type_arguments: &swc::TsTypeParamInstantiation,
    ) -> RawNode {
        RawNode::from_value(&self.convert_ts_type_param_instantiation_json_value(type_arguments))
    }

    fn convert_ts_type_param_instantiation_json_value(
        &self,
        type_arguments: &swc::TsTypeParamInstantiation,
    ) -> serde_json::Value {
        let mut obj =
            self.make_typed_json_base("TSTypeParameterInstantiation", type_arguments.span);
        obj.insert(
            "params".to_string(),
            serde_json::Value::Array(
                type_arguments
                    .params
                    .iter()
                    .map(|ty| self.convert_ts_type_json_value(ty))
                    .collect(),
            ),
        );
        serde_json::Value::Object(obj)
    }

    fn convert_ts_type_json(&self, ty: &swc::TsType) -> RawNode {
        RawNode::from_value(&self.convert_ts_type_json_value(ty))
    }

    fn convert_ts_type_json_value(&self, ty: &swc::TsType) -> serde_json::Value {
        let type_name = match ty {
            swc::TsType::TsKeywordType(keyword) => match keyword.kind {
                swc::TsKeywordTypeKind::TsAnyKeyword => "TSAnyKeyword",
                swc::TsKeywordTypeKind::TsBigIntKeyword => "TSBigIntKeyword",
                swc::TsKeywordTypeKind::TsBooleanKeyword => "TSBooleanKeyword",
                swc::TsKeywordTypeKind::TsIntrinsicKeyword => "TSIntrinsicKeyword",
                swc::TsKeywordTypeKind::TsNeverKeyword => "TSNeverKeyword",
                swc::TsKeywordTypeKind::TsNullKeyword => "TSNullKeyword",
                swc::TsKeywordTypeKind::TsNumberKeyword => "TSNumberKeyword",
                swc::TsKeywordTypeKind::TsObjectKeyword => "TSObjectKeyword",
                swc::TsKeywordTypeKind::TsStringKeyword => "TSStringKeyword",
                swc::TsKeywordTypeKind::TsSymbolKeyword => "TSSymbolKeyword",
                swc::TsKeywordTypeKind::TsUndefinedKeyword => "TSUndefinedKeyword",
                swc::TsKeywordTypeKind::TsUnknownKeyword => "TSUnknownKeyword",
                swc::TsKeywordTypeKind::TsVoidKeyword => "TSVoidKeyword",
            },
            swc::TsType::TsThisType(_) => "TSThisType",
            swc::TsType::TsArrayType(_) => "TSArrayType",
            swc::TsType::TsUnionOrIntersectionType(union) => match union {
                swc::TsUnionOrIntersectionType::TsUnionType(_) => "TSUnionType",
                swc::TsUnionOrIntersectionType::TsIntersectionType(_) => "TSIntersectionType",
            },
            swc::TsType::TsParenthesizedType(_) => "TSParenthesizedType",
            swc::TsType::TsLitType(_) => "TSLiteralType",
            swc::TsType::TsTypeRef(_) => "TSTypeReference",
            swc::TsType::TsTypeOperator(_) => "TSTypeOperator",
            swc::TsType::TsTupleType(_) => "TSTupleType",
            swc::TsType::TsTypeLit(_) => "TSTypeLiteral",
            swc::TsType::TsTypeQuery(_) => "TSTypeQuery",
            swc::TsType::TsFnOrConstructorType(fn_or_constructor) => match fn_or_constructor {
                swc::TsFnOrConstructorType::TsFnType(_) => "TSFunctionType",
                swc::TsFnOrConstructorType::TsConstructorType(_) => "TSConstructorType",
            },
            swc::TsType::TsConditionalType(_) => "TSConditionalType",
            swc::TsType::TsIndexedAccessType(_) => "TSIndexedAccessType",
            swc::TsType::TsInferType(_) => "TSInferType",
            swc::TsType::TsImportType(_) => "TSImportType",
            swc::TsType::TsMappedType(_) => "TSMappedType",
            swc::TsType::TsOptionalType(_) => "TSOptionalType",
            swc::TsType::TsRestType(_) => "TSRestType",
            swc::TsType::TsTypePredicate(_) => "TSTypePredicate",
        };

        let mut obj = self.make_typed_json_base(type_name, ty.span());
        match ty {
            swc::TsType::TsArrayType(array) => {
                obj.insert(
                    "elementType".to_string(),
                    self.convert_ts_type_json_value(&array.elem_type),
                );
            }
            swc::TsType::TsUnionOrIntersectionType(union) => {
                let types = match union {
                    swc::TsUnionOrIntersectionType::TsUnionType(union) => &union.types,
                    swc::TsUnionOrIntersectionType::TsIntersectionType(intersection) => {
                        &intersection.types
                    }
                };
                obj.insert(
                    "types".to_string(),
                    serde_json::Value::Array(
                        types
                            .iter()
                            .map(|ty| self.convert_ts_type_json_value(ty))
                            .collect(),
                    ),
                );
            }
            swc::TsType::TsParenthesizedType(parenthesized) => {
                obj.insert(
                    "typeAnnotation".to_string(),
                    self.convert_ts_type_json_value(&parenthesized.type_ann),
                );
            }
            swc::TsType::TsTypeRef(reference) => {
                obj.insert(
                    "typeName".to_string(),
                    self.convert_ts_entity_name_json_value(&reference.type_name),
                );
                if let Some(type_arguments) = &reference.type_params {
                    obj.insert(
                        "typeParameters".to_string(),
                        self.convert_ts_type_param_instantiation_json_value(type_arguments),
                    );
                }
            }
            swc::TsType::TsTypeQuery(query) => {
                obj.insert(
                    "exprName".to_string(),
                    self.convert_ts_type_query_expr_name_json_value(&query.expr_name),
                );
                if let Some(type_arguments) = &query.type_args {
                    obj.insert(
                        "typeParameters".to_string(),
                        self.convert_ts_type_param_instantiation_json_value(type_arguments),
                    );
                }
            }
            swc::TsType::TsIndexedAccessType(indexed) => {
                obj.insert(
                    "objectType".to_string(),
                    self.convert_ts_type_json_value(&indexed.obj_type),
                );
                obj.insert(
                    "indexType".to_string(),
                    self.convert_ts_type_json_value(&indexed.index_type),
                );
            }
            swc::TsType::TsTypeOperator(operator) => {
                let operator_name = match operator.op {
                    swc::TsTypeOperatorOp::KeyOf => "keyof",
                    swc::TsTypeOperatorOp::Unique => "unique",
                    swc::TsTypeOperatorOp::ReadOnly => "readonly",
                };
                obj.insert(
                    "operator".to_string(),
                    serde_json::Value::String(operator_name.to_string()),
                );
                obj.insert(
                    "typeAnnotation".to_string(),
                    self.convert_ts_type_json_value(&operator.type_ann),
                );
            }
            swc::TsType::TsLitType(literal) => {
                obj.insert(
                    "literal".to_string(),
                    self.convert_ts_lit_json_value(&literal.lit),
                );
            }
            _ => {}
        }
        serde_json::Value::Object(obj)
    }

    fn convert_ts_entity_name_json_value(
        &self,
        type_name: &swc::TsEntityName,
    ) -> serde_json::Value {
        match type_name {
            swc::TsEntityName::Ident(identifier) => {
                let mut obj = self.make_typed_json_base("Identifier", identifier.span);
                obj.insert(
                    "name".to_string(),
                    serde_json::Value::String(identifier.sym.to_string()),
                );
                serde_json::Value::Object(obj)
            }
            swc::TsEntityName::TsQualifiedName(qualified) => {
                let mut obj = self.make_typed_json_base("TSQualifiedName", qualified.span);
                obj.insert(
                    "left".to_string(),
                    self.convert_ts_entity_name_json_value(&qualified.left),
                );
                let mut right = self.make_typed_json_base("Identifier", qualified.right.span);
                right.insert(
                    "name".to_string(),
                    serde_json::Value::String(qualified.right.sym.to_string()),
                );
                obj.insert("right".to_string(), serde_json::Value::Object(right));
                serde_json::Value::Object(obj)
            }
        }
    }

    fn convert_ts_type_query_expr_name_json_value(
        &self,
        expr_name: &swc::TsTypeQueryExpr,
    ) -> serde_json::Value {
        match expr_name {
            swc::TsTypeQueryExpr::TsEntityName(name) => {
                self.convert_ts_entity_name_json_value(name)
            }
            swc::TsTypeQueryExpr::Import(import) => {
                serde_json::Value::Object(self.make_typed_json_base("TSImportType", import.span))
            }
        }
    }

    fn convert_ts_lit_json_value(&self, literal: &swc::TsLit) -> serde_json::Value {
        match literal {
            swc::TsLit::Bool(literal) => {
                let mut obj = self.make_typed_json_base("BooleanLiteral", literal.span);
                obj.insert("value".to_string(), serde_json::Value::Bool(literal.value));
                serde_json::Value::Object(obj)
            }
            swc::TsLit::Number(literal) => {
                let mut obj = self.make_typed_json_base("NumericLiteral", literal.span);
                obj.insert("value".to_string(), serde_json::Value::from(literal.value));
                serde_json::Value::Object(obj)
            }
            swc::TsLit::Str(literal) => {
                let mut obj = self.make_typed_json_base("StringLiteral", literal.span);
                obj.insert(
                    "value".to_string(),
                    serde_json::Value::String(wtf8_to_string(&literal.value)),
                );
                serde_json::Value::Object(obj)
            }
            swc::TsLit::BigInt(literal) => {
                let mut obj = self.make_typed_json_base("BigIntLiteral", literal.span);
                obj.insert(
                    "value".to_string(),
                    serde_json::Value::String(literal.value.to_string()),
                );
                serde_json::Value::Object(obj)
            }
            swc::TsLit::Tpl(literal) => serde_json::Value::Object(
                self.make_typed_json_base("TemplateLiteral", literal.span),
            ),
        }
    }

    fn convert_ts_type_alias_decl(&self, d: &swc::TsTypeAliasDecl) -> TSTypeAliasDeclaration {
        self.preserved_ast.borrow_mut().save_ts_type_alias(d);

        TSTypeAliasDeclaration {
            base: self.make_base_node(d.span),
            id: self.convert_ident(&d.id),
            type_annotation: self.convert_ts_type_json(&d.type_ann),
            type_parameters: d.type_params.as_ref().map(|_| RawNode::null()),
            declare: d.declare.then_some(true),
        }
    }

    fn convert_ts_interface_decl(&self, d: &swc::TsInterfaceDecl) -> TSInterfaceDeclaration {
        self.preserved_ast.borrow_mut().save_ts_interface(d);

        TSInterfaceDeclaration {
            base: self.make_base_node(d.span),
            id: self.convert_ident(&d.id),
            body: RawNode::null(),
            type_parameters: d.type_params.as_ref().map(|_| RawNode::null()),
            extends: None,
            declare: d.declare.then_some(true),
        }
    }

    fn convert_ts_enum_decl(&self, d: &swc::TsEnumDecl) -> TSEnumDeclaration {
        self.preserved_ast.borrow_mut().save_ts_enum(d);

        TSEnumDeclaration {
            base: self.make_base_node(d.span),
            id: self.convert_ident(&d.id),
            members: vec![],
            declare: d.declare.then_some(true),
            is_const: d.is_const.then_some(true),
        }
    }

    fn convert_ts_module_decl(&self, d: &swc::TsModuleDecl) -> TSModuleDeclaration {
        self.preserved_ast.borrow_mut().save_ts_module(d);
        self.convert_ts_declaration_passthrough(
            d.span,
            d.global,
            Some(self.convert_ts_module_name_json(&d.id)),
        )
    }

    fn convert_ts_declaration_passthrough(
        &self,
        span: Span,
        global: bool,
        id: Option<serde_json::Value>,
    ) -> TSModuleDeclaration {
        TSModuleDeclaration {
            base: self.make_base_node(span),
            id: RawNode::from_value(&id.unwrap_or(serde_json::Value::Null)),
            body: RawNode::null(),
            declare: None,
            global: global.then_some(true),
        }
    }

    fn convert_ident_json(&self, id: &swc::Ident) -> serde_json::Value {
        let mut value =
            serde_json::to_value(self.convert_ident(id)).unwrap_or(serde_json::Value::Null);
        if let serde_json::Value::Object(object) = &mut value {
            object.insert(
                "type".to_string(),
                serde_json::Value::String("Identifier".to_string()),
            );
        }
        value
    }

    fn convert_string_literal_json(&self, lit: &swc::Str) -> serde_json::Value {
        let mut value = serde_json::to_value(StringLiteral {
            base: self.make_base_node(lit.span),
            value: wtf8_to_string(&lit.value).into(),
        })
        .unwrap_or(serde_json::Value::Null);
        if let serde_json::Value::Object(object) = &mut value {
            object.insert(
                "type".to_string(),
                serde_json::Value::String("StringLiteral".to_string()),
            );
        }
        value
    }

    fn convert_ts_module_name_json(&self, name: &swc::TsModuleName) -> serde_json::Value {
        match name {
            swc::TsModuleName::Ident(id) => self.convert_ident_json(id),
            swc::TsModuleName::Str(lit) => self.convert_string_literal_json(lit),
        }
    }

    // ===== Identifiers =====

    fn convert_ident(&self, id: &swc::Ident) -> Identifier {
        Identifier {
            base: self.make_base_node(id.span),
            name: id.sym.to_string(),
            type_annotation: None,
            optional: id.optional.then_some(true),
            decorators: None,
        }
    }

    fn convert_ident_name(&self, id: &swc::IdentName) -> Identifier {
        Identifier {
            base: self.make_base_node(id.span),
            name: id.sym.to_string(),
            type_annotation: None,
            optional: None,
            decorators: None,
        }
    }

    fn convert_prop_name(&self, key: &swc::PropName) -> Expression {
        match key {
            swc::PropName::Ident(id) => Expression::Identifier(Identifier {
                base: self.make_base_node(id.span),
                name: id.sym.to_string(),
                type_annotation: None,
                optional: None,
                decorators: None,
            }),
            swc::PropName::Str(s) => Expression::StringLiteral(StringLiteral {
                base: self.make_base_node(s.span),
                value: wtf8_to_string(&s.value).into(),
            }),
            swc::PropName::Num(n) => Expression::NumericLiteral(NumericLiteral {
                base: self.make_base_node(n.span),
                value: n.value,
                extra: None,
            }),
            swc::PropName::Computed(_) => self.convert_prop_name_as_expression(key),
            swc::PropName::BigInt(b) => Expression::BigIntLiteral(BigIntLiteral {
                base: self.make_base_node(b.span),
                value: b.value.to_string(),
            }),
        }
    }

    // ===== Operators =====

    fn convert_binary_op(&self, op: swc::BinaryOp) -> BinaryOperator {
        match op {
            swc::BinaryOp::EqEq => BinaryOperator::Eq,
            swc::BinaryOp::NotEq => BinaryOperator::Neq,
            swc::BinaryOp::EqEqEq => BinaryOperator::StrictEq,
            swc::BinaryOp::NotEqEq => BinaryOperator::StrictNeq,
            swc::BinaryOp::Lt => BinaryOperator::Lt,
            swc::BinaryOp::LtEq => BinaryOperator::Lte,
            swc::BinaryOp::Gt => BinaryOperator::Gt,
            swc::BinaryOp::GtEq => BinaryOperator::Gte,
            swc::BinaryOp::LShift => BinaryOperator::Shl,
            swc::BinaryOp::RShift => BinaryOperator::Shr,
            swc::BinaryOp::ZeroFillRShift => BinaryOperator::UShr,
            swc::BinaryOp::Add => BinaryOperator::Add,
            swc::BinaryOp::Sub => BinaryOperator::Sub,
            swc::BinaryOp::Mul => BinaryOperator::Mul,
            swc::BinaryOp::Div => BinaryOperator::Div,
            swc::BinaryOp::Mod => BinaryOperator::Rem,
            swc::BinaryOp::Exp => BinaryOperator::Exp,
            swc::BinaryOp::BitOr => BinaryOperator::BitOr,
            swc::BinaryOp::BitXor => BinaryOperator::BitXor,
            swc::BinaryOp::BitAnd => BinaryOperator::BitAnd,
            swc::BinaryOp::In => BinaryOperator::In,
            swc::BinaryOp::InstanceOf => BinaryOperator::Instanceof,
            swc::BinaryOp::LogicalOr
            | swc::BinaryOp::LogicalAnd
            | swc::BinaryOp::NullishCoalescing => {
                unreachable!(
                    "logical operator should be converted by convert_binary_op_as_logical_op"
                )
            }
        }
    }

    fn convert_binary_op_as_logical_op(&self, op: swc::BinaryOp) -> LogicalOperator {
        match op {
            swc::BinaryOp::LogicalOr => LogicalOperator::Or,
            swc::BinaryOp::LogicalAnd => LogicalOperator::And,
            swc::BinaryOp::NullishCoalescing => LogicalOperator::NullishCoalescing,
            _ => unreachable!("non-logical binary operator"),
        }
    }

    fn convert_unary_op(&self, op: swc::UnaryOp) -> UnaryOperator {
        match op {
            swc::UnaryOp::Minus => UnaryOperator::Neg,
            swc::UnaryOp::Plus => UnaryOperator::Plus,
            swc::UnaryOp::Bang => UnaryOperator::Not,
            swc::UnaryOp::Tilde => UnaryOperator::BitNot,
            swc::UnaryOp::TypeOf => UnaryOperator::TypeOf,
            swc::UnaryOp::Void => UnaryOperator::Void,
            swc::UnaryOp::Delete => UnaryOperator::Delete,
        }
    }

    fn convert_update_op(&self, op: swc::UpdateOp) -> UpdateOperator {
        match op {
            swc::UpdateOp::PlusPlus => UpdateOperator::Increment,
            swc::UpdateOp::MinusMinus => UpdateOperator::Decrement,
        }
    }

    fn convert_assign_op(&self, op: swc::AssignOp) -> AssignmentOperator {
        match op {
            swc::AssignOp::Assign => AssignmentOperator::Assign,
            swc::AssignOp::AddAssign => AssignmentOperator::AddAssign,
            swc::AssignOp::SubAssign => AssignmentOperator::SubAssign,
            swc::AssignOp::MulAssign => AssignmentOperator::MulAssign,
            swc::AssignOp::DivAssign => AssignmentOperator::DivAssign,
            swc::AssignOp::ModAssign => AssignmentOperator::RemAssign,
            swc::AssignOp::ExpAssign => AssignmentOperator::ExpAssign,
            swc::AssignOp::LShiftAssign => AssignmentOperator::ShlAssign,
            swc::AssignOp::RShiftAssign => AssignmentOperator::ShrAssign,
            swc::AssignOp::ZeroFillRShiftAssign => AssignmentOperator::UShrAssign,
            swc::AssignOp::BitOrAssign => AssignmentOperator::BitOrAssign,
            swc::AssignOp::BitXorAssign => AssignmentOperator::BitXorAssign,
            swc::AssignOp::BitAndAssign => AssignmentOperator::BitAndAssign,
            swc::AssignOp::OrAssign => AssignmentOperator::OrAssign,
            swc::AssignOp::AndAssign => AssignmentOperator::AndAssign,
            swc::AssignOp::NullishAssign => AssignmentOperator::NullishAssign,
        }
    }
}

/// Helper to convert SWC's `Wtf8Atom` (which doesn't impl Display) to a String.
#[inline(always)]
fn wtf8_to_string(value: &swc_atoms::Wtf8Atom) -> String {
    value.to_string_lossy().into_owned()
}

/// SWC stores Babel-compatible decoded JSX text and string attribute values in
/// the AST already.
/// Keep the converter's function as an identity step here
/// so this bridge does not double-decode entities like `&amp;amp;`.
///
/// If a future SWC parser change stops SWC from storing decoded JSX text
/// values, this function must be updated to decode entities correctly.
#[inline(always)]
fn decode_jsx_entities(s: &str) -> String {
    s.to_string()
}

fn convert_swc_comments(
    ctx: &ConvertCtx<'_>,
    comments: Option<&SingleThreadedComments>,
) -> Vec<Comment> {
    let Some(comments) = comments else {
        return Vec::new();
    };

    let (leading, trailing) = comments.borrow_all();
    let mut converted = Vec::with_capacity(
        leading.values().map(Vec::len).sum::<usize>()
            + trailing.values().map(Vec::len).sum::<usize>(),
    );

    for comment in leading
        .values()
        .chain(trailing.values())
        .flat_map(|comments| comments.iter())
    {
        converted.push(convert_swc_comment(ctx, comment));
    }

    converted.sort_by_key(|comment| {
        let data = comment_data(comment);
        (data.start.unwrap_or_default(), data.end.unwrap_or_default())
    });

    converted
}

fn convert_swc_comment(ctx: &ConvertCtx<'_>, comment: &SwcComment) -> Comment {
    let data = CommentData {
        value: comment.text.to_string(),
        start: Some(comment.span.lo.0),
        end: Some(comment.span.hi.0),
        loc: Some(ctx.source_location(comment.span)),
    };

    match comment.kind {
        CommentKind::Line => Comment::CommentLine(data),
        CommentKind::Block => Comment::CommentBlock(data),
    }
}

fn comment_data(comment: &Comment) -> &CommentData {
    match comment {
        Comment::CommentBlock(data) | Comment::CommentLine(data) => data,
    }
}
