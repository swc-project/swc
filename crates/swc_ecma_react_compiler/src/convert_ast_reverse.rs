// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

//! Reverse AST converter: `react_compiler_ast` (Babel format) to SWC AST.

use std::cell::RefCell;

use react_compiler_ast::{
    common::{BaseNode, RawNode},
    declarations::*,
    expressions::*,
    jsx::*,
    literals::*,
    operators::*,
    patterns::*,
    statements::*,
    File,
};
use serde_json::Value;
use swc_atoms::Atom;
use swc_common::{BytePos, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast as swc;

use crate::preserved_ast::PreservedAst;

/// Convert with source text and preserved SWC nodes from the forward pass.
pub fn convert_program_to_swc(file: &File, preserved_ast: PreservedAst) -> swc::Program {
    let ctx = ReverseCtx::new(preserved_ast);
    ctx.convert_program(&file.program)
}

struct ReverseCtx {
    preserved_ast: RefCell<PreservedAst>,
}

impl ReverseCtx {
    fn new(preserved_ast: PreservedAst) -> Self {
        Self {
            preserved_ast: RefCell::new(preserved_ast),
        }
    }

    fn any_ts_type(&self, span: Span) -> Box<swc::TsType> {
        Box::new(swc::TsType::TsKeywordType(swc::TsKeywordType {
            span,
            kind: swc::TsKeywordTypeKind::TsAnyKeyword,
        }))
    }

    fn expression_base(expr: &Expression) -> Option<&BaseNode> {
        match expr {
            Expression::Identifier(expr) => Some(&expr.base),
            Expression::StringLiteral(expr) => Some(&expr.base),
            Expression::NumericLiteral(expr) => Some(&expr.base),
            Expression::BooleanLiteral(expr) => Some(&expr.base),
            Expression::NullLiteral(expr) => Some(&expr.base),
            Expression::BigIntLiteral(expr) => Some(&expr.base),
            Expression::RegExpLiteral(expr) => Some(&expr.base),
            Expression::CallExpression(expr) => Some(&expr.base),
            Expression::MemberExpression(expr) => Some(&expr.base),
            Expression::OptionalCallExpression(expr) => Some(&expr.base),
            Expression::OptionalMemberExpression(expr) => Some(&expr.base),
            Expression::BinaryExpression(expr) => Some(&expr.base),
            Expression::LogicalExpression(expr) => Some(&expr.base),
            Expression::UnaryExpression(expr) => Some(&expr.base),
            Expression::UpdateExpression(expr) => Some(&expr.base),
            Expression::ConditionalExpression(expr) => Some(&expr.base),
            Expression::AssignmentExpression(expr) => Some(&expr.base),
            Expression::SequenceExpression(expr) => Some(&expr.base),
            Expression::ArrowFunctionExpression(expr) => Some(&expr.base),
            Expression::FunctionExpression(expr) => Some(&expr.base),
            Expression::ObjectExpression(expr) => Some(&expr.base),
            Expression::ArrayExpression(expr) => Some(&expr.base),
            Expression::NewExpression(expr) => Some(&expr.base),
            Expression::TemplateLiteral(expr) => Some(&expr.base),
            Expression::TaggedTemplateExpression(expr) => Some(&expr.base),
            Expression::AwaitExpression(expr) => Some(&expr.base),
            Expression::YieldExpression(expr) => Some(&expr.base),
            Expression::SpreadElement(expr) => Some(&expr.base),
            Expression::MetaProperty(expr) => Some(&expr.base),
            Expression::ClassExpression(expr) => Some(&expr.base),
            Expression::PrivateName(expr) => Some(&expr.base),
            Expression::Super(expr) => Some(&expr.base),
            Expression::Import(expr) => Some(&expr.base),
            Expression::ThisExpression(expr) => Some(&expr.base),
            Expression::ParenthesizedExpression(expr) => Some(&expr.base),
            Expression::JSXElement(expr) => Some(&expr.base),
            Expression::JSXFragment(expr) => Some(&expr.base),
            Expression::AssignmentPattern(expr) => Some(&expr.base),
            Expression::TSAsExpression(expr) => Some(&expr.base),
            Expression::TSSatisfiesExpression(expr) => Some(&expr.base),
            Expression::TSNonNullExpression(expr) => Some(&expr.base),
            Expression::TSTypeAssertion(expr) => Some(&expr.base),
            Expression::TSInstantiationExpression(expr) => Some(&expr.base),
            Expression::TypeCastExpression(expr) => Some(&expr.base),
        }
    }

    fn atom(&self, s: &str) -> Atom {
        Atom::from(s)
    }

    fn span_from_base(&self, base: &BaseNode) -> Span {
        match (base.start, base.end) {
            (Some(start), Some(end)) => Span::new(BytePos(start), BytePos(end)),
            (Some(start), None) => Span::new(BytePos(start), BytePos(start)),
            _ => DUMMY_SP,
        }
    }

    // ===== Program =====

    fn convert_program(&self, program: &react_compiler_ast::Program) -> swc::Program {
        let mut body = self.convert_statement_list_with_spans(&program.body);
        let directives = self.convert_directive_list(&program.directives);
        if !directives.is_empty() {
            body.splice(0..0, directives);
        }
        let span = self.span_from_base(&program.base);
        let shebang = program
            .interpreter
            .as_ref()
            .map(|interpreter| Atom::from(interpreter.value.as_str()));

        match program.source_type {
            react_compiler_ast::SourceType::Module => swc::Program::Module(swc::Module {
                span,
                body,
                shebang,
            }),
            react_compiler_ast::SourceType::Script => {
                let body = body
                    .into_iter()
                    .filter_map(|item| match item {
                        swc::ModuleItem::Stmt(stmt) => Some(stmt),
                        swc::ModuleItem::ModuleDecl(_) => None,
                    })
                    .collect();
                swc::Program::Script(swc::Script {
                    span,
                    body,
                    shebang,
                })
            }
        }
    }

    fn convert_directive_list(&self, directives: &[Directive]) -> Vec<swc::ModuleItem> {
        directives
            .iter()
            .map(|directive| swc::ModuleItem::Stmt(self.convert_directive(directive)))
            .collect()
    }

    fn convert_directive(&self, d: &Directive) -> swc::Stmt {
        let span = self.span_from_base(&d.base);
        let mut str_lit = swc::Str {
            span: self.span_from_base(&d.value.base),
            value: d.value.value.as_str().into(),
            raw: None,
        };
        self.preserved_ast.borrow_mut().load_directive(&mut str_lit);

        swc::Stmt::Expr(swc::ExprStmt {
            span,
            expr: Box::new(swc::Expr::Lit(swc::Lit::Str(str_lit))),
        })
    }

    fn convert_statement_list_with_spans(&self, stmts: &[Statement]) -> Vec<swc::ModuleItem> {
        stmts
            .iter()
            .map(|stmt| {
                let mut converted = self.convert_statement_as_module_item(stmt);
                let span = self.get_statement_span(stmt);
                match &mut converted {
                    swc::ModuleItem::Stmt(stmt) => set_statement_span(stmt, span),
                    swc::ModuleItem::ModuleDecl(decl) => self.set_module_decl_span(decl, span),
                }
                converted
            })
            .collect()
    }

    fn set_module_decl_span(&self, decl: &mut swc::ModuleDecl, span: Span) {
        match decl {
            swc::ModuleDecl::Import(d) => d.span = span,
            swc::ModuleDecl::ExportDecl(d) => d.span = span,
            swc::ModuleDecl::ExportNamed(d) => d.span = span,
            swc::ModuleDecl::ExportDefaultDecl(d) => d.span = span,
            swc::ModuleDecl::ExportDefaultExpr(d) => d.span = span,
            swc::ModuleDecl::ExportAll(d) => d.span = span,
            swc::ModuleDecl::TsImportEquals(d) => d.span = span,
            swc::ModuleDecl::TsExportAssignment(d) => d.span = span,
            swc::ModuleDecl::TsNamespaceExport(d) => d.span = span,
        }
    }

    fn get_statement_span(&self, stmt: &Statement) -> Span {
        let base = match stmt {
            Statement::BlockStatement(s) => &s.base,
            Statement::ReturnStatement(s) => &s.base,
            Statement::IfStatement(s) => &s.base,
            Statement::ForStatement(s) => &s.base,
            Statement::WhileStatement(s) => &s.base,
            Statement::DoWhileStatement(s) => &s.base,
            Statement::ForInStatement(s) => &s.base,
            Statement::ForOfStatement(s) => &s.base,
            Statement::SwitchStatement(s) => &s.base,
            Statement::ThrowStatement(s) => &s.base,
            Statement::TryStatement(s) => &s.base,
            Statement::BreakStatement(s) => &s.base,
            Statement::ContinueStatement(s) => &s.base,
            Statement::LabeledStatement(s) => &s.base,
            Statement::ExpressionStatement(s) => &s.base,
            Statement::EmptyStatement(s) => &s.base,
            Statement::DebuggerStatement(s) => &s.base,
            Statement::WithStatement(s) => &s.base,
            Statement::VariableDeclaration(s) => &s.base,
            Statement::FunctionDeclaration(s) => &s.base,
            Statement::ClassDeclaration(s) => &s.base,
            Statement::ImportDeclaration(s) => &s.base,
            Statement::ExportNamedDeclaration(s) => &s.base,
            Statement::ExportDefaultDeclaration(s) => &s.base,
            Statement::ExportAllDeclaration(s) => &s.base,
            Statement::TSTypeAliasDeclaration(s) => &s.base,
            Statement::TSInterfaceDeclaration(s) => &s.base,
            Statement::TSEnumDeclaration(s) => &s.base,
            Statement::TSModuleDeclaration(s) => &s.base,
            Statement::TSDeclareFunction(s) => &s.base,
            Statement::TypeAlias(s) => &s.base,
            Statement::OpaqueType(s) => &s.base,
            Statement::InterfaceDeclaration(s) => &s.base,
            Statement::DeclareVariable(s) => &s.base,
            Statement::DeclareFunction(s) => &s.base,
            Statement::DeclareClass(s) => &s.base,
            Statement::DeclareModule(s) => &s.base,
            Statement::DeclareModuleExports(s) => &s.base,
            Statement::DeclareExportDeclaration(s) => &s.base,
            Statement::DeclareExportAllDeclaration(s) => &s.base,
            Statement::DeclareInterface(s) => &s.base,
            Statement::DeclareTypeAlias(s) => &s.base,
            Statement::DeclareOpaqueType(s) => &s.base,
            Statement::EnumDeclaration(s) => &s.base,
            Statement::Unknown(s) => s.base(),
        };
        self.span_from_base(base)
    }

    fn convert_statement_as_module_item(&self, stmt: &Statement) -> swc::ModuleItem {
        match stmt {
            Statement::BlockStatement(block) => {
                swc::Stmt::Block(self.convert_block_statement(block)).into()
            }
            Statement::ReturnStatement(ret) => swc::Stmt::Return(swc::ReturnStmt {
                span: self.span_from_base(&ret.base),
                arg: ret
                    .argument
                    .as_ref()
                    .map(|arg| Box::new(self.convert_expression(arg))),
            })
            .into(),
            Statement::ExpressionStatement(expr) => swc::Stmt::Expr(swc::ExprStmt {
                span: self.span_from_base(&expr.base),
                expr: Box::new(self.convert_expression(&expr.expression)),
            })
            .into(),
            Statement::IfStatement(if_stmt) => swc::Stmt::If(swc::IfStmt {
                span: self.span_from_base(&if_stmt.base),
                test: Box::new(self.convert_expression(&if_stmt.test)),
                cons: Box::new(self.convert_statement(&if_stmt.consequent)),
                alt: if_stmt
                    .alternate
                    .as_ref()
                    .map(|alt| Box::new(self.convert_statement(alt))),
            })
            .into(),
            Statement::ForStatement(for_stmt) => swc::Stmt::For(swc::ForStmt {
                span: self.span_from_base(&for_stmt.base),
                init: for_stmt
                    .init
                    .as_ref()
                    .map(|init| self.convert_for_init(init)),
                test: for_stmt
                    .test
                    .as_ref()
                    .map(|test| Box::new(self.convert_expression(test))),
                update: for_stmt
                    .update
                    .as_ref()
                    .map(|update| Box::new(self.convert_expression(update))),
                body: Box::new(self.convert_statement(&for_stmt.body)),
            })
            .into(),
            Statement::WhileStatement(while_stmt) => swc::Stmt::While(swc::WhileStmt {
                span: self.span_from_base(&while_stmt.base),
                test: Box::new(self.convert_expression(&while_stmt.test)),
                body: Box::new(self.convert_statement(&while_stmt.body)),
            })
            .into(),
            Statement::DoWhileStatement(do_while) => swc::Stmt::DoWhile(swc::DoWhileStmt {
                span: self.span_from_base(&do_while.base),
                body: Box::new(self.convert_statement(&do_while.body)),
                test: Box::new(self.convert_expression(&do_while.test)),
            })
            .into(),
            Statement::ForInStatement(for_in) => swc::Stmt::ForIn(swc::ForInStmt {
                span: self.span_from_base(&for_in.base),
                left: self.convert_for_in_of_left(&for_in.left),
                right: Box::new(self.convert_expression(&for_in.right)),
                body: Box::new(self.convert_statement(&for_in.body)),
            })
            .into(),
            Statement::ForOfStatement(for_of) => swc::Stmt::ForOf(swc::ForOfStmt {
                span: self.span_from_base(&for_of.base),
                is_await: for_of.is_await,
                left: self.convert_for_in_of_left(&for_of.left),
                right: Box::new(self.convert_expression(&for_of.right)),
                body: Box::new(self.convert_statement(&for_of.body)),
            })
            .into(),
            Statement::SwitchStatement(switch_stmt) => swc::Stmt::Switch(swc::SwitchStmt {
                span: self.span_from_base(&switch_stmt.base),
                discriminant: Box::new(self.convert_expression(&switch_stmt.discriminant)),
                cases: switch_stmt
                    .cases
                    .iter()
                    .map(|case| swc::SwitchCase {
                        span: self.span_from_base(&case.base),
                        test: case
                            .test
                            .as_ref()
                            .map(|test| Box::new(self.convert_expression(test))),
                        cons: self.convert_statement_list(&case.consequent),
                    })
                    .collect(),
            })
            .into(),
            Statement::ThrowStatement(throw_stmt) => swc::Stmt::Throw(swc::ThrowStmt {
                span: self.span_from_base(&throw_stmt.base),
                arg: Box::new(self.convert_expression(&throw_stmt.argument)),
            })
            .into(),
            Statement::TryStatement(try_stmt) => swc::Stmt::Try(Box::new(swc::TryStmt {
                span: self.span_from_base(&try_stmt.base),
                block: self.convert_block_statement(&try_stmt.block),
                handler: try_stmt
                    .handler
                    .as_ref()
                    .map(|handler| self.convert_catch_clause(handler)),
                finalizer: try_stmt
                    .finalizer
                    .as_ref()
                    .map(|finalizer| self.convert_block_statement(finalizer)),
            }))
            .into(),
            Statement::BreakStatement(break_stmt) => swc::Stmt::Break(swc::BreakStmt {
                span: self.span_from_base(&break_stmt.base),
                label: break_stmt
                    .label
                    .as_ref()
                    .map(|label| self.convert_identifier(label)),
            })
            .into(),
            Statement::ContinueStatement(continue_stmt) => swc::Stmt::Continue(swc::ContinueStmt {
                span: self.span_from_base(&continue_stmt.base),
                label: continue_stmt
                    .label
                    .as_ref()
                    .map(|label| self.convert_identifier(label)),
            })
            .into(),
            Statement::LabeledStatement(label) => swc::Stmt::Labeled(swc::LabeledStmt {
                span: self.span_from_base(&label.base),
                label: self.convert_identifier(&label.label),
                body: Box::new(self.convert_statement(&label.body)),
            })
            .into(),
            Statement::EmptyStatement(empty) => swc::Stmt::Empty(swc::EmptyStmt {
                span: self.span_from_base(&empty.base),
            })
            .into(),
            Statement::DebuggerStatement(debugger) => swc::Stmt::Debugger(swc::DebuggerStmt {
                span: self.span_from_base(&debugger.base),
            })
            .into(),
            Statement::WithStatement(with_stmt) => swc::Stmt::With(swc::WithStmt {
                span: self.span_from_base(&with_stmt.base),
                obj: Box::new(self.convert_expression(&with_stmt.object)),
                body: Box::new(self.convert_statement(&with_stmt.body)),
            })
            .into(),
            Statement::VariableDeclaration(decl) => {
                swc::Stmt::Decl(self.convert_variable_declaration(decl)).into()
            }
            Statement::FunctionDeclaration(func) => {
                swc::Stmt::Decl(swc::Decl::Fn(self.convert_function_declaration(func))).into()
            }
            Statement::ClassDeclaration(class) => {
                swc::Stmt::Decl(swc::Decl::Class(swc::ClassDecl {
                    ident: class.id.as_ref().map_or_else(
                        || self.quote_ident("__default_class"),
                        |id| self.convert_identifier(id),
                    ),
                    declare: class.declare.unwrap_or(false),
                    class: Box::new(self.convert_class_declaration(class)),
                }))
                .into()
            }
            Statement::ImportDeclaration(decl) => {
                swc::ModuleDecl::Import(self.convert_import_declaration(decl)).into()
            }
            Statement::ExportNamedDeclaration(decl) => {
                self.convert_export_named_declaration(decl).into()
            }
            Statement::ExportDefaultDeclaration(decl) => {
                self.convert_export_default_declaration(decl).into()
            }
            Statement::ExportAllDeclaration(decl) => {
                swc::ModuleDecl::ExportAll(self.convert_export_all_declaration(decl)).into()
            }
            Statement::TSTypeAliasDeclaration(decl) => self.convert_ts_type_alias_declaration(decl),
            Statement::TSInterfaceDeclaration(decl) => self.convert_ts_interface_declaration(decl),
            Statement::TSEnumDeclaration(decl) => self.convert_ts_enum_declaration(decl),
            Statement::TSModuleDeclaration(decl) => self.convert_ts_module_declaration(decl),
            Statement::TSDeclareFunction(decl) => self.convert_ts_declare_function(decl),
            Statement::Unknown(_)
            | Statement::TypeAlias(_)
            | Statement::OpaqueType(_)
            | Statement::InterfaceDeclaration(_)
            | Statement::DeclareVariable(_)
            | Statement::DeclareFunction(_)
            | Statement::DeclareClass(_)
            | Statement::DeclareModule(_)
            | Statement::DeclareModuleExports(_)
            | Statement::DeclareExportDeclaration(_)
            | Statement::DeclareExportAllDeclaration(_)
            | Statement::DeclareInterface(_)
            | Statement::DeclareTypeAlias(_)
            | Statement::DeclareOpaqueType(_)
            | Statement::EnumDeclaration(_) => {
                // This reverse path only handles AST produced by our SWC forward converter;
                // lossy SWC details are restored from PreservedAst.
                unreachable!("unsupported statement in SWC round-trip AST")
            }
        }
    }

    fn convert_statement(&self, stmt: &Statement) -> swc::Stmt {
        match self.convert_statement_as_module_item(stmt) {
            swc::ModuleItem::Stmt(stmt) => stmt,
            swc::ModuleItem::ModuleDecl(_) => swc::Stmt::Empty(swc::EmptyStmt {
                span: self.get_statement_span(stmt),
            }),
        }
    }

    fn convert_statement_list(&self, stmts: &[Statement]) -> Vec<swc::Stmt> {
        stmts
            .iter()
            .map(|stmt| self.convert_statement(stmt))
            .collect()
    }

    fn convert_block_statement(&self, block: &BlockStatement) -> swc::BlockStmt {
        let mut stmts = self.convert_statement_list(&block.body);
        let directives: Vec<_> = block
            .directives
            .iter()
            .map(|directive| self.convert_directive(directive))
            .collect();
        if !directives.is_empty() {
            stmts.splice(0..0, directives);
        }
        swc::BlockStmt {
            span: self.span_from_base(&block.base),
            ctxt: SyntaxContext::empty(),
            stmts,
        }
    }

    fn convert_catch_clause(&self, clause: &CatchClause) -> swc::CatchClause {
        let mut catch_clause = swc::CatchClause {
            span: self.span_from_base(&clause.base),
            param: clause
                .param
                .as_ref()
                .map(|param| self.convert_pattern_like_omitting_types(param)),
            body: self.convert_block_statement(&clause.body),
        };
        if !self
            .preserved_ast
            .borrow_mut()
            .load_catch_clause(&mut catch_clause)
        {
            if let (Some(param), Some(source)) = (&mut catch_clause.param, &clause.param) {
                self.cold_fill_pat_type_from_pattern_like(param, source);
            }
        }
        catch_clause
    }

    fn convert_for_init(&self, init: &ForInit) -> swc::VarDeclOrExpr {
        match init {
            ForInit::VariableDeclaration(decl) => {
                let swc::Decl::Var(decl) = self.convert_variable_declaration(decl) else {
                    return swc::VarDeclOrExpr::Expr(Box::new(swc::Expr::Invalid(swc::Invalid {
                        span: DUMMY_SP,
                    })));
                };
                swc::VarDeclOrExpr::VarDecl(decl)
            }
            ForInit::Expression(expr) => {
                swc::VarDeclOrExpr::Expr(Box::new(self.convert_expression(expr)))
            }
        }
    }

    fn convert_for_in_of_left(&self, left: &ForInOfLeft) -> swc::ForHead {
        match left {
            ForInOfLeft::VariableDeclaration(decl) => {
                let swc::Decl::Var(decl) = self.convert_variable_declaration(decl) else {
                    return swc::ForHead::Pat(Box::new(swc::Pat::Invalid(swc::Invalid {
                        span: DUMMY_SP,
                    })));
                };
                swc::ForHead::VarDecl(decl)
            }
            ForInOfLeft::Pattern(pattern) => {
                swc::ForHead::Pat(Box::new(self.convert_pattern_like_omitting_types(pattern)))
            }
        }
    }

    fn convert_variable_declaration(&self, decl: &VariableDeclaration) -> swc::Decl {
        let span = self.span_from_base(&decl.base);

        let decls = decl
            .declarations
            .iter()
            .map(|declarator| self.convert_variable_declarator(declarator))
            .collect();

        if let VariableDeclarationKind::Using = decl.kind {
            return swc::UsingDecl {
                span,
                // [TODO]: VariableDeclarationKind::AwaitUsing
                is_await: false,
                decls,
            }
            .into();
        }

        let mut var_decl = swc::VarDecl {
            span,
            ctxt: SyntaxContext::empty(),
            kind: self.convert_variable_declaration_kind(&decl.kind),
            declare: decl.declare.unwrap_or(false),
            decls,
        };
        if !self.preserved_ast.borrow_mut().load_var_decl(&mut var_decl) {
            self.cold_fill_var_decl_types_from_variable_declarators(
                &mut var_decl,
                &decl.declarations,
            );
        }

        var_decl.into()
    }

    fn convert_variable_declaration_kind(
        &self,
        kind: &VariableDeclarationKind,
    ) -> swc::VarDeclKind {
        match kind {
            VariableDeclarationKind::Var => swc::VarDeclKind::Var,
            VariableDeclarationKind::Let => swc::VarDeclKind::Let,
            VariableDeclarationKind::Const => swc::VarDeclKind::Const,
            _ => unreachable!("Unexpected variable declaration kind"),
        }
    }

    fn convert_variable_declarator(&self, declarator: &VariableDeclarator) -> swc::VarDeclarator {
        swc::VarDeclarator {
            span: self.span_from_base(&declarator.base),
            name: self.convert_pattern_like_omitting_types(&declarator.id),
            init: declarator
                .init
                .as_ref()
                .map(|init| Box::new(self.convert_expression(init))),
            definite: declarator.definite.unwrap_or(false),
        }
    }

    // ===== Expressions =====

    fn convert_expression(&self, expr: &Expression) -> swc::Expr {
        match expr {
            Expression::Identifier(id) => swc::Expr::Ident(self.convert_identifier(id)),
            Expression::StringLiteral(lit) => {
                swc::Expr::Lit(swc::Lit::Str(self.convert_string_literal(lit)))
            }
            Expression::NumericLiteral(lit) => swc::Expr::Lit(swc::Lit::Num(swc::Number {
                span: self.span_from_base(&lit.base),
                value: lit.precise_value(),
                raw: lit
                    .extra
                    .as_ref()
                    .map(|extra| Atom::from(extra.raw.as_str())),
            })),
            Expression::BooleanLiteral(lit) => swc::Expr::Lit(swc::Lit::Bool(swc::Bool {
                span: self.span_from_base(&lit.base),
                value: lit.value,
            })),
            Expression::NullLiteral(lit) => swc::Expr::Lit(swc::Lit::Null(swc::Null {
                span: self.span_from_base(&lit.base),
            })),
            Expression::BigIntLiteral(lit) => swc::Expr::Lit(swc::Lit::BigInt(swc::BigInt {
                span: self.span_from_base(&lit.base),
                value: Box::new(bigint_literal_value(&lit.value).parse().unwrap_or_default()),
                raw: Some(bigint_literal_raw(&lit.value)),
            })),
            Expression::RegExpLiteral(lit) => swc::Expr::Lit(swc::Lit::Regex(swc::Regex {
                span: self.span_from_base(&lit.base),
                exp: Atom::from(lit.pattern.as_str()),
                flags: Atom::from(lit.flags.as_str()),
            })),
            Expression::CallExpression(call) => swc::Expr::Call(self.convert_call_expression(call)),
            Expression::MemberExpression(member) => self.convert_member_expression(member),
            Expression::OptionalCallExpression(call) => {
                let mut opt_call = swc::OptCall {
                    span: self.span_from_base(&call.base),
                    ctxt: SyntaxContext::empty(),
                    callee: Box::new(self.convert_expression(&call.callee)),
                    args: self.convert_expression_list(&call.arguments),
                    type_args: None,
                };
                if !self.preserved_ast.borrow_mut().load_opt_call(&mut opt_call) {
                    self.cold_fill_opt_call_type_args_from_raw_nodes(
                        &mut opt_call,
                        call.type_parameters.as_ref(),
                        call.type_arguments.as_ref(),
                    );
                }
                swc::Expr::OptChain(swc::OptChainExpr {
                    span: self.span_from_base(&call.base),
                    optional: call.optional,
                    base: Box::new(swc::OptChainBase::Call(opt_call)),
                })
            }
            Expression::OptionalMemberExpression(member) => {
                swc::Expr::OptChain(swc::OptChainExpr {
                    span: self.span_from_base(&member.base),
                    optional: member.optional,
                    base: Box::new(swc::OptChainBase::Member(
                        self.convert_optional_member_expression_as_chain_element(member),
                    )),
                })
            }
            Expression::BinaryExpression(binary) => swc::Expr::Bin(swc::BinExpr {
                span: self.span_from_base(&binary.base),
                op: self.convert_binary_operator(&binary.operator),
                left: Box::new(self.convert_expression(&binary.left)),
                right: Box::new(self.convert_expression(&binary.right)),
            }),
            Expression::LogicalExpression(logical) => swc::Expr::Bin(swc::BinExpr {
                span: self.span_from_base(&logical.base),
                op: self.convert_logical_operator(&logical.operator),
                left: Box::new(self.convert_expression(&logical.left)),
                right: Box::new(self.convert_expression(&logical.right)),
            }),
            Expression::UnaryExpression(unary) => swc::Expr::Unary(swc::UnaryExpr {
                span: self.span_from_base(&unary.base),
                op: self.convert_unary_operator(&unary.operator),
                arg: Box::new(self.convert_expression(&unary.argument)),
            }),
            Expression::UpdateExpression(update) => swc::Expr::Update(swc::UpdateExpr {
                span: self.span_from_base(&update.base),
                op: self.convert_update_operator(&update.operator),
                prefix: update.prefix,
                arg: Box::new(self.convert_expression(&update.argument)),
            }),
            Expression::ConditionalExpression(cond) => swc::Expr::Cond(swc::CondExpr {
                span: self.span_from_base(&cond.base),
                test: Box::new(self.convert_expression(&cond.test)),
                cons: Box::new(self.convert_expression(&cond.consequent)),
                alt: Box::new(self.convert_expression(&cond.alternate)),
            }),
            Expression::AssignmentExpression(assign) => swc::Expr::Assign(swc::AssignExpr {
                span: self.span_from_base(&assign.base),
                op: self.convert_assignment_operator(&assign.operator),
                left: self.convert_pattern_like_as_assign_target(&assign.left),
                right: Box::new(self.convert_expression(&assign.right)),
            }),
            Expression::SequenceExpression(seq) => swc::Expr::Seq(swc::SeqExpr {
                span: self.span_from_base(&seq.base),
                exprs: seq
                    .expressions
                    .iter()
                    .map(|expr| Box::new(self.convert_expression(expr)))
                    .collect(),
            }),
            Expression::ArrowFunctionExpression(arrow) => {
                self.convert_arrow_function_expression(arrow)
            }
            Expression::FunctionExpression(func) => swc::Expr::Fn(swc::FnExpr {
                ident: func.id.as_ref().map(|id| self.convert_identifier(id)),
                function: Box::new(self.convert_function_expression(func)),
            }),
            Expression::ObjectExpression(obj) => swc::Expr::Object(swc::ObjectLit {
                span: self.span_from_base(&obj.base),
                props: obj
                    .properties
                    .iter()
                    .map(|prop| self.convert_object_expression_property(prop))
                    .collect(),
            }),
            Expression::ArrayExpression(arr) => swc::Expr::Array(swc::ArrayLit {
                span: self.span_from_base(&arr.base),
                elems: arr
                    .elements
                    .iter()
                    .map(|elem| {
                        elem.as_ref()
                            .map(|elem| self.convert_expression_as_argument(elem))
                    })
                    .collect(),
            }),
            Expression::NewExpression(new) => {
                let mut new_expr = swc::NewExpr {
                    span: self.span_from_base(&new.base),
                    ctxt: SyntaxContext::empty(),
                    callee: Box::new(self.convert_expression(&new.callee)),
                    args: Some(self.convert_expression_list(&new.arguments)),
                    type_args: None,
                };
                if !self.preserved_ast.borrow_mut().load_new(&mut new_expr) {
                    self.cold_fill_new_type_args_from_raw_nodes(
                        &mut new_expr,
                        new.type_parameters.as_ref(),
                        new.type_arguments.as_ref(),
                    );
                }
                swc::Expr::New(new_expr)
            }
            Expression::TemplateLiteral(tpl) => swc::Expr::Tpl(self.convert_template_literal(tpl)),
            Expression::TaggedTemplateExpression(tagged) => {
                let mut tagged_tpl = swc::TaggedTpl {
                    span: self.span_from_base(&tagged.base),
                    ctxt: SyntaxContext::empty(),
                    tag: Box::new(self.convert_expression(&tagged.tag)),
                    type_params: None,
                    tpl: Box::new(self.convert_template_literal(&tagged.quasi)),
                };
                if !self
                    .preserved_ast
                    .borrow_mut()
                    .load_tagged_tpl(&mut tagged_tpl)
                {
                    self.cold_fill_tagged_tpl_type_params_from_raw_node(
                        &mut tagged_tpl,
                        tagged.type_parameters.as_ref(),
                    );
                }
                swc::Expr::TaggedTpl(tagged_tpl)
            }
            Expression::AwaitExpression(await_expr) => swc::Expr::Await(swc::AwaitExpr {
                span: self.span_from_base(&await_expr.base),
                arg: Box::new(self.convert_expression(&await_expr.argument)),
            }),
            Expression::YieldExpression(yield_expr) => swc::Expr::Yield(swc::YieldExpr {
                span: self.span_from_base(&yield_expr.base),
                arg: yield_expr
                    .argument
                    .as_ref()
                    .map(|arg| Box::new(self.convert_expression(arg))),
                delegate: yield_expr.delegate,
            }),
            Expression::SpreadElement(spread) => self.convert_expression(&spread.argument),
            Expression::MetaProperty(meta) => swc::Expr::MetaProp(swc::MetaPropExpr {
                span: self.span_from_base(&meta.base),
                kind: if meta.meta.name == "import" && meta.property.name == "meta" {
                    swc::MetaPropKind::ImportMeta
                } else {
                    swc::MetaPropKind::NewTarget
                },
            }),
            Expression::ClassExpression(class) => swc::Expr::Class(swc::ClassExpr {
                ident: class.id.as_ref().map(|id| self.convert_identifier(id)),
                class: Box::new(self.make_class(
                    &class.base,
                    class.super_class.as_deref(),
                    &class.body,
                    false,
                )),
            }),
            Expression::PrivateName(private) => swc::Expr::PrivateName(swc::PrivateName {
                span: self.span_from_base(&private.base),
                name: self.atom(&private.id.name),
            }),
            Expression::Super(super_expr) => swc::Expr::Invalid(swc::Invalid {
                span: self.span_from_base(&super_expr.base),
            }),
            Expression::Import(import) => swc::Expr::Invalid(swc::Invalid {
                span: self.span_from_base(&import.base),
            }),
            Expression::ThisExpression(this) => swc::Expr::This(swc::ThisExpr {
                span: self.span_from_base(&this.base),
            }),
            Expression::ParenthesizedExpression(paren) => swc::Expr::Paren(swc::ParenExpr {
                span: self.span_from_base(&paren.base),
                expr: Box::new(self.convert_expression(&paren.expression)),
            }),
            Expression::JSXElement(el) => {
                swc::Expr::JSXElement(Box::new(self.convert_jsx_element(el)))
            }
            Expression::JSXFragment(frag) => {
                swc::Expr::JSXFragment(self.convert_jsx_fragment(frag))
            }
            Expression::AssignmentPattern(pattern) => swc::Expr::Assign(swc::AssignExpr {
                span: self.span_from_base(&pattern.base),
                op: swc::AssignOp::Assign,
                left: self.convert_pattern_like_as_assign_target(&pattern.left),
                right: Box::new(self.convert_expression(&pattern.right)),
            }),
            Expression::TSAsExpression(ts) => {
                let span = self.span_from_base(&ts.base);
                let mut expr = swc::TsAsExpr {
                    span,
                    expr: Box::new(self.convert_expression(&ts.expression)),
                    type_ann: self.any_ts_type(span),
                };
                if !self.preserved_ast.borrow_mut().load_ts_as_expr(&mut expr) {
                    self.cold_fill_ts_as_expr_from_raw_node(&mut expr, &ts.type_annotation, span);
                }
                swc::Expr::TsAs(expr)
            }
            Expression::TSSatisfiesExpression(ts) => {
                let span = self.span_from_base(&ts.base);
                let mut expr = swc::TsSatisfiesExpr {
                    span,
                    expr: Box::new(self.convert_expression(&ts.expression)),
                    type_ann: self.any_ts_type(span),
                };
                if !self
                    .preserved_ast
                    .borrow_mut()
                    .load_ts_satisfies_expr(&mut expr)
                {
                    self.cold_fill_ts_satisfies_expr_from_raw_node(
                        &mut expr,
                        &ts.type_annotation,
                        span,
                    );
                }
                swc::Expr::TsSatisfies(expr)
            }
            Expression::TSNonNullExpression(ts) => swc::Expr::TsNonNull(swc::TsNonNullExpr {
                span: self.span_from_base(&ts.base),
                expr: Box::new(self.convert_expression(&ts.expression)),
            }),
            Expression::TSTypeAssertion(ts) => {
                let span = self.span_from_base(&ts.base);
                let mut expr = swc::TsTypeAssertion {
                    span,
                    expr: Box::new(self.convert_expression(&ts.expression)),
                    type_ann: self.any_ts_type(span),
                };
                if !self
                    .preserved_ast
                    .borrow_mut()
                    .load_ts_type_assertion(&mut expr)
                {
                    self.cold_fill_ts_type_assertion_from_raw_node(
                        &mut expr,
                        &ts.type_annotation,
                        span,
                    );
                }
                swc::Expr::TsTypeAssertion(expr)
            }
            Expression::TSInstantiationExpression(ts) => {
                let span = self.span_from_base(&ts.base);
                let mut expr = swc::TsInstantiation {
                    span,
                    expr: Box::new(self.convert_expression(&ts.expression)),
                    type_args: Box::new(swc::TsTypeParamInstantiation {
                        span,
                        params: vec![],
                    }),
                };
                if !self
                    .preserved_ast
                    .borrow_mut()
                    .load_ts_instantiation(&mut expr)
                {
                    self.cold_fill_ts_instantiation_from_raw_node(
                        &mut expr,
                        &ts.type_parameters,
                        span,
                    );
                }
                swc::Expr::TsInstantiation(expr)
            }
            Expression::TypeCastExpression(type_cast) => {
                self.convert_expression(&type_cast.expression)
            }
        }
    }

    fn convert_call_expression(&self, call: &CallExpression) -> swc::CallExpr {
        let callee = match call.callee.as_ref() {
            Expression::Super(super_expr) => swc::Callee::Super(swc::Super {
                span: self.span_from_base(&super_expr.base),
            }),
            Expression::Import(import) => swc::Callee::Import(swc::Import {
                span: self.span_from_base(&import.base),
                phase: swc::ImportPhase::Evaluation,
            }),
            _ => swc::Callee::Expr(Box::new(self.convert_expression(&call.callee))),
        };

        let mut call_expr = swc::CallExpr {
            span: self.span_from_base(&call.base),
            ctxt: SyntaxContext::empty(),
            callee,
            args: self.convert_expression_list(&call.arguments),
            type_args: None,
        };
        if !self.preserved_ast.borrow_mut().load_call(&mut call_expr) {
            self.cold_fill_call_type_args_from_raw_nodes(
                &mut call_expr,
                call.type_parameters.as_ref(),
                call.type_arguments.as_ref(),
            );
        }
        call_expr
    }

    fn convert_member_expression(&self, m: &MemberExpression) -> swc::Expr {
        if let Expression::Super(super_expr) = m.object.as_ref() {
            let prop = if m.computed {
                swc::SuperProp::Computed(swc::ComputedPropName {
                    span: self.span_from_base(&m.property_base()),
                    expr: Box::new(self.convert_expression(&m.property)),
                })
            } else {
                swc::SuperProp::Ident(self.expression_to_identifier_name(&m.property))
            };
            return swc::Expr::SuperProp(swc::SuperPropExpr {
                span: self.span_from_base(&m.base),
                obj: swc::Super {
                    span: self.span_from_base(&super_expr.base),
                },
                prop,
            });
        }

        swc::Expr::Member(swc::MemberExpr {
            span: self.span_from_base(&m.base),
            obj: Box::new(self.convert_expression(&m.object)),
            prop: if m.computed {
                swc::MemberProp::Computed(swc::ComputedPropName {
                    span: self.span_from_base(&m.property_base()),
                    expr: Box::new(self.convert_expression(&m.property)),
                })
            } else {
                match m.property.as_ref() {
                    Expression::PrivateName(private) => {
                        swc::MemberProp::PrivateName(swc::PrivateName {
                            span: self.span_from_base(&private.base),
                            name: self.atom(&private.id.name),
                        })
                    }
                    _ => swc::MemberProp::Ident(self.expression_to_identifier_name(&m.property)),
                }
            },
        })
    }

    fn convert_optional_member_expression_as_chain_element(
        &self,
        m: &OptionalMemberExpression,
    ) -> swc::MemberExpr {
        swc::MemberExpr {
            span: self.span_from_base(&m.base),
            obj: Box::new(self.convert_expression(&m.object)),
            prop: if m.computed {
                swc::MemberProp::Computed(swc::ComputedPropName {
                    span: self.span_from_base(&m.property_base()),
                    expr: Box::new(self.convert_expression(&m.property)),
                })
            } else {
                swc::MemberProp::Ident(self.expression_to_identifier_name(&m.property))
            },
        }
    }

    fn expression_to_identifier_name(&self, expr: &Expression) -> swc::IdentName {
        match expr {
            Expression::Identifier(id) => self.make_ident_name(&id.base, &id.name),
            _ => swc::IdentName::new(Atom::from("__computed"), self.expression_span(expr)),
        }
    }

    fn convert_expression_list(&self, arguments: &[Expression]) -> Vec<swc::ExprOrSpread> {
        arguments
            .iter()
            .map(|arg| self.convert_expression_as_argument(arg))
            .collect()
    }

    fn convert_expression_as_argument(&self, arg: &Expression) -> swc::ExprOrSpread {
        match arg {
            Expression::SpreadElement(spread) => swc::ExprOrSpread {
                spread: Some(self.span_from_base(&spread.base)),
                expr: Box::new(self.convert_expression(&spread.argument)),
            },
            _ => swc::ExprOrSpread {
                spread: None,
                expr: Box::new(self.convert_expression(arg)),
            },
        }
    }

    fn convert_object_expression_property(
        &self,
        prop: &ObjectExpressionProperty,
    ) -> swc::PropOrSpread {
        match prop {
            ObjectExpressionProperty::ObjectProperty(prop) => {
                if prop.shorthand {
                    if let Expression::Identifier(id) = prop.key.as_ref() {
                        return swc::PropOrSpread::Prop(Box::new(swc::Prop::Shorthand(
                            self.convert_identifier(id),
                        )));
                    }
                }

                let key = self.convert_expression_as_prop_name(&prop.key, prop.computed);
                let key_value = swc::KeyValueProp {
                    key,
                    value: Box::new(self.convert_expression(&prop.value)),
                };
                swc::PropOrSpread::Prop(Box::new(swc::Prop::KeyValue(key_value)))
            }
            ObjectExpressionProperty::ObjectMethod(method) => {
                let mut function = self.convert_object_method_to_function(method);
                if !self.preserved_ast.borrow_mut().load_function(&mut function) {
                    self.cold_fill_function_types_from_raw_node(
                        &mut function,
                        &method.params,
                        method.return_type.as_ref(),
                    );
                }
                let key = self.convert_expression_as_prop_name(&method.key, method.computed);
                match method.kind {
                    ObjectMethodKind::Get => {
                        swc::PropOrSpread::Prop(Box::new(swc::Prop::Getter(swc::GetterProp {
                            span: self.span_from_base(&method.base),
                            key,
                            type_ann: function.return_type,
                            body: function.body,
                        })))
                    }
                    ObjectMethodKind::Set => {
                        let param = function.params.into_iter().next().map_or_else(
                            || Box::new(swc::Pat::Invalid(swc::Invalid { span: DUMMY_SP })),
                            |param| Box::new(param.pat),
                        );
                        swc::PropOrSpread::Prop(Box::new(swc::Prop::Setter(swc::SetterProp {
                            span: self.span_from_base(&method.base),
                            key,
                            this_param: None,
                            param,
                            body: function.body,
                        })))
                    }
                    ObjectMethodKind::Method => {
                        swc::PropOrSpread::Prop(Box::new(swc::Prop::Method(swc::MethodProp {
                            key,
                            function: Box::new(function),
                        })))
                    }
                }
            }
            ObjectExpressionProperty::SpreadElement(spread) => {
                swc::PropOrSpread::Spread(swc::SpreadElement {
                    dot3_token: self.span_from_base(&spread.base),
                    expr: Box::new(self.convert_expression(&spread.argument)),
                })
            }
        }
    }

    fn convert_expression_as_prop_name(&self, expr: &Expression, computed: bool) -> swc::PropName {
        if computed {
            return swc::PropName::Computed(swc::ComputedPropName {
                span: self.expression_span(expr),
                expr: Box::new(self.convert_expression(expr)),
            });
        }
        match expr {
            Expression::Identifier(id) => {
                swc::PropName::Ident(self.make_ident_name(&id.base, &id.name))
            }
            Expression::StringLiteral(lit) => swc::PropName::Str(self.convert_string_literal(lit)),
            Expression::NumericLiteral(lit) => swc::PropName::Num(swc::Number {
                span: self.span_from_base(&lit.base),
                value: lit.precise_value(),
                raw: lit
                    .extra
                    .as_ref()
                    .map(|extra| Atom::from(extra.raw.as_str())),
            }),
            Expression::BigIntLiteral(lit) => swc::PropName::BigInt(swc::BigInt {
                span: self.span_from_base(&lit.base),
                value: Box::new(bigint_literal_value(&lit.value).parse().unwrap_or_default()),
                raw: Some(bigint_literal_raw(&lit.value)),
            }),
            _ => swc::PropName::Computed(swc::ComputedPropName {
                span: self.expression_span(expr),
                expr: Box::new(self.convert_expression(expr)),
            }),
        }
    }

    fn convert_template_literal(&self, tpl: &TemplateLiteral) -> swc::Tpl {
        swc::Tpl {
            span: self.span_from_base(&tpl.base),
            exprs: tpl
                .expressions
                .iter()
                .map(|expr| Box::new(self.convert_expression(expr)))
                .collect(),
            quasis: tpl
                .quasis
                .iter()
                .map(|quasi| swc::TplElement {
                    span: self.span_from_base(&quasi.base),
                    tail: quasi.tail,
                    cooked: quasi
                        .value
                        .cooked
                        .as_ref()
                        .map(|cooked| cooked.as_str().into()),
                    raw: Atom::from(quasi.value.raw.as_str()),
                })
                .collect(),
        }
    }

    fn convert_function_declaration(&self, f: &FunctionDeclaration) -> swc::FnDecl {
        let mut function = swc::Function {
            params: f
                .params
                .iter()
                .map(|param| self.convert_pattern_like_as_formal_parameter_omitting_types(param))
                .collect(),
            decorators: vec![],
            span: self.span_from_base(&f.base),
            ctxt: SyntaxContext::empty(),
            body: Some(self.convert_block_statement(&f.body)),
            is_generator: f.generator,
            is_async: f.is_async,
            type_params: None,
            return_type: None,
        };
        if !self.preserved_ast.borrow_mut().load_function(&mut function) {
            self.cold_fill_function_types_from_raw_node(
                &mut function,
                &f.params,
                f.return_type.as_ref(),
            );
        }
        swc::FnDecl {
            ident: f.id.as_ref().map_or_else(
                || self.quote_ident("__default"),
                |id| self.convert_identifier(id),
            ),
            declare: f.declare.unwrap_or(false),
            function: Box::new(function),
        }
    }

    fn convert_class_declaration(&self, c: &ClassDeclaration) -> swc::Class {
        self.make_class(
            &c.base,
            c.super_class.as_deref(),
            &c.body,
            c.is_abstract.unwrap_or(false),
        )
    }

    fn make_class(
        &self,
        base: &BaseNode,
        super_class: Option<&Expression>,
        body: &ClassBody,
        is_abstract: bool,
    ) -> swc::Class {
        let mut class = swc::Class {
            span: self.span_from_base(base),
            ctxt: SyntaxContext::empty(),
            decorators: vec![],
            body: self.convert_class_body(body),
            super_class: super_class.map(|expr| Box::new(self.convert_expression(expr))),
            is_abstract,
            type_params: None,
            super_type_params: None,
            implements: vec![],
        };

        self.preserved_ast.borrow_mut().load_class(&mut class);

        class
    }

    fn convert_function_expression(&self, f: &FunctionExpression) -> swc::Function {
        let mut function = swc::Function {
            params: f
                .params
                .iter()
                .map(|param| self.convert_pattern_like_as_formal_parameter_omitting_types(param))
                .collect(),
            decorators: vec![],
            span: self.span_from_base(&f.base),
            ctxt: SyntaxContext::empty(),
            body: Some(self.convert_block_statement(&f.body)),
            is_generator: f.generator,
            is_async: f.is_async,
            type_params: None,
            return_type: None,
        };
        if !self.preserved_ast.borrow_mut().load_function(&mut function) {
            self.cold_fill_function_types_from_raw_node(
                &mut function,
                &f.params,
                f.return_type.as_ref(),
            );
        }
        function
    }

    fn convert_object_method_to_function(&self, m: &ObjectMethod) -> swc::Function {
        swc::Function {
            params: m
                .params
                .iter()
                .map(|param| self.convert_pattern_like_as_formal_parameter_omitting_types(param))
                .collect(),
            decorators: vec![],
            span: self.span_from_base(&m.base),
            ctxt: SyntaxContext::empty(),
            body: Some(self.convert_block_statement(&m.body)),
            is_generator: m.generator,
            is_async: m.is_async,
            type_params: None,
            return_type: None,
        }
    }

    fn convert_arrow_function_expression(&self, arrow: &ArrowFunctionExpression) -> swc::Expr {
        let mut arrow_expr = swc::ArrowExpr {
            span: self.span_from_base(&arrow.base),
            ctxt: SyntaxContext::empty(),
            params: arrow
                .params
                .iter()
                .map(|param| self.convert_pattern_like_omitting_types(param))
                .collect(),
            body: Box::new(match arrow.body.as_ref() {
                ArrowFunctionBody::BlockStatement(block) => {
                    swc::BlockStmtOrExpr::BlockStmt(self.convert_block_statement(block))
                }
                ArrowFunctionBody::Expression(expr) => {
                    swc::BlockStmtOrExpr::Expr(Box::new(self.convert_expression(expr)))
                }
            }),
            is_async: arrow.is_async,
            is_generator: arrow.generator,
            type_params: None,
            return_type: None,
        };
        if !self.preserved_ast.borrow_mut().load_arrow(&mut arrow_expr) {
            self.cold_fill_arrow_types_from_raw_node(
                &mut arrow_expr,
                &arrow.params,
                arrow.return_type.as_ref(),
            );
        }

        swc::Expr::Arrow(arrow_expr)
    }

    fn convert_pattern_like_as_formal_parameter_omitting_types(
        &self,
        param: &PatternLike,
    ) -> swc::Param {
        swc::Param {
            span: self.pattern_span(param),
            decorators: vec![],
            pat: self.convert_pattern_like_omitting_types(param),
        }
    }

    fn convert_pattern_like_omitting_types(&self, pattern: &PatternLike) -> swc::Pat {
        match pattern {
            PatternLike::Identifier(id) => swc::Pat::Ident(swc::BindingIdent {
                id: self.convert_identifier(id),
                type_ann: None,
            }),
            PatternLike::ObjectPattern(obj) => swc::Pat::Object(swc::ObjectPat {
                span: self.span_from_base(&obj.base),
                props: obj
                    .properties
                    .iter()
                    .map(|prop| self.convert_object_pattern_property_omitting_types(prop))
                    .collect(),
                optional: false,
                type_ann: None,
            }),
            PatternLike::ArrayPattern(arr) => swc::Pat::Array(swc::ArrayPat {
                span: self.span_from_base(&arr.base),
                elems: arr
                    .elements
                    .iter()
                    .map(|elem| {
                        elem.as_ref()
                            .map(|elem| self.convert_pattern_like_omitting_types(elem))
                    })
                    .collect(),
                optional: false,
                type_ann: None,
            }),
            PatternLike::AssignmentPattern(assign) => swc::Pat::Assign(swc::AssignPat {
                span: self.span_from_base(&assign.base),
                left: Box::new(self.convert_pattern_like_omitting_types(&assign.left)),
                right: Box::new(self.convert_expression(&assign.right)),
            }),
            PatternLike::RestElement(rest) => swc::Pat::Rest(swc::RestPat {
                span: self.span_from_base(&rest.base),
                dot3_token: self.span_from_base(&rest.base),
                arg: Box::new(self.convert_pattern_like_omitting_types(&rest.argument)),
                type_ann: None,
            }),
            PatternLike::MemberExpression(member) => {
                swc::Pat::Expr(Box::new(self.convert_member_expression(member)))
            }
            PatternLike::TSAsExpression(ts) => swc::Pat::Expr(Box::new(
                self.convert_expression(&Expression::TSAsExpression(ts.clone())),
            )),
            PatternLike::TSSatisfiesExpression(ts) => swc::Pat::Expr(Box::new(
                self.convert_expression(&Expression::TSSatisfiesExpression(ts.clone())),
            )),
            PatternLike::TSNonNullExpression(ts) => swc::Pat::Expr(Box::new(
                self.convert_expression(&Expression::TSNonNullExpression(ts.clone())),
            )),
            PatternLike::TSTypeAssertion(ts) => swc::Pat::Expr(Box::new(
                self.convert_expression(&Expression::TSTypeAssertion(ts.clone())),
            )),
            PatternLike::TypeCastExpression(type_cast) => self.convert_pattern_like_omitting_types(
                &PatternLike::TSAsExpression(TSAsExpression {
                    base: type_cast.base.clone(),
                    expression: type_cast.expression.clone(),
                    type_annotation: type_cast.type_annotation.clone(),
                }),
            ),
        }
    }

    fn convert_object_pattern_property_omitting_types(
        &self,
        prop: &ObjectPatternProperty,
    ) -> swc::ObjectPatProp {
        match prop {
            ObjectPatternProperty::ObjectProperty(prop) => {
                self.convert_object_pattern_prop_omitting_types(prop)
            }
            ObjectPatternProperty::RestElement(rest) => {
                self.convert_rest_element_as_object_pat_prop_omitting_types(rest)
            }
        }
    }

    fn convert_object_pattern_prop_omitting_types(
        &self,
        prop: &ObjectPatternProp,
    ) -> swc::ObjectPatProp {
        if prop.shorthand {
            if let Expression::Identifier(key) = prop.key.as_ref() {
                match prop.value.as_ref() {
                    PatternLike::Identifier(id) if id.name == key.name => {
                        return swc::ObjectPatProp::Assign(swc::AssignPatProp {
                            span: self.span_from_base(&prop.base),
                            key: swc::BindingIdent {
                                id: self.convert_identifier(id),
                                type_ann: None,
                            },
                            value: None,
                        });
                    }
                    PatternLike::AssignmentPattern(assign) => match assign.left.as_ref() {
                        PatternLike::Identifier(id) if id.name == key.name => {
                            return swc::ObjectPatProp::Assign(swc::AssignPatProp {
                                span: self.span_from_base(&prop.base),
                                key: swc::BindingIdent {
                                    id: self.convert_identifier(id),
                                    type_ann: None,
                                },
                                value: Some(Box::new(self.convert_expression(&assign.right))),
                            });
                        }
                        _ => {}
                    },
                    _ => {}
                }
            }
        }

        swc::ObjectPatProp::KeyValue(swc::KeyValuePatProp {
            key: self.convert_expression_as_prop_name(&prop.key, prop.computed),
            value: Box::new(self.convert_pattern_like_omitting_types(&prop.value)),
        })
    }

    fn convert_rest_element_as_object_pat_prop_omitting_types(
        &self,
        rest: &RestElement,
    ) -> swc::ObjectPatProp {
        let swc::Pat::Rest(rest) =
            self.convert_pattern_like_omitting_types(&PatternLike::RestElement(rest.clone()))
        else {
            return swc::ObjectPatProp::Rest(swc::RestPat {
                span: self.span_from_base(&rest.base),
                dot3_token: self.span_from_base(&rest.base),
                arg: Box::new(swc::Pat::Invalid(swc::Invalid { span: DUMMY_SP })),
                type_ann: None,
            });
        };
        swc::ObjectPatProp::Rest(rest)
    }

    fn convert_pattern_like_as_assign_target(&self, pattern: &PatternLike) -> swc::AssignTarget {
        match self.convert_pattern_like_omitting_types(pattern).try_into() {
            Ok(target) => target,
            Err(pattern) => match pattern {
                swc::Pat::Expr(expr) => expr.try_into().unwrap_or_else(|expr: Box<swc::Expr>| {
                    swc::SimpleAssignTarget::Invalid(swc::Invalid { span: expr.span() }).into()
                }),
                _ => swc::AssignTarget::Pat(
                    swc::AssignTargetPat::try_from(pattern).unwrap_or_else(|pattern| {
                        swc::AssignTargetPat::Invalid(swc::Invalid {
                            span: pattern.span(),
                        })
                    }),
                ),
            },
        }
    }

    fn convert_jsx_element(&self, el: &JSXElement) -> swc::JSXElement {
        swc::JSXElement {
            span: self.span_from_base(&el.base),
            opening: self.convert_jsx_opening_element(&el.opening_element),
            children: el
                .children
                .iter()
                .map(|child| self.convert_jsx_child(child))
                .collect(),
            closing: el
                .closing_element
                .as_ref()
                .map(|closing| self.convert_jsx_closing_element(closing)),
        }
    }

    fn convert_jsx_opening_element(&self, el: &JSXOpeningElement) -> swc::JSXOpeningElement {
        let mut opening = swc::JSXOpeningElement {
            name: self.convert_jsx_element_name(&el.name),
            span: self.span_from_base(&el.base),
            attrs: el
                .attributes
                .iter()
                .map(|attr| self.convert_jsx_attribute_item(attr))
                .collect(),
            self_closing: el.self_closing,
            type_args: None,
        };
        if !self
            .preserved_ast
            .borrow_mut()
            .load_jsx_opening_element(&mut opening)
        {
            self.cold_fill_jsx_opening_type_args_from_raw_node(
                &mut opening,
                el.type_parameters.as_ref(),
            );
        }
        opening
    }

    fn convert_jsx_closing_element(&self, el: &JSXClosingElement) -> swc::JSXClosingElement {
        swc::JSXClosingElement {
            span: self.span_from_base(&el.base),
            name: self.convert_jsx_element_name(&el.name),
        }
    }

    fn convert_jsx_element_name(&self, name: &JSXElementName) -> swc::JSXElementName {
        match name {
            JSXElementName::JSXIdentifier(id) => {
                swc::JSXElementName::Ident(self.convert_jsx_identifier(id))
            }
            JSXElementName::JSXMemberExpression(member) => {
                swc::JSXElementName::JSXMemberExpr(self.convert_jsx_member_expression(member))
            }
            JSXElementName::JSXNamespacedName(ns) => {
                swc::JSXElementName::JSXNamespacedName(swc::JSXNamespacedName {
                    span: self.span_from_base(&ns.base),
                    ns: self.make_ident_name(&ns.namespace.base, &ns.namespace.name),
                    name: self.make_ident_name(&ns.name.base, &ns.name.name),
                })
            }
        }
    }

    fn convert_jsx_member_expression(&self, expr: &JSXMemberExpression) -> swc::JSXMemberExpr {
        swc::JSXMemberExpr {
            span: self.span_from_base(&expr.base),
            obj: self.convert_jsx_member_expr_object(&expr.object),
            prop: self.make_ident_name(&expr.property.base, &expr.property.name),
        }
    }

    fn convert_jsx_member_expr_object(&self, object: &JSXMemberExprObject) -> swc::JSXObject {
        match object {
            JSXMemberExprObject::JSXIdentifier(id) => {
                swc::JSXObject::Ident(self.convert_jsx_identifier(id))
            }
            JSXMemberExprObject::JSXMemberExpression(member) => {
                swc::JSXObject::JSXMemberExpr(Box::new(self.convert_jsx_member_expression(member)))
            }
        }
    }

    fn convert_jsx_attribute_item(&self, item: &JSXAttributeItem) -> swc::JSXAttrOrSpread {
        match item {
            JSXAttributeItem::JSXAttribute(attr) => swc::JSXAttrOrSpread::JSXAttr(swc::JSXAttr {
                span: self.span_from_base(&attr.base),
                name: self.convert_jsx_attribute_name(&attr.name),
                value: attr
                    .value
                    .as_ref()
                    .map(|value| self.convert_jsx_attribute_value(value)),
            }),
            JSXAttributeItem::JSXSpreadAttribute(spread) => {
                swc::JSXAttrOrSpread::SpreadElement(swc::SpreadElement {
                    dot3_token: self.span_from_base(&spread.base),
                    expr: Box::new(self.convert_expression(&spread.argument)),
                })
            }
        }
    }

    fn convert_jsx_attribute_name(&self, name: &JSXAttributeName) -> swc::JSXAttrName {
        match name {
            JSXAttributeName::JSXIdentifier(id) => {
                swc::JSXAttrName::Ident(self.make_ident_name(&id.base, &id.name))
            }
            JSXAttributeName::JSXNamespacedName(ns) => {
                swc::JSXAttrName::JSXNamespacedName(swc::JSXNamespacedName {
                    span: self.span_from_base(&ns.base),
                    ns: self.make_ident_name(&ns.namespace.base, &ns.namespace.name),
                    name: self.make_ident_name(&ns.name.base, &ns.name.name),
                })
            }
        }
    }

    fn convert_jsx_attribute_value(&self, value: &JSXAttributeValue) -> swc::JSXAttrValue {
        match value {
            JSXAttributeValue::StringLiteral(lit) => {
                swc::JSXAttrValue::Str(self.convert_string_literal(lit))
            }
            JSXAttributeValue::JSXExpressionContainer(container) => {
                swc::JSXAttrValue::JSXExprContainer(swc::JSXExprContainer {
                    span: self.span_from_base(&container.base),
                    expr: self.convert_jsx_expression_container_expr(&container.expression),
                })
            }
            JSXAttributeValue::JSXElement(el) => {
                swc::JSXAttrValue::JSXElement(Box::new(self.convert_jsx_element(el)))
            }
            JSXAttributeValue::JSXFragment(frag) => {
                swc::JSXAttrValue::JSXFragment(self.convert_jsx_fragment(frag))
            }
        }
    }

    fn convert_jsx_expression_container_expr(
        &self,
        expr: &JSXExpressionContainerExpr,
    ) -> swc::JSXExpr {
        match expr {
            JSXExpressionContainerExpr::JSXEmptyExpression(empty) => {
                swc::JSXExpr::JSXEmptyExpr(swc::JSXEmptyExpr {
                    span: self.span_from_base(&empty.base),
                })
            }
            JSXExpressionContainerExpr::Expression(expr) => {
                swc::JSXExpr::Expr(Box::new(self.convert_expression(expr)))
            }
        }
    }

    fn convert_jsx_child(&self, child: &JSXChild) -> swc::JSXElementChild {
        match child {
            JSXChild::JSXElement(el) => {
                swc::JSXElementChild::JSXElement(Box::new(self.convert_jsx_element(el)))
            }
            JSXChild::JSXFragment(frag) => {
                swc::JSXElementChild::JSXFragment(self.convert_jsx_fragment(frag))
            }
            JSXChild::JSXExpressionContainer(container) => {
                swc::JSXElementChild::JSXExprContainer(swc::JSXExprContainer {
                    span: self.span_from_base(&container.base),
                    expr: self.convert_jsx_expression_container_expr(&container.expression),
                })
            }
            JSXChild::JSXSpreadChild(spread) => {
                swc::JSXElementChild::JSXSpreadChild(swc::JSXSpreadChild {
                    span: self.span_from_base(&spread.base),
                    expr: Box::new(self.convert_expression(&spread.expression)),
                })
            }
            JSXChild::JSXText(text) => swc::JSXElementChild::JSXText(swc::JSXText {
                span: self.span_from_base(&text.base),
                value: Atom::from(text.value.as_str()),
                raw: Atom::from(encode_jsx_text(&text.value)),
            }),
        }
    }

    fn convert_jsx_fragment(&self, frag: &JSXFragment) -> swc::JSXFragment {
        swc::JSXFragment {
            span: self.span_from_base(&frag.base),
            opening: swc::JSXOpeningFragment {
                span: self.span_from_base(&frag.opening_fragment.base),
            },
            children: frag
                .children
                .iter()
                .map(|child| self.convert_jsx_child(child))
                .collect(),
            closing: swc::JSXClosingFragment {
                span: self.span_from_base(&frag.closing_fragment.base),
            },
        }
    }

    fn convert_import_declaration(&self, decl: &ImportDeclaration) -> swc::ImportDecl {
        let mut import = swc::ImportDecl {
            span: self.span_from_base(&decl.base),
            specifiers: decl
                .specifiers
                .iter()
                .map(|specifier| self.convert_import_specifier(specifier))
                .collect(),
            src: Box::new(self.convert_string_literal(&decl.source)),
            type_only: matches!(
                decl.import_kind,
                Some(ImportKind::Type | ImportKind::Typeof)
            ),
            with: self
                .convert_with_clause(decl.attributes.as_deref().or(decl.assertions.as_deref())),
            phase: swc::ImportPhase::Evaluation,
        };
        self.preserved_ast.borrow_mut().load_import(&mut import);
        import
    }

    fn convert_with_clause(
        &self,
        attributes: Option<&[ImportAttribute]>,
    ) -> Option<Box<swc::ObjectLit>> {
        let attributes = attributes?;
        Some(Box::new(swc::ObjectLit {
            span: attributes
                .first()
                .map_or(DUMMY_SP, |attr| self.span_from_base(&attr.base)),
            props: attributes
                .iter()
                .map(|attr| {
                    swc::PropOrSpread::Prop(Box::new(swc::Prop::KeyValue(
                        self.convert_import_attribute(attr),
                    )))
                })
                .collect(),
        }))
    }

    fn convert_import_attribute(&self, attr: &ImportAttribute) -> swc::KeyValueProp {
        swc::KeyValueProp {
            key: swc::PropName::Ident(self.make_ident_name(&attr.key.base, &attr.key.name)),
            value: Box::new(swc::Expr::Lit(swc::Lit::Str(
                self.convert_string_literal(&attr.value),
            ))),
        }
    }

    fn convert_import_specifier(&self, specifier: &ImportSpecifier) -> swc::ImportSpecifier {
        match specifier {
            ImportSpecifier::ImportSpecifier(specifier) => {
                // Only set `imported` if it differs from `local` — otherwise
                // SWC emits `foo as foo` instead of just `foo`.
                let imported_name = match &specifier.imported {
                    react_compiler_ast::declarations::ModuleExportName::Identifier(id) => {
                        Some(&id.name)
                    }
                    react_compiler_ast::declarations::ModuleExportName::StringLiteral(_) => None,
                };
                let imported = (imported_name != Some(&specifier.local.name))
                    .then(|| self.convert_module_export_name(&specifier.imported));
                swc::ImportSpecifier::Named(swc::ImportNamedSpecifier {
                    span: self.span_from_base(&specifier.base),
                    local: self.convert_identifier(&specifier.local),
                    imported,
                    is_type_only: matches!(
                        specifier.import_kind,
                        Some(ImportKind::Type | ImportKind::Typeof)
                    ),
                })
            }
            ImportSpecifier::ImportDefaultSpecifier(specifier) => {
                swc::ImportSpecifier::Default(swc::ImportDefaultSpecifier {
                    span: self.span_from_base(&specifier.base),
                    local: self.convert_identifier(&specifier.local),
                })
            }
            ImportSpecifier::ImportNamespaceSpecifier(specifier) => {
                swc::ImportSpecifier::Namespace(swc::ImportStarAsSpecifier {
                    span: self.span_from_base(&specifier.base),
                    local: self.convert_identifier(&specifier.local),
                })
            }
        }
    }

    fn convert_module_export_name(&self, name: &ModuleExportName) -> swc::ModuleExportName {
        match name {
            ModuleExportName::Identifier(id) => {
                swc::ModuleExportName::Ident(self.convert_identifier(id))
            }
            ModuleExportName::StringLiteral(lit) => {
                swc::ModuleExportName::Str(self.convert_string_literal(lit))
            }
        }
    }

    fn convert_export_named_declaration(&self, decl: &ExportNamedDeclaration) -> swc::ModuleDecl {
        if let Some(declaration) = decl.declaration.as_ref() {
            return swc::ModuleDecl::ExportDecl(swc::ExportDecl {
                span: self.span_from_base(&decl.base),
                decl: self.convert_declaration(declaration),
            });
        }
        swc::ModuleDecl::ExportNamed(swc::NamedExport {
            span: self.span_from_base(&decl.base),
            specifiers: decl
                .specifiers
                .iter()
                .map(|specifier| self.convert_export_specifier(specifier))
                .collect(),
            src: decl
                .source
                .as_ref()
                .map(|source| Box::new(self.convert_string_literal(source))),
            type_only: matches!(decl.export_kind, Some(ExportKind::Type)),
            with: self
                .convert_with_clause(decl.attributes.as_deref().or(decl.assertions.as_deref())),
        })
    }

    fn convert_declaration(&self, decl: &Declaration) -> swc::Decl {
        match decl {
            Declaration::FunctionDeclaration(func) => {
                swc::Decl::Fn(self.convert_function_declaration(func))
            }
            Declaration::ClassDeclaration(class) => swc::Decl::Class(swc::ClassDecl {
                ident: class.id.as_ref().map_or_else(
                    || self.quote_ident("__default_class"),
                    |id| self.convert_identifier(id),
                ),
                declare: class.declare.unwrap_or(false),
                class: Box::new(self.convert_class_declaration(class)),
            }),
            Declaration::VariableDeclaration(decl) => self.convert_variable_declaration(decl),
            Declaration::TSTypeAliasDeclaration(decl) => {
                if let swc::ModuleItem::Stmt(swc::Stmt::Decl(decl)) =
                    self.convert_ts_type_alias_declaration(decl)
                {
                    decl
                } else {
                    self.invalid_var_decl(&decl.base)
                }
            }
            Declaration::TSInterfaceDeclaration(decl) => {
                if let swc::ModuleItem::Stmt(swc::Stmt::Decl(decl)) =
                    self.convert_ts_interface_declaration(decl)
                {
                    decl
                } else {
                    self.invalid_var_decl(&decl.base)
                }
            }
            Declaration::TSEnumDeclaration(decl) => {
                if let swc::ModuleItem::Stmt(swc::Stmt::Decl(decl)) =
                    self.convert_ts_enum_declaration(decl)
                {
                    decl
                } else {
                    self.invalid_var_decl(&decl.base)
                }
            }
            Declaration::TSModuleDeclaration(decl) => {
                if let swc::ModuleItem::Stmt(swc::Stmt::Decl(decl)) =
                    self.convert_ts_module_declaration(decl)
                {
                    decl
                } else {
                    self.invalid_var_decl(&decl.base)
                }
            }
            Declaration::TSDeclareFunction(decl) => {
                if let swc::ModuleItem::Stmt(swc::Stmt::Decl(decl)) =
                    self.convert_ts_declare_function(decl)
                {
                    decl
                } else {
                    self.invalid_var_decl(&decl.base)
                }
            }
            Declaration::TypeAlias(_)
            | Declaration::OpaqueType(_)
            | Declaration::InterfaceDeclaration(_)
            | Declaration::EnumDeclaration(_) => {
                unreachable!("SWC forward conversion does not produce Flow declarations")
            }
        }
    }

    fn convert_export_specifier(&self, specifier: &ExportSpecifier) -> swc::ExportSpecifier {
        match specifier {
            ExportSpecifier::ExportSpecifier(specifier) => {
                let exported = match (&specifier.local, &specifier.exported) {
                    (
                        ModuleExportName::Identifier(local),
                        ModuleExportName::Identifier(exported),
                    ) if local.name == exported.name => None,
                    (_, exported) => Some(self.convert_module_export_name(exported)),
                };
                swc::ExportSpecifier::Named(swc::ExportNamedSpecifier {
                    span: self.span_from_base(&specifier.base),
                    orig: self.convert_module_export_name(&specifier.local),
                    exported,
                    is_type_only: matches!(specifier.export_kind, Some(ExportKind::Type)),
                })
            }
            ExportSpecifier::ExportDefaultSpecifier(specifier) => {
                swc::ExportSpecifier::Default(swc::ExportDefaultSpecifier {
                    exported: self.convert_identifier(&specifier.exported),
                })
            }
            ExportSpecifier::ExportNamespaceSpecifier(specifier) => {
                swc::ExportSpecifier::Namespace(swc::ExportNamespaceSpecifier {
                    span: self.span_from_base(&specifier.base),
                    name: self.convert_module_export_name(&specifier.exported),
                })
            }
        }
    }

    fn convert_export_default_declaration(
        &self,
        decl: &ExportDefaultDeclaration,
    ) -> swc::ModuleDecl {
        let mut preserved_decl = swc::ExportDefaultDecl {
            span: self.span_from_base(&decl.base),
            decl: swc::DefaultDecl::TsInterfaceDecl(Box::new(swc::TsInterfaceDecl {
                span: self.span_from_base(&decl.base),
                id: self.quote_ident("__default_interface"),
                declare: false,
                type_params: None,
                extends: vec![],
                body: swc::TsInterfaceBody {
                    span: self.span_from_base(&decl.base),
                    body: vec![],
                },
            })),
        };
        if self
            .preserved_ast
            .borrow_mut()
            .load_export_default_ts_interface(&mut preserved_decl)
        {
            return swc::ModuleDecl::ExportDefaultDecl(preserved_decl);
        }

        match self.convert_export_default_decl(&decl.declaration) {
            Ok(default_decl) => swc::ModuleDecl::ExportDefaultDecl(swc::ExportDefaultDecl {
                span: self.span_from_base(&decl.base),
                decl: default_decl,
            }),
            Err(expr) => swc::ModuleDecl::ExportDefaultExpr(swc::ExportDefaultExpr {
                span: self.span_from_base(&decl.base),
                expr: Box::new(expr),
            }),
        }
    }

    fn convert_export_default_decl(
        &self,
        decl: &ExportDefaultDecl,
    ) -> Result<swc::DefaultDecl, swc::Expr> {
        match decl {
            ExportDefaultDecl::FunctionDeclaration(func) => Ok(swc::DefaultDecl::Fn(swc::FnExpr {
                ident: func.id.as_ref().map(|id| self.convert_identifier(id)),
                function: self.convert_function_declaration(func).function,
            })),
            ExportDefaultDecl::ClassDeclaration(class) => {
                Ok(swc::DefaultDecl::Class(swc::ClassExpr {
                    ident: class.id.as_ref().map(|id| self.convert_identifier(id)),
                    class: Box::new(self.convert_class_declaration(class)),
                }))
            }
            ExportDefaultDecl::Expression(expr) => Err(self.convert_expression(expr)),
            ExportDefaultDecl::EnumDeclaration(enum_decl) => {
                Err(swc::Expr::Ident(self.quote_ident(&enum_decl.id.name)))
            }
        }
    }

    fn convert_export_all_declaration(&self, decl: &ExportAllDeclaration) -> swc::ExportAll {
        swc::ExportAll {
            span: self.span_from_base(&decl.base),
            src: Box::new(self.convert_string_literal(&decl.source)),
            type_only: matches!(decl.export_kind, Some(ExportKind::Type)),
            with: self
                .convert_with_clause(decl.attributes.as_deref().or(decl.assertions.as_deref())),
        }
    }

    fn convert_binary_operator(&self, op: &BinaryOperator) -> swc::BinaryOp {
        match op {
            BinaryOperator::Add => swc::BinaryOp::Add,
            BinaryOperator::Sub => swc::BinaryOp::Sub,
            BinaryOperator::Mul => swc::BinaryOp::Mul,
            BinaryOperator::Div => swc::BinaryOp::Div,
            BinaryOperator::Rem => swc::BinaryOp::Mod,
            BinaryOperator::Exp => swc::BinaryOp::Exp,
            BinaryOperator::Eq => swc::BinaryOp::EqEq,
            BinaryOperator::StrictEq => swc::BinaryOp::EqEqEq,
            BinaryOperator::Neq => swc::BinaryOp::NotEq,
            BinaryOperator::StrictNeq => swc::BinaryOp::NotEqEq,
            BinaryOperator::Lt => swc::BinaryOp::Lt,
            BinaryOperator::Lte => swc::BinaryOp::LtEq,
            BinaryOperator::Gt => swc::BinaryOp::Gt,
            BinaryOperator::Gte => swc::BinaryOp::GtEq,
            BinaryOperator::Shl => swc::BinaryOp::LShift,
            BinaryOperator::Shr => swc::BinaryOp::RShift,
            BinaryOperator::UShr => swc::BinaryOp::ZeroFillRShift,
            BinaryOperator::BitOr => swc::BinaryOp::BitOr,
            BinaryOperator::BitXor => swc::BinaryOp::BitXor,
            BinaryOperator::BitAnd => swc::BinaryOp::BitAnd,
            BinaryOperator::In => swc::BinaryOp::In,
            BinaryOperator::Instanceof => swc::BinaryOp::InstanceOf,
            BinaryOperator::Pipeline => swc::BinaryOp::Add,
        }
    }

    fn convert_logical_operator(&self, op: &LogicalOperator) -> swc::BinaryOp {
        match op {
            LogicalOperator::Or => swc::BinaryOp::LogicalOr,
            LogicalOperator::And => swc::BinaryOp::LogicalAnd,
            LogicalOperator::NullishCoalescing => swc::BinaryOp::NullishCoalescing,
        }
    }

    fn convert_unary_operator(&self, op: &UnaryOperator) -> swc::UnaryOp {
        match op {
            UnaryOperator::Neg => swc::UnaryOp::Minus,
            UnaryOperator::Plus => swc::UnaryOp::Plus,
            UnaryOperator::Not => swc::UnaryOp::Bang,
            UnaryOperator::BitNot => swc::UnaryOp::Tilde,
            UnaryOperator::TypeOf => swc::UnaryOp::TypeOf,
            UnaryOperator::Void => swc::UnaryOp::Void,
            UnaryOperator::Delete => swc::UnaryOp::Delete,
            UnaryOperator::Throw => swc::UnaryOp::Void,
        }
    }

    fn convert_update_operator(&self, op: &UpdateOperator) -> swc::UpdateOp {
        match op {
            UpdateOperator::Increment => swc::UpdateOp::PlusPlus,
            UpdateOperator::Decrement => swc::UpdateOp::MinusMinus,
        }
    }

    fn convert_assignment_operator(&self, op: &AssignmentOperator) -> swc::AssignOp {
        match op {
            AssignmentOperator::Assign => swc::AssignOp::Assign,
            AssignmentOperator::AddAssign => swc::AssignOp::AddAssign,
            AssignmentOperator::SubAssign => swc::AssignOp::SubAssign,
            AssignmentOperator::MulAssign => swc::AssignOp::MulAssign,
            AssignmentOperator::DivAssign => swc::AssignOp::DivAssign,
            AssignmentOperator::RemAssign => swc::AssignOp::ModAssign,
            AssignmentOperator::ExpAssign => swc::AssignOp::ExpAssign,
            AssignmentOperator::ShlAssign => swc::AssignOp::LShiftAssign,
            AssignmentOperator::ShrAssign => swc::AssignOp::RShiftAssign,
            AssignmentOperator::UShrAssign => swc::AssignOp::ZeroFillRShiftAssign,
            AssignmentOperator::BitOrAssign => swc::AssignOp::BitOrAssign,
            AssignmentOperator::BitXorAssign => swc::AssignOp::BitXorAssign,
            AssignmentOperator::BitAndAssign => swc::AssignOp::BitAndAssign,
            AssignmentOperator::OrAssign => swc::AssignOp::OrAssign,
            AssignmentOperator::AndAssign => swc::AssignOp::AndAssign,
            AssignmentOperator::NullishAssign => swc::AssignOp::NullishAssign,
        }
    }

    fn convert_identifier(&self, id: &Identifier) -> swc::Ident {
        swc::Ident {
            span: self.span_from_base(&id.base),
            ctxt: SyntaxContext::empty(),
            sym: self.atom(&id.name),
            optional: id.optional.unwrap_or(false),
        }
    }

    fn convert_jsx_identifier(&self, id: &JSXIdentifier) -> swc::Ident {
        swc::Ident {
            span: self.span_from_base(&id.base),
            ctxt: SyntaxContext::empty(),
            sym: self.atom(&id.name),
            optional: false,
        }
    }

    fn make_ident_name(&self, base: &BaseNode, name: &str) -> swc::IdentName {
        swc::IdentName::new(self.atom(name), self.span_from_base(base))
    }

    fn convert_string_literal(&self, lit: &StringLiteral) -> swc::Str {
        swc::Str {
            span: self.span_from_base(&lit.base),
            value: lit.value.to_string_lossy().into(),
            raw: None,
        }
    }

    fn quote_ident(&self, name: &str) -> swc::Ident {
        swc::Ident {
            sym: self.atom(name),
            ..Default::default()
        }
    }

    fn expression_span(&self, expr: &Expression) -> Span {
        Self::expression_base(expr).map_or(DUMMY_SP, |base| self.span_from_base(base))
    }

    fn pattern_span(&self, pattern: &PatternLike) -> Span {
        match pattern {
            PatternLike::Identifier(id) => self.span_from_base(&id.base),
            PatternLike::ObjectPattern(pattern) => self.span_from_base(&pattern.base),
            PatternLike::ArrayPattern(pattern) => self.span_from_base(&pattern.base),
            PatternLike::AssignmentPattern(pattern) => self.span_from_base(&pattern.base),
            PatternLike::RestElement(pattern) => self.span_from_base(&pattern.base),
            PatternLike::MemberExpression(pattern) => self.span_from_base(&pattern.base),
            PatternLike::TSAsExpression(pattern) => self.span_from_base(&pattern.base),
            PatternLike::TSSatisfiesExpression(pattern) => self.span_from_base(&pattern.base),
            PatternLike::TSNonNullExpression(pattern) => self.span_from_base(&pattern.base),
            PatternLike::TSTypeAssertion(pattern) => self.span_from_base(&pattern.base),
            PatternLike::TypeCastExpression(pattern) => self.span_from_base(&pattern.base),
        }
    }

    fn convert_class_body(&self, _body: &ClassBody) -> Vec<swc::ClassMember> {
        // Class member JSON is a passthrough in the forward converter. Full
        // member fidelity comes from `PreservedAst::load_class`.
        vec![]
    }

    fn convert_ts_type_alias_declaration(&self, decl: &TSTypeAliasDeclaration) -> swc::ModuleItem {
        let mut ts_decl = swc::TsTypeAliasDecl {
            span: self.span_from_base(&decl.base),
            declare: decl.declare.unwrap_or(false),
            id: self.convert_identifier(&decl.id),
            type_params: None,
            type_ann: self.any_ts_type(self.span_from_base(&decl.base)),
        };
        if !self
            .preserved_ast
            .borrow_mut()
            .load_ts_type_alias(&mut ts_decl)
        {
            self.cold_fill_ts_type_alias_from_raw_node(
                &mut ts_decl,
                &decl.type_annotation,
                self.span_from_base(&decl.base),
            );
        }
        swc::Stmt::Decl(swc::Decl::TsTypeAlias(Box::new(ts_decl))).into()
    }

    fn convert_ts_interface_declaration(&self, decl: &TSInterfaceDeclaration) -> swc::ModuleItem {
        let mut ts_decl = swc::TsInterfaceDecl {
            span: self.span_from_base(&decl.base),
            id: self.convert_identifier(&decl.id),
            declare: decl.declare.unwrap_or(false),
            type_params: None,
            extends: vec![],
            body: swc::TsInterfaceBody {
                span: DUMMY_SP,
                body: vec![],
            },
        };

        self.preserved_ast
            .borrow_mut()
            .load_ts_interface(&mut ts_decl);

        swc::Stmt::Decl(swc::Decl::TsInterface(Box::new(ts_decl))).into()
    }

    fn convert_ts_enum_declaration(&self, decl: &TSEnumDeclaration) -> swc::ModuleItem {
        let mut ts_decl = swc::TsEnumDecl {
            span: self.span_from_base(&decl.base),
            declare: decl.declare.unwrap_or(false),
            is_const: decl.is_const.unwrap_or(false),
            id: self.convert_identifier(&decl.id),
            members: vec![],
        };
        self.preserved_ast.borrow_mut().load_ts_enum(&mut ts_decl);
        swc::Stmt::Decl(swc::Decl::TsEnum(Box::new(ts_decl))).into()
    }

    fn convert_ts_module_declaration(&self, decl: &TSModuleDeclaration) -> swc::ModuleItem {
        let span = self.span_from_base(&decl.base);
        let id = self.quote_ident("__namespace");

        let mut item: swc::ModuleItem =
            swc::Stmt::Decl(swc::Decl::TsModule(Box::new(swc::TsModuleDecl {
                span,
                id: id.into(),
                declare: decl.declare.unwrap_or(false),
                global: decl.global.unwrap_or(false),
                namespace: false,
                body: None,
            })))
            .into();

        if !self.preserved_ast.borrow_mut().load_module_item(&mut item) {
            // Skip unrecognized module items.
            // We believe the React compiler does not emit additional module items.
            item = swc::Stmt::Empty(swc::EmptyStmt { span }).into();
        }
        item
    }

    fn convert_ts_declare_function(&self, decl: &TSDeclareFunction) -> swc::ModuleItem {
        let id = decl.id.as_ref().map_or_else(
            || self.quote_ident("__declare"),
            |id| self.convert_identifier(id),
        );
        let mut function = swc::Function {
            span: self.span_from_base(&decl.base),
            ctxt: SyntaxContext::empty(),

            is_generator: decl.generator.unwrap_or(false),
            is_async: decl.is_async.unwrap_or(false),
            ..Default::default()
        };
        if !self
            .preserved_ast
            .borrow_mut()
            .load_ts_function(&mut function)
        {
            self.cold_fill_ts_function_from_raw_node(
                &mut function,
                &decl.params,
                decl.return_type.as_ref(),
            );
        }

        swc::Stmt::Decl(swc::Decl::Fn(swc::FnDecl {
            ident: id,
            declare: decl.declare.unwrap_or(true),
            function: Box::new(function),
        }))
        .into()
    }

    fn invalid_var_decl(&self, base: &BaseNode) -> swc::Decl {
        swc::Decl::Var(Box::new(swc::VarDecl {
            span: self.span_from_base(base),
            ctxt: SyntaxContext::empty(),
            kind: swc::VarDeclKind::Const,
            declare: false,
            decls: vec![swc::VarDeclarator {
                span: self.span_from_base(base),
                name: swc::Pat::Ident(swc::BindingIdent {
                    id: self.quote_ident("__unsupported_declaration"),
                    type_ann: None,
                }),
                init: None,
                definite: false,
            }],
        }))
    }
}

impl ReverseCtx {
    // JSON reconstruction is only a fidelity fallback when no preserved SWC
    // shell is available for TypeScript metadata.

    #[cold]
    fn cold_convert_ts_type_annotation_from_raw_node(
        &self,
        value: Option<&RawNode>,
    ) -> Option<Box<swc::TsTypeAnn>> {
        value.and_then(|value| {
            let value = value.parse_value();
            self.convert_ts_type_annotation_from_json(&value)
        })
    }

    #[cold]
    fn cold_convert_ts_type_parameter_instantiation_from_raw_nodes(
        &self,
        type_parameters: Option<&RawNode>,
        type_arguments: Option<&RawNode>,
    ) -> Option<Box<swc::TsTypeParamInstantiation>> {
        type_parameters.or(type_arguments).and_then(|value| {
            let value = value.parse_value();
            self.convert_ts_type_parameter_instantiation_from_json(&value)
        })
    }

    #[cold]
    fn cold_fill_ts_as_expr_from_raw_node(
        &self,
        expr: &mut swc::TsAsExpr,
        type_annotation: &RawNode,
        fallback_span: Span,
    ) {
        let type_annotation = type_annotation.parse_value();
        expr.type_ann = self
            .convert_ts_type_from_json(&type_annotation)
            .unwrap_or_else(|| self.any_ts_type(fallback_span));
    }

    #[cold]
    fn cold_fill_ts_satisfies_expr_from_raw_node(
        &self,
        expr: &mut swc::TsSatisfiesExpr,
        type_annotation: &RawNode,
        fallback_span: Span,
    ) {
        let type_annotation = type_annotation.parse_value();
        expr.type_ann = self
            .convert_ts_type_from_json(&type_annotation)
            .unwrap_or_else(|| self.any_ts_type(fallback_span));
    }

    #[cold]
    fn cold_fill_ts_type_assertion_from_raw_node(
        &self,
        expr: &mut swc::TsTypeAssertion,
        type_annotation: &RawNode,
        fallback_span: Span,
    ) {
        let type_annotation = type_annotation.parse_value();
        expr.type_ann = self
            .convert_ts_type_from_json(&type_annotation)
            .unwrap_or_else(|| self.any_ts_type(fallback_span));
    }

    #[cold]
    fn cold_fill_ts_instantiation_from_raw_node(
        &self,
        expr: &mut swc::TsInstantiation,
        type_parameters: &RawNode,
        fallback_span: Span,
    ) {
        let type_parameters = type_parameters.parse_value();
        expr.type_args = self
            .convert_ts_type_parameter_instantiation_from_json(&type_parameters)
            .unwrap_or_else(|| {
                Box::new(swc::TsTypeParamInstantiation {
                    span: fallback_span,
                    params: vec![],
                })
            });
    }

    #[cold]
    fn cold_fill_call_type_args_from_raw_nodes(
        &self,
        call: &mut swc::CallExpr,
        type_parameters: Option<&RawNode>,
        type_arguments: Option<&RawNode>,
    ) {
        call.type_args = self.cold_convert_ts_type_parameter_instantiation_from_raw_nodes(
            type_parameters,
            type_arguments,
        );
    }

    #[cold]
    fn cold_fill_opt_call_type_args_from_raw_nodes(
        &self,
        call: &mut swc::OptCall,
        type_parameters: Option<&RawNode>,
        type_arguments: Option<&RawNode>,
    ) {
        call.type_args = self.cold_convert_ts_type_parameter_instantiation_from_raw_nodes(
            type_parameters,
            type_arguments,
        );
    }

    #[cold]
    fn cold_fill_new_type_args_from_raw_nodes(
        &self,
        expr: &mut swc::NewExpr,
        type_parameters: Option<&RawNode>,
        type_arguments: Option<&RawNode>,
    ) {
        expr.type_args = self.cold_convert_ts_type_parameter_instantiation_from_raw_nodes(
            type_parameters,
            type_arguments,
        );
    }

    #[cold]
    fn cold_fill_tagged_tpl_type_params_from_raw_node(
        &self,
        tpl: &mut swc::TaggedTpl,
        type_parameters: Option<&RawNode>,
    ) {
        tpl.type_params = type_parameters.and_then(|value| {
            let value = value.parse_value();
            self.convert_ts_type_parameter_instantiation_from_json(&value)
        });
    }

    #[cold]
    fn cold_fill_jsx_opening_type_args_from_raw_node(
        &self,
        opening: &mut swc::JSXOpeningElement,
        type_parameters: Option<&RawNode>,
    ) {
        opening.type_args = type_parameters.and_then(|value| {
            let value = value.parse_value();
            self.convert_ts_type_parameter_instantiation_from_json(&value)
        });
    }

    #[cold]
    fn cold_fill_function_types_from_raw_node(
        &self,
        function: &mut swc::Function,
        params: &[PatternLike],
        return_type: Option<&RawNode>,
    ) {
        for (param, source) in function.params.iter_mut().zip(params) {
            self.cold_fill_param_type_from_pattern_like(param, source);
        }
        function.return_type = self.cold_convert_ts_type_annotation_from_raw_node(return_type);
    }

    #[cold]
    fn cold_fill_ts_function_from_raw_node(
        &self,
        function: &mut swc::Function,
        params: &[RawNode],
        return_type: Option<&RawNode>,
    ) {
        function.params = params
            .iter()
            .enumerate()
            .map(|(index, raw_param)| self.cold_convert_ts_declare_raw_param(index, raw_param))
            .collect();
        function.return_type = self.cold_convert_ts_type_annotation_from_raw_node(return_type);
    }

    #[cold]
    fn cold_convert_ts_declare_raw_param(&self, index: usize, raw_param: &RawNode) -> swc::Param {
        let value = raw_param.parse_value();
        let span = self.span_from_json(&value);
        let fallback_name = format!("_{index}");
        let mut param: swc_ecma_ast::Param = swc::Param {
            span,
            decorators: vec![],
            pat: self.cold_convert_ts_declare_raw_param_pat(&value, &fallback_name),
        };

        self.cold_fill_raw_pat_type_ann(&mut param.pat, &value);

        param
    }

    #[cold]
    fn cold_convert_ts_declare_raw_param_pat(
        &self,
        value: &Value,
        fallback_name: &str,
    ) -> swc::Pat {
        match json_type(value) {
            Some("Identifier") => self
                .raw_binding_ident(
                    DUMMY_SP,
                    json_str(value, "name").unwrap_or(fallback_name),
                    json_bool(value, "optional").unwrap_or(false),
                )
                .into(),
            Some("RestElement") => swc::RestPat {
                span: DUMMY_SP,
                dot3_token: DUMMY_SP,
                arg: Box::new(swc::Pat::Ident(self.raw_binding_ident(
                    DUMMY_SP,
                    fallback_name,
                    false,
                ))),
                type_ann: None,
            }
            .into(),
            _ => self
                .raw_binding_ident(
                    DUMMY_SP,
                    fallback_name,
                    json_bool(value, "optional").unwrap_or(false),
                )
                .into(),
        }
    }

    fn raw_binding_ident(&self, span: Span, name: &str, optional: bool) -> swc::BindingIdent {
        swc::BindingIdent {
            id: swc::Ident {
                span,
                ctxt: SyntaxContext::empty(),
                sym: self.atom(name),
                optional,
            },
            type_ann: None,
        }
    }

    #[cold]
    fn cold_fill_raw_pat_type_ann(&self, pat: &mut swc::Pat, value: &Value) {
        let Some(type_ann_value) = top_level_raw_pattern_type_ann(value) else {
            return;
        };
        let Some(type_ann) = self.convert_ts_type_annotation_from_json(type_ann_value) else {
            return;
        };

        set_top_level_pat_type_ann(pat, type_ann);
    }

    #[cold]
    fn cold_fill_arrow_types_from_raw_node(
        &self,
        arrow: &mut swc::ArrowExpr,
        params: &[PatternLike],
        return_type: Option<&RawNode>,
    ) {
        for (param, source) in arrow.params.iter_mut().zip(params) {
            self.cold_fill_pat_type_from_pattern_like(param, source);
        }
        arrow.return_type = self.cold_convert_ts_type_annotation_from_raw_node(return_type);
    }

    #[cold]
    fn cold_fill_var_decl_types_from_variable_declarators(
        &self,
        decl: &mut swc::VarDecl,
        declarations: &[VariableDeclarator],
    ) {
        for (decl, source) in decl.decls.iter_mut().zip(declarations) {
            self.cold_fill_pat_type_from_pattern_like(&mut decl.name, &source.id);
        }
    }

    #[cold]
    fn cold_fill_param_type_from_pattern_like(&self, param: &mut swc::Param, source: &PatternLike) {
        self.cold_fill_pat_type_from_pattern_like(&mut param.pat, source);
    }

    #[cold]
    fn cold_fill_pat_type_from_pattern_like(&self, pat: &mut swc::Pat, source: &PatternLike) {
        let Some(type_ann) = self.cold_pattern_type_annotation_from_pattern_like(source) else {
            return;
        };

        set_top_level_pat_type_ann(pat, type_ann);
    }

    #[cold]
    fn cold_fill_ts_type_alias_from_raw_node(
        &self,
        decl: &mut swc::TsTypeAliasDecl,
        type_annotation: &RawNode,
        fallback_span: Span,
    ) {
        let type_annotation = type_annotation.parse_value();
        decl.type_ann = self
            .convert_ts_type_from_json(&type_annotation)
            .unwrap_or_else(|| self.any_ts_type(fallback_span));
    }

    #[cold]
    fn cold_pattern_type_annotation_from_pattern_like(
        &self,
        pattern: &PatternLike,
    ) -> Option<Box<swc::TsTypeAnn>> {
        self.cold_convert_ts_type_annotation_from_raw_node(top_level_pattern_type_ann(pattern))
    }
}

impl ReverseCtx {
    #[cold]
    fn span_from_json(&self, value: &serde_json::Value) -> Span {
        let start = json_u64(value, "start");
        let end = json_u64(value, "end");
        match (start, end) {
            (Some(start), Some(end)) => Span::new(BytePos(start as u32), BytePos(end as u32)),
            (Some(start), None) => Span::new(BytePos(start as u32), BytePos(start as u32)),
            _ => DUMMY_SP,
        }
    }

    #[cold]
    fn convert_ts_type_annotation_from_json(
        &self,
        value: &serde_json::Value,
    ) -> Option<Box<swc::TsTypeAnn>> {
        let ty = if json_type(value) == Some("TSTypeAnnotation") {
            self.convert_ts_type_from_json(value.get("typeAnnotation")?)?
        } else {
            self.convert_ts_type_from_json(value)?
        };
        Some(Box::new(swc::TsTypeAnn {
            span: self.span_from_json(value),
            type_ann: ty,
        }))
    }

    #[cold]
    fn convert_ts_type_from_json(&self, value: &serde_json::Value) -> Option<Box<swc::TsType>> {
        let span = self.span_from_json(value);
        let type_name = json_type(value)?;
        if let Some(kind) = ts_keyword_type_kind(type_name) {
            return Some(Box::new(swc::TsType::TsKeywordType(swc::TsKeywordType {
                span,
                kind,
            })));
        }

        let ty = match type_name {
            "TSThisType" => swc::TsType::TsThisType(swc::TsThisType { span }),
            "TSArrayType" => swc::TsType::TsArrayType(swc::TsArrayType {
                span,
                elem_type: self.convert_ts_type_from_json(value.get("elementType")?)?,
            }),
            "TSUnionType" => {
                let types = json_array(value, "types")?
                    .iter()
                    .filter_map(|ty| self.convert_ts_type_from_json(ty))
                    .collect();
                swc::TsType::TsUnionOrIntersectionType(swc::TsUnionOrIntersectionType::TsUnionType(
                    swc::TsUnionType { span, types },
                ))
            }
            "TSParenthesizedType" => swc::TsType::TsParenthesizedType(swc::TsParenthesizedType {
                span,
                type_ann: self.convert_ts_type_from_json(value.get("typeAnnotation")?)?,
            }),
            "TSTypeOperator" => {
                let op = ts_type_operator_op(json_str(value, "operator")?)?;
                swc::TsType::TsTypeOperator(swc::TsTypeOperator {
                    span,
                    op,
                    type_ann: self.convert_ts_type_from_json(value.get("typeAnnotation")?)?,
                })
            }
            "TSTypeReference" => swc::TsType::TsTypeRef(swc::TsTypeRef {
                span,
                type_name: self.convert_ts_type_name_from_json(value.get("typeName")?)?,
                type_params: self.convert_ts_type_parameter_instantiation_alias_from_json(value),
            }),
            "TSTypeQuery" => swc::TsType::TsTypeQuery(swc::TsTypeQuery {
                span,
                expr_name: self
                    .convert_ts_type_query_expr_name_from_json(value.get("exprName")?)?,
                type_args: self.convert_ts_type_parameter_instantiation_alias_from_json(value),
            }),
            "TSIndexedAccessType" => swc::TsType::TsIndexedAccessType(swc::TsIndexedAccessType {
                span,
                readonly: false,
                obj_type: self.convert_ts_type_from_json(value.get("objectType")?)?,
                index_type: self.convert_ts_type_from_json(value.get("indexType")?)?,
            }),
            "TSLiteralType" => swc::TsType::TsLitType(swc::TsLitType {
                span,
                lit: self.convert_ts_literal_from_json(value.get("literal")?)?,
            }),
            _ => return None,
        };
        Some(Box::new(ty))
    }

    #[cold]
    fn convert_ts_type_name_from_json(
        &self,
        value: &serde_json::Value,
    ) -> Option<swc::TsEntityName> {
        let span = self.span_from_json(value);
        match json_type(value)? {
            "Identifier" => Some(swc::TsEntityName::Ident(swc::Ident {
                span,
                ctxt: SyntaxContext::empty(),
                sym: Atom::from(json_str(value, "name")?),
                optional: false,
            })),
            "TSQualifiedName" => {
                let left = self.convert_ts_type_name_from_json(value.get("left")?)?;
                let right_value = value.get("right")?;
                let right = swc::IdentName::new(
                    Atom::from(json_str(right_value, "name")?),
                    self.span_from_json(right_value),
                );
                Some(swc::TsEntityName::TsQualifiedName(Box::new(
                    swc::TsQualifiedName { span, left, right },
                )))
            }
            _ => None,
        }
    }

    #[cold]
    fn convert_ts_type_query_expr_name_from_json(
        &self,
        value: &serde_json::Value,
    ) -> Option<swc::TsTypeQueryExpr> {
        Some(swc::TsTypeQueryExpr::TsEntityName(
            self.convert_ts_type_name_from_json(value)?,
        ))
    }

    #[cold]
    fn convert_ts_type_parameter_instantiation_from_json(
        &self,
        value: &serde_json::Value,
    ) -> Option<Box<swc::TsTypeParamInstantiation>> {
        let params = json_array(value, "params")?
            .iter()
            .filter_map(|ty| self.convert_ts_type_from_json(ty))
            .collect();
        Some(Box::new(swc::TsTypeParamInstantiation {
            span: self.span_from_json(value),
            params,
        }))
    }

    #[cold]
    fn convert_ts_type_parameter_instantiation_option_from_json(
        &self,
        value: Option<&serde_json::Value>,
    ) -> Option<Box<swc::TsTypeParamInstantiation>> {
        value.and_then(|value| self.convert_ts_type_parameter_instantiation_from_json(value))
    }

    #[cold]
    fn convert_ts_type_parameter_instantiation_alias_from_json(
        &self,
        value: &serde_json::Value,
    ) -> Option<Box<swc::TsTypeParamInstantiation>> {
        self.convert_ts_type_parameter_instantiation_option_from_json(
            value
                .get("typeParameters")
                .or_else(|| value.get("typeArguments")),
        )
    }

    #[cold]
    fn convert_ts_literal_from_json(&self, value: &serde_json::Value) -> Option<swc::TsLit> {
        let span = self.span_from_json(value);
        match json_type(value)? {
            "BooleanLiteral" => Some(swc::TsLit::Bool(swc::Bool {
                span,
                value: json_bool(value, "value")?,
            })),
            "NumericLiteral" => Some(swc::TsLit::Number(swc::Number {
                span,
                value: json_f64(value, "value")?,
                raw: None,
            })),
            "StringLiteral" => Some(swc::TsLit::Str(swc::Str {
                span,
                value: json_str(value, "value")?.into(),
                raw: None,
            })),
            "BigIntLiteral" => {
                let value = json_str(value, "value")?;
                Some(swc::TsLit::BigInt(swc::BigInt {
                    span,
                    value: Box::new(bigint_literal_value(value).parse().ok()?),
                    raw: Some(bigint_literal_raw(value)),
                }))
            }
            _ => None,
        }
    }
}

fn top_level_pattern_type_ann(pattern: &PatternLike) -> Option<&RawNode> {
    match pattern {
        PatternLike::Identifier(pattern) => pattern.type_annotation.as_ref(),
        PatternLike::ObjectPattern(pattern) => pattern.type_annotation.as_ref(),
        PatternLike::ArrayPattern(pattern) => pattern.type_annotation.as_ref(),
        PatternLike::AssignmentPattern(pattern) => pattern
            .type_annotation
            .as_ref()
            .or_else(|| top_level_pattern_type_ann(&pattern.left)),
        PatternLike::RestElement(pattern) => pattern.type_annotation.as_ref(),
        PatternLike::MemberExpression(_)
        | PatternLike::TSAsExpression(_)
        | PatternLike::TSSatisfiesExpression(_)
        | PatternLike::TSNonNullExpression(_)
        | PatternLike::TSTypeAssertion(_)
        | PatternLike::TypeCastExpression(_) => None,
    }
}

fn top_level_raw_pattern_type_ann(value: &Value) -> Option<&Value> {
    value.get("typeAnnotation").or_else(|| {
        if json_type(value) == Some("AssignmentPattern") {
            value.get("left").and_then(top_level_raw_pattern_type_ann)
        } else {
            None
        }
    })
}

fn set_top_level_pat_type_ann(pattern: &mut swc::Pat, type_ann: Box<swc::TsTypeAnn>) {
    match top_level_typed_pat_mut(pattern) {
        swc::Pat::Ident(pattern) => pattern.type_ann = Some(type_ann),
        swc::Pat::Array(pattern) => pattern.type_ann = Some(type_ann),
        swc::Pat::Object(pattern) => pattern.type_ann = Some(type_ann),
        swc::Pat::Rest(pattern) => pattern.type_ann = Some(type_ann),
        _ => {}
    }
}

fn top_level_typed_pat_mut(pattern: &mut swc::Pat) -> &mut swc::Pat {
    match pattern {
        swc::Pat::Assign(pattern) => &mut pattern.left,
        _ => pattern,
    }
}

trait MemberExpressionExt {
    fn property_base(&self) -> BaseNode;
}

impl MemberExpressionExt for MemberExpression {
    fn property_base(&self) -> BaseNode {
        ReverseCtx::expression_base(&self.property)
            .cloned()
            .unwrap_or_else(|| self.base.clone())
    }
}

impl MemberExpressionExt for OptionalMemberExpression {
    fn property_base(&self) -> BaseNode {
        ReverseCtx::expression_base(&self.property)
            .cloned()
            .unwrap_or_else(|| self.base.clone())
    }
}

fn bigint_literal_value(value: &str) -> &str {
    value.strip_suffix('n').unwrap_or(value)
}

fn bigint_literal_raw(value: &str) -> Atom {
    if value.ends_with('n') {
        return Atom::from(value);
    }

    let mut raw = String::with_capacity(value.len() + 1);
    raw.push_str(value);
    raw.push('n');
    Atom::from(raw)
}

fn set_statement_span(stmt: &mut swc::Stmt, span: Span) {
    match stmt {
        swc::Stmt::Block(s) => s.span = span,
        swc::Stmt::Empty(s) => s.span = span,
        swc::Stmt::Debugger(s) => s.span = span,
        swc::Stmt::With(s) => s.span = span,
        swc::Stmt::Return(s) => s.span = span,
        swc::Stmt::Labeled(s) => s.span = span,
        swc::Stmt::Break(s) => s.span = span,
        swc::Stmt::Continue(s) => s.span = span,
        swc::Stmt::If(s) => s.span = span,
        swc::Stmt::Switch(s) => s.span = span,
        swc::Stmt::Throw(s) => s.span = span,
        swc::Stmt::Try(s) => s.span = span,
        swc::Stmt::While(s) => s.span = span,
        swc::Stmt::DoWhile(s) => s.span = span,
        swc::Stmt::For(s) => s.span = span,
        swc::Stmt::ForIn(s) => s.span = span,
        swc::Stmt::ForOf(s) => s.span = span,
        swc::Stmt::Decl(decl) => match decl {
            swc::Decl::Class(d) => d.class.span = span,
            swc::Decl::Fn(d) => d.function.span = span,
            swc::Decl::Var(d) => d.span = span,
            swc::Decl::Using(d) => d.span = span,
            swc::Decl::TsInterface(d) => d.span = span,
            swc::Decl::TsTypeAlias(d) => d.span = span,
            swc::Decl::TsEnum(d) => d.span = span,
            swc::Decl::TsModule(d) => d.span = span,
        },
        swc::Stmt::Expr(s) => s.span = span,
    }
}

fn encode_jsx_text(raw: &str) -> String {
    let mut escaped = String::with_capacity(raw.len());
    for ch in raw.chars() {
        match ch {
            '&' => escaped.push_str("&amp;"),
            '<' => escaped.push_str("&lt;"),
            '>' => escaped.push_str("&gt;"),
            '{' => escaped.push_str("&#123;"),
            '}' => escaped.push_str("&#125;"),
            _ => escaped.push(ch),
        }
    }
    escaped
}

#[cold]
fn json_type(value: &Value) -> Option<&str> {
    json_str(value, "type")
}

#[cold]
fn json_str<'a>(value: &'a Value, key: &str) -> Option<&'a str> {
    value.get(key)?.as_str()
}

