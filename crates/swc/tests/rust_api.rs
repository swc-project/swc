use anyhow::Error;
use swc::{
    config::{Config, InputSourceMap, JscConfig, ModuleConfig, Options, SourceMapsConfig},
    CompileInput, Compiler, PipelineContext, PipelineHooks,
};
use swc_common::FileName;
use swc_ecma_ast::*;
use swc_ecma_parser::{EsSyntax, Syntax, TsSyntax};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

struct PanicOnVisit;

impl VisitMut for PanicOnVisit {
    noop_visit_mut_type!(fail);

    fn visit_mut_number(&mut self, n: &mut Number) {
        panic!("Expected {:?}", n.value)
    }
}

impl PipelineHooks for PanicOnVisit {
    fn mutate_after_typescript(
        &mut self,
        program: &mut Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        program.visit_mut_with(self);
        Ok(())
    }
}

/// Ensures that TypeScript is stripped before the after-TypeScript hooks run.
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

        let res = c
            .compile(
                &handler,
                CompileInput::source(fm),
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
            )
            .with_hooks(PanicOnVisit)
            .codegen();

        assert_ne!(res.unwrap().code, "console.log(5 as const)");

        Ok(())
    })
    .unwrap()
}

#[test]
fn shopify_1_check_filename() {
    testing::run_test2(false, |cm, handler| {
        let c = Compiler::new(cm.clone());

        let fm = cm.new_source_file(
            FileName::Anon.into(),
            "
            import React from 'react';
            import { useI18n } from '@shopify/react-i18n';

            export function App() {
                const [i18n] = useI18n();
                return <h1>{i18n.translate('foo')}</h1>
            }
            ",
        );

        let res = c
            .compile(
                &handler,
                CompileInput::source(fm),
                &Options {
                    config: Config {
                        jsc: JscConfig {
                            syntax: Some(Syntax::Es(EsSyntax {
                                jsx: true,
                                ..Default::default()
                            })),
                            ..Default::default()
                        },
                        module: Some(ModuleConfig::CommonJs(Default::default())),
                        ..Default::default()
                    },
                    ..Default::default()
                },
            )
            .codegen();

        if res.is_err() {
            return Err(());
        }

        let res = res.unwrap();
        eprintln!("{}", res.code);

        assert!(res.code.contains("_react.default.createElement"));
        Ok(())
    })
    .unwrap()
}

#[test]
fn shopify_2_same_opt() {
    testing::run_test2(false, |cm, handler| {
        let c = Compiler::new(cm.clone());

        let opts = Options {
            config: Config {
                env: None,
                test: None,
                exclude: None,
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsSyntax {
                        tsx: true,
                        decorators: false,
                        dts: false,
                        no_early_errors: false,
                        disallow_ambiguous_jsx_like: false,
                    })),
                    transform: None.into(),
                    external_helpers: false.into(),
                    target: Some(EsVersion::Es5),
                    loose: false.into(),
                    keep_class_names: false.into(),
                    minify: None,
                    preserve_all_comments: false.into(),
                    ..Default::default()
                },
                module: None,
                minify: false.into(),
                input_source_map: Some(InputSourceMap::Bool(false)),
                source_maps: None,
                inline_sources_content: false.into(),
                ..Default::default()
            },
            skip_helper_injection: false,
            disable_hygiene: false,
            disable_fixer: false,
            top_level_mark: None,
            cwd: "/Users/kdy1/projects/example-swcify".into(),
            filename: "/Users/kdy1/projects/example-swcify/src/App/App.tsx".into(),
            env_name: "development".into(),
            source_maps: Some(SourceMapsConfig::Bool(false)),
            source_file_name: Some("/Users/kdy1/projects/example-swcify/src/App/App.tsx".into()),
            ..Default::default()
        };

        let fm = cm.new_source_file(
            FileName::Real("/Users/kdy1/projects/example-swcify/src/App/App.tsx".into()).into(),
            "
            import React from 'react';
            import { useI18n } from '@shopify/react-i18n';

            export function App() {
                const [i18n] = useI18n();
                return <h1>{i18n.translate('foo')}</h1>
            }
            ",
        );

        let res = c
            .compile(&handler, CompileInput::source(fm), &opts)
            .codegen();

        if res.is_err() {
            return Err(());
        }

        let res = res.unwrap();
        eprintln!("{}", res.code);

        assert!(res.code.contains("React.createElement"));
        assert!(res.code.contains("import React"));

        Ok(())
    })
    .unwrap()
}

#[test]
fn shopify_3_reduce_defaults() {
    testing::run_test2(false, |cm, handler| {
        let c = Compiler::new(cm.clone());

        let opts = Options {
            config: Config {
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsSyntax {
                        tsx: true,
                        ..Default::default()
                    })),
                    ..Default::default()
                },
                module: None,
                minify: false.into(),
                input_source_map: InputSourceMap::Bool(false).into(),
                source_maps: None,
                inline_sources_content: false.into(),
                ..Default::default()
            },
            cwd: "/Users/kdy1/projects/example-swcify".into(),
            filename: "/Users/kdy1/projects/example-swcify/src/App/App.tsx".into(),
            env_name: "development".into(),
            source_maps: Some(SourceMapsConfig::Bool(false)),
            source_file_name: Some("/Users/kdy1/projects/example-swcify/src/App/App.tsx".into()),
            ..Default::default()
        };

        let fm = cm.new_source_file(
            FileName::Real("/Users/kdy1/projects/example-swcify/src/App/App.tsx".into()).into(),
            "
            import React from 'react';
            import { useI18n } from '@shopify/react-i18n';

            export function App() {
                const [i18n] = useI18n();
                return <h1>{i18n.translate('foo')}</h1>
            }
            ",
        );

        let res = c
            .compile(&handler, CompileInput::source(fm), &opts)
            .codegen();

        if res.is_err() {
            return Err(());
        }

        let res = res.unwrap();
        eprintln!("{}", res.code);

        assert!(res.code.contains("React.createElement"));
        assert!(res.code.contains("import React"));

        Ok(())
    })
    .unwrap()
}

#[test]
fn shopify_4_reduce_more() {
    testing::run_test2(false, |cm, handler| {
        let c = Compiler::new(cm.clone());

        let opts = Options {
            config: Config {
                jsc: JscConfig {
                    syntax: Some(Syntax::Es(EsSyntax {
                        jsx: true,
                        ..Default::default()
                    })),
                    ..Default::default()
                },
                ..Default::default()
            },
            cwd: "/Users/kdy1/projects/example-swcify".into(),
            filename: "/Users/kdy1/projects/example-swcify/src/App/App.tsx".into(),
            env_name: "development".into(),
            source_maps: Some(SourceMapsConfig::Bool(false)),
            source_file_name: Some("/Users/kdy1/projects/example-swcify/src/App/App.tsx".into()),
            ..Default::default()
        };

        let fm = cm.new_source_file(
            FileName::Real("/Users/kdy1/projects/example-swcify/src/App/App.tsx".into()).into(),
            "
            import React from 'react';
            import { useI18n } from '@shopify/react-i18n';

            export function App() {
                const [i18n] = useI18n();
                return <h1>{i18n.translate('foo')}</h1>
            }
            ",
        );

        let res = c
            .compile(&handler, CompileInput::source(fm), &opts)
            .codegen();

        if res.is_err() {
            return Err(());
        }

        let res = res.unwrap();
        eprintln!("{}", res.code);

        assert!(res.code.contains("React.createElement"));
        assert!(res.code.contains("import React"));

        Ok(())
    })
    .unwrap()
}
