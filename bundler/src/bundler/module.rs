use super::{export::Exports, helpers::Helpers};
use crate::id::{Id, ModuleId};
use is_macro::Is;
use swc_common::{sync::Lrc, Mark, SourceFile};
use swc_ecma_ast::{Module, Str};

/// Module after applying transformations.
#[derive(Debug, Clone)]
pub(super) struct TransformedModule {
    pub id: ModuleId,
    pub fm: Lrc<SourceFile>,
    pub module: Lrc<Module>,
    pub imports: Lrc<Imports>,
    pub exports: Lrc<Exports>,

    /// If false, the module will be wrapped with a small helper function.
    pub is_es6: bool,

    /// Used helpers
    pub helpers: Lrc<Helpers>,

    mark: Mark,
}

impl TransformedModule {
    /// Marks applied to bindings
    pub fn mark(&self) -> Mark {
        self.mark
    }
}

#[derive(Debug, Default)]
pub(super) struct Imports {
    /// If imported ids are empty, it is a side-effect import.
    pub specifiers: Vec<(Source, Vec<Specifier>)>,
}

/// Clone is relatively cheap
#[derive(Debug, Clone, Is)]
pub(super) enum Specifier {
    Specific { local: Id, alias: Option<Id> },
    Namespace { local: Id },
}

impl Specifier {
    pub fn local(&self) -> &Id {
        match self {
            Specifier::Specific { local, .. } => local,
            Specifier::Namespace { local, .. } => local,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub(super) struct Source {
    pub is_loaded_synchronously: bool,
    pub is_unconditional: bool,

    pub module_id: ModuleId,
    // Clone is relatively cheap, thanks to string_cache.
    pub src: Str,
}
