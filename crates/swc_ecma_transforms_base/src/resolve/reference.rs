use swc_common::NodeId;

#[derive(Debug, Default)]
pub(super) struct ReferenceMap(Vec<RefTo>);

#[derive(Debug, Clone, Copy, PartialEq)]
pub(super) enum RefTo {
    Itself,
    Binding(NodeId),
    Unresolved(NodeId),
}

impl ReferenceMap {
    #[track_caller]
    pub(super) fn add_binding(&mut self, id: NodeId) {
        debug_assert!(
            self.0.len() == id.as_u32() as usize,
            "len: {}, id: {}",
            self.0.len(),
            id.as_u32()
        );
        self.0.push(RefTo::Itself);
    }

    #[track_caller]
    pub(super) fn add_reference(&mut self, from: NodeId, to: NodeId) {
        debug_assert!(self.0.len() == from.as_u32() as usize);
        debug_assert!(from != to);
        self.0.push(RefTo::Binding(to));
    }

    #[track_caller]
    pub(super) fn add_unresolved_reference(&mut self, from: NodeId, unresolved: NodeId) {
        debug_assert!(self.0.len() == from.as_u32() as usize);
        self.0.push(RefTo::Unresolved(unresolved));
    }

    #[track_caller]
    pub(super) fn get_binding(&self, id: NodeId) -> RefTo {
        debug_assert!(
            (id.as_u32() as usize) < self.0.len(),
            "id: {id:#?}, self.0.len(): {}",
            self.0.len()
        );
        unsafe { *self.0.get_unchecked(id.as_u32() as usize) }
    }
}
