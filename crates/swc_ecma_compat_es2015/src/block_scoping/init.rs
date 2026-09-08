use rustc_hash::{FxHashMap, FxHashSet};
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::rename::rename;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitMutWith, VisitWith};

/// The first iteration copies `let` bindings after evaluating every
/// initializer. Closures created in the initializer must keep the original
/// bindings, including when they mutate them after the loop has started.
pub(super) fn separate_initializer_bindings(node: &mut ForStmt, lexical_vars: &mut [Id]) {
    let Some(VarDeclOrExpr::VarDecl(decl)) = &mut node.init else {
        return;
    };
    // Unlike `let`, `const` does not create per-iteration bindings in a for loop.
    if decl.kind != VarDeclKind::Let {
        return;
    }

    let mut finder = InitializerCaptures {
        lexical_vars: lexical_vars.iter().cloned().collect(),
        captured: Default::default(),
        in_closure: false,
    };
    decl.visit_with(&mut finder);
    let captured = finder.captured;
    if captured.is_empty() {
        return;
    }

    let mut replacements = FxHashMap::default();
    for id in lexical_vars {
        if !captured.contains(id) {
            continue;
        }

        let iteration = private_ident!(format!("_{}", id.0));
        decl.decls.push(VarDeclarator {
            span: DUMMY_SP,
            name: iteration.clone().into(),
            init: Some(Ident::new(id.0.clone(), DUMMY_SP, id.1).into()),
            definite: false,
        });
        replacements.insert(id.clone(), iteration.to_id());
        *id = iteration.to_id();
    }

    let mut renamer = rename(&replacements);
    node.test.visit_mut_with(&mut renamer);
    node.update.visit_mut_with(&mut renamer);
    node.body.visit_mut_with(&mut renamer);
}

struct InitializerCaptures {
    lexical_vars: FxHashSet<Id>,
    captured: FxHashSet<Id>,
    in_closure: bool,
}

impl InitializerCaptures {
    fn visit_closure<N: VisitWith<Self>>(&mut self, node: &N) {
        let old = self.in_closure;
        self.in_closure = true;
        node.visit_children_with(self);
        self.in_closure = old;
    }

    fn visit_field_initializer(&mut self, value: &Option<Box<Expr>>, is_static: bool) {
        let old = self.in_closure;
        // Instance fields run on construction, after the loop initializer has
        // finished. Static fields run immediately, like computed property keys.
        self.in_closure |= !is_static;
        value.visit_with(self);
        self.in_closure = old;
    }
}

impl Visit for InitializerCaptures {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_ident(&mut self, ident: &Ident) {
        if self.in_closure && self.lexical_vars.contains(&ident.to_id()) {
            self.captured.insert(ident.to_id());
        }
    }

    fn visit_arrow_expr(&mut self, node: &ArrowExpr) {
        self.visit_closure(node);
    }

    fn visit_function(&mut self, node: &Function) {
        self.visit_closure(node);
    }

    fn visit_constructor(&mut self, node: &Constructor) {
        self.visit_closure(node);
    }

    fn visit_getter_prop(&mut self, node: &GetterProp) {
        self.visit_closure(node);
    }

    fn visit_setter_prop(&mut self, node: &SetterProp) {
        self.visit_closure(node);
    }

    fn visit_class_prop(&mut self, node: &ClassProp) {
        node.key.visit_with(self);
        node.decorators.visit_with(self);
        self.visit_field_initializer(&node.value, node.is_static);
    }

    fn visit_private_prop(&mut self, node: &PrivateProp) {
        node.decorators.visit_with(self);
        self.visit_field_initializer(&node.value, node.is_static);
    }

    fn visit_auto_accessor(&mut self, node: &AutoAccessor) {
        node.key.visit_with(self);
        node.decorators.visit_with(self);
        self.visit_field_initializer(&node.value, node.is_static);
    }
}
