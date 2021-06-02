use crate::id::ModuleId;
use swc_atoms::JsWord;
use swc_common::{FileName, Mark};

/// The hook for import / export analysis.
///
/// This trait is actaully registry for modules.
pub trait Handler {
    fn is_external_module(&self, module_specifier: &JsWord) -> bool;

    /// Should return [None] on an error.
    fn resolve(&self, from: &FileName, src: &JsWord) -> Option<FileName>;

    /// Returns `(module_id, local_ctxt, export_ctxt)`.
    ///
    /// # Note
    ///
    /// Return type is not result under assumption that this method is only
    /// called with [FileName] returned from `resolve`.
    fn get_module_info(&self, path: &FileName) -> (ModuleId, Mark, Mark);

    /// If this method returns true, analyzer will check for `require` calls.
    fn supports_cjs(&self) -> bool;

    /// Mark a module as common js module.
    fn mark_as_cjs(&self, id: ModuleId);

    /// If we cannot determine the used items, we wrapped them with a function.
    ///
    /// ```ts
    /// import * as foo from 'foo'
    /// foo[Math.random()]
    /// ```
    fn mark_as_wrapping_required(&self, id: ModuleId);
}
