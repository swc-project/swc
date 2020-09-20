use anyhow::{bail, Context, Error};
use helpers::Helpers;
use std::{collections::HashMap, env, sync::Arc};
use swc::config::{InputSourceMap, JscConfig, TransformConfig};
use swc_atoms::JsWord;
use swc_bundler::Load;
use swc_common::{FileName, SourceFile, DUMMY_SP};
use swc_ecma_ast::{Expr, Lit, Module, Program, Str};
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
    pub fn new(compiler: Arc<swc::Compiler>, mut options: swc::config::Options) -> Self {
        if options.config.is_none() {
            options.config = Some(Default::default());
        }

        SwcLoader { compiler, options }
    }
}

impl Load for SwcLoader {
    fn load(&self, name: &FileName) -> Result<(Arc<SourceFile>, Module), Error> {
        log::debug!("JsLoader.load({})", name);

        let fm = self
            .compiler
            .cm
            .load_file(match name {
                FileName::Real(v) => &v,
                _ => bail!("swc-loader only accepts path. Got `{}`", name),
            })
            .with_context(|| format!("failed to load file `{}`", name))?;

        log::trace!("JsLoader.load: loaded");

        let program = if fm.name.to_string().contains("node_modules") {
            let program = self.compiler.parse_js(
                fm.clone(),
                JscTarget::Es2020,
                Default::default(),
                true,
                true,
            )?;
            let program = helpers::HELPERS.set(&Helpers::new(true), || {
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
            let mut config = self.compiler.config_for_file(
                &swc::config::Options {
                    config: {
                        if let Some(c) = &self.options.config {
                            Some(swc::config::Config {
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
                            })
                        } else {
                            None
                        }
                    },
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
            let program =
                self.compiler
                    .parse_js(fm.clone(), JscTarget::Es2020, config.syntax, true, true)?;

            log::trace!("JsLoader.load: parsed");

            // Fold module
            let program = helpers::HELPERS.set(&Helpers::new(true), || {
                swc_ecma_utils::HANDLER.set(&self.compiler.handler, || {
                    let program =
                        program.fold_with(&mut inline_globals(env_map(), Default::default()));
                    let program = program.fold_with(&mut expr_simplifier());
                    let program = program.fold_with(&mut dead_branch_remover());

                    let program = program.fold_with(&mut config.pass);

                    program
                })
            });

            log::trace!("JsLoader.load: applied transforms");

            program
        };

        match program {
            Program::Module(module) => Ok((fm, module)),
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
            })),
        );
    }

    m
}
