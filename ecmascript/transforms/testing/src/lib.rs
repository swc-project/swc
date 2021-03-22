use ansi_term::Color;
use serde::de::DeserializeOwned;
use std::env;
use std::fs::read_to_string;
use std::mem::replace;
use std::{
    fmt,
    fs::{create_dir_all, remove_dir_all, OpenOptions},
    io::{self, Write},
    path::Path,
    process::Command,
    sync::{Arc, RwLock},
};
use swc_common::DUMMY_SP;
use swc_common::{
    comments::SingleThreadedComments, errors::Handler, sync::Lrc, FileName, SourceMap,
};
use swc_ecma_ast::{Pat, *};
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{error::Error, lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_transforms_base::fixer;
use swc_ecma_transforms_base::helpers::{inject_helpers, HELPERS};
use swc_ecma_transforms_base::hygiene;
use swc_ecma_utils::DropSpan;
use swc_ecma_utils::HANDLER;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::{as_folder, Fold, FoldWith};
use tempfile::tempdir_in;
use testing::assert_eq;
use testing::find_executable;
use testing::NormalizedOutput;

pub struct Tester<'a> {
    pub cm: Lrc<SourceMap>,
    pub handler: &'a Handler,
    pub comments: Lrc<SingleThreadedComments>,
}

