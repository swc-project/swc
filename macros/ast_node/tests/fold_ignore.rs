#![feature(specialization, proc_macro)]

extern crate swc_common;
extern crate swc_macros;
use swc_common::{Fold, FoldWith};
struct MyFolder;

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct PanicOnFold;
impl<F> FoldWith<F> for PanicOnFold {
    fn fold_children(self, _: &mut F) -> Self {
        unreachable!("this should not be called")
    }
}

#[test]
fn ignore_struct_named_field() {
    #[derive(Fold, Debug, Clone, Copy, Default, PartialEq, Eq)]
    struct Foo {
        #[fold(ignore)]
        pub named: PanicOnFold,
    }
    Foo::default().fold_with(&mut MyFolder);
}

#[test]
fn ignore_struct_unnamed_field() {
    #[derive(Fold, Debug, Clone, Copy, Default, PartialEq, Eq)]
    struct Bar(#[fold(ignore)] PanicOnFold);
    Bar::default().fold_with(&mut MyFolder);
}

#[test]
fn ignore_enum_unnamed_field() {
    #[derive(Fold, Debug, Clone, Copy, PartialEq, Eq)]
    enum A {
        Field(#[fold(ignore)] PanicOnFold),
    }

    A::Field(Default::default()).fold_with(&mut MyFolder);
}

#[test]
fn ignore_enum_named_field() {
    #[derive(Fold, Debug, Clone, Copy, PartialEq, Eq)]
    enum A {
        Field {
            #[fold(ignore)]
            named: PanicOnFold,
        },
    }

    A::Field {
        named: Default::default(),
    }.fold_with(&mut MyFolder);
}
