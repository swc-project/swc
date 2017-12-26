#![feature(specialization, proc_macro)]

extern crate swc_common;
extern crate swc_macros;
use swc_common::compat::{CanIUse, Feature, UsedFeatures};
use swc_macros::ast_node;

#[ast_node]
#[caniuse = "es6-class"]
struct Class {
    s: String,
    #[caniuse = "async-functions"]
    is_async: bool,
}

#[ast_node]
enum Enum {
    #[caniuse = "es6-class"]
    Class {
        #[caniuse = "async-functions"]
        is_async: bool,
    },
}

fn collect<T: CanIUse>(t: T) -> Vec<&'static str> {
    let mut buf = UsedFeatures::default();
    t.report_used_features(&mut buf);
    buf.finalize().into_iter().map(Feature::as_str).collect()
}

#[test]
fn derive_for_struct() {
    assert_eq!(
        collect(Class {
            s: "".into(),
            is_async: false,
        }),
        vec!["es6-class"]
    );
    assert_eq!(
        collect(Class {
            s: "".into(),
            is_async: true,
        }),
        vec!["es6-class", "async-functions"]
    );
}

#[test]
fn derive_for_enum() {
    assert_eq!(collect(Enum::Class { is_async: false }), vec!["es6-class"]);
    assert_eq!(
        collect(Enum::Class { is_async: true }),
        vec!["es6-class", "async-functions"]
    );
}
