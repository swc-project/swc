use swc_common::Mark;

#[derive(Debug, Clone, Copy)]
pub(crate) struct Marks {
    /// [Mark] applied to non-top level varaibles which is injected while
    /// inlining.
    ///
    /// In other words, AST nodes marked with this mark will not be treated as a
    /// top level item, even if it's in the top level scope.
    pub(crate) non_top_level: Mark,

    /// Treat this function as a top level module.
    ///
    /// If this mark is applied, the function will be treated as a black box. It
    /// will not be analyzed by usage analyzer.
    ///
    /// # Note
    ///
    /// Standalone functions should not depend on any other declarations in the
    /// outer scope.
    ///
    /// This is only applied to [swc_ecma_ast::Function] and it should not be
    /// nested.
    pub(crate) standalone: Mark,

    /// Optimization is finished. This mark is only applied if both of the
    /// stateful optimizer and the pure optimizer cannot optimize anymore.
    pub(crate) done: Mark,

    ///  `/** @const */`.
    pub(crate) const_ann: Mark,

    /// Check for `/*#__NOINLINE__*/`
    pub(crate) noinline: Mark,

    /// Check for `/*#__PURE__*/`
    pub(crate) pure: Mark,
}

impl Marks {
    pub fn new() -> Marks {
        fn m() -> Mark {
            Mark::fresh(Mark::root())
        }

        Marks {
            non_top_level: m(),
            standalone: m(),
            done: m(),
            const_ann: m(),
            noinline: m(),
            pure: m(),
        }
    }
}
