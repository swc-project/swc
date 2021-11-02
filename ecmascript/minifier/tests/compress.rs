extern crate swc_node_base;

use ansi_term::Color;
use anyhow::{bail, Context, Error};
use once_cell::sync::Lazy;
use serde::Deserialize;
use std::{
    env,
    fmt::{self, Debug},
    fs::read_to_string,
    panic::catch_unwind,
    path::{Path, PathBuf},
    process::Command,
    time::Instant,
};
use swc_common::{
    comments::SingleThreadedComments, errors::Handler, sync::Lrc, EqIgnoreSpan, FileName, Mark,
    SourceMap, Spanned,
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
use swc_ecma_transforms::{
    fixer,
    hygiene::{self, hygiene_with_config},
    resolver_with_mark,
};
use swc_ecma_utils::drop_span;
use swc_ecma_visit::{FoldWith, Node, Visit, VisitMutWith, VisitWith};
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
        load_txt("tests/ignored.txt")
            .into_iter()
            .chain(load_txt("tests/postponed.txt"))
            .collect()
    });

    static GOLDEN: Lazy<Vec<String>> = Lazy::new(|| load_txt("tests/golden.txt"));

    let s = path.to_string_lossy().replace("-", "_").replace("\\", "/");

    if IGNORED.iter().any(|ignored| s.contains(&**ignored)) {
        return true;
    }

    if env::var("SKIP_GOLDEN").unwrap_or_default() == "1" {
        if GOLDEN.iter().any(|ignored| s.contains(&**ignored)) {
            return true;
        }
    }

    if let Ok(one) = env::var("GOLDEN_ONLY") {
        if one == "1" {
            if GOLDEN.iter().all(|golden| !s.contains(&**golden)) {
                return true;
            }
        }
    }

    false
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
enum TestMangleOptions {
    Bool(bool),
    Normal(MangleOptions),
}

#[derive(Debug, Clone, Deserialize)]
struct TestOptions {
    #[serde(default)]
    defaults: bool,
}

fn parse_compressor_config(cm: Lrc<SourceMap>, s: &str) -> (bool, CompressOptions) {
    let opts: TestOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");
    let mut c: TerserCompressorOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");

    c.defaults = opts.defaults;

    (c.module, c.into_config(cm))
}

