extern crate napi_build;

#[cfg(all(not(feature = "swc_v1"), not(feature = "swc_v2")))]
compile_error!("Please enable swc_v1 or swc_v2 feature");

#[cfg(all(feature = "swc_v1", feature = "swc_v2"))]
compile_error!("Features swc_v1 and swc_v2 are incompatible");

fn main() {
    napi_build::setup();
}
