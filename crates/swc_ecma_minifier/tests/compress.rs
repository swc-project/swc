#![deny(warnings)]

extern crate swc_node_base;

use std::{
    env,
    fmt::{self, Debug},
    fs::read_to_string,
    panic::catch_unwind,
    path::{Path, PathBuf},
    process::Command,
    time::Instant,
};

use ansi_term::Color;
use anyhow::{bail, Context, Error};
use once_cell::sync::Lazy;
use serde::Deserialize;
use swc_common::{
    comments::SingleThreadedComments, errors::Handler, sync::Lrc, util::take::Take, EqIgnoreSpan,
    FileName, Mark, SourceMap, Spanned,
};
use swc_ecma_ast::*;
use swc_ecma_codegen::{
    text_writer::{omit_trailing_semi, JsWriter, WriteJs},
    Emitter,
};
use swc_ecma_minifier::{
    optimize,
    option::{
        terser::TerserCompressorOptions, CompressOptions, ExtraOptions, MangleOptions,
        MinifyOptions,
    },
};
use swc_ecma_parser::{
    lexer::{input::SourceFileInput, Lexer},
    EsConfig, Parser, Syntax,
};
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene, resolver};
use swc_ecma_utils::drop_span;
use swc_ecma_visit::{FoldWith, Visit, VisitMut, VisitMutWith, VisitWith};
use testing::{assert_eq, DebugUsingDisplay, NormalizedOutput};

fn load_txt(filename: &str) -> Vec<String> {
    let lines = read_to_string(filename).unwrap();
    lines
        .lines()
        .filter(|v| !v.trim().is_empty())
        .map(|v| v.to_string())
        .collect()
}

fn is_ignored(path: &Path) -> bool {
    static IGNORED: Lazy<Vec<String>> = Lazy::new(|| {
        load_txt("tests/TODO.txt")
            .into_iter()
            .chain(load_txt("tests/postponed.txt"))
            .collect()
    });

    static GOLDEN: Lazy<Vec<String>> = Lazy::new(|| load_txt("tests/golden.txt"));

    let s = path.to_string_lossy().replace('-', "_").replace('\\', "/");

    if IGNORED.iter().any(|ignored| s.contains(&**ignored)) {
        return true;
    }

    if env::var("SKIP_GOLDEN").unwrap_or_default() == "1"
        && GOLDEN.iter().any(|ignored| s.contains(&**ignored))
    {
        return true;
    }

    if let Ok(one) = env::var("GOLDEN_ONLY") {
        if one == "1" && GOLDEN.iter().all(|golden| !s.contains(&**golden)) {
            return true;
        }
    }

    false
}

#[derive(Debug, Default, Clone, Deserialize)]
struct TopLevelOnly {
    #[serde(default, alias = "toplevel")]
    top_level: bool,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
enum TestMangleOptions {
    Bool(bool),
    Normal(MangleOptions),
}

impl TestMangleOptions {
    fn parse(s: &str) -> Self {
        let top_level = serde_json::from_str::<TopLevelOnly>(s).unwrap_or_default();

        let mut data = serde_json::from_str::<Self>(s).expect("failed to deserialize mangle.json");

        if let TestMangleOptions::Normal(v) = &mut data {
            v.top_level = top_level.top_level;
        }

        data
    }
}

#[derive(Debug, Clone, Deserialize)]
struct TestOptions {
    #[serde(default)]
    defaults: bool,

