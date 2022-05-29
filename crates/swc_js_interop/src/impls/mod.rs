#[cfg(feature = "napi_rt")]
pub use self::napi::*;
#[cfg(not(feature = "napi_rt"))]
pub use self::subprocess::*;
#[cfg(target_arch = "wasm32")]
pub use self::wasm::*;

#[cfg(feature = "napi_rt")]
mod napi;
#[cfg(not(feature = "napi_rt"))]
mod subprocess;
#[cfg(target_arch = "wasm32")]
mod wasm;
