//! High-performance code generator for [`swc_es_ast`].

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

use std::{fmt, result};

use ryu_js::Buffer as NumberBuffer;
use swc_es_ast::*;

/// Result type for code generation.
pub type Result<T> = result::Result<T, CodegenError>;

/// Code generation configuration.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Config {
    /// Emit compact output when set.
    pub minify: bool,
}

impl Default for Config {
    #[inline]
    fn default() -> Self {
        Self { minify: false }
    }
}

/// Missing node kind inside an [`AstStore`].
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MissingNode {
    Program,
    Stmt,
    Decl,
    Pat,
    Expr,
    ModuleDecl,
    Class,
    ClassMember,
    Function,
    JSXElement,
    TsType,
}

/// Error produced by the code generator.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CodegenError {
    /// Missing AST node kind.
    pub missing: MissingNode,
}

impl CodegenError {
    #[inline]
    fn missing(kind: MissingNode) -> Self {
        Self { missing: kind }
    }
}

impl fmt::Display for CodegenError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let kind = match self.missing {
            MissingNode::Program => "program",
            MissingNode::Stmt => "statement",
            MissingNode::Decl => "declaration",
            MissingNode::Pat => "pattern",
            MissingNode::Expr => "expression",
            MissingNode::ModuleDecl => "module declaration",
            MissingNode::Class => "class",
            MissingNode::ClassMember => "class member",
            MissingNode::Function => "function",
            MissingNode::JSXElement => "jsx element",
            MissingNode::TsType => "typescript type",
        };

        write!(f, "missing {kind} node in AstStore")
    }
}

impl std::error::Error for CodegenError {}

/// Emits a program into a `String`.
#[inline]
pub fn emit_program(store: &AstStore, program: ProgramId, config: Config) -> Result<String> {
    let mut emitter = Emitter::new(store, config);
    emitter.emit_program(program)?;
    Ok(emitter.into_output())
}

/// Stateful emitter.
pub struct Emitter<'a> {
    store: &'a AstStore,
    config: Config,
    output: String,
}

impl<'a> Emitter<'a> {
    /// Creates a new emitter.
    #[inline]
    pub fn new(store: &'a AstStore, config: Config) -> Self {
        Self {
            store,
            config,
            output: String::with_capacity(1024),
        }
    }

    /// Returns the internal output string.
    #[inline]
    pub fn into_output(self) -> String {
        self.output
    }

    /// Emits a full [`Program`].
    pub fn emit_program(&mut self, program: ProgramId) -> Result<()> {
        let program = self
            .store
            .program(program)
            .ok_or_else(|| CodegenError::missing(MissingNode::Program))?;

        let body = program.body.clone();
        for (idx, stmt) in body.into_iter().enumerate() {
            self.emit_stmt(stmt)?;
            if !self.config.minify && idx + 1 != program.body.len() {
                self.output.push('\n');
            }
        }

        Ok(())
    }

    fn stmt(&self, id: StmtId) -> Result<&Stmt> {
        self.store
            .stmt(id)
            .ok_or_else(|| CodegenError::missing(MissingNode::Stmt))
    }

    fn decl(&self, id: DeclId) -> Result<&Decl> {
        self.store
            .decl(id)
            .ok_or_else(|| CodegenError::missing(MissingNode::Decl))
    }

    fn pat(&self, id: PatId) -> Result<&Pat> {
        self.store
            .pat(id)
            .ok_or_else(|| CodegenError::missing(MissingNode::Pat))
    }

    fn expr(&self, id: ExprId) -> Result<&Expr> {
        self.store
            .expr(id)
            .ok_or_else(|| CodegenError::missing(MissingNode::Expr))
    }

    fn module_decl(&self, id: ModuleDeclId) -> Result<&ModuleDecl> {
        self.store
            .module_decl(id)
            .ok_or_else(|| CodegenError::missing(MissingNode::ModuleDecl))
    }

    fn class(&self, id: ClassId) -> Result<&Class> {
        self.store
            .class(id)
            .ok_or_else(|| CodegenError::missing(MissingNode::Class))
    }

    fn class_member(&self, id: ClassMemberId) -> Result<&ClassMember> {
        self.store
            .class_member(id)
            .ok_or_else(|| CodegenError::missing(MissingNode::ClassMember))
    }

    fn function(&self, id: FunctionId) -> Result<&Function> {
        self.store
            .function(id)
            .ok_or_else(|| CodegenError::missing(MissingNode::Function))
    }

    fn jsx_element(&self, id: JSXElementId) -> Result<&JSXElement> {
        self.store
            .jsx_element(id)
            .ok_or_else(|| CodegenError::missing(MissingNode::JSXElement))
    }

    fn ts_type(&self, id: TsTypeId) -> Result<&TsType> {
        self.store
            .ts_type(id)
            .ok_or_else(|| CodegenError::missing(MissingNode::TsType))
    }

    #[inline]
    fn soft_space(&mut self) {
        if !self.config.minify {
            self.output.push(' ');
        }
    }

    #[inline]
    fn hard_space(&mut self) {
        self.output.push(' ');
    }

    #[inline]
    fn comma(&mut self) {
        self.output.push(',');
        self.soft_space();
    }

    fn emit_stmt(&mut self, id: StmtId) -> Result<()> {
        match self.stmt(id)?.clone() {
            Stmt::Empty(_) => {
                self.output.push(';');
            }
            Stmt::Block(block) => {
                self.emit_stmt_block(&block.stmts)?;
            }
            Stmt::Expr(stmt) => {
                self.emit_expr_stmt(stmt.expr)?;
                self.output.push(';');
            }
            Stmt::Return(stmt) => {
                self.output.push_str("return");
                if let Some(arg) = stmt.arg {
                    self.hard_space();
                    self.emit_expr_with_min_prec(arg, PREC_ASSIGN)?;
                }
                self.output.push(';');
            }
            Stmt::If(stmt) => {
                self.output.push_str("if");
                self.output.push('(');
                self.emit_expr_with_min_prec(stmt.test, PREC_SEQ)?;
                self.output.push(')');

                let cons_is_if = matches!(self.stmt(stmt.cons)?, Stmt::If(_));
                if stmt.alt.is_some() && cons_is_if {
                    self.hard_space();
                    self.output.push('{');
                    self.emit_stmt(stmt.cons)?;
                    self.output.push('}');
                } else {
                    self.emit_stmt_body(stmt.cons)?;
                }

                if let Some(alt) = stmt.alt {
                    self.hard_space();
                    self.output.push_str("else");
                    self.emit_stmt_body(alt)?;
                }
            }
            Stmt::While(stmt) => {
                self.output.push_str("while");
                self.output.push('(');
                self.emit_expr_with_min_prec(stmt.test, PREC_SEQ)?;
                self.output.push(')');
                self.emit_stmt_body(stmt.body)?;
            }
            Stmt::For(stmt) => {
                self.output.push_str("for");
                self.output.push('(');
                self.emit_for_head(&stmt.head)?;
                self.output.push(')');
                self.emit_stmt_body(stmt.body)?;
            }
            Stmt::DoWhile(stmt) => {
                self.output.push_str("do");
                self.emit_stmt_body(stmt.body)?;
                self.hard_space();
                self.output.push_str("while");
                self.output.push('(');
                self.emit_expr_with_min_prec(stmt.test, PREC_SEQ)?;
                self.output.push(')');
                self.output.push(';');
            }
            Stmt::Switch(stmt) => {
                self.output.push_str("switch");
                self.output.push('(');
                self.emit_expr_with_min_prec(stmt.discriminant, PREC_SEQ)?;
                self.output.push(')');
                self.output.push('{');
                for case in stmt.cases {
                    match case.test {
                        Some(test) => {
                            self.output.push_str("case");
                            self.hard_space();
                            self.emit_expr_with_min_prec(test, PREC_ASSIGN)?;
                            self.output.push(':');
                        }
                        None => {
                            self.output.push_str("default:");
                        }
                    }

                    for cons in case.cons {
                        self.emit_stmt(cons)?;
                    }
                }
                self.output.push('}');
            }
            Stmt::Try(stmt) => {
                self.output.push_str("try");
                self.emit_stmt_body(stmt.block)?;

                if let Some(handler) = stmt.handler {
                    self.hard_space();
                    self.output.push_str("catch");
                    if let Some(param) = handler.param {
                        self.output.push('(');
                        self.emit_pat(param)?;
                        self.output.push(')');
                    }
                    self.emit_stmt_body(handler.body)?;
                }

                if let Some(finalizer) = stmt.finalizer {
                    self.hard_space();
                    self.output.push_str("finally");
                    self.emit_stmt_body(finalizer)?;
                }
            }
            Stmt::Throw(stmt) => {
                self.output.push_str("throw");
                self.hard_space();
                self.emit_expr_with_min_prec(stmt.arg, PREC_ASSIGN)?;
                self.output.push(';');
            }
            Stmt::With(stmt) => {
                self.output.push_str("with");
                self.output.push('(');
                self.emit_expr_with_min_prec(stmt.obj, PREC_SEQ)?;
                self.output.push(')');
                self.emit_stmt_body(stmt.body)?;
            }
            Stmt::Break(stmt) => {
                self.output.push_str("break");
                if let Some(label) = stmt.label {
                    self.hard_space();
                    self.emit_ident(&label);
                }
                self.output.push(';');
            }
            Stmt::Continue(stmt) => {
                self.output.push_str("continue");
                if let Some(label) = stmt.label {
                    self.hard_space();
                    self.emit_ident(&label);
                }
                self.output.push(';');
            }
            Stmt::Debugger(_) => {
                self.output.push_str("debugger;");
            }
            Stmt::Labeled(stmt) => {
                self.emit_ident(&stmt.label);
                self.output.push(':');
                self.emit_stmt_body(stmt.body)?;
            }
            Stmt::Decl(decl) => {
                self.emit_decl(decl)?;
                self.output.push(';');
            }
            Stmt::ModuleDecl(module_decl) => {
                self.emit_module_decl(module_decl)?;
                self.output.push(';');
            }
        }

        Ok(())
    }

