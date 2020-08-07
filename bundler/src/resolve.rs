use anyhow::Error;
use swc_common::FileName;

pub trait Resolve {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<FileName, Error>;
}
