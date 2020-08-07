use anyhow::Error;
use swc_common::FileName;
use swc_ecma_ast::Module;

/// Responsible for providing files to the bundler.
///
/// This trait is designed to allow passing pre-parsed module.
pub trait Load {
    fn load(&self, file: &FileName) -> Result<Module, Error>;
}
