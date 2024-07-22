pub use self::{kind::Kind, token::Token};

mod byte_handlers;
mod kind;
mod token;

/// Call a closure while hinting to compiler that this branch is rarely taken.
/// "Cold trampoline function", suggested in:
/// <https://users.rust-lang.org/t/is-cold-the-only-reliable-way-to-hint-to-branch-predictor/106509/2>
#[cold]
pub fn cold_branch<F: FnOnce() -> T, T>(f: F) -> T {
    f()
}
