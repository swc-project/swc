extern crate swc_malloc;

use std::{
    fmt::Debug,
    fs::read_to_string,
    path::{Path, PathBuf},
    process::Command,
    sync::mpsc,
    thread,
    time::{Duration, Instant},
};

use ansi_term::Color;
use anyhow::{anyhow, bail, Context, Error};
use serde::Deserialize;
use swc_common::{
    comments::SingleThreadedComments,
    errors::{Handler, HANDLER},
    sync::Lrc,
    Mark, SourceMap,
};
use swc_ecma_ast::*;
use swc_ecma_codegen::{
    text_writer::{omit_trailing_semi, JsWriter, WriteJs},
    Emitter,
};
use swc_ecma_minifier::{
    optimize,
    option::{terser::TerserCompressorOptions, CompressOptions, ExtraOptions, MinifyOptions},
};
use swc_ecma_parser::{
    lexer::{input::SourceFileInput, Lexer},
    EsSyntax, Parser, Syntax,
};
use swc_ecma_transforms_base::{
    fixer::{fixer, paren_remover},
    hygiene::hygiene,
    resolver,
};
use swc_ecma_visit::VisitMutWith;
use testing::assert_eq;

#[testing::fixture(
    "tests/terser/compress/**/input.js",
    exclude(
        // We don't care about ie8
        "ie8",
        // tests with infinite loops
        "reduce_vars/toplevel_off_loops_2",
        "reduce_vars/toplevel_on_loops_2",
        "drop_unused/issue_1656",
        "transform/condition_evaluate",
        "reduce_vars/var_assign_3",
        // should error
        "blocks/issue_1672_if_strict",
        "blocks/issue_1672_for_strict",
        // annex B
        "blocks/issue_1672_if",
        "blocks/issue_1672_for",
        // parser error
        "arrow/async_identifiers",
        "async/async_identifiers"
    )
)]
fn terser_exec(input: PathBuf) {
    let dir = input.parent().unwrap();

    let config = dir.join("config.json");
    let config = read_to_string(config).expect("failed to read config.json");
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    let _ = testing::run_test2(false, |cm, handler| {
        let input_src = read_to_string(&input).map_err(|_| {
            eprintln!("WTF?");
        })?;
        // This can change the output
        if input_src.contains("/*#/PURE/*/") {
            return Ok(());
        }

        let input_stdout = stdout_of(&input_src, Duration::from_millis(1000)).map_err(|_| {
            eprintln!("This test is not executable test: \n{}", input_src);
        })?;

        // Formmating
        if input_stdout.contains("function") {
            return Ok(());
        }

        let mut expected_src = None;

        let expected_stdout = read_to_string(dir.join("expected.stdout"))
            .or_else(|_| {
                let src = read_to_string(dir.join("output.terser.js"))
                    .context("This test does not have `output.terser.js`")?;

                expected_src = Some(src.clone());

                stdout_of(&src, Duration::from_millis(500))
                    .context("This test is not executable test")
            })
            .context("This test is not an excutable test")
            .map_err(|err| {
                eprintln!("{}", err);
            })?;

        if input_stdout != expected_stdout {
            eprintln!("This test is not for execution");
            return Err(());
        }

        eprintln!("Optimizing");

        let output = run(cm.clone(), &handler, &input, &config);
        let output_program = match output {
            Some(v) => v,
            None => return Err(()),
        };

        let actual = print(cm, &[output_program], false, false);
        let actual_stdout = stdout_of(&actual, Duration::from_secs(5)).unwrap();

        if let Some(expected_src) = expected_src {
            eprintln!(
                "---- {} -----\n{}",
                Color::Green.paint("Expected"),
                expected_src
            );
        }

        eprintln!("---- {} -----\n{}", Color::Green.paint("Actual"), actual);

        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Expected stdout"),
            expected_stdout
        );
        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Actual stdout"),
            actual_stdout
        );

        println!("{}", input.display());

        assert_eq!(expected_stdout, actual_stdout);

        Ok(())
    });
}

#[derive(Debug, Clone, Deserialize)]
struct TestOptions {
    #[serde(default)]
    defaults: bool,

    #[serde(default)]
    passes: usize,
}

fn parse_compressor_config(cm: Lrc<SourceMap>, s: &str) -> Result<(bool, CompressOptions), Error> {
    let opts: TestOptions =
        serde_json::from_str(s).context("failed to deserialize value into a compressor config")?;
    let mut c: TerserCompressorOptions =
        serde_json::from_str(s).context("failed to deserialize value into a compressor config")?;

    c.defaults = opts.defaults;
    c.const_to_let = Some(false);
    c.passes = opts.passes;

    Ok((c.module, c.into_config(cm)))
}

fn run(cm: Lrc<SourceMap>, handler: &Handler, input: &Path, config: &str) -> Option<Program> {
    HANDLER.set(handler, || {
        let (_module, config) = parse_compressor_config(cm.clone(), config).ok()?;
        if config.ie8 {
            return None;
        }

        let fm = cm.load_file(input).expect("failed to load input.js");
        let comments = SingleThreadedComments::default();

        eprintln!("---- {} -----\n{}", Color::Green.paint("Input"), fm.src);

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let minification_start = Instant::now();

        let lexer = Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            Default::default(),
            SourceFileInput::from(&*fm),
            Some(&comments),
        );

        let mut parser = Parser::new_from(lexer);
        let program = parser
            .parse_program()
            .map_err(|err| {
                err.into_diagnostic(handler).emit();
            })
            .map(|mut program| {
                program.visit_mut_with(&mut paren_remover(Some(&comments)));
                program.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

                program
            });

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
                mangle: None,
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        );
        let end = Instant::now();
        tracing::info!(
            "optimize({}) took {:?}",
            input.display(),
            end - optimization_start
        );

        output.visit_mut_with(&mut hygiene());

        let output = output.apply(&mut fixer(None));

        let end = Instant::now();
        tracing::info!(
            "process({}) took {:?}",
            input.display(),
            end - minification_start
        );

        Some(output)
    })
}

fn stdout_of(code: &str, timeout: Duration) -> Result<String, Error> {
    eprintln!("Executing node with timeout: {:?}", timeout);

    let code = code.to_string();
    let (sender, receiver) = mpsc::channel();
    let timer_sender = sender.clone();

    let _t = thread::spawn(move || {
        let res = (|| {
            let actual_output = Command::new("node")
                .arg("-e")
                .arg(format!(
                    "
                    {}
                    {}",
                    include_str!("./terser_exec_base.js"),
                    code
                ))
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
        })();

        let _ = sender.send(res);
    });

    let _timer = thread::spawn(move || {
        thread::sleep(timeout);
        let _ = timer_sender.send(Err(anyhow!("node timed out")));
    });

    receiver.recv().unwrap()
}

fn print<N: swc_ecma_codegen::Node>(
    cm: Lrc<SourceMap>,
    nodes: &[N],
    minify: bool,
    skip_semi: bool,
) -> String {
    let mut buf = Vec::new();

    {
        let mut wr: Box<dyn WriteJs> = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None));
        if minify || skip_semi {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config::default().with_minify(minify),
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
