extern crate string_cache_codegen;

use std::env;
use std::path::Path;

fn main() {
    gen(
        "js_word",
        "JsWord",
        &[
            // keywords
            "await",
            "break",
            "case",
            "catch",
            "class",
            "const",
            "continue",
            "debugger",
            "default",
            "delete",
            "do",
            "else",
            "export",
            "extends",
            "finally",
            "for",
            "function",
            "if",
            "import",
            "in",
            "instanceof",
            "new",
            "return",
            "super",
            "switch",
            "this",
            "throw",
            "try",
            "typeof",
            "var",
            "void",
            "while",
            "with",
            "yield",
            // reserved word on strict mode.
            "let",
            "static",
            "null",
            "true",
            "false",
            // not keywords, just for pattern matching
            "from",
            "static",
            "of",
            "set",
            "get",
            "target",
            "await",
            "async",
            "as",
            // future reserved words?
            "enum",
            "implements",
            "interface",
            "package",
            "private",
            "protected",
            "public",
        ],
    );
}

fn gen(mac_name: &str, type_name: &str, atoms: &[&str]) {
    string_cache_codegen::AtomType::new(type_name, &format!("{}!", mac_name))
        .atoms(atoms)
        .write_to_file(&Path::new(&env::var("OUT_DIR").unwrap()).join(format!("{}.rs", mac_name)))
        .unwrap();
}
