use std::{
    fmt::Write as _,
    fs,
    path::{Path, PathBuf},
};

use swc_common::{comments::SingleThreadedComments, SourceMap};
use swc_es_ast::{AstStore, Decl, Expr, Lit, ModuleDecl, Program, Stmt, TsLitType, TsType};
use swc_es_parser::{parse_file_as_program, Error, EsSyntax, Syntax, TsSyntax};
use testing::StdErr;
use walkdir::WalkDir;

fn ecma_fixture_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../swc_ecma_parser/tests")
}

fn snapshot_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tests/fixtures")
}

fn collect_fixture_files(category: &str, exts: &[&str]) -> Vec<PathBuf> {
    let root = ecma_fixture_root().join(category);
    let mut files = Vec::new();

    for entry in WalkDir::new(&root).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file() {
            continue;
        }

        let path = entry.path();
        let ext = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
        if exts.contains(&ext) {
            files.push(path.to_path_buf());
        }
    }

    files.sort();
    files
}

fn syntax_for_file(path: &Path) -> Syntax {
    let ext = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
    let file_name = path.to_string_lossy().replace('\\', "/");
    let is_ts = matches!(ext, "ts" | "tsx" | "mts" | "cts");
    let is_tsx = ext == "tsx";
    let is_jsx = ext == "jsx" || is_tsx || file_name.contains("/jsx/");

    if is_ts {
        Syntax::Typescript(TsSyntax {
            tsx: is_tsx,
            decorators: true,
            disallow_ambiguous_jsx_like: matches!(ext, "mts" | "cts"),
            ..Default::default()
        })
    } else {
        Syntax::Es(EsSyntax {
            jsx: is_jsx,
            decorators: true,
            import_attributes: true,
            explicit_resource_management: true,
            ..Default::default()
        })
    }
}

fn snapshot_path_for_input(input: &Path) -> PathBuf {
    let root = ecma_fixture_root();
    let rel = input.strip_prefix(root).unwrap_or(input);
    let mut out = snapshot_root().join(rel);
    let file_name = out
        .file_name()
        .expect("fixture path should have a file name")
        .to_string_lossy();
    out.set_file_name(format!("{file_name}.swc-es-parser"));
    out
}

fn expr_shape(store: &AstStore, expr: swc_es_ast::ExprId) -> String {
    let Some(node) = store.expr(expr) else {
        return "MissingExpr".to_string();
    };

    match node {
        Expr::Ident(ident) => format!("Ident({})", ident.sym),
        Expr::Lit(Lit::Str(_)) => "Lit(Str)".to_string(),
        Expr::Lit(Lit::Bool(_)) => "Lit(Bool)".to_string(),
        Expr::Lit(Lit::Null(_)) => "Lit(Null)".to_string(),
        Expr::Lit(Lit::Num(_)) => "Lit(Num)".to_string(),
        Expr::Function(function) => {
            if let Some(function) = store.function(*function) {
                format!(
                    "Function(params={}, body={})",
                    function.params.len(),
                    function.body.len()
                )
            } else {
                "Function(Missing)".to_string()
            }
        }
        Expr::Class(class) => {
            if let Some(class) = store.class(*class) {
                format!("Class(members={})", class.body.len())
            } else {
                "Class(Missing)".to_string()
            }
        }
        Expr::JSXElement(jsx) => {
            if let Some(jsx) = store.jsx_element(*jsx) {
                format!("JSX(children={})", jsx.children.len())
            } else {
                "JSX(Missing)".to_string()
            }
        }
        Expr::TsAs(ts_as) => format!("TsAs({})", expr_shape(store, ts_as.expr)),
        Expr::Array(array) => format!("Array(elems={})", array.elems.len()),
        Expr::Object(object) => format!("Object(props={})", object.props.len()),
        Expr::Unary(unary) => format!("Unary({:?})", unary.op),
        Expr::Binary(binary) => format!("Binary({:?})", binary.op),
        Expr::Assign(assign) => format!("Assign({:?})", assign.op),
        Expr::Call(call) => format!("Call(args={})", call.args.len()),
        Expr::Member(_) => "Member".to_string(),
    }
}

fn ts_type_shape(store: &AstStore, ty: swc_es_ast::TsTypeId) -> String {
    let Some(node) = store.ts_type(ty) else {
        return "MissingType".to_string();
    };

    match node {
        TsType::Keyword(keyword) => format!("Keyword({keyword:?})"),
        TsType::TypeRef(reference) => format!("TypeRef({})", reference.name.sym),
        TsType::Lit(TsLitType::Str(_)) => "Lit(Str)".to_string(),
        TsType::Lit(TsLitType::Num(_)) => "Lit(Num)".to_string(),
        TsType::Lit(TsLitType::Bool(_)) => "Lit(Bool)".to_string(),
    }
}

