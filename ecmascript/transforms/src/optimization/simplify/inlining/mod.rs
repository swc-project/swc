use crate::pass::Pass;

pub fn inlining() -> impl Pass + 'static {
    Inlining
}

struct Inlining {}
