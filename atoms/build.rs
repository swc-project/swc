extern crate string_cache_codegen;

use std::env;
use std::path::Path;

fn main() {
    gen(
        "js_ident",
        "JsIdent",
        &[
            "break",
            "case",
            "catch",
            "continue",
            "debugger",
            "default",
            "do",
            "else",
            "finally",
            "for",
            "function",
            "if",
            "return",
            "switch",
            "throw",
            "try",
            "var",
            "let",
            "const",
            "while",
            "with",
            "new",
            "this",
            "super",
            "class",
            "extends",
            "export",
            "import",
            "yield",
            "null",
            "true",
            "false",
            "in",
            "instanceof",
            "typeof",
            "void",
            "delete",
        ],
    );
}

fn gen(mac_name: &str, type_name: &str, atoms: &[&str]) {
    string_cache_codegen::AtomType::new(type_name, &format!("{}!", mac_name))
        .atoms(atoms)
        .write_to_file(&Path::new(&env::var("OUT_DIR").unwrap()).join(format!("{}.rs", mac_name)))
        .unwrap();
}
