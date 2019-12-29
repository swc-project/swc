use crate::pass::Pass;

pub fn regenerator() -> impl Pass {
    Regenerator::default()
}

#[derive(Debug, Default)]
struct Regenerator;
