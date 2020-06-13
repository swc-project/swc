use crate::JsCompiler;
use anyhow::{bail, Error};
use fxhash::FxHashMap;
use neon::prelude::*;
use serde::Deserialize;
use spack::{
    load::Load,
    resolve::{NodeResolver, Resolve},
    BundleKind,
};
use std::{path::PathBuf, sync::Arc};
use swc::{config::SourceMapsConfig, Compiler, TransformOutput};

struct ConfigItem {
    loader: Box<dyn Load>,
    resolver: Box<dyn Resolve>,
    static_items: StaticConfigItem,
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum EntryInput {
    Single(String),
    Multiple(FxHashMap<String, String>),
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StaticConfigItem {
    name: String,
    entry: EntryInput,
    #[serde(default)]
    working_dir: String,
    #[serde(default)]
    options: Option<swc::config::Options>,
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
        let working_dir = PathBuf::from(self.config.static_items.working_dir.clone());
        let bundler = spack::Bundler::new(
            working_dir.clone(),
            self.swc.clone(),
            self.config.static_items.options.clone().unwrap_or_else(|| {
                serde_json::from_value(serde_json::Value::Object(Default::default())).unwrap()
            }),
            &self.config.resolver,
            &self.config.loader,
        );
        let entries = match &self.config.static_items.entry {
            EntryInput::Single(name) => {
                let mut m = FxHashMap::default();
                m.insert(name.clone(), working_dir.join(name));
                m
            }
            EntryInput::Multiple(v) => v
                .into_iter()
                .map(|(k, v)| (k.clone(), working_dir.clone().join(v)))
                .collect(),
        };

        let result = bundler.bundle(entries)?;

        let result = result
            .into_iter()
            .map(|bundle| match bundle.kind {
                BundleKind::Named { name } | BundleKind::Lib { name } => Ok((name, bundle.module)),
                BundleKind::Dynamic => bail!("unimplemented: dynamic code splitting"),
            })
            .map(|res| {
                res.and_then(|(k, m)| {
                    // TODO: Source map
                    let minify = self
                        .config
                        .static_items
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

                    let output = self
                        .swc
                        .print(&m, SourceMapsConfig::Bool(true), None, minify)?;

                    Ok((k, output))
                })
            })
            .collect::<Result<_, _>>()?;

        Ok(result)
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
    let static_items = neon_serde::from_value(&mut cx, opt.upcast())?;

    let loader = opt
        .get(&mut cx, "loader")?
        .downcast::<JsFunction>()
        .map(|f| {
            let handler = EventHandler::new(&mut cx, undefined, f);
            //
            box spack::loaders::neon::NeonLoader {
                swc: c.clone(),
                handler,
            } as Box<dyn Load>
        })
        .unwrap_or_else(|_| box spack::loaders::swc::SwcLoader::new(c.clone(), Default::default()));

    BundleTask {
        swc: c.clone(),
        config: ConfigItem {
            loader,
            resolver: box NodeResolver as Box<_>,
            static_items,
        },
    }
    .schedule(callback);

    Ok(cx.undefined().upcast())
}