    fn emit_stmt_body(&mut self, id: StmtId) -> Result<()> {
        self.hard_space();
        self.emit_stmt(id)
    }

    fn emit_stmt_block(&mut self, stmts: &[StmtId]) -> Result<()> {
        self.output.push('{');
        for stmt in stmts {
            self.emit_stmt(*stmt)?;
        }
        self.output.push('}');
        Ok(())
    }

    fn emit_for_head(&mut self, head: &ForHead) -> Result<()> {
        match head {
            ForHead::Classic(classic) => {
                if let Some(init) = &classic.init {
                    match init {
                        ForInit::Decl(decl) => self.emit_decl(*decl)?,
                        ForInit::Expr(expr) => self.emit_expr_with_min_prec(*expr, PREC_ASSIGN)?,
                    }
                }
                self.output.push(';');
                if !self.config.minify {
                    self.output.push(' ');
                }
                if let Some(test) = classic.test {
                    self.emit_expr_with_min_prec(test, PREC_ASSIGN)?;
                }
                self.output.push(';');
                if !self.config.minify {
                    self.output.push(' ');
                }
                if let Some(update) = classic.update {
                    self.emit_expr_with_min_prec(update, PREC_ASSIGN)?;
                }
            }
            ForHead::In(head) => {
                self.emit_for_binding(&head.left)?;
                self.hard_space();
                self.output.push_str("in");
                self.hard_space();
                self.emit_expr_with_min_prec(head.right, PREC_ASSIGN)?;
            }
            ForHead::Of(head) => {
                if head.is_await {
                    self.output.push_str("await ");
                }
                self.emit_for_binding(&head.left)?;
                self.hard_space();
                self.output.push_str("of");
                self.hard_space();
                self.emit_expr_with_min_prec(head.right, PREC_ASSIGN)?;
            }
        }

        Ok(())
    }

    fn emit_for_binding(&mut self, binding: &ForBinding) -> Result<()> {
        match binding {
            ForBinding::Decl(decl) => self.emit_decl(*decl),
            ForBinding::Pat(pat) => self.emit_pat(*pat),
            ForBinding::Expr(expr) => self.emit_expr_with_min_prec(*expr, PREC_ASSIGN),
        }
    }

    fn emit_decl(&mut self, id: DeclId) -> Result<()> {
        match self.decl(id)?.clone() {
            Decl::Var(var) => self.emit_var_decl(&var)?,
            Decl::Fn(decl) => self.emit_fn_decl(&decl)?,
            Decl::Class(decl) => self.emit_class_decl(&decl)?,
            Decl::TsTypeAlias(decl) => self.emit_ts_type_alias_decl(&decl)?,
            Decl::TsInterface(decl) => self.emit_ts_interface_decl(&decl)?,
            Decl::TsEnum(decl) => self.emit_ts_enum_decl(&decl)?,
            Decl::TsModule(decl) => self.emit_ts_module_decl(&decl)?,
        }

        Ok(())
    }

    fn emit_var_decl(&mut self, decl: &VarDecl) -> Result<()> {
        if decl.declare {
            self.output.push_str("declare ");
        }

        match decl.kind {
            VarDeclKind::Var => self.output.push_str("var"),
            VarDeclKind::Let => self.output.push_str("let"),
            VarDeclKind::Const => self.output.push_str("const"),
            VarDeclKind::Using => self.output.push_str("using"),
            VarDeclKind::AwaitUsing => self.output.push_str("await using"),
        }

        self.hard_space();

        for (idx, declarator) in decl.declarators.iter().enumerate() {
            if idx != 0 {
                self.comma();
            }

            self.emit_pat(declarator.name)?;

            if let Some(init) = declarator.init {
                self.soft_space();
                self.output.push('=');
                self.soft_space();
                self.emit_expr_with_min_prec(init, PREC_ASSIGN)?;
            }
        }

        Ok(())
    }

    fn emit_fn_decl(&mut self, decl: &FnDecl) -> Result<()> {
        if decl.declare {
            self.output.push_str("declare ");
        }

        self.output.push_str("function ");
        self.emit_ident(&decl.ident);
        self.output.push('(');

        for (idx, pat) in decl.params.iter().copied().enumerate() {
            if idx != 0 {
                self.comma();
            }
            self.emit_pat(pat)?;
        }

        self.output.push(')');

        if decl.declare && decl.body.is_empty() {
            return Ok(());
        }

        self.emit_stmt_block(&decl.body)
    }

    fn emit_class_decl(&mut self, decl: &ClassDecl) -> Result<()> {
        if decl.declare {
            self.output.push_str("declare ");
        }
        self.emit_class(decl.class, Some(&decl.ident))
    }

    fn emit_ts_type_alias_decl(&mut self, decl: &TsTypeAliasDecl) -> Result<()> {
        if decl.declare {
            self.output.push_str("declare ");
        }
        self.output.push_str("type ");
        self.emit_ident(&decl.ident);
        self.emit_ts_type_params(&decl.type_params);
        self.soft_space();
        self.output.push('=');
        self.soft_space();
        self.emit_ts_type_with_min_prec(decl.ty, TYPE_PREC_COND)
    }

    fn emit_ts_interface_decl(&mut self, decl: &TsInterfaceDecl) -> Result<()> {
        if decl.declare {
            self.output.push_str("declare ");
        }

        self.output.push_str("interface ");
        self.emit_ident(&decl.ident);
        self.emit_ts_type_params(&decl.type_params);

        if !decl.extends.is_empty() {
            self.hard_space();
            self.output.push_str("extends ");
            for (idx, ext) in decl.extends.iter().enumerate() {
                if idx != 0 {
                    self.comma();
                }
                self.emit_ident(ext);
            }
        }

        self.output.push('{');
        for member in &decl.body {
            self.emit_ts_type_member(member)?;
        }
        self.output.push('}');

        Ok(())
    }

