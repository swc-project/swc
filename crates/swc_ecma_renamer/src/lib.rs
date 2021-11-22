use auto_impl::auto_impl;
use swc_atoms::JsWord;
use swc_common::SyntaxContext;

pub mod hygiene;
pub mod minify;
mod scope;
mod types;

/// ECMAScript identifier renamer.
///
///
/// See https://github.com/swc-project/swc/issues/2831 for motivation.
#[auto_impl(&, Box, Rc, Arc)]
pub trait Rename {
    /// Implementor should not remove content from the passed string.
    fn rename_ident(&self, sym: &JsWord, ctxt: SyntaxContext, write_to: &mut String);
}
