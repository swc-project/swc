use anyhow::Error;
use swc_common::FileName;

/// Resolve and Load
pub trait Resolve {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<FileName, Error>;
}
