use std::{collections::HashMap, fmt, marker::PhantomData, path::PathBuf};

use serde::Deserialize;
use string_enum::StringEnum;
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, FileName};
use swc_ecma_ast::EsVersion;
use swc_ecma_loader::TargetEnv;

pub use self::{
    module::ModuleConfig,
    optimization::OptimizationConfig,
    output::OutputConfig,
    resolve::{AliasConfig, ResolveConfig},
};

mod module;
mod optimization;
mod output;
mod resolve;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub working_dir: PathBuf,

    #[serde(default)]
    pub mode: Mode,

    #[serde(default)]
    pub target: TargetEnv,

    pub entry: EntryConfig,

    #[serde(default)]
    pub output: Option<OutputConfig>,

    #[serde(default)]
    pub module: ModuleConfig,

    #[serde(default)]
    pub optimization: Option<OptimizationConfig>,

    #[serde(default)]
    pub resolve: Option<ResolveConfig>,

    #[serde(default)]
    pub options: Option<swc::config::Options>,

    #[serde(default)]
    pub external_modules: Vec<JsWord>,

    #[serde(default)]
    pub alias: AHashMap<TargetEnv, AHashMap<String, String>>,

    #[serde(default)]
    pub preserve_symlinks: bool,
}

impl Config {
    pub fn codegen_target(&self) -> Option<EsVersion> {
        self.options
            .as_ref()
            .and_then(|options| options.codegen_target())
    }
}

#[derive(StringEnum, Default)]
pub enum Mode {
    /// `production`
    Production,
    /// `debug`
    Debug,
    /// `none`
    #[default]
    None,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(untagged, rename = "Entry")]
pub enum EntryConfig {
    File(String),
    Multiple(Vec<String>),
    Files(AHashMap<String, PathBuf>),
}

impl From<EntryConfig> for HashMap<String, FileName> {
    fn from(c: EntryConfig) -> Self {
        let mut m = HashMap::default();

        match c {
            EntryConfig::File(f) => {
                let path = PathBuf::from(f);
                let file_name = path
                    .file_name()
                    .expect("entry must be a file, instead of a directory");
                m.insert(file_name.to_string_lossy().into(), FileName::Real(path));
            }
            EntryConfig::Multiple(files) => {
                for f in files {
                    let path = PathBuf::from(f);
                    let file_name = path
                        .file_name()
                        .expect("entry must be a file, instead of a directory");
                    m.insert(file_name.to_string_lossy().into(), FileName::Real(path));
                }
            }
            EntryConfig::Files(f) => {
                return f.into_iter().map(|(k, v)| (k, FileName::Real(v))).collect()
            }
        }

        m
    }
}

pub struct JsCallback<T, Ret> {
    _f: Box<dyn Send + Sync + Fn(T) -> Ret>,
    _phantom: PhantomData<(T, Ret)>,
}

impl<T, Ret> fmt::Debug for JsCallback<T, Ret> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "<js function>")
    }
}
