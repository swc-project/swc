use rustc_hash::FxHashMap;
use swc_common::BytePos;

use super::token::TokenValue;

#[derive(Clone, Copy, Debug, Default)]
pub(crate) struct PayloadStoreCheckpoint {
    len: usize,
}

/// Stores token payloads outside the parser cursor so lookahead and TS
/// backtracking only need to restore byte positions and store lengths.
#[derive(Clone, Debug, Default)]
pub(crate) struct PayloadStore {
    order: Vec<BytePos>,
    values: FxHashMap<BytePos, TokenValue>,
}

impl PayloadStore {
    #[inline(always)]
    pub(crate) fn checkpoint_save(&self) -> PayloadStoreCheckpoint {
        PayloadStoreCheckpoint {
            len: self.order.len(),
        }
    }

    pub(crate) fn checkpoint_load(&mut self, checkpoint: PayloadStoreCheckpoint) {
        while self.order.len() > checkpoint.len {
            let key = self.order.pop().expect("payload checkpoint underflow");
            self.values.remove(&key);
        }
    }

    pub(crate) fn clear_at_or_after(&mut self, pos: BytePos) {
        while self.order.last().is_some_and(|last| *last >= pos) {
            let key = self.order.pop().expect("payload order should not be empty");
            self.values.remove(&key);
        }
    }

    #[inline(always)]
    pub(crate) fn insert(&mut self, pos: BytePos, value: TokenValue) {
        let replaced = self.values.insert(pos, value);
        if replaced.is_none() {
            self.order.push(pos);
        }
    }

    #[inline(always)]
    pub(crate) fn get(&self, pos: BytePos) -> Option<&TokenValue> {
        self.values.get(&pos)
    }
}
