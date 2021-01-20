use ansi_term::Color;
use once_cell::sync::Lazy;
use serde::Deserialize;
use std::env;
use std::fmt;
use std::fmt::Debug;
use std::fmt::Display;
use std::fmt::Formatter;
use std::fs::read_to_string;
use std::panic::catch_unwind;
use std::path::Path;
use std::path::PathBuf;
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

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct TestOptions {
    #[serde(default)]
    pub arguments: bool,

    #[serde(default)]
    pub arrows: bool,

    #[serde(default)]
    pub booleans: bool,

    #[serde(default)]
    pub booleans_as_integers: bool,

    #[serde(default)]
    pub collapse_vars: bool,

    #[serde(default)]
    pub comparisons: bool,

    #[serde(default)]
    pub computed_props: bool,

    #[serde(default)]
    pub conditionals: bool,

    #[serde(default)]
    pub dead_code: bool,

    #[serde(default)]
    pub defaults: bool,

    #[serde(default)]
    pub directives: bool,

    #[serde(default)]
    pub expression: bool,

    #[serde(default)]
    pub drop_console: bool,

    // drop_debugger : !false_by_default,
    #[serde(default = "ecma_default")]
    pub ecma: usize,

    #[serde(default)]
    pub evaluate: bool,

    // expression    : false,
    // global_defs   : false,
    #[serde(default)]
    pub hoist_funs: bool,

    #[serde(default)]
    pub hoist_props: bool,

    #[serde(default)]
    pub hoist_vars: bool,

    // ie8           : false,
    // if_return     : !false_by_default,
    #[serde(default)]
    pub inline: bool,

    // join_vars     : !false_by_default,
    // keep_classnames: false,
    // keep_fargs    : true,
    // keep_fnames   : false,
    // keep_infinity : false,
    // loops         : !false_by_default,
    // module        : false,
    #[serde(default)]
    pub negate_iife: bool,

    #[serde(default)]
    pub passes: usize,

    // properties    : !false_by_default,
    // pure_getters  : !false_by_default && "strict",
    // pure_funcs    : null,
    #[serde(default)]
    pub reduce_funcs: bool,

    #[serde(default)]
    pub reduce_vars: bool,

    #[serde(default)]
    pub sequences: bool,

    #[serde(default)]
    pub side_effects: bool,

    // switches      : !false_by_default,
    // top_retain    : null,
    #[serde(default)]
    pub toplevel: bool,

    #[serde(default)]
    pub typeofs: bool,

    #[serde(default)]
    #[serde(rename = "unsafe")]
    pub unsafe_passes: bool,
    // unsafe_arrows : false,
    // unsafe_comps  : false,
    // unsafe_Function: false,
    // unsafe_math   : false,
    // unsafe_symbols: false,
    // unsafe_methods: false,
    // unsafe_proto  : false,
    // unsafe_regexp : false,
    // unsafe_undefined: false,
    #[serde(default)]
    pub unused: bool,
}

fn ecma_default() -> usize {
    5
}

fn parse_config(s: &str) -> CompressOptions {
    let c: TestOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");

    CompressOptions {
        args: c.arguments,
        arrows: c.arrows,
        bools: c.booleans,
        bools_as_ints: c.booleans_as_integers,
        collapse_vars: c.collapse_vars,
        comparisons: c.comparisons,
        computed_props: c.computed_props,
        conditionals: c.conditionals,
        dead_code: c.dead_code,
        defaults: c.defaults,
        directives: c.directives,
        expr: c.expression,
        drop_console: c.drop_console,
        ecma: c.ecma,
        evaluate: c.evaluate,
        hoist_fns: c.hoist_funs,
        hoist_props: c.hoist_props,
        hoist_vars: c.hoist_vars,
        inline: c.inline,
        negate_iife: c.negate_iife,
        passes: c.passes,
        reduce_fns: c.reduce_funcs,
        reduce_vars: c.reduce_vars,
        sequences: c.sequences,
        side_effects: c.side_effects,
        top_level: c.toplevel,
        typeofs: c.typeofs,
        unsafe_passes: c.unsafe_passes,
        unused: c.unused,
    }
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

        {
            let output = output.clone();
            let _ = catch_unwind(|| {
                NormalizedOutput::from(output)
                    .compare_to_file(dir.join("output.js"))
                    .unwrap();
            });
        }

        assert_eq!(DebugUsingDisplay(&expected), DebugUsingDisplay(&output));

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
