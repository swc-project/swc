use crate::loaders::json::load_json_as_module;
use anyhow::{bail, Context, Error};
use helpers::Helpers;
use std::{collections::HashMap, env, sync::Arc};
use swc::{
    config::{GlobalInliningPassEnvs, InputSourceMap, JscConfig, TransformConfig},
    try_with_handler,
};
use swc_atoms::JsWord;
use swc_bundler::{Load, ModuleData};
use swc_common::{
    collections::AHashMap,
    errors::{Handler, HANDLER},
    sync::Lrc,
    FileName, DUMMY_SP,
};
use swc_ecma_ast::{EsVersion, Expr, Lit, Module, Program, Str};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_transforms::{
    helpers,
    optimization::{
        inline_globals,
        simplify::{dead_branch_remover, expr_simplifier},
    },
    pass::noop,
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
            .and_then(|g| Some(g.envs.clone()))
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
                Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    value: v,
                    has_escape: false,
                    kind: Default::default(),
                })),
            );
        }

        Lrc::new(m)
    }

    fn load_with_handler(&self, handler: &Handler, name: &FileName) -> Result<ModuleData, Error> {
        tracing::debug!("JsLoader.load({})", name);
        let helpers = Helpers::new(false);

        match name {
            FileName::Custom(id) => {
                // Handle built-in modules
                if id.starts_with("node:") {
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
                // Handle disabled modules, eg when `browser` has a field
                // set to `false`
                } else {
                    // TODO: When we know the calling context is ESM
                    // TODO: switch to `export default {}`.
                    let fm = self
                        .compiler
                        .cm
                        .new_source_file(name.clone(), "module.exports = {}".to_string());
                    let lexer = Lexer::new(
                        Syntax::Es(Default::default()),
                        Default::default(),
                        StringInput::from(&*fm),
                        None,
                    );
                    let mut parser = Parser::new_from(lexer);
                    let module = parser.parse_module().unwrap();
                    return Ok(ModuleData {
                        fm,
                        module,
                        helpers: Default::default(),
                    });
                }
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

        tracing::trace!("JsLoader.load: loaded");

        let program = if fm.name.to_string().contains("node_modules") {
            let program = self.compiler.parse_js(
                fm.clone(),
                &handler,
                EsVersion::Es2020,
                Default::default(),
                true,
                true,
            )?;
            let program = helpers::HELPERS.set(&helpers, || {
                HANDLER.set(&handler, || {
                    let program = program.fold_with(&mut inline_globals(
                        self.env_map(),
                        Default::default(),
                        Default::default(),
                    ));
                    let program = program.fold_with(&mut expr_simplifier(Default::default()));
                    let program = program.fold_with(&mut dead_branch_remover());

                    program
                })
            });

            program
        } else {
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
                                    if let Some(c) = &c.jsc.transform {
                                        Some(TransformConfig {
                                            react: c.react.clone(),
                                            const_modules: c.const_modules.clone(),
                                            optimizer: None,
                                            legacy_decorator: c.legacy_decorator,
                                            decorator_metadata: c.decorator_metadata,
                                            hidden: Default::default(),
                                            ..Default::default()
                                        })
                                    } else {
                                        None
                                    }
                                },
                                external_helpers: true,
                                ..c.jsc.clone()
                            },
                            module: None,
                            minify: false,
                            input_source_map: InputSourceMap::Bool(false),
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
                    source_maps: None,
                    source_file_name: None,
                    source_root: None,
                    is_module: true,
                    output_path: None,
                    ..Default::default()
                },
                &fm.name,
                |_| noop(),
            )?;

            tracing::trace!("JsLoader.load: loaded config");

            // We run transform at this phase to strip out unused dependencies.
            //
            // Note that we don't apply compat transform at loading phase.
            let program = if let Some(config) = config {
                let program = config.program;
                let mut pass = config.pass;

                helpers::HELPERS.set(&helpers, || {
                    HANDLER.set(handler, || {
                        let program = program.fold_with(&mut inline_globals(
                            self.env_map(),
                            Default::default(),
                            Default::default(),
                        ));
                        let program = program.fold_with(&mut expr_simplifier(Default::default()));
                        let program = program.fold_with(&mut dead_branch_remover());

                        let program = program.fold_with(&mut pass);

                        program
                    })
                })
            } else {
                self.compiler
                    .parse_js(
                        fm.clone(),
                        handler,
                        EsVersion::Es2020,
                        config.as_ref().map(|v| v.syntax).unwrap_or_default(),
                        true,
                        true,
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
        try_with_handler(self.compiler.cm.clone(), false, |handler| {
            self.load_with_handler(&handler, name)
        })
    }
}
