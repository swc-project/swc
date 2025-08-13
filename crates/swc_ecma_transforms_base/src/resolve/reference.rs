use swc_common::NodeId;

#[derive(Debug, Default)]
pub(super) struct ReferenceMap(Vec<NodeId>);

impl ReferenceMap {
    pub(super) fn add_binding(&mut self, id: NodeId) {
        debug_assert!(self.0.len() == id.as_u32() as usize);
        self.0.push(id);
    }

    pub(super) fn add_reference(&mut self, from: NodeId, to: NodeId) {
        debug_assert!(self.0.len() == from.as_u32() as usize);
        self.0.push(to);
    }

    pub(super) fn get_binding(&self, id: NodeId) -> NodeId {
        debug_assert!(
            (id.as_u32() as usize) < self.0.len(),
            "id: {id:#?}, self.0.len(): {}",
            self.0.len()
        );
        unsafe { *self.0.get_unchecked(id.as_u32() as usize) }
    }
}
