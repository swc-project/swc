use ansi_term::Color;
use anyhow::{bail, Context, Error};
use std::{
    fs::read_to_string,
    path::{Path, PathBuf},
    process::Command,
};
use swc_common::{
    comments::SingleThreadedComments, errors::Handler, input::SourceFileInput, sync::Lrc, FileName,
    Mark, SourceFile, SourceMap,
};
use swc_ecma_ast::*;
use swc_ecma_codegen::{
    text_writer::{omit_trailing_semi, JsWriter, WriteJs},
    Emitter,
};
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, ManglePropertiesOptions, MinifyOptions},
};
use swc_ecma_parser::{lexer::Lexer, Parser};
use swc_ecma_transforms::{
    fixer,
    hygiene::{self, hygiene_with_config},
    resolver_with_mark,
};
use swc_ecma_visit::{FoldWith, VisitMutWith};
use testing::{DebugUsingDisplay, NormalizedOutput};

fn print(cm: Lrc<SourceMap>, m: &Module, minify: bool) -> String {
    let mut buf = vec![];

    {
        let mut wr = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)) as Box<dyn WriteJs>;

        if minify {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config { minify },
            cm: cm.clone(),
            comments: None,
            wr,
        };

        emitter.emit_module(m).unwrap();
    }

    String::from_utf8(buf).unwrap()
}

fn parse(cm: Lrc<SourceMap>, path: &Path) -> Module {
    let fm = cm.load_file(path).unwrap();
    parse_fm(fm)
}

fn parse_fm(fm: Lrc<SourceFile>) -> Module {
    let lexer = Lexer::new(
        Default::default(),
        EsVersion::latest(),
        SourceFileInput::from(&*fm),
        None,
    );

    let mut parser = Parser::new_from(lexer);
    parser.parse_module().unwrap()
}

fn run(
    cm: Lrc<SourceMap>,
    handler: &Handler,
    input: &Path,
    mangle: MangleOptions,
) -> Option<Module> {
    let _ = rayon::ThreadPoolBuilder::new()
        .thread_name(|i| format!("rayon-{}", i + 1))
        .build_global();

    let fm = cm.load_file(&input).expect("failed to load input.js");
    let comments = SingleThreadedComments::default();

    eprintln!("---- {} -----\n{}", Color::Green.paint("Input"), fm.src);

    let top_level_mark = Mark::fresh(Mark::root());

    let lexer = Lexer::new(
        Default::default(),
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

    let output = optimize(
        program,
        cm.clone(),
        Some(&comments),
        None,
        &MinifyOptions {
            compress: None,
            mangle: Some(mangle),
            ..Default::default()
        },
        &ExtraOptions { top_level_mark },
    );

    let output = output
        .fold_with(&mut hygiene_with_config(hygiene::Config {
            ..Default::default()
        }))
        .fold_with(&mut fixer(None));

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

#[testing::fixture("tests/compress/fixture/**/output.js")]
fn compressed(compressed_file: PathBuf) {
    testing::run_test2(false, |cm, _handler| {
        let m = parse(cm.clone(), &compressed_file);

        let top_level_mark = Mark::fresh(Mark::root());

        let m = optimize(
            m,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(MangleOptions {
                    props: Some(ManglePropertiesOptions {
                        reserved: Default::default(),
                        undeclared: false,
                        regex: Default::default(),
                    }),
                    top_level: true,
                    keep_class_names: false,
                    keep_fn_names: false,
                    keep_private_props: false,
                    ie8: false,
                    safari10: false,
                }),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions { top_level_mark },
        );

        let mangled = print(cm.clone(), &m, false);
        let minified = print(cm.clone(), &m, true);

        parse_fm(cm.new_source_file(FileName::Anon, mangled));
        parse_fm(cm.new_source_file(FileName::Anon, minified));

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/mangle/**/input.js")]
fn fixture(input: PathBuf) {
    testing::run_test2(false, |cm, _handler| {
        let mut m = parse(cm.clone(), &input);

        let top_level_mark = Mark::fresh(Mark::root());

        m.visit_mut_with(&mut resolver_with_mark(top_level_mark));

        let m = optimize(
            m,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(MangleOptions {
                    top_level: true,
                    ..Default::default()
                }),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions { top_level_mark },
        );

        let mangled = print(cm.clone(), &m, false);

        NormalizedOutput::from(mangled)
            .compare_to_file(input.parent().unwrap().join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap();
}

/// Tests used to prevent regressions.
#[testing::fixture("tests/exec/**/input.js")]
fn exec(input: PathBuf) {
    {
        let s = input.to_string_lossy().replace("_", "-");
        if s.contains("issue-1709")
            || s.contains("issue-3146-1")
            || s.contains("eval-collapse-vars")
        {
            return;
        }
    }

    testing::run_test2(false, |cm, handler| {
        let input_src = read_to_string(&input).expect("failed to read input.js as a string");

        let output = run(
            cm.clone(),
            &handler,
            &input,
            MangleOptions {
                keep_fn_names: true,
                ..Default::default()
            },
        );

        let output = output.expect("Parsing in base test should not fail");
        let output = print(cm.clone(), &output, false);

        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Optimized code"),
            output
        );

        println!("{}", input.display());

        let expected_output = stdout_of(&input_src).unwrap();
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
