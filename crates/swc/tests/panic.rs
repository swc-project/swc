//! Custom passes must visit the expected nodes and propagate their panics.

use swc::{
    config::{Config, JscConfig, Options},
    Compiler,
};
use swc_common::{
    comments::{Comment, SingleThreadedComments},
    errors::HANDLER,
    BytePos, FileName,
};
use swc_compiler_base::PrintArgs;
use swc_ecma_ast::{noop_pass, Ident, JSXElementName, JSXOpeningElement, Number};
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms::helpers::{self, Helpers};
use swc_ecma_visit::{fold_pass, noop_visit_mut_type, visit_mut_pass, Fold, VisitMut};
use testing::Tester;

struct Panicking;

impl Fold for Panicking {
    fn fold_jsx_opening_element(&mut self, node: JSXOpeningElement) -> JSXOpeningElement {
        let JSXOpeningElement { name, .. } = &node;
        println!("HMM");

        if let JSXElementName::Ident(Ident { sym, .. }) = name {
            panic!("visited: {sym}")
        }

        node
    }
}

#[test]
#[should_panic = "visited"]
fn should_visit() {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            let fm = cm.new_source_file(
                FileName::Anon.into(),
                "
                    import React from 'react';
                    const comp = () => <amp-something className='something' />;
                ",
            );
            let comments = SingleThreadedComments::default();
            let config = c
                .parse_js_as_input(
                    fm.clone(),
                    None,
                    &handler,
                    &swc::config::Options {
                        config: swc::config::Config {
                            jsc: JscConfig {
                                syntax: Some(Syntax::Es(EsSyntax {
                                    jsx: true,
                                    ..Default::default()
                                })),
                                ..Default::default()
                            },
                            ..Default::default()
                        },
                        ..Default::default()
                    },
                    &fm.name,
                    Some(&comments),
                    |_| noop_pass(),
                )
                .unwrap()
                .unwrap();

            dbg!(config.syntax);

            let config = config.with_pass(|pass| (fold_pass(Panicking), pass));

            if config.minify {
                let preserve_excl = |_: &BytePos, vc: &mut Vec<Comment>| -> bool {
                    vc.retain(|c: &Comment| c.text.starts_with('!'));
                    !vc.is_empty()
                };
                c.comments().leading.retain(preserve_excl);
                c.comments().trailing.retain(preserve_excl);
            }
            let pass = config.pass;
            let program = config.program;
            let program = helpers::HELPERS.set(&Helpers::new(config.external_helpers), || {
                HANDLER.set(&handler, || {
                    // Fold module
                    program.apply(pass)
                })
            });

            Ok(c.print(
                &program,
                PrintArgs {
                    source_root: None,
                    source_file_name: None,
                    output_path: config.output_path,
                    inline_sources_content: config.inline_sources_content,
                    source_map: config.source_maps,
                    orig: None,
                    // TODO: figure out sourcemaps
                    comments: Some(&comments),
                    emit_source_map_columns: config.emit_source_map_columns,
                    codegen_config: swc_ecma_codegen::Config::default()
                        .with_target(config.target)
                        .with_minify(config.minify),
                    ..Default::default()
                },
            )
            .unwrap()
            .code)
        })
        .unwrap();
}

struct PanicOnVisit;

impl VisitMut for PanicOnVisit {
    noop_visit_mut_type!(fail);

    fn visit_mut_number(&mut self, n: &mut Number) {
        panic!("Expected {:?}", n.value)
    }
}

/// We ensure that typescript is stripped out before applying custom transforms.
#[test]
#[should_panic(expected = "Expected 5.0")]
fn test_visit_mut() {
    testing::run_test2(false, |cm, handler| {
        let c = Compiler::new(cm.clone());

        let fm = cm.new_source_file(
            FileName::Anon.into(),
            "
                console.log(5 as const)
            ",
        );

        let res = c.process_js_with_custom_pass(
            fm,
            None,
            &handler,
            &Options {
                config: Config {
                    jsc: JscConfig {
                        syntax: Some(Syntax::Typescript(Default::default())),
                        ..Default::default()
                    },
                    ..Default::default()
                },

                ..Default::default()
            },
            SingleThreadedComments::default(),
            |_| visit_mut_pass(PanicOnVisit),
            |_| noop_pass(),
        );

        assert_ne!(res.unwrap().code, "console.log(5 as const)");

        Ok(())
    })
    .unwrap()
}
