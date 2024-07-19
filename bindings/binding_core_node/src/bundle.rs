use std::{
    panic::{catch_unwind, AssertUnwindSafe},
    sync::Arc,
};

use anyhow::{bail, Error};
use napi::{
    bindgen_prelude::{AbortSignal, AsyncTask, Buffer},
    Env, Status, Task,
};
use serde::Deserialize;
use swc_core::{
    atoms::JsWord,
    base::{
        config::SourceMapsConfig,
        resolver::{environment_resolver, paths_resolver},
        Compiler, PrintArgs, TransformOutput,
    },
    bundler::{BundleKind, Bundler, Load, ModuleRecord, Resolve},
    common::{collections::AHashMap, Globals, Span, GLOBALS},
    ecma::{
        ast::{
            Bool, Expr, IdentName, KeyValueProp, Lit, MemberExpr, MemberProp, MetaPropExpr,
            MetaPropKind, PropName, Str,
        },
        loader::{TargetEnv, NODE_BUILTINS},
    },
    node::{get_deserialized, MapErr},
};

use crate::get_compiler;

struct ConfigItem {
    loader: Box<dyn Load>,
    resolver: Box<dyn Resolve>,
    static_items: StaticConfigItem,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StaticConfigItem {
    #[cfg(feature = "swc_v1")]
    #[serde(flatten)]
    config: swc_core::bundler::node::v1::Config,
}

pub(crate) struct BundleTask {
    swc: Arc<swc_core::base::Compiler>,
    config: ConfigItem,
}

#[cfg(feature = "swc_v1")]
#[napi]
impl Task for BundleTask {
    type JsValue = AHashMap<String, TransformOutput>;
    type Output = AHashMap<String, TransformOutput>;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let builtins = if let TargetEnv::Node = self.config.static_items.config.target {
            NODE_BUILTINS
                .iter()
                .copied()
                .map(JsWord::from)
                .collect::<Vec<_>>()
        } else {
            Vec::new()
        };

        // Defaults to es3
        let codegen_target = self
            .config
            .static_items
            .config
            .codegen_target()
            .unwrap_or_default();

        let globals = Globals::default();
        GLOBALS.set(&globals, || {
            let res = catch_unwind(AssertUnwindSafe(|| {
                let mut bundler = Bundler::new(
                    &globals,
                    self.swc.cm.clone(),
                    &self.config.loader,
                    &self.config.resolver,
                    swc_core::bundler::Config {
                        require: true,
                        external_modules: builtins
                            .into_iter()
                            .chain(
                                self.config
                                    .static_items
                                    .config
                                    .external_modules
                                    .iter()
                                    .cloned(),
                            )
                            .collect(),
                        ..Default::default()
                    },
                    Box::new(Hook),
                );

                let result = bundler
                    .bundle(self.config.static_items.config.entry.clone().into())
                    .convert_err()?;

                let result = result
                    .into_iter()
                    .map(|bundle| match bundle.kind {
                        BundleKind::Named { name } | BundleKind::Lib { name } => {
                            Ok((name, bundle.module))
                        }
                        BundleKind::Dynamic => bail!("unimplemented: dynamic code splitting"),
                    })
                    .map(|res| {
                        res.and_then(|(k, m)| {
                            // TODO: Source map
                            let minify = self
                                .config
                                .static_items
                                .config
                                .options
                                .as_ref()
                                .map(|v| v.config.minify.into_bool())
                                .unwrap_or(false);

                            let output = self.swc.print(
                                &m,
                                PrintArgs {
                                    inline_sources_content: true,
                                    source_map: SourceMapsConfig::Bool(true),
                                    emit_source_map_columns: true,
                                    codegen_config: swc_core::ecma::codegen::Config::default()
                                        .with_target(codegen_target)
                                        .with_minify(minify),
                                    ..Default::default()
                                },
                            )?;

                            Ok((k, output))
                        })
                    })
                    .collect::<Result<_, _>>()
                    .convert_err()?;

                Ok(result)
            }));

            let err = match res {
                Ok(v) => return v,
                Err(err) => err,
            };

            if let Some(s) = err.downcast_ref::<String>() {
                return Err(napi::Error::new(
                    Status::GenericFailure,
                    format!("panic detected: {}", s),
                ));
            }

            Err(napi::Error::new(
                Status::GenericFailure,
                "panic detected".to_string(),
            ))
        })
    }

