#![deny(clippy::all)]
#![deny(clippy::all)]
#![deny(unused)]
#![allow(clippy::result_unit_err)]

use std::{
    env,
    fs::{self, create_dir_all, read_to_string, OpenOptions},
    io::{self, Write},
    mem::take,
    path::Path,
    process::Command,
    rc::Rc,
    sync::{Arc, RwLock},
};

use ansi_term::Color;
use anyhow::Error;
use serde::de::DeserializeOwned;
use sha1::{Digest, Sha1};
use swc_common::{
    chain,
    comments::SingleThreadedComments,
    errors::{Handler, HANDLER},
    sync::Lrc,
    util::take::Take,
    FileName, SourceMap, DUMMY_SP,
};
use swc_ecma_ast::{Pat, *};
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_testing::{exec_node_js, JsExecOptions};
use swc_ecma_transforms_base::{
    fixer,
    helpers::{inject_helpers, HELPERS},
    hygiene,
    pass::noop,
};
use swc_ecma_utils::{quote_ident, quote_str, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, FoldWith, VisitMut, VisitMutWith};
use tempfile::tempdir_in;
use testing::{assert_eq, find_executable, NormalizedOutput};

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

impl<'a> Tester<'a> {
    pub fn run<F, Ret>(op: F) -> Ret
    where
        F: FnOnce(&mut Tester<'_>) -> Result<Ret, ()>,
    {
        let out = ::testing::run_test(false, |cm, handler| {
            HANDLER.set(handler, || {
                HELPERS.set(&Default::default(), || {
                    op(&mut Tester {
                        cm,
                        handler,
                        comments: Default::default(),
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
        F: FnOnce(&mut Parser<Lexer<StringInput>>) -> Result<T, swc_ecma_parser::error::Error>,
    {
        let fm = self
            .cm
            .new_source_file(FileName::Real(file_name.into()), src.into());

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

    pub fn apply_transform<T: Fold>(
        &mut self,
        mut tr: T,
        name: &str,
        syntax: Syntax,
        src: &str,
    ) -> Result<Module, ()> {
        let fm = self
            .cm
            .new_source_file(FileName::Real(name.into()), src.into());

        let module = {
            let mut p = Parser::new(syntax, StringInput::from(&*fm), Some(&self.comments));
            let res = p
                .parse_module()
                .map_err(|e| e.into_diagnostic(self.handler).emit());

            for e in p.take_errors() {
                e.into_diagnostic(self.handler).emit()
            }

            res?
        };

        let module = module
            .fold_with(&mut tr)
            .fold_with(&mut as_folder(Normalizer));

        Ok(module)
    }

    pub fn print(&mut self, module: &Module, comments: &Rc<SingleThreadedComments>) -> String {
        let mut wr = Buf(Arc::new(RwLock::new(vec![])));
        {
            let mut emitter = Emitter {
                cfg: Default::default(),
                cm: self.cm.clone(),
                wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                    self.cm.clone(),
                    "\n",
                    &mut wr,
                    None,
                )),
                comments: Some(comments),
            };

            // println!("Emitting: {:?}", module);
            emitter.emit_module(module).unwrap();
        }

        let r = wr.0.read().unwrap();
        let s = String::from_utf8_lossy(&*r);
        s.to_string()
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

            let init = Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: quote_ident!("require").as_callee(),
                args: vec![quote_str!("regenerator-runtime").as_arg()],
                type_args: Default::default(),
            }));

            let decl = VarDeclarator {
                span: DUMMY_SP,
                name: s.into(),
                init: Some(init),
                definite: Default::default(),
            };
            *item = ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                span: import.span,
                kind: VarDeclKind::Var,
                declare: false,
                decls: vec![decl],
            })))
        }
    }
}

fn make_tr<F, P>(op: F, tester: &mut Tester<'_>) -> impl Fold
where
    F: FnOnce(&mut Tester<'_>) -> P,
    P: Fold,
{
    chain!(op(tester), as_folder(RegeneratorHandler))
}

#[track_caller]
pub fn test_transform<F, P>(
    syntax: Syntax,
    tr: F,
    input: &str,
    expected: &str,
    _always_ok_if_code_eq: bool,
) where
    F: FnOnce(&mut Tester) -> P,
    P: Fold,
{
    Tester::run(|tester| {
        let expected = tester.apply_transform(
            as_folder(::swc_ecma_utils::DropSpan {
                preserve_ctxt: true,
            }),
            "output.js",
            syntax,
            expected,
        )?;

        let expected_comments = take(&mut tester.comments);

        println!("----- Actual -----");

        let tr = make_tr(tr, tester);
        let actual = tester.apply_transform(tr, "input.js", syntax, input)?;

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
            .fold_with(&mut as_folder(::swc_ecma_utils::DropSpan {
                preserve_ctxt: true,
            }))
            .fold_with(&mut hygiene::hygiene())
            .fold_with(&mut fixer::fixer(Some(&tester.comments)));

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

/// Test transformation.
#[macro_export]
macro_rules! test {
    (ignore, $syntax:expr, $tr:expr, $test_name:ident, $input:expr, $expected:expr) => {
        #[test]
        #[ignore]
        fn $test_name() {
            $crate::test_transform($syntax, $tr, $input, $expected, false)
        }
    };

    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr, $expected:expr) => {
        #[test]
        fn $test_name() {
            $crate::test_transform($syntax, $tr, $input, $expected, false)
        }
    };

    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr, $expected:expr, ok_if_code_eq) => {
        #[test]
        fn $test_name() {
            $crate::test_transform($syntax, $tr, $input, $expected, true)
        }
    };
}

/// Execute `node` for `input` and ensure that it prints same output after
/// transformation.
pub fn compare_stdout<F, P>(syntax: Syntax, tr: F, input: &str)
where
    F: FnOnce(&mut Tester<'_>) -> P,
    P: Fold,
{
    Tester::run(|tester| {
        let tr = make_tr(tr, tester);

        let module = tester.apply_transform(tr, "input.js", syntax, input)?;

        match ::std::env::var("PRINT_HYGIENE") {
            Ok(ref s) if s == "1" => {
                let hygiene_src = tester.print(
                    &module.clone().fold_with(&mut HygieneVisualizer),
                    &tester.comments.clone(),
                );
                println!("----- Hygiene -----\n{}", hygiene_src);
            }
            _ => {}
        }

        let mut module = module
            .fold_with(&mut hygiene::hygiene())
            .fold_with(&mut fixer::fixer(Some(&tester.comments)));

        let src_without_helpers = tester.print(&module, &tester.comments.clone());
        module = module.fold_with(&mut inject_helpers());

        let transformed_src = tester.print(&module, &tester.comments.clone());

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
pub fn exec_tr<F, P>(test_name: &str, syntax: Syntax, tr: F, input: &str)
where
    F: FnOnce(&mut Tester<'_>) -> P,
    P: Fold,
{
    Tester::run(|tester| {
        let tr = make_tr(tr, tester);

        let module = tester.apply_transform(
            tr,
            "input.js",
            syntax,
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
                    &module.clone().fold_with(&mut HygieneVisualizer),
                    &tester.comments.clone(),
                );
                println!("----- Hygiene -----\n{}", hygiene_src);
            }
            _ => {}
        }

        let mut module = module
            .fold_with(&mut hygiene::hygiene())
            .fold_with(&mut fixer::fixer(Some(&tester.comments)));

        let src_without_helpers = tester.print(&module, &tester.comments.clone());
        module = module.fold_with(&mut inject_helpers());

        let src = tester.print(&module, &tester.comments.clone());

        println!(
            "\t>>>>> {} <<<<<\n{}\n\t>>>>> {} <<<<<\n{}",
            Color::Green.paint("Orig"),
            input,
            Color::Green.paint("Code"),
            src_without_helpers
        );

        exec_with_node_test_runner(test_name, &src)
    })
}

fn calc_hash(s: &str) -> String {
    let mut hasher = Sha1::new();
    hasher.update(s.as_bytes());
    let sum = hasher.finalize();

    hex::encode(sum)
}

fn exec_with_node_test_runner(test_name: &str, src: &str) -> Result<(), ()> {
    let root = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("target")
        .join("testing")
        .join(test_name);

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

    let path = tmp_dir.path().join(format!("{}.test.js", test_name));

    let mut tmp = OpenOptions::new()
        .create(true)
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
        .arg(&format!("{}", path.display()))
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
    ::std::mem::forget(tmp_dir);
    panic!("Execution failed")
}

fn stdout_of(code: &str) -> Result<String, Error> {
    exec_node_js(
        code,
        JsExecOptions {
            cache: true,
            module: false,
        },
    )
}

/// Test transformation.
#[macro_export]
macro_rules! test_exec {
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
            if ::std::env::var("EXEC").unwrap_or(String::from("")) == "0" {
                return;
            }

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

#[derive(Debug, Clone)]
struct Buf(Arc<RwLock<Vec<u8>>>);
impl Write for Buf {
    fn write(&mut self, data: &[u8]) -> io::Result<usize> {
        self.0.write().unwrap().write(data)
    }

    fn flush(&mut self) -> io::Result<()> {
        self.0.write().unwrap().flush()
    }
}

struct Normalizer;
impl VisitMut for Normalizer {
    fn visit_mut_pat_or_expr(&mut self, node: &mut PatOrExpr) {
        node.visit_mut_children_with(self);

        if let PatOrExpr::Pat(pat) = node {
            if let Pat::Expr(e) = &mut **pat {
                *node = PatOrExpr::Expr(e.take());
            }
        }
    }
}

/// Converts `foo#1` to `foo__1` so it can be verified by the test.
pub struct HygieneTester;
impl Fold for HygieneTester {
    fn fold_ident(&mut self, ident: Ident) -> Ident {
        Ident {
            sym: format!("{}__{}", ident.sym, ident.span.ctxt.as_u32()).into(),
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
            sym: format!("{}{:?}", ident.sym, ident.span.ctxt()).into(),
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
    let mut s = String::from("{}");

    fn check(dir: &Path) -> Option<String> {
        let file = dir.join("options.json");
        if let Ok(v) = read_to_string(&file) {
            eprintln!("Using options.json at {}", file.display());
            eprintln!("----- {} -----\n{}", Color::Green.paint("Options"), v);

            return Some(v);
        }

        dir.parent().and_then(check)
    }

    if let Some(content) = check(dir) {
        s = content;
    }

    serde_json::from_str(&s)
        .unwrap_or_else(|err| panic!("failed to deserialize options.json: {}\n{}", err, s))
}

pub fn test_fixture<P>(syntax: Syntax, tr: &dyn Fn(&mut Tester) -> P, input: &Path, output: &Path)
where
    P: Fold,
{
    test_fixture_inner(syntax, tr, input, output, false)
}

pub fn test_fixture_allowing_error<P>(
    syntax: Syntax,
    tr: &dyn Fn(&mut Tester) -> P,
    input: &Path,
    output: &Path,
) where
    P: Fold,
{
    test_fixture_inner(syntax, tr, input, output, true)
}

fn test_fixture_inner<P>(
    syntax: Syntax,
    tr: &dyn Fn(&mut Tester) -> P,
    input: &Path,
    output: &Path,
    allow_error: bool,
) where
    P: Fold,
{
    let _logger = testing::init();

    let expected = read_to_string(output);
    let _is_really_expected = expected.is_ok();
    let expected = expected.unwrap_or_default();

    let expected_src = Tester::run(|tester| {
        let expected_module = tester.apply_transform(noop(), "expected.js", syntax, &expected)?;

        let expected_src = tester.print(&expected_module, &tester.comments.clone());

        println!(
            "----- {} -----\n{}",
            Color::Green.paint("Expected"),
            expected_src
        );

        Ok(expected_src)
    });

    let (actual_src, stderr) = Tester::run_captured(|tester| {
        let input_str = read_to_string(input).unwrap();
        println!("----- {} -----\n{}", Color::Green.paint("Input"), input_str);

        let tr = tr(tester);

        println!("----- {} -----", Color::Green.paint("Actual"));

        let actual =
            tester.apply_transform(tr, "input.js", syntax, &read_to_string(&input).unwrap())?;

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
            .fold_with(&mut crate::hygiene::hygiene())
            .fold_with(&mut crate::fixer::fixer(Some(&tester.comments)));

        let actual_src = tester.print(&actual, &tester.comments.clone());

        Ok(actual_src)
    });

    if allow_error {
        stderr
            .compare_to_file(output.with_extension("stderr"))
            .unwrap();
    } else if !stderr.is_empty() {
        panic!("stderr: {}", stderr);
    }

    if let Some(actual_src) = actual_src {
        println!("{}", actual_src);

        if actual_src == expected_src {
            // Ignore `UPDATE`
            return;
        }

        NormalizedOutput::from(actual_src)
            .compare_to_file(output)
            .unwrap();
    }
}
