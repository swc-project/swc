#[doc(hidden)]
pub extern crate tracing;

use tracing::{info, span::EnteredSpan};

/// Prints time elapsed since `start` when dropped.
///
/// See [timer] for usages.
pub struct Timer {
    #[cfg(not(target_arch = "wasm32"))]
    _span: EnteredSpan,
    #[cfg(not(target_arch = "wasm32"))]
    start: std::time::Instant,
}

impl Timer {
    /// Don't use this directly. Use [timer] instead.
    pub fn new(_span: EnteredSpan) -> Self {
        Self {
            #[cfg(not(target_arch = "wasm32"))]
            _span,
            #[cfg(not(target_arch = "wasm32"))]
            start: std::time::Instant::now(),
        }
    }
}

#[cfg(not(target_arch = "wasm32"))]
impl Drop for Timer {
    fn drop(&mut self) {
        let dur = self.start.elapsed();
        info!(kind = "perf", "Done in {:?}", dur);
    }
}

/// Creates a timer. For input arguments, see [tracing::span].
///
/// # Convention
///
/// The string passed to `timer!` should start with a verb.
///
/// # Example usage
///
/// ```
/// use swc_timer::timer;
/// # let _logger = testing::init();
/// let _timer = timer!("");
/// ```
///
/// ## With arguments
/// ```
/// use swc_timer::timer;
/// # let _logger = testing::init();
/// let arg = "path";
/// let _timer = timer!("bundle", path = arg);
/// ```
#[macro_export]
macro_rules! timer {
    ($($args:tt)*) => {{
        #[cfg(not(target_arch = "wasm32"))]
        let span = $crate::tracing::span!($crate::tracing::Level::INFO, $($args)*).entered();

        #[cfg(not(target_arch = "wasm32"))]
        $crate::Timer::new(span)
    }};
}
