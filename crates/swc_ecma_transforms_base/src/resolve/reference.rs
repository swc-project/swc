use swc_common::NodeId;

#[derive(Debug, Default)]
pub(super) struct ReferenceMap {
    node: Vec<NodeId>,
    kind: Vec<RefTo>,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub(super) enum RefTo {
    Itself,
    Binding,
    Unresolved,
}

impl ReferenceMap {
    #[track_caller]
    pub(super) fn add_binding(&mut self, id: NodeId) {
        debug_assert!(
            self.node.len() == id.as_u32() as usize,
            "len: {}, id: {}",
            self.node.len(),
            id.as_u32()
        );
        debug_assert!(self.node.len() == self.kind.len());
        self.node.push(id);
        self.kind.push(RefTo::Itself);
    }

    #[track_caller]
    pub(super) fn add_reference(&mut self, from: NodeId, to: NodeId) {
        debug_assert!(self.node.len() == from.as_u32() as usize);
        debug_assert!(self.node.len() == self.kind.len());
        debug_assert!(from != to);
        self.node.push(to);
        self.kind.push(RefTo::Binding);
    }

    #[track_caller]
    pub(super) fn add_unresolved_reference(&mut self, from: NodeId, unresolved: NodeId) {
        debug_assert!(self.node.len() == from.as_u32() as usize);
        debug_assert!(self.node.len() == self.kind.len());
        self.node.push(unresolved);
        self.kind.push(RefTo::Unresolved);
    }

    #[track_caller]
    pub(super) fn get_binding_kind(&self, id: NodeId) -> RefTo {
        debug_assert!(
            (id.as_u32() as usize) < self.node.len(),
            "id: {id:#?}, self.node.len(): {}",
            self.node.len()
        );
        debug_assert!(self.node.len() == self.kind.len());
        unsafe { *self.kind.get_unchecked(id.as_u32() as usize) }
    }

    #[track_caller]
    pub(super) fn get_binding_node(&self, id: NodeId) -> NodeId {
        debug_assert!(
            (id.as_u32() as usize) < self.node.len(),
            "id: {id:#?}, self.node.len(): {}",
            self.node.len()
        );
        debug_assert!(self.node.len() == self.kind.len());
        unsafe { *self.node.get_unchecked(id.as_u32() as usize) }
    }
}
