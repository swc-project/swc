#![feature(specialization)]

extern crate serde;
extern crate swc_common;
use swc_common::{Fold, FoldWith, VisitWith};
struct MyFold;

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct PanicOnFold;
impl<F> FoldWith<F> for PanicOnFold {
    fn fold_children(self, _: &mut F) -> Self {
        unreachable!("this should not be called")
    }
}
impl<F> VisitWith<F> for PanicOnFold {
    fn visit_children(&self, _: &mut F) {
        unreachable!("this should not be called")
    }
}

#[test]
fn ignore_struct_named_field() {
    #[derive(Fold, Debug, Default, PartialEq)]
    struct Foo {
        #[fold(ignore)]
        named: PanicOnFold,
    }
    Foo::default().fold_with(&mut MyFold);
    Foo::default().visit_with(&mut MyFold);
}

#[test]
fn ignore_struct_unnamed_field() {
    #[derive(Fold, Debug, Default, PartialEq)]
    struct Bar(#[fold(ignore)] PanicOnFold);
    Bar::default().fold_with(&mut MyFold);
    Bar::default().visit_with(&mut MyFold);
}

#[test]
fn ignore_enum_unnamed_field() {
    #[derive(Fold, Debug, PartialEq)]
    enum A {
        Field(#[fold(ignore)] PanicOnFold),
    }

    A::Field(Default::default()).fold_with(&mut MyFold);
    A::Field(Default::default()).visit_with(&mut MyFold);
}

#[test]
fn ignore_enum_named_field() {
    #[derive(Fold, Debug, PartialEq)]
    enum A {
        Field {
            #[fold(ignore)]
            named: PanicOnFold,
        },
    }

    A::Field {
        named: Default::default(),
    }
    .fold_with(&mut MyFold);
    A::Field {
        named: Default::default(),
    }
    .visit_with(&mut MyFold);
}
