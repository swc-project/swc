use fxhash::FxHashMap;
use swc_common::{FoldWith, DUMMY_SP};
use swc_ecma_ast::{ComputedPropName, Expr, PropName};

/// **Note**: this struct ignores span of key.
#[derive(Debug)]
pub struct PropertyMap<V> {
    inner: FxHashMap<PropName, V>,
}

impl<V> Default for PropertyMap<V> {
    fn default() -> Self {
        Self {
            inner: Default::default(),
        }
    }
}

impl<V> PropertyMap<V> {
    pub fn get(&self, expr: &Expr) -> Option<&V> {
        let expr = PropName::Computed(ComputedPropName {
            span: DUMMY_SP,
            expr: box expr.clone().fold_with(&mut super::SpanRemover),
        });

        self.inner.get(&expr)
    }

    pub fn get_prop_name(&self, p: &PropName) -> Option<&V> {
        let expr = p.clone().fold_with(&mut super::SpanRemover);

        self.inner.get(&expr)
    }

    pub fn insert(&mut self, key: PropName, v: V) {
        let key = key.fold_with(&mut super::SpanRemover);
        self.inner.insert(key, v);
    }
}
