use petgraph::{
    graph::{DiGraph, NodeIndex},
    visit::Bfs,
    Graph,
};
use rustc_hash::{FxHashMap, FxHashSet};
use swc_common::{BytePos, Spanned, SyntaxContext};
use swc_ecma_ast::{
    Class, ClassMember, Decl, ExportDecl, ExportDefaultDecl, ExportDefaultExpr, Function, Id,
    Ident, ModuleExportName, ModuleItem, NamedExport, TsEntityName, TsExportAssignment,
    TsExprWithTypeArgs, TsPropertySignature, TsTypeElement,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::fast_dts::util::ast_ext::ExprExit;

pub struct TypeUsageAnalyzer<'a> {
    graph: DiGraph<Id, ()>,
    nodes: FxHashMap<Id, NodeIndex>,
    // Global scope + nested ts module block scope
    scope_entries: Vec<NodeIndex>,
    // We will only consider referred nodes and ignore binding nodes
    references: FxHashSet<NodeIndex>,
    source: Option<NodeIndex>,
    internal_annotations: Option<&'a FxHashSet<BytePos>>,
}

impl TypeUsageAnalyzer<'_> {
    pub fn analyze(
        module_items: &Vec<ModuleItem>,
        internal_annotations: Option<&FxHashSet<BytePos>>,
    ) -> FxHashSet<Id> {
        // Create a fake entry
        let mut graph = Graph::default();
        let entry = graph.add_node(("".into(), SyntaxContext::empty()));

        let mut analyzer = TypeUsageAnalyzer {
            graph,
            nodes: FxHashMap::default(),
            scope_entries: vec![entry],
            references: FxHashSet::default(),
            source: None,
            internal_annotations,
        };
        module_items.visit_with(&mut analyzer);

        // Reachability
        let mut used_refs = FxHashSet::default();
        let mut bfs = Bfs::new(&analyzer.graph, entry);
        bfs.next(&analyzer.graph);
        while let Some(node_id) = bfs.next(&analyzer.graph) {
            if analyzer.references.contains(&node_id) {
                used_refs.insert(analyzer.graph[node_id].clone());
            }
        }
        used_refs
    }

    pub fn with_source<F: FnMut(&mut TypeUsageAnalyzer)>(
        &mut self,
        id: Option<NodeIndex>,
        mut f: F,
    ) {
        // If id is None, we use the nearest scope
        let old_source = self
            .source
            .replace(id.unwrap_or(*self.scope_entries.last().expect("No scope")));
        f(self);
        self.source = old_source;
    }

    pub fn with_source_ident<F: FnMut(&mut TypeUsageAnalyzer)>(&mut self, ident: &Ident, f: F) {
        self.add_edge(ident.to_id(), false);
        let id = *self
            .nodes
            .entry(ident.to_id())
            .or_insert_with(|| self.graph.add_node(ident.to_id()));
        self.with_source(Some(id), f);
    }

    pub fn add_edge(&mut self, reference: Id, is_ref: bool) {
        if let Some(source) = self.source {
            let target_id = *self
                .nodes
                .entry(reference.clone())
                .or_insert_with(|| self.graph.add_node(reference));
            self.graph.add_edge(source, target_id, ());
            if is_ref {
                self.references.insert(target_id);
            }
        }
    }

    fn has_internal_annotation(&self, pos: BytePos) -> bool {
        if let Some(internal_annotations) = &self.internal_annotations {
            return internal_annotations.contains(&pos);
        }
        false
    }
}

