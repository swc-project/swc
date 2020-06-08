use crate::JsCompiler;
use anyhow::Error;
use neon::prelude::*;
use serde::Deserialize;
use spack::{load::Load, resolve::Resolve};
use std::{path::PathBuf, sync::Arc};

struct ConfigItem {
    loader: Box<dyn Load>,
    resolver: Box<dyn Resolve>,
    static_items: StaticConfigItem,
}

#[derive(Debug, Deserialize)]
struct StaticConfigItem {
    name: String,
    working_dir: String,
    options: swc::config::Options,
}

struct BundleTask {
    swc: Arc<swc::Compiler>,
    config: ConfigItem,
}

impl Task for BundleTask {
    type Output = ();
    type Error = Error;
    type JsEvent = JsValue;

    fn perform(&self) -> Result<Self::Output, Self::Error> {
        let working_dir = PathBuf::from(self.config.static_items.working_dir.clone());
        let mut bundler = spack::Bundler::new(
            working_dir,
            self.swc.clone(),
            self.config.static_items.options.clone(),
            &self.config.resolver,
            &self.config.loader,
        );
    }

    fn complete<'a>(
        self,
        cx: TaskContext<'a>,
        result: Result<Self::Output, Self::Error>,
    ) -> JsResult<'_, Self::JsEvent> {
    }
}

pub(crate) fn bundle(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    let c;
    let this = cx.this();
    {
        let guard = cx.lock();
        let compiler = this.borrow(&guard);
        c = compiler.clone();
    }
    let mut configs = vec![];

    let undefined = cx.undefined();

    let opt = cx
        .argument::<JsObject>(0)
        .downcast_or_throw::<JsObject, _>(&mut cx)?;

    let loader = opt
        .get(&mut cx, "loader")?
        .downcast::<JsFunction>()
        .map(|f| {
            let handler = EventHandler::new(&mut cx, undefined, f);
            //
            box spack::loaders::neon::NeonLoader {
                swc: c.clone(),
                handler,
            } as Box<_>
        })
        .unwrap_or_else(|_| box spack::loaders::swc::SwcLoader::new(c.clone(), Default::default()));

    configs.push(ConfigItem {
        laod: loader,
        static_items: neon_serde::from_value(&mut cx, opt.upcast())?,
    });

    Ok(cx.undefined().upcast())
}
