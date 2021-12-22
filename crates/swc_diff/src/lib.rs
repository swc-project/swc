pub use self::ctx::{Ctx, PathComponent};
use std::fmt::Debug;
use swc_common::Span;

#[macro_use]
mod macros;
mod ctx;
mod js_ast;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Config {
    /// If this value is true, the differences of [Span]s are ignored.
    ///
    /// Defaults to false.
    pub ignore_span: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Node(String);

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Difference {
    pub path: Vec<PathComponent>,
    pub left: Node,
    pub right: Node,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum DiffResult {
    /// Two nodes are identical.
    Identical,

    Different(Difference),

    Multiple(Vec<DiffResult>),
}

impl From<Difference> for DiffResult {
    fn from(v: Difference) -> Self {
        DiffResult::Different(v)
    }
}

#[auto_impl::auto_impl(Box)]
pub trait Diff: Debug {
    /// This may remove common node from `self` and `other`.
    fn diff(&mut self, other: &mut Self, ctx: &mut Ctx) -> DiffResult;
}

impl Diff for Span {
    fn diff(&mut self, other: &mut Self, ctx: &mut Ctx) -> DiffResult {
        if *self == *other {
            return DiffResult::Identical;
        }

        if ctx.config.ignore_span {
            return DiffResult::Identical;
        }

        DiffResult::Different(Difference {
            path: ctx.path.clone(),
            left: Node(format!("{:?}", self)),
            right: Node(format!("{:?}", other)),
        })
    }
}

impl<T> Diff for Vec<T>
where
    T: Diff,
{
    fn diff(&mut self, other: &mut Self, ctx: &mut Ctx) -> DiffResult {
        let mut results = Vec::new();

        if self.len() != other.len() {
            results.push(DiffResult::Different(Difference {
                path: ctx.path.clone(),
                left: Node(format!("len = {}", self.len())),
                right: Node(format!("len = {}", other.len())),
            }));
        }

        let mut l = self.iter_mut();
        let mut r = other.iter_mut();
        let mut idx = 0;

        while let (Some(l), Some(r)) = (l.next(), r.next()) {
            let mut ctx = ctx.clone();
            ctx.path.push(PathComponent::VecElem { index: idx });
            idx += 1;

            let diff = l.diff(&mut r, &mut ctx);

            if matches!(diff, DiffResult::Identical) {
                continue;
            }

            results.push(diff);
        }

        // TODO: Dump extra nodes

        if results.is_empty() {
            return DiffResult::Identical;
        }

        DiffResult::Multiple(results)
    }
}

impl<T> Diff for Option<T>
where
    T: Diff,
{
    fn diff(&mut self, other: &mut Self, ctx: &mut Ctx) -> DiffResult {
        match (self, other) {
            (Some(l), Some(r)) => l.diff(&mut r, ctx),
            (None, None) => DiffResult::Identical,
            (None, Some(r)) => DiffResult::Different(Difference {
                path: ctx.path.clone(),
                left: Node("None".into()),
                right: Node(format!("{:?}", r)),
            }),
            (Some(l), None) => DiffResult::Different(Difference {
                path: ctx.path.clone(),
                left: Node(format!("{:?}", l)),
                right: Node("None".into()),
            }),
        }
    }
}

macro_rules! trivial {
    ($T:ty) => {
        impl Diff for $T {
            fn diff(&mut self, other: &mut Self, ctx: &mut Ctx) -> DiffResult {
                if *self == *other {
                    return DiffResult::Identical;
                }

                DiffResult::Different(Difference {
                    path: ctx.path.clone(),
                    left: Node(format!("{:?}", self)),
                    right: Node(format!("{:?}", other)),
                })
            }
        }
    };

    (
        $T:ty, $($tt:tt)*
    ) => {
        trivial!($T);
        trivial!($($tt)*);
    };
}

trivial!(bool, (), char);
trivial!(usize, u8, u16, u32, u64, u128);
trivial!(isize, i8, i16, i32, i64, i128);
trivial!(f32, f64);
