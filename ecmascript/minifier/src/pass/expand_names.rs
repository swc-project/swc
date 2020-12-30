use std::collections::HashSet;
use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::VisitWith;

#[derive(Debug, Default)]
pub struct NameExpanderOptions {
    pub reserved: HashSet<String>,
}

impl NameExpanderOptions {
    fn unmangleable(&self, name: &str) {}
}

pub fn name_expander(options: NameExpanderOptions) -> impl VisitMut {
    Expander {
        count: 0,
        avoided_names: Default::default(),
        options,
    }
}

type Names = HashSet<String>;

#[derive(Debug)]
struct Expander {
    count: usize,
    avoided_names: Names,
    options: NameExpanderOptions,
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
    fn visit_mut_module(&mut self, m: &mut Module) {
        // TODO: this.globals.each(rename);
        let colliding_names = find_colliding_names(&m, &self.options);

        m.visit_mut_children_with(self);
    }

    fn visit_mut_var_declarator(&mut self, var: &mut VarDeclarator) {
        // if (def.global && options.cache) return;
        // if (def.unmangleable(options)) return;
        // if (options.reserved.has[def.name]) return;
        // var redef = def.redefined();
        // var name = redef ? redef.rename || redef.name : next_name();
        // def.rename = name;
        // def.forEach(function(sym) {
        //     if (sym.definition() === def) sym.name = name;
        // });

        var.visit_mut_children_with(self);
    }
}

fn find_colliding_names(m: &Module, options: &NameExpanderOptions) -> Names {
    let mut v = CollisionFinder {
        names: Default::default(),
        options,
    };
    m.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
}

#[derive(Debug)]
struct CollisionFinder<'a> {
    names: Names,
    options: &'a NameExpanderOptions,
}

impl Visit for CollisionFinder<'_> {}

fn base54(i: usize) -> String {}