    fn emit_ts_enum_decl(&mut self, decl: &TsEnumDecl) -> Result<()> {
        if decl.declare {
            self.output.push_str("declare ");
        }
        if decl.is_const {
            self.output.push_str("const ");
        }

        self.output.push_str("enum ");
        self.emit_ident(&decl.ident);
        self.output.push('{');

        for (idx, member) in decl.members.iter().enumerate() {
            if idx != 0 {
                self.comma();
            }

            match &member.name {
                TsEnumMemberName::Ident(ident) => self.emit_ident(ident),
                TsEnumMemberName::Str(lit) => self.emit_str_lit(lit),
                TsEnumMemberName::Num(lit) => self.emit_number_lit(lit),
            }

            if let Some(init) = member.init {
                self.soft_space();
                self.output.push('=');
                self.soft_space();
                self.emit_expr_with_min_prec(init, PREC_ASSIGN)?;
            }
        }

        self.output.push('}');
        Ok(())
    }

    fn emit_ts_module_decl(&mut self, decl: &TsModuleDecl) -> Result<()> {
        if decl.declare {
            self.output.push_str("declare ");
        }

        if decl.global {
            self.output.push_str("global");
        } else if decl.namespace {
            self.output.push_str("namespace ");
            self.emit_ts_module_name(&decl.id);
        } else {
            self.output.push_str("module ");
            self.emit_ts_module_name(&decl.id);
        }

        if let Some(body) = &decl.body {
            self.hard_space();
            self.emit_ts_namespace_body(body)?;
        }

        Ok(())
    }

    fn emit_ts_module_name(&mut self, name: &TsModuleName) {
        match name {
            TsModuleName::Ident(ident) => self.emit_ident(ident),
            TsModuleName::Str(lit) => self.emit_str_lit(lit),
        }
    }

    fn emit_ts_namespace_body(&mut self, body: &TsNamespaceBody) -> Result<()> {
        match body {
            TsNamespaceBody::ModuleBlock(stmts) => self.emit_stmt_block(stmts),
            TsNamespaceBody::Namespace(ns) => {
                self.output.push('{');
                self.emit_ts_namespace_decl(ns)?;
                self.output.push('}');
                Ok(())
            }
        }
    }

    fn emit_ts_namespace_decl(&mut self, decl: &TsNamespaceDecl) -> Result<()> {
        if decl.declare {
            self.output.push_str("declare ");
        }

        if decl.global {
            self.output.push_str("global");
        } else {
            self.output.push_str("namespace ");
            self.emit_ident(&decl.id);
        }

        self.hard_space();
        self.emit_ts_namespace_body(&decl.body)
    }

    fn emit_ts_type_params(&mut self, params: &[Ident]) {
        if params.is_empty() {
            return;
        }

        self.output.push('<');
        for (idx, param) in params.iter().enumerate() {
            if idx != 0 {
                self.comma();
            }
            self.emit_ident(param);
        }
        self.output.push('>');
    }

    fn emit_module_decl(&mut self, id: ModuleDeclId) -> Result<()> {
        match self.module_decl(id)?.clone() {
            ModuleDecl::Import(decl) => self.emit_import_decl(&decl)?,
            ModuleDecl::ExportNamed(decl) => self.emit_export_named_decl(&decl)?,
            ModuleDecl::ExportDefaultExpr(decl) => {
                self.output.push_str("export default ");
                self.emit_expr_with_min_prec(decl.expr, PREC_ASSIGN)?;
            }
            ModuleDecl::ExportDefaultDecl(decl) => {
                self.output.push_str("export default ");
                self.emit_decl(decl.decl)?;
            }
            ModuleDecl::ExportAll(decl) => self.emit_export_all_decl(&decl)?,
            ModuleDecl::ExportDecl(decl) => {
                self.output.push_str("export ");
                self.emit_decl(decl.decl)?;
            }
        }

        Ok(())
    }

    fn emit_import_decl(&mut self, decl: &ImportDecl) -> Result<()> {
        self.output.push_str("import");
        if decl.type_only {
            self.hard_space();
            self.output.push_str("type");
        }

        if decl.specifiers.is_empty() {
            self.hard_space();
            self.emit_str_lit(&decl.src);
            self.emit_import_with_clause(&decl.with)?;
            return Ok(());
        }

        self.hard_space();

        for (idx, spec) in decl.specifiers.iter().enumerate() {
            if idx != 0 {
                self.comma();
            }

            match spec {
                ImportSpecifier::Default(spec) => self.emit_ident(&spec.local),
                ImportSpecifier::Namespace(spec) => {
                    self.output.push('*');
                    self.output.push_str(" as ");
                    self.emit_ident(&spec.local);
                }
                ImportSpecifier::Named(spec) => {
                    self.output.push('{');
                    if spec.is_type_only {
                        self.output.push_str("type ");
                    }
                    if let Some(imported) = &spec.imported {
                        self.emit_ident(imported);
                        if imported.sym != spec.local.sym {
                            self.output.push_str(" as ");
                            self.emit_ident(&spec.local);
                        }
                    } else {
                        self.emit_ident(&spec.local);
                    }
                    self.output.push('}');
                }
            }
        }

        self.hard_space();
        self.output.push_str("from");
        self.hard_space();
        self.emit_str_lit(&decl.src);
        self.emit_import_with_clause(&decl.with)?;

        Ok(())
    }

    fn emit_export_named_decl(&mut self, decl: &ExportNamedDecl) -> Result<()> {
        self.output.push_str("export ");
        if decl.type_only {
            self.output.push_str("type ");
        }

        if let Some(inner_decl) = decl.decl {
            self.emit_decl(inner_decl)?;
            return Ok(());
        }

        self.output.push('{');
        for (idx, spec) in decl.specifiers.iter().enumerate() {
            if idx != 0 {
                self.comma();
            }

            if spec.is_type_only {
                self.output.push_str("type ");
            }
            self.emit_ident(&spec.local);
            if let Some(exported) = &spec.exported {
                if exported.sym != spec.local.sym {
                    self.output.push_str(" as ");
                    self.emit_ident(exported);
                }
            }
        }
        self.output.push('}');

        if let Some(src) = &decl.src {
            self.hard_space();
            self.output.push_str("from");
            self.hard_space();
            self.emit_str_lit(src);
        }

        self.emit_import_with_clause(&decl.with)
    }

    fn emit_export_all_decl(&mut self, decl: &ExportAllDecl) -> Result<()> {
        self.output.push_str("export ");
        if decl.type_only {
            self.output.push_str("type ");
        }
        self.output.push('*');
        if let Some(exported) = &decl.exported {
            self.output.push_str(" as ");
            self.emit_ident(exported);
        }
        self.output.push_str(" from ");
        self.emit_str_lit(&decl.src);
        self.emit_import_with_clause(&decl.with)
    }

    fn emit_import_with_clause(&mut self, attrs: &[ImportAttribute]) -> Result<()> {
        if attrs.is_empty() {
            return Ok(());
        }

        self.hard_space();
        self.output.push_str("with");
        self.hard_space();
        self.output.push('{');

        for (idx, attr) in attrs.iter().enumerate() {
            if idx != 0 {
                self.comma();
            }

            match &attr.key {
                ImportAttributeName::Ident(ident) => self.emit_ident(ident),
                ImportAttributeName::Str(lit) => self.emit_str_lit(lit),
            }

            self.output.push(':');
            self.soft_space();
            self.emit_str_lit(&attr.value);
        }

        self.output.push('}');
        Ok(())
    }

    fn emit_class(&mut self, id: ClassId, force_ident: Option<&Ident>) -> Result<()> {
        let class = self.class(id)?.clone();

        for decorator in class.decorators {
            self.emit_decorator(&decorator)?;
            self.hard_space();
        }

        self.output.push_str("class");

        if let Some(ident) = force_ident.or(class.ident.as_ref()) {
            self.hard_space();
            self.emit_ident(ident);
        }

        if let Some(super_class) = class.super_class {
            self.output.push_str(" extends ");
            self.emit_expr_with_min_prec(super_class, PREC_ASSIGN)?;
        }

        self.output.push('{');
        for member in class.body {
            self.emit_class_member(member)?;
        }
        self.output.push('}');

        Ok(())
    }

