pub use self::ctx::{Ctx, PathComponent};
use std::fmt::{self, Debug, Display, Formatter};
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

impl Display for Difference {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "Path: ")?;
        for c in &self.path {
            match c {
                PathComponent::StructProp { struct_name, key } => {
                    write!(
                        f,
                        "({struct_name}.{key})",
                        key = key,
                        struct_name = struct_name
                    )?;
                }
                PathComponent::VecElem { l, r, .. } => {
                    write!(f, "[{} <-> {}]", l, r)?;
                }
            }
        }
        writeln!(f)?;

        writeln!(f, "Left: {}", self.left.0)?;
        writeln!(f, "Right: {}", self.right.0)?;

        Ok(())
    }
}

impl Display for DiffResult {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match self {
            DiffResult::Identical => {}
            DiffResult::Different(d) => {
                writeln!(f, "{}", d)?;
            }
            DiffResult::Multiple(d) => {
                if d.len() == 1 {
                    for d in d {
                        write!(f, "{}", d)?;
                    }
                } else {
                    for d in d {
                        writeln!(f, "{}", d)?;
                    }
                }
            }
        }

        Ok(())
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

        let should_try_shifting = ctx.path.iter().all(|v| match v {
            PathComponent::VecElem { is_shifting, .. } => !*is_shifting,
            _ => true,
        });

        // If we are visiting this vector for the first time, we can shift indexes to
        // reduce output files.
        //
        // e.g.
        //
        // A:
        //
        // console.log('Foo')
        // console.log('Bar')
        // console.log('Baz')
        //
        //
        // B:
        //
        // console.log('Bar')
        // console.log('Baz')
        //
        //
        // We can remove two statements.
        if should_try_shifting {
            let mut l_removed = vec![];
            let mut r_removed = vec![];

            for (l_idx, l) in self.iter_mut().enumerate() {
                for (r_idx, r) in other.iter_mut().enumerate() {
                    let mut ctx = ctx.clone();
                    ctx.path.push(PathComponent::VecElem {
                        l: l_idx,
                        r: r_idx,
                        is_shifting: true,
                    });

                    let diff = l.diff(r, &mut ctx);

                    if matches!(diff, DiffResult::Identical) {
                        l_removed.push(l_idx);
                        r_removed.push(r_idx);
                        break;
                    }

                    results.push(diff);
                }
            }

            if !l_removed.is_empty() {
                let new_l = self
                    .drain(..)
                    .enumerate()
                    .filter(|(i, _)| !l_removed.contains(i))
                    .map(|(_, v)| v)
                    .collect::<Vec<_>>();

                *self = new_l;
            }

            if !r_removed.is_empty() {
                let new_r = other
                    .drain(..)
                    .enumerate()
                    .filter(|(i, _)| !r_removed.contains(i))
                    .map(|(_, v)| v)
                    .collect::<Vec<_>>();
                *other = new_r;
            }
        } else {
            let mut l = self.iter_mut();
            let mut r = other.iter_mut();
            let mut idx = 0;
            let mut removed = vec![];

            while let (Some(l), Some(r)) = (l.next(), r.next()) {
                let cur_idx = idx;
                idx += 1;

                let mut ctx = ctx.clone();
                ctx.path.push(PathComponent::VecElem {
                    l: cur_idx,
                    r: cur_idx,
                    is_shifting: false,
                });

                let diff = l.diff(r, &mut ctx);

                if matches!(diff, DiffResult::Identical) {
                    removed.push(cur_idx);
                    continue;
                }

                results.push(diff);
            }

            if !removed.is_empty() {
                let new_l = self
                    .drain(..)
                    .enumerate()
                    .filter(|(i, _)| !removed.contains(i))
                    .map(|(_, v)| v)
                    .collect::<Vec<_>>();
                let new_r = other
                    .drain(..)
                    .enumerate()
                    .filter(|(i, _)| !removed.contains(i))
                    .map(|(_, v)| v)
                    .collect::<Vec<_>>();

                *self = new_l;
                *other = new_r;
            }
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
        let result = match (&mut *self, &mut *other) {
            (Some(l), Some(r)) => l.diff(r, ctx),
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
        };

        if matches!(result, DiffResult::Identical) {
            // Remove common node.
            *self = None;
            *other = None;
            return result;
        }

        result
    }
}

trivial!(bool, (), char);
trivial!(usize, u8, u16, u32, u64, u128);
trivial!(isize, i8, i16, i32, i64, i128);
trivial!(f32, f64);
trivial!(String, str);
trivial!(num_bigint::BigInt);

impl<S> Diff for string_cache::Atom<S>
where
    S: string_cache::StaticAtomSet,
{
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
