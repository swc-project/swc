use super::{Fold, FoldWith, Visit, VisitWith};
use syntax::util::move_map::MoveMap;

#[macro_export]
macro_rules! chain {
    ($a:expr, $b:expr) => {{
        use $crate::fold::and_then::AndThen;

        AndThen {
            first: $a,
            second: $b,
        }
    }};

    ($a:expr, $b:expr,) => {
        chain!($a, $b)
    };

    ($a:expr, $b:expr,  $($rest:tt)+) => {{
        use $crate::fold::and_then::AndThen;

        AndThen{
            first: $a,
            second: chain!($b, $($rest)*),
        }
    }};
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct AndThen<A, B> {
    pub first: A,
    pub second: B,
}

// fn type_name<T>() -> String {
//     format!("{}", unsafe { std::intrinsics::type_name::<T>() })
// }

impl<T, A, B> Fold<T> for AndThen<A, B>
where
    T: FoldWith<Self>,
    A: Fold<T>,
    B: Fold<T>,
{
    #[inline(always)]
    default fn fold(&mut self, node: T) -> T {
        // println!(
        //     "Default<{}, {}>({})",
        //     type_name::<A>(),
        //     type_name::<B>(),
        //     type_name::<T>()
        // );
        let node = self.first.fold(node);
        self.second.fold(node)
    }
}

impl<T, A, B> Fold<Box<T>> for AndThen<A, B>
where
    Box<T>: FoldWith<Self>,
    Self: Fold<T>,
    A: Fold<T>,
    B: Fold<T>,
{
    #[inline(always)]
    fn fold(&mut self, node: Box<T>) -> Box<T> {
        // println!("Box.({})", type_name::<T>());
        box self.second.fold(self.first.fold(*node))
    }
}

impl<T, A, B> Fold<Vec<T>> for AndThen<A, B>
where
    Vec<T>: FoldWith<Self>,
    Self: Fold<T>,
    A: Fold<T>,
    B: Fold<T>,
{
    #[inline(always)]
    fn fold(&mut self, node: Vec<T>) -> Vec<T> {
        // println!("Vec.({})", type_name::<T>());
        node.move_map(|node| self.fold(node))
    }
}

impl<T, A, B> Visit<T> for AndThen<A, B>
where
    T: VisitWith<Self>,
    A: Visit<T>,
    B: Visit<T>,
{
    #[inline]
    fn visit(&mut self, node: &T) {
        self.first.visit(node);
        self.second.visit(node);
    }
}
