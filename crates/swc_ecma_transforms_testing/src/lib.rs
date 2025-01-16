#![deny(clippy::all)]
#![deny(clippy::all)]
#![deny(unused)]
#![allow(clippy::result_unit_err)]

use std::{
    env,
    fs::{self, create_dir_all, read_to_string, OpenOptions},
    io::Write,
    mem::{take, transmute},
    panic,
    path::{Path, PathBuf},
    process::Command,
    rc::Rc,
};

use ansi_term::Color;
use anyhow::Error;
use base64::prelude::{Engine, BASE64_STANDARD};
use serde::de::DeserializeOwned;
use sha2::{Digest, Sha256};
use swc_common::{
    comments::{Comments, SingleThreadedComments},
    errors::{Handler, HANDLER},
    source_map::SourceMapGenConfig,
    sync::Lrc,
    FileName, Mark, SourceMap, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_codegen::{to_code_default, Emitter};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_testing::{exec_node_js, JsExecOptions};
use swc_ecma_transforms_base::{
    fixer,
    helpers::{inject_helpers, HELPERS},
    hygiene,
};
use swc_ecma_utils::{quote_ident, quote_str, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, Fold, FoldWith, VisitMut};
use tempfile::tempdir_in;
use testing::{
    assert_eq, find_executable, NormalizedOutput, CARGO_TARGET_DIR, CARGO_WORKSPACE_ROOT,
};

pub mod babel_like;

pub struct Tester<'a> {
    pub cm: Lrc<SourceMap>,
    pub handler: &'a Handler,
    /// This will be changed to [SingleThreadedComments] once `cargo-mono`
    /// supports correct bumping logic, or we need to make a breaking change in
    /// a upstream crate of this crate.
    ///
    /// Although type is `Rc<SingleThreadedComments>`, it's fine to clone
    /// `SingleThreadedComments` without `Rc`.
    pub comments: Rc<SingleThreadedComments>,
}