    fn emit_class_member(&mut self, id: ClassMemberId) -> Result<()> {
        match self.class_member(id)?.clone() {
            ClassMember::Method(method) => {
                for decorator in method.decorators {
                    self.emit_decorator(&decorator)?;
                    self.hard_space();
                }

                if method.is_static {
                    self.output.push_str("static ");
                }

                match method.kind {
                    MethodKind::Getter => self.output.push_str("get "),
                    MethodKind::Setter => self.output.push_str("set "),
                    MethodKind::Method | MethodKind::Constructor => {}
                }

                let function = self.function(method.function)?.clone();

                if matches!(method.kind, MethodKind::Method | MethodKind::Constructor)
                    && function.is_async
                {
                    self.output.push_str("async ");
                }

                if matches!(method.kind, MethodKind::Method | MethodKind::Constructor)
                    && function.is_generator
                {
                    self.output.push('*');
                }

                self.emit_prop_name(&method.key)?;
                self.emit_function_params(&function.params)?;
                self.emit_stmt_block(&function.body)?;
            }
            ClassMember::Prop(prop) => {
                for decorator in prop.decorators {
                    self.emit_decorator(&decorator)?;
                    self.hard_space();
                }

                if prop.is_static {
                    self.output.push_str("static ");
                }

                self.emit_prop_name(&prop.key)?;
                if let Some(value) = prop.value {
                    self.soft_space();
                    self.output.push('=');
                    self.soft_space();
                    self.emit_expr_with_min_prec(value, PREC_ASSIGN)?;
                }
                self.output.push(';');
            }
            ClassMember::StaticBlock(block) => {
                self.output.push_str("static");
                self.emit_stmt_block(&block.body)?;
            }
        }

        Ok(())
    }

    fn emit_decorator(&mut self, decorator: &Decorator) -> Result<()> {
        self.output.push('@');
        self.emit_expr_with_min_prec(decorator.expr, PREC_ASSIGN)
    }

    fn emit_function(&mut self, id: FunctionId) -> Result<()> {
        let function = self.function(id)?.clone();

        if function.is_async {
            self.output.push_str("async ");
        }

        self.output.push_str("function");

        if function.is_generator {
            self.output.push('*');
        }

        self.emit_function_params(&function.params)?;
        self.emit_stmt_block(&function.body)
    }

    fn emit_function_params(&mut self, params: &[Param]) -> Result<()> {
        self.output.push('(');
        for (idx, param) in params.iter().enumerate() {
            if idx != 0 {
                self.comma();
            }

            for decorator in &param.decorators {
                self.emit_decorator(decorator)?;
                self.hard_space();
            }

            self.emit_pat(param.pat)?;
        }
        self.output.push(')');

        Ok(())
    }

    fn emit_pat(&mut self, id: PatId) -> Result<()> {
        match self.pat(id)?.clone() {
            Pat::Ident(ident) => self.emit_ident(&ident),
            Pat::Expr(expr) => self.emit_expr_with_min_prec(expr, PREC_ASSIGN)?,
            Pat::Array(array) => {
                self.output.push('[');
                for (idx, elem) in array.elems.into_iter().enumerate() {
                    if idx != 0 {
                        self.output.push(',');
                        self.soft_space();
                    }
                    if let Some(elem) = elem {
                        self.emit_pat(elem)?;
                    }
                }
                self.output.push(']');
            }
            Pat::Object(object) => {
                self.output.push('{');
                for (idx, prop) in object.props.into_iter().enumerate() {
                    if idx != 0 {
                        self.comma();
                    }

                    match prop {
                        ObjectPatProp::KeyValue(prop) => {
                            self.emit_prop_name(&prop.key)?;
                            self.output.push(':');
                            self.soft_space();
                            self.emit_pat(prop.value)?;
                        }
                        ObjectPatProp::Assign(prop) => {
                            self.emit_ident(&prop.key);
                            if let Some(value) = prop.value {
                                self.soft_space();
                                self.output.push('=');
                                self.soft_space();
                                self.emit_expr_with_min_prec(value, PREC_ASSIGN)?;
                            }
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.output.push_str("...");
                            self.emit_pat(rest.arg)?;
                        }
                    }
                }
                self.output.push('}');
            }
            Pat::Rest(rest) => {
                self.output.push_str("...");
                self.emit_pat(rest.arg)?;
            }
            Pat::Assign(assign) => {
                self.emit_pat(assign.left)?;
                self.soft_space();
                self.output.push('=');
                self.soft_space();
                self.emit_expr_with_min_prec(assign.right, PREC_ASSIGN)?;
            }
        }

        Ok(())
    }

    fn emit_expr_stmt(&mut self, expr: ExprId) -> Result<()> {
        let needs_wrap = matches!(
            self.expr(expr)?,
            Expr::Object(_) | Expr::Function(_) | Expr::Class(_)
        );

        if needs_wrap {
            self.output.push('(');
            self.emit_expr_with_min_prec(expr, PREC_ASSIGN)?;
            self.output.push(')');
            return Ok(());
        }

        self.emit_expr_with_min_prec(expr, PREC_ASSIGN)
    }

