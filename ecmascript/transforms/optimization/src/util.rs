use std::sync::Arc;

#[cfg(feature = "concurrent")]
pub(crate) type Readonly<T> = Arc<T>;

#[cfg(not(feature = "concurrent"))]
pub(crate) type Readonly<T> = T;
