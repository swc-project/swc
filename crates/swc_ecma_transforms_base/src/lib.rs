#![cfg_attr(test, deny(warnings))]
#![allow(clippy::mutable_key_type)]

use assumptions::Assumptions;
use swc_common::{comments::Comments, Mark};

pub use self::resolver::resolver;

#[doc(hidden)]
pub mod ext;
pub mod fixer;
#[macro_use]
pub mod hygiene;
pub mod assumptions;
pub mod feature;
pub mod helpers;
#[doc(hidden)]
pub mod native;
pub mod pass;
pub mod perf;
pub mod quote;
pub mod rename;
mod resolver;
pub mod scope;
#[cfg(test)]
mod tests;

/// Storage for common configurations like assumptions or comemnts.
///
/// This is used to reduce the number of breaking changes.
///
/// ## For transform authors
///
/// If you don't need extra field, **drop it from the construcctor function of
/// yout transform**.
///
/// ```ignore
/// 
///
/// pub fn bugfixes<C>(c: TransformContext<C>) -> impl Fold
/// where
///     C: Comments,
/// {
///     chain!(
///         async_arrows_in_class(c.unresolved_mark),
///         edge_default_param(),
///         template_literal_caching(),
///         safari_id_destructuring_collision_in_function_expression()
///     )
/// }
/// ```
#[derive(Debug, Clone, Copy)]
pub struct TransformContext<C>
where
    C: Comments,
{
    /// See [Assumptions]
    pub assumptions: Assumptions,

    /// Typically [swc_common::comments::SingleThreadedComments],
    /// [swc_common::comments::NoopComments], or `&dyn Comments`.
    pub comments: C,

    /// The [Mark] passed to [crate::resolver::resolver].
    pub unresolved_mark: Mark,
}