    fn emit_expr_with_min_prec(&mut self, id: ExprId, min_prec: u8) -> Result<()> {
        let expr = self.expr(id)?.clone();
        let prec = expr_precedence(&expr);
        let needs_paren = prec < min_prec;

        if needs_paren {
            self.output.push('(');
        }

        match expr {
            Expr::Ident(ident) => self.emit_ident(&ident),
            Expr::Lit(lit) => self.emit_lit(&lit),
            Expr::Function(function) => self.emit_function(function)?,
            Expr::Class(class) => self.emit_class(class, None)?,
            Expr::JSXElement(element) => self.emit_jsx_element(element)?,
            Expr::TsAs(ts_as) => {
                self.emit_expr_with_min_prec(ts_as.expr, PREC_REL)?;
                self.output.push_str(" as ");
                self.emit_ts_type_with_min_prec(ts_as.ty, TYPE_PREC_COND)?;
            }
            Expr::TsNonNull(ts_non_null) => {
                self.emit_expr_with_min_prec(ts_non_null.expr, PREC_POSTFIX)?;
                self.output.push('!');
            }
            Expr::TsSatisfies(ts_satisfies) => {
                self.emit_expr_with_min_prec(ts_satisfies.expr, PREC_REL)?;
                self.output.push_str(" satisfies ");
                self.emit_ts_type_with_min_prec(ts_satisfies.ty, TYPE_PREC_COND)?;
            }
            Expr::Array(array) => {
                self.output.push('[');
                for (idx, elem) in array.elems.into_iter().enumerate() {
                    if idx != 0 {
                        self.output.push(',');
                        self.soft_space();
                    }
                    if let Some(elem) = elem {
                        self.emit_expr_or_spread(&elem)?;
                    }
                }
                self.output.push(']');
            }
            Expr::Object(object) => {
                self.output.push('{');
                for (idx, prop) in object.props.into_iter().enumerate() {
                    if idx != 0 {
                        self.comma();
                    }
                    self.emit_prop_name(&prop.key)?;
                    self.output.push(':');
                    self.soft_space();
                    self.emit_expr_with_min_prec(prop.value, PREC_ASSIGN)?;
                }
                self.output.push('}');
            }
            Expr::Unary(unary) => {
                self.output.push_str(unary_op_text(unary.op));
                if unary_op_needs_space(unary.op) {
                    self.hard_space();
                }
                self.emit_expr_with_min_prec(unary.arg, PREC_UNARY)?;
            }
            Expr::Binary(binary) => {
                let op_prec = binary_op_precedence(binary.op);
                if binary.op == BinaryOp::Exp {
                    self.emit_expr_with_min_prec(binary.left, op_prec + 1)?;
                    self.soft_space();
                    self.output.push_str(binary_op_text(binary.op));
                    self.soft_space();
                    self.emit_expr_with_min_prec(binary.right, op_prec)?;
                } else {
                    self.emit_expr_with_min_prec(binary.left, op_prec)?;
                    if binary_op_needs_space(binary.op) || !self.config.minify {
                        self.output.push(' ');
                    }
                    self.output.push_str(binary_op_text(binary.op));
                    if binary_op_needs_space(binary.op) || !self.config.minify {
                        self.output.push(' ');
                    }
                    self.emit_expr_with_min_prec(binary.right, op_prec + 1)?;
                }
            }
            Expr::Assign(assign) => {
                self.emit_pat(assign.left)?;
                self.soft_space();
                self.output.push_str(assign_op_text(assign.op));
                self.soft_space();
                self.emit_expr_with_min_prec(assign.right, PREC_ASSIGN)?;
            }
            Expr::Call(call) => {
                self.emit_call_target(call.callee)?;
                self.output.push('(');
                for (idx, arg) in call.args.into_iter().enumerate() {
                    if idx != 0 {
                        self.comma();
                    }
                    self.emit_expr_or_spread(&arg)?;
                }
                self.output.push(')');
            }
            Expr::Member(member) => {
                self.emit_member_target(member.obj)?;
                self.emit_member_prop(&member.prop)?;
            }
            Expr::Cond(cond) => {
                self.emit_expr_with_min_prec(cond.test, PREC_COND + 1)?;
                self.soft_space();
                self.output.push('?');
                self.soft_space();
                self.emit_expr_with_min_prec(cond.cons, PREC_ASSIGN)?;
                self.soft_space();
                self.output.push(':');
                self.soft_space();
                self.emit_expr_with_min_prec(cond.alt, PREC_ASSIGN)?;
            }
            Expr::Seq(seq) => {
                for (idx, expr) in seq.exprs.into_iter().enumerate() {
                    if idx != 0 {
                        self.comma();
                    }
                    self.emit_expr_with_min_prec(expr, PREC_ASSIGN)?;
                }
            }
            Expr::New(new_expr) => {
                self.output.push_str("new ");
                self.emit_call_target(new_expr.callee)?;
                self.output.push('(');
                for (idx, arg) in new_expr.args.into_iter().enumerate() {
                    if idx != 0 {
                        self.comma();
                    }
                    self.emit_expr_or_spread(&arg)?;
                }
                self.output.push(')');
            }
            Expr::Update(update) => {
                if update.prefix {
                    self.output.push_str(update_op_text(update.op));
                    self.emit_expr_with_min_prec(update.arg, PREC_UNARY)?;
                } else {
                    self.emit_expr_with_min_prec(update.arg, PREC_POSTFIX)?;
                    self.output.push_str(update_op_text(update.op));
                }
            }
            Expr::Await(await_expr) => {
                self.output.push_str("await ");
                self.emit_expr_with_min_prec(await_expr.arg, PREC_UNARY)?;
            }
            Expr::Arrow(arrow) => {
                if arrow.is_async {
                    self.output.push_str("async ");
                }

                self.output.push('(');
                for (idx, param) in arrow.params.into_iter().enumerate() {
                    if idx != 0 {
                        self.comma();
                    }
                    self.emit_pat(param)?;
                }
                self.output.push(')');

                self.soft_space();
                self.output.push_str("=>");
                self.soft_space();

                match arrow.body {
                    ArrowBody::Expr(expr) => self.emit_expr_with_min_prec(expr, PREC_ASSIGN)?,
                    ArrowBody::Block(stmts) => self.emit_stmt_block(&stmts)?,
                }
            }
            Expr::Template(template) => {
                self.emit_template(&template)?;
            }
            Expr::Yield(yield_expr) => {
                self.output.push_str("yield");
                if yield_expr.delegate {
                    self.output.push('*');
                }
                if let Some(arg) = yield_expr.arg {
                    self.hard_space();
                    self.emit_expr_with_min_prec(arg, PREC_ASSIGN)?;
                }
            }
            Expr::TaggedTemplate(tagged) => {
                self.emit_expr_with_min_prec(tagged.tag, PREC_CALL)?;
                self.emit_template(&tagged.template)?;
            }
            Expr::MetaProp(meta) => match meta.kind {
                MetaPropKind::NewTarget => self.output.push_str("new.target"),
                MetaPropKind::ImportMeta => self.output.push_str("import.meta"),
            },
            Expr::OptChain(chain) => {
                self.emit_opt_chain(chain.base)?;
            }
            Expr::Paren(paren) => {
                self.output.push('(');
                self.emit_expr_with_min_prec(paren.expr, PREC_ASSIGN)?;
                self.output.push(')');
            }
        }

        if needs_paren {
            self.output.push(')');
        }

        Ok(())
    }

    fn emit_opt_chain(&mut self, base: ExprId) -> Result<()> {
        match self.expr(base)?.clone() {
            Expr::Member(member) => {
                self.emit_member_target(member.obj)?;
                match member.prop {
                    MemberProp::Ident(ident) => {
                        self.output.push_str("?.");
                        self.emit_ident(&ident);
                    }
                    MemberProp::Private(ident) => {
                        self.output.push_str("?.#");
                        self.emit_ident(&ident);
                    }
                    MemberProp::Computed(expr) => {
                        self.output.push_str("?.[");
                        self.emit_expr_with_min_prec(expr, PREC_ASSIGN)?;
                        self.output.push(']');
                    }
                }
            }
            Expr::Call(call) => {
                self.emit_call_target(call.callee)?;
                self.output.push_str("?.(");
                for (idx, arg) in call.args.into_iter().enumerate() {
                    if idx != 0 {
                        self.comma();
                    }
                    self.emit_expr_or_spread(&arg)?;
                }
                self.output.push(')');
            }
            _ => {
                self.emit_expr_with_min_prec(base, PREC_CALL)?;
                self.output.push_str("?.");
            }
        }

        Ok(())
    }

    fn emit_member_target(&mut self, id: ExprId) -> Result<()> {
        let needs_wrap = matches!(
            self.expr(id)?,
            Expr::Object(_) | Expr::Function(_) | Expr::Class(_)
        );
        if needs_wrap {
            self.output.push('(');
            self.emit_expr_with_min_prec(id, PREC_ASSIGN)?;
            self.output.push(')');
            return Ok(());
        }

        if matches!(
            self.expr(id)?,
            Expr::Lit(Lit::Num(_)) | Expr::Lit(Lit::BigInt(_))
        ) {
            self.output.push('(');
            self.emit_expr_with_min_prec(id, PREC_ASSIGN)?;
            self.output.push(')');
            return Ok(());
        }

        self.emit_expr_with_min_prec(id, PREC_CALL)
    }

    fn emit_call_target(&mut self, id: ExprId) -> Result<()> {
        let needs_wrap = matches!(
            self.expr(id)?,
            Expr::Object(_) | Expr::Function(_) | Expr::Class(_) | Expr::Arrow(_)
        );

        if needs_wrap {
            self.output.push('(');
            self.emit_expr_with_min_prec(id, PREC_ASSIGN)?;
            self.output.push(')');
            return Ok(());
        }

        self.emit_expr_with_min_prec(id, PREC_CALL)
    }

    fn emit_member_prop(&mut self, prop: &MemberProp) -> Result<()> {
        match prop {
            MemberProp::Ident(ident) => {
                self.output.push('.');
                self.emit_ident(ident);
            }
            MemberProp::Private(ident) => {
                self.output.push_str(".#");
                self.emit_ident(ident);
            }
            MemberProp::Computed(expr) => {
                self.output.push('[');
                self.emit_expr_with_min_prec(*expr, PREC_ASSIGN)?;
                self.output.push(']');
            }
        }

        Ok(())
    }

    fn emit_expr_or_spread(&mut self, expr: &ExprOrSpread) -> Result<()> {
        if expr.spread {
            self.output.push_str("...");
        }
        self.emit_expr_with_min_prec(expr.expr, PREC_ASSIGN)
    }

