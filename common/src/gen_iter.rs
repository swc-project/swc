use std::ops::{Generator, GeneratorState};

struct GenIter<G: Generator<Return = ()>>(G);
impl<G> Iterator for GenIter<G>
where
    G: Generator<Return = ()>,
{
    type Item = G::Yield;
    #[inline]
    fn next(&mut self) -> Option<Self::Item> {
        match self.0.resume() {
            GeneratorState::Yielded(item) => Some(item),
            GeneratorState::Complete(()) => None,
        }
    }
}

/// Creates a new iterator from `gen`.
pub const fn gen_iter<G>(gen: G) -> impl Iterator<Item = G::Yield>
where
    G: Generator<Return = ()>,
{
    GenIter(gen)
}
