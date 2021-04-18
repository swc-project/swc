pub mod decl;
pub mod ident;

use swc_babel_ast::File;

pub fn normalize(ast: &mut File) {
    decl::normalize_variable_declarators(ast);
    decl::normalize_variable_declarations(ast);
    ident::normalize_identifiers(ast);
}

