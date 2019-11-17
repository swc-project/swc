use string_cache_codegen;

use std::{env, path::Path};

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