impl Tester<'_> {
    pub fn run<F, Ret>(op: F) -> Ret
    where
        F: FnOnce(&mut Tester<'_>) -> Result<Ret, ()>,
    {
        let comments = Rc::new(SingleThreadedComments::default());

        let out = ::testing::run_test(false, |cm, handler| {
            HANDLER.set(handler, || {
                HELPERS.set(&Default::default(), || {
                    let cmts = comments.clone();
                    let c = Box::new(unsafe {
                        // Safety: This is unsafe but it's used only for testing.
                        transmute::<&dyn Comments, &'static dyn Comments>(&*cmts)
                    }) as Box<dyn Comments>;
                    swc_common::comments::COMMENTS.set(&c, || {
                        op(&mut Tester {
                            cm,
                            handler,
                            comments,
                        })
                    })
                })
            })
        });

        match out {
            Ok(ret) => ret,
            Err(stderr) => panic!("Stderr:\n{}", stderr),
        }
    }

    pub(crate) fn run_captured<F, T>(op: F) -> (Option<T>, NormalizedOutput)
    where
        F: FnOnce(&mut Tester<'_>) -> Result<T, ()>,
    {
        let mut res = None;
        let output = ::testing::Tester::new().print_errors(|cm, handler| -> Result<(), _> {
            HANDLER.set(&handler, || {
                HELPERS.set(&Default::default(), || {
                    let result = op(&mut Tester {
                        cm,
                        handler: &handler,
                        comments: Default::default(),
                    });

                    res = result.ok();

                    // We need stderr
                    Err(())
                })
            })
        });

        let output = output
            .err()
            .unwrap_or_else(|| NormalizedOutput::from(String::from("")));

        (res, output)
    }

    pub fn with_parser<F, T>(
        &mut self,
        file_name: &str,
        syntax: Syntax,
        src: &str,
        op: F,
    ) -> Result<T, ()>
    where
        F: FnOnce(&mut Parser<Lexer>) -> Result<T, swc_ecma_parser::error::Error>,
    {
        let fm = self
            .cm
            .new_source_file(FileName::Real(file_name.into()).into(), src.into());

        let mut p = Parser::new(syntax, StringInput::from(&*fm), Some(&self.comments));
        let res = op(&mut p).map_err(|e| e.into_diagnostic(self.handler).emit());

        for e in p.take_errors() {
            e.into_diagnostic(self.handler).emit()
        }

        res
    }

    pub fn parse_module(&mut self, file_name: &str, src: &str) -> Result<Module, ()> {
        self.with_parser(file_name, Syntax::default(), src, |p| p.parse_module())
    }

    pub fn parse_stmts(&mut self, file_name: &str, src: &str) -> Result<Vec<Stmt>, ()> {
        let stmts = self.with_parser(file_name, Syntax::default(), src, |p| {
            p.parse_script().map(|script| script.body)
        })?;

        Ok(stmts)
    }

    pub fn parse_stmt(&mut self, file_name: &str, src: &str) -> Result<Stmt, ()> {
        let mut stmts = self.parse_stmts(file_name, src)?;
        assert!(stmts.len() == 1);

        Ok(stmts.pop().unwrap())
    }

    pub fn apply_transform<T: Pass>(
        &mut self,
        tr: T,
        name: &str,
        syntax: Syntax,
        is_module: Option<bool>,
        src: &str,
    ) -> Result<Program, ()> {
        let program =
            self.with_parser(
                name,
                syntax,
                src,
                |parser: &mut Parser<Lexer>| match is_module {
                    Some(true) => parser.parse_module().map(Program::Module),
                    Some(false) => parser.parse_script().map(Program::Script),
                    None => parser.parse_program(),
                },
            )?;

        Ok(program.apply(tr))
    }

    pub fn print(&mut self, program: &Program, comments: &Rc<SingleThreadedComments>) -> String {
        to_code_default(self.cm.clone(), Some(comments), program)
    }
}

struct RegeneratorHandler;

impl VisitMut for RegeneratorHandler {
    noop_visit_mut_type!();

    fn visit_mut_module_item(&mut self, item: &mut ModuleItem) {
        if let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = item {
            if &*import.src.value != "regenerator-runtime" {
                return;
            }

            let s = import.specifiers.iter().find_map(|v| match v {
                ImportSpecifier::Default(rt) => Some(rt.local.clone()),
                _ => None,
            });

            let s = match s {
                Some(v) => v,
                _ => return,
            };

            let init = CallExpr {
                span: DUMMY_SP,
                callee: quote_ident!("require").as_callee(),
                args: vec![quote_str!("regenerator-runtime").as_arg()],
                ..Default::default()
            }
            .into();

            let decl = VarDeclarator {
                span: DUMMY_SP,
                name: s.into(),
                init: Some(init),
                definite: Default::default(),
            };
            *item = VarDecl {
                span: import.span,
                kind: VarDeclKind::Var,
                declare: false,
                decls: vec![decl],
                ..Default::default()
            }
            .into()
        }
    }
}

#[track_caller]
pub fn test_transform<F, P>(
    syntax: Syntax,
    is_module: Option<bool>,
    tr: F,
    input: &str,
    expected: &str,
) where
    F: FnOnce(&mut Tester) -> P,
    P: Pass,
{
    Tester::run(|tester| {
        let expected = tester.apply_transform(
            swc_ecma_utils::DropSpan,
            "output.js",
            syntax,
            is_module,
            expected,
        )?;

        let expected_comments = take(&mut tester.comments);

        println!("----- Actual -----");

        let tr = (tr(tester), visit_mut_pass(RegeneratorHandler));
        let actual = tester.apply_transform(tr, "input.js", syntax, is_module, input)?;

        match ::std::env::var("PRINT_HYGIENE") {
            Ok(ref s) if s == "1" => {
                let hygiene_src = tester.print(
                    &actual.clone().fold_with(&mut HygieneVisualizer),
                    &tester.comments.clone(),
                );
                println!("----- Hygiene -----\n{}", hygiene_src);
            }
            _ => {}
        }

        let actual = actual
            .apply(::swc_ecma_utils::DropSpan)
            .apply(hygiene::hygiene())
            .apply(fixer::fixer(Some(&tester.comments)));

        println!("{:?}", tester.comments);
        println!("{:?}", expected_comments);

        {
            let (actual_leading, actual_trailing) = tester.comments.borrow_all();
            let (expected_leading, expected_trailing) = expected_comments.borrow_all();

            if actual == expected
                && *actual_leading == *expected_leading
                && *actual_trailing == *expected_trailing
            {
                return Ok(());
            }
        }

        let (actual_src, expected_src) = (
            tester.print(&actual, &tester.comments.clone()),
            tester.print(&expected, &expected_comments),
        );

        if actual_src == expected_src {
            return Ok(());
        }

        println!(">>>>> {} <<<<<\n{}", Color::Green.paint("Orig"), input);
        println!(">>>>> {} <<<<<\n{}", Color::Green.paint("Code"), actual_src);

        if actual_src != expected_src {
            panic!(
                r#"assertion failed: `(left == right)`
            {}"#,
                ::testing::diff(&actual_src, &expected_src),
            );
        }

        Err(())
    });
}

/// NOT A PUBLIC API. DO NOT USE.
#[doc(hidden)]
#[track_caller]
pub fn test_inline_input_output<F, P>(
    syntax: Syntax,
    is_module: Option<bool>,
    tr: F,
    input: &str,
    output: &str,
) where
    F: FnOnce(&mut Tester) -> P,
    P: Pass,
{
    let _logger = testing::init();

    let expected = output;

    let expected_src = Tester::run(|tester| {
        let expected_program =
            tester.apply_transform(noop_pass(), "expected.js", syntax, is_module, expected)?;

        let expected_src = tester.print(&expected_program, &Default::default());

        println!(
            "----- {} -----\n{}",
            Color::Green.paint("Expected"),
            expected_src
        );

        Ok(expected_src)
    });

    let actual_src = Tester::run_captured(|tester| {
        println!("----- {} -----\n{}", Color::Green.paint("Input"), input);

        let tr = tr(tester);

        println!("----- {} -----", Color::Green.paint("Actual"));

        let actual = tester.apply_transform(tr, "input.js", syntax, is_module, input)?;

        match ::std::env::var("PRINT_HYGIENE") {
            Ok(ref s) if s == "1" => {
                let hygiene_src = tester.print(
                    &actual.clone().fold_with(&mut HygieneVisualizer),
                    &Default::default(),
                );
                println!(
                    "----- {} -----\n{}",
                    Color::Green.paint("Hygiene"),
                    hygiene_src
                );
            }
            _ => {}
        }

        let actual = actual
            .apply(crate::hygiene::hygiene())
            .apply(crate::fixer::fixer(Some(&tester.comments)));

        let actual_src = tester.print(&actual, &Default::default());

        Ok(actual_src)
    })
    .0
    .unwrap();

    assert_eq!(
        expected_src, actual_src,
        "Exepcted:\n{expected_src}\nActual:\n{actual_src}\n",
    );
}

/// NOT A PUBLIC API. DO NOT USE.
#[doc(hidden)]
#[track_caller]
pub fn test_inlined_transform<F, P>(
    test_name: &str,
    syntax: Syntax,
    module: Option<bool>,
    tr: F,
    input: &str,
) where
    F: FnOnce(&mut Tester) -> P,
    P: Pass,
{
    let loc = panic::Location::caller();

    let manifest_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").expect("CARGO_MANIFEST_DIR"));

    let test_file_path = CARGO_WORKSPACE_ROOT.join(loc.file());

    let snapshot_dir = manifest_dir.join("tests").join("__swc_snapshots__").join(
        test_file_path
            .strip_prefix(&manifest_dir)
            .expect("test_inlined_transform does not support paths outside of the crate root"),
    );

    test_fixture_inner(
        syntax,
        Box::new(move |tester| Box::new(tr(tester))),
        input,
        &snapshot_dir.join(format!("{test_name}.js")),
        FixtureTestConfig {
            module,
            ..Default::default()
        },
    )
}

/// NOT A PUBLIC API. DO NOT USE.
#[doc(hidden)]
#[macro_export]
macro_rules! test_location {
    () => {{
        $crate::TestLocation {}
    }};
}

#[macro_export]
macro_rules! test_inline {
    (ignore, $syntax:expr, $tr:expr, $test_name:ident, $input:expr, $output:expr) => {
        #[test]
        #[ignore]
        fn $test_name() {
            $crate::test_inline_input_output($syntax, None, $tr, $input, $output)
        }
    };

    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr, $output:expr) => {
        #[test]
        fn $test_name() {
            $crate::test_inline_input_output($syntax, None, $tr, $input, $output)
        }
    };
}

