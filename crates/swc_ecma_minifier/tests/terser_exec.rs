extern crate swc_node_base;

use std::{
    fmt::Debug,
    fs::read_to_string,
    io::{BufReader, Read},
    path::{Path, PathBuf},
    process::{Command, Stdio},
    time::{Duration, Instant},
};

use ansi_term::Color;
use anyhow::{bail, Context, Error};
use serde::Deserialize;
use swc_common::{comments::SingleThreadedComments, errors::Handler, sync::Lrc, Mark, SourceMap};
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
    EsConfig, Parser, Syntax,
};
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene, resolver::resolver_with_mark};
use swc_ecma_visit::{FoldWith, VisitMutWith};
use testing::assert_eq;
use wait_timeout::ChildExt;

#[testing::fixture("tests/terser/compress/**/input.js")]
fn terser_exec(input: PathBuf) {
    let dir = input.parent().unwrap();

    let config = dir.join("config.json");
    let config = read_to_string(&config).expect("failed to read config.json");
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    let _ = testing::run_test2(false, |cm, handler| {
        let expected_src = read_to_string(&dir.join("output.terser.js")).map_err(|_| {
            eprintln!("This test does not have `output.terser.js`");
        })?;
        let expected_stdout =
            stdout_of(&expected_src, Duration::from_millis(500)).map_err(|_| {
                eprintln!("This test is not executable test");
            })?;

        let output = run(cm.clone(), &handler, &input, &config);
        let output_module = match output {
            Some(v) => v,
            None => return Err(()),
        };

        let actual = print(cm, &[output_module], false, false);
        let actual_stdout = stdout_of(&actual, Duration::from_secs(5)).unwrap();

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

fn parse_compressor_config(cm: Lrc<SourceMap>, s: &str) -> (bool, CompressOptions) {
    let opts: TestOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");
    let mut c: TerserCompressorOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");

    c.defaults = opts.defaults;
    c.const_to_let = Some(false);
    c.passes = opts.passes;

    (c.module, c.into_config(cm))
}

fn run(cm: Lrc<SourceMap>, handler: &Handler, input: &Path, config: &str) -> Option<Module> {
    let _ = rayon::ThreadPoolBuilder::new()
        .thread_name(|i| format!("rayon-{}", i + 1))
        .build_global();

    let (_module, config) = parse_compressor_config(cm.clone(), config);

    let fm = cm.load_file(input).expect("failed to load input.js");
    let comments = SingleThreadedComments::default();

    eprintln!("---- {} -----\n{}", Color::Green.paint("Input"), fm.src);

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
            err.into_diagnostic(handler).emit();
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
        cm,
        Some(&comments),
        None,
        &MinifyOptions {
            compress: Some(config),
            mangle: None,
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

    output.visit_mut_with(&mut hygiene());

    let output = output.fold_with(&mut fixer(None));

    let end = Instant::now();
    tracing::info!(
        "process({}) took {:?}",
        input.display(),
        end - minification_start
    );

    Some(output)
}

fn stdout_of(code: &str, timeout: Duration) -> Result<String, Error> {
    let mut child = Command::new("node")
        .arg("-e")
        .arg(&code)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    let mut stdout = BufReader::new(child.stdout.take().unwrap());
    let mut output = String::new();
    stdout.read_to_string(&mut output)?;
    child.wait_timeout(timeout)?;
    return Ok(output);
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
