use anyhow::Error;
use swc_common::{sync::Lrc, FileName, SourceFile};
use swc_ecma_ast::Module;

/// Responsible for providing files to the bundler.
///
/// Note: Resolve and Load are separate trait because multiple module can depend
/// on a single module. Due to the possibility of 'common' module, bundler
/// should implement some caching. The bundler uses [FileName] as a key of the
/// cache.
///
/// This trait is designed to allow passing pre-parsed module.
pub trait Load {
    fn load(&self, file: &FileName) -> Result<(Lrc<SourceFile>, Module), Error>;
}

impl<T: ?Sized + Load> Load for Box<T> {
    fn load(&self, file: &FileName) -> Result<(Lrc<SourceFile>, Module), Error> {
        (**self).load(file)
    }
}

impl<'a, T: ?Sized + Load> Load for &'a T {
    fn load(&self, file: &FileName) -> Result<(Lrc<SourceFile>, Module), Error> {
        (**self).load(file)
    }
}
