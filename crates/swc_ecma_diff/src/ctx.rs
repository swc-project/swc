use crate::Config;
use swc_atoms::JsWord;

/// The context for [Diff]. This contains config and path.
///
/// This is very inefficient, but it's fine as this will be used only for
/// debugging tools. I don't want to bother with lifetimes.
#[derive(Debug, Clone)]
pub struct Ctx {
    pub(crate) path: Vec<PathComponent>,
    pub(crate) config: Config,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum PathComponent {
    Prop { key: JsWord },
    VecElem { index: usize },
}

impl Ctx {}

pub(crate) trait IterExt<T>: Sized + Iterator<Item = T> {
    fn with_ctx(self, parent: Ctx) -> IterWithCtx<Self> {
        IterWithCtx {
            iter: self,
            ctx: parent,
            idx: 0,
        }
    }
}

impl<I, T> IterExt<T> for I where Self: Iterator<Item = T> {}

pub(crate) struct IterWithCtx<I> {
    idx: usize,
    ctx: Ctx,
    iter: I,
}

impl<I> Iterator for IterWithCtx<I>
where
    I: Iterator,
{
    type Item = (I::Item, Ctx);

    fn next(&mut self) -> Option<Self::Item> {
        let item = self.iter.next()?;
        let mut ctx = self.ctx.clone();
        ctx.path.push(PathComponent::VecElem { index: self.idx });

        self.idx += 1;

        Some((item, self.ctx))
    }
}
