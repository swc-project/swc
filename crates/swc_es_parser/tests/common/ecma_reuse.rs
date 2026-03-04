#![allow(dead_code)]

use std::{
    collections::BTreeSet,
    fs,
    path::{Path, PathBuf},
};

use serde_json::Value;
use swc_common::{comments::SingleThreadedComments, SourceFile, SourceMap, Span};
use swc_es_ast::{
    AstStore, ClassMember, Decl, Expr, Lit, ModuleDecl, Pat, Program, ProgramId, Stmt, TsLitType,
    TsType,
};
use swc_es_parser::{
    parse_file_as_module, parse_file_as_program, parse_file_as_script, Error, EsSyntax,
    ParsedProgram, Syntax, TsSyntax,
};
use swc_es_visit::{
    walk_class, walk_class_member, walk_decl, walk_expr, walk_function, walk_jsx_element,
    walk_module_decl, walk_pat, walk_program, walk_stmt, walk_ts_type, Visit, VisitWith,
};
use walkdir::WalkDir;

pub const SUCCESS_SNAPSHOT_CATEGORIES: &[&str] = &["js", "jsx", "typescript", "shifted"];
pub const ERROR_SNAPSHOT_CATEGORIES: &[&str] = &["errors", "typescript-errors"];

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ParseMode {
    Program,
    Module,
    Script,
}

#[derive(Debug, Default, Clone)]
pub struct FixtureOptions {
    pub throws: bool,
    pub source_type_module: bool,
    pub import_attributes: Option<bool>,
    pub explicit_resource_management: Option<bool>,
    pub jsx: Option<bool>,
}

#[derive(Debug, Clone)]
pub struct Case {
    pub path: PathBuf,
    pub category: String,
}

#[derive(Debug)]
pub struct ParseOutput {
    pub parsed: Option<ParsedProgram>,
    pub fatal: Option<Error>,
    pub recovered: Vec<Error>,
    pub comments: SingleThreadedComments,
}

#[derive(Debug, Clone)]
pub struct DebugNode {
    pub id: u64,
    pub node: String,
}

#[derive(Debug)]
pub struct ProgramArenaSnapshot {
    pub root_program: u64,
    pub programs: Vec<DebugNode>,
    pub stmts: Vec<DebugNode>,
    pub decls: Vec<DebugNode>,
    pub pats: Vec<DebugNode>,
    pub exprs: Vec<DebugNode>,
    pub module_decls: Vec<DebugNode>,
    pub functions: Vec<DebugNode>,
    pub classes: Vec<DebugNode>,
    pub class_members: Vec<DebugNode>,
    pub jsx_elements: Vec<DebugNode>,
    pub ts_types: Vec<DebugNode>,
}

pub fn ecma_fixture_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../swc_ecma_parser/tests")
}

pub fn snapshot_path_for(input: &Path, suffix: &str) -> PathBuf {
    let rel = input.strip_prefix(ecma_fixture_root()).unwrap_or_else(|_| {
        panic!(
            "fixture path {} is not inside {}",
            input.display(),
            ecma_fixture_root().display()
        )
    });

    let mut path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests/snapshots/ecma_reuse")
        .join(rel);
    let file_name = path
        .file_name()
        .unwrap_or_else(|| panic!("fixture path {} must have filename", input.display()))
        .to_string_lossy()
        .to_string();
    path.set_file_name(format!("{file_name}{suffix}"));

    path
}

pub fn normalized(path: &Path) -> String {
    path.to_string_lossy().replace('\\', "/")
}

fn read_json(path: &Path) -> Option<Value> {
    let content = fs::read_to_string(path).ok()?;
    serde_json::from_str::<Value>(&content).ok()
}

pub fn category_for_path(path: &Path) -> String {
    let rel = path.strip_prefix(ecma_fixture_root()).unwrap_or_else(|_| {
        panic!(
            "fixture path {} is not inside {}",
            path.display(),
            ecma_fixture_root().display()
        )
    });
    rel.components()
        .next()
        .unwrap_or_else(|| panic!("fixture path {} has no category", path.display()))
        .as_os_str()
        .to_string_lossy()
        .to_string()
}

