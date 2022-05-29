#[cfg(target_arch = "wasm32")]
pub use self::wasm::*;

mod napi;
mod subprocess;
#[cfg(target_arch = "wasm32")]
mod wasm;
