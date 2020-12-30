use std::collections::HashSet;
use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;
use swc_ecma_utils::Id;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::VisitWith;

use crate::util::base54::base54;

#[derive(Debug, Default)]
pub struct NameExpanderOptions {
    pub reserved: HashSet<String>,
}

impl NameExpanderOptions {
    fn unmangleable(&self, name: &str) -> bool {}
}

pub fn name_expander(options: NameExpanderOptions) -> impl VisitMut {
    Expander {
        count: 0,
        avoided_names: Default::default(),
        options,
        in_pat_of_var_decl: false,
    }
}

type Names = HashSet<String>;

#[derive(Debug)]
struct Expander {
    count: usize,
    avoided_names: Names,
    options: NameExpanderOptions,
    in_pat_of_var_decl: bool,
}

impl Expander {
    fn should_avoid(&self, name: &str) -> bool {
        // TODO: RESERVED_WORDS
        if self.options.reserved.contains(name) {
            return true;
        }
        if self.avoided_names.contains(name) {
            return true;
        }

        false
    }

    fn next_name(&mut self) -> JsWord {
        loop {
            let name = self.count;
            self.count += 1;
            let name = base54(name);
            if !self.should_avoid(&name) {
                return name.into();
            }
        }
    }
}

impl VisitMut for Expander {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, m: &mut Module) {
        // TODO: this.globals.each(rename);
        let colliding_names = find_colliding_names(&m, &self.options);

        m.visit_mut_children_with(self);
    }

    fn visit_mut_var_declarator(&mut self, var: &mut VarDeclarator) {
        let old = self.in_pat_of_var_decl;
        self.in_pat_of_var_decl = true;
        var.name.visit_mut_with(self);
        self.in_pat_of_var_decl = old;

        var.init.visit_mut_children_with(self);
    }

    fn visit_mut_pat(&mut self, pat: &mut Pat) {
        if self.in_pat_of_var_decl {
            match pat {
                Pat::Ident(i) => {
                    // if (def.global && options.cache) return;
                    if self.options.unmangleable(&i.sym) {
                        return;
                    }
                    if self.options.reserved.contains(&*i.sym) {
                        return;
                    }
                    // var redef = def.redefined();
                    // var name = redef ? redef.rename || redef.name :
                    // next_name(); def.rename = name;
                    // def.forEach(function(sym) {
                    //     if (sym.definition() === def) sym.name = name;
                    // });
                }
                _ => {}
            }
        }

        pat.visit_mut_children_with(self);
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);
        if n.computed {
            n.prop.visit_mut_with(self);
        }
    }
}

fn find_colliding_names(m: &Module, options: &NameExpanderOptions) -> Names {
    let mut v = CollisionFinder {
        names: Default::default(),
        options,
    };
    m.visit_with(&Invalid { span: DUMMY_SP }, &mut v);

    v.names
}

#[derive(Debug)]
struct CollisionFinder<'a> {
    names: Names,
    options: &'a NameExpanderOptions,
}

/// TODO: this.globals.each(add_def);
impl Visit for CollisionFinder<'_> {
    noop_visit_type!();

    fn visit_var_declarator(&mut self, n: &VarDeclarator, _: &dyn Node) {
        let ids: Vec<Id> = find_ids(&n.name);

        for id in ids {
            // We will mangle this id, so don't add it to avoid list.
            if !self.options.unmangleable(&id.0) {
                continue;
            }

            self.names.insert(id.0.to_string());
        }

        n.init.visit_with(&Invalid { span: DUMMY_SP }, self);
    }

    fn visit_member_expr(&mut self, n: &MemberExpr, _: &dyn Node) {
        n.obj.visit_with(&Invalid { span: DUMMY_SP }, self);
        if n.computed {
            n.prop.visit_with(&Invalid { span: DUMMY_SP }, self);
        }
    }
}
