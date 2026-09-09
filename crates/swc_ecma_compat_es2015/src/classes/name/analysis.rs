use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

/// Analyze an assignment subtree once, naming its nested anonymous assignments
/// at the same time. Those names prevent subsequent class visits from scanning
/// the nested subtrees again. Counters also handle nested assignments to the
/// same binding without walking a stack of enclosing candidates per reference.
pub(in super::super) fn prepare(assignment: &mut AssignExpr, preserve: &mut FxHashSet<Id>) {
    assignment.visit_mut_with(&mut Analysis {
        references: Default::default(),
        names: Default::default(),
        evals: 0,
        preserve,
    });
}

struct Analysis<'a> {
    references: FxHashMap<Id, usize>,
    names: FxHashMap<Atom, usize>,
    evals: usize,
    preserve: &'a mut FxHashSet<Id>,
}

impl VisitMut for Analysis<'_> {
    noop_visit_mut_type!();

    fn visit_mut_assign_expr(&mut self, assignment: &mut AssignExpr) {
        if !matches!(assignment.op, op!("=") | op!("||=") | op!("??=")) {
            assignment.visit_mut_children_with(self);
            return;
        }
        let (AssignTarget::Simple(SimpleAssignTarget::Ident(binding)), Expr::Class(class)) =
            (&mut assignment.left, &mut *assignment.right)
        else {
            assignment.visit_mut_children_with(self);
            return;
        };
        if class.ident.is_some() {
            assignment.visit_mut_children_with(self);
            return;
        }

        binding.visit_mut_with(self);

        let id = binding.to_id();
        let previous_refs = self.references.get(&id).copied();
        let previous_names = self.names.get(&binding.sym).copied();
        let start = *self.references.entry(id.clone()).or_default();
        self.names.entry(binding.sym.clone()).or_default();

        let mut constructor_conflict = false;
        class.class.super_class.visit_mut_with(self);
        class.class.decorators.visit_mut_with(self);
        for member in &mut class.class.body {
            let name_start = self.names[&binding.sym];
            let eval_start = self.evals;
            member.visit_mut_with(self);
            if matches!(member, ClassMember::Constructor(_)) {
                constructor_conflict =
                    self.names[&binding.sym] != name_start || self.evals != eval_start;
            }
        }

        let name = Ident::from(&*binding).into_private();
        if class.class.super_class.is_none()
            && self.references[&id] != start
            && !constructor_conflict
        {
            self.preserve.insert(name.to_id());
        }
        // Do not count the inferred name as a source binding in an enclosing
        // constructor. It did not exist until this analysis introduced it.
        class.ident = Some(name);
        if previous_refs.is_none() {
            self.references.remove(&id);
        }
        if previous_names.is_none() {
            self.names.remove(&binding.sym);
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        if let Expr::Ident(ident) = expr {
            if let Some(count) = self.references.get_mut(&ident.to_id()) {
                *count += 1;
            }
        }
        expr.visit_mut_children_with(self);
    }

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        if let Some(count) = self.names.get_mut(&ident.sym) {
            *count += 1;
        }
        if ident.sym == "eval" {
            self.evals += 1;
        }
    }
}
