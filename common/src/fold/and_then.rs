use super::{Fold, FoldWith, Visit, VisitWith};

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

impl<T, A, B> Fold<T> for AndThen<A, B>
where
    T: FoldWith<Self>,
    A: Fold<T>,
    B: Fold<T>,
{
    #[inline]
    default fn fold(&mut self, node: T) -> T {
        let node = self.first.fold(node);
        self.second.fold(node)
    }
}

impl<T, A, B> Fold<Box<T>> for AndThen<A, B>
where
    Box<T>: FoldWith<Self>,
    A: Fold<T>,
    B: Fold<T>,
{
    fn fold(&mut self, node: Box<T>) -> Box<T> {
        let node = self.first.fold(*node);
        box self.second.fold(node)
    }
}

impl<T, A, B> Fold<Vec<T>> for AndThen<A, B>
where
    Vec<T>: FoldWith<Self>,
    A: Fold<T>,
    B: Fold<T>,
{
    fn fold(&mut self, nodes: Vec<T>) -> Vec<T> {
        nodes
            .into_iter()
            .map(|node| {
                let node = self.first.fold(node);
                self.second.fold(node)
            })
            .collect()
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

#[cfg(test)]
mod test {
    use super::{super::Fold, AndThen};

    struct A;
    struct B;
    struct Stopper;
    impl Fold<Vec<String>> for Stopper {
        fn fold(&mut self, vs: Vec<String>) -> Vec<String> {
            println!("Stopper.fold: {:?}", vs);
            vs
        }
    }

    /// This test requires uncommenting println!s above.
    #[test]
    fn optimization_vec() {
        chain!(A, B, chain!(A, B, B)).fold(vec![
            String::from("1"),
            String::from("2"),
            String::from("3"),
        ]);
    }
    /// This test requires uncommenting println!s above.

    #[test]
    fn deoptimization_vec() {
        chain!(A, B, Stopper, chain!(Stopper, B)).fold(vec![
            String::from("1"),
            String::from("2"),
            String::from("3"),
        ]);
    }

    #[test]
    fn optimization_box() {
        chain!(A, B, B).fold(box String::from("foo"));
    }

}
