use std::{
    env,
    fs::File,
    io::{BufWriter, Write},
    path::Path,
};

extern crate napi_build;

#[cfg(all(not(feature = "swc_v1"), not(feature = "swc_v2")))]
compile_error!("Please enable swc_v1 or swc_v2 feature");

#[cfg(all(feature = "swc_v1", feature = "swc_v2"))]
compile_error!("Features swc_v1 and swc_v2 are incompatible");

#[cfg(all(not(feature = "api_v1"), not(feature = "api_v2")))]
compile_error!("Please enable api_v1 or api_v2 feature");

#[cfg(all(feature = "api_v1", feature = "api_v2"))]
compile_error!("Features api_v1 and api_v2 are incompatible");

fn main() {
    let out_dir = env::var("OUT_DIR").expect("Outdir should exist");
    let dest_path = Path::new(&out_dir).join("triple.txt");
    let mut f =
        BufWriter::new(File::create(dest_path).expect("Failed to create target triple text"));
    write!(
        f,
        "{}",
        env::var("TARGET").expect("Target should be specified")
    )
    .expect("Failed to write target triple text");

    napi_build::setup();
}
