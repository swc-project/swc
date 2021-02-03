use self::preserver::idents_to_preserve;
use super::compute_char_freq::CharFreqInfo;
use crate::analyzer::analyze;
use crate::analyzer::ProgramData;
use crate::option::MangleOptions;
use crate::util::base54::base54;
use fxhash::FxHashMap;
use fxhash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::Id;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

mod preserver;

pub fn name_mangler(options: MangleOptions, _char_freq_info: CharFreqInfo) -> impl VisitMut {
    Mangler {
        options,
        ..Default::default()
    }
}

#[derive(Debug, Default)]
struct Mangler {
    options: MangleOptions,
    n: usize,
    preserved: FxHashSet<Id>,
    preserved_symbols: FxHashSet<JsWord>,
    renamed: FxHashMap<Id, JsWord>,
    data: Option<ProgramData>,
}

impl Mangler {
    fn rename(&mut self, i: &mut Ident) {
        if self.preserved.contains(&i.to_id()) {
            return;
        }

        if let Some(var) = self.data.as_ref().unwrap().vars.get(&i.to_id()) {
            if !var.declared {
                return;
            }
        }

        i.span.ctxt = SyntaxContext::empty();
        if let Some(v) = self.renamed.get(&i.to_id()) {
            i.sym = v.clone();
            return;
        }

        loop {
            let sym: JsWord = base54(self.n).into();
            self.n += 1;
            if self.preserved_symbols.contains(&sym) {
                continue;
            }

            self.renamed.insert(i.to_id(), sym.clone());

            i.sym = sym.clone();
            break;
        }
    }
}

impl VisitMut for Mangler {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, n: &mut Module) {
        let data = analyze(&*n);
        self.data = Some(data);
        self.preserved = idents_to_preserve(self.options.clone(), n);
        self.preserved_symbols = self.preserved.iter().map(|v| v.0.clone()).collect();
        n.visit_mut_children_with(self);
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        let data = analyze(&*n);
        self.data = Some(data);
        self.preserved = idents_to_preserve(self.options.clone(), n);
        self.preserved_symbols = self.preserved.iter().map(|v| v.0.clone()).collect();
        n.visit_mut_children_with(self);
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        self.rename(&mut n.ident);

        n.class.visit_mut_with(self);
    }

    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        self.rename(&mut n.ident);
        n.function.visit_mut_with(self);
    }

    fn visit_mut_labeled_stmt(&mut self, n: &mut LabeledStmt) {
        n.body.visit_mut_with(self);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Ident(i) => {
                self.rename(i);
            }
            _ => {}
        }
    }

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        n.visit_mut_children_with(self);

        match n {
            Pat::Ident(i) => {
                self.rename(i);
            }
            _ => {}
        }
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);
        if n.computed {
            n.prop.visit_mut_with(self);
        }
    }
}
