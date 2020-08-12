use crate::JsCompiler;
use anyhow::{bail, Error};
use fxhash::FxHashMap;
use neon::prelude::*;
use serde::Deserialize;
use spack::resolvers::NodeResolver;
use std::{
    panic::{catch_unwind, AssertUnwindSafe},
    sync::Arc,
};
use swc::{config::SourceMapsConfig, Compiler, TransformOutput};
use swc_bundler::{BundleKind, Bundler, Load, Resolve};

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
    type Error = Error;
    type JsEvent = JsValue;

    fn perform(&self) -> Result<Self::Output, Self::Error> {
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
                },
            );

            let result = bundler.bundle(self.config.static_items.config.entry.clone().into())?;

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
                .collect::<Result<_, _>>()?;

            Ok(result)
        }));

        let err = match res {
            Ok(v) => return v,
            Err(err) => err,
        };

        if let Some(s) = err.downcast_ref::<String>() {
            bail!("panic detected: {}", s);
        }

        bail!("panic detected")
    }

    fn complete(
        self,
        mut cx: TaskContext,
        result: Result<Self::Output, Self::Error>,
    ) -> JsResult<Self::JsEvent> {
        match result {
            Ok(v) => Ok(neon_serde::to_value(&mut cx, &v)?.upcast()),
            Err(err) => cx.throw_error(format!("{:?}", err)),
        }
    }
}

pub(crate) fn bundle(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    let c: Arc<Compiler>;
    let this = cx.this();
    {
        let guard = cx.lock();
        let compiler = this.borrow(&guard);
        c = compiler.clone();
    }

    let undefined = cx.undefined();

    let opt = cx.argument::<JsObject>(0)?;
    let callback = cx.argument::<JsFunction>(1)?;
    let static_items: StaticConfigItem = neon_serde::from_value(&mut cx, opt.upcast())?;

    let loader = opt
        .get(&mut cx, "loader")?
        .downcast::<JsFunction>()
        .map(|f| {
            let handler = EventHandler::new(&mut cx, undefined, f);
            //
            Box::new(spack::loaders::neon::NeonLoader {
                swc: c.clone(),
                handler,
            }) as Box<dyn Load>
        })
        .unwrap_or_else(|_| {
            Box::new(spack::loaders::swc::SwcLoader::new(
                c.clone(),
                static_items
                    .config
                    .options
                    .as_ref()
                    .cloned()
                    .unwrap_or_else(|| {
                        serde_json::from_value(serde_json::Value::Object(Default::default()))
                            .unwrap()
                    }),
            ))
        });

    BundleTask {
        swc: c.clone(),
        config: ConfigItem {
            loader,
            resolver: Box::new(NodeResolver::new()) as Box<_>,
            static_items,
        },
    }
    .schedule(callback);

    Ok(cx.undefined().upcast())
}
