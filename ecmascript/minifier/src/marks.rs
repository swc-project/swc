use swc_common::Mark;

#[derive(Debug, Clone, Copy)]
pub(crate) struct Marks {
    /// [Mark] applied to non-top level varaibles which is injected while
    /// inlining.
    pub(crate) non_top_level: Mark,
}

impl Marks {
    pub fn new() -> Marks {
        fn m() -> Mark {
            Mark::fresh(Mark::root())
        }

        Marks { non_top_level: m() }
    }
}
