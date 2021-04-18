pub mod class;
pub mod decl;
pub mod ident;

use swc_babel_ast::File;

pub fn normalize(ast: &mut File) {
    class::normalize_class_declaration(ast);
    class::normalize_class_method(ast);
    decl::normalize_variable_declarators(ast);
    decl::normalize_variable_declarations(ast);
    ident::normalize_identifiers(ast);
}

