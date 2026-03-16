#![cfg(feature = "flow")]

use std::{fs::File, io::Read, path::PathBuf};

use swc::{
    config::{Config, JscConfig, Options},
    Compiler,
};
use swc_common::FileName;
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{parse_file_as_program, EsSyntax, FlowSyntax, Syntax};
use testing::Tester;

#[testing::fixture("../swc_ecma_parser/tests/flow/**/*.js")]
fn flow_strip_correctness(input: PathBuf) {
    let is_jsx = input.extension().is_some_and(|ext| ext == "jsx");
    let config_path = input.parent().unwrap().join("config.json");
    let flow_syntax = load_flow_syntax(config_path, is_jsx);

    Tester::new()
        .print_errors(|cm, handler| {
            let compiler = Compiler::new(cm.clone());
            let fm = cm.load_file(&input).expect("failed to load flow fixture");

            let output = match compiler.process_js_file(
                fm,
                &handler,
                &Options {
                    swcrc: false,
                    config: Config {
                        jsc: JscConfig {
                            syntax: Some(Syntax::Flow(flow_syntax)),
                            external_helpers: true.into(),
                            ..Default::default()
                        },
                        ..Default::default()
                    },
                    ..Default::default()
                },
            ) {
                Ok(v) => v,
                Err(err) => panic!("failed to compile {}: {err:?}", input.display()),
            };

            if handler.has_errors() {
                return Err(());
            }

            assert!(
                !output.code.contains("__flow_"),
                "flow synthetic symbols leaked in emitted output for {}",
                input.display()
            );

            let output_fm = cm.new_source_file(FileName::Anon.into(), output.code);
            let mut recovered_errors = vec![];

            match parse_file_as_program(
                &output_fm,
                Syntax::Es(EsSyntax {
                    jsx: flow_syntax.jsx,
                    decorators: true,
                    decorators_before_export: true,
                    export_default_from: true,
                    import_attributes: true,
                    allow_super_outside_method: true,
                    auto_accessors: true,
                    explicit_resource_management: true,
                    ..Default::default()
                }),
                EsVersion::latest(),
                None,
                &mut recovered_errors,
            ) {
                Ok(_) => {}
                Err(err) => {
                    err.into_diagnostic(&handler).emit();

                    for recovered in recovered_errors {
                        recovered.into_diagnostic(&handler).emit();
                    }

                    return Err(());
                }
            }

            if !recovered_errors.is_empty() {
                for recovered in recovered_errors {
                    recovered.into_diagnostic(&handler).emit();
                }

                return Err(());
            }

            Ok(())
        })
        .unwrap();
}

fn load_flow_syntax(config_path: PathBuf, is_jsx: bool) -> FlowSyntax {
    let mut flow_syntax = FlowSyntax {
        jsx: is_jsx,
        ..Default::default()
    };

    let mut config = String::new();
    if File::open(config_path)
        .ok()
        .and_then(|mut file| file.read_to_string(&mut config).ok())
        .is_some()
    {
        if let Ok(mut parsed) = serde_json::from_str::<FlowSyntax>(&config) {
            parsed.jsx |= is_jsx;
            flow_syntax = parsed;
        }
    }

    flow_syntax
}
