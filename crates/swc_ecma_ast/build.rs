#[cfg(all(feature = "rkyv-impl", feature = "rkyv-bytecheck-impl"))]
compile_error!("Cannot enable bytechcked, non-bytechecked rkyv both");

fn main() {}
