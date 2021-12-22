macro_rules! diff_enum {
    (
        $T:ident,
        [
            $($Variant:ident),*
        ]
    ) => {
        impl crate::Diff for $T {
            fn diff(&mut self, other: &mut Self, ctx: &mut crate::Ctx) -> crate::DiffResult {
                match (self, other) {
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
