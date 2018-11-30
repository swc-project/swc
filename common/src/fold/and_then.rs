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

fn type_name<T>() -> String {
    format!("{}", unsafe { std::intrinsics::type_name::<T>() })
}

impl<T, A, B> Fold<T> for AndThen<A, B>
where
    T: FoldWith<Self>,
    A: Fold<T>,
    B: Fold<T>,
{
    #[inline]
    fn fold(&mut self, node: T) -> T {
        println!("Folding {}", type_name::<T>());
        let node = self.first.fold(node);
        self.second.fold(node)
    }
}

// impl<T, A, B> Fold<Box<T>> for AndThen<A, B>
// where
//     Box<T>: FoldWith<Self>,
//     Self: Fold<T>,
// {
//     #[inline]
//     fn fold(&mut self, node: Box<T>) -> Box<T> {
//         println!("Folding box<{}>", type_name::<T>());

//         box self.fold(*node)
//     }
// }

// impl<T, A, B> Fold<Vec<T>> for AndThen<A, B>
// where
//     Vec<T>: FoldWith<Self>,
//     Self: Fold<T>,
//     A: Fold<T>,
//     B: Fold<T>,
// {
//     #[inline]
//     fn fold(&mut self, node: Vec<T>) -> Vec<T> {
//         println!("Folding vec<{}>", type_name::<T>());

//         node.into_iter().map(|node| self.fold(node)).collect()
//     }
// }

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
    use super::super::{Fold, FoldWith};
    use std::{cell::RefCell, rc::Rc};

    type Logger = Rc<RefCell<Vec<(&'static str, String)>>>;

    struct Named(&'static str, Logger);
    impl Fold<String> for Named {
        fn fold(&mut self, v: String) -> String {
            let name = self.0;
            self.1.borrow_mut().push((name, v.clone()));

            v
        }
    }

    /// This test requires uncommenting println!s above.
    // #[test]
    // fn optimization_vec() {
    //     chain!(A, B, chain!(A, B, B)).fold(vec![
    //         String::from("1"),
    //         String::from("2"),
    //         String::from("3"),
    //     ]);
    // }
    // /// This test requires uncommenting println!s above.

    // #[test]
    // fn deoptimization_vec() {
    //     chain!(A, B, Stopper, chain!(Stopper, B)).fold(vec![
    //         String::from("1"),
    //         String::from("2"),
    //         String::from("3"),
    //     ]);
    // }

    #[test]
    fn optimization_box() {
        let logger = Rc::new(RefCell::default());

        vec![
            box String::from("foo"),
            box String::from("bar"),
            box String::from("baz"),
        ]
        .fold_with(&mut chain!(
            Named("A", logger.clone()),
            Named("B", logger.clone()),
            Named("C", logger.clone())
        ));

        let result = Rc::try_unwrap(logger).unwrap();
        assert_eq!(
            vec![
                ("A", "foo"),
                ("B", "foo"),
                ("C", "foo"),
                ("A", "bar"),
                ("B", "bar"),
                ("C", "bar"),
                ("A", "baz"),
                ("B", "baz"),
                ("C", "baz"),
            ]
            .into_iter()
            .map(|(n, v)| (n, String::from(v)))
            .collect::<Vec<_>>(),
            result.into_inner()
        );
    }

}