    #[serde(default)]
    passes: usize,
}

fn parse_compressor_config(cm: Lrc<SourceMap>, s: &str) -> (bool, CompressOptions) {
    let opts: TestOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");
    let mut c: TerserCompressorOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");

    c.defaults = opts.defaults;
    c.const_to_let = Some(false);
    c.pristine_globals = Some(true);
    c.passes = opts.passes;

    (c.module, c.into_config(cm))
}

fn run(
    cm: Lrc<SourceMap>,
    handler: &Handler,
    input: &Path,
    config: &str,
    mangle: Option<TestMangleOptions>,
    skip_hygiene: bool,
) -> Option<Module> {
    let _ = rayon::ThreadPoolBuilder::new()
        .thread_name(|i| format!("rayon-{}", i + 1))
        .build_global();

    let disable_hygiene = mangle.is_some() || skip_hygiene;

    let (_module, config) = parse_compressor_config(cm.clone(), config);

    let fm = cm.load_file(input).expect("failed to load input.js");
    let comments = SingleThreadedComments::default();

    eprintln!("---- {} -----\n{}", Color::Green.paint("Input"), fm.src);

    if env::var("SWC_RUN").unwrap_or_default() == "1" {
        let stdout = stdout_of(&fm.src);
        match stdout {
            Ok(stdout) => {
                eprintln!(
                    "---- {} -----\n{}",
                    Color::Green.paint("Stdout (expected)"),
                    stdout
                );
            }
            Err(err) => {
                eprintln!(
                    "---- {} -----\n{:?}",
                    Color::Green.paint("Error (of original source code)"),
                    err
                );
            }
        }
    }

    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let minification_start = Instant::now();

    let lexer = Lexer::new(
        Syntax::Es(EsConfig {
            jsx: true,
            ..Default::default()
        }),
        Default::default(),
        SourceFileInput::from(&*fm),
        Some(&comments),
    );

    let mut parser = Parser::new_from(lexer);
    let program = parser
        .parse_module()
        .map_err(|err| {
            err.into_diagnostic(handler).emit();
        })
        .map(|module| module.fold_with(&mut resolver(unresolved_mark, top_level_mark, false)));

    // Ignore parser errors.
    //
    // This is typically related to strict mode caused by module context.
    let program = match program {
        Ok(v) => v,
        _ => return None,
    };

    let optimization_start = Instant::now();
    let mut output = optimize(
        program,
        cm,
        Some(&comments),
        None,
        &MinifyOptions {
            compress: Some(config),
            mangle: mangle.and_then(|v| match v {
                TestMangleOptions::Bool(v) => {
                    if v {
                        Some(MangleOptions {
                            top_level: false,
                            ..Default::default()
                        })
                    } else {
                        None
                    }
                }
                TestMangleOptions::Normal(v) => Some(v),
            }),
            ..Default::default()
        },
        &ExtraOptions {
            unresolved_mark,
            top_level_mark,
        },
    );
    let end = Instant::now();
    tracing::info!(
        "optimize({}) took {:?}",
        input.display(),
        end - optimization_start
    );

    if !disable_hygiene {
        output.visit_mut_with(&mut hygiene())
    }

    let output = output.fold_with(&mut fixer(None));

    let end = Instant::now();
    tracing::info!(
        "process({}) took {:?}",
        input.display(),
        end - minification_start
    );

    Some(output)
}

fn stdout_of(code: &str) -> Result<String, Error> {
    let actual_output = Command::new("node")
        .arg("-e")
        .arg(&code)
        .output()
        .context("failed to execute output of minifier")?;

    if !actual_output.status.success() {
        bail!(
            "failed to execute:\n{}\n{}",
            String::from_utf8_lossy(&actual_output.stdout),
            String::from_utf8_lossy(&actual_output.stderr)
        )
    }

    Ok(String::from_utf8_lossy(&actual_output.stdout).to_string())
}

fn find_config(dir: &Path) -> String {
    let mut cur = Some(dir);
    while let Some(dir) = cur {
        let config = dir.join("config.json");
        if config.exists() {
            let config = read_to_string(&config).expect("failed to read config.json");

            return config;
        }

        cur = dir.parent();
    }

    panic!("failed to find config file for {}", dir.display())
}

#[testing::fixture("tests/fixture/**/input.js")]
#[testing::fixture("tests/single-pass/**/input.js")]
fn custom_fixture(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = find_config(dir);
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let mangle = dir.join("mangle.json");
        let mangle = read_to_string(&mangle).ok();
        if let Some(mangle) = &mangle {
            eprintln!(
                "---- {} -----\n{}",
                Color::Green.paint("Mangle config"),
                mangle
            );
        }
        let mangle: Option<TestMangleOptions> =
            mangle.map(|s| serde_json::from_str(&s).expect("failed to deserialize mangle.json"));

        let output = run(cm.clone(), &handler, &input, &config, mangle, false);
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm, &[output_module], false, false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Output"), output);

        println!("{}", input.display());

        NormalizedOutput::from(output)
            .compare_to_file(dir.join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap()
}

#[testing::fixture("tests/projects/files/*.js")]
fn projects(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = dir.join("config.json");
    let config = read_to_string(&config).expect("failed to read config.json");
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let output = run(cm.clone(), &handler, &input, &config, None, false);
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm.clone(), &[output_module], false, false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Output"), output);

        println!("{}", input.display());

        let minified = {
            let output = run(
                cm.clone(),
                &handler,
                &input,
                r#"{ "defaults": true, "toplevel": true, "passes": 3 }"#,
                Some(TestMangleOptions::Normal(MangleOptions {
                    top_level: true,
                    ..Default::default()
                })),
                false,
            );
            let output_module = match output {
                Some(v) => v,
                None => return Ok(()),
            };

            print(cm, &[output_module], true, true)
        };

        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Size"),
            minified.len()
        );

        NormalizedOutput::from(output)
            .compare_to_file(
                dir.parent()
                    .unwrap()
                    .join("output")
                    .join(input.file_name().unwrap()),
            )
            .unwrap();

        Ok(())
    })
    .unwrap()
}

