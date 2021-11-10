#[allow(unused_macros)]
macro_rules! try_panic {
    ($e:expr) => {{
        $e.unwrap_or_else(|err| {
            panic!("{} failed with {}", stringify!($e), err);
        })
    }};
}