impl Visit for TypeUsageAnalyzer<'_> {
    fn visit_ts_property_signature(&mut self, node: &TsPropertySignature) {
        if let Some(ident) = node.key.get_root_ident() {
            self.add_edge(ident.to_id(), true);
        }
        node.visit_children_with(self);
    }

    fn visit_ts_expr_with_type_args(&mut self, node: &TsExprWithTypeArgs) {
        if let Some(ident) = node.expr.get_root_ident() {
            self.add_edge(ident.to_id(), true);
        }
        node.visit_children_with(self);
    }

    fn visit_ts_entity_name(&mut self, node: &TsEntityName) {
        match node {
            TsEntityName::TsQualifiedName(ts_qualified_name) => {
                ts_qualified_name.left.visit_with(self);
            }
            TsEntityName::Ident(ident) => {
                self.add_edge(ident.to_id(), true);
            }
        };
    }

    fn visit_decl(&mut self, node: &Decl) {
        match node {
            Decl::Class(class_decl) => {
                self.with_source_ident(&class_decl.ident, |this| class_decl.class.visit_with(this));
            }
            Decl::Fn(fn_decl) => {
                self.with_source_ident(&fn_decl.ident, |this| fn_decl.function.visit_with(this));
            }
            Decl::Var(var_decl) => {
                for decl in &var_decl.decls {
                    decl.name.visit_with(self);
                    if let Some(name) = decl.name.as_ident() {
                        self.with_source_ident(&name.id, |this| decl.init.visit_with(this));
                    }
                }
            }
            Decl::Using(using_decl) => {
                for decl in &using_decl.decls {
                    decl.name.visit_with(self);
                    if let Some(name) = decl.name.as_ident() {
                        self.with_source_ident(&name.id, |this| decl.init.visit_with(this));
                    }
                }
            }
            Decl::TsInterface(ts_interface_decl) => {
                self.with_source_ident(&ts_interface_decl.id, |this| {
                    ts_interface_decl.body.visit_with(this);
                    ts_interface_decl.extends.visit_with(this);
                    ts_interface_decl.type_params.visit_with(this);
                });
            }
            Decl::TsTypeAlias(ts_type_alias_decl) => {
                self.with_source_ident(&ts_type_alias_decl.id, |this| {
                    ts_type_alias_decl.type_ann.visit_with(this);
                    ts_type_alias_decl.type_params.visit_with(this);
                });
            }
            Decl::TsEnum(ts_enum_decl) => {
                self.with_source_ident(&ts_enum_decl.id, |this| {
                    ts_enum_decl.members.visit_with(this);
                });
            }
            Decl::TsModule(ts_module_decl) => {
                if ts_module_decl.global || ts_module_decl.id.is_str() {
                    // Here we enter global scope
                    self.with_source(Some(self.scope_entries[0]), |this| {
                        ts_module_decl.body.visit_with(this)
                    });
                } else if let Some(ident) = ts_module_decl.id.as_ident() {
                    // Push a new scope and set current scope to None, which indicates that
                    // non-exported elements in ts module block are unreachable
                    self.add_edge(ident.to_id(), false);
                    let id = *self
                        .nodes
                        .entry(ident.to_id())
                        .or_insert_with(|| self.graph.add_node(ident.to_id()));
                    self.scope_entries.push(id);
                    let old_source = self.source.take();
                    ts_module_decl.body.visit_with(self);
                    self.source = old_source;
                    self.scope_entries.pop();
                }
            }
        }
    }

    fn visit_export_decl(&mut self, node: &ExportDecl) {
        self.with_source(self.source, |this| {
            node.visit_children_with(this);
        });
    }

    fn visit_named_export(&mut self, node: &NamedExport) {
        self.with_source(self.source, |this| {
            for specifier in &node.specifiers {
                if let Some(name) = specifier.as_named() {
                    if let ModuleExportName::Ident(ident) = &name.orig {
                        this.add_edge(ident.to_id(), true);
                    }
                }
            }
        });
    }

    fn visit_export_default_decl(&mut self, node: &ExportDefaultDecl) {
        self.with_source(self.source, |this| {
            node.visit_children_with(this);
        });
    }

    fn visit_export_default_expr(&mut self, node: &ExportDefaultExpr) {
        self.with_source(self.source, |this| {
            if let Some(ident) = node.expr.as_ident() {
                this.add_edge(ident.to_id(), true);
            }
            node.visit_children_with(this);
        });
    }

    fn visit_ts_export_assignment(&mut self, node: &TsExportAssignment) {
        self.with_source(self.source, |this| {
            node.visit_children_with(this);
        });
    }

    fn visit_function(&mut self, node: &Function) {
        // Skip body
        node.params.visit_with(self);
        node.decorators.visit_with(self);
        node.type_params.visit_with(self);
        node.return_type.visit_with(self);
    }

    fn visit_class(&mut self, node: &Class) {
        if let Some(super_class) = &node.super_class {
            if let Some(ident) = super_class.get_root_ident() {
                self.add_edge(ident.to_id(), true);
            }
        }
        node.visit_children_with(self);
    }

    fn visit_class_member(&mut self, node: &ClassMember) {
        if self.has_internal_annotation(node.span_lo()) {
            return;
        }
        node.visit_children_with(self);
    }

    fn visit_ts_type_element(&mut self, node: &TsTypeElement) {
        if self.has_internal_annotation(node.span_lo()) {
            return;
        }
        node.visit_children_with(self);
    }

    fn visit_module_items(&mut self, node: &[ModuleItem]) {
        for item in node {
            // Skip statements and internals
            if item.as_stmt().map_or(false, |stmt| !stmt.is_decl())
                || self.has_internal_annotation(item.span_lo())
            {
                continue;
            }
            item.visit_children_with(self);
        }
    }
}