/// Tests ported from terser.
#[testing::fixture("tests/terser/compress/**/input.js")]
fn fixture(input: PathBuf) {
    if is_ignored(&input) {
        return;
    }

    let dir = input.parent().unwrap();
    let config = dir.join("config.json");
    let config = read_to_string(&config).expect("failed to read config.json");
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let mangle = dir.join("mangle.json");
        let mangle = read_to_string(&mangle).ok();
        if let Some(mangle) = &mangle {
            eprintln!(
                "---- {} -----\n{}",
                Color::Green.paint("Mangle config"),
                mangle
            );
        }

        let mangle: Option<TestMangleOptions> = mangle.map(|s| TestMangleOptions::parse(&s));

        let output = run(cm.clone(), &handler, &input, &config, mangle, false);
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm.clone(), &[output_module.clone()], false, false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Output"), output);

        let expected = {
            let expected = read_to_string(&dir.join("output.js")).unwrap();
            let fm = cm.new_source_file(FileName::Anon, expected);
            let lexer = Lexer::new(
                Default::default(),
                Default::default(),
                SourceFileInput::from(&*fm),
                None,
            );
            let mut parser = Parser::new_from(lexer);
            let expected = parser.parse_module().map_err(|err| {
                err.into_diagnostic(&handler).emit();
            })?;
            let mut expected = expected.fold_with(&mut fixer(None));
            expected = drop_span(expected);

            let mut normalized_expected = expected.clone();
            normalized_expected.visit_mut_with(&mut DropParens);

            let mut actual = output_module.clone();
            actual.visit_mut_with(&mut DropParens);

            if actual.eq_ignore_span(&normalized_expected)
                || drop_span(actual.clone()) == normalized_expected
            {
                return Ok(());
            }

            if print(cm.clone(), &[actual], false, false)
                == print(cm.clone(), &[normalized_expected], false, false)
            {
                return Ok(());
            }

            expected
                .body
                .retain(|s| !matches!(s, ModuleItem::Stmt(Stmt::Empty(..))));
            print(cm.clone(), &[expected], false, false)
        };

        if output == expected {
            return Ok(());
        }

        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Expected"),
            expected
        );

        println!("{}", input.display());

        if let Ok(expected_stdout) = read_to_string(dir.join("expected.stdout")) {
            eprintln!(
                "---- {} -----\n{}",
                Color::Green.paint("Expected stdout"),
                expected_stdout
            );

            let actual = stdout_of(&output).expect("failed to execute the optimized code");
            assert_eq!(
                DebugUsingDisplay(&actual),
                DebugUsingDisplay(&expected_stdout)
            );
            if expected.trim().is_empty() {
                return Ok(());
            }
        }

        let output_str = print(cm, &[drop_span(output_module)], false, false);

        if env::var("UPDATE").map(|s| s == "1").unwrap_or(false) {
            let _ = catch_unwind(|| {
                NormalizedOutput::from(output_str.clone())
                    .compare_to_file(dir.join("output.js"))
                    .unwrap();
            });
        }

        assert_eq!(DebugUsingDisplay(&output_str), DebugUsingDisplay(&expected));

        Ok(())
    })
    .unwrap()
}

fn print<N: swc_ecma_codegen::Node>(
    cm: Lrc<SourceMap>,
    nodes: &[N],
    minify: bool,
    skip_semi: bool,
) -> String {
    let mut buf = vec![];

    {
        let mut wr: Box<dyn WriteJs> = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None));
        if minify || skip_semi {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config { minify },
            cm,
            comments: None,
            wr,
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}

struct Shower<'a> {
    cm: Lrc<SourceMap>,
    handler: &'a Handler,
}

impl Shower<'_> {
    fn show<N>(&self, name: &str, node: &N)
    where
        N: Spanned + fmt::Debug + swc_ecma_codegen::Node,
    {
        let span = node.span();

        if span.is_dummy() {
            let src = print(self.cm.clone(), &[node], false, false);
            self.handler
                .struct_span_warn(span, &format!("{}: {}", name, src))
                .emit();
        } else {
            self.handler.struct_span_warn(span, name).emit();
        }
    }

    fn show_name<N>(&self, name: &str, node: &N)
    where
        N: Spanned + fmt::Debug,
    {
        let span = node.span();

        if span.is_dummy() {
            self.handler
                .struct_span_warn(span, &format!("{:?}", node))
                .emit();
        } else {
            self.handler.struct_span_warn(span, name).emit();
        }
    }
}

