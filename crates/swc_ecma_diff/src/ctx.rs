use crate::{Config, Diff, DiffResult};
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
    StructProp { key: JsWord },
    VecElem { index: usize },
}

impl Ctx {
    pub fn new(config: Config) -> Self {
        Ctx {
            path: Default::default(),
            config,
        }
    }

    pub(crate) fn diff_struct<F>(&mut self, _name: &str, f: F) -> DiffResult
    where
        F: FnOnce(&mut StructDiffCtx),
    {
        let mut helper = StructDiffCtx {
            parent: self,
            results: Default::default(),
        };
        f(&mut helper);

        if helper.results.is_empty() {
            return DiffResult::Identical;
        }

        DiffResult::Multiple(helper.results)
    }
}

pub(crate) struct StructDiffCtx<'a> {
    parent: &'a mut Ctx,
    results: Vec<DiffResult>,
}

impl StructDiffCtx<'_> {
    pub fn field<T>(&mut self, field_name: &str, l: &mut T, r: &mut T)
    where
        T: Diff,
    {
        let mut ctx = self.parent.clone();
        ctx.path.push(PathComponent::StructProp {
            key: field_name.into(),
        });

        let diff = l.diff(r, &mut ctx);

        if matches!(diff, DiffResult::Identical) {
            return;
        }

        self.results.push(diff);
    }
}

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

        Some((item, ctx))
    }
}
