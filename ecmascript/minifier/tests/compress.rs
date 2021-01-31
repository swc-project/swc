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
    pub arrows: Option<bool>,

    #[serde(default)]
    pub booleans: Option<bool>,

    #[serde(default)]
    pub booleans_as_integers: bool,

    #[serde(default)]
    pub collapse_vars: Option<bool>,

    #[serde(default)]
    pub comparisons: Option<bool>,

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
    pub drop_console: bool,

    #[serde(default)]
    pub drop_debugger: Option<bool>,

    #[serde(default = "ecma_default")]
    pub ecma: usize,

    #[serde(default)]
    pub evaluate: Option<bool>,

    #[serde(default)]
    pub expression: bool,

    #[serde(default)]
    pub global_defs: bool,

    #[serde(default)]
    pub hoist_funs: bool,

    #[serde(default)]
    pub hoist_props: Option<bool>,

    #[serde(default)]
    pub hoist_vars: bool,

    #[serde(default)]
    pub ie8: bool,

    #[serde(default)]
    pub if_return: Option<bool>,

    #[serde(default)]
    pub inline: Option<bool>,

    #[serde(default)]
    pub join_vars: Option<bool>,

    #[serde(default)]
    pub keep_classnames: bool,

    #[serde(default)]
    pub keep_fargs: Option<bool>,

    #[serde(default)]
    pub keep_fnames: bool,

    #[serde(default)]
    pub keep_infinity: bool,

    #[serde(default)]
    pub loops: Option<bool>,
    // module        : false,
    #[serde(default)]
    pub negate_iife: Option<bool>,

    #[serde(default)]
    pub passes: usize,

    #[serde(default)]
    pub properties: Option<bool>,

    // pure_getters  : !false_by_default && "strict",
    // pure_funcs    : null,
    #[serde(default)]
    pub reduce_funcs: bool,

    #[serde(default)]
    pub reduce_vars: bool,

    #[serde(default)]
    pub sequences: Option<bool>,

    #[serde(default)]
    pub side_effects: Option<bool>,

    #[serde(default)]
    pub switches: bool,

    #[serde(default)]
    pub top_retain: String,

    #[serde(default)]
    pub toplevel: bool,

    #[serde(default)]
    pub typeofs: Option<bool>,

    #[serde(default)]
    #[serde(rename = "unsafe")]
    pub unsafe_passes: bool,

    #[serde(default)]
    pub unsafe_arrows: bool,

    #[serde(default)]
    pub unsafe_comps: bool,

    #[serde(default)]
    #[serde(rename = "unsafe_Function")]
    pub unsafe_function: bool,

    #[serde(default)]
    pub unsafe_math: bool,

    #[serde(default)]
    pub unsafe_symbols: bool,

    #[serde(default)]
    pub unsafe_methods: bool,

    #[serde(default)]
    pub unsafe_proto: bool,

    #[serde(default)]
    pub unsafe_regexp: bool,

    #[serde(default)]
    pub unsafe_undefined: bool,

    #[serde(default)]
    pub unused: Option<bool>,
}

fn ecma_default() -> usize {
    5
}

fn parse_config(s: &str) -> CompressOptions {
    let c: TestOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");

    CompressOptions {
        arguments: c.arguments,
        arrows: c.arrows.unwrap_or(c.defaults),
        bools: c.booleans.unwrap_or(c.defaults),
        bools_as_ints: c.booleans_as_integers,
        collapse_vars: c.collapse_vars.unwrap_or(c.defaults),
        comparisons: c.comparisons.unwrap_or(c.defaults),
        computed_props: c.computed_props,
        conditionals: c.conditionals,
        dead_code: c.dead_code,
        directives: c.directives,
        drop_console: c.drop_console,
        drop_debugger: c.drop_debugger.unwrap_or(c.defaults),
        ecma: c.ecma,
        evaluate: c.evaluate.unwrap_or(c.defaults),
        expr: c.expression,
        global_defs: c.global_defs,
        hoist_fns: c.hoist_funs,
        hoist_props: c.hoist_props.unwrap_or(c.defaults),
        hoist_vars: c.hoist_vars,
        ie8: c.ie8,
        if_return: c.if_return.unwrap_or(c.defaults),
        inline: c.inline.unwrap_or(c.defaults),
        join_vars: c.join_vars.unwrap_or(c.defaults),
        keep_classnames: c.keep_classnames,
        keep_fargs: c.keep_fargs.unwrap_or(c.defaults),
        keep_fnames: c.keep_fnames,
        keep_infinity: c.keep_infinity,
        loops: c.loops.unwrap_or(c.defaults),
        negate_iife: c.negate_iife.unwrap_or(c.defaults),
        passes: c.passes,
        props: c.properties.unwrap_or(c.defaults),
        reduce_fns: c.reduce_funcs,
        reduce_vars: c.reduce_vars,
        sequences: c.sequences.unwrap_or(c.defaults),
        side_effects: c.side_effects.unwrap_or(c.defaults),
        switches: c.switches,
        top_retain: c
            .top_retain
            .split(",")
            .filter(|s| s.trim() != "")
            .map(|v| v.into())
            .collect(),
        top_level: c.toplevel,
        typeofs: c.typeofs.unwrap_or(c.defaults),
        unsafe_passes: c.unsafe_passes,
        unsafe_arrows: c.unsafe_arrows,
        unsafe_comps: c.unsafe_comps,
        unsafe_function: c.unsafe_function,
        unsafe_math: c.unsafe_math,
        unsafe_symbols: c.unsafe_symbols,
        unsafe_methods: c.unsafe_methods,
        unsafe_proto: c.unsafe_proto,
        unsafe_regexp: c.unsafe_regexp,
        unsafe_undefined: c.unsafe_undefined,
        unused: c.unused.unwrap_or(c.defaults),
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

        assert_eq!(DebugUsingDisplay(&output), DebugUsingDisplay(&expected));

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
