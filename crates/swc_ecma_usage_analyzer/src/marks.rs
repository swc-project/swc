#![allow(dead_code)]

use swc_common::{Mark, SyntaxContext};

#[derive(Debug, Clone, Copy)]
pub struct Marks {
    ///  `/** @const */`.
    pub const_ann: Mark,

    /// Check for `/*#__NOINLINE__*/`
    pub noinline: Mark,

    /// Check for `/*#__PURE__*/`
    pub pure: Mark,

    /// This is applied to [swc_ecma_ast::BlockStmt] which is injected to
    /// preserve the side effects.
    pub fake_block: Mark,

    pub top_level_ctxt: SyntaxContext,

    pub unresolved_mark: Mark,
}

impl Marks {
    #[allow(clippy::new_without_default)]
    pub fn new() -> Self {
        fn m() -> Mark {
            Mark::new()
        }

        Marks {
            const_ann: m(),
            noinline: m(),
            pure: m(),
            fake_block: m(),
            top_level_ctxt: SyntaxContext::empty().apply_mark(m()),
            unresolved_mark: m(),
        }
    }
}
