use crate::{Fold, FoldWith};
use serde::export::PhantomData;

pub trait CompilerPass {
    // TODO: timing with
    //      fn name() -> Cow<'static, str>;
}

pub trait RepeatedPass<At>: CompilerPass {
    /// Should run again?
    fn changed(&self) -> bool;

    /// Reset.
    fn reset(&mut self);
}

#[derive(Debug, Copy, Clone)]
pub struct Repeat<P, At>
where
    P: RepeatedPass<At>,
{
    pass: P,
    at: PhantomData<At>,
}

impl<P, At> CompilerPass for Repeat<P, At> where P: RepeatedPass<At> {}

impl<P, At> RepeatedPass<At> for Repeat<P, At>
where
    P: RepeatedPass<At>,
{
    fn changed(&self) -> bool {
        self.pass.changed()
    }

    fn reset(&mut self) {
        self.pass.reset()
    }
}

#[cfg(feature = "fold")]
impl<P, At> Fold<At> for Repeat<P, At>
where
    At: FoldWith<Self> + FoldWith<P>,
    P: RepeatedPass<At>,
{
    fn fold(&mut self, mut node: At) -> At {
        loop {
            self.pass.reset();
            node = node.fold_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }

        node
    }
}
