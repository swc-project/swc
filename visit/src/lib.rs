pub use either::Either;
pub use swc_visit_macros::define;

pub mod util;

/// Visit all children nodes. This converts `VisitAll` to `Visit`. The type
/// parameter `V` should implement `VisitAll` and `All<V>` implements `Visit`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct All<V> {
    pub visitor: V,
}

/// A visitor which visits node only if `enabled` is true.
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

/// Trait for a pass which is designed to invoked multiple time to same input.
///
/// See [Repeat].
pub trait Repeated {
    /// Should run again?
    fn changed(&self) -> bool;

    /// Reset.
    fn reset(&mut self);
}

/// A visitor which applies `A` and then `B`.
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct AndThen<A, B> {
    pub first: A,
    pub second: B,
}

/// Chains multiple visitor.
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

/// A visitor which applies `V` again and again if `V` modifies the node.
///
/// # Note
/// `V` should return `true` from `changed()` to make the pass run multiple
/// time.
///
/// See: [Repeated]
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
