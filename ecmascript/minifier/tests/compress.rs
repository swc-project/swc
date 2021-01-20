use ansi_term::Color;
use once_cell::sync::Lazy;
use std::env;
use std::fmt;
use std::fmt::Debug;
use std::fmt::Display;
use std::fmt::Formatter;
use std::fs::read_to_string;
use std::path::Path;
use std::path::PathBuf;
use std::str::FromStr;
use swc_common::sync::Lrc;
use swc_common::FileName;
use swc_common::SourceMap;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_codegen::Emitter;
use swc_ecma_minifier::optimize;
use swc_ecma_minifier::option::CompressOptions;
use swc_ecma_minifier::option::MinifyOptions;
use swc_ecma_parser::lexer::input::SourceFileInput;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::Parser;
use swc_ecma_transforms::fixer;
use swc_ecma_transforms::hygiene;
use swc_ecma_transforms::resolver;
use swc_ecma_visit::FoldWith;
use testing::assert_eq;
use testing::NormalizedOutput;

fn is_ignored(path: &Path) -> bool {
    let s = path.to_string_lossy();
    static GOLDEN: Lazy<Vec<String>> = Lazy::new(|| {
        let lines = read_to_string("tests/golden.txt").unwrap();
        lines
            .lines()
            .filter(|v| !v.trim().is_empty())
            .map(|v| v.to_string())
            .collect()
    });

    if let Ok(one) = env::var("GOLDEN_ONLY") {
        if one == "1" {
            if GOLDEN.iter().all(|golden| !s.contains(&**golden)) {
                return true;
            }
        }
    }

    false
}

fn parse_config(s: &str) -> CompressOptions {
    let default = CompressOptions {
        args: false,
        arrows: false,
        bools: false,
        bools_as_ints: false,
        collapse_vars: false,
        comparisons: false,
        computed_props: false,
        conditionals: false,
        dead_code: false,
        defaults: false,
        directives: false,
        expr: false,
        drop_console: false,
        evaluate: false,
        hoist_fns: false,
        hoist_props: false,
        hoist_vars: false,
        inline: false,
        negate_iife: false,
        passes: 0,
        reduce_fns: false,
        reduce_vars: false,
        sequences: false,
        side_effects: false,
        top_level: false,
        typeofs: false,
        unsafe_passes: false,
        unused: false,
    };
    let mut default = serde_json::to_value(default)
        .expect("failed to create serde_json::Value from default options");
    let v = serde_json::Value::from_str(s)
        .expect("failed to deserialize config.json into serde_json::Value");
    {
        let actual = default.as_object_mut().unwrap();
        for (k, v) in v
            .as_object()
            .unwrap()
            .into_iter()
            .map(|(k, v)| (k.clone(), v.clone()))
        {
            actual.remove(&k);
            actual.insert(k, v);
        }
    }

    serde_json::from_value(default).expect("failed to deserialize value into a compressor config")
}

/// Tests ported from terser.
#[testing::fixture("terser/compress/**/input.js")]
fn fixture(input: PathBuf) {
    if is_ignored(&input) {
        return;
    }

    let dir = input.parent().unwrap();
    let config = dir.join("config.json");
    let config = read_to_string(&config).expect("failed to read config.json");
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);
    let config: CompressOptions = parse_config(&config);

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).expect("failed to load input.js");

        eprintln!("---- {} -----\n{}", Color::Green.paint("Input"), fm.src);

        let lexer = Lexer::new(
            Default::default(),
            Default::default(),
            SourceFileInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let module = parser
            .parse_module()
            .map_err(|err| {
                err.into_diagnostic(&handler).emit();
            })
            .map(|module| module.fold_with(&mut resolver()))?;

        let output = optimize(
            module,
            None,
            &MinifyOptions {
                compress: Some(config),
                ..Default::default()
            },
        )
        .fold_with(&mut hygiene())
        .fold_with(&mut fixer(None));
        let output = print(cm.clone(), &[output]);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Ouput"), output);

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
            let expected = expected.fold_with(&mut fixer(None));
            print(cm.clone(), &[expected])
        };

        if output == expected {
            return Ok(());
        }

        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Expected"),
            expected
        );

        let res = NormalizedOutput::from(output.clone()).compare_to_file(dir.join("output.js"));

        assert_eq!(DebugUsingDisplay(&expected), DebugUsingDisplay(&output));

        res.unwrap();

        Ok(())
    })
    .unwrap()
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N]) -> String {
    let mut buf = vec![];

    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}

#[derive(PartialEq, Eq)]
struct DebugUsingDisplay<'a>(&'a str);

impl<'a> Debug for DebugUsingDisplay<'a> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Display::fmt(self.0, f)
    }
}
