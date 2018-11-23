extern crate neon_build;

fn main() {
    // println!("cargo:libdir={}", "/usr/local/opt/node@10/lib");
    // println!("cargo:include={}", "/usr/local/opt/node@10/include");

    neon_build::setup(); // must be called in build.rs
}
