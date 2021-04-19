use swc_babel_visit::{VisitMut, VisitMutWith};
use swc_babel_ast::*;

struct Normalizer;

impl VisitMut for Normalizer {
    // ------------------------------------------------------------------------
    // class
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

    // ------------------------------------------------------------------------
    // decl
    fn visit_mut_variable_declarator(&mut self, node: &mut VariableDeclarator) {
        if node.definite == None {
            node.definite = Some(false);
        }
        node.visit_mut_children_with(self);
    }

    fn visit_mut_variable_declaration(&mut self, node: &mut VariableDeclaration) {
        if node.declare == None {
            node.declare = Some(false);
        }
        node.visit_mut_children_with(self);
    }

    // ------------------------------------------------------------------------
    // ident
    fn visit_mut_identifier(&mut self, node: &mut Identifier) {
        if node.optional == None {
            node.optional = Some(false);
        }
        if node.decorators == None {
            node.decorators = Some(vec![]);
        }
        node.visit_mut_children_with(self);
    }
}

pub fn normalize(ast: &mut File) {
    let mut normalizer = Normalizer {};
    ast.visit_mut_with(&mut normalizer);
}

