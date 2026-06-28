use anyhow::Error;
use swc_common::{sync::Lrc, FileName, SourceFile};
use swc_ecma_ast::Module;
use swc_ecma_transforms_base::helpers::Helpers;

#[derive(Debug)]
pub struct ModuleData {
    pub fm: Lrc<SourceFile>,
    pub module: Module,
    /// Used helpers
    ///
    /// # Example
    ///
    /// ```rust,ignore
    /// 
    /// impl Load for Loader {
    ///     fn load(&self, name: &FileName) -> Result<ModuleData, Error> {
    ///         let helpers = Helpers::new(false);
    ///         let fm = self.load_file(name)?;
    ///         let module = self.parse(fm.clone())?;
    ///
    ///         let module = helpers::HELPERS.set(&helpers, || {
    ///             // Apply transforms (like decorators pass)
    ///             module
    ///         });
    ///
    ///         Ok(ModuleData { fm, module, helpers })
    ///     }
    /// }
    /// ```
    pub helpers: Helpers,
}

/// Responsible for providing files to the bundler.
///
/// Note: Resolve and Load are separate trait because multiple module can depend
/// on a single module. Due to the possibility of 'common' module, bundler
/// should implement some caching. The bundler uses [FileName] as a key of the
/// cache.
///
/// This trait is designed to allow passing pre-parsed module.
pub trait Load: swc_common::sync::Send + swc_common::sync::Sync {
    fn load(&self, file: &FileName) -> Result<ModuleData, Error>;
}

impl<T: ?Sized + Load> Load for Box<T> {
    fn load(&self, file: &FileName) -> Result<ModuleData, Error> {
        (**self).load(file)
    }
}

impl<T: ?Sized + Load> Load for &T {
    fn load(&self, file: &FileName) -> Result<ModuleData, Error> {
        (**self).load(file)
    }
}
