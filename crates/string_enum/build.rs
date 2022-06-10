extern crate napi_build;

fn main() {
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("android") {
        napi_build::setup();
    }
}