pub fn collect_fixture_options(path: &Path) -> FixtureOptions {
    let mut out = FixtureOptions::default();
    let Some(parent) = path.parent() else {
        return out;
    };

    if let Some(options) = read_json(&parent.join("options.json")) {
        out.throws = options.get("throws").and_then(Value::as_str).is_some();
        out.source_type_module = options
            .get("sourceType")
            .and_then(Value::as_str)
            .map(|value| value == "module")
            .unwrap_or(false);

        if let Some(plugins) = options.get("plugins").and_then(Value::as_array) {
            if plugins.is_empty() {
                out.import_attributes = Some(false);
            } else {
                let mut enabled = false;
                for plugin in plugins {
                    let name = if let Some(name) = plugin.as_str() {
                        Some(name)
                    } else {
                        plugin
                            .as_array()
                            .and_then(|items| items.first())
                            .and_then(Value::as_str)
                    };
                    if matches!(name, Some("importAttributes" | "importAssertions")) {
                        enabled = true;
                    }
                }
                out.import_attributes = Some(enabled);
            }
        }
    }

    if let Some(config) = read_json(&parent.join("config.json")) {
        if let Some(import_attributes) = config.get("importAttributes").and_then(Value::as_bool) {
            out.import_attributes = Some(import_attributes);
        }
        if let Some(explicit_resource_management) = config
            .get("explicitResourceManagement")
            .and_then(Value::as_bool)
        {
            out.explicit_resource_management = Some(explicit_resource_management);
        }
        if let Some(jsx) = config.get("jsx").and_then(Value::as_bool) {
            out.jsx = Some(jsx);
        }
    }

    out
}

pub fn syntax_for_file(path: &Path, category: &str, options: &FixtureOptions) -> Syntax {
    let ext = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
    let file_name = normalized(path);
    let is_ts = matches!(ext, "ts" | "tsx" | "mts" | "cts");
    let is_tsx = ext == "tsx";
    let is_cjs = ext == "cjs";
    let is_jsx = options
        .jsx
        .unwrap_or(ext == "jsx" || is_tsx || file_name.contains("/jsx/"));

    if is_ts {
        Syntax::Typescript(TsSyntax {
            tsx: is_tsx,
            decorators: true,
            no_early_errors: category != "typescript-errors",
            disallow_ambiguous_jsx_like: matches!(ext, "mts" | "cts"),
            ..Default::default()
        })
    } else {
        Syntax::Es(EsSyntax {
            jsx: is_jsx,
            decorators: true,
            import_attributes: options.import_attributes.unwrap_or(true),
            explicit_resource_management: options.explicit_resource_management.unwrap_or(true),
            allow_return_outside_function: is_cjs,
            ..Default::default()
        })
    }
}

pub fn parse_mode_for(path: &Path, options: &FixtureOptions) -> ParseMode {
    let file = normalized(path);
    let file_name = path
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("");

    if path.extension().and_then(|ext| ext.to_str()) == Some("cjs") {
        return ParseMode::Script;
    }
    if options.source_type_module {
        return ParseMode::Module;
    }
    if file.contains("/test262-parser/") && file_name.contains("module") {
        return ParseMode::Module;
    }

    ParseMode::Program
}

pub fn is_expected_fail(case: &Case, options: &FixtureOptions) -> bool {
    let path = normalized(&case.path);

    if options.throws {
        return true;
    }
    if case.category == "errors" || case.category == "typescript-errors" {
        return true;
    }
    if case.category == "jsx" && path.contains("/jsx/errors/") {
        return true;
    }
    if case.category == "test262-parser" && path.contains("/test262-parser/fail/") {
        return true;
    }

    false
}

pub fn collect_files_for_category(category: &str) -> Vec<PathBuf> {
    let root = ecma_fixture_root().join(category);
    let mut files = Vec::new();

    for entry in WalkDir::new(&root).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file() {
            continue;
        }
        let path = entry.path();
        let Some(ext) = path.extension().and_then(|ext| ext.to_str()) else {
            continue;
        };
        if !matches!(
            ext,
            "js" | "jsx" | "cjs" | "mjs" | "ts" | "tsx" | "mts" | "cts"
        ) {
            continue;
        }
        files.push(path.to_path_buf());
    }

    files.sort();
    files
}

pub fn collect_cases_for_category(category: &str) -> Vec<Case> {
    collect_files_for_category(category)
        .into_iter()
        .map(|path| Case {
            path,
            category: category.to_string(),
        })
        .collect()
}

pub fn collect_cases_for_categories(categories: &[&str]) -> Vec<Case> {
    let mut cases = Vec::new();
    for category in categories {
        cases.extend(collect_cases_for_category(category));
    }
    cases.sort_by(|a, b| a.path.cmp(&b.path));
    cases
}

