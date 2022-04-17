use std::ops::Deref;

#[cfg(feature = "concurrent")]
pub(crate) type Readonly<T> = std::sync::Arc<T>;

#[cfg(not(feature = "concurrent"))]
#[derive(Default)]
pub(crate) struct Readonly<T>(T);

#[cfg(not(feature = "concurrent"))]
impl<T> Deref for Readonly<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[cfg(not(feature = "concurrent"))]
impl<T> From<T> for Readonly<T> {
    fn from(v: T) -> Self {
        Self(v)
    }
}
