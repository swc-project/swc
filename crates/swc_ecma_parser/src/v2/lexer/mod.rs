//! Lots of codes are copied from oxc. https://github.com/oxc-project/oxc/blob/21c7b090dd61e6944356d3de9164395c9f7c10fb/crates/oxc_parser/

pub use self::{kind::Kind, token::Token};

mod byte_handlers;
mod kind;
mod search;
mod token;

/// Call a closure while hinting to compiler that this branch is rarely taken.
/// "Cold trampoline function", suggested in:
/// <https://users.rust-lang.org/t/is-cold-the-only-reliable-way-to-hint-to-branch-predictor/106509/2>
#[cold]
pub fn cold_branch<F: FnOnce() -> T, T>(f: F) -> T {
    f()
}
