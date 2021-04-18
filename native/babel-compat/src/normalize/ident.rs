use swc_babel_visit::{VisitMut, VisitMutWith};
use swc_babel_ast::{Identifier, File};

pub struct IdentifierNormalizer;

impl VisitMut for IdentifierNormalizer {
    fn visit_mut_identifier(&mut self, node: &mut Identifier) {
        if node.optional == None {
            node.optional = Some(false);
        }
        if node.decorators == None {
            node.decorators = Some(vec![]);
        }
    }
}

pub fn normalize_identifiers(ast: &mut File) {
    let mut normalizer = IdentifierNormalizer {};
    ast.visit_mut_with(&mut normalizer);
}

