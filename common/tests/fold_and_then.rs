#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(specialization)]
#![feature(test)]
#![cfg(feature = "fold")]

use std::{cell::RefCell, rc::Rc};
use swc_common::{chain, Fold, FoldWith};

struct Named(&'static str, Rc<RefCell<Vec<(&'static str, String)>>>);
impl Fold<String> for Named {
    fn fold(&mut self, v: String) -> String {
        let name = self.0;
        self.1.borrow_mut().push((name, v.clone()));

        v
    }
}

#[derive(Fold)]
struct Nested<T>(#[fold(bound)] T);

#[test]
fn vec_order() {
    let logger = Rc::new(RefCell::default());

    vec![
        box String::from("foo"),
        box String::from("bar"),
        box String::from("baz"),
    ]
    .into_iter()
    .map(Box::new)
    .map(Nested)
    .map(Box::new)
    .map(Nested)
    .map(Nested)
    .collect::<Vec<_>>()
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
