use std::{collections::HashMap, env, sync::Arc};

use anyhow::{bail, Context, Error};
use helpers::Helpers;
use swc::{
    config::{GlobalInliningPassEnvs, InputSourceMap, IsModule, JscConfig, TransformConfig},
    try_with_handler,
};
use swc_atoms::JsWord;
use swc_bundler::{Load, ModuleData};
use swc_common::{
    collections::AHashMap,
    comments::{NoopComments, SingleThreadedComments},
    errors::{Handler, HANDLER},
    sync::Lrc,
    FileName, Mark, DUMMY_SP,
};
use swc_ecma_ast::{noop_pass, EsVersion, Expr, Lit, Module, Program, Str};
use swc_ecma_parser::{parse_file_as_module, Syntax};
use swc_ecma_transforms::{
    helpers,
    optimization::{
        inline_globals,
        simplify::{dead_branch_remover, expr_simplifier},
    },
    react::jsx,
    resolver,
    typescript::typescript,
};

use crate::loaders::json::load_json_as_module;

/// JavaScript loader
pub struct SwcLoader {
    compiler: Arc<swc::Compiler>,
    options: swc::config::Options,
}

impl SwcLoader {
    pub fn new(compiler: Arc<swc::Compiler>, options: swc::config::Options) -> Self {
        SwcLoader { compiler, options }
    }

    fn env_map(&self) -> Lrc<AHashMap<JsWord, Expr>> {
        let mut m = HashMap::default();

        let envs = self
            .options
            .config
            .jsc
            .transform
            .as_ref()
            .and_then(|t| t.optimizer.as_ref())
            .and_then(|o| o.globals.as_ref())
            .map(|g| g.envs.clone())
            .unwrap_or_default();

        let envs_map: AHashMap<_, _> = match envs {
            GlobalInliningPassEnvs::Map(m) => m,
            GlobalInliningPassEnvs::List(envs) => envs
                .into_iter()
                .map(|name| {
                    let value = env::var(&name).ok();
                    (name.into(), value.unwrap_or_default().into())
                })
                .collect(),
        };

        for (k, v) in envs_map {
            m.insert(
                k,
                Lit::Str(Str {
                    span: DUMMY_SP,
                    raw: None,
                    value: v,
                })
                .into(),
            );
        }

        Lrc::new(m)
    }

