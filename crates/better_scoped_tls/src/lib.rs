//! Better scoped thread local storage.

#[doc(hidden)]
pub extern crate scoped_tls;

/// See [scoped_tls::scoped_thread_local] for actual documentation.
///
/// This is noop on release builds.
#[macro_export]
macro_rules! scoped_tls_with_good_error {
    ($(#[$attrs:meta])* $vis:vis static $name:ident: $ty:ty) => {
        $crate::scoped_tls::scoped_thread_local!(
            static INNER: $ty
        );


        $(#[$attrs])*
        $vis static $name: $crate::ScopedKey<$ty> = $crate::ScopedKey {
            inner: &INNER,
            #[cfg(debug_assertions)]
            module_path: module_path!(),
        };
    };
}

/// Wrapper for [scoped_tls::ScopedKey] with better error messages.
pub struct ScopedKey<T>
where
    T: 'static,
{
    #[doc(hidden)]
    pub inner: &'static scoped_tls::ScopedKey<T>,

    #[cfg(debug_assertions)]
    #[doc(hidden)]
    pub module_path: &'static str,
}

impl<T> ScopedKey<T>
where
    T: 'static,
{
    /// See [scoped_tls::ScopedKey] for actual documentation.
    pub fn set<F, R>(&'static self, t: &T, f: F) -> R
    where
        F: FnOnce() -> R,
    {
        self.inner.set(t, f)
    }

    /// See [scoped_tls::ScopedKey] for actual documentation.
    pub fn with<F, R>(&'static self, f: F) -> R
    where
        F: FnOnce(&T) -> R,
    {
        #[cfg(debug_assertions)]
        if !self.inner.is_set() {
            // Override panic message
            panic!("Module path: {}", self.module_path)
        }

        self.inner.with(f)
    }

    /// See [scoped_tls::ScopedKey] for actual documentation.
    pub fn is_set(&'static self) -> bool {
        self.inner.is_set()
    }
}

#[cfg(test)]
mod tests {

    scoped_tls_with_good_error!(
        pub static TESTTLS: String
    );

    #[cfg(debug_assertions)]
    #[test]
    #[should_panic = "You need to call set on tests::TESTTLS first"]

    fn panic_on_with() {}
}
