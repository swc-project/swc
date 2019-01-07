use ast::*;
use swc_common::Fold;

/// Strips type annotatiobs out.
pub fn strip() -> impl Fold<Module> {
    Strip
}

struct Strip;

macro_rules! to_none {
    ($T:ty) => {
        impl Fold<Option<$T>> for Strip {
            fn fold(&mut self, _: Option<$T>) -> Option<$T> {
                None
            }
        }
    };
    ($T:ty,) => {
        to_none!($T);
    };
    ($T:ty, $($rest:tt)+) => {
        to_none!($T);
        to_none!($($rest)*);
    };
}

to_none!(
    Accessibility,
    TsType,
    TsTypeAnn,
    TsTypeParamDecl,
    TsTypeParamInstantiation
);