    fn load_with_handler(&self, handler: &Handler, name: &FileName) -> Result<ModuleData, Error> {
        tracing::debug!("JsLoader.load({})", name);
        let helpers = Helpers::new(false);

        if let FileName::Custom(id) = name {
            // Handle built-in modules
            if id.starts_with("node:") {
                let fm = self
                    .compiler
                    .cm
                    .new_source_file(name.clone().into(), "".to_string());
                return Ok(ModuleData {
                    fm,
                    module: Module {
                        span: DUMMY_SP,
                        body: Default::default(),
                        shebang: Default::default(),
                    },
                    helpers: Default::default(),
                });
            // Handle disabled modules, eg when `browser` has a field
            // set to `false`
            } else {
                // TODO: When we know the calling context is ESM
                // TODO: switch to `export default {}`.
                let fm = self
                    .compiler
                    .cm
                    .new_source_file(name.clone().into(), "module.exports = {}".to_string());

                let module = parse_file_as_module(
                    &fm,
                    Syntax::Es(Default::default()),
                    Default::default(),
                    None,
                    &mut Vec::new(),
                )
                .unwrap();
                return Ok(ModuleData {
                    fm,
                    module,
                    helpers: Default::default(),
                });
            }
        }

        let fm = self
            .compiler
            .cm
            .load_file(match name {
                FileName::Real(v) => v,
                _ => bail!("swc-loader only accepts path. Got `{}`", name),
            })
            .with_context(|| format!("failed to load file `{}`", name))?;

        if let FileName::Real(path) = name {
            if let Some(ext) = path.extension() {
                if ext == "json" {
                    let module = load_json_as_module(&fm)
                        .with_context(|| format!("failed to load json file at {}", fm.name))?;
                    return Ok(ModuleData {
                        fm,
                        module,
                        helpers: Default::default(),
                    });
                }
            }
        }

        tracing::trace!("JsLoader.load: loaded");

        let program = if fm.name.to_string().contains("node_modules") {
            let comments = self.compiler.comments().clone();

            let mut program = self.compiler.parse_js(
                fm.clone(),
                handler,
                EsVersion::Es2020,
                Default::default(),
                IsModule::Bool(true),
                Some(&comments),
            )?;

            helpers::HELPERS.set(&helpers, || {
                HANDLER.set(handler, || {
                    let unresolved_mark = Mark::new();
                    let top_level_mark = Mark::new();

                    program.mutate(&mut resolver(unresolved_mark, top_level_mark, false));
                    program.mutate(&mut typescript(
                        Default::default(),
                        unresolved_mark,
                        top_level_mark,
                    ));

                    program.mutate(&mut jsx(
                        self.compiler.cm.clone(),
                        None::<NoopComments>,
                        Default::default(),
                        top_level_mark,
                        unresolved_mark,
                    ));

                    program.mutate(&mut inline_globals(
                        self.env_map(),
                        Default::default(),
                        Default::default(),
                    ));

                    program.mutate(&mut expr_simplifier(unresolved_mark, Default::default()));

                    program.mutate(&mut dead_branch_remover(unresolved_mark));

                    program
                })
            })
        } else {
            let comments = SingleThreadedComments::default();
            let config = self.compiler.parse_js_as_input(
                fm.clone(),
                None,
                handler,
                &swc::config::Options {
                    config: {
                        let c = &self.options.config;
                        swc::config::Config {
                            jsc: JscConfig {
                                transform: {
                                    c.jsc
                                        .transform
                                        .as_ref()
                                        .map(|c| TransformConfig {
                                            react: c.react.clone(),
                                            const_modules: c.const_modules.clone(),
                                            optimizer: None,
                                            legacy_decorator: c.legacy_decorator,
                                            decorator_metadata: c.decorator_metadata,
                                            hidden: Default::default(),
                                            ..Default::default()
                                        })
                                        .into()
                                },
                                external_helpers: true.into(),
                                ..c.jsc.clone()
                            },
                            module: None,
                            minify: false.into(),
                            input_source_map: InputSourceMap::Bool(false).into(),
                            ..c.clone()
                        }
                    },
                    skip_helper_injection: true,
                    disable_hygiene: false,
                    disable_fixer: true,
                    top_level_mark: self.options.top_level_mark,
                    cwd: self.options.cwd.clone(),
                    caller: None,
                    filename: String::new(),
                    config_file: None,
                    root: None,
                    swcrc: true,
                    env_name: { env::var("NODE_ENV").unwrap_or_else(|_| "development".into()) },
                    ..Default::default()
                },
                &fm.name,
                Some(&comments),
                |_| noop_pass(),
            )?;

            tracing::trace!("JsLoader.load: loaded config");

            // We run transform at this phase to strip out unused dependencies.
            //
            // Note that we don't apply compat transform at loading phase.
            let program = if let Some(config) = config {
                let mut program = config.program;
                let pass = config.pass;

                helpers::HELPERS.set(&helpers, || {
                    HANDLER.set(handler, || {
                        let unresolved_mark = Mark::new();
                        let top_level_mark = Mark::new();

                        program.mutate(&mut resolver(unresolved_mark, top_level_mark, false));
                        program.mutate(&mut typescript(
                            Default::default(),
                            unresolved_mark,
                            top_level_mark,
                        ));

                        program.mutate(&mut jsx(
                            self.compiler.cm.clone(),
                            None::<NoopComments>,
                            Default::default(),
                            top_level_mark,
                            unresolved_mark,
                        ));

                        program.mutate(&mut inline_globals(
                            self.env_map(),
                            Default::default(),
                            Default::default(),
                        ));

                        program.mutate(&mut expr_simplifier(unresolved_mark, Default::default()));
                        program.mutate(&mut dead_branch_remover(unresolved_mark));

                        program.apply(pass)
                    })
                })
            } else {
                let comments = self.compiler.comments().clone();

                self.compiler
                    .parse_js(
                        fm.clone(),
                        handler,
                        EsVersion::Es2020,
                        config.as_ref().map(|v| v.syntax).unwrap_or_default(),
                        IsModule::Bool(true),
                        Some(&comments),
                    )
                    .context("tried to parse as ecmascript as it's excluded by .swcrc")?
            };

            tracing::trace!("JsLoader.load: applied transforms");

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

impl Load for SwcLoader {
    fn load(&self, name: &FileName) -> Result<ModuleData, Error> {
        try_with_handler(self.compiler.cm.clone(), Default::default(), |handler| {
            self.load_with_handler(handler, name)
        })
    }
}