test_inline!(
    ignore,
    Syntax::default(),
    |_| noop_pass(),
    test_inline_ignored,
    "class Foo {}",
    "class Foo {}"
);

test_inline!(
    Syntax::default(),
    |_| noop_pass(),
    test_inline_pass,
    "class Foo {}",
    "class Foo {}"
);

#[test]
#[should_panic]
fn test_inline_should_fail() {
    test_inline_input_output(
        Default::default(),
        None,
        |_| noop_pass(),
        "class Foo {}",
        "",
    );
}

#[macro_export]
macro_rules! test {
    (ignore, $syntax:expr, $tr:expr, $test_name:ident, $input:expr) => {
        #[test]
        #[ignore]
        fn $test_name() {
            $crate::test_inlined_transform(stringify!($test_name), $syntax, None, $tr, $input)
        }
    };

    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr) => {
        #[test]
        fn $test_name() {
            $crate::test_inlined_transform(stringify!($test_name), $syntax, None, $tr, $input)
        }
    };

    (module, $syntax:expr, $tr:expr, $test_name:ident, $input:expr) => {
        #[test]
        fn $test_name() {
            $crate::test_inlined_transform(stringify!($test_name), $syntax, Some(true), $tr, $input)
        }
    };

    (script, $syntax:expr, $tr:expr, $test_name:ident, $input:expr) => {
        #[test]
        fn $test_name() {
            $crate::test_inlined_script_transform(
                stringify!($test_name),
                $syntax,
                Some(false),
                $tr,
                $input,
            )
        }
    };

    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr, ok_if_code_eq) => {
        #[test]
        fn $test_name() {
            $crate::test_inlined_transform(stringify!($test_name), $syntax, None, $tr, $input)
        }
    };
}

