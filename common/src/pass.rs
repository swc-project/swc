#[cfg(feature = "fold")]
use crate::{Fold, FoldWith};
use serde::export::PhantomData;
use std::borrow::Cow;

pub trait CompilerPass {
    /// Name should follow hyphen-case
    ///
    /// TODO: timing
    fn name() -> Cow<'static, str>;
}

#[derive(Debug, Copy, Clone)]
pub struct Repeat<P> {
    pass: P,
}

impl<P> Repeat<P> {
    pub fn new(pass: P) -> Self {
        Self { pass }
    }
}

impl<P, At> CompilerPass for Repeat<P, At>
where
    P: RepeatedPass<At>,
{
    fn name() -> Cow<'static, str> {
        format!("Repeat({})", P::name()).into()
    }
}

impl<P, At> Repeated for Repeat<P, At>
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