fn stmt_shape(store: &AstStore, stmt: swc_es_ast::StmtId) -> String {
    let Some(node) = store.stmt(stmt) else {
        return "MissingStmt".to_string();
    };

    match node {
        Stmt::Empty(_) => "Empty".to_string(),
        Stmt::Block(block) => format!("Block(stmts={})", block.stmts.len()),
        Stmt::Expr(expr) => format!("Expr({})", expr_shape(store, expr.expr)),
        Stmt::Return(ret) => match ret.arg {
            Some(arg) => format!("Return({})", expr_shape(store, arg)),
            None => "Return(None)".to_string(),
        },
        Stmt::If(if_stmt) => format!("If(test={})", expr_shape(store, if_stmt.test)),
        Stmt::While(while_stmt) => format!("While(test={})", expr_shape(store, while_stmt.test)),
        Stmt::For(_) => "For".to_string(),
        Stmt::Decl(decl) => match store.decl(*decl) {
            Some(Decl::Var(var)) => format!("Decl(Var({:?}, {}))", var.kind, var.declarators.len()),
            Some(Decl::Fn(function)) => {
                format!(
                    "Decl(Fn({}, {}))",
                    function.ident.sym,
                    function.params.len()
                )
            }
            Some(Decl::TsTypeAlias(alias)) => {
                format!(
                    "Decl(TsTypeAlias({}, {}))",
                    alias.ident.sym,
                    ts_type_shape(store, alias.ty)
                )
            }
            None => "Decl(Missing)".to_string(),
        },
        Stmt::ModuleDecl(module_decl) => match store.module_decl(*module_decl) {
            Some(ModuleDecl::Import(import)) => format!("ModuleDecl(Import({}))", import.src.value),
            Some(ModuleDecl::ExportNamed(named)) => {
                format!(
                    "ModuleDecl(ExportNamed(specifiers={}, has_src={}, has_decl={}))",
                    named.specifiers.len(),
                    named.src.is_some(),
                    named.decl.is_some()
                )
            }
            Some(ModuleDecl::ExportDefaultExpr(_)) => "ModuleDecl(ExportDefaultExpr)".to_string(),
            Some(ModuleDecl::ExportDecl(_)) => "ModuleDecl(ExportDecl)".to_string(),
            None => "ModuleDecl(Missing)".to_string(),
        },
    }
}

fn render_error(error: &Error) -> String {
    format!(
        "[{:?}] {:?}: {}",
        error.severity(),
        error.code(),
        error.message()
    )
}

fn render_program_snapshot(store: &AstStore, program: &Program, errors: &[Error]) -> String {
    let mut out = String::new();

    writeln!(&mut out, "status: ok").expect("write should not fail");
    writeln!(&mut out, "kind: {:?}", program.kind).expect("write should not fail");
    writeln!(&mut out, "body_len: {}", program.body.len()).expect("write should not fail");

    for (index, stmt) in program.body.iter().enumerate() {
        writeln!(&mut out, "stmt[{index}]: {}", stmt_shape(store, *stmt))
            .expect("write should not fail");
    }

    writeln!(&mut out, "recovered_errors: {}", errors.len()).expect("write should not fail");
    for error in errors {
        writeln!(&mut out, "error: {}", render_error(error)).expect("write should not fail");
    }

    out
}

fn render_fatal_snapshot(fatal: Error, recovered_errors: &[Error]) -> String {
    let mut out = String::new();
    writeln!(&mut out, "status: fatal").expect("write should not fail");
    writeln!(&mut out, "fatal: {}", render_error(&fatal)).expect("write should not fail");
    writeln!(&mut out, "recovered_errors: {}", recovered_errors.len())
        .expect("write should not fail");
    for error in recovered_errors {
        writeln!(&mut out, "error: {}", render_error(error)).expect("write should not fail");
    }
    out
}

fn run_fixture(path: &Path) {
    let cm = SourceMap::default();
    let fm = cm
        .load_file(path)
        .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", path.display()));

    let comments = SingleThreadedComments::default();
    let mut recovered_errors = Vec::new();
    let syntax = syntax_for_file(path);
    let output = match parse_file_as_program(&fm, syntax, Some(&comments), &mut recovered_errors) {
        Ok(parsed) => {
            let program = parsed
                .store
                .program(parsed.program)
                .expect("program should exist");
            render_program_snapshot(&parsed.store, program, &recovered_errors)
        }
        Err(fatal) => render_fatal_snapshot(fatal, &recovered_errors),
    };

    let snapshot = snapshot_path_for_input(path);
    let should_compare = snapshot.exists() || std::env::var_os("UPDATE").is_some();
    if !should_compare {
        return;
    }

    let parent = snapshot
        .parent()
        .expect("snapshot path should have a parent directory");
    fs::create_dir_all(parent).expect("failed to create snapshot directory");

    if StdErr::from(output).compare_to_file(&snapshot).is_err() {
        panic!();
    }
}

fn run_category(category: &str, exts: &[&str]) {
    if std::env::var_os("UPDATE").is_none() && !snapshot_root().join(category).exists() {
        eprintln!(
            "skipping {category} fixtures because no snapshots exist yet; run with UPDATE=1 to \
             generate them"
        );
        return;
    }

    let fixtures = collect_fixture_files(category, exts);
    assert!(
        !fixtures.is_empty(),
        "no fixtures found for category {category}"
    );
    for fixture in fixtures {
        run_fixture(&fixture);
    }
}

#[test]
fn fixtures_js() {
    run_category("js", &["js", "mjs", "cjs"]);
}

#[test]
fn fixtures_jsx() {
    run_category("jsx", &["js", "jsx"]);
}

#[test]
fn fixtures_typescript() {
    run_category("typescript", &["ts", "tsx", "mts", "cts"]);
}

#[test]
fn fixtures_typescript_errors() {
    run_category("typescript-errors", &["ts", "tsx", "mts", "cts"]);
}

#[test]
fn fixtures_errors() {
    run_category("errors", &["js", "mjs", "cjs", "ts", "tsx"]);
}

#[test]
fn fixtures_comments() {
    run_category("comments", &["js"]);
}

#[test]
fn fixtures_span() {
    run_category("span", &["js", "ts"]);
}

#[test]
fn fixtures_shifted() {
    run_category("shifted", &["ts"]);
}

#[test]
fn fixtures_tsc() {
    run_category("tsc", &["ts", "tsx", "js"]);
}

#[test]
fn fixtures_test262() {
    run_category("test262-parser", &["js"]);
}