/// Execute `node` for `input` and ensure that it prints same output after
/// transformation.
pub fn compare_stdout<F, P>(syntax: Syntax, tr: F, input: &str)
where
    F: FnOnce(&mut Tester<'_>) -> P,
    P: Pass,
{
    Tester::run(|tester| {
        let tr = (tr(tester), visit_mut_pass(RegeneratorHandler));

        let program = tester.apply_transform(tr, "input.js", syntax, Some(true), input)?;

        match ::std::env::var("PRINT_HYGIENE") {
            Ok(ref s) if s == "1" => {
                let hygiene_src = tester.print(
                    &program.clone().fold_with(&mut HygieneVisualizer),
                    &tester.comments.clone(),
                );
                println!("----- Hygiene -----\n{}", hygiene_src);
            }
            _ => {}
        }

        let mut program = program
            .apply(hygiene::hygiene())
            .apply(fixer::fixer(Some(&tester.comments)));

        let src_without_helpers = tester.print(&program, &tester.comments.clone());
        program = program.apply(inject_helpers(Mark::fresh(Mark::root())));

        let transformed_src = tester.print(&program, &tester.comments.clone());

        println!(
            "\t>>>>> Orig <<<<<\n{}\n\t>>>>> Code <<<<<\n{}",
            input, src_without_helpers
        );

        let expected = stdout_of(input).unwrap();

        println!("\t>>>>> Expected stdout <<<<<\n{}", expected);

        let actual = stdout_of(&transformed_src).unwrap();

        assert_eq!(expected, actual);

        Ok(())
    })
}

/// Execute `jest` after transpiling `input` using `tr`.
pub fn exec_tr<F, P>(_test_name: &str, syntax: Syntax, tr: F, input: &str)
where
    F: FnOnce(&mut Tester<'_>) -> P,
    P: Pass,
{
    Tester::run(|tester| {
        let tr = (tr(tester), visit_mut_pass(RegeneratorHandler));

        let program = tester.apply_transform(
            tr,
            "input.js",
            syntax,
            Some(true),
            &format!(
                "it('should work', async function () {{
                    {}
                }})",
                input
            ),
        )?;
        match ::std::env::var("PRINT_HYGIENE") {
            Ok(ref s) if s == "1" => {
                let hygiene_src = tester.print(
                    &program.clone().fold_with(&mut HygieneVisualizer),
                    &tester.comments.clone(),
                );
                println!("----- Hygiene -----\n{}", hygiene_src);
            }
            _ => {}
        }

        let mut program = program
            .apply(hygiene::hygiene())
            .apply(fixer::fixer(Some(&tester.comments)));

        let src_without_helpers = tester.print(&program, &tester.comments.clone());
        program = program.apply(inject_helpers(Mark::fresh(Mark::root())));

        let src = tester.print(&program, &tester.comments.clone());

        println!(
            "\t>>>>> {} <<<<<\n{}\n\t>>>>> {} <<<<<\n{}",
            Color::Green.paint("Orig"),
            input,
            Color::Green.paint("Code"),
            src_without_helpers
        );

        exec_with_node_test_runner(&src).map(|_| {})
    })
}

