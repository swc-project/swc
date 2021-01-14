use swc_common::pass::CompilerPass;
use swc_common::pass::Repeated;
use swc_ecma_ast::Module;
use swc_ecma_utils::Value;
use swc_ecma_visit::Fold;
use swc_ecma_visit::FoldWith;

pub(crate) mod base54;
pub(crate) mod usage;

pub trait ValueExt<T>: Into<Value<T>> {
    fn opt(self) -> Option<T> {
        match self.into() {
            Value::Known(v) => Some(v),
            _ => None,
        }
    }
}

impl<T> ValueExt<T> for Value<T> {}

/// TODO(kdy1): Modify swc_visit.
/// Actually we should implement `swc_visit::Repeated` for
/// `swc_visit::Optional`. But I'm too lazy to bump versions.
pub(crate) struct Optional<V> {
    pub enabled: bool,
    pub visitor: V,
}

impl<V> Repeated for Optional<V>
where
    V: Repeated,
{
    #[inline]
    fn changed(&self) -> bool {
        if self.enabled {
            return false;
        }

        self.visitor.changed()
    }

    #[inline]
    fn reset(&mut self) {
        if self.enabled {
            return;
        }

        self.visitor.reset()
    }
}

impl<V> CompilerPass for Optional<V>
where
    V: CompilerPass,
{
    fn name() -> std::borrow::Cow<'static, str> {
        V::name()
    }
}

impl<V> Fold for Optional<V>
where
    V: Fold,
{
    #[inline(always)]
    fn fold_module(&mut self, module: Module) -> Module {
        if !self.enabled {
            return module;
        }
        module.fold_with(&mut self.visitor)
    }
}
