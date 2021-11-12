use anyhow::Error;
use swc_common::FileName;

use crate::module_id::ModuleId;

/// General file loader.
#[auto_impl::auto_impl(&, Box)]
pub trait Load: swc_common::sync::Send + swc_common::sync::Sync {
    type Output;
    type Metadata;

    fn is_loaded(&self, f: &FileName) -> bool;

    fn metadata_for(&self, f: &FileName) -> Result<(ModuleId, Self::Metadata), Error>;

    fn load(
        &self,
        module_id: ModuleId,
        metadata: Self::Metadata,
        file: &FileName,
    ) -> Result<Self::Output, Error>;
}

impl<L> Load for swc_common::sync::Lrc<L>
where
    L: Load,
{
    type Output = L::Output;
    type Metadata = L::Metadata;

    fn is_loaded(&self, f: &FileName) -> bool {
        (**self).is_loaded(f)
    }

    fn metadata_for(&self, f: &FileName) -> Result<(ModuleId, Self::Metadata), Error> {
        (**self).metadata_for(f)
    }

    fn load(
        &self,
        module_id: ModuleId,
        metadata: Self::Metadata,
        file: &FileName,
    ) -> Result<Self::Output, Error> {
        (**self).load(module_id, metadata, file)
    }
}
