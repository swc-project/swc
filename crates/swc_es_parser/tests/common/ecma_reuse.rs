#![allow(dead_code)]

use std::{
    collections::BTreeSet,
    fmt::Debug,
    fs,
    path::{Path, PathBuf},
};

use serde::Serialize;
use serde_json::Value;
use swc_common::{
    comments::SingleThreadedComments, sync::Lrc, FileName, SourceFile, SourceMap, Span,
};
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

pub const PARSE_FIXTURE_EXTENSIONS: &[&str] =
    &["js", "jsx", "cjs", "mjs", "ts", "tsx", "mts", "cts"];

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

#[derive(Debug, Clone, Serialize)]
pub struct ProgramArenaSnapshot {
    pub programs: Vec<String>,
    pub stmts: Vec<String>,
    pub decls: Vec<String>,
    pub pats: Vec<String>,
    pub exprs: Vec<String>,
    pub module_decls: Vec<String>,
    pub functions: Vec<String>,
    pub classes: Vec<String>,
    pub class_members: Vec<String>,
    pub jsx_elements: Vec<String>,
    pub ts_types: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
struct CanonicalProgramArenaSnapshot {
    pub programs: Vec<String>,
    pub stmts: Vec<String>,
    pub decls: Vec<String>,
    pub pats: Vec<String>,
    pub exprs: Vec<String>,
    pub module_decls: Vec<String>,
    pub functions: Vec<String>,
    pub classes: Vec<String>,
    pub class_members: Vec<String>,
    pub jsx_elements: Vec<String>,
    pub ts_types: Vec<String>,
}

pub fn ecma_fixture_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../swc_ecma_parser/tests")
}

pub fn load_ecma_fixture_file(cm: &Lrc<SourceMap>, path: &Path) -> Lrc<SourceFile> {
    let root = canonicalize_or_self(&ecma_fixture_root());
    let path = canonicalize_or_self(path);
    let rel = path.strip_prefix(&root).unwrap_or_else(|_| {
        panic!(
            "fixture path {} is not inside {}",
            path.display(),
            root.display()
        )
    });

    let file_name = format!("/swc_ecma_parser/tests/{}", normalized(rel));
    let src = fs::read_to_string(&path)
        .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", path.display()));

    cm.new_source_file(FileName::Custom(file_name).into(), src)
}

fn canonicalize_or_self(path: &Path) -> PathBuf {
    path.canonicalize().unwrap_or_else(|_| path.to_path_buf())
}

