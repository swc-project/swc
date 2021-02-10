pub use self::{
    module::ModuleConfig,
    optimization::OptimizationConfig,
    output::OutputConfig,
    resolve::{AliasConfig, ResolveConfig},
};
use serde::Deserialize;
use std::{collections::HashMap, fmt, marker::PhantomData, path::PathBuf};
use string_enum::StringEnum;
use swc_common::FileName;
use swc_ecma_parser::JscTarget;

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
}

impl Config {
    pub fn codegen_target(&self) -> Option<JscTarget> {
        self.options
            .as_ref()
            .map(|options| options.codegen_target())
            .flatten()
    }
}

#[derive(StringEnum)]
pub enum Mode {
    /// `production`
    Production,
    /// `debug`
    Debug,
    /// `none`
    None,
}

impl Default for Mode {
    fn default() -> Self {
        Mode::None
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(untagged, rename = "Entry")]
pub enum EntryConfig {
    File(String),
    Multiple(Vec<String>),
    Files(HashMap<String, PathBuf>),
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
