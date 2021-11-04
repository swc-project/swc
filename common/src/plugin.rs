//! Plugin support.
//!
//! We need to replace operations related to thread-local variables in
//! `swc_common`.

use crate::{
    errors::{DiagnosticBuilder, Emitter},
    syntax_pos::Mark,
    SyntaxContext,
};
use abi_stable::{sabi_trait, std_types::RVec};
use anyhow::{Context, Error};
use serde::{de::DeserializeOwned, Serialize};
use std::any::type_name;

pub struct Runtime {
    inner: Box<dyn RuntimeImpl>,
}

#[sabi_trait]
pub(crate) trait RuntimeImpl {
    /// Emit a structured diagnostic.
    ///
    /// - `db`: Serialized version of Diagnostic which is serialized using
    ///   bincode.
    fn emit(&self, db: RVec<u8>);

    fn fresh_mark(&self, parent: Mark) -> Mark;

    fn parent_mark(&self, parent: Mark) -> Mark;

    fn is_mark_builtin(&self, mark: Mark) -> bool;

    fn set_mark_is_builtin(&self, mark: Mark, is_builtin: bool);

    fn is_mark_descendant_of(&self, mark: Mark, ancestor: Mark) -> bool;

    fn least_ancestor_of_marks(&self, a: Mark, b: Mark) -> Mark;

    fn apply_mark_to_syntax_context_internal(
        &self,
        ctxt: SyntaxContext,
        mark: Mark,
    ) -> SyntaxContext;

    fn remove_mark_of_syntax_context(&self, ctxt: &mut SyntaxContext) -> Mark;

    fn outer_mark_of_syntax_context(&self, ctxt: SyntaxContext) -> Mark;
}

#[cfg(feature = "plugin-mode")]
scoped_tls::scoped_thread_local!(
    pub(crate) static RT: Box<dyn RuntimeImpl>
);

#[cfg(feature = "plugin-mode")]
struct PluginEmitter;

#[cfg(feature = "plugin-mode")]
impl Emitter for PluginEmitter {
    fn emit(&mut self, db: &DiagnosticBuilder<'_>) {
        let bytes: RVec<_> = serialize_for_plugin(&db.diagnostic).unwrap().into();

        RT.with(|rt| rt.emit(bytes))
    }
}

#[cfg(feature = "plugin-mode")]
pub fn with_runtime<F>(rt: &Runtime, op: F)
where
    F: FnOnce(),
{
    use crate::errors::{Handler, HANDLER};

    let handler = Handler::with_emitter(true, false, Box::new(PluginEmitter));
    RT.set(&rt.inner, || {
        // We proxy error reporting to the core runtime.
        HANDLER.set(&handler, || op())
    })
}

pub fn serialize_for_plugin<T>(t: &T) -> Result<Vec<u8>, Error>
where
    T: Serialize,
{
    bincode::serialize(&t)
        .with_context(|| format!("failed to serialize `{}` using bincode", type_name::<T>()))
}

pub fn deserialize_for_plugin<T>(bytes: &[u8]) -> Result<Vec<u8>, Error>
where
    T: DeserializeOwned,
{
    bincode::deserialize(bytes)
        .with_context(|| format!("failed to deserialize `{}` using bincode", type_name::<T>()))
}
