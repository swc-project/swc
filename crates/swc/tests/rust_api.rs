use swc::{
    config::{
        Config, InputSourceMap, IsModule, JscConfig, ModuleConfig, Options, SourceMapsConfig,
    },
    Compiler,
};
use swc_common::{comments::SingleThreadedComments, FileName};
use swc_ecma_ast::*;
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_transforms::{modules::common_js, pass::noop};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut};

struct PanicOnVisit;

impl VisitMut for PanicOnVisit {
    noop_visit_mut_type!();

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
            FileName::Anon,
            "
                console.log(5 as const)
            "
            .into(),
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
            |_, _| as_folder(PanicOnVisit),
            |_, _| noop(),
        );

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
            FileName::Anon,
            "
            import React from 'react';
            import { useI18n } from '@shopify/react-i18n';

            export function App() {
                const [i18n] = useI18n();
                return <h1>{i18n.translate('foo')}</h1>
            }
            "
            .into(),
        );

        let res = c.process_js_with_custom_pass(
            fm,
            None,
            &handler,
            &Options {
                config: Config {
                    jsc: JscConfig {
                        syntax: Some(Syntax::Es(EsConfig {
                            jsx: true,
                            ..Default::default()
                        })),
                        ..Default::default()
                    },
                    module: Some(ModuleConfig::CommonJs(common_js::Config {
                        ..Default::default()
                    })),
                    ..Default::default()
                },
                is_module: IsModule::Bool(true),
                ..Default::default()
            },
            |_, _: &SingleThreadedComments| {
                // Ensure comment API
                noop()
            },
            |_, _: &SingleThreadedComments| noop(),
        );

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
                    syntax: Some(Syntax::Typescript(TsConfig {
                        tsx: true,
                        decorators: false,
                        dts: false,
                        no_early_errors: false,
                    })),
                    transform: None,
                    external_helpers: false,
                    target: Some(EsVersion::Es5),
                    loose: false,
                    keep_class_names: false,
                    base_url: Default::default(),
                    paths: Default::default(),
                    minify: None,
                    experimental: Default::default(),
                    lints: Default::default(),
                    assumptions: Default::default(),
                    preserve_all_comments: false,
                },
                module: None,
                minify: false,
                input_source_map: InputSourceMap::Bool(false),
                source_maps: None,
                inline_sources_content: false,
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
            is_module: IsModule::Bool(true),
            ..Default::default()
        };

        let fm = cm.new_source_file(
            FileName::Real("/Users/kdy1/projects/example-swcify/src/App/App.tsx".into()),
            "
            import React from 'react';
            import { useI18n } from '@shopify/react-i18n';

            export function App() {
                const [i18n] = useI18n();
                return <h1>{i18n.translate('foo')}</h1>
            }
            "
            .into(),
        );

        let res =
            c.process_js_with_custom_pass(fm, None, &handler, &opts, |_, _| noop(), |_, _| noop());

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
                    syntax: Some(Syntax::Typescript(TsConfig {
                        tsx: true,
                        ..Default::default()
                    })),
                    ..Default::default()
                },
                module: None,
                minify: false,
                input_source_map: InputSourceMap::Bool(false),
                source_maps: None,
                inline_sources_content: false,
                ..Default::default()
            },
            cwd: "/Users/kdy1/projects/example-swcify".into(),
            filename: "/Users/kdy1/projects/example-swcify/src/App/App.tsx".into(),
            env_name: "development".into(),
            source_maps: Some(SourceMapsConfig::Bool(false)),
            source_file_name: Some("/Users/kdy1/projects/example-swcify/src/App/App.tsx".into()),
            is_module: IsModule::Bool(true),
            ..Default::default()
        };

        let fm = cm.new_source_file(
            FileName::Real("/Users/kdy1/projects/example-swcify/src/App/App.tsx".into()),
            "
            import React from 'react';
            import { useI18n } from '@shopify/react-i18n';

            export function App() {
                const [i18n] = useI18n();
                return <h1>{i18n.translate('foo')}</h1>
            }
            "
            .into(),
        );

        let res =
            c.process_js_with_custom_pass(fm, None, &handler, &opts, |_, _| noop(), |_, _| noop());

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
                    syntax: Some(Syntax::Es(EsConfig {
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
            is_module: IsModule::Bool(true),
            ..Default::default()
        };

        let fm = cm.new_source_file(
            FileName::Real("/Users/kdy1/projects/example-swcify/src/App/App.tsx".into()),
            "
            import React from 'react';
            import { useI18n } from '@shopify/react-i18n';

            export function App() {
                const [i18n] = useI18n();
                return <h1>{i18n.translate('foo')}</h1>
            }
            "
            .into(),
        );

        let res =
            c.process_js_with_custom_pass(fm, None, &handler, &opts, |_, _| noop(), |_, _| noop());

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
