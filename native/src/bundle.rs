use crate::{
    get_compiler,
    util::{CtxtExt, MapErr},
};
use anyhow::{bail, Error};
use fxhash::FxHashMap;
use napi::{CallContext, Env, JsObject, Status, Task};
use serde::Deserialize;
use spack::resolvers::NodeResolver;
use std::{
    panic::{catch_unwind, AssertUnwindSafe},
    sync::Arc,
};
use swc::{config::SourceMapsConfig, Compiler, TransformOutput};
use swc_bundler::{BundleKind, Bundler, Load, Resolve};
use swc_common::{FileName, Span};
use swc_ecma_ast::{Expr, Lit, Str};

struct ConfigItem {
    loader: Box<dyn Load>,
    resolver: Box<dyn Resolve>,
    static_items: StaticConfigItem,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StaticConfigItem {
    #[serde(default)]
    working_dir: String,
    #[serde(flatten)]
    config: spack::config::Config,
}

struct BundleTask {
    swc: Arc<swc::Compiler>,
    config: ConfigItem,
}

impl Task for BundleTask {
    type Output = FxHashMap<String, TransformOutput>;
    type JsValue = JsObject;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let res = catch_unwind(AssertUnwindSafe(|| {
            let bundler = Bundler::new(
                self.swc.globals(),
                self.swc.cm.clone(),
                &self.config.loader,
                &self.config.resolver,
                swc_bundler::Config {
                    require: true,
                    external_modules: vec![
                        "assert",
                        "buffer",
                        "child_process",
                        "console",
                        "cluster",
                        "crypto",
                        "dgram",
                        "dns",
                        "events",
                        "fs",
                        "http",
                        "http2",
                        "https",
                        "net",
                        "os",
                        "path",
                        "perf_hooks",
                        "process",
                        "querystring",
                        "readline",
                        "repl",
                        "stream",
                        "string_decoder",
                        "timers",
                        "tls",
                        "tty",
                        "url",
                        "util",
                        "v8",
                        "vm",
                        "wasi",
                        "worker",
                        "zlib",
                    ]
                    .into_iter()
                    .map(From::from)
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
                            .map(|v| {
                                v.config
                                    .as_ref()
                                    .map(|v| v.minify)
                                    .flatten()
                                    .unwrap_or(false)
                            })
                            .unwrap_or(false);

                        let output =
                            self.swc
                                .print(&m, SourceMapsConfig::Bool(true), None, minify)?;

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
            format!("panic detected"),
        ))
    }

    fn resolve(&self, env: &mut Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        env.to_js_value(&output)?.coerce_to_object()
    }
}

#[js_function(1)]
pub(crate) fn bundle(cx: CallContext) -> napi::Result<JsObject> {
    let c: Arc<Compiler> = get_compiler(&cx);

    let static_items: StaticConfigItem = cx.get_deserialized(0)?;

    let loader = Box::new(spack::loaders::swc::SwcLoader::new(
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

    cx.env.spawn(BundleTask {
        swc: c.clone(),
        config: ConfigItem {
            loader,
            resolver: Box::new(NodeResolver::new()) as Box<_>,
            static_items,
        },
    })
}

struct Hook;

impl swc_bundler::Hook for Hook {
    fn get_import_meta_url(&self, span: Span, file: &FileName) -> Result<Option<Expr>, Error> {
        Ok(Some(Expr::Lit(Lit::Str(Str {
            span,
            value: file.to_string().into(),
            has_escape: false,
        }))))
    }
}