    fn resolve(&mut self, _env: Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

#[cfg(feature = "swc_v2")]
impl Task for BundleTask {
    type JsValue = AHashMap<String, TransformOutput>;
    type Output = AHashMap<String, TransformOutput>;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        todo!()
    }

    fn resolve(&mut self, env: Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        todo!()
    }
}

#[cfg(feature = "swc_v1")]
#[napi(ts_return_type = "Promise<{ [index: string]: { code: string, map?: string } }>")]
pub(crate) fn bundle(
    conf_items: Buffer,
    signal: Option<AbortSignal>,
) -> napi::Result<AsyncTask<BundleTask>> {
    crate::util::init_default_trace_subscriber();

    let c: Arc<Compiler> = get_compiler();

    let static_items: StaticConfigItem = get_deserialized(&conf_items)?;

    let loader = Box::new(swc_core::bundler::node::loaders::swc::SwcLoader::new(
        c.clone(),
        static_items
            .config
            .options
            .as_ref()
            .cloned()
            .unwrap_or_else(|| {
                serde_json::from_value(serde_json::Value::Object(Default::default())).unwrap()
            }),
    ));

    let target_env = static_items.config.target;

    let paths = static_items.config.options.as_ref().map(|options| {
        let paths: Vec<(String, Vec<String>)> = options
            .config
            .jsc
            .paths
            .iter()
            .map(|(k, v)| (k.clone(), v.clone()))
            .collect();
        (options.config.jsc.base_url.clone(), paths)
    });

    let alias = static_items
        .config
        .alias
        .get(&target_env)
        .cloned()
        .unwrap_or_default();

    let resolver: Box<dyn Resolve> = if let Some((base_url, paths)) = paths {
        Box::new(paths_resolver(
            target_env,
            alias,
            base_url,
            paths,
            static_items.config.preserve_symlinks,
        ))
    } else {
        Box::new(environment_resolver(
            target_env,
            alias,
            static_items.config.preserve_symlinks,
        ))
    };

    Ok(AsyncTask::with_optional_signal(
        BundleTask {
            swc: c,
            config: ConfigItem {
                loader,
                resolver,
                static_items,
            },
        },
        signal,
    ))
}

#[cfg(feature = "swc_v2")]
#[napi]
pub(crate) fn bundle() -> napi::Result<AsyncTask<BundleTask>> {
    todo!()
}

struct Hook;

impl swc_core::bundler::Hook for Hook {
    fn get_import_meta_props(
        &self,
        span: Span,
        module_record: &ModuleRecord,
    ) -> Result<Vec<KeyValueProp>, Error> {
        let file_name = module_record.file_name.to_string();

        Ok(vec![
            KeyValueProp {
                key: PropName::Ident(IdentName::new("url".into(), span)),
                value: Box::new(Expr::Lit(Lit::Str(Str {
                    span,
                    raw: None,
                    value: file_name.into(),
                }))),
            },
            KeyValueProp {
                key: PropName::Ident(IdentName::new("main".into(), span)),
                value: Box::new(if module_record.is_entry {
                    Expr::Member(MemberExpr {
                        span,
                        obj: Box::new(Expr::MetaProp(MetaPropExpr {
                            span,
                            kind: MetaPropKind::ImportMeta,
                        })),
                        prop: MemberProp::Ident(IdentName::new("main".into(), span)),
                    })
                } else {
                    Expr::Lit(Lit::Bool(Bool { span, value: false }))
                }),
            },
        ])
    }
}
