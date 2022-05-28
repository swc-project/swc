use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;
use helper::JsHook;
use napi::{Env, JsFunction};
use swc_common::{FileName, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{parse_file_as_module, Syntax};
use swcpack_core::{
    asset::{AssetLoader, AssetLoaderContext, AssetProcessor},
    esm::{EsModule, EsmPreprocessor, EsmPreprocessorContext, EsmProcessor},
    file::FileLoader,
    resource::{Res, ResourceIdGenerator},
    Timer,
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
        ctx: &mut AssetLoaderContext<'a>,
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

pub struct JsFileLoader {
    id_gen: ResourceIdGenerator,

    /// `(filename) => (code)`
    f: JsHook<String, String>,
}

impl JsFileLoader {
    pub fn new(id_gen: ResourceIdGenerator, env: &Env, f: &JsFunction) -> napi::Result<Self> {
        Ok(Self {
            id_gen,
            f: JsHook::new(env, f)?,
        })
    }
}

#[async_trait]
impl FileLoader for JsFileLoader {
    async fn load_file(&self, filename: Arc<FileName>) -> Result<Res<Vec<u8>>> {
        let content = self.f.call(filename.to_string()).await?.into_bytes();
        Ok(Res::new(&self.id_gen, content))
    }
}

pub struct JsEsmPreprocessor {
    id_gen: ResourceIdGenerator,

    /// `(ast_json) => (ast_json)`
    f: JsHook<String, String>,
}

impl JsEsmPreprocessor {
    pub fn new(id_gen: ResourceIdGenerator, env: &Env, f: &JsFunction) -> napi::Result<Self> {
        Ok(Self {
            id_gen,
            f: JsHook::new(env, f)?,
        })
    }
}

#[async_trait]
impl EsmPreprocessor for JsEsmPreprocessor {
    async fn preprocess_esm(
        &self,
        ctx: &mut EsmPreprocessorContext,
        m: &mut Res<EsModule>,
    ) -> Result<()> {
        let ast_json = {
            let _timer = Timer::new("convert ast as json");

            serde_json::to_string(&m.ast)?
        };

        let result_json = self.f.call(ast_json.clone()).await?;

        if ast_json == result_json {
            return Ok(());
        }

        let ast = serde_json::from_str(&result_json)?;

        *m = Res::new(
            &self.id_gen,
            EsModule {
                name: m.name.clone(),
                ast,
            },
        );
        Ok(())
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
