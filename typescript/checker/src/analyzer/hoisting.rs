use crate::{analyzer::Analyzer, ty::TypeParam, ValidationResult};
use bitflags::_core::mem::{replace, take};
use fxhash::{FxHashMap, FxHashSet};
use petgraph::{
    algo::toposort,
    graph::DiGraph,
    graphmap::{DiGraphMap, GraphMap},
    stable_graph::StableDiGraph,
    visit::DfsPostOrder,
};
use swc_atoms::{JsWord, JsWordStaticSet};
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, ident::IdentLike, DestructuringFinder, Id, StmtLike};

/// Structs to reuse vector / hash maps.
#[derive(Debug, Default)]
pub(super) struct HoistingWs {
    stmts: StmtWs,
    type_params: TypeParamWs,
}

#[derive(Debug, Default)]
struct StmtWs {
    idx_by_ids: FxHashMap<Id, usize>,
    ids: FxHashSet<Id>,
    ids_buf: Vec<Id>,
    deps: FxHashSet<Id>,
}

impl Analyzer<'_, '_> {
    /// Returns the order of evaluation. This methods is used to handle hoisting
    /// properly.
    ///
    /// # Exmaple
    ///
    /// The method will return `[1, 0]` for the code below.
    ///
    /// ```js
    /// function foo() {
    ///     return bar();
    /// }
    ///
    /// function bar (){
    ///     return 1;
    /// }K
    /// ```
    pub(super) fn reorder_stmts<T>(&mut self, nodes: &[T]) -> Vec<usize>
    where
        T: StmtLike + for<'any> VisitWith<StmtDependencyFinder<'any>>,
    {
        if nodes.len() <= 1 {
            return (0..nodes.len()).collect();
        }

        let mut ids_graph = DiGraph::<_, usize>::with_capacity(nodes.len(), nodes.len() * 2);

        let order_idx_by_id = &mut self.hoisting_ws.stmts.idx_by_ids;
        let ids = &mut self.hoisting_ws.stmts.ids;
        let ids_buf = &mut self.hoisting_ws.stmts.ids_buf;
        let deps = &mut self.hoisting_ws.stmts.deps;
        let mut graph_node_id_by_id = FxHashMap::<_, _>::default();
        let mut node_ids_by_order_idx = FxHashMap::<_, Vec<_>>::default();

        order_idx_by_id.clear();

        for (idx, node) in nodes.iter().enumerate() {
            ids.clear();
            ids_buf.clear();
            deps.clear();

            {
                let mut v = StmtDependencyFinder {
                    ids_buf,
                    ids,
                    deps,
                    no_decl: false,
                };

                node.visit_with(&mut v);
            }

            // log::info!("Id graph: ({}) ({:?}) <-- {:?}", idx, ids, deps);
            order_idx_by_id.extend(ids.iter().cloned().map(|id| (id, idx)));

            for id in ids.drain() {
                let node_id = if let Some(&node_id) = graph_node_id_by_id.get(&id) {
                    node_ids_by_order_idx.entry(idx).or_default().push(node_id);
                    node_id
                } else {
                    let node_id = ids_graph.add_node(id.clone());
                    node_ids_by_order_idx.entry(idx).or_default().push(node_id);
                    node_id
                };

                for dep_id in deps.drain() {
                    let dep_node_id = if let Some(&node_id) = graph_node_id_by_id.get(&dep_id) {
                        node_id
                    } else {
                        let node_id = ids_graph.add_node(dep_id.clone());
                        node_id
                    };

                    ids_graph.add_edge(node_id, dep_node_id, 1);
                }

                graph_node_id_by_id.insert(id, node_id);
            }
        }

        let mut order: Vec<usize> = (0..nodes.len()).collect();

        for (idx, _) in nodes.iter().enumerate() {
            if let Some(node_ids) = node_ids_by_order_idx.get(&idx) {
                // log::info!("node_ids_by_order_idx: {}", node_ids.len());

                for &node_id in node_ids {
                    let mut visitor = DfsPostOrder::new(&ids_graph, node_id);

                    while let Some(node_id) = visitor.next(&ids_graph) {
                        let id = ids_graph.node_weight(node_id).unwrap();
                        if let Some(&order_of_the_id) = order_idx_by_id.get(&id) {
                            // log::error!("Order graph: {} <- {}", idx, order_of_the_id);

                            if idx < order_of_the_id {
                                // log::info!("Swap: {} <-> {}", idx, order_of_the_id);
                                order.swap(order_of_the_id, idx)
                            }
                        }
                    }
                }
            }
        }

        // log::info!("{:?}", order);

        order
    }
}

