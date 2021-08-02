use swc_common::Mark;

#[derive(Debug, Clone, Copy)]
pub(crate) struct Marks {
    /// [Mark] applied to non-top level varaibles which is injected while
    /// inlining.
    pub(crate) non_top_level: Mark,

    /// Optimization is finished. This mark is only applied if both of the
    /// stateful optimizer and the pure optimizer cannot optimize anymore.
    pub(crate) done: Mark,

    /// Temporary mark, used to mark nodes which cannot be optimized by the pure
    /// optimizer.
    ///
    /// The stateful optimizer removes this mark if it modified the node, so
    /// that the pure optimizer can try again to optimize the node.
    pub(crate) pure_done: Mark,
}

impl Marks {
    pub fn new() -> Marks {
        fn m() -> Mark {
            Mark::fresh(Mark::root())
        }

        Marks {
            non_top_level: m(),
            done: m(),
            pure_done: m(),
        }
    }
}
