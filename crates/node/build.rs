extern crate napi_build;

#[cfg(all(not(feature = "swc_v1"), not(feature = "swc_v2")))]
compile_error!("Please enable swc_v1 or swc_v2 feature");

fn main() {
    napi_build::setup();
}
