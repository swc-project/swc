use std::sync::Arc;
use swc::{
    config::{Config, JscConfig, Options},
    Compiler,
};
use swc_common::FileName;
use swc_ecma_parser::{EsConfig, Syntax};
use testing::Tester;

fn compile(src: &str, options: Options) -> String {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone(), Arc::new(handler));

            let fm = cm.new_source_file(FileName::Real("input.js".into()), src.into());
            let s = c.process_js_file(
                fm,
                &Options {
                    is_module: true,
                    ..options
                },
            );

            match s {
                Ok(v) => {
                    if c.handler.has_errors() {
                        Err(())
                    } else {
                        Ok(v.code.into())
                    }
                }
                Err(..) => Err(()),
            }
        })
        .unwrap()
}

#[test]
fn issue_834_1() {
    compile(
        "var foo =  2n + 7n;",
        Options {
            swcrc: false,
            ..Default::default()
        },
    );
}

#[test]
fn issue_834_2() {
    compile(
        "var ano = { some: {
	ne:  {

	}
}};
var foo = ano.some.ne?.sdf?.snop;
const someValue = 'test' ?? 'default value';",
        Options {
            config: Some(Config {
                jsc: JscConfig {
                    syntax: Some(Syntax::Es(EsConfig {
                        nullish_coalescing: true,
                        optional_chaining: true,
                        ..Default::default()
                    })),
                    ..Default::default()
                },
                ..Default::default()
            }),
            swcrc: false,
            ..Default::default()
        },
    );
}

#[test]
fn issue_834_3() {
    compile(
        "const someValue = 'test'  ?? 'default value';",
        Options {
            config: Some(Config {
                jsc: JscConfig {
                    syntax: Some(Syntax::Es(EsConfig {
                        nullish_coalescing: true,
                        ..Default::default()
                    })),
                    ..Default::default()
                },
                ..Default::default()
            }),
            swcrc: false,
            ..Default::default()
        },
    );
}