pub fn parse_loaded_file(fm: &SourceFile, case: &Case) -> ParseOutput {
    let options = collect_fixture_options(&case.path);
    let syntax = syntax_for_file(&case.path, &case.category, &options);
    let mode = parse_mode_for(&case.path, &options);
    let comments = SingleThreadedComments::default();
    let mut recovered = Vec::new();

    let result = match mode {
        ParseMode::Program => parse_file_as_program(fm, syntax, Some(&comments), &mut recovered),
        ParseMode::Module => parse_file_as_module(fm, syntax, Some(&comments), &mut recovered),
        ParseMode::Script => parse_file_as_script(fm, syntax, Some(&comments), &mut recovered),
    };

    let (parsed, fatal) = match result {
        Ok(parsed) => (Some(parsed), None),
        Err(err) => (None, Some(err)),
    };

    ParseOutput {
        parsed,
        fatal,
        recovered,
        comments,
    }
}

pub fn parse_case(case: &Case) -> ParseOutput {
    let cm = SourceMap::default();
    let fm = cm
        .load_file(&case.path)
        .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", case.path.display()));
    parse_loaded_file(&fm, case)
}

#[derive(Default)]
struct ReachableArenaCollector {
    programs_seen: BTreeSet<u64>,
    stmts_seen: BTreeSet<u64>,
    decls_seen: BTreeSet<u64>,
    pats_seen: BTreeSet<u64>,
    exprs_seen: BTreeSet<u64>,
    module_decls_seen: BTreeSet<u64>,
    functions_seen: BTreeSet<u64>,
    classes_seen: BTreeSet<u64>,
    class_members_seen: BTreeSet<u64>,
    jsx_elements_seen: BTreeSet<u64>,
    ts_types_seen: BTreeSet<u64>,

    programs: Vec<DebugNode>,
    stmts: Vec<DebugNode>,
    decls: Vec<DebugNode>,
    pats: Vec<DebugNode>,
    exprs: Vec<DebugNode>,
    module_decls: Vec<DebugNode>,
    functions: Vec<DebugNode>,
    classes: Vec<DebugNode>,
    class_members: Vec<DebugNode>,
    jsx_elements: Vec<DebugNode>,
    ts_types: Vec<DebugNode>,
}

impl ReachableArenaCollector {
    fn finish(mut self, root_program: ProgramId) -> ProgramArenaSnapshot {
        self.programs.sort_by_key(|entry| entry.id);
        self.stmts.sort_by_key(|entry| entry.id);
        self.decls.sort_by_key(|entry| entry.id);
        self.pats.sort_by_key(|entry| entry.id);
        self.exprs.sort_by_key(|entry| entry.id);
        self.module_decls.sort_by_key(|entry| entry.id);
        self.functions.sort_by_key(|entry| entry.id);
        self.classes.sort_by_key(|entry| entry.id);
        self.class_members.sort_by_key(|entry| entry.id);
        self.jsx_elements.sort_by_key(|entry| entry.id);
        self.ts_types.sort_by_key(|entry| entry.id);

        ProgramArenaSnapshot {
            root_program: root_program.as_raw(),
            programs: self.programs,
            stmts: self.stmts,
            decls: self.decls,
            pats: self.pats,
            exprs: self.exprs,
            module_decls: self.module_decls,
            functions: self.functions,
            classes: self.classes,
            class_members: self.class_members,
            jsx_elements: self.jsx_elements,
            ts_types: self.ts_types,
        }
    }
}

impl Visit for ReachableArenaCollector {
    fn visit_program(&mut self, store: &AstStore, id: ProgramId) {
        if !self.programs_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.program(id) else {
            return;
        };
        self.programs.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_program(self, store, id);
    }

    fn visit_stmt(&mut self, store: &AstStore, id: swc_es_ast::StmtId) {
        if !self.stmts_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.stmt(id) else {
            return;
        };
        self.stmts.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_stmt(self, store, id);
    }

    fn visit_decl(&mut self, store: &AstStore, id: swc_es_ast::DeclId) {
        if !self.decls_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.decl(id) else {
            return;
        };
        self.decls.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_decl(self, store, id);
    }

    fn visit_pat(&mut self, store: &AstStore, id: swc_es_ast::PatId) {
        if !self.pats_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.pat(id) else {
            return;
        };
        self.pats.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_pat(self, store, id);
    }

