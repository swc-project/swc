pub use self::{
    module::ModuleConfig,
    optimization::OptimizationConfig,
    output::OutputConfig,
    resolve::{AliasConfig, ResolveConfig},
};
use fxhash::FxHashMap;
use serde::Deserialize;
use std::{fmt, marker::PhantomData, path::PathBuf};
use string_enum::StringEnum;

mod module;
mod optimization;
mod output;
mod resolve;

#[derive(Debug, Deserialize)]
pub struct Config {
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

#[derive(Debug, Deserialize)]
#[serde(untagged, rename = "Entry")]
pub enum EntryConfig {
    File(String),
    Multiple(Vec<String>),
    Files(FxHashMap<String, PathBuf>),
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
