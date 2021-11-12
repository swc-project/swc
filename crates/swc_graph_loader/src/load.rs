use anyhow::Error;
use swc_common::FileName;

use crate::module_id::ModuleId;

/// General file loader.
#[auto_impl::auto_impl(&, Box)]
pub trait Load: swc_common::sync::Send + swc_common::sync::Sync {
    type Output: LoaderOutput;

    fn load(&self, file: &FileName) -> Result<Self::Output, Error>;
}

impl<L> Load for swc_common::sync::Lrc<L>
where
    L: Load,
{
    type Output = L::Output;

    fn load(&self, file: &FileName) -> Result<Self::Output, Error> {
        (**self).load(file)
    }
}

pub trait LoaderOutput: Sized {
    fn module_id(&self) -> ModuleId;
}
