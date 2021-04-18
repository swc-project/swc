use swc_babel_visit::{VisitMut, VisitMutWith};
use swc_babel_ast::{VariableDeclarator, VariableDeclaration, File};

pub struct VariableDeclaratorNormalizer;

impl VisitMut for VariableDeclaratorNormalizer {
    fn visit_mut_variable_declarator(&mut self, node: &mut VariableDeclarator) {
        if node.definite == None {
            node.definite = Some(false);
        }
    }
}

pub fn normalize_variable_declarators(ast: &mut File) {
    let mut normalizer = VariableDeclaratorNormalizer {};
    ast.visit_mut_with(&mut normalizer);
}

pub struct VariableDeclarationNormalizer;

impl VisitMut for VariableDeclarationNormalizer {
    fn visit_mut_variable_declaration(&mut self, node: &mut VariableDeclaration) {
        if node.declare == None {
            node.declare = Some(false);
        }
    }
}

pub fn normalize_variable_declarations(ast: &mut File) {
    let mut normalizer = VariableDeclarationNormalizer {};
    ast.visit_mut_with(&mut normalizer);
}