fn calc_hash(s: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(s.as_bytes());
    let sum = hasher.finalize();

    hex::encode(sum)
}

fn exec_with_node_test_runner(src: &str) -> Result<(), ()> {
    let root = CARGO_TARGET_DIR.join("swc-es-exec-testing");

    create_dir_all(&root).expect("failed to create parent directory for temp directory");

    let hash = calc_hash(src);
    let success_cache = root.join(format!("{}.success", hash));

    if env::var("SWC_CACHE_TEST").unwrap_or_default() == "1" {
        println!("Trying cache as `SWC_CACHE_TEST` is `1`");

        if success_cache.exists() {
            println!("Cache: success");
            return Ok(());
        }
    }

    let tmp_dir = tempdir_in(&root).expect("failed to create a temp directory");
    create_dir_all(&tmp_dir).unwrap();

    let path = tmp_dir.path().join(format!("{}.test.js", hash));

    let mut tmp = OpenOptions::new()
        .create(true)
        .truncate(true)
        .write(true)
        .open(&path)
        .expect("failed to create a temp file");
    write!(tmp, "{}", src).expect("failed to write to temp file");
    tmp.flush().unwrap();

    let test_runner_path = find_executable("mocha").expect("failed to find `mocha` from path");

    let mut base_cmd = if cfg!(target_os = "windows") {
        let mut c = Command::new("cmd");
        c.arg("/C").arg(&test_runner_path);
        c
    } else {
        Command::new(&test_runner_path)
    };

    let output = base_cmd
        .arg(format!("{}", path.display()))
        .arg("--color")
        .current_dir(root)
        .output()
        .expect("failed to run mocha");

    println!(">>>>> {} <<<<<", Color::Red.paint("Stdout"));
    println!("{}", String::from_utf8_lossy(&output.stdout));
    println!(">>>>> {} <<<<<", Color::Red.paint("Stderr"));
    println!("{}", String::from_utf8_lossy(&output.stderr));

    if output.status.success() {
        fs::write(&success_cache, "").unwrap();
        return Ok(());
    }
    let dir_name = path.display().to_string();
    ::std::mem::forget(tmp_dir);
    panic!("Execution failed: {dir_name}")
}

fn stdout_of(code: &str) -> Result<String, Error> {
    exec_node_js(
        code,
        JsExecOptions {
            cache: true,
            module: false,
            ..Default::default()
        },
    )
}

/// Test transformation.
#[macro_export]
macro_rules! test_exec {
    (@check) => {
        if ::std::env::var("EXEC").unwrap_or(String::from("")) == "0" {
            return;
        }
    };

    (ignore, $syntax:expr, $tr:expr, $test_name:ident, $input:expr) => {
        #[test]
        #[ignore]
        fn $test_name() {
            $crate::exec_tr(stringify!($test_name), $syntax, $tr, $input)
        }
    };

    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr) => {
        #[test]
        fn $test_name() {
            test_exec!(@check);
            $crate::exec_tr(stringify!($test_name), $syntax, $tr, $input)
        }
    };
}

