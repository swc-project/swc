use crate::id::Id;
use crate::id::ModuleId;
use is_macro::Is;
use swc_common::SyntaxContext;
use swc_ecma_ast::Str;

/// Clone is relatively cheap
#[derive(Debug, Clone, Is)]
pub enum Specifier {
    Specific {
        local: Id,
        alias: Option<Id>,
    },
    Namespace {
        local: Id,
        /// True for `import * as foo from 'foo'; foo[computedKey()]`
        all: bool,
    },
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Source {
    pub is_loaded_synchronously: bool,
    pub is_unconditional: bool,

    pub module_id: ModuleId,
    pub local_ctxt: SyntaxContext,
    pub export_ctxt: SyntaxContext,

    // Clone is relatively cheap, thanks to string_cache.
    pub src: Str,
}
