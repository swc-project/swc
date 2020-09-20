use crate::{analyzer::Analyzer, util::AsModuleDecl, ValidationResult};
use fxhash::{FxHashMap, FxHashSet};
use petgraph::{algo::toposort, graph::DiGraph, graphmap::DiGraphMap, visit::DfsPostOrder};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, DestructuringFinder};
use swc_ecma_visit::Node;
use swc_ts_types::Id;

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
        T: AsModuleDecl + for<'any> swc_ecma_visit::VisitWith<StmtDependencyFinder<'any>>,
    {
        if nodes.len() <= 1 {
            return (0..nodes.len()).collect();
        }

        // Only `var` and `function` are hoisted.
        // So we don't need to calculate dependency graph of normal statements
        let hoisted_orders = {
            let mut orders = vec![];

            for (idx, node) in nodes.iter().enumerate() {
                let is_hoisted = match node.as_module_decl() {
                    Ok(decl) => match decl {
                        ModuleDecl::ExportDecl(export) => match export.decl {
                            Decl::Var(VarDecl {
                                kind: VarDeclKind::Var,
                                ..
                            })
                            | Decl::TsTypeAlias(..)
                            | Decl::TsInterface(..)
                            | Decl::Fn(_) => true,
                            _ => false,
                        },
                        _ => false,
                    },
                    Err(stmt) => match stmt {
                        Stmt::Decl(Decl::Var(VarDecl {
                            kind: VarDeclKind::Var,
                            ..
                        }))
                        | Stmt::Decl(Decl::TsInterface(..))
                        | Stmt::Decl(Decl::TsTypeAlias(..))
                        | Stmt::Decl(Decl::Fn(..)) => true,
                        _ => false,
                    },
                };

                if is_hoisted {
                    orders.push(idx);
                }
            }

            orders
        };

        if hoisted_orders.is_empty() {
            return (0..nodes.len()).collect();
        }

        // slow path
        let mut ids_graph =
            DiGraph::<_, usize>::with_capacity(hoisted_orders.len(), hoisted_orders.len() * 2);

        let mut order_idx_i_by_id = FxHashMap::<Id, usize>::default();
        let mut graph_node_id_by_id = FxHashMap::<_, _>::default();
        let mut node_ids_by_order_idx = FxHashMap::<_, Vec<_>>::default();

        // Find identifier usages
        for (i, &idx) in hoisted_orders.iter().enumerate() {
            let node = &nodes[idx];

            let mut ids = FxHashSet::<Id>::default();
            let mut ids_buf = vec![];
            let mut deps = FxHashSet::<Id>::default();

            {
                let mut v = StmtDependencyFinder {
                    ids_buf: &mut ids_buf,
                    ids: &mut ids,
                    deps: &mut deps,
                    no_decl: false,
                };

                node.visit_with(&mut v);
            }

            // log::warn!("Id graph: ({}) ({:?}) <-- {:?}", idx, ids, deps);
            order_idx_i_by_id.extend(ids.iter().cloned().map(|id| (id, i)));

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

        let mut order: Vec<usize> = Vec::with_capacity(nodes.len());

        for &idx in &hoisted_orders {
            order.push(idx);
        }

        for (i, &idx) in hoisted_orders.iter().enumerate() {
            if let Some(node_ids) = node_ids_by_order_idx.get(&idx) {
                // log::info!("node_ids_by_order_idx: {}", node_ids.len());

                for &node_id in node_ids {
                    let mut visitor = DfsPostOrder::new(&ids_graph, node_id);

                    while let Some(node_id) = visitor.next(&ids_graph) {
                        let id = ids_graph.node_weight(node_id).unwrap();
                        if let Some(&order_of_the_id) = order_idx_i_by_id.get(&id) {
                            // log::error!("Order graph: {} <- {}", i, order_of_the_id);

                            if idx < order_of_the_id {
                                // log::info!("Swap: {} <-> {}", i, order_of_the_id);
                                order.swap(order_of_the_id, i)
                            }
                        }
                    }
                }
            }
        }

        for (idx, _) in nodes.iter().enumerate() {
            if !hoisted_orders.contains(&idx) {
                order.push(idx);
            }
        }

        log::warn!("Order: {:?}", order);

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

impl swc_ecma_visit::Visit for StmtDependencyFinder<'_> {
    fn visit_fn_decl(&mut self, node: &FnDecl, _: &dyn Node) {
        if !self.no_decl {
            self.ids.insert(node.ident.clone().into());
        }
        node.visit_children_with(self);
    }

    fn visit_var_declarator(&mut self, node: &VarDeclarator, _: &dyn Node) {
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

    fn visit_class_decl(&mut self, node: &ClassDecl, _: &dyn Node) {
        let old = self.no_decl;
        node.class.visit_with(self);
        self.no_decl = old;
    }

    fn visit_function(&mut self, n: &Function, _: &dyn Node) {
        let old = self.no_decl;
        n.visit_children_with(self);
        self.no_decl = old;
    }

    fn visit_arrow_expr(&mut self, n: &ArrowExpr, _: &dyn Node) {
        let old = self.no_decl;
        n.visit_children_with(self);
        self.no_decl = old;
    }

    fn visit_member_expr(&mut self, node: &MemberExpr, _: &dyn Node) {
        node.obj.visit_with(self);

        if node.computed {
            node.prop.visit_with(self);
        }
    }

    fn visit_expr(&mut self, node: &Expr, _: &dyn Node) {
        match node {
            Expr::Ident(ref i) => {
                self.deps.insert(i.into());
            }
            _ => {}
        }

        node.visit_children_with(self);
    }
}

impl Analyzer<'_, '_> {
    pub(super) fn reorder_type_params(
        &mut self,
        params: &[TsTypeParam],
    ) -> ValidationResult<Vec<usize>> {
        let mut graph = DiGraphMap::<usize, usize>::with_capacity(params.len(), params.len() * 2);
        for i in 0..params.len() {
            graph.add_node(i);
        }

        for (idx, node) in params.iter().enumerate() {
            let mut deps = FxHashSet::<Id>::default();

            {
                let mut v = TypeParamDepFinder {
                    id: &node.name.clone().into(),
                    deps: &mut deps,
                };

                for p in params {
                    p.constraint.visit_with(&mut v);
                    p.default.visit_with(&mut v);
                }

                for dep in &deps {
                    if let Some(pos) = params.iter().position(|v| *dep == v.name) {
                        //
                        graph.add_edge(idx, pos, 1);
                        break;
                    }
                }

                // log::trace!("Reorder: {} <-- {:?}", node.name.sym, deps);
            }
        }

        let sorted = toposort(&graph.into_graph::<usize>(), None)
            .expect("cycle in type parameter is not supported");
        Ok(sorted.into_iter().map(|i| i.index()).collect())
    }
}

#[derive(Debug)]
struct TypeParamDepFinder<'a> {
    id: &'a Id,
    deps: &'a mut FxHashSet<Id>,
}

impl swc_ecma_visit::Visit for TypeParamDepFinder<'_> {
    fn visit_ident(&mut self, node: &Ident, _: &dyn Node) {
        if *self.id == node {
            return;
        }

        self.deps.insert(node.clone().into());
    }
}
