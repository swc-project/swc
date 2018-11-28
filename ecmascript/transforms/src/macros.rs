macro_rules! prevent_recurse {
    ($TR:ty, $N:ty) => {
        prevent_recurse!(@IMPL, $TR, $N);
        prevent_recurse!(@IMPL, $TR, Vec<$N>);
        prevent_recurse!(@IMPL, $TR, Box<$N>);
    };

    (@IMPL, $TR:ty, $N:ty) => {
        impl ::swc_common::Fold<$N> for $TR {
            #[inline]
            fn fold(&mut self, node: $N) -> $N {
                node
            }
        }
    };
}