impl Visit for Shower<'_> {
    fn visit_array_lit(&mut self, n: &ArrayLit) {
        self.show("ArrayLit", n);
        n.visit_children_with(self)
    }

    fn visit_array_pat(&mut self, n: &ArrayPat) {
        self.show("ArrayPat", n);
        n.visit_children_with(self)
    }

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        self.show("ArrowExpr", n);
        n.visit_children_with(self)
    }

    fn visit_assign_expr(&mut self, n: &AssignExpr) {
        self.show("AssignExpr", n);
        n.visit_children_with(self)
    }

    fn visit_assign_pat(&mut self, n: &AssignPat) {
        self.show("AssignPat", n);
        n.visit_children_with(self)
    }

    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp) {
        self.show("AssignPatProp", n);
        n.visit_children_with(self)
    }

    fn visit_assign_prop(&mut self, n: &AssignProp) {
        self.show("AssignProp", n);
        n.visit_children_with(self)
    }

    fn visit_await_expr(&mut self, n: &AwaitExpr) {
        self.show("AwaitExpr", n);
        n.visit_children_with(self)
    }

    fn visit_bin_expr(&mut self, n: &BinExpr) {
        self.show("BinExpr", n);
        n.visit_children_with(self)
    }

    fn visit_block_stmt(&mut self, n: &BlockStmt) {
        self.show("BlockStmt", n);
        n.visit_children_with(self)
    }

    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr) {
        self.show("BlockStmtOrExpr", n);
        n.visit_children_with(self)
    }

    fn visit_bool(&mut self, n: &Bool) {
        self.show("Bool", n);
        n.visit_children_with(self)
    }

    fn visit_break_stmt(&mut self, n: &BreakStmt) {
        self.show("BreakStmt", n);
        n.visit_children_with(self)
    }

    fn visit_call_expr(&mut self, n: &CallExpr) {
        self.show("CallExpr", n);
        n.visit_children_with(self)
    }

    fn visit_catch_clause(&mut self, n: &CatchClause) {
        self.show("CatchClause", n);
        n.visit_children_with(self)
    }

    fn visit_class(&mut self, n: &Class) {
        self.show("Class", n);
        n.visit_children_with(self)
    }

    fn visit_class_decl(&mut self, n: &ClassDecl) {
        self.show("ClassDecl", n);
        n.visit_children_with(self)
    }

    fn visit_class_expr(&mut self, n: &ClassExpr) {
        self.show("ClassExpr", n);
        n.visit_children_with(self)
    }

    fn visit_class_member(&mut self, n: &ClassMember) {
        self.show("ClassMember", n);
        n.visit_children_with(self)
    }

    fn visit_class_method(&mut self, n: &ClassMethod) {
        self.show("ClassMethod", n);
        n.visit_children_with(self)
    }

    fn visit_class_prop(&mut self, n: &ClassProp) {
        self.show("ClassProp", n);
        n.visit_children_with(self)
    }

    fn visit_computed_prop_name(&mut self, n: &ComputedPropName) {
        self.show("ComputedPropName", n);
        n.visit_children_with(self)
    }

    fn visit_cond_expr(&mut self, n: &CondExpr) {
        self.show("CondExpr", n);
        n.visit_children_with(self)
    }

    fn visit_constructor(&mut self, n: &Constructor) {
        self.show("Constructor", n);
        n.visit_children_with(self)
    }

    fn visit_continue_stmt(&mut self, n: &ContinueStmt) {
        self.show("ContinueStmt", n);
        n.visit_children_with(self)
    }

    fn visit_debugger_stmt(&mut self, n: &DebuggerStmt) {
        self.show("DebuggerStmt", n);
        n.visit_children_with(self)
    }

    fn visit_decl(&mut self, n: &Decl) {
        self.show("Decl", n);
        n.visit_children_with(self)
    }

    fn visit_decorator(&mut self, n: &Decorator) {
        self.show("Decorator", n);
        n.visit_children_with(self)
    }

    fn visit_default_decl(&mut self, n: &DefaultDecl) {
        self.show_name("DefaultDecl", n);
        n.visit_children_with(self)
    }

    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt) {
        self.show("DoWhileStmt", n);
        n.visit_children_with(self)
    }

    fn visit_empty_stmt(&mut self, n: &EmptyStmt) {
        self.show("EmptyStmt", n);
        n.visit_children_with(self)
    }

    fn visit_export_all(&mut self, n: &ExportAll) {
        self.show("ExportAll", n);
        n.visit_children_with(self)
    }

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        self.show("ExportDecl", n);
        n.visit_children_with(self)
    }

    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl) {
        self.show("ExportDefaultDecl", n);
        n.visit_children_with(self)
    }

    fn visit_export_default_expr(&mut self, n: &ExportDefaultExpr) {
        self.show("ExportDefaultExpr", n);
        n.visit_children_with(self)
    }

    fn visit_export_default_specifier(&mut self, n: &ExportDefaultSpecifier) {
        self.show_name("ExportDefaultSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        self.show("ExportNamedSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_export_namespace_specifier(&mut self, n: &ExportNamespaceSpecifier) {
        self.show("ExportNamespaceSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_export_specifier(&mut self, n: &ExportSpecifier) {
        self.show("ExportSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_expr(&mut self, n: &Expr) {
        self.show("Expr", n);
        n.visit_children_with(self)
    }

    fn visit_expr_or_spread(&mut self, n: &ExprOrSpread) {
        self.show("ExprOrSpread", n);
        n.visit_children_with(self)
    }

    fn visit_callee(&mut self, n: &Callee) {
        self.show("Callee", n);
        n.visit_children_with(self)
    }

    fn visit_fn_decl(&mut self, n: &FnDecl) {
        self.show("FnDecl", n);
        n.visit_children_with(self)
    }

    fn visit_fn_expr(&mut self, n: &FnExpr) {
        self.show("FnExpr", n);
        n.visit_children_with(self)
    }

    fn visit_for_in_stmt(&mut self, n: &ForInStmt) {
        self.show("ForInStmt", n);
        n.visit_children_with(self)
    }

    fn visit_for_of_stmt(&mut self, n: &ForOfStmt) {
        self.show("ForOfStmt", n);
        n.visit_children_with(self)
    }

    fn visit_for_stmt(&mut self, n: &ForStmt) {
        self.show("ForStmt", n);
        n.visit_children_with(self)
    }

    fn visit_function(&mut self, n: &Function) {
        self.show("Function", n);
        n.visit_children_with(self)
    }

    fn visit_getter_prop(&mut self, n: &GetterProp) {
        self.show("GetterProp", n);
        n.visit_children_with(self)
    }

    fn visit_ident(&mut self, n: &Ident) {
        self.show("Ident", n);
        n.visit_children_with(self)
    }

    fn visit_if_stmt(&mut self, n: &IfStmt) {
        self.show("IfStmt", n);
        n.visit_children_with(self)
    }

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        self.show("ImportDecl", n);
        n.visit_children_with(self)
    }

    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier) {
        self.show_name("ImportDefaultSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier) {
        self.show("ImportNamedSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_import_specifier(&mut self, n: &ImportSpecifier) {
        self.show_name("ImportSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier) {
        self.show_name("ImportStarAsSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_invalid(&mut self, n: &Invalid) {
        self.show("Invalid", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_attr(&mut self, n: &JSXAttr) {
        self.show("JSXAttr", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_attr_name(&mut self, n: &JSXAttrName) {
        self.show("JSXAttrName", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_attr_or_spread(&mut self, n: &JSXAttrOrSpread) {
        self.show("JSXAttrOrSpread", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_attr_value(&mut self, n: &JSXAttrValue) {
        self.show("JSXAttrValue", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_closing_element(&mut self, n: &JSXClosingElement) {
        self.show("JSXClosingElement", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_closing_fragment(&mut self, n: &JSXClosingFragment) {
        self.show("JSXClosingFragment", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_element(&mut self, n: &JSXElement) {
        self.show("JSXElement", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_element_child(&mut self, n: &JSXElementChild) {
        self.show("JSXElementChild", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_element_name(&mut self, n: &JSXElementName) {
        self.show("JSXElementName", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_empty_expr(&mut self, n: &JSXEmptyExpr) {
        self.show("JSXEmptyExpr", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_expr(&mut self, n: &JSXExpr) {
        self.show("JSXExpr", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_expr_container(&mut self, n: &JSXExprContainer) {
        self.show("JSXExprContainer", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_fragment(&mut self, n: &JSXFragment) {
        self.show("JSXFragment", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_member_expr(&mut self, n: &JSXMemberExpr) {
        self.show("JSXMemberExpr", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_namespaced_name(&mut self, n: &JSXNamespacedName) {
        self.show("JSXNamespacedName", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_object(&mut self, n: &JSXObject) {
        self.show("JSXObject", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_opening_element(&mut self, n: &JSXOpeningElement) {
        self.show("JSXOpeningElement", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_opening_fragment(&mut self, n: &JSXOpeningFragment) {
        self.show("JSXOpeningFragment", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_spread_child(&mut self, n: &JSXSpreadChild) {
        self.show("JSXSpreadChild", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_text(&mut self, n: &JSXText) {
        self.show("JSXText", n);
        n.visit_children_with(self)
    }

    fn visit_key_value_pat_prop(&mut self, n: &KeyValuePatProp) {
        self.show("KeyValuePatProp", n);
        n.visit_children_with(self)
    }

    fn visit_key_value_prop(&mut self, n: &KeyValueProp) {
        self.show("KeyValueProp", n);
        n.visit_children_with(self)
    }

    fn visit_labeled_stmt(&mut self, n: &LabeledStmt) {
        self.show("LabeledStmt", n);
        n.visit_children_with(self)
    }

    fn visit_lit(&mut self, n: &Lit) {
        self.show("Lit", n);
        n.visit_children_with(self)
    }

    fn visit_member_expr(&mut self, n: &MemberExpr) {
        self.show("MemberExpr", n);
        n.visit_children_with(self)
    }

    fn visit_super_prop_expr(&mut self, n: &SuperPropExpr) {
        self.show("SuperPropExpr", n);
        n.visit_children_with(self)
    }

    fn visit_meta_prop_expr(&mut self, n: &MetaPropExpr) {
        self.show("MetaPropExpr", n);
        n.visit_children_with(self)
    }

    fn visit_method_prop(&mut self, n: &MethodProp) {
        self.show("MethodProp", n);
        n.visit_children_with(self)
    }

    fn visit_module(&mut self, n: &Module) {
        self.show("Module", n);
        n.visit_children_with(self)
    }

    fn visit_module_decl(&mut self, n: &ModuleDecl) {
        self.show("ModuleDecl", n);
        n.visit_children_with(self)
    }

    fn visit_named_export(&mut self, n: &NamedExport) {
        self.show("NamedExport", n);
        n.visit_children_with(self)
    }

    fn visit_new_expr(&mut self, n: &NewExpr) {
        self.show("NewExpr", n);
        n.visit_children_with(self)
    }

    fn visit_null(&mut self, n: &Null) {
        self.show_name("Null", n);
        n.visit_children_with(self)
    }

    fn visit_number(&mut self, n: &Number) {
        self.show("Number", n);
        n.visit_children_with(self)
    }

    fn visit_object_lit(&mut self, n: &ObjectLit) {
        self.show("ObjectLit", n);
        n.visit_children_with(self)
    }

    fn visit_object_pat(&mut self, n: &ObjectPat) {
        self.show("ObjectPat", n);
        n.visit_children_with(self)
    }

    fn visit_object_pat_prop(&mut self, n: &ObjectPatProp) {
        self.show("ObjectPatProp", n);
        n.visit_children_with(self)
    }

    fn visit_opt_chain_expr(&mut self, n: &OptChainExpr) {
        self.show("OptChainExpr", n);
        n.visit_children_with(self)
    }

    fn visit_param(&mut self, n: &Param) {
        self.show("Param", n);
        n.visit_children_with(self)
    }

    fn visit_param_or_ts_param_prop(&mut self, n: &ParamOrTsParamProp) {
        self.show("ParamOrTsParamProp", n);
        n.visit_children_with(self)
    }

    fn visit_paren_expr(&mut self, n: &ParenExpr) {
        self.show("ParenExpr", n);
        n.visit_children_with(self)
    }

    fn visit_pat(&mut self, n: &Pat) {
        self.show("Pat", n);
        n.visit_children_with(self)
    }

    fn visit_pat_or_expr(&mut self, n: &PatOrExpr) {
        self.show("PatOrExpr", n);
        n.visit_children_with(self)
    }

    fn visit_private_method(&mut self, n: &PrivateMethod) {
        self.show("PrivateMethod", n);
        n.visit_children_with(self)
    }

    fn visit_private_name(&mut self, n: &PrivateName) {
        self.show("PrivateName", n);
        n.visit_children_with(self)
    }

    fn visit_private_prop(&mut self, n: &PrivateProp) {
        self.show("PrivateProp", n);
        n.visit_children_with(self)
    }

    fn visit_program(&mut self, n: &Program) {
        self.show("Program", n);
        n.visit_children_with(self)
    }

    fn visit_prop(&mut self, n: &Prop) {
        self.show("Prop", n);
        n.visit_children_with(self)
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        self.show("PropName", n);
        n.visit_children_with(self)
    }

    fn visit_prop_or_spread(&mut self, n: &PropOrSpread) {
        self.show("PropOrSpread", n);
        n.visit_children_with(self)
    }

    fn visit_regex(&mut self, n: &Regex) {
        self.show_name("Regex", n);
        n.visit_children_with(self)
    }

    fn visit_rest_pat(&mut self, n: &RestPat) {
        self.show("RestPat", n);
        n.visit_children_with(self)
    }

    fn visit_return_stmt(&mut self, n: &ReturnStmt) {
        self.show("ReturnStmt", n);
        n.visit_children_with(self)
    }

    fn visit_script(&mut self, n: &Script) {
        self.show("Script", n);
        n.visit_children_with(self)
    }

    fn visit_seq_expr(&mut self, n: &SeqExpr) {
        self.show("SeqExpr", n);
        n.visit_children_with(self)
    }

    fn visit_setter_prop(&mut self, n: &SetterProp) {
        self.show("SetterProp", n);
        n.visit_children_with(self)
    }

    fn visit_spread_element(&mut self, n: &SpreadElement) {
        self.show("SpreadElement", n);
        n.visit_children_with(self)
    }

    fn visit_str(&mut self, n: &Str) {
        self.show("Str", n);
        n.visit_children_with(self)
    }

    fn visit_super(&mut self, n: &Super) {
        self.show("Super", n);
        n.visit_children_with(self)
    }

    fn visit_switch_case(&mut self, n: &SwitchCase) {
        self.show("SwitchCase", n);
        n.visit_children_with(self)
    }

    fn visit_switch_stmt(&mut self, n: &SwitchStmt) {
        self.show("SwitchStmt", n);
        n.visit_children_with(self)
    }

    fn visit_tagged_tpl(&mut self, n: &TaggedTpl) {
        self.show("TaggedTpl", n);
        n.visit_children_with(self)
    }

    fn visit_this_expr(&mut self, n: &ThisExpr) {
        self.show("ThisExpr", n);
        n.visit_children_with(self)
    }

    fn visit_throw_stmt(&mut self, n: &ThrowStmt) {
        self.show("ThrowStmt", n);
        n.visit_children_with(self)
    }

    fn visit_tpl(&mut self, n: &Tpl) {
        self.show("Tpl", n);
        n.visit_children_with(self)
    }

    fn visit_tpl_element(&mut self, n: &TplElement) {
        self.show("TplElement", n);
        n.visit_children_with(self)
    }

    fn visit_try_stmt(&mut self, n: &TryStmt) {
        self.show("TryStmt", n);
        n.visit_children_with(self)
    }

    fn visit_ts_array_type(&mut self, n: &TsArrayType) {
        self.show("TsArrayType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_as_expr(&mut self, n: &TsAsExpr) {
        self.show("TsAsExpr", n);
        n.visit_children_with(self)
    }

    fn visit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl) {
        self.show("TsCallSignatureDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_conditional_type(&mut self, n: &TsConditionalType) {
        self.show("TsConditionalType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion) {
        self.show("TsConstAssertion", n);
        n.visit_children_with(self)
    }

    fn visit_ts_construct_signature_decl(&mut self, n: &TsConstructSignatureDecl) {
        self.show("TsConstructSignatureDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_constructor_type(&mut self, n: &TsConstructorType) {
        self.show("TsConstructorType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_entity_name(&mut self, n: &TsEntityName) {
        self.show("TsEntityName", n);
        n.visit_children_with(self)
    }

    fn visit_ts_enum_decl(&mut self, n: &TsEnumDecl) {
        self.show("TsEnumDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_enum_member(&mut self, n: &TsEnumMember) {
        self.show("TsEnumMember", n);
        n.visit_children_with(self)
    }

    fn visit_ts_enum_member_id(&mut self, n: &TsEnumMemberId) {
        self.show("TsEnumMemberId", n);
        n.visit_children_with(self)
    }

    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment) {
        self.show("TsExportAssignment", n);
        n.visit_children_with(self)
    }

    fn visit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs) {
        self.show("TsExprWithTypeArgs", n);
        n.visit_children_with(self)
    }

    fn visit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef) {
        self.show("TsExternalModuleRef", n);
        n.visit_children_with(self)
    }

    fn visit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType) {
        self.show("TsFnOrConstructorType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_fn_param(&mut self, n: &TsFnParam) {
        self.show("TsFnParam", n);
        n.visit_children_with(self)
    }

    fn visit_ts_fn_type(&mut self, n: &TsFnType) {
        self.show("TsFnType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) {
        self.show("TsImportEqualsDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_import_type(&mut self, n: &TsImportType) {
        self.show("TsImportType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_index_signature(&mut self, n: &TsIndexSignature) {
        self.show("TsIndexSignature", n);
        n.visit_children_with(self)
    }

    fn visit_ts_indexed_access_type(&mut self, n: &TsIndexedAccessType) {
        self.show("TsIndexedAccessType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_infer_type(&mut self, n: &TsInferType) {
        self.show("TsInferType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_interface_body(&mut self, n: &TsInterfaceBody) {
        self.show("TsInterfaceBody", n);
        n.visit_children_with(self)
    }

    fn visit_ts_interface_decl(&mut self, n: &TsInterfaceDecl) {
        self.show("TsInterfaceDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_intersection_type(&mut self, n: &TsIntersectionType) {
        self.show("TsIntersectionType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_keyword_type(&mut self, n: &TsKeywordType) {
        self.show("TsKeywordType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_lit(&mut self, n: &TsLit) {
        self.show("TsLit", n);
        n.visit_children_with(self)
    }

    fn visit_ts_lit_type(&mut self, n: &TsLitType) {
        self.show("TsLitType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_mapped_type(&mut self, n: &TsMappedType) {
        self.show("TsMappedType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_method_signature(&mut self, n: &TsMethodSignature) {
        self.show("TsMethodSignature", n);
        n.visit_children_with(self)
    }

    fn visit_ts_module_block(&mut self, n: &TsModuleBlock) {
        self.show("TsModuleBlock", n);
        n.visit_children_with(self)
    }

    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl) {
        self.show("TsModuleDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_module_name(&mut self, n: &TsModuleName) {
        self.show("TsModuleName", n);
        n.visit_children_with(self)
    }

    fn visit_ts_module_ref(&mut self, n: &TsModuleRef) {
        self.show("TsModuleRef", n);
        n.visit_children_with(self)
    }

    fn visit_ts_namespace_body(&mut self, n: &TsNamespaceBody) {
        self.show("TsNamespaceBody", n);
        n.visit_children_with(self)
    }

    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl) {
        self.show("TsNamespaceDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_namespace_export_decl(&mut self, n: &TsNamespaceExportDecl) {
        self.show("TsNamespaceExportDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr) {
        self.show("TsNonNullExpr", n);
        n.visit_children_with(self)
    }

    fn visit_ts_optional_type(&mut self, n: &TsOptionalType) {
        self.show("TsOptionalType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_param_prop(&mut self, n: &TsParamProp) {
        self.show("TsParamProp", n);
        n.visit_children_with(self)
    }

    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam) {
        self.show("TsParamPropParam", n);
        n.visit_children_with(self)
    }

    fn visit_ts_parenthesized_type(&mut self, n: &TsParenthesizedType) {
        self.show("TsParenthesizedType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_property_signature(&mut self, n: &TsPropertySignature) {
        self.show("TsPropertySignature", n);
        n.visit_children_with(self)
    }

    fn visit_ts_qualified_name(&mut self, n: &TsQualifiedName) {
        self.show("TsQualifiedName", n);
        n.visit_children_with(self)
    }

    fn visit_ts_rest_type(&mut self, n: &TsRestType) {
        self.show("TsRestType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_this_type(&mut self, n: &TsThisType) {
        self.show("TsThisType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent) {
        self.show("TsThisTypeOrIdent", n);
        n.visit_children_with(self)
    }

    fn visit_ts_tuple_element(&mut self, n: &TsTupleElement) {
        self.show("TsTupleElement", n);
        n.visit_children_with(self)
    }

    fn visit_ts_tuple_type(&mut self, n: &TsTupleType) {
        self.show("TsTupleType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type(&mut self, n: &TsType) {
        self.show("TsType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl) {
        self.show("TsTypeAliasDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn) {
        self.show("TsTypeAnn", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion) {
        self.show("TsTypeAssertion", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_element(&mut self, n: &TsTypeElement) {
        self.show("TsTypeElement", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_lit(&mut self, n: &TsTypeLit) {
        self.show("TsTypeLit", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_operator(&mut self, n: &TsTypeOperator) {
        self.show("TsTypeOperator", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_param(&mut self, n: &TsTypeParam) {
        self.show("TsTypeParam", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl) {
        self.show("TsTypeParamDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_param_instantiation(&mut self, n: &TsTypeParamInstantiation) {
        self.show("TsTypeParamInstantiation", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_predicate(&mut self, n: &TsTypePredicate) {
        self.show("TsTypePredicate", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_query(&mut self, n: &TsTypeQuery) {
        self.show("TsTypeQuery", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_query_expr(&mut self, n: &TsTypeQueryExpr) {
        self.show("TsTypeQueryExpr", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_ref(&mut self, n: &TsTypeRef) {
        self.show("TsTypeRef", n);
        n.visit_children_with(self)
    }

    fn visit_ts_union_or_intersection_type(&mut self, n: &TsUnionOrIntersectionType) {
        self.show("TsUnionOrIntersectionType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_union_type(&mut self, n: &TsUnionType) {
        self.show("TsUnionType", n);
        n.visit_children_with(self)
    }

    fn visit_unary_expr(&mut self, n: &UnaryExpr) {
        self.show("UnaryExpr", n);
        n.visit_children_with(self)
    }

    fn visit_update_expr(&mut self, n: &UpdateExpr) {
        self.show("UpdateExpr", n);
        n.visit_children_with(self)
    }

    fn visit_var_decl(&mut self, n: &VarDecl) {
        self.show("VarDecl", n);
        n.visit_children_with(self)
    }

    fn visit_var_decl_or_expr(&mut self, n: &VarDeclOrExpr) {
        self.show("VarDeclOrExpr", n);
        n.visit_children_with(self)
    }

    fn visit_var_decl_or_pat(&mut self, n: &VarDeclOrPat) {
        self.show("VarDeclOrPat", n);
        n.visit_children_with(self)
    }

    fn visit_var_declarator(&mut self, n: &VarDeclarator) {
        self.show("VarDeclarator", n);
        n.visit_children_with(self)
    }

    fn visit_while_stmt(&mut self, n: &WhileStmt) {
        self.show("WhileStmt", n);
        n.visit_children_with(self)
    }

    fn visit_with_stmt(&mut self, n: &WithStmt) {
        self.show("WithStmt", n);
        n.visit_children_with(self)
    }

    fn visit_yield_expr(&mut self, n: &YieldExpr) {
        self.show("YieldExpr", n);
        n.visit_children_with(self)
    }
}

#[testing::fixture("tests/full/**/input.js")]
fn full(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = find_config(dir);
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let output = run(
            cm.clone(),
            &handler,
            &input,
            &config,
            Some(TestMangleOptions::Normal(MangleOptions {
                top_level: true,
                ..Default::default()
            })),
            false,
        );
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm, &[output_module], true, true);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Output"), output);

        println!("{}", input.display());

        NormalizedOutput::from(output)
            .compare_to_file(dir.join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap()
}

struct DropParens;

impl VisitMut for DropParens {
    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::Paren(p) = e {
            *e = *p.expr.take();
        }
    }
}