#[derive(Debug)]
pub(super) struct StmtDependencyFinder<'a> {
    ids_buf: &'a mut Vec<Id>,
    /// Identifiers created by a statement.
    ///
    /// e.g.
    ///
    /// Value is `[a, b]` for the var declaration below.
    /// ```js
    /// var a, b = foo();
    /// ```
    ids: &'a mut FxHashSet<Id>,

    /// Dependencies of the id.
    deps: &'a mut FxHashSet<Id>,

    no_decl: bool,
}

impl Visit<FnDecl> for StmtDependencyFinder<'_> {
    fn visit(&mut self, node: &FnDecl) {
        if !self.no_decl {
            self.ids.insert(node.ident.to_id());
        }
        node.visit_children(self);
    }
}

impl Visit<VarDeclarator> for StmtDependencyFinder<'_> {
    fn visit(&mut self, node: &VarDeclarator) {
        if !self.no_decl {
            {
                let mut v = DestructuringFinder {
                    found: self.ids_buf,
                };
                node.name.visit_with(&mut v);
            }

            self.ids.extend(self.ids_buf.drain(..));
        }

        node.init.visit_with(self);
    }
}

impl Visit<ClassDecl> for StmtDependencyFinder<'_> {
    fn visit(&mut self, node: &ClassDecl) {
        let old = self.no_decl;
        node.class.visit_with(self);
        self.no_decl = old;
    }
}

impl Visit<Function> for StmtDependencyFinder<'_> {
    fn visit(&mut self, n: &Function) {
        let old = self.no_decl;
        n.visit_children(self);
        self.no_decl = old;
    }
}

impl Visit<ArrowExpr> for StmtDependencyFinder<'_> {
    fn visit(&mut self, n: &ArrowExpr) {
        let old = self.no_decl;
        n.visit_children(self);
        self.no_decl = old;
    }
}

impl Visit<MemberExpr> for StmtDependencyFinder<'_> {
    fn visit(&mut self, node: &MemberExpr) {
        node.obj.visit_with(self);

        if node.computed {
            node.prop.visit_with(self);
        }
    }
}

impl Visit<Expr> for StmtDependencyFinder<'_> {
    fn visit(&mut self, node: &Expr) {
        match node {
            Expr::Ident(ref i) => {
                self.deps.insert(i.to_id());
            }
            _ => {}
        }

        node.visit_children(self);
    }
}

#[derive(Debug, Default)]
struct TypeParamWs {
    deps: FxHashSet<JsWord>,
}

impl Analyzer<'_, '_> {
    pub(super) fn reorder_type_params(
        &mut self,
        params: &[TsTypeParam],
    ) -> ValidationResult<Vec<usize>> {
        let mut graph = DiGraphMap::<usize, usize>::with_capacity(params.len(), params.len() * 2);
        let deps = &mut self.hoisting_ws.type_params.deps;
        for i in 0..params.len() {
            graph.add_node(i);
        }

        for (idx, node) in params.iter().enumerate() {
            deps.clear();

            {
                let mut v = TypeParamDepFinder {
                    id: &node.name.sym,
                    deps,
                };

                for p in params {
                    p.constraint.visit_with(&mut v);
                    p.default.visit_with(&mut v);
                }

                for dep in &*deps {
                    if let Some(pos) = params.iter().position(|v| v.name.sym == *dep) {
                        //
                        graph.add_edge(idx, pos, 1);
                        break;
                    }
                }

                log::trace!("Reorder: {} <-- {:?}", node.name.sym, deps);
            }
        }

        let sorted = toposort(&graph.into_graph::<usize>(), None)
            .expect("cycle in type parameter is not supported");
        Ok(sorted.into_iter().map(|i| i.index()).collect())
    }
}

#[derive(Debug)]
struct TypeParamDepFinder<'a> {
    id: &'a JsWord,
    deps: &'a mut FxHashSet<JsWord>,
}

impl Visit<Ident> for TypeParamDepFinder<'_> {
    fn visit(&mut self, node: &Ident) {
        if *self.id == node.sym {
            return;
        }

        self.deps.insert(node.sym.clone());
    }
}
