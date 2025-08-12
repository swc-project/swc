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
}
