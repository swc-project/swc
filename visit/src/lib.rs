pub use either::Either;
pub use swc_visit_macros::define;

pub mod util;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Optional<V> {
    pub enabled: bool,
    pub visitor: V,
}

impl<V> Optional<V> {
    pub fn new(visitor: V, enabled: bool) -> Self {
        Self { enabled, visitor }
    }
}

pub trait Repeated {
    /// Should run again?
    fn changed(&self) -> bool;

    /// Reset.
    fn reset(&mut self);
}

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct AndThen<A, B> {
    pub first: A,
    pub second: B,
}

#[macro_export]
macro_rules! chain {
    ($a:expr, $b:expr) => {{
        use $crate::AndThen;

        AndThen {
            first: $a,
            second: $b,
        }
    }};

    ($a:expr, $b:expr,) => {
        chain!($a, $b)
    };

    ($a:expr, $b:expr,  $($rest:tt)+) => {{
        use $crate::AndThen;

        AndThen{
            first: $a,
            second: chain!($b, $($rest)*),
        }
    }};
}

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct Repeat<V>
where
    V: Repeated,
{
    pub pass: V,
}

impl<V> Repeat<V>
where
    V: Repeated,
{
    pub fn new(pass: V) -> Self {
        Self { pass }
    }
}

impl<V> Repeated for Repeat<V>
where
    V: Repeated,
{
    fn changed(&self) -> bool {
        self.pass.changed()
    }

    fn reset(&mut self) {
        self.pass.reset()
    }
}

impl<A, B> Repeated for AndThen<A, B>
where
    A: Repeated,
    B: Repeated,
{
    fn changed(&self) -> bool {
        self.first.changed() || self.second.changed()
    }

    fn reset(&mut self) {
        self.first.reset();
        self.second.reset();
    }
}