/// Test transformation by invoking it using `node`. The code must print
/// something to stdout.
#[macro_export]
macro_rules! compare_stdout {
    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr) => {
        #[test]
        fn $test_name() {
            $crate::compare_stdout($syntax, $tr, $input)
        }
    };
}

/// Converts `foo#1` to `foo__1` so it can be verified by the test.
pub struct HygieneTester;
impl Fold for HygieneTester {
    fn fold_ident(&mut self, ident: Ident) -> Ident {
        Ident {
            sym: format!("{}__{}", ident.sym, ident.ctxt.as_u32()).into(),
            ..ident
        }
    }

    fn fold_member_prop(&mut self, p: MemberProp) -> MemberProp {
        match p {
            MemberProp::Computed(..) => p.fold_children_with(self),
            _ => p,
        }
    }

    fn fold_prop_name(&mut self, p: PropName) -> PropName {
        match p {
            PropName::Computed(..) => p.fold_children_with(self),
            _ => p,
        }
    }
}

pub struct HygieneVisualizer;
impl Fold for HygieneVisualizer {
    fn fold_ident(&mut self, ident: Ident) -> Ident {
        Ident {
            sym: format!("{}{:?}", ident.sym, ident.ctxt).into(),
            ..ident
        }
    }
}

/// Just like babel, walk up the directory tree and find a file named
/// `options.json`.
pub fn parse_options<T>(dir: &Path) -> T
where
    T: DeserializeOwned,
{
    type Map = serde_json::Map<String, serde_json::Value>;

    let mut value = Map::default();

    fn check(dir: &Path) -> Option<Map> {
        let file = dir.join("options.json");
        if let Ok(v) = read_to_string(&file) {
            eprintln!("Using options.json at {}", file.display());
            eprintln!("----- {} -----\n{}", Color::Green.paint("Options"), v);

            return Some(serde_json::from_str(&v).unwrap_or_else(|err| {
                panic!("failed to deserialize options.json: {}\n{}", err, v)
            }));
        }

        None
    }

    let mut c = Some(dir);

    while let Some(dir) = c {
        if let Some(new) = check(dir) {
            for (k, v) in new {
                if !value.contains_key(&k) {
                    value.insert(k, v);
                }
            }
        }

        c = dir.parent();
    }

    serde_json::from_value(serde_json::Value::Object(value.clone()))
        .unwrap_or_else(|err| panic!("failed to deserialize options.json: {}\n{:?}", err, value))
}

/// Config for [test_fixture]. See [test_fixture] for documentation.
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct FixtureTestConfig {
    /// If true, source map will be printed to the `.map` file.
    ///
    /// Defaults to false.
    pub sourcemap: bool,

    /// If true, diagnostics written to [HANDLER] will be printed as a fixture,
    /// with `.stderr` extension.
    ///
    /// If false, test will fail if diagnostics are emitted.
    ///
    /// Defaults to false.
    pub allow_error: bool,

    /// Determines what type of [Program] the source code is parsed as.
    ///
    /// - `Some(true)`: parsed as a [Program::Module]
    /// - `Some(false)`: parsed as a [Program::Script]
    /// - `None`: parsed as a [Program] (underlying type is auto-detected)
    pub module: Option<bool>,
}

/// You can do `UPDATE=1 cargo test` to update fixtures.
pub fn test_fixture<P>(
    syntax: Syntax,
    tr: &dyn Fn(&mut Tester) -> P,
    input: &Path,
    output: &Path,
    config: FixtureTestConfig,
) where
    P: Pass,
{
    let input = fs::read_to_string(input).unwrap();

    test_fixture_inner(
        syntax,
        Box::new(|tester| Box::new(tr(tester))),
        &input,
        output,
        config,
    );
}

