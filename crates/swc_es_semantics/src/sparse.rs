use swc_es_ast::Id;

#[derive(Debug, Clone)]
struct Slot<V> {
    generation: u32,
    value: V,
}

/// Sparse id-indexed map with generation validation.
#[derive(Debug, Clone)]
pub(crate) struct SparseIdMap<T, V> {
    slots: Vec<Option<Slot<V>>>,
    _marker: std::marker::PhantomData<fn() -> T>,
}

impl<T, V> Default for SparseIdMap<T, V> {
    fn default() -> Self {
        Self {
            slots: Vec::new(),
            _marker: std::marker::PhantomData,
        }
    }
}

impl<T, V> SparseIdMap<T, V> {
    #[inline]
    pub(crate) fn insert(&mut self, id: Id<T>, value: V) -> Option<V> {
        let index = id.index() as usize;
        if index >= self.slots.len() {
            self.slots.resize_with(index + 1, || None);
        }

        let generation = id.generation();
        let slot = &mut self.slots[index];
        let prev = slot.take();
        *slot = Some(Slot { generation, value });

        prev.and_then(|prev| {
            if prev.generation == generation {
                Some(prev.value)
            } else {
                None
            }
        })
    }

    #[inline]
    pub(crate) fn get(&self, id: Id<T>) -> Option<&V> {
        let slot = self.slots.get(id.index() as usize)?.as_ref()?;
        if slot.generation != id.generation() {
            return None;
        }
        Some(&slot.value)
    }
}
