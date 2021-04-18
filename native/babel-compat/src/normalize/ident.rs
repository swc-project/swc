use swc_babel_visit::{VisitMut, VisitMutWith};
use swc_babel_ast::{Identifier, File};

pub struct IdentifierNormalizer;

impl VisitMut for IdentifierNormalizer {
    fn visit_mut_identifier(&mut self, id: &mut Identifier) {
        if id.optional == None {
            id.optional = Some(false);
        }
    }
}

pub fn normalize_identifiers(ast: &mut File) {
    let mut normalizer = IdentifierNormalizer {};
    ast.visit_mut_with(&mut normalizer);
}