fn run(
    cm: Lrc<SourceMap>,
    handler: &Handler,
    input: &Path,
    config: &str,
    mangle: Option<TestMangleOptions>,
) -> Option<Module> {
    let _ = rayon::ThreadPoolBuilder::new()
        .thread_name(|i| format!("rayon-{}", i + 1))
        .build_global();

    let disable_hygiene = mangle.is_some();

    let (_module, config) = parse_compressor_config(cm.clone(), &config);

    let fm = cm.load_file(&input).expect("failed to load input.js");
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
                    Color::Green.paint("Error (of orignal source code)"),
                    err
                );
            }
        }
    }

    let top_level_mark = Mark::fresh(Mark::root());

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
            err.into_diagnostic(&handler).emit();
        })
        .map(|module| module.fold_with(&mut resolver_with_mark(top_level_mark)));

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
        cm.clone(),
        Some(&comments),
        None,
        &MinifyOptions {
            compress: Some(config),
            mangle: mangle.and_then(|v| match v {
                TestMangleOptions::Bool(v) => {
                    if v {
                        Some(Default::default())
                    } else {
                        None
                    }
                }
                TestMangleOptions::Normal(v) => Some(v),
            }),
            ..Default::default()
        },
        &ExtraOptions { top_level_mark },
    );
    let end = Instant::now();
    tracing::info!(
        "optimize({}) took {:?}",
        input.display(),
        end - optimization_start
    );

    if !disable_hygiene {
        output.visit_mut_with(&mut hygiene_with_config(hygiene::Config {
            ..Default::default()
        }))
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

#[testing::fixture("tests/compress/fixture/**/input.js")]
fn base_fixture(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = find_config(&dir);
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let output = run(cm.clone(), &handler, &input, &config, None);
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm.clone(), &[output_module.clone()], false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Ourput"), output);

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
        let output = run(cm.clone(), &handler, &input, &config, None);
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm.clone(), &[output_module.clone()], false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Ourput"), output);

        println!("{}", input.display());

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

/// Tests used to prevent regressions.
#[testing::fixture("tests/exec/**/input.js")]
fn base_exec(input: PathBuf) {
    let dir = input.parent().unwrap();

    let config = find_config(&dir);
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

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

    testing::run_test2(false, |cm, handler| {
        let input_src = read_to_string(&input).expect("failed to read input.js as a string");

        let expected_output = stdout_of(&input_src).unwrap();

        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Expected"),
            expected_output
        );

        let output = run(cm.clone(), &handler, &input, &config, mangle);
        let output = output.expect("Parsing in base test should not fail");
        let output = print(cm.clone(), &[output], false);

        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Optimized code"),
            output
        );

        println!("{}", input.display());

        let actual_output = stdout_of(&output).expect("failed to execute the optimized code");
        assert_ne!(actual_output, "");

        assert_eq!(
            DebugUsingDisplay(&actual_output),
            DebugUsingDisplay(&*expected_output)
        );

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

        let mangle: Option<TestMangleOptions> =
            mangle.map(|s| serde_json::from_str(&s).expect("failed to deserialize mangle.json"));

        let output = run(cm.clone(), &handler, &input, &config, mangle);
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm.clone(), &[output_module.clone()], false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Ourput"), output);

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

            if output_module.eq_ignore_span(&expected)
                || drop_span(output_module.clone()) == expected
            {
                return Ok(());
            }

            expected.body.retain(|s| match s {
                ModuleItem::Stmt(Stmt::Empty(..)) => false,
                _ => true,
            });
            print(cm.clone(), &[expected], false)
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

        let output_str = print(cm.clone(), &[drop_span(output_module.clone())], false);

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

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N], minify: bool) -> String {
    let mut buf = vec![];

    {
        let mut wr: Box<dyn WriteJs> = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None));
        if minify {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config { minify },
            cm: cm.clone(),
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
            let src = print(self.cm.clone(), &[node], false);
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
    fn visit_array_lit(&mut self, n: &ArrayLit, _parent: &dyn Node) {
        self.show("ArrayLit", n);
        n.visit_children_with(self)
    }
    fn visit_array_pat(&mut self, n: &ArrayPat, _parent: &dyn Node) {
        self.show("ArrayPat", n);
        n.visit_children_with(self)
    }
    fn visit_arrow_expr(&mut self, n: &ArrowExpr, _parent: &dyn Node) {
        self.show("ArrowExpr", n);
        n.visit_children_with(self)
    }
    fn visit_assign_expr(&mut self, n: &AssignExpr, _parent: &dyn Node) {
        self.show("AssignExpr", n);
        n.visit_children_with(self)
    }
    fn visit_assign_pat(&mut self, n: &AssignPat, _parent: &dyn Node) {
        self.show("AssignPat", n);
        n.visit_children_with(self)
    }
    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp, _parent: &dyn Node) {
        self.show("AssignPatProp", n);
        n.visit_children_with(self)
    }
    fn visit_assign_prop(&mut self, n: &AssignProp, _parent: &dyn Node) {
        self.show("AssignProp", n);
        n.visit_children_with(self)
    }
    fn visit_await_expr(&mut self, n: &AwaitExpr, _parent: &dyn Node) {
        self.show("AwaitExpr", n);
        n.visit_children_with(self)
    }
    fn visit_bin_expr(&mut self, n: &BinExpr, _parent: &dyn Node) {
        self.show("BinExpr", n);
        n.visit_children_with(self)
    }
    fn visit_block_stmt(&mut self, n: &BlockStmt, _parent: &dyn Node) {
        self.show("BlockStmt", n);
        n.visit_children_with(self)
    }
    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr, _parent: &dyn Node) {
        self.show("BlockStmtOrExpr", n);
        n.visit_children_with(self)
    }
    fn visit_bool(&mut self, n: &Bool, _parent: &dyn Node) {
        self.show("Bool", n);
        n.visit_children_with(self)
    }
    fn visit_break_stmt(&mut self, n: &BreakStmt, _parent: &dyn Node) {
        self.show("BreakStmt", n);
        n.visit_children_with(self)
    }
    fn visit_call_expr(&mut self, n: &CallExpr, _parent: &dyn Node) {
        self.show("CallExpr", n);
        n.visit_children_with(self)
    }
    fn visit_catch_clause(&mut self, n: &CatchClause, _parent: &dyn Node) {
        self.show("CatchClause", n);
        n.visit_children_with(self)
    }
    fn visit_class(&mut self, n: &Class, _parent: &dyn Node) {
        self.show("Class", n);
        n.visit_children_with(self)
    }
    fn visit_class_decl(&mut self, n: &ClassDecl, _parent: &dyn Node) {
        self.show("ClassDecl", n);
        n.visit_children_with(self)
    }
    fn visit_class_expr(&mut self, n: &ClassExpr, _parent: &dyn Node) {
        self.show("ClassExpr", n);
        n.visit_children_with(self)
    }
    fn visit_class_member(&mut self, n: &ClassMember, _parent: &dyn Node) {
        self.show("ClassMember", n);
        n.visit_children_with(self)
    }
    fn visit_class_method(&mut self, n: &ClassMethod, _parent: &dyn Node) {
        self.show("ClassMethod", n);
        n.visit_children_with(self)
    }
    fn visit_class_prop(&mut self, n: &ClassProp, _parent: &dyn Node) {
        self.show("ClassProp", n);
        n.visit_children_with(self)
    }
    fn visit_computed_prop_name(&mut self, n: &ComputedPropName, _parent: &dyn Node) {
        self.show("ComputedPropName", n);
        n.visit_children_with(self)
    }
    fn visit_cond_expr(&mut self, n: &CondExpr, _parent: &dyn Node) {
        self.show("CondExpr", n);
        n.visit_children_with(self)
    }
    fn visit_constructor(&mut self, n: &Constructor, _parent: &dyn Node) {
        self.show("Constructor", n);
        n.visit_children_with(self)
    }
    fn visit_continue_stmt(&mut self, n: &ContinueStmt, _parent: &dyn Node) {
        self.show("ContinueStmt", n);
        n.visit_children_with(self)
    }
    fn visit_debugger_stmt(&mut self, n: &DebuggerStmt, _parent: &dyn Node) {
        self.show("DebuggerStmt", n);
        n.visit_children_with(self)
    }
    fn visit_decl(&mut self, n: &Decl, _parent: &dyn Node) {
        self.show("Decl", n);
        n.visit_children_with(self)
    }
    fn visit_decorator(&mut self, n: &Decorator, _parent: &dyn Node) {
        self.show("Decorator", n);
        n.visit_children_with(self)
    }
    fn visit_default_decl(&mut self, n: &DefaultDecl, _parent: &dyn Node) {
        self.show_name("DefaultDecl", n);
        n.visit_children_with(self)
    }
    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt, _parent: &dyn Node) {
        self.show("DoWhileStmt", n);
        n.visit_children_with(self)
    }
    fn visit_empty_stmt(&mut self, n: &EmptyStmt, _parent: &dyn Node) {
        self.show("EmptyStmt", n);
        n.visit_children_with(self)
    }
    fn visit_export_all(&mut self, n: &ExportAll, _parent: &dyn Node) {
        self.show("ExportAll", n);
        n.visit_children_with(self)
    }
    fn visit_export_decl(&mut self, n: &ExportDecl, _parent: &dyn Node) {
        self.show("ExportDecl", n);
        n.visit_children_with(self)
    }
    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl, _parent: &dyn Node) {
        self.show("ExportDefaultDecl", n);
        n.visit_children_with(self)
    }
    fn visit_export_default_expr(&mut self, n: &ExportDefaultExpr, _parent: &dyn Node) {
        self.show("ExportDefaultExpr", n);
        n.visit_children_with(self)
    }
    fn visit_export_default_specifier(&mut self, n: &ExportDefaultSpecifier, _parent: &dyn Node) {
        self.show_name("ExportDefaultSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _parent: &dyn Node) {
        self.show("ExportNamedSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_export_namespace_specifier(
        &mut self,
        n: &ExportNamespaceSpecifier,
        _parent: &dyn Node,
    ) {
        self.show("ExportNamespaceSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_export_specifier(&mut self, n: &ExportSpecifier, _parent: &dyn Node) {
        self.show("ExportSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_expr(&mut self, n: &Expr, _parent: &dyn Node) {
        self.show("Expr", n);
        n.visit_children_with(self)
    }
    fn visit_expr_or_spread(&mut self, n: &ExprOrSpread, _parent: &dyn Node) {
        self.show("ExprOrSpread", n);
        n.visit_children_with(self)
    }
    fn visit_expr_or_super(&mut self, n: &ExprOrSuper, _parent: &dyn Node) {
        self.show("ExprOrSuper", n);
        n.visit_children_with(self)
    }
    fn visit_fn_decl(&mut self, n: &FnDecl, _parent: &dyn Node) {
        self.show("FnDecl", n);
        n.visit_children_with(self)
    }
    fn visit_fn_expr(&mut self, n: &FnExpr, _parent: &dyn Node) {
        self.show("FnExpr", n);
        n.visit_children_with(self)
    }
    fn visit_for_in_stmt(&mut self, n: &ForInStmt, _parent: &dyn Node) {
        self.show("ForInStmt", n);
        n.visit_children_with(self)
    }
    fn visit_for_of_stmt(&mut self, n: &ForOfStmt, _parent: &dyn Node) {
        self.show("ForOfStmt", n);
        n.visit_children_with(self)
    }
    fn visit_for_stmt(&mut self, n: &ForStmt, _parent: &dyn Node) {
        self.show("ForStmt", n);
        n.visit_children_with(self)
    }
    fn visit_function(&mut self, n: &Function, _parent: &dyn Node) {
        self.show("Function", n);
        n.visit_children_with(self)
    }
    fn visit_getter_prop(&mut self, n: &GetterProp, _parent: &dyn Node) {
        self.show("GetterProp", n);
        n.visit_children_with(self)
    }
    fn visit_ident(&mut self, n: &Ident, _parent: &dyn Node) {
        self.show("Ident", n);
        n.visit_children_with(self)
    }
    fn visit_if_stmt(&mut self, n: &IfStmt, _parent: &dyn Node) {
        self.show("IfStmt", n);
        n.visit_children_with(self)
    }
    fn visit_import_decl(&mut self, n: &ImportDecl, _parent: &dyn Node) {
        self.show("ImportDecl", n);
        n.visit_children_with(self)
    }
    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier, _parent: &dyn Node) {
        self.show_name("ImportDefaultSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier, _parent: &dyn Node) {
        self.show("ImportNamedSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_import_specifier(&mut self, n: &ImportSpecifier, _parent: &dyn Node) {
        self.show_name("ImportSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier, _parent: &dyn Node) {
        self.show_name("ImportStarAsSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_invalid(&mut self, n: &Invalid, _parent: &dyn Node) {
        self.show("Invalid", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_attr(&mut self, n: &JSXAttr, _parent: &dyn Node) {
        self.show("JSXAttr", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_attr_name(&mut self, n: &JSXAttrName, _parent: &dyn Node) {
        self.show("JSXAttrName", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_attr_or_spread(&mut self, n: &JSXAttrOrSpread, _parent: &dyn Node) {
        self.show("JSXAttrOrSpread", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_attr_value(&mut self, n: &JSXAttrValue, _parent: &dyn Node) {
        self.show("JSXAttrValue", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_closing_element(&mut self, n: &JSXClosingElement, _parent: &dyn Node) {
        self.show("JSXClosingElement", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_closing_fragment(&mut self, n: &JSXClosingFragment, _parent: &dyn Node) {
        self.show("JSXClosingFragment", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_element(&mut self, n: &JSXElement, _parent: &dyn Node) {
        self.show("JSXElement", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_element_child(&mut self, n: &JSXElementChild, _parent: &dyn Node) {
        self.show("JSXElementChild", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_element_name(&mut self, n: &JSXElementName, _parent: &dyn Node) {
        self.show("JSXElementName", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_empty_expr(&mut self, n: &JSXEmptyExpr, _parent: &dyn Node) {
        self.show("JSXEmptyExpr", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_expr(&mut self, n: &JSXExpr, _parent: &dyn Node) {
        self.show("JSXExpr", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_expr_container(&mut self, n: &JSXExprContainer, _parent: &dyn Node) {
        self.show("JSXExprContainer", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_fragment(&mut self, n: &JSXFragment, _parent: &dyn Node) {
        self.show("JSXFragment", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_member_expr(&mut self, n: &JSXMemberExpr, _parent: &dyn Node) {
        self.show("JSXMemberExpr", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_namespaced_name(&mut self, n: &JSXNamespacedName, _parent: &dyn Node) {
        self.show("JSXNamespacedName", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_object(&mut self, n: &JSXObject, _parent: &dyn Node) {
        self.show("JSXObject", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_opening_element(&mut self, n: &JSXOpeningElement, _parent: &dyn Node) {
        self.show("JSXOpeningElement", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_opening_fragment(&mut self, n: &JSXOpeningFragment, _parent: &dyn Node) {
        self.show("JSXOpeningFragment", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_spread_child(&mut self, n: &JSXSpreadChild, _parent: &dyn Node) {
        self.show("JSXSpreadChild", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_text(&mut self, n: &JSXText, _parent: &dyn Node) {
        self.show("JSXText", n);
        n.visit_children_with(self)
    }
    fn visit_key_value_pat_prop(&mut self, n: &KeyValuePatProp, _parent: &dyn Node) {
        self.show("KeyValuePatProp", n);
        n.visit_children_with(self)
    }
    fn visit_key_value_prop(&mut self, n: &KeyValueProp, _parent: &dyn Node) {
        self.show("KeyValueProp", n);
        n.visit_children_with(self)
    }
    fn visit_labeled_stmt(&mut self, n: &LabeledStmt, _parent: &dyn Node) {
        self.show("LabeledStmt", n);
        n.visit_children_with(self)
    }
    fn visit_lit(&mut self, n: &Lit, _parent: &dyn Node) {
        self.show("Lit", n);
        n.visit_children_with(self)
    }
    fn visit_member_expr(&mut self, n: &MemberExpr, _parent: &dyn Node) {
        self.show("MemberExpr", n);
        n.visit_children_with(self)
    }
    fn visit_meta_prop_expr(&mut self, n: &MetaPropExpr, _parent: &dyn Node) {
        self.show("MetaPropExpr", n);
        n.visit_children_with(self)
    }
    fn visit_method_prop(&mut self, n: &MethodProp, _parent: &dyn Node) {
        self.show("MethodProp", n);
        n.visit_children_with(self)
    }
    fn visit_module(&mut self, n: &Module, _parent: &dyn Node) {
        self.show("Module", n);
        n.visit_children_with(self)
    }
    fn visit_module_decl(&mut self, n: &ModuleDecl, _parent: &dyn Node) {
        self.show("ModuleDecl", n);
        n.visit_children_with(self)
    }
    fn visit_named_export(&mut self, n: &NamedExport, _parent: &dyn Node) {
        self.show("NamedExport", n);
        n.visit_children_with(self)
    }
    fn visit_new_expr(&mut self, n: &NewExpr, _parent: &dyn Node) {
        self.show("NewExpr", n);
        n.visit_children_with(self)
    }
    fn visit_null(&mut self, n: &Null, _parent: &dyn Node) {
        self.show_name("Null", n);
        n.visit_children_with(self)
    }
    fn visit_number(&mut self, n: &Number, _parent: &dyn Node) {
        self.show("Number", n);
        n.visit_children_with(self)
    }
    fn visit_object_lit(&mut self, n: &ObjectLit, _parent: &dyn Node) {
        self.show("ObjectLit", n);
        n.visit_children_with(self)
    }
    fn visit_object_pat(&mut self, n: &ObjectPat, _parent: &dyn Node) {
        self.show("ObjectPat", n);
        n.visit_children_with(self)
    }
    fn visit_object_pat_prop(&mut self, n: &ObjectPatProp, _parent: &dyn Node) {
        self.show("ObjectPatProp", n);
        n.visit_children_with(self)
    }
    fn visit_opt_chain_expr(&mut self, n: &OptChainExpr, _parent: &dyn Node) {
        self.show("OptChainExpr", n);
        n.visit_children_with(self)
    }
    fn visit_param(&mut self, n: &Param, _parent: &dyn Node) {
        self.show("Param", n);
        n.visit_children_with(self)
    }
    fn visit_param_or_ts_param_prop(&mut self, n: &ParamOrTsParamProp, _parent: &dyn Node) {
        self.show("ParamOrTsParamProp", n);
        n.visit_children_with(self)
    }
    fn visit_paren_expr(&mut self, n: &ParenExpr, _parent: &dyn Node) {
        self.show("ParenExpr", n);
        n.visit_children_with(self)
    }
    fn visit_pat(&mut self, n: &Pat, _parent: &dyn Node) {
        self.show("Pat", n);
        n.visit_children_with(self)
    }
    fn visit_pat_or_expr(&mut self, n: &PatOrExpr, _parent: &dyn Node) {
        self.show("PatOrExpr", n);
        n.visit_children_with(self)
    }
    fn visit_private_method(&mut self, n: &PrivateMethod, _parent: &dyn Node) {
        self.show("PrivateMethod", n);
        n.visit_children_with(self)
    }
    fn visit_private_name(&mut self, n: &PrivateName, _parent: &dyn Node) {
        self.show("PrivateName", n);
        n.visit_children_with(self)
    }
    fn visit_private_prop(&mut self, n: &PrivateProp, _parent: &dyn Node) {
        self.show("PrivateProp", n);
        n.visit_children_with(self)
    }
    fn visit_program(&mut self, n: &Program, _parent: &dyn Node) {
        self.show("Program", n);
        n.visit_children_with(self)
    }
    fn visit_prop(&mut self, n: &Prop, _parent: &dyn Node) {
        self.show("Prop", n);
        n.visit_children_with(self)
    }
    fn visit_prop_name(&mut self, n: &PropName, _parent: &dyn Node) {
        self.show("PropName", n);
        n.visit_children_with(self)
    }
    fn visit_prop_or_spread(&mut self, n: &PropOrSpread, _parent: &dyn Node) {
        self.show("PropOrSpread", n);
        n.visit_children_with(self)
    }
    fn visit_regex(&mut self, n: &Regex, _parent: &dyn Node) {
        self.show_name("Regex", n);
        n.visit_children_with(self)
    }
    fn visit_rest_pat(&mut self, n: &RestPat, _parent: &dyn Node) {
        self.show("RestPat", n);
        n.visit_children_with(self)
    }
    fn visit_return_stmt(&mut self, n: &ReturnStmt, _parent: &dyn Node) {
        self.show("ReturnStmt", n);
        n.visit_children_with(self)
    }
    fn visit_script(&mut self, n: &Script, _parent: &dyn Node) {
        self.show("Script", n);
        n.visit_children_with(self)
    }
    fn visit_seq_expr(&mut self, n: &SeqExpr, _parent: &dyn Node) {
        self.show("SeqExpr", n);
        n.visit_children_with(self)
    }
    fn visit_setter_prop(&mut self, n: &SetterProp, _parent: &dyn Node) {
        self.show("SetterProp", n);
        n.visit_children_with(self)
    }
    fn visit_spread_element(&mut self, n: &SpreadElement, _parent: &dyn Node) {
        self.show("SpreadElement", n);
        n.visit_children_with(self)
    }
    fn visit_str(&mut self, n: &Str, _parent: &dyn Node) {
        self.show("Str", n);
        n.visit_children_with(self)
    }
    fn visit_super(&mut self, n: &Super, _parent: &dyn Node) {
        self.show("Super", n);
        n.visit_children_with(self)
    }
    fn visit_switch_case(&mut self, n: &SwitchCase, _parent: &dyn Node) {
        self.show("SwitchCase", n);
        n.visit_children_with(self)
    }
    fn visit_switch_stmt(&mut self, n: &SwitchStmt, _parent: &dyn Node) {
        self.show("SwitchStmt", n);
        n.visit_children_with(self)
    }
    fn visit_tagged_tpl(&mut self, n: &TaggedTpl, _parent: &dyn Node) {
        self.show("TaggedTpl", n);
        n.visit_children_with(self)
    }
    fn visit_this_expr(&mut self, n: &ThisExpr, _parent: &dyn Node) {
        self.show("ThisExpr", n);
        n.visit_children_with(self)
    }
    fn visit_throw_stmt(&mut self, n: &ThrowStmt, _parent: &dyn Node) {
        self.show("ThrowStmt", n);
        n.visit_children_with(self)
    }
    fn visit_tpl(&mut self, n: &Tpl, _parent: &dyn Node) {
        self.show("Tpl", n);
        n.visit_children_with(self)
    }
    fn visit_tpl_element(&mut self, n: &TplElement, _parent: &dyn Node) {
        self.show("TplElement", n);
        n.visit_children_with(self)
    }
    fn visit_try_stmt(&mut self, n: &TryStmt, _parent: &dyn Node) {
        self.show("TryStmt", n);
        n.visit_children_with(self)
    }
    fn visit_ts_array_type(&mut self, n: &TsArrayType, _parent: &dyn Node) {
        self.show("TsArrayType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_as_expr(&mut self, n: &TsAsExpr, _parent: &dyn Node) {
        self.show("TsAsExpr", n);
        n.visit_children_with(self)
    }
    fn visit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl, _parent: &dyn Node) {
        self.show("TsCallSignatureDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_conditional_type(&mut self, n: &TsConditionalType, _parent: &dyn Node) {
        self.show("TsConditionalType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion, _parent: &dyn Node) {
        self.show("TsConstAssertion", n);
        n.visit_children_with(self)
    }
    fn visit_ts_construct_signature_decl(
        &mut self,
        n: &TsConstructSignatureDecl,
        _parent: &dyn Node,
    ) {
        self.show("TsConstructSignatureDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_constructor_type(&mut self, n: &TsConstructorType, _parent: &dyn Node) {
        self.show("TsConstructorType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_entity_name(&mut self, n: &TsEntityName, _parent: &dyn Node) {
        self.show("TsEntityName", n);
        n.visit_children_with(self)
    }
    fn visit_ts_enum_decl(&mut self, n: &TsEnumDecl, _parent: &dyn Node) {
        self.show("TsEnumDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_enum_member(&mut self, n: &TsEnumMember, _parent: &dyn Node) {
        self.show("TsEnumMember", n);
        n.visit_children_with(self)
    }
    fn visit_ts_enum_member_id(&mut self, n: &TsEnumMemberId, _parent: &dyn Node) {
        self.show("TsEnumMemberId", n);
        n.visit_children_with(self)
    }
    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment, _parent: &dyn Node) {
        self.show("TsExportAssignment", n);
        n.visit_children_with(self)
    }
    fn visit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs, _parent: &dyn Node) {
        self.show("TsExprWithTypeArgs", n);
        n.visit_children_with(self)
    }
    fn visit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef, _parent: &dyn Node) {
        self.show("TsExternalModuleRef", n);
        n.visit_children_with(self)
    }
    fn visit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType, _parent: &dyn Node) {
        self.show("TsFnOrConstructorType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_fn_param(&mut self, n: &TsFnParam, _parent: &dyn Node) {
        self.show("TsFnParam", n);
        n.visit_children_with(self)
    }
    fn visit_ts_fn_type(&mut self, n: &TsFnType, _parent: &dyn Node) {
        self.show("TsFnType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl, _parent: &dyn Node) {
        self.show("TsImportEqualsDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_import_type(&mut self, n: &TsImportType, _parent: &dyn Node) {
        self.show("TsImportType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_index_signature(&mut self, n: &TsIndexSignature, _parent: &dyn Node) {
        self.show("TsIndexSignature", n);
        n.visit_children_with(self)
    }
    fn visit_ts_indexed_access_type(&mut self, n: &TsIndexedAccessType, _parent: &dyn Node) {
        self.show("TsIndexedAccessType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_infer_type(&mut self, n: &TsInferType, _parent: &dyn Node) {
        self.show("TsInferType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_interface_body(&mut self, n: &TsInterfaceBody, _parent: &dyn Node) {
        self.show("TsInterfaceBody", n);
        n.visit_children_with(self)
    }
    fn visit_ts_interface_decl(&mut self, n: &TsInterfaceDecl, _parent: &dyn Node) {
        self.show("TsInterfaceDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_intersection_type(&mut self, n: &TsIntersectionType, _parent: &dyn Node) {
        self.show("TsIntersectionType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_keyword_type(&mut self, n: &TsKeywordType, _parent: &dyn Node) {
        self.show("TsKeywordType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_lit(&mut self, n: &TsLit, _parent: &dyn Node) {
        self.show("TsLit", n);
        n.visit_children_with(self)
    }
    fn visit_ts_lit_type(&mut self, n: &TsLitType, _parent: &dyn Node) {
        self.show("TsLitType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_mapped_type(&mut self, n: &TsMappedType, _parent: &dyn Node) {
        self.show("TsMappedType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_method_signature(&mut self, n: &TsMethodSignature, _parent: &dyn Node) {
        self.show("TsMethodSignature", n);
        n.visit_children_with(self)
    }
    fn visit_ts_module_block(&mut self, n: &TsModuleBlock, _parent: &dyn Node) {
        self.show("TsModuleBlock", n);
        n.visit_children_with(self)
    }
    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl, _parent: &dyn Node) {
        self.show("TsModuleDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_module_name(&mut self, n: &TsModuleName, _parent: &dyn Node) {
        self.show("TsModuleName", n);
        n.visit_children_with(self)
    }
    fn visit_ts_module_ref(&mut self, n: &TsModuleRef, _parent: &dyn Node) {
        self.show("TsModuleRef", n);
        n.visit_children_with(self)
    }
    fn visit_ts_namespace_body(&mut self, n: &TsNamespaceBody, _parent: &dyn Node) {
        self.show("TsNamespaceBody", n);
        n.visit_children_with(self)
    }
    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl, _parent: &dyn Node) {
        self.show("TsNamespaceDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_namespace_export_decl(&mut self, n: &TsNamespaceExportDecl, _parent: &dyn Node) {
        self.show("TsNamespaceExportDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr, _parent: &dyn Node) {
        self.show("TsNonNullExpr", n);
        n.visit_children_with(self)
    }
    fn visit_ts_optional_type(&mut self, n: &TsOptionalType, _parent: &dyn Node) {
        self.show("TsOptionalType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_param_prop(&mut self, n: &TsParamProp, _parent: &dyn Node) {
        self.show("TsParamProp", n);
        n.visit_children_with(self)
    }
    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam, _parent: &dyn Node) {
        self.show("TsParamPropParam", n);
        n.visit_children_with(self)
    }
    fn visit_ts_parenthesized_type(&mut self, n: &TsParenthesizedType, _parent: &dyn Node) {
        self.show("TsParenthesizedType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_property_signature(&mut self, n: &TsPropertySignature, _parent: &dyn Node) {
        self.show("TsPropertySignature", n);
        n.visit_children_with(self)
    }
    fn visit_ts_qualified_name(&mut self, n: &TsQualifiedName, _parent: &dyn Node) {
        self.show("TsQualifiedName", n);
        n.visit_children_with(self)
    }
    fn visit_ts_rest_type(&mut self, n: &TsRestType, _parent: &dyn Node) {
        self.show("TsRestType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_this_type(&mut self, n: &TsThisType, _parent: &dyn Node) {
        self.show("TsThisType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent, _parent: &dyn Node) {
        self.show("TsThisTypeOrIdent", n);
        n.visit_children_with(self)
    }
    fn visit_ts_tuple_element(&mut self, n: &TsTupleElement, _parent: &dyn Node) {
        self.show("TsTupleElement", n);
        n.visit_children_with(self)
    }
    fn visit_ts_tuple_type(&mut self, n: &TsTupleType, _parent: &dyn Node) {
        self.show("TsTupleType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type(&mut self, n: &TsType, _parent: &dyn Node) {
        self.show("TsType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl, _parent: &dyn Node) {
        self.show("TsTypeAliasDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn, _parent: &dyn Node) {
        self.show("TsTypeAnn", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion, _parent: &dyn Node) {
        self.show("TsTypeAssertion", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_element(&mut self, n: &TsTypeElement, _parent: &dyn Node) {
        self.show("TsTypeElement", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_lit(&mut self, n: &TsTypeLit, _parent: &dyn Node) {
        self.show("TsTypeLit", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_operator(&mut self, n: &TsTypeOperator, _parent: &dyn Node) {
        self.show("TsTypeOperator", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_param(&mut self, n: &TsTypeParam, _parent: &dyn Node) {
        self.show("TsTypeParam", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl, _parent: &dyn Node) {
        self.show("TsTypeParamDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_param_instantiation(
        &mut self,
        n: &TsTypeParamInstantiation,
        _parent: &dyn Node,
    ) {
        self.show("TsTypeParamInstantiation", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_predicate(&mut self, n: &TsTypePredicate, _parent: &dyn Node) {
        self.show("TsTypePredicate", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_query(&mut self, n: &TsTypeQuery, _parent: &dyn Node) {
        self.show("TsTypeQuery", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_query_expr(&mut self, n: &TsTypeQueryExpr, _parent: &dyn Node) {
        self.show("TsTypeQueryExpr", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_ref(&mut self, n: &TsTypeRef, _parent: &dyn Node) {
        self.show("TsTypeRef", n);
        n.visit_children_with(self)
    }
    fn visit_ts_union_or_intersection_type(
        &mut self,
        n: &TsUnionOrIntersectionType,
        _parent: &dyn Node,
    ) {
        self.show("TsUnionOrIntersectionType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_union_type(&mut self, n: &TsUnionType, _parent: &dyn Node) {
        self.show("TsUnionType", n);
        n.visit_children_with(self)
    }
    fn visit_unary_expr(&mut self, n: &UnaryExpr, _parent: &dyn Node) {
        self.show("UnaryExpr", n);
        n.visit_children_with(self)
    }
    fn visit_update_expr(&mut self, n: &UpdateExpr, _parent: &dyn Node) {
        self.show("UpdateExpr", n);
        n.visit_children_with(self)
    }
    fn visit_var_decl(&mut self, n: &VarDecl, _parent: &dyn Node) {
        self.show("VarDecl", n);
        n.visit_children_with(self)
    }
    fn visit_var_decl_or_expr(&mut self, n: &VarDeclOrExpr, _parent: &dyn Node) {
        self.show("VarDeclOrExpr", n);
        n.visit_children_with(self)
    }
    fn visit_var_decl_or_pat(&mut self, n: &VarDeclOrPat, _parent: &dyn Node) {
        self.show("VarDeclOrPat", n);
        n.visit_children_with(self)
    }
    fn visit_var_declarator(&mut self, n: &VarDeclarator, _parent: &dyn Node) {
        self.show("VarDeclarator", n);
        n.visit_children_with(self)
    }
    fn visit_while_stmt(&mut self, n: &WhileStmt, _parent: &dyn Node) {
        self.show("WhileStmt", n);
        n.visit_children_with(self)
    }
    fn visit_with_stmt(&mut self, n: &WithStmt, _parent: &dyn Node) {
        self.show("WithStmt", n);
        n.visit_children_with(self)
    }
    fn visit_yield_expr(&mut self, n: &YieldExpr, _parent: &dyn Node) {
        self.show("YieldExpr", n);
        n.visit_children_with(self)
    }
}

#[testing::fixture("tests/full/**/input.js")]
fn full(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = find_config(&dir);
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
        );
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm.clone(), &[output_module.clone()], true);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Output"), output);

        println!("{}", input.display());

        NormalizedOutput::from(output)
            .compare_to_file(dir.join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap()
}