pub fn snapshot_path_for(input: &Path, suffix: &str) -> PathBuf {
    let root = canonicalize_or_self(&ecma_fixture_root());
    let input = canonicalize_or_self(input);
    let rel = input.strip_prefix(&root).unwrap_or_else(|_| {
        panic!(
            "fixture path {} is not inside {}",
            input.display(),
            root.display()
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

pub fn read_es_syntax_config(path: &Path) -> Option<EsSyntax> {
    let content = fs::read_to_string(path).ok()?;
    serde_json::from_str::<EsSyntax>(&content).ok()
}

pub fn category_for_path(path: &Path) -> String {
    let root = canonicalize_or_self(&ecma_fixture_root());
    let path = canonicalize_or_self(path);
    let rel = path.strip_prefix(&root).unwrap_or_else(|_| {
        panic!(
            "fixture path {} is not inside {}",
            path.display(),
            root.display()
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
    if case.category == "span"
        && matches!(
            path.as_str(),
            p if p.ends_with("/span/js/super/expr.js")
                || p.ends_with("/span/js/super/obj1.js")
                || p.ends_with("/span/js/super/obj2.js")
                || p.ends_with("/span/js/super/obj4.js")
        )
    {
        return true;
    }

    false
}

fn is_parse_fixture_file(path: &Path) -> bool {
    let Some(ext) = path.extension().and_then(|ext| ext.to_str()) else {
        return false;
    };

    PARSE_FIXTURE_EXTENSIONS.contains(&ext)
}

fn should_include_parse_fixture(path: &Path) -> bool {
    let path = normalized(path);
    if path.contains("/binding-pattern/") || path.contains("/test262-error-references/") {
        return false;
    }

    if path.contains("/test262-parser/") {
        return path.contains("/test262-parser/pass/") || path.contains("/test262-parser/fail/");
    }

    true
}

fn count_parse_fixtures(root: &Path) -> usize {
    WalkDir::new(root)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|entry| {
            entry.file_type().is_file()
                && is_parse_fixture_file(entry.path())
                && should_include_parse_fixture(entry.path())
        })
        .count()
}

pub fn ensure_test262_fixture_corpus() {
    let root = ecma_fixture_root().join("test262-parser");
    let pass = root.join("pass");
    let fail = root.join("fail");

    if !pass.is_dir() || !fail.is_dir() {
        panic!(
            "test262 fixture corpus is not initialized at {}. Run `git submodule update --init \
             --recursive`.",
            root.display()
        );
    }

    let pass_count = count_parse_fixtures(&pass);
    let fail_count = count_parse_fixtures(&fail);

    if pass_count == 0 || fail_count == 0 {
        panic!(
            "test262 fixture corpus is incomplete at {} (pass files: {}, fail files: {}). Run \
             `git submodule update --init --recursive`.",
            root.display(),
            pass_count,
            fail_count
        );
    }
}

pub fn collect_files_for_category(category: &str) -> Vec<PathBuf> {
    if category == "test262-parser" {
        ensure_test262_fixture_corpus();
    }

    let root = ecma_fixture_root().join(category);
    let mut files = Vec::new();

    for entry in WalkDir::new(&root).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file()
            || !is_parse_fixture_file(entry.path())
            || !should_include_parse_fixture(entry.path())
        {
            continue;
        }
        files.push(entry.path().to_path_buf());
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

pub fn collect_all_fixture_files() -> Vec<PathBuf> {
    ensure_test262_fixture_corpus();

    let root = ecma_fixture_root();
    let mut files = Vec::new();

    for entry in WalkDir::new(&root).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file()
            || !is_parse_fixture_file(entry.path())
            || !should_include_parse_fixture(entry.path())
        {
            continue;
        }
        files.push(entry.path().to_path_buf());
    }

    files.sort();
    files
}

pub fn collect_all_parse_cases() -> Vec<Case> {
    collect_all_fixture_files()
        .into_iter()
        .map(|path| {
            let category = category_for_path(&path);
            Case { path, category }
        })
        .collect()
}

pub fn parse_loaded_file(fm: &SourceFile, case: &Case) -> ParseOutput {
    let options = collect_fixture_options(&case.path);
    let syntax = syntax_for_file(&case.path, &case.category, &options);
    let mode = parse_mode_for(&case.path, &options);
    parse_loaded_file_with_syntax_mode(fm, syntax, mode)
}

pub fn parse_loaded_file_with_syntax_mode(
    fm: &SourceFile,
    syntax: Syntax,
    mode: ParseMode,
) -> ParseOutput {
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

pub fn parse_case_with_syntax_mode(case: &Case, syntax: Syntax, mode: ParseMode) -> ParseOutput {
    let cm = SourceMap::default();
    let fm = cm
        .load_file(&case.path)
        .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", case.path.display()));
    parse_loaded_file_with_syntax_mode(&fm, syntax, mode)
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

    programs: Vec<(u64, String)>,
    stmts: Vec<(u64, String)>,
    decls: Vec<(u64, String)>,
    pats: Vec<(u64, String)>,
    exprs: Vec<(u64, String)>,
    module_decls: Vec<(u64, String)>,
    functions: Vec<(u64, String)>,
    classes: Vec<(u64, String)>,
    class_members: Vec<(u64, String)>,
    jsx_elements: Vec<(u64, String)>,
    ts_types: Vec<(u64, String)>,
}

impl ReachableArenaCollector {
    fn finish(mut self) -> ProgramArenaSnapshot {
        self.programs.sort_by_key(|(id, _)| *id);
        self.stmts.sort_by_key(|(id, _)| *id);
        self.decls.sort_by_key(|(id, _)| *id);
        self.pats.sort_by_key(|(id, _)| *id);
        self.exprs.sort_by_key(|(id, _)| *id);
        self.module_decls.sort_by_key(|(id, _)| *id);
        self.functions.sort_by_key(|(id, _)| *id);
        self.classes.sort_by_key(|(id, _)| *id);
        self.class_members.sort_by_key(|(id, _)| *id);
        self.jsx_elements.sort_by_key(|(id, _)| *id);
        self.ts_types.sort_by_key(|(id, _)| *id);

        ProgramArenaSnapshot {
            programs: into_nodes(self.programs),
            stmts: into_nodes(self.stmts),
            decls: into_nodes(self.decls),
            pats: into_nodes(self.pats),
            exprs: into_nodes(self.exprs),
            module_decls: into_nodes(self.module_decls),
            functions: into_nodes(self.functions),
            classes: into_nodes(self.classes),
            class_members: into_nodes(self.class_members),
            jsx_elements: into_nodes(self.jsx_elements),
            ts_types: into_nodes(self.ts_types),
        }
    }
}

fn into_nodes(entries: Vec<(u64, String)>) -> Vec<String> {
    entries.into_iter().map(|(_, node)| node).collect()
}

/// Scrubs arena-handle debug blocks (`Id { index: .., generation: .. }`) from
/// node dumps.
fn scrub_arena_handles(debug: &str) -> String {
    let mut out = String::with_capacity(debug.len());
    let mut pos = 0usize;

    while let Some(rel_start) = debug[pos..].find("Id {") {
        let start = pos + rel_start;
        out.push_str(&debug[pos..start]);

        let block_start = start + "Id {".len();
        let mut depth = 1usize;
        let mut cursor = block_start;
        let bytes = debug.as_bytes();
        while cursor < bytes.len() {
            match bytes[cursor] {
                b'{' => depth += 1,
                b'}' => {
                    depth -= 1;
                    if depth == 0 {
                        break;
                    }
                }
                _ => {}
            }
            cursor += 1;
        }

        if depth != 0 {
            out.push_str(&debug[start..]);
            return out;
        }

        let end = cursor;
        let block = &debug[start..=end];
        if block.contains("index:") && block.contains("generation:") {
            out.push('_');
        } else {
            out.push_str(block);
        }

        pos = end + 1;
    }

    out.push_str(&debug[pos..]);
    out
}

fn normalized_debug_node<T: Debug>(node: &T) -> String {
    scrub_arena_handles(&format!("{node:#?}"))
}

impl Visit for ReachableArenaCollector {
    fn visit_program(&mut self, store: &AstStore, id: ProgramId) {
        if !self.programs_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.program(id) else {
            return;
        };
        self.programs
            .push((id.as_raw(), normalized_debug_node(node)));
        walk_program(self, store, id);
    }

    fn visit_stmt(&mut self, store: &AstStore, id: swc_es_ast::StmtId) {
        if !self.stmts_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.stmt(id) else {
            return;
        };
        self.stmts.push((id.as_raw(), normalized_debug_node(node)));
        walk_stmt(self, store, id);
    }

    fn visit_decl(&mut self, store: &AstStore, id: swc_es_ast::DeclId) {
        if !self.decls_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.decl(id) else {
            return;
        };
        self.decls.push((id.as_raw(), normalized_debug_node(node)));
        walk_decl(self, store, id);
    }

    fn visit_pat(&mut self, store: &AstStore, id: swc_es_ast::PatId) {
        if !self.pats_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.pat(id) else {
            return;
        };
        self.pats.push((id.as_raw(), normalized_debug_node(node)));
        walk_pat(self, store, id);
    }

    fn visit_expr(&mut self, store: &AstStore, id: swc_es_ast::ExprId) {
        if !self.exprs_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.expr(id) else {
            return;
        };
        self.exprs.push((id.as_raw(), normalized_debug_node(node)));
        walk_expr(self, store, id);
    }

    fn visit_module_decl(&mut self, store: &AstStore, id: swc_es_ast::ModuleDeclId) {
        if !self.module_decls_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.module_decl(id) else {
            return;
        };
        self.module_decls
            .push((id.as_raw(), normalized_debug_node(node)));
        walk_module_decl(self, store, id);
    }

    fn visit_function(&mut self, store: &AstStore, id: swc_es_ast::FunctionId) {
        if !self.functions_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.function(id) else {
            return;
        };
        self.functions
            .push((id.as_raw(), normalized_debug_node(node)));
        walk_function(self, store, id);
    }

    fn visit_class(&mut self, store: &AstStore, id: swc_es_ast::ClassId) {
        if !self.classes_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.class(id) else {
            return;
        };
        self.classes
            .push((id.as_raw(), normalized_debug_node(node)));
        walk_class(self, store, id);
    }

    fn visit_class_member(&mut self, store: &AstStore, id: swc_es_ast::ClassMemberId) {
        if !self.class_members_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.class_member(id) else {
            return;
        };
        self.class_members
            .push((id.as_raw(), normalized_debug_node(node)));
        walk_class_member(self, store, id);
    }

    fn visit_jsx_element(&mut self, store: &AstStore, id: swc_es_ast::JSXElementId) {
        if !self.jsx_elements_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.jsx_element(id) else {
            return;
        };
        self.jsx_elements
            .push((id.as_raw(), normalized_debug_node(node)));
        walk_jsx_element(self, store, id);
    }

    fn visit_ts_type(&mut self, store: &AstStore, id: swc_es_ast::TsTypeId) {
        if !self.ts_types_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.ts_type(id) else {
            return;
        };
        self.ts_types
            .push((id.as_raw(), normalized_debug_node(node)));
        walk_ts_type(self, store, id);
    }
}

fn collect_program_snapshot(parsed: &ParsedProgram) -> ProgramArenaSnapshot {
    let mut collector = ReachableArenaCollector::default();
    parsed.program.visit_with(&parsed.store, &mut collector);
    collector.finish()
}

pub fn build_program_json_snapshot(parsed: &ParsedProgram) -> String {
    let snapshot = collect_program_snapshot(parsed);
    let mut output =
        serde_json::to_string_pretty(&snapshot).expect("failed to serialize program snapshot");
    output.push('\n');
    output
}

fn normalize_debug_node_for_canonical(node: &str) -> String {
    let mut out = String::with_capacity(node.len());
    let bytes = node.as_bytes();
    let mut i = 0usize;

    while i < bytes.len() {
        if bytes[i..].starts_with(b"span: ") {
            out.push_str("span: _.._");
            i += "span: ".len();
            while i < bytes.len() && bytes[i].is_ascii_whitespace() {
                i += 1;
            }
            while i < bytes.len() {
                let b = bytes[i];
                if b == b',' || b == b'\n' {
                    break;
                }
                i += 1;
            }
            continue;
        }

        if bytes[i..].starts_with(b"index: ") {
            out.push_str("index: _");
            i += "index: ".len();
            while i < bytes.len() && bytes[i].is_ascii_digit() {
                i += 1;
            }
            continue;
        }

        if bytes[i..].starts_with(b"generation: ") {
            out.push_str("generation: _");
            i += "generation: ".len();
            while i < bytes.len() && bytes[i].is_ascii_digit() {
                i += 1;
            }
            continue;
        }

        out.push(bytes[i] as char);
        i += 1;
    }

    out
}

fn should_drop_canonical_expr(node: &str) -> bool {
    node.trim_start().starts_with("Paren(")
}

pub fn build_program_canonical_json(parsed: &ParsedProgram) -> Value {
    let snapshot = collect_program_snapshot(parsed);
    let canonical = CanonicalProgramArenaSnapshot {
        programs: snapshot
            .programs
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry))
            .collect(),
        stmts: snapshot
            .stmts
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry))
            .collect(),
        decls: snapshot
            .decls
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry))
            .collect(),
        pats: snapshot
            .pats
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry))
            .collect(),
        exprs: snapshot
            .exprs
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry))
            .filter(|node| !should_drop_canonical_expr(node))
            .collect(),
        module_decls: snapshot
            .module_decls
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry))
            .collect(),
        functions: snapshot
            .functions
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry))
            .collect(),
        classes: snapshot
            .classes
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry))
            .collect(),
        class_members: snapshot
            .class_members
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry))
            .collect(),
        jsx_elements: snapshot
            .jsx_elements
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry))
            .collect(),
        ts_types: snapshot
            .ts_types
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry))
            .collect(),
    };

    serde_json::to_value(canonical).expect("failed to convert canonical snapshot to json value")
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
        Expr::TsNonNull(v) => Some(v.span),
        Expr::TsSatisfies(v) => Some(v.span),
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
        Expr::TsNonNull(_) => "TsNonNullExpr",
        Expr::TsSatisfies(_) => "TsSatisfiesExpr",
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
