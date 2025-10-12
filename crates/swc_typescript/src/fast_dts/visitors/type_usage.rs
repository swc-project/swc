use std::collections::hash_map::Entry;

use bitflags::bitflags;
use petgraph::{
    graph::{DiGraph, NodeIndex},
    visit::Bfs,
    Graph,
};
use rustc_hash::{FxHashMap, FxHashSet};
use swc_common::{BytePos, Spanned, SyntaxContext};
use swc_ecma_ast::{
    Accessibility, ArrowExpr, Class, ClassMember, Decl, ExportDecl, ExportDefaultDecl,
    ExportDefaultExpr, Function, Id, ModuleExportName, ModuleItem, NamedExport, TsEntityName,
    TsExportAssignment, TsExprWithTypeArgs, TsPropertySignature, TsTypeElement, TsTypeQueryExpr,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::fast_dts::util::ast_ext::ExprExit;

bitflags! {
    #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
    pub struct SymbolFlags: u8 {
        const Value = 1 << 0;
        const Type = 1 << 1;
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct Symbol {
    id: Id,
    kind: SymbolFlags,
}

impl Symbol {
    fn new(id: Id, kind: SymbolFlags) -> Self {
        Symbol { id, kind }
    }
}

bitflags! {
    #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
    pub struct Context: u8 {
        const InTypeQuery = 1 << 0;
    }
}

pub struct TypeUsageAnalyzer<'a> {
    /// The graph may contain multiple symbol nodes with the same `Id` and
    /// different `SymbolFlags`. This is ok because they will be merged into the
    /// final result `UsedRefs`
    graph: DiGraph<Symbol, ()>,
    nodes: FxHashMap<Symbol, NodeIndex>,
    /// Global scope + nested ts module block scope
    scope_entries: Vec<NodeIndex>,
    /// Dts will only consider referred nodes and ignore binding nodes
    references: FxHashSet<NodeIndex>,
    /// Current source node that all the nested idents should depend on
    source: Option<NodeIndex>,
    /// Used for stripping those with @internal
    internal_annotations: Option<&'a FxHashSet<BytePos>>,
    /// Used for analyzing usages without parameter drilling
    ctx: Context,
}

#[derive(Debug, Clone, Default)]
pub struct UsedRefs(FxHashMap<Id, SymbolFlags>);

impl UsedRefs {
    pub fn add_usage(&mut self, id: Id, kind: SymbolFlags) {
        match self.0.entry(id) {
            Entry::Occupied(mut occupied_entry) => {
                let value = occupied_entry.get_mut();
                *value = value.union(kind);
            }
            Entry::Vacant(vacant_entry) => {
                vacant_entry.insert(kind);
            }
        }
    }

    pub fn used_as_type(&self, id: &Id) -> bool {
        self.0
            .get(id)
            .is_some_and(|ref_type| ref_type.contains(SymbolFlags::Type))
    }

    pub fn used_as_value(&self, id: &Id) -> bool {
        self.0
            .get(id)
            .is_some_and(|ref_type| ref_type.contains(SymbolFlags::Value))
    }

    pub fn used(&self, id: &Id) -> bool {
        self.0.get(id).is_some_and(|ref_type| !ref_type.is_empty())
    }

    pub fn extend(&mut self, other: Self) {
        for (id, kind) in other.0 {
            self.add_usage(id, kind);
        }
    }
}

impl TypeUsageAnalyzer<'_> {
    pub fn analyze(
        module_items: &Vec<ModuleItem>,
        internal_annotations: Option<&FxHashSet<BytePos>>,
    ) -> UsedRefs {
        // Create a fake entry reprensting global scope
        let mut graph = Graph::default();
        let entry = graph.add_node(Symbol::new(
            ("".into(), SyntaxContext::empty()),
            SymbolFlags::empty(),
        ));

        let mut analyzer = TypeUsageAnalyzer {
            graph,
            nodes: FxHashMap::default(),
            scope_entries: vec![entry],
            references: FxHashSet::default(),
            source: None,
            internal_annotations,
            ctx: Context::empty(),
        };
        module_items.visit_with(&mut analyzer);

        // Reachability: used_refs = all references - unreachable references
        let mut used_refs = UsedRefs::default();
        let mut bfs = Bfs::new(&analyzer.graph, entry);
        bfs.next(&analyzer.graph);
        while let Some(node_id) = bfs.next(&analyzer.graph) {
            if analyzer.references.contains(&node_id) {
                let symbol = analyzer
                    .graph
                    .node_weight(node_id)
                    .expect("unexpected invalid node id");
                used_refs.add_usage(symbol.id.clone(), symbol.kind);
            }
        }
        used_refs
    }

    /// All the nested nodes may be connected by the passed id nodes
    fn with_source<F: FnMut(&mut TypeUsageAnalyzer)>(&mut self, id: Option<NodeIndex>, mut f: F) {
        // If id is None, we use the nearest scope
        let old_source = self
            .source
            .replace(id.unwrap_or(*self.scope_entries.last().expect("No scope")));
        f(self);
        self.source = old_source;
    }

    /// All the nested idents will depend on the usage of the passed ident
    /// This is usually called when meeting a binding ident
    fn with_source_ident<F: FnMut(&mut TypeUsageAnalyzer)>(&mut self, symbol: Symbol, f: F) {
        self.add_edge(symbol.clone(), false);
        let id = *self
            .nodes
            .entry(symbol.clone())
            .or_insert_with(|| self.graph.add_node(symbol));
        self.with_source(Some(id), f);
    }

    /// Add a dependency edge from current source to the reference
    /// If `is_ref` is false, the reference is a binding ident such as a
    /// variable declaration, which means it is not a usage.
    fn add_edge(&mut self, reference: Symbol, is_ref: bool) {
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
            self.add_edge(Symbol::new(ident.to_id(), SymbolFlags::Value), true);
        }
        node.visit_children_with(self);
    }

    fn visit_ts_expr_with_type_args(&mut self, node: &TsExprWithTypeArgs) {
        if let Some(ident) = node.expr.get_root_ident() {
            self.add_edge(Symbol::new(ident.to_id(), SymbolFlags::Type), true);
        }
        node.visit_children_with(self);
    }

    fn visit_ts_type_query_expr(&mut self, node: &TsTypeQueryExpr) {
        // In `typeof A.B.C`, A should be a value
        if node.is_ts_entity_name() {
            self.ctx.insert(Context::InTypeQuery);
            node.visit_children_with(self);
            self.ctx.remove(Context::InTypeQuery);
        } else {
            node.visit_children_with(self);
        }
    }

    fn visit_ts_entity_name(&mut self, node: &TsEntityName) {
        match node {
            TsEntityName::TsQualifiedName(ts_qualified_name) => {
                ts_qualified_name.left.visit_with(self);
            }
            TsEntityName::Ident(ident) => {
                let flag = if self.ctx.contains(Context::InTypeQuery) {
                    SymbolFlags::Value
                } else {
                    SymbolFlags::Type
                };
                self.add_edge(Symbol::new(ident.to_id(), flag), true);
            }
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        };
    }

    fn visit_decl(&mut self, node: &Decl) {
        match node {
            Decl::Class(class_decl) => {
                self.with_source_ident(
                    Symbol::new(class_decl.ident.to_id(), SymbolFlags::all()),
                    |this| class_decl.class.visit_with(this),
                );
            }
            Decl::Fn(fn_decl) => {
                self.with_source_ident(
                    Symbol::new(fn_decl.ident.to_id(), SymbolFlags::Value),
                    |this| fn_decl.function.visit_with(this),
                );
            }
            Decl::Var(var_decl) => {
                for decl in &var_decl.decls {
                    // When the name of the decl is a binding ident, the usage of its type
                    // annotation should also depend on the usage of the ident name
                    if let Some(name) = decl.name.as_ident() {
                        name.id.visit_with(self);
                        self.with_source_ident(
                            Symbol::new(name.id.to_id(), SymbolFlags::Value),
                            |this| {
                                name.type_ann.visit_with(this);
                                decl.init.visit_with(this);
                            },
                        );
                    } else {
                        decl.name.visit_with(self);
                    }
                }
            }
            Decl::Using(using_decl) => {
                for decl in &using_decl.decls {
                    // When the name of the decl is a binding ident, the usage of its type
                    // annotation should also depend on the usage of the ident name
                    if let Some(name) = decl.name.as_ident() {
                        name.id.visit_with(self);
                        self.with_source_ident(
                            Symbol::new(name.to_id(), SymbolFlags::Value),
                            |this| {
                                name.type_ann.visit_with(this);
                                decl.init.visit_with(this);
                            },
                        );
                    } else {
                        decl.name.visit_with(self);
                    }
                }
            }
            Decl::TsInterface(ts_interface_decl) => {
                self.with_source_ident(
                    Symbol::new(ts_interface_decl.id.to_id(), SymbolFlags::Type),
                    |this| {
                        ts_interface_decl.body.visit_with(this);
                        ts_interface_decl.extends.visit_with(this);
                        ts_interface_decl.type_params.visit_with(this);
                    },
                );
            }
            Decl::TsTypeAlias(ts_type_alias_decl) => {
                self.with_source_ident(
                    Symbol::new(ts_type_alias_decl.id.to_id(), SymbolFlags::Type),
                    |this| {
                        ts_type_alias_decl.type_ann.visit_with(this);
                        ts_type_alias_decl.type_params.visit_with(this);
                    },
                );
            }
            Decl::TsEnum(ts_enum_decl) => {
                self.with_source_ident(
                    Symbol::new(ts_enum_decl.id.to_id(), SymbolFlags::all()),
                    |this| {
                        ts_enum_decl.members.visit_with(this);
                    },
                );
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
                    let symbol = Symbol::new(ident.to_id(), SymbolFlags::Type);
                    self.add_edge(symbol.clone(), false);
                    let id = *self
                        .nodes
                        .entry(symbol.clone())
                        .or_insert_with(|| self.graph.add_node(symbol));
                    self.scope_entries.push(id);
                    let old_source = self.source.take();
                    ts_module_decl.body.visit_with(self);
                    self.source = old_source;
                    self.scope_entries.pop();
                }
            }
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
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
                        // We should add egdes for all three possible namespaces because there's no
                        // mechanism to merge SymbolFlags with same Ids
                        this.add_edge(Symbol::new(ident.to_id(), SymbolFlags::Type), true);
                        if !node.type_only {
                            this.add_edge(Symbol::new(ident.to_id(), SymbolFlags::Value), true);
                            this.add_edge(Symbol::new(ident.to_id(), SymbolFlags::all()), true);
                        }
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
                // We should add egdes for all three possible namespaces because there's no
                // mechanism to merge SymbolFlags with same Ids
                this.add_edge(Symbol::new(ident.to_id(), SymbolFlags::Type), true);
                this.add_edge(Symbol::new(ident.to_id(), SymbolFlags::Value), true);
                this.add_edge(Symbol::new(ident.to_id(), SymbolFlags::all()), true);
            }
            node.visit_children_with(this);
        });
    }

    fn visit_ts_export_assignment(&mut self, node: &TsExportAssignment) {
        self.with_source(self.source, |this| {
            node.visit_children_with(this);
        });
    }

    fn visit_arrow_expr(&mut self, node: &ArrowExpr) {
        // Skip body
        node.params.visit_with(self);
        node.type_params.visit_with(self);
        node.return_type.visit_with(self);
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
                self.add_edge(Symbol::new(ident.to_id(), SymbolFlags::Value), true);
            }
        }
        node.visit_children_with(self);
    }

    fn visit_class_member(&mut self, node: &ClassMember) {
        if self.has_internal_annotation(node.span_lo()) {
            return;
        }

        let is_private = match node {
            ClassMember::Constructor(constructor) => constructor
                .accessibility
                .is_some_and(|accessibility| accessibility == Accessibility::Private),
            ClassMember::Method(class_method) => class_method
                .accessibility
                .is_some_and(|accessibility| accessibility == Accessibility::Private),
            ClassMember::PrivateMethod(_) => true,
            ClassMember::ClassProp(class_prop) => class_prop
                .accessibility
                .is_some_and(|accessibility| accessibility == Accessibility::Private),
            ClassMember::PrivateProp(_) => true,
            ClassMember::TsIndexSignature(_) => false,
            ClassMember::Empty(_) => false,
            ClassMember::StaticBlock(_) => false,
            ClassMember::AutoAccessor(auto_accessor) => {
                auto_accessor
                    .accessibility
                    .is_some_and(|accessibility| accessibility == Accessibility::Private)
                    || auto_accessor.key.is_private()
            }
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        };

        if is_private {
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
            if item.as_stmt().is_some_and(|stmt| !stmt.is_decl())
                || self.has_internal_annotation(item.span_lo())
            {
                continue;
            }
            item.visit_children_with(self);
        }
    }
}