    fn visit_expr(&mut self, store: &AstStore, id: swc_es_ast::ExprId) {
        if !self.exprs_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.expr(id) else {
            return;
        };
        self.exprs.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_expr(self, store, id);
    }

    fn visit_module_decl(&mut self, store: &AstStore, id: swc_es_ast::ModuleDeclId) {
        if !self.module_decls_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.module_decl(id) else {
            return;
        };
        self.module_decls.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_module_decl(self, store, id);
    }

    fn visit_function(&mut self, store: &AstStore, id: swc_es_ast::FunctionId) {
        if !self.functions_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.function(id) else {
            return;
        };
        self.functions.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_function(self, store, id);
    }

    fn visit_class(&mut self, store: &AstStore, id: swc_es_ast::ClassId) {
        if !self.classes_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.class(id) else {
            return;
        };
        self.classes.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_class(self, store, id);
    }

    fn visit_class_member(&mut self, store: &AstStore, id: swc_es_ast::ClassMemberId) {
        if !self.class_members_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.class_member(id) else {
            return;
        };
        self.class_members.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_class_member(self, store, id);
    }

    fn visit_jsx_element(&mut self, store: &AstStore, id: swc_es_ast::JSXElementId) {
        if !self.jsx_elements_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.jsx_element(id) else {
            return;
        };
        self.jsx_elements.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_jsx_element(self, store, id);
    }

    fn visit_ts_type(&mut self, store: &AstStore, id: swc_es_ast::TsTypeId) {
        if !self.ts_types_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.ts_type(id) else {
            return;
        };
        self.ts_types.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_ts_type(self, store, id);
    }
}

pub fn build_program_debug_snapshot(parsed: &ParsedProgram) -> String {
    let mut collector = ReachableArenaCollector::default();
    parsed.program.visit_with(&parsed.store, &mut collector);
    let snapshot = collector.finish(parsed.program);
    format!("{snapshot:#?}\n")
}

pub fn span_of_program(node: &Program) -> Span {
    node.span
}

pub fn span_of_stmt(store: &AstStore, node: &Stmt) -> Option<Span> {
    match node {
        Stmt::Empty(v) => Some(v.span),
        Stmt::Block(v) => Some(v.span),
        Stmt::Expr(v) => Some(v.span),
        Stmt::Return(v) => Some(v.span),
        Stmt::If(v) => Some(v.span),
        Stmt::While(v) => Some(v.span),
        Stmt::For(v) => Some(v.span),
        Stmt::DoWhile(v) => Some(v.span),
        Stmt::Switch(v) => Some(v.span),
        Stmt::Try(v) => Some(v.span),
        Stmt::Throw(v) => Some(v.span),
        Stmt::With(v) => Some(v.span),
        Stmt::Break(v) => Some(v.span),
        Stmt::Continue(v) => Some(v.span),
        Stmt::Debugger(v) => Some(v.span),
        Stmt::Labeled(v) => Some(v.span),
        Stmt::Decl(id) => store.decl(*id).and_then(|decl| span_of_decl(store, decl)),
        Stmt::ModuleDecl(id) => store
            .module_decl(*id)
            .and_then(|decl| span_of_module_decl(store, decl)),
    }
}

pub fn span_of_decl(_store: &AstStore, node: &Decl) -> Option<Span> {
    match node {
        Decl::Var(v) => Some(v.span),
        Decl::Fn(v) => Some(v.span),
        Decl::Class(v) => Some(v.span),
        Decl::TsTypeAlias(v) => Some(v.span),
        Decl::TsInterface(v) => Some(v.span),
        Decl::TsEnum(v) => Some(v.span),
        Decl::TsModule(v) => Some(v.span),
    }
}

pub fn span_of_pat(store: &AstStore, node: &Pat) -> Option<Span> {
    match node {
        Pat::Ident(v) => Some(v.span),
        Pat::Expr(id) => store.expr(*id).and_then(|expr| span_of_expr(store, expr)),
        Pat::Array(v) => Some(v.span),
        Pat::Object(v) => Some(v.span),
        Pat::Rest(v) => Some(v.span),
        Pat::Assign(v) => Some(v.span),
    }
}

fn span_of_lit(node: &Lit) -> Span {
    match node {
        Lit::Str(v) => v.span,
        Lit::Num(v) => v.span,
        Lit::BigInt(v) => v.span,
        Lit::Bool(v) => v.span,
        Lit::Null(v) => v.span,
        Lit::Regex(v) => v.span,
    }
}

