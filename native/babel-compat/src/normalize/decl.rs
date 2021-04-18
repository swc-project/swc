use swc_babel_visit::{VisitMut, VisitMutWith};
use swc_babel_ast::{VariableDeclarator, VariableDeclaration, File};

pub struct VariableDeclaratorNormalizer;

impl VisitMut for VariableDeclaratorNormalizer {
    fn visit_mut_variable_declarator(&mut self, var_decl: &mut VariableDeclarator) {
        if var_decl.definite == None {
            var_decl.definite = Some(false);
        }
    }
}

pub fn normalize_variable_declarators(ast: &mut File) {
    let mut normalizer = VariableDeclaratorNormalizer {};
    ast.visit_mut_with(&mut normalizer);
}

pub struct VariableDeclarationNormalizer;

impl VisitMut for VariableDeclarationNormalizer {
    fn visit_mut_variable_declaration(&mut self, var_decl: &mut VariableDeclaration) {
        if var_decl.declare == None {
            var_decl.declare = Some(false);
        }
    }
}

pub fn normalize_variable_declarations(ast: &mut File) {
    let mut normalizer = VariableDeclarationNormalizer {};
    ast.visit_mut_with(&mut normalizer);
}

