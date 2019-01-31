#[macro_export]
macro_rules! chain_at {
    ($T:ty, $a:expr, $b:expr) => {{
        use $crate::pass::JoinedPass;

        JoinedPass {
            first: $a,
            second: $b,
            ty: ::std::marker::PhantomData::<$T>,
        }
    }};

    ($T:ty, $a:expr, $b:expr,) => {
        chain_at!($T, $a, $b)
    };

    ($T: ty, $a:expr, $b:expr,  $($rest:tt)+) => {{
        use $crate::pass::JoinedPass;

        JoinedPass {
            first: $a,
            second: chain_at!($T, $b, $($rest)*),
            ty: ::std::marker::PhantomData::<$T>,
        }
    }};
}

macro_rules! pass_clone {
    ($T:tt) => {
        impl crate::pass::New for $T {
            fn new(&self, _: ::std::sync::Arc<crate::helpers::Helpers>) -> Self {
                self.clone()
            }
        }
    };
}

macro_rules! pass_from {
    ($T:ty, $op:expr) => {
        impl crate::pass::New for $T {
            fn new(&self, helpers: ::std::sync::Arc<crate::helpers::Helpers>) -> Self {
                $op(helpers)
            }
        }
    };
}