    fn emit_template(&mut self, template: &TemplateExpr) -> Result<()> {
        self.output.push('`');
        let quasis = &template.quasis;
        let exprs = &template.exprs;

        for (idx, quasi) in quasis.iter().enumerate() {
            self.emit_template_chunk(&quasi.value);
            if let Some(expr) = exprs.get(idx).copied() {
                self.output.push_str("${");
                self.emit_expr_with_min_prec(expr, PREC_ASSIGN)?;
                self.output.push('}');
            }
        }

        self.output.push('`');
        Ok(())
    }

    fn emit_template_chunk(&mut self, value: &str) {
        let mut start = 0;
        let bytes = value.as_bytes();

        for (idx, &byte) in bytes.iter().enumerate() {
            let escape = match byte {
                b'`' => Some("\\`"),
                b'\\' => Some("\\\\"),
                _ => None,
            };

            if let Some(escape) = escape {
                self.output.push_str(&value[start..idx]);
                self.output.push_str(escape);
                start = idx + 1;
            } else if byte == b'$' && bytes.get(idx + 1) == Some(&b'{') {
                self.output.push_str(&value[start..idx]);
                self.output.push_str("\\$");
                start = idx + 1;
            }
        }

        if start != value.len() {
            self.output.push_str(&value[start..]);
        }
    }

    fn emit_lit(&mut self, lit: &Lit) {
        match lit {
            Lit::Str(str_lit) => self.emit_str_lit(str_lit),
            Lit::Bool(bool_lit) => {
                if bool_lit.value {
                    self.output.push_str("true");
                } else {
                    self.output.push_str("false");
                }
            }
            Lit::Null(_) => self.output.push_str("null"),
            Lit::Num(num_lit) => self.emit_number_lit(num_lit),
            Lit::BigInt(big_int) => {
                self.output.push_str(big_int.value.as_ref());
                self.output.push('n');
            }
            Lit::Regex(regex) => {
                self.output.push('/');
                self.output.push_str(regex.exp.as_ref());
                self.output.push('/');
                self.output.push_str(regex.flags.as_ref());
            }
        }
    }

    fn emit_ident(&mut self, ident: &Ident) {
        self.output.push_str(ident.sym.as_ref());
    }

    fn emit_prop_name(&mut self, name: &PropName) -> Result<()> {
        match name {
            PropName::Ident(ident) => self.emit_ident(ident),
            PropName::Private(ident) => {
                self.output.push('#');
                self.emit_ident(ident);
            }
            PropName::Str(lit) => self.emit_str_lit(lit),
            PropName::Num(lit) => self.emit_number_lit(lit),
            PropName::Computed(expr) => {
                self.output.push('[');
                self.emit_expr_with_min_prec(*expr, PREC_ASSIGN)?;
                self.output.push(']');
            }
        }

        Ok(())
    }

    fn emit_number_lit(&mut self, lit: &NumberLit) {
        let value = lit.value;
        if value.is_nan() {
            self.output.push_str("NaN");
            return;
        }

        if value.is_infinite() {
            if value.is_sign_negative() {
                self.output.push('-');
            }
            self.output.push_str("Infinity");
            return;
        }

        let mut buf = NumberBuffer::new();
        self.output.push_str(buf.format(value));
    }

    fn emit_str_lit(&mut self, lit: &StrLit) {
        self.output.push('"');
        self.emit_escaped_str(lit.value.as_ref());
        self.output.push('"');
    }

    fn emit_escaped_str(&mut self, value: &str) {
        let mut start = 0;
        let bytes = value.as_bytes();

        for (idx, &byte) in bytes.iter().enumerate() {
            let escape = match byte {
                b'"' => Some("\\\""),
                b'\\' => Some("\\\\"),
                b'\n' => Some("\\n"),
                b'\r' => Some("\\r"),
                b'\t' => Some("\\t"),
                b'\x08' => Some("\\b"),
                b'\x0c' => Some("\\f"),
                0x00..=0x1f => None,
                _ => continue,
            };

            self.output.push_str(&value[start..idx]);
            if let Some(escape) = escape {
                self.output.push_str(escape);
            } else {
                self.output.push_str("\\x");
                push_hex_byte(&mut self.output, byte);
            }
            start = idx + 1;
        }

        if start != value.len() {
            self.output.push_str(&value[start..]);
        }
    }

    fn emit_jsx_element(&mut self, id: JSXElementId) -> Result<()> {
        let element = self.jsx_element(id)?.clone();

        self.output.push('<');
        self.emit_jsx_element_name(&element.opening.name);

        for attr in element.opening.attrs {
            self.hard_space();
            self.output.push_str(attr.name.as_ref());
            if let Some(value) = attr.value {
                self.output.push('=');
                self.output.push('{');
                self.emit_expr_with_min_prec(value, PREC_ASSIGN)?;
                self.output.push('}');
            }
        }

        if element.opening.self_closing {
            self.output.push_str("/>");
            return Ok(());
        }

        self.output.push('>');

        for child in element.children {
            match child {
                JSXElementChild::Element(element) => self.emit_jsx_element(element)?,
                JSXElementChild::Text(text) => self.output.push_str(text.as_ref()),
                JSXElementChild::Expr(expr) => {
                    self.output.push('{');
                    self.emit_expr_with_min_prec(expr, PREC_ASSIGN)?;
                    self.output.push('}');
                }
            }
        }

        self.output.push_str("</");
        if let Some(closing) = element.closing {
            self.emit_jsx_element_name(&closing);
        } else {
            self.emit_jsx_element_name(&element.opening.name);
        }
        self.output.push('>');

        Ok(())
    }

    fn emit_jsx_element_name(&mut self, name: &JSXElementName) {
        match name {
            JSXElementName::Ident(ident) => self.emit_ident(ident),
            JSXElementName::Qualified(atom) => self.output.push_str(atom.as_ref()),
        }
    }

