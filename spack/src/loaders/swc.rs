use crate::loaders::json::load_json_as_module;
use anyhow::{bail, Context, Error};
use helpers::Helpers;
use std::{collections::HashMap, env, sync::Arc};
use swc::config::{InputSourceMap, JscConfig, TransformConfig};
use swc_atoms::JsWord;
use swc_bundler::{Load, ModuleData};
use swc_common::{FileName, DUMMY_SP};
use swc_ecma_ast::Module;
use swc_ecma_ast::{Expr, Lit, Program, Str};
use swc_ecma_parser::JscTarget;
use swc_ecma_transforms::{
    helpers,
    optimization::{
        inline_globals,
        simplify::{dead_branch_remover, expr_simplifier},
    },
};
use swc_ecma_visit::FoldWith;

/// JavaScript loader
pub struct SwcLoader {
    compiler: Arc<swc::Compiler>,
    options: swc::config::Options,
}

impl SwcLoader {
    pub fn new(compiler: Arc<swc::Compiler>, options: swc::config::Options) -> Self {
        SwcLoader { compiler, options }
    }
}

impl Load for SwcLoader {
    fn load(&self, name: &FileName) -> Result<ModuleData, Error> {
        log::debug!("JsLoader.load({})", name);
        let helpers = Helpers::new(false);

        match name {
            // Handle built-in modules
            FileName::Custom(..) => {
                let fm = self
                    .compiler
                    .cm
                    .new_source_file(name.clone(), "".to_string());
                return Ok(ModuleData {
                    fm,
                    module: Module {
                        span: DUMMY_SP,
                        body: Default::default(),
                        shebang: Default::default(),
                    },
                    helpers: Default::default(),
                });
            }
            _ => {}
        }

        let fm = self
            .compiler
            .cm
            .load_file(match name {
                FileName::Real(v) => &v,
                _ => bail!("swc-loader only accepts path. Got `{}`", name),
            })
            .with_context(|| format!("failed to load file `{}`", name))?;

        match name {
            FileName::Real(path) => {
                if let Some(ext) = path.extension() {
                    if ext == "json" {
                        let module = load_json_as_module(&fm)
                            .with_context(|| format!("failed to load json file at {}", fm.name))?;
                        return Ok(ModuleData {
                            fm: fm.clone(),
                            module,
                            helpers: Default::default(),
                        });
                    }
                }
            }
            _ => {}
        }

        log::trace!("JsLoader.load: loaded");

        let program = if fm.name.to_string().contains("node_modules") {
            let program = self.compiler.parse_js(
                fm.clone(),
                JscTarget::Es2020,
                Default::default(),
                true,
                true,
            )?;
            let program = helpers::HELPERS.set(&helpers, || {
                swc_ecma_utils::HANDLER.set(&self.compiler.handler, || {
                    let program =
                        program.fold_with(&mut inline_globals(env_map(), Default::default()));
                    let program = program.fold_with(&mut expr_simplifier());
                    let program = program.fold_with(&mut dead_branch_remover());

                    program
                })
            });

            program
        } else {
            let config = self.compiler.config_for_file(
                &swc::config::Options {
                    config: {
                        let c = &self.options.config;
                        swc::config::Config {
                            jsc: JscConfig {
                                transform: {
                                    if let Some(c) = &c.jsc.transform {
                                        Some(TransformConfig {
                                            react: c.react.clone(),
                                            const_modules: c.const_modules.clone(),
                                            optimizer: None,
                                            legacy_decorator: c.legacy_decorator,
                                            decorator_metadata: c.decorator_metadata,
                                            hidden: Default::default(),
                                        })
                                    } else {
                                        None
                                    }
                                },
                                external_helpers: true,
                                ..c.jsc
                            },
                            module: None,
                            minify: Some(false),
                            ..c.clone()
                        }
                    },
                    skip_helper_injection: true,
                    disable_hygiene: false,
                    disable_fixer: true,
                    global_mark: self.options.global_mark,
                    cwd: self.options.cwd.clone(),
                    caller: None,
                    filename: String::new(),
                    config_file: None,
                    root: None,
                    root_mode: Default::default(),
                    swcrc: true,
                    swcrc_roots: Default::default(),
                    env_name: {
                        let s = env::var("NODE_ENV").unwrap_or_else(|_| "development".into());
                        s
                    },
                    input_source_map: InputSourceMap::Bool(false),
                    source_maps: None,
                    source_file_name: None,
                    source_root: None,
                    is_module: true,
                },
                &fm.name,
            )?;

            log::trace!("JsLoader.load: loaded config");

            // We run transform at this phase to strip out unused dependencies.
            //
            // Note that we don't apply compat transform at loading phase.
            let program = self.compiler.parse_js(
                fm.clone(),
                JscTarget::Es2020,
                config.as_ref().map(|v| v.syntax).unwrap_or_default(),
                true,
                true,
            );
            let program = if config.is_some() {
                program?
            } else {
                program.context("tried to parse as ecmascript as it's excluded by .swcrc")?
            };

            log::trace!("JsLoader.load: parsed");

            // Fold module
            let program = if let Some(mut config) = config {
                helpers::HELPERS.set(&helpers, || {
                    swc_ecma_utils::HANDLER.set(&self.compiler.handler, || {
                        let program =
                            program.fold_with(&mut inline_globals(env_map(), Default::default()));
                        let program = program.fold_with(&mut expr_simplifier());
                        let program = program.fold_with(&mut dead_branch_remover());

                        let program = program.fold_with(&mut config.pass);

                        program
                    })
                })
            } else {
                program
            };

            log::trace!("JsLoader.load: applied transforms");

            program
        };

        match program {
            Program::Module(module) => Ok(ModuleData {
                fm,
                module,
                helpers,
            }),
            _ => unreachable!(),
        }
    }
}

fn env_map() -> HashMap<JsWord, Expr> {
    let mut m = HashMap::default();

    {
        let s = env::var("NODE_ENV")
            .map(|v| JsWord::from(v))
            .unwrap_or_else(|_| "development".into());

        m.insert(
            "NODE_ENV".into(),
            Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: s,
                has_escape: false,
                kind: Default::default(),
            })),
        );
    }

    m
}
