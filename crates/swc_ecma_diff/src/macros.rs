macro_rules! trivial {
    ($T:ty) => {
        impl crate::Diff for $T {
            fn diff(&mut self, other: &mut Self, ctx: &mut crate::Ctx) -> crate::DiffResult {
                if *self == *other {
                    return crate::DiffResult::Identical;
                }

                crate::DiffResult::Different(crate::Difference {
                    path: ctx.path.clone(),
                    left: crate::Node(format!("{:?}", self)),
                    right: crate::Node(format!("{:?}", other)),
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

macro_rules! diff_struct {
    (
        $T:ident,
        [
            $($field:ident),*
        ]
    ) => {
        impl crate::Diff for $T {
            fn diff(&mut self, other: &mut Self, ctx: &mut crate::Ctx) -> crate::DiffResult {
                // Ensure that we diff all fields.
                #[allow(unused)]
                fn _assert_all_fields(_node: &$T){
                    let $T {
                        $($field,)*
                    } = _node;
                }

                if *self == *other {
                    return crate::DiffResult::Identical;
                }

                ctx.diff_struct(stringify!($T), |ctx| {

                    $(
                        ctx.field(stringify!($field), &mut self.$field, &mut other.$field);
                    )*
                })
            }
        }
    };
}

macro_rules! diff_enum {
    (
        $T:ident,
        [
            $($Variant:ident),*
        ]
    ) => {
        impl crate::Diff for $T {
            fn diff(&mut self, other: &mut Self, ctx: &mut crate::Ctx) -> crate::DiffResult {
                // Ensure that we handle all variants.
                fn _assert_all_variants(_node: &$T){
                    match _node {
                        $(
                            $T::$Variant(..) => {},
                        )*
                    }
                }

                match (&mut *self, &mut * other) {
                    $(
                        (
                            $T::$Variant(l),
                            $T::$Variant(r),
                        ) => crate::Diff::diff(l,r,ctx),
                    )*
                    _ => crate::DiffResult::Different(crate::Difference {
                        path: ctx.path.clone(),
                        left: crate::Node(format!("{:?}", self)),
                        right: crate::Node(format!("{:?}", other)),
                    }),
                }
            }
        }
    };
}

macro_rules! diff_string_enum {
    ($T:ty) => {
        trivial!($T);
    };
}