    fn emit_ts_type_with_min_prec(&mut self, id: TsTypeId, min_prec: u8) -> Result<()> {
        let ty = self.ts_type(id)?.clone();
        let prec = ts_type_precedence(&ty);
        let needs_paren = prec < min_prec;

        if needs_paren {
            self.output.push('(');
        }

        match ty {
            TsType::Keyword(keyword) => self.output.push_str(ts_keyword_text(keyword)),
            TsType::TypeRef(type_ref) => {
                self.emit_ident(&type_ref.name);
                if !type_ref.type_args.is_empty() {
                    self.output.push('<');
                    for (idx, arg) in type_ref.type_args.into_iter().enumerate() {
                        if idx != 0 {
                            self.comma();
                        }
                        self.emit_ts_type_with_min_prec(arg, TYPE_PREC_COND)?;
                    }
                    self.output.push('>');
                }
            }
            TsType::Lit(lit) => match lit {
                TsLitType::Str(lit) => self.emit_str_lit(&lit),
                TsLitType::Num(lit) => self.emit_number_lit(&lit),
                TsLitType::Bool(lit) => {
                    if lit.value {
                        self.output.push_str("true");
                    } else {
                        self.output.push_str("false");
                    }
                }
            },
            TsType::Array(array) => {
                self.emit_ts_type_with_min_prec(array.elem_type, TYPE_PREC_ARRAY)?;
                self.output.push_str("[]");
            }
            TsType::Tuple(tuple) => {
                self.output.push('[');
                for (idx, elem) in tuple.elem_types.into_iter().enumerate() {
                    if idx != 0 {
                        self.comma();
                    }
                    self.emit_ts_type_with_min_prec(elem, TYPE_PREC_COND)?;
                }
                self.output.push(']');
            }
            TsType::Union(union) => {
                for (idx, ty) in union.types.into_iter().enumerate() {
                    if idx != 0 {
                        self.output.push_str(" | ");
                    }
                    self.emit_ts_type_with_min_prec(ty, TYPE_PREC_UNION + 1)?;
                }
            }
            TsType::Intersection(intersection) => {
                for (idx, ty) in intersection.types.into_iter().enumerate() {
                    if idx != 0 {
                        self.output.push_str(" & ");
                    }
                    self.emit_ts_type_with_min_prec(ty, TYPE_PREC_INTERSECTION + 1)?;
                }
            }
            TsType::Parenthesized(parenthesized) => {
                self.output.push('(');
                self.emit_ts_type_with_min_prec(parenthesized.ty, TYPE_PREC_COND)?;
                self.output.push(')');
            }
            TsType::TypeLit(lit) => {
                self.output.push('{');
                for member in lit.members {
                    self.emit_ts_type_member(&member)?;
                }
                self.output.push('}');
            }
            TsType::Fn(function) => {
                self.emit_ts_fn_params(&function.params)?;
                self.output.push_str(" => ");
                self.emit_ts_type_with_min_prec(function.return_type, TYPE_PREC_COND)?;
            }
            TsType::Conditional(conditional) => {
                self.emit_ts_type_with_min_prec(conditional.check_type, TYPE_PREC_COND + 1)?;
                self.output.push_str(" extends ");
                self.emit_ts_type_with_min_prec(conditional.extends_type, TYPE_PREC_COND + 1)?;
                self.output.push_str(" ? ");
                self.emit_ts_type_with_min_prec(conditional.true_type, TYPE_PREC_COND)?;
                self.output.push_str(" : ");
                self.emit_ts_type_with_min_prec(conditional.false_type, TYPE_PREC_COND)?;
            }
            TsType::IndexedAccess(indexed) => {
                self.emit_ts_type_with_min_prec(indexed.obj_type, TYPE_PREC_ARRAY)?;
                self.output.push('[');
                self.emit_ts_type_with_min_prec(indexed.index_type, TYPE_PREC_COND)?;
                self.output.push(']');
            }
            TsType::TypeOperator(operator) => {
                self.output.push_str(ts_type_operator_text(operator.op));
                self.output.push(' ');
                self.emit_ts_type_with_min_prec(operator.ty, TYPE_PREC_TYPE_OPERATOR)?;
            }
            TsType::Infer(infer) => {
                self.output.push_str("infer ");
                self.emit_ident(&infer.type_param);
            }
            TsType::Import(import) => {
                self.output.push_str("import(");
                self.emit_str_lit(&import.arg);
                self.output.push(')');
                if let Some(qualifier) = import.qualifier {
                    self.output.push('.');
                    self.emit_ident(&qualifier);
                }
                if !import.type_args.is_empty() {
                    self.output.push('<');
                    for (idx, arg) in import.type_args.into_iter().enumerate() {
                        if idx != 0 {
                            self.comma();
                        }
                        self.emit_ts_type_with_min_prec(arg, TYPE_PREC_COND)?;
                    }
                    self.output.push('>');
                }
            }
            TsType::TypeQuery(query) => {
                self.output.push_str("typeof ");
                self.emit_ident(&query.expr_name);
                if !query.type_args.is_empty() {
                    self.output.push('<');
                    for (idx, arg) in query.type_args.into_iter().enumerate() {
                        if idx != 0 {
                            self.comma();
                        }
                        self.emit_ts_type_with_min_prec(arg, TYPE_PREC_COND)?;
                    }
                    self.output.push('>');
                }
            }
            TsType::Mapped(mapped) => {
                self.output.push('{');

                if let Some(readonly) = mapped.readonly {
                    if readonly {
                        self.output.push_str("readonly ");
                    } else {
                        self.output.push_str("-readonly ");
                    }
                }

                self.output.push('[');
                self.emit_ident(&mapped.type_param);
                self.output.push_str(" in ");
                self.emit_ts_type_with_min_prec(mapped.constraint, TYPE_PREC_COND)?;
                self.output.push(']');

                if let Some(optional) = mapped.optional {
                    if optional {
                        self.output.push('?');
                    } else {
                        self.output.push_str("-?");
                    }
                }

                if let Some(ty) = mapped.ty {
                    self.output.push(':');
                    self.soft_space();
                    self.emit_ts_type_with_min_prec(ty, TYPE_PREC_COND)?;
                }

                self.output.push('}');
            }
        }

        if needs_paren {
            self.output.push(')');
        }

        Ok(())
    }

    fn emit_ts_fn_params(&mut self, params: &[TsFnParam]) -> Result<()> {
        self.output.push('(');
        for (idx, param) in params.iter().enumerate() {
            if idx != 0 {
                self.comma();
            }
            self.emit_ts_fn_param(param)?;
        }
        self.output.push(')');
        Ok(())
    }

    fn emit_ts_fn_param(&mut self, param: &TsFnParam) -> Result<()> {
        if param.is_rest {
            self.output.push_str("...");
        }

        if let Some(name) = &param.name {
            self.emit_ident(name);
        }

        if param.optional {
            self.output.push('?');
        }

        if let Some(ty) = param.ty {
            self.output.push(':');
            self.soft_space();
            self.emit_ts_type_with_min_prec(ty, TYPE_PREC_COND)?;
        }

        Ok(())
    }

    fn emit_ts_type_member(&mut self, member: &TsTypeMember) -> Result<()> {
        if member.readonly {
            self.output.push_str("readonly ");
        }

        match member.kind {
            TsTypeMemberKind::Property => {
                if let Some(name) = &member.name {
                    self.emit_prop_name(name)?;
                }
                if member.optional {
                    self.output.push('?');
                }
                if let Some(ty) = member.ty {
                    self.output.push(':');
                    self.soft_space();
                    self.emit_ts_type_with_min_prec(ty, TYPE_PREC_COND)?;
                }
            }
            TsTypeMemberKind::Method => {
                if let Some(name) = &member.name {
                    self.emit_prop_name(name)?;
                }
                if member.optional {
                    self.output.push('?');
                }
                self.emit_ts_fn_params(&member.params)?;
                if let Some(ty) = member.ty {
                    self.output.push(':');
                    self.soft_space();
                    self.emit_ts_type_with_min_prec(ty, TYPE_PREC_COND)?;
                }
            }
            TsTypeMemberKind::Call => {
                self.emit_ts_fn_params(&member.params)?;
                if let Some(ty) = member.ty {
                    self.output.push(':');
                    self.soft_space();
                    self.emit_ts_type_with_min_prec(ty, TYPE_PREC_COND)?;
                }
            }
            TsTypeMemberKind::Construct => {
                self.output.push_str("new");
                self.emit_ts_fn_params(&member.params)?;
                if let Some(ty) = member.ty {
                    self.output.push(':');
                    self.soft_space();
                    self.emit_ts_type_with_min_prec(ty, TYPE_PREC_COND)?;
                }
            }
            TsTypeMemberKind::Index => {
                self.output.push('[');
                for (idx, param) in member.params.iter().enumerate() {
                    if idx != 0 {
                        self.comma();
                    }
                    self.emit_ts_fn_param(param)?;
                }
                self.output.push(']');
                if let Some(ty) = member.ty {
                    self.output.push(':');
                    self.soft_space();
                    self.emit_ts_type_with_min_prec(ty, TYPE_PREC_COND)?;
                }
            }
        }

        self.output.push(';');
        Ok(())
    }
}

const PREC_SEQ: u8 = 1;
const PREC_ASSIGN: u8 = 2;
const PREC_COND: u8 = 3;
const PREC_NULLISH: u8 = 4;
const PREC_LOGICAL_OR: u8 = 5;
const PREC_LOGICAL_AND: u8 = 6;
const PREC_BIT_OR: u8 = 7;
const PREC_BIT_XOR: u8 = 8;
const PREC_BIT_AND: u8 = 9;
const PREC_EQUALITY: u8 = 10;
const PREC_REL: u8 = 11;
const PREC_SHIFT: u8 = 12;
const PREC_ADD: u8 = 13;
const PREC_MUL: u8 = 14;
const PREC_EXP: u8 = 15;
const PREC_UNARY: u8 = 16;
const PREC_POSTFIX: u8 = 17;
const PREC_CALL: u8 = 18;
const PREC_PRIMARY: u8 = 19;

