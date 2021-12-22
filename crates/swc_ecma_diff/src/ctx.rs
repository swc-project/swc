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
    StructProp { struct_name: JsWord, key: JsWord },
    VecElem { l: usize, r: usize },
}

impl Ctx {
    pub fn new(config: Config) -> Self {
        Ctx {
            path: Default::default(),
            config,
        }
    }

    pub(crate) fn diff_struct<F>(&mut self, struct_name: &str, f: F) -> DiffResult
    where
        F: FnOnce(&mut StructDiffCtx),
    {
        let mut helper = StructDiffCtx {
            parent: self,
            results: Default::default(),
            struct_name: struct_name.into(),
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
    struct_name: JsWord,
}

impl StructDiffCtx<'_> {
    pub fn field<T>(&mut self, field_name: &str, l: &mut T, r: &mut T)
    where
        T: Diff,
    {
        let mut ctx = self.parent.clone();
        ctx.path.push(PathComponent::StructProp {
            struct_name: self.struct_name.clone(),
            key: field_name.into(),
        });

        let diff = l.diff(r, &mut ctx);

        if matches!(diff, DiffResult::Identical) {
            return;
        }

        self.results.push(diff);
    }
}
