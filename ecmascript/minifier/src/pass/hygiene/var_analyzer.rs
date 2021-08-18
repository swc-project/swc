use fxhash::{FxHashMap, FxHashSet};
use swc_atoms::JsWord;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::scope::ScopeKind;
use swc_ecma_utils::{collect_decls, ident::IdentLike, BindingCollector, Id};
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

pub(super) fn analyze<N>(n: &N) -> ScopeData
where
    N: for<'aa> VisitWith<VarAnalyzer<'aa>>,
{
    let mut data = ScopeData::default();
    let mut v = VarAnalyzer {
        scope: &mut data,
        children: Default::default(),
        scope_depth: 0,
    };
    n.visit_with(&Invalid { span: DUMMY_SP }, &mut v);

    dbg!(&data);

    data
}

#[derive(Debug, Default)]
pub(super) struct VarData {
    used_by_nested_fn: bool,
    not_fn_local: bool,
}

#[derive(Debug, Default)]
pub(super) struct ScopeData {
    /// Has higher precedence over `candidates`.
    pub preserved_ids: FxHashSet<Id>,
    /// Candidates for modification.
    pub candidates: FxHashSet<Id>,

    pub declared: FxHashMap<JsWord, FxHashSet<SyntaxContext>>,

    pub vars: FxHashMap<Id, VarData>,
}

impl ScopeData {
    fn merge_child(&mut self, rhs: Self, kind: ScopeKind) {
        for decl in rhs.declared {
            self.declared.entry(decl.0).or_default().extend(decl.1);
        }

        self.preserved_ids.extend(rhs.preserved_ids);
        self.candidates.extend(rhs.candidates);

        for (id, var) in rhs.vars {
            let e = self.vars.entry(id.clone()).or_default();

            match kind {
                ScopeKind::Fn => {
                    if cfg!(feature = "debug") {
                        log::trace!("preserving {:?}: not fn-local (from fn)", id);
                    }

                    self.preserved_ids.insert(id.clone());

                    e.not_fn_local = true;
                    e.used_by_nested_fn = true;
                }
                ScopeKind::Block => {
                    if var.used_by_nested_fn {
                        if cfg!(feature = "debug") {
                            log::trace!("preserving {:?}: not fn-local (from block)", id);
                        }

                        self.preserved_ids.insert(id.clone());

                        e.not_fn_local = true;
                        e.used_by_nested_fn = true;
                    }
                }
            }
        }
    }
}

pub(super) struct VarAnalyzer<'a> {
    /// Current scope.
    scope: &'a mut ScopeData,
    children: FxHashMap<u16, Vec<ScopeData>>,
    scope_depth: u16,
}

impl<'a> VarAnalyzer<'a> {
    fn visit_scoped<N>(&mut self, kind: ScopeKind, node: &N)
    where
        N: for<'aa> VisitWith<VarAnalyzer<'aa>> + VisitWith<BindingCollector<Id>>,
    {
        let cur_depth = self.scope_depth;
        let child_depth = cur_depth + 1;

        if cfg!(debug_assertions) {
            for (k, _) in self.children.iter() {
                assert!(
                    *k <= child_depth,
                    "Nested scopes should be merged by scope handler at depth = {}",
                    child_depth
                );
            }
        }

        match self.children.remove(&child_depth) {
            Some(children) => {
                // We are not in a leaf node, so we can just use the variable
                // information collected from child scope.

                if cfg!(feature = "debug") {
                    log::trace!("Hanlding non-leaf scope (depth = {})", cur_depth);
                }

                let mut data = children.into_iter().fold(ScopeData::default(), |mut a, b| {
                    a.merge_child(b, kind);
                    a
                });

                let mut v = VarAnalyzer {
                    scope: &mut data,
                    children: Default::default(),
                    scope_depth: child_depth,
                };
                node.visit_children_with(&mut v);

                self.children.entry(cur_depth).or_default().push(data);
            }
            None => {
                // Leaf node.
                if cfg!(feature = "debug") {
                    log::trace!("Hanlding leaf scope (depth = {})", cur_depth);
                }

                let mut data = ScopeData::default();

                let decls = collect_decls(node);

                for decl_id in decls {
                    let e = data.declared.entry(decl_id.0).or_default();
                    e.insert(decl_id.1);
                }

                let mut v = VarAnalyzer {
                    scope: &mut data,
                    children: Default::default(),
                    scope_depth: child_depth,
                };
                node.visit_children_with(&mut v);

                self.children.entry(cur_depth).or_default().push(data);
            }
        }
    }

    fn visit_par<N>(&mut self, node: &[N])
    where
        N: for<'aa> VisitWith<VarAnalyzer<'aa>> + VisitWith<BindingCollector<Id>>,
    {
    }
}

impl Visit for VarAnalyzer<'_> {
    noop_visit_type!();

    fn visit_block_stmt(&mut self, n: &BlockStmt, _: &dyn Node) {
        self.visit_scoped(ScopeKind::Block, n);
    }

    fn visit_function(&mut self, n: &Function, _: &dyn Node) {
        self.visit_scoped(ScopeKind::Fn, n);
    }

    fn visit_ident(&mut self, n: &Ident, _: &dyn Node) {
        self.scope.vars.entry(n.to_id()).or_default();

        if let Some(v) = self.scope.declared.get(&n.sym) {
            if v.len() >= 2 {
                if cfg!(feature = "debug") {
                    log::trace!(
                        "Preserving {:?}: Multiple variable with same symbol",
                        n.to_id()
                    );
                }

                self.scope.preserved_ids.insert(n.to_id());
                return;
            }
        }

        if cfg!(feature = "debug") {
            log::trace!("Candidate: {:?}", n.to_id());
        }

        self.scope.candidates.insert(n.to_id());
    }

    fn visit_member_expr(&mut self, n: &MemberExpr, _: &dyn Node) {
        n.obj.visit_with(n, self);

        if n.computed {
            n.prop.visit_with(n, self);
        }
    }
    fn visit_prop_name(&mut self, n: &PropName, _: &dyn Node) {
        match n {
            PropName::Computed(..) => {
                n.visit_children_with(self);
            }
            _ => {}
        }
    }
}
