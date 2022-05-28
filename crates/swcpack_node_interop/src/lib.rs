use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;
use helper::JsHook;
use napi::{Env, JsFunction, JsUnknown};
use swc_common::{FileName, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{parse_file_as_module, Syntax};
use swcpack_core::{
    asset::{AssetLoader, AssetLoaderContext, AssetProcessor},
    esm::{EsModule, EsmLoader, EsmLoaderContext, EsmPreprocessor, EsmProcessor},
    resource::{Res, ResourceIdGenerator},
};

mod helper;

pub struct JsAssetLoader {
    cm: Arc<SourceMap>,
    res_id_gen: ResourceIdGenerator,

    /// `(filename) => (code)`
    f: JsHook<String, String>,
}

#[async_trait]
impl AssetLoader for JsAssetLoader {
    async fn load_asset<'a>(
        &'a self,
        ctx: AssetLoaderContext<'a>,
        filename: Arc<FileName>,
    ) -> Result<Res<EsModule>> {
        let code = self.f.call(filename.to_string()).await?;

        let fm = self.cm.new_source_file((*filename).clone(), code);

        let m = parse_file_as_module(
            &fm,
            Syntax::default(),
            EsVersion::latest(),
            None,
            &mut vec![],
        )
        .map_err(|err| anyhow::anyhow!("failed to parse: {:?}", err))?;

        Ok(Res::new(
            &self.res_id_gen,
            EsModule {
                name: filename.clone(),
                ast: m,
            },
        ))
    }
}

pub struct JsAssetProcessor {
    /// `(buffer) => (buffer)`
    f: JsHook<Vec<u8>, Vec<u8>>,
}

#[async_trait]
impl AssetProcessor for JsAssetProcessor {
    async fn process_asset(&self, m: &mut Res<EsModule>) -> Result<()> {
        todo!("JsAssetProcessor::process_asset");
    }
}

pub struct JsEsmLoader {
    cm: Arc<SourceMap>,
    res_id_gen: ResourceIdGenerator,

    /// `(filename) => (code)`
    f: JsHook<String, String>,
}

impl JsEsmLoader {
    pub fn new(
        cm: Arc<SourceMap>,
        res_id_gen: ResourceIdGenerator,
        env: &Env,
        f: &JsFunction,
    ) -> napi::Result<Self> {
        fn map_to_js(env: &Env, v: String) -> napi::Result<JsUnknown> {
            // dbg!(&v);
            let s = env.create_string(&v)?.into_unknown();

            // dbg!(&v);
            Ok(s)
        }

        fn map_result(env: &Env, v: JsUnknown) -> String {
            v.coerce_to_string()
                .unwrap()
                .into_utf8()
                .unwrap()
                .into_owned()
                .unwrap()
        }

        Ok(Self {
            cm,
            res_id_gen,
            f: JsHook::new(env, f, map_to_js, map_result)?,
        })
    }
}

#[async_trait]
impl EsmLoader for JsEsmLoader {
    async fn load_esm(
        &self,
        ctx: &mut EsmLoaderContext,
        filename: Arc<FileName>,
    ) -> Result<Res<EsModule>> {
        let code = self.f.call(filename.to_string()).await?;

        // dbg!(&code);

        let fm = self.cm.new_source_file((*filename).clone(), code);

        let m = parse_file_as_module(
            &fm,
            Syntax::default(),
            EsVersion::latest(),
            None,
            &mut vec![],
        )
        .map_err(|err| anyhow::anyhow!("failed to parse: {:?}", err))?;

        Ok(Res::new(
            &self.res_id_gen,
            EsModule {
                name: filename.clone(),
                ast: m,
            },
        ))
    }
}

pub struct JsEsmPreprocessor {
    /// `(code) => (code)`
    f: JsHook<String, String>,
}

#[async_trait]
impl EsmPreprocessor for JsEsmPreprocessor {
    async fn preprocess_esm(&self, m: &mut Res<EsModule>) -> Result<()> {
        todo!("JsEsmPreprocessor::preprocess_esm");
    }
}

pub struct JsEsmProcessor {
    /// `(code) => (code)`
    f: JsHook<String, String>,
}

#[async_trait]
impl EsmProcessor for JsEsmProcessor {
    async fn process_esm(&self, m: &mut Res<EsModule>) -> Result<()> {
        todo!("JsEsmProcessor::process_esm")
    }
}