pub fn span_of_expr(store: &AstStore, node: &Expr) -> Option<Span> {
    match node {
        Expr::Ident(v) => Some(v.span),
        Expr::Lit(v) => Some(span_of_lit(v)),
        Expr::Function(id) => store.function(*id).map(|func| func.span),
        Expr::Class(id) => store.class(*id).map(|class| class.span),
        Expr::JSXElement(id) => store.jsx_element(*id).map(|element| element.span),
        Expr::TsAs(v) => Some(v.span),
        Expr::Array(v) => Some(v.span),
        Expr::Object(v) => Some(v.span),
        Expr::Unary(v) => Some(v.span),
        Expr::Binary(v) => Some(v.span),
        Expr::Assign(v) => Some(v.span),
        Expr::Call(v) => Some(v.span),
        Expr::Member(v) => Some(v.span),
        Expr::Cond(v) => Some(v.span),
        Expr::Seq(v) => Some(v.span),
        Expr::New(v) => Some(v.span),
        Expr::Update(v) => Some(v.span),
        Expr::Await(v) => Some(v.span),
        Expr::Arrow(v) => Some(v.span),
        Expr::Template(v) => Some(v.span),
        Expr::Yield(v) => Some(v.span),
        Expr::TaggedTemplate(v) => Some(v.span),
        Expr::MetaProp(v) => Some(v.span),
        Expr::OptChain(v) => Some(v.span),
        Expr::Paren(v) => Some(v.span),
    }
}

pub fn span_of_module_decl(_store: &AstStore, node: &ModuleDecl) -> Option<Span> {
    match node {
        ModuleDecl::Import(v) => Some(v.span),
        ModuleDecl::ExportNamed(v) => Some(v.span),
        ModuleDecl::ExportDefaultExpr(v) => Some(v.span),
        ModuleDecl::ExportDefaultDecl(v) => Some(v.span),
        ModuleDecl::ExportAll(v) => Some(v.span),
        ModuleDecl::ExportDecl(v) => Some(v.span),
    }
}

pub fn span_of_class_member(node: &ClassMember) -> Span {
    match node {
        ClassMember::Method(v) => v.span,
        ClassMember::Prop(v) => v.span,
        ClassMember::StaticBlock(v) => v.span,
    }
}

pub fn span_of_ts_type(_store: &AstStore, node: &TsType) -> Option<Span> {
    match node {
        TsType::Keyword(_) => None,
        TsType::TypeRef(v) => Some(v.span),
        TsType::Lit(v) => Some(match v {
            TsLitType::Str(lit) => lit.span,
            TsLitType::Num(lit) => lit.span,
            TsLitType::Bool(lit) => lit.span,
        }),
        TsType::Array(v) => Some(v.span),
        TsType::Tuple(v) => Some(v.span),
        TsType::Union(v) => Some(v.span),
        TsType::Intersection(v) => Some(v.span),
        TsType::Parenthesized(v) => Some(v.span),
        TsType::TypeLit(v) => Some(v.span),
        TsType::Fn(v) => Some(v.span),
        TsType::Conditional(v) => Some(v.span),
        TsType::IndexedAccess(v) => Some(v.span),
        TsType::TypeOperator(v) => Some(v.span),
        TsType::Infer(v) => Some(v.span),
        TsType::Import(v) => Some(v.span),
        TsType::TypeQuery(v) => Some(v.span),
        TsType::Mapped(v) => Some(v.span),
    }
}

pub fn stmt_label(node: &Stmt) -> &'static str {
    match node {
        Stmt::Empty(_) => "EmptyStmt",
        Stmt::Block(_) => "BlockStmt",
        Stmt::Expr(_) => "ExprStmt",
        Stmt::Return(_) => "ReturnStmt",
        Stmt::If(_) => "IfStmt",
        Stmt::While(_) => "WhileStmt",
        Stmt::For(_) => "ForStmt",
        Stmt::DoWhile(_) => "DoWhileStmt",
        Stmt::Switch(_) => "SwitchStmt",
        Stmt::Try(_) => "TryStmt",
        Stmt::Throw(_) => "ThrowStmt",
        Stmt::With(_) => "WithStmt",
        Stmt::Break(_) => "BreakStmt",
        Stmt::Continue(_) => "ContinueStmt",
        Stmt::Debugger(_) => "DebuggerStmt",
        Stmt::Labeled(_) => "LabeledStmt",
        Stmt::Decl(_) => "DeclStmt",
        Stmt::ModuleDecl(_) => "ModuleDeclStmt",
    }
}