#[inline]
fn expr_precedence(expr: &Expr) -> u8 {
    match expr {
        Expr::Seq(_) => PREC_SEQ,
        Expr::Assign(_)
        | Expr::Arrow(_)
        | Expr::Yield(_)
        | Expr::TsAs(_)
        | Expr::TsSatisfies(_) => PREC_ASSIGN,
        Expr::Cond(_) => PREC_COND,
        Expr::Binary(binary) => binary_op_precedence(binary.op),
        Expr::Unary(_) | Expr::Await(_) => PREC_UNARY,
        Expr::Update(update) => {
            if update.prefix {
                PREC_UNARY
            } else {
                PREC_POSTFIX
            }
        }
        Expr::Call(_)
        | Expr::Member(_)
        | Expr::New(_)
        | Expr::OptChain(_)
        | Expr::TaggedTemplate(_) => PREC_CALL,
        Expr::Ident(_)
        | Expr::Lit(_)
        | Expr::Function(_)
        | Expr::Class(_)
        | Expr::JSXElement(_)
        | Expr::TsNonNull(_)
        | Expr::Array(_)
        | Expr::Object(_)
        | Expr::Template(_)
        | Expr::MetaProp(_)
        | Expr::Paren(_) => PREC_PRIMARY,
    }
}

#[inline]
fn binary_op_precedence(op: BinaryOp) -> u8 {
    match op {
        BinaryOp::NullishCoalescing => PREC_NULLISH,
        BinaryOp::LogicalOr => PREC_LOGICAL_OR,
        BinaryOp::LogicalAnd => PREC_LOGICAL_AND,
        BinaryOp::BitOr => PREC_BIT_OR,
        BinaryOp::BitXor => PREC_BIT_XOR,
        BinaryOp::BitAnd => PREC_BIT_AND,
        BinaryOp::EqEq | BinaryOp::EqEqEq | BinaryOp::NotEq | BinaryOp::NotEqEq => PREC_EQUALITY,
        BinaryOp::Lt
        | BinaryOp::LtEq
        | BinaryOp::Gt
        | BinaryOp::GtEq
        | BinaryOp::In
        | BinaryOp::InstanceOf => PREC_REL,
        BinaryOp::LShift | BinaryOp::RShift | BinaryOp::ZeroFillRShift => PREC_SHIFT,
        BinaryOp::Add | BinaryOp::Sub => PREC_ADD,
        BinaryOp::Mul | BinaryOp::Div | BinaryOp::Mod => PREC_MUL,
        BinaryOp::Exp => PREC_EXP,
    }
}

#[inline]
fn binary_op_text(op: BinaryOp) -> &'static str {
    match op {
        BinaryOp::Add => "+",
        BinaryOp::Sub => "-",
        BinaryOp::Mul => "*",
        BinaryOp::Div => "/",
        BinaryOp::Mod => "%",
        BinaryOp::EqEq => "==",
        BinaryOp::EqEqEq => "===",
        BinaryOp::NotEq => "!=",
        BinaryOp::NotEqEq => "!==",
        BinaryOp::Lt => "<",
        BinaryOp::LtEq => "<=",
        BinaryOp::Gt => ">",
        BinaryOp::GtEq => ">=",
        BinaryOp::LShift => "<<",
        BinaryOp::RShift => ">>",
        BinaryOp::ZeroFillRShift => ">>>",
        BinaryOp::LogicalAnd => "&&",
        BinaryOp::LogicalOr => "||",
        BinaryOp::BitOr => "|",
        BinaryOp::BitXor => "^",
        BinaryOp::BitAnd => "&",
        BinaryOp::In => "in",
        BinaryOp::InstanceOf => "instanceof",
        BinaryOp::Exp => "**",
        BinaryOp::NullishCoalescing => "??",
    }
}

#[inline]
fn binary_op_needs_space(op: BinaryOp) -> bool {
    matches!(op, BinaryOp::In | BinaryOp::InstanceOf)
}

#[inline]
fn assign_op_text(op: AssignOp) -> &'static str {
    match op {
        AssignOp::Assign => "=",
        AssignOp::AddAssign => "+=",
        AssignOp::SubAssign => "-=",
        AssignOp::MulAssign => "*=",
        AssignOp::DivAssign => "/=",
        AssignOp::ModAssign => "%=",
        AssignOp::LShiftAssign => "<<=",
        AssignOp::RShiftAssign => ">>=",
        AssignOp::ZeroFillRShiftAssign => ">>>=",
        AssignOp::BitOrAssign => "|=",
        AssignOp::BitXorAssign => "^=",
        AssignOp::BitAndAssign => "&=",
        AssignOp::ExpAssign => "**=",
        AssignOp::AndAssign => "&&=",
        AssignOp::OrAssign => "||=",
        AssignOp::NullishAssign => "??=",
    }
}

#[inline]
fn unary_op_text(op: UnaryOp) -> &'static str {
    match op {
        UnaryOp::Plus => "+",
        UnaryOp::Minus => "-",
        UnaryOp::Bang => "!",
        UnaryOp::Tilde => "~",
        UnaryOp::TypeOf => "typeof",
        UnaryOp::Void => "void",
        UnaryOp::Delete => "delete",
    }
}

#[inline]
fn unary_op_needs_space(op: UnaryOp) -> bool {
    matches!(op, UnaryOp::TypeOf | UnaryOp::Void | UnaryOp::Delete)
}

#[inline]
fn update_op_text(op: UpdateOp) -> &'static str {
    match op {
        UpdateOp::PlusPlus => "++",
        UpdateOp::MinusMinus => "--",
    }
}

const TYPE_PREC_COND: u8 = 1;
const TYPE_PREC_UNION: u8 = 2;
const TYPE_PREC_INTERSECTION: u8 = 3;
const TYPE_PREC_TYPE_OPERATOR: u8 = 4;
const TYPE_PREC_ARRAY: u8 = 5;
const TYPE_PREC_PRIMARY: u8 = 6;

#[inline]
fn ts_type_precedence(ty: &TsType) -> u8 {
    match ty {
        TsType::Conditional(_) | TsType::Fn(_) => TYPE_PREC_COND,
        TsType::Union(_) => TYPE_PREC_UNION,
        TsType::Intersection(_) => TYPE_PREC_INTERSECTION,
        TsType::TypeOperator(_) => TYPE_PREC_TYPE_OPERATOR,
        TsType::Array(_) | TsType::IndexedAccess(_) => TYPE_PREC_ARRAY,
        TsType::Keyword(_)
        | TsType::TypeRef(_)
        | TsType::Lit(_)
        | TsType::Tuple(_)
        | TsType::Parenthesized(_)
        | TsType::TypeLit(_)
        | TsType::Infer(_)
        | TsType::Import(_)
        | TsType::TypeQuery(_)
        | TsType::Mapped(_) => TYPE_PREC_PRIMARY,
    }
}

#[inline]
fn ts_keyword_text(keyword: TsKeywordType) -> &'static str {
    match keyword {
        TsKeywordType::Any => "any",
        TsKeywordType::Unknown => "unknown",
        TsKeywordType::Never => "never",
        TsKeywordType::Void => "void",
        TsKeywordType::String => "string",
        TsKeywordType::Number => "number",
        TsKeywordType::Boolean => "boolean",
        TsKeywordType::Symbol => "symbol",
        TsKeywordType::Object => "object",
        TsKeywordType::BigInt => "bigint",
        TsKeywordType::Undefined => "undefined",
        TsKeywordType::Intrinsic => "intrinsic",
    }
}

#[inline]
fn ts_type_operator_text(op: TsTypeOperatorOp) -> &'static str {
    match op {
        TsTypeOperatorOp::KeyOf => "keyof",
        TsTypeOperatorOp::ReadOnly => "readonly",
        TsTypeOperatorOp::Unique => "unique",
    }
}

#[inline]
fn push_hex_byte(buf: &mut String, byte: u8) {
    const HEX: &[u8; 16] = b"0123456789abcdef";
    buf.push(HEX[(byte >> 4) as usize] as char);
    buf.push(HEX[(byte & 0x0f) as usize] as char);
}
