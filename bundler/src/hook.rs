use anyhow::Error;
use swc_common::{FileName, Span};
use swc_ecma_ast::KeyValueProp;

#[non_exhaustive]
pub struct ModuleRecord {
    pub file_name: FileName,
    pub is_entry: bool,
}

pub trait Hook: swc_common::sync::Sync + swc_common::sync::Send {
    fn get_import_meta_props(
        &self,
        span: Span,
        module_record: &ModuleRecord,
    ) -> Result<Vec<KeyValueProp>, Error>;
}
