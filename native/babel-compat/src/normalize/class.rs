use swc_babel_visit::{VisitMut, VisitMutWith};
use swc_babel_ast::{ClassDeclaration, ClassMethod, File};

pub struct ClassDeclarationNormalizer;

impl VisitMut for ClassDeclarationNormalizer {
    fn visit_mut_class_declaration(&mut self, node: &mut ClassDeclaration) {
        if node.decorators == None {
            node.decorators = Some(vec![]);
        }
        if node.is_abstract == None {
            node.is_abstract = Some(false);
        }
        if node.declare == None {
            node.declare = Some(false);
        }
        if node.implements == None {
            node.implements = Some(vec![]);
        }
    }
}

pub fn normalize_class_declaration(ast: &mut File) {
    let mut normalizer = ClassDeclarationNormalizer {};
    ast.visit_mut_with(&mut normalizer);
}

pub struct ClassMethodNormalizer;

impl VisitMut for ClassMethodNormalizer {
    fn visit_mut_class_method(&mut self, node: &mut ClassMethod) {
        if node.computed == None {
            node.computed = Some(false);
        }
        if node.is_static == None {
            node.is_static = Some(false);
        }
        if node.generator == None {
            node.generator = Some(false);
        }
        if node.is_async == None {
            node.is_async = Some(false);
        }
        if node.optional == None {
            node.optional = Some(false);
        }
    }
}

pub fn normalize_class_method(ast: &mut File) {
    let mut normalizer = ClassMethodNormalizer {};
    ast.visit_mut_with(&mut normalizer);
}

