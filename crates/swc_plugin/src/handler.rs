use swc_common::sync::OnceCell;

use crate::pseudo_scoped_key::PseudoScopedKey;

/// global context HANDLER in plugin's transform function.
pub static HANDLER: PseudoScopedKey = PseudoScopedKey {
    inner: OnceCell::new(),
};