#[cold]
fn json_bool(value: &Value, key: &str) -> Option<bool> {
    value.get(key)?.as_bool()
}

#[cold]
fn json_f64(value: &Value, key: &str) -> Option<f64> {
    value.get(key)?.as_f64()
}

#[cold]
fn json_u64(value: &Value, key: &str) -> Option<u64> {
    value.get(key)?.as_u64()
}

#[cold]
fn json_array<'a>(value: &'a Value, key: &str) -> Option<&'a [Value]> {
    value.get(key)?.as_array().map(std::vec::Vec::as_slice)
}

#[cold]
fn ts_keyword_type_kind(type_name: &str) -> Option<swc::TsKeywordTypeKind> {
    match type_name {
        "TSAnyKeyword" => Some(swc::TsKeywordTypeKind::TsAnyKeyword),
        "TSBigIntKeyword" => Some(swc::TsKeywordTypeKind::TsBigIntKeyword),
        "TSBooleanKeyword" => Some(swc::TsKeywordTypeKind::TsBooleanKeyword),
        "TSIntrinsicKeyword" => Some(swc::TsKeywordTypeKind::TsIntrinsicKeyword),
        "TSNeverKeyword" => Some(swc::TsKeywordTypeKind::TsNeverKeyword),
        "TSNullKeyword" => Some(swc::TsKeywordTypeKind::TsNullKeyword),
        "TSNumberKeyword" => Some(swc::TsKeywordTypeKind::TsNumberKeyword),
        "TSObjectKeyword" => Some(swc::TsKeywordTypeKind::TsObjectKeyword),
        "TSStringKeyword" => Some(swc::TsKeywordTypeKind::TsStringKeyword),
        "TSSymbolKeyword" => Some(swc::TsKeywordTypeKind::TsSymbolKeyword),
        "TSUndefinedKeyword" => Some(swc::TsKeywordTypeKind::TsUndefinedKeyword),
        "TSUnknownKeyword" => Some(swc::TsKeywordTypeKind::TsUnknownKeyword),
        "TSVoidKeyword" => Some(swc::TsKeywordTypeKind::TsVoidKeyword),
        _ => None,
    }
}

#[cold]
fn ts_type_operator_op(operator: &str) -> Option<swc::TsTypeOperatorOp> {
    match operator {
        "keyof" => Some(swc::TsTypeOperatorOp::KeyOf),
        "unique" => Some(swc::TsTypeOperatorOp::Unique),
        "readonly" => Some(swc::TsTypeOperatorOp::ReadOnly),
        _ => None,
    }
}
