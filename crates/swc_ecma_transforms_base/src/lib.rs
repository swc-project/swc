#![cfg_attr(test, deny(warnings))]

pub use self::resolver::resolver;

#[doc(hidden)]
pub mod ext;
pub mod fixer;
#[macro_use]
pub mod hygiene;
pub mod assumptions;
pub mod helpers;
#[doc(hidden)]
pub mod native;
pub mod pass;
pub mod perf;
pub mod quote;
mod resolver;
pub mod scope;
#[cfg(test)]
mod tests;
