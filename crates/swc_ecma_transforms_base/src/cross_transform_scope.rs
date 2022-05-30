//! Scope used to relay information from the TypeScript pass to the module pass.
//! I do not know if this is the correct place to put this.
//! It needs a better name.  "cross" because it "crosses" / spans all the way
//! from typescript to module passes.

#![allow(unused)]

#[derive(Default)]
pub struct Scope {
    pub has_require_call: bool,
}
