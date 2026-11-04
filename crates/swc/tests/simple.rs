#[cfg(feature = "react-compiler")]
use swc::BoolOrDataConfig;
use swc::{
    config::{Config, GlobalPassOption, JscConfig, OptimizerConfig, Options, TransformConfig},
    Compiler,
};
use swc_common::FileName;
#[cfg(feature = "react-compiler")]
use swc_ecma_parser::{Syntax, TsSyntax};
use testing::Tester;

fn compile(src: &str, options: Options) -> String {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            let fm = cm.new_source_file(FileName::Real("input.js".into()).into(), src.to_string());
            let s = c.process_js_file(fm, &handler, &options);

            match s {
                Ok(v) => {
                    if handler.has_errors() {
                        Err(())
                    } else {
                        Ok(v.code)
                    }
                }
                Err(..) => Err(()),
            }
        })
        .unwrap()
}

fn compile_with_optimizer_globals(src: &str, globals: &str) -> String {
    let globals: GlobalPassOption = serde_json::from_str(globals).expect("invalid globals");

    compile(
        src,
        Options {
            swcrc: false,
            config: Config {
                jsc: JscConfig {
                    transform: Some(TransformConfig {
                        optimizer: Some(OptimizerConfig {
                            globals: Some(globals),
                            ..Default::default()
                        }),
                        ..Default::default()
                    })
                    .into(),
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        },
    )
}

#[test]
fn optimizer_globals_env_map_cache_key_includes_env_values() {
    const SRC: &str = "console.log(process.env.REPRO_VALUE);";

    let first = compile_with_optimizer_globals(SRC, r#"{ "envs": { "REPRO_VALUE": "'first'" } }"#);
    let second =
        compile_with_optimizer_globals(SRC, r#"{ "envs": { "REPRO_VALUE": "'second'" } }"#);

    assert_eq!(first, "console.log('first');\n");
    assert_eq!(second, "console.log('second');\n");
}

#[cfg(feature = "react-compiler")]
#[test]
fn react_compiler_runs_before_jsx_transform() {
    let source = r#"
        import { useState } from "react";

        export function Counter() {
            const [count] = useState(0);
            return <div>{count}</div>;
        }
    "#;

    let compiled = compile(
        source,
        Options {
            config: Config {
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsSyntax {
                        tsx: true,
                        ..Default::default()
                    })),
                    transform: Some(TransformConfig {
                        react_compiler: BoolOrDataConfig::from_bool(true),
                        ..Default::default()
                    })
                    .into(),
                    ..Default::default()
                },
                ..Default::default()
            },
            swcrc: false,
            ..Default::default()
        },
    );

    assert!(compiled.contains("react/compiler-runtime"));
    assert!(!compiled.contains("<div"));
}
