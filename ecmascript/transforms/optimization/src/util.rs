#[cfg(feature = "concurrent")]
pub(crate) type Readonly<T> = std::sync::Arc<T>;

#[cfg(not(feature = "concurrent"))]
pub(crate) type Readonly<T> = T;
