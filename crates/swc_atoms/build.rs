use std::{env, path::Path};

#[cfg(all(feature = "rkyv-impl", feature = "rkyv-bytecheck-impl"))]
compile_error!("Cannot enable bytechcked, non-bytechecked rkyv both");

fn main() {
    let strs = include_str!("words.txt")
        .lines()
        .map(|l| l.trim())
        .collect::<Vec<_>>();
    gen("js_word", "JsWord", &strs);
}

fn gen(mac_name: &str, type_name: &str, atoms: &[&str]) {
    string_cache_codegen::AtomType::new(type_name, &format!("{}!", mac_name))
        .atoms(atoms)
        .write_to_file(&Path::new(&env::var("OUT_DIR").unwrap()).join(format!("{}.rs", mac_name)))
        .unwrap();
}