impl<'a> Tester<'a> {
    pub fn run<F>(op: F)
    where
        F: FnOnce(&mut Tester<'_>) -> Result<(), ()>,
    {
        let out = ::testing::run_test(false, |cm, handler| {
            swc_ecma_utils::HANDLER.set(handler, || {
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
            Ok(()) => {}
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
        F: FnOnce(&mut Parser<Lexer<StringInput>>) -> Result<T, Error>,
    {
        let fm = self
            .cm
            .new_source_file(FileName::Real(file_name.into()), src.into());

        let mut p = Parser::new(syntax, StringInput::from(&*fm), Some(&self.comments));
        let res = op(&mut p).map_err(|e| e.into_diagnostic(&self.handler).emit());

        for e in p.take_errors() {
            e.into_diagnostic(&self.handler).emit()
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
                .map_err(|e| e.into_diagnostic(&self.handler).emit());

            for e in p.take_errors() {
                e.into_diagnostic(&self.handler).emit()
            }

            res?
        };

        let module = module
            .fold_with(&mut tr)
            .fold_with(&mut as_folder(DropSpan {
                preserve_ctxt: true,
            }))
            .fold_with(&mut as_folder(Normalizer));

        Ok(module)
    }

    pub fn print(&mut self, module: &Module) -> String {
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
                comments: None,
            };

            // println!("Emitting: {:?}", module);
            emitter.emit_module(&module).unwrap();
        }

        let r = wr.0.read().unwrap();
        let s = String::from_utf8_lossy(&*r);
        s.to_string()
    }
}

fn make_tr<F, P>(_: &'static str, op: F, tester: &mut Tester<'_>) -> impl Fold
where
    F: FnOnce(&mut Tester<'_>) -> P,
    P: Fold,
{
    op(tester)
}

pub fn test_transform<F, P>(syntax: Syntax, tr: F, input: &str, expected: &str, ok_if_code_eq: bool)
where
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

        println!("----- Actual -----");

        let tr = make_tr("actual", tr, tester);
        let actual = tester.apply_transform(tr, "input.js", syntax, input)?;

        match ::std::env::var("PRINT_HYGIENE") {
            Ok(ref s) if s == "1" => {
                let hygiene_src = tester.print(&actual.clone().fold_with(&mut HygieneVisualizer));
                println!("----- Hygiene -----\n{}", hygiene_src);
            }
            _ => {}
        }

        let actual = actual
            .fold_with(&mut hygiene::hygiene())
            .fold_with(&mut fixer::fixer(None))
            .fold_with(&mut as_folder(DropSpan {
                preserve_ctxt: false,
            }));

        if actual == expected {
            return Ok(());
        }

        let (actual_src, expected_src) = (tester.print(&actual), tester.print(&expected));

        if actual_src == expected_src {
            if ok_if_code_eq {
                return Ok(());
            }
            // Diff it
            println!(">>>>> Code <<<<<\n{}", actual_src);
            assert_eq!(actual, expected, "different ast was detected");
            return Err(());
        }

        println!(">>>>> Orig <<<<<\n{}", input);
        println!(">>>>> Code <<<<<\n{}", actual_src);
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

#[derive(PartialEq, Eq)]
pub struct DebugUsingDisplay<'a>(pub &'a str);
impl<'a> fmt::Debug for DebugUsingDisplay<'a> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Display::fmt(self.0, f)
    }
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

pub fn exec_tr<F, P>(test_name: &'static str, syntax: Syntax, tr: F, input: &str)
where
    F: FnOnce(&mut Tester<'_>) -> P,
    P: Fold,
{
    Tester::run(|tester| {
        let tr = make_tr(test_name, tr, tester);

        let module = tester.apply_transform(
            tr,
            "input.js",
            syntax,
            &format!(
                "it('should work', function () {{
                    {}
                }})",
                input
            ),
        )?;
        match ::std::env::var("PRINT_HYGIENE") {
            Ok(ref s) if s == "1" => {
                let hygiene_src = tester.print(&module.clone().fold_with(&mut HygieneVisualizer));
                println!("----- Hygiene -----\n{}", hygiene_src);
            }
            _ => {}
        }

        let mut module = module
            .fold_with(&mut hygiene::hygiene())
            .fold_with(&mut fixer::fixer(None));

        let src_without_helpers = tester.print(&module);
        module = module.fold_with(&mut inject_helpers());

        let src = tester.print(&module);
        let root = Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("target")
            .join("testing")
            .join(test_name);

        // Remove outputs from previous tests
        let _ = remove_dir_all(&root);

        create_dir_all(&root).expect("failed to create parent directory for temp directory");

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

        println!(
            "\t>>>>> Orig <<<<<\n{}\n\t>>>>> Code <<<<<\n{}",
            input, src_without_helpers
        );

        let jest_path = find_executable("jest").expect("failed to find `jest` from path");

        let mut base_cmd = if cfg!(target_os = "windows") {
            let mut c = Command::new("cmd");
            c.arg("/C").arg(&jest_path);
            c
        } else {
            Command::new(&jest_path)
        };

        let status = base_cmd
            .args(&["--testMatch", &format!("{}", path.display())])
            .current_dir(root)
            .status()
            .expect("failed to run jest");
        if status.success() {
            return Ok(());
        }
        ::std::mem::forget(tmp_dir);
        panic!("Execution failed")
    })
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

        match node {
            PatOrExpr::Pat(pat) => match &mut **pat {
                Pat::Expr(e) => {
                    let e = replace(e, Box::new(Expr::Invalid(Invalid { span: DUMMY_SP })));
                    *node = PatOrExpr::Expr(e);
                }
                _ => {}
            },
            _ => {}
        }
    }

    fn visit_mut_str(&mut self, s: &mut Str) {
        s.kind = Default::default();
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

pub fn parse_options<T>(dir: &Path) -> T
where
    T: DeserializeOwned,
{
    let mut s = String::from("{}");

    fn check(dir: &Path) -> Option<String> {
        let file = dir.join("options.json");
        match read_to_string(&file) {
            Ok(v) => {
                eprintln!("Using options.json at {}", file.display());
                eprintln!("----- {} -----\n{}", Color::Green.paint("Options"), v);

                return Some(v);
            }
            Err(_) => {}
        }

        dir.parent().and_then(check)
    }

    if let Some(content) = check(dir) {
        s = content;
    }

    serde_json::from_str(&s)
        .unwrap_or_else(|err| panic!("failed to deserialize options.json: {}", err))
}

pub fn test_fixture<P>(syntax: Syntax, tr: &dyn Fn(&mut Tester) -> P, input: &Path, output: &Path)
where
    P: Fold,
{
    let expected = read_to_string(output);
    let _is_really_expected = expected.is_ok();
    let expected = expected.unwrap_or_default();

    let (values, stderr) = Tester::run_captured(|tester| {
        let input_str = read_to_string(input).unwrap();
        println!("----- {} -----\n{}", Color::Green.paint("Input"), input_str);

        let tr = tr(tester);

        let expected = tester.apply_transform(
            as_folder(::swc_ecma_utils::DropSpan {
                preserve_ctxt: true,
            }),
            "output.js",
            syntax,
            &expected,
        )?;

        let expected_src = tester.print(&expected);

        println!(
            "----- {} -----\n{}",
            Color::Green.paint("Expected"),
            expected_src
        );

        println!("----- {} -----", Color::Green.paint("Actual"));

        let actual =
            tester.apply_transform(tr, "input.js", syntax, &read_to_string(&input).unwrap())?;

        match ::std::env::var("PRINT_HYGIENE") {
            Ok(ref s) if s == "1" => {
                let hygiene_src = tester.print(&actual.clone().fold_with(&mut HygieneVisualizer));
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
            .fold_with(&mut crate::fixer::fixer(None))
            .fold_with(&mut as_folder(DropSpan {
                preserve_ctxt: false,
            }));

        let actual_src = tester.print(&actual);

        Ok((actual_src, expected_src))
    });

    let mut results = vec![];

    if !stderr.is_empty() {
        results
            .push(NormalizedOutput::from(stderr).compare_to_file(output.with_extension("stderr")));
    }

    match values {
        Some((actual_src, expected_src)) => {
            println!("{}", actual_src);

            if actual_src == expected_src {
                // Ignore `UPDATE`
                return;
            }

            if let Ok("1") = env::var("UPDATE").as_deref() {
                results.push(NormalizedOutput::from(actual_src.clone()).compare_to_file(output));
            }
            assert_eq!(
                DebugUsingDisplay(&actual_src),
                DebugUsingDisplay(&expected_src)
            );
        }
        _ => {}
    }

    for result in results {
        result.unwrap();
    }
}