fn test_fixture_inner<'a>(
    syntax: Syntax,
    tr: Box<dyn 'a + FnOnce(&mut Tester) -> Box<dyn 'a + Pass>>,
    input: &str,
    output: &Path,
    config: FixtureTestConfig,
) {
    let _logger = testing::init();

    let expected = read_to_string(output);
    let _is_really_expected = expected.is_ok();
    let expected = expected.unwrap_or_default();

    let expected_src = Tester::run(|tester| {
        let expected_program =
            tester.apply_transform(noop_pass(), "expected.js", syntax, config.module, &expected)?;

        let expected_src = tester.print(&expected_program, &tester.comments.clone());

        println!(
            "----- {} -----\n{}",
            Color::Green.paint("Expected"),
            expected_src
        );

        Ok(expected_src)
    });

    let mut src_map = if config.sourcemap {
        Some(swc_allocator::maybe::vec::Vec::new())
    } else {
        None
    };

    let mut sourcemap = None;

    let (actual_src, stderr) = Tester::run_captured(|tester| {
        eprintln!("----- {} -----\n{}", Color::Green.paint("Input"), input);

        let tr = tr(tester);

        eprintln!("----- {} -----", Color::Green.paint("Actual"));

        let actual = tester.apply_transform(tr, "input.js", syntax, config.module, input)?;

        eprintln!("----- {} -----", Color::Green.paint("Comments"));
        eprintln!("{:?}", tester.comments);

        match ::std::env::var("PRINT_HYGIENE") {
            Ok(ref s) if s == "1" => {
                let hygiene_src = tester.print(
                    &actual.clone().fold_with(&mut HygieneVisualizer),
                    &tester.comments.clone(),
                );
                println!(
                    "----- {} -----\n{}",
                    Color::Green.paint("Hygiene"),
                    hygiene_src
                );
            }
            _ => {}
        }

        let actual = actual
            .apply(crate::hygiene::hygiene())
            .apply(crate::fixer::fixer(Some(&tester.comments)));

        let actual_src = {
            let module = &actual;
            let comments: &Rc<SingleThreadedComments> = &tester.comments.clone();

            let mut buf = vec![];
            {
                let mut emitter = Emitter {
                    cfg: Default::default(),
                    cm: tester.cm.clone(),
                    wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                        tester.cm.clone(),
                        "\n",
                        &mut buf,
                        src_map.as_mut(),
                    )),
                    comments: Some(comments),
                };

                // println!("Emitting: {:?}", module);
                emitter.emit_program(module).unwrap();
            }

            if let Some(src_map) = &mut src_map {
                sourcemap = Some(tester.cm.build_source_map_with_config(
                    src_map,
                    None,
                    SourceMapConfigImpl,
                ));
            }

            String::from_utf8(buf).expect("codegen generated non-utf8 output")
        };

        Ok(actual_src)
    });

    if config.allow_error {
        stderr
            .compare_to_file(output.with_extension("stderr"))
            .unwrap();
    } else if !stderr.is_empty() {
        panic!("stderr: {}", stderr);
    }

    if let Some(actual_src) = actual_src {
        eprintln!("{}", actual_src);

        if let Some(sourcemap) = &sourcemap {
            eprintln!("----- ----- ----- ----- -----");
            eprintln!("SourceMap: {}", visualizer_url(&actual_src, sourcemap));
        }

        if actual_src != expected_src {
            NormalizedOutput::from(actual_src)
                .compare_to_file(output)
                .unwrap();
        }
    }

    if let Some(sourcemap) = sourcemap {
        let map = {
            let mut buf = Vec::new();
            sourcemap.to_writer(&mut buf).unwrap();
            String::from_utf8(buf).unwrap()
        };
        NormalizedOutput::from(map)
            .compare_to_file(output.with_extension("map"))
            .unwrap();
    }
}

/// Creates a url for https://evanw.github.io/source-map-visualization/
fn visualizer_url(code: &str, map: &sourcemap::SourceMap) -> String {
    let map = {
        let mut buf = Vec::new();
        map.to_writer(&mut buf).unwrap();
        String::from_utf8(buf).unwrap()
    };

    let code_len = format!("{}\0", code.len());
    let map_len = format!("{}\0", map.len());
    let hash = BASE64_STANDARD.encode(format!("{}{}{}{}", code_len, code, map_len, map));

    format!("https://evanw.github.io/source-map-visualization/#{}", hash)
}

struct SourceMapConfigImpl;

impl SourceMapGenConfig for SourceMapConfigImpl {
    fn file_name_to_source(&self, f: &swc_common::FileName) -> String {
        f.to_string()
    }

    fn inline_sources_content(&self, _: &swc_common::FileName) -> bool {
        true
    }
}
