use swc_atoms::js_word;
use swc_babel_ast::*;
use swc_babel_visit::{VisitMut, VisitMutWith};

struct Normalizer;

// NOTE: When adding a visitor function, don't forget to add
// ```
// node.visit_mut_children_with(self);
// ```
// at the end! Failing to do so breaks the walk chain and other functions never
// get called.
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
        node.visit_mut_children_with(self);
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
        if node.is_abstract == None {
            node.is_abstract = Some(false);
        }
        if node.decorators == None {
            node.decorators = Some(vec![]);
        }
        node.visit_mut_children_with(self);
    }

    fn visit_mut_class_property(&mut self, node: &mut ClassProperty) {
        if node.readonly == None {
            node.readonly = Some(false);
        }
        if node.optional == None {
            node.optional = Some(false);
        }
        if node.definite == None {
            node.definite = Some(false);
        }
        if node.declare == None {
            node.declare = Some(false);
        }
        if node.is_abstract == None {
            node.is_abstract = Some(false);
        }
        if node.decorators == None {
            node.decorators = Some(vec![]);
        }
        node.visit_mut_children_with(self);
    }

    // ------------------------------------------------------------------------
    // common
    fn visit_mut_rest_element(&mut self, node: &mut RestElement) {
        if node.decorators == None {
            node.decorators = Some(vec![]);
        }
        node.visit_mut_children_with(self);
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
    // expr
    fn visit_mut_class_expression(&mut self, node: &mut ClassExpression) {
        if node.decorators == None {
            node.decorators = Some(vec![]);
        }
        if node.implements == None {
            node.implements = Some(vec![]);
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

    // ------------------------------------------------------------------------
    // jsx
    fn visit_mut_jsx_element(&mut self, node: &mut JSXElement) {
        // From what I can tell, babel just ignores this field, whereas swc sets it,
        // causing the trees to diverge. So we just normalize it to always None to
        // match babel.
        node.self_closing = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_jsx_text(&mut self, node: &mut JSXText) {
        if node.value.trim().is_empty() {
            node.value = js_word!("");
        }
        node.visit_mut_children_with(self);
    }

    // ------------------------------------------------------------------------
    // pat
    fn visit_mut_assignment_pattern(&mut self, node: &mut AssignmentPattern) {
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