pub fn decl_label(node: &Decl) -> &'static str {
    match node {
        Decl::Var(_) => "VarDecl",
        Decl::Fn(_) => "FnDecl",
        Decl::Class(_) => "ClassDecl",
        Decl::TsTypeAlias(_) => "TsTypeAliasDecl",
        Decl::TsInterface(_) => "TsInterfaceDecl",
        Decl::TsEnum(_) => "TsEnumDecl",
        Decl::TsModule(_) => "TsModuleDecl",
    }
}

pub fn pat_label(node: &Pat) -> &'static str {
    match node {
        Pat::Ident(_) => "IdentPat",
        Pat::Expr(_) => "ExprPat",
        Pat::Array(_) => "ArrayPat",
        Pat::Object(_) => "ObjectPat",
        Pat::Rest(_) => "RestPat",
        Pat::Assign(_) => "AssignPat",
    }
}

pub fn expr_label(node: &Expr) -> &'static str {
    match node {
        Expr::Ident(_) => "IdentExpr",
        Expr::Lit(_) => "LitExpr",
        Expr::Function(_) => "FunctionExpr",
        Expr::Class(_) => "ClassExpr",
        Expr::JSXElement(_) => "JSXElementExpr",
        Expr::TsAs(_) => "TsAsExpr",
        Expr::Array(_) => "ArrayExpr",
        Expr::Object(_) => "ObjectExpr",
        Expr::Unary(_) => "UnaryExpr",
        Expr::Binary(_) => "BinaryExpr",
        Expr::Assign(_) => "AssignExpr",
        Expr::Call(_) => "CallExpr",
        Expr::Member(_) => "MemberExpr",
        Expr::Cond(_) => "CondExpr",
        Expr::Seq(_) => "SeqExpr",
        Expr::New(_) => "NewExpr",
        Expr::Update(_) => "UpdateExpr",
        Expr::Await(_) => "AwaitExpr",
        Expr::Arrow(_) => "ArrowExpr",
        Expr::Template(_) => "TemplateExpr",
        Expr::Yield(_) => "YieldExpr",
        Expr::TaggedTemplate(_) => "TaggedTemplateExpr",
        Expr::MetaProp(_) => "MetaPropExpr",
        Expr::OptChain(_) => "OptChainExpr",
        Expr::Paren(_) => "ParenExpr",
    }
}

pub fn module_decl_label(node: &ModuleDecl) -> &'static str {
    match node {
        ModuleDecl::Import(_) => "ImportDecl",
        ModuleDecl::ExportNamed(_) => "ExportNamedDecl",
        ModuleDecl::ExportDefaultExpr(_) => "ExportDefaultExprDecl",
        ModuleDecl::ExportDefaultDecl(_) => "ExportDefaultDecl",
        ModuleDecl::ExportAll(_) => "ExportAllDecl",
        ModuleDecl::ExportDecl(_) => "ExportDecl",
    }
}

pub fn class_member_label(node: &ClassMember) -> &'static str {
    match node {
        ClassMember::Method(_) => "ClassMethod",
        ClassMember::Prop(_) => "ClassProp",
        ClassMember::StaticBlock(_) => "ClassStaticBlock",
    }
}

pub fn ts_type_label(node: &TsType) -> &'static str {
    match node {
        TsType::Keyword(_) => "TsKeywordType",
        TsType::TypeRef(_) => "TsTypeRef",
        TsType::Lit(_) => "TsLitType",
        TsType::Array(_) => "TsArrayType",
        TsType::Tuple(_) => "TsTupleType",
        TsType::Union(_) => "TsUnionType",
        TsType::Intersection(_) => "TsIntersectionType",
        TsType::Parenthesized(_) => "TsParenthesizedType",
        TsType::TypeLit(_) => "TsTypeLit",
        TsType::Fn(_) => "TsFnType",
        TsType::Conditional(_) => "TsConditionalType",
        TsType::IndexedAccess(_) => "TsIndexedAccessType",
        TsType::TypeOperator(_) => "TsTypeOperatorType",
        TsType::Infer(_) => "TsInferType",
        TsType::Import(_) => "TsImportType",
        TsType::TypeQuery(_) => "TsTypeQuery",
        TsType::Mapped(_) => "TsMappedType",
    }
}
