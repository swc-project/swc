//! Semantic analyzer for TypeScript programs.
//!
//! This module provides a read-only analysis pass that collects all metadata
//! needed for the TypeScript-to-JavaScript transformation:
//!
//! - Import information (type-only, value usages)
//! - Export information (type-only, value exports)
//! - Local declarations (for import shadowing detection)
//! - Value usages of identifiers
//! - Enum values (for const enum inlining)
//! - Namespace information
//! - Type declarations (interfaces, type aliases)
//!
//! This analyzer uses the Visitor pattern for a clean, single-pass collection
//! of all program metadata.

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::namespace::is_namespace_instantiated;

/// Converts a Wtf8Atom to an Atom.
#[inline]
fn wtf8_to_atom(s: &swc_atoms::Wtf8Atom) -> Atom {
    s.to_atom_lossy().into_owned()
}

/// Information about an imported identifier.
#[derive(Debug, Clone)]
pub struct ImportedIdent {
    /// The source module.
    pub src: Atom,
    /// The kind of import.
    pub kind: ImportedKind,
}

/// The kind of import binding.
#[derive(Debug, Clone)]
pub enum ImportedKind {
    /// Named import: `import { foo } from "mod"` or `import { foo as bar } from
    /// "mod"`
    Named(Atom),
    /// Default import: `import foo from "mod"`
    Default,
    /// Namespace import: `import * as foo from "mod"`
    Namespace,
}

/// Result of the semantic analysis pass.
#[derive(Debug, Default)]
pub struct ProgramInfo {
    /// Import information: local id -> import metadata.
    pub imports: FxHashMap<Id, ImportedIdent>,

    /// Identifiers used as values (not just types).
    pub value_usages: FxHashSet<Id>,

    /// Locally declared identifiers (for import shadowing detection).
    pub local_decls: FxHashSet<Id>,

    /// Type-only declarations (type aliases and interfaces).
    pub type_decls: FxHashSet<Id>,

    /// Const enum values for inlining: enum id -> (member name -> value).
    pub const_enum_values: FxHashMap<Id, FxHashMap<Atom, TsLit>>,

    /// All enum values (including non-const): enum id -> (member name ->
    /// value).
    pub enum_values: FxHashMap<Id, FxHashMap<Atom, TsLit>>,

    /// Set of const enum IDs.
    pub const_enum_ids: FxHashSet<Id>,

    /// Import equals declarations: LHS id -> root id of RHS TsEntityName.
    pub import_equals_refs: FxHashMap<Id, Id>,

    /// Whether the module has any value exports.
    pub has_value_export: bool,

    /// Whether the module has any value imports.
    pub has_value_import: bool,

    /// JSX pragma identifiers to preserve (from @jsx comments or config).
    pub jsx_pragma_ids: FxHashSet<Atom>,

    /// Type-only imported identifiers (from type-only imports or type-only
    /// specifiers).
    pub type_only_imports: FxHashSet<Id>,

    /// Const enum IDs that are used as standalone values (not member access).
    /// These must be kept even though they're const enums.
    /// Examples: `export default MyEnum`, `const x = MyEnum`
    pub const_enums_as_values: FxHashSet<Id>,

    /// Non-instantiated namespace IDs (namespaces that only contain type
    /// exports). These should be treated like type declarations and
    /// filtered from exports.
    pub non_instantiated_namespaces: FxHashSet<Id>,
}

/// Semantic analyzer that collects program metadata.
pub struct Analyzer<'a> {
    /// The collected program information.
    pub info: &'a mut ProgramInfo,

    /// Whether we're currently inside a type-only context.
    in_type: bool,

    /// Whether we're inside a namespace body.
    in_namespace: bool,

    /// Stack of namespace identifiers (for nested namespaces).
    namespace_stack: Vec<Ident>,
}

impl<'a> Analyzer<'a> {
    /// Creates a new analyzer.
    pub fn new(info: &'a mut ProgramInfo) -> Self {
        Self {
            info,
            in_type: false,
            in_namespace: false,
            namespace_stack: Vec::new(),
        }
    }

    /// Analyzes a module and collects all metadata.
    pub fn analyze_module(&mut self, module: &Module) {
        // First pass: collect imports and local declarations
        self.collect_imports_and_locals(module);

        // Second pass: collect value usages and other metadata
        module.visit_with(self);
    }

    /// Analyzes a script and collects all metadata.
    pub fn analyze_script(&mut self, script: &Script) {
        script.visit_with(self);
    }

    /// Collects import information and local declarations.
    fn collect_imports_and_locals(&mut self, module: &Module) {
        for item in &module.body {
            match item {
                ModuleItem::ModuleDecl(decl) => {
                    self.collect_module_decl_imports(decl);
                    self.collect_module_decl_locals(decl);
                }
                ModuleItem::Stmt(stmt) => {
                    self.collect_stmt_locals(stmt);
                }
            }
        }
    }

    /// Collects import information from a module declaration.
    fn collect_module_decl_imports(&mut self, decl: &ModuleDecl) {
        match decl {
            ModuleDecl::Import(import) => {
                // Track type-only imports
                if import.type_only {
                    for spec in &import.specifiers {
                        self.info.type_only_imports.insert(spec.local().to_id());
                    }
                    return;
                }

                let src: Atom = wtf8_to_atom(&import.src.value);
                for spec in &import.specifiers {
                    match spec {
                        ImportSpecifier::Named(named) => {
                            let local_id = named.local.to_id();
                            if named.is_type_only {
                                self.info.type_only_imports.insert(local_id);
                                continue;
                            }
                            let imported: Atom = match &named.imported {
                                Some(ModuleExportName::Ident(i)) => i.sym.clone(),
                                Some(ModuleExportName::Str(s)) => wtf8_to_atom(&s.value),
                                None => named.local.sym.clone(),
                            };
                            self.info.imports.insert(
                                local_id,
                                ImportedIdent {
                                    src: src.clone(),
                                    kind: ImportedKind::Named(imported),
                                },
                            );
                        }
                        ImportSpecifier::Default(default) => {
                            self.info.imports.insert(
                                default.local.to_id(),
                                ImportedIdent {
                                    src: src.clone(),
                                    kind: ImportedKind::Default,
                                },
                            );
                        }
                        ImportSpecifier::Namespace(ns) => {
                            self.info.imports.insert(
                                ns.local.to_id(),
                                ImportedIdent {
                                    src: src.clone(),
                                    kind: ImportedKind::Namespace,
                                },
                            );
                        }
                    }
                }
            }
            ModuleDecl::TsImportEquals(import) => {
                if import.is_type_only {
                    self.info.type_only_imports.insert(import.id.to_id());
                    return;
                }

                // Track import equals for lazy value usage marking
                if let TsModuleRef::TsEntityName(entity) = &import.module_ref {
                    let root = get_entity_root(entity);
                    self.info.import_equals_refs.insert(import.id.to_id(), root);
                }
            }
            _ => {}
        }
    }

    /// Collects local declarations from a module declaration.
    fn collect_module_decl_locals(&mut self, decl: &ModuleDecl) {
        match decl {
            ModuleDecl::ExportDecl(export) => {
                self.collect_decl_locals(&export.decl);
            }
            ModuleDecl::ExportDefaultDecl(export) => {
                if let DefaultDecl::Class(c) = &export.decl {
                    if let Some(ident) = &c.ident {
                        self.info.local_decls.insert(ident.to_id());
                    }
                } else if let DefaultDecl::Fn(f) = &export.decl {
                    if let Some(ident) = &f.ident {
                        self.info.local_decls.insert(ident.to_id());
                    }
                }
            }
            ModuleDecl::TsImportEquals(import) => {
                self.info.local_decls.insert(import.id.to_id());
            }
            _ => {}
        }
    }

    /// Collects local declarations from a statement.
    fn collect_stmt_locals(&mut self, stmt: &Stmt) {
        if let Stmt::Decl(decl) = stmt {
            self.collect_decl_locals(decl);
        }
    }

    /// Collects local declarations from a declaration.
    fn collect_decl_locals(&mut self, decl: &Decl) {
        match decl {
            Decl::Class(c) => {
                self.info.local_decls.insert(c.ident.to_id());
            }
            Decl::Fn(f) => {
                self.info.local_decls.insert(f.ident.to_id());
            }
            Decl::Var(v) => {
                for decl in &v.decls {
                    self.collect_pat_locals(&decl.name);
                }
            }
            Decl::Using(u) => {
                for decl in &u.decls {
                    self.collect_pat_locals(&decl.name);
                }
            }
            Decl::TsEnum(e) => {
                self.info.local_decls.insert(e.id.to_id());
            }
            Decl::TsModule(ns) => {
                if let TsModuleName::Ident(id) = &ns.id {
                    self.info.local_decls.insert(id.to_id());
                }
            }
            Decl::TsInterface(i) => {
                self.info.type_decls.insert(i.id.to_id());
            }
            Decl::TsTypeAlias(t) => {
                self.info.type_decls.insert(t.id.to_id());
            }
        }
    }

    /// Collects local declarations from a pattern.
    fn collect_pat_locals(&mut self, pat: &Pat) {
        match pat {
            Pat::Ident(i) => {
                self.info.local_decls.insert(i.to_id());
            }
            Pat::Array(a) => {
                for elem in a.elems.iter().flatten() {
                    self.collect_pat_locals(elem);
                }
            }
            Pat::Object(o) => {
                for prop in &o.props {
                    match prop {
                        ObjectPatProp::KeyValue(kv) => {
                            self.collect_pat_locals(&kv.value);
                        }
                        ObjectPatProp::Assign(a) => {
                            self.info.local_decls.insert(a.key.to_id());
                        }
                        ObjectPatProp::Rest(r) => {
                            self.collect_pat_locals(&r.arg);
                        }
                    }
                }
            }
            Pat::Rest(r) => {
                self.collect_pat_locals(&r.arg);
            }
            Pat::Assign(a) => {
                self.collect_pat_locals(&a.left);
            }
            Pat::Expr(_) | Pat::Invalid(_) => {}
        }
    }

    /// Marks an identifier as used as a value.
    fn mark_value_usage(&mut self, id: Id) {
        if !self.in_type {
            self.info.value_usages.insert(id);
        }
    }

    /// Marks the root identifier of an entity name as used.
    fn mark_entity_as_used(&mut self, entity: &TsEntityName) {
        match entity {
            TsEntityName::Ident(i) => {
                self.info.value_usages.insert(i.to_id());
            }
            TsEntityName::TsQualifiedName(q) => {
                // For Foo.Bar, only Foo is a value usage
                self.mark_entity_as_used(&q.left);
            }
        }
    }
}

impl Visit for Analyzer<'_> {
    // Handle `typeof X` - the X is a value usage even though it's in a type context
    fn visit_ts_type_query(&mut self, n: &TsTypeQuery) {
        match &n.expr_name {
            TsTypeQueryExpr::TsEntityName(entity) => {
                self.mark_entity_as_used(entity);
            }
            TsTypeQueryExpr::Import(import) => {
                // import("mod") - no local identifier to mark
                import.visit_with(self);
            }
        }
    }

    // Skip most type annotations - they don't contribute to value usages
    // Note: TsTypeQuery is handled above before this general skip
    fn visit_ts_type(&mut self, n: &TsType) {
        // Handle typeof specially - it references values
        if let TsType::TsTypeQuery(query) = n {
            self.visit_ts_type_query(query);
        }
        // Skip other types
    }

    fn visit_ts_type_ann(&mut self, _: &TsTypeAnn) {}

    fn visit_ts_type_param_decl(&mut self, _: &TsTypeParamDecl) {}

    fn visit_ts_type_param_instantiation(&mut self, _: &TsTypeParamInstantiation) {}

    // Skip TsExprWithTypeArgs used in `implements` and `extends` clauses.
    // These are type-level usages, not value usages.
    fn visit_ts_expr_with_type_args(&mut self, _: &TsExprWithTypeArgs) {}

    // Skip import declarations - imported identifiers should not be marked as used
    // just by visiting the import. They're only used when referenced elsewhere.
    fn visit_import_decl(&mut self, _: &ImportDecl) {}

    // Skip import specifiers as well (for safety)
    fn visit_import_specifier(&mut self, _: &ImportSpecifier) {}

    // Handle import equals declarations carefully.
    // The LHS is a declaration, not a usage - don't visit it.
    // For exports, the RHS is definitely used, so visit it.
    // For non-exports, value usages are propagated in transform.rs when the LHS is
    // used.
    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) {
        if n.is_type_only {
            return;
        }

        // If it's an export, the RHS is definitely used as a value
        if n.is_export {
            if let TsModuleRef::TsEntityName(entity) = &n.module_ref {
                self.visit_ts_entity_name(entity);
            }
        }
        // For non-exports, the LHS might only be used in type positions,
        // so we don't mark the RHS as used here. The transform will
        // propagate usage if the LHS is actually used as a value.
    }

    fn visit_ident(&mut self, n: &Ident) {
        self.mark_value_usage(n.to_id());
    }

    fn visit_member_expr(&mut self, n: &MemberExpr) {
        // Only visit the object, not computed properties (they're handled separately)
        n.obj.visit_with(self);
        if let MemberProp::Computed(c) = &n.prop {
            c.expr.visit_with(self);
        }
    }

    fn visit_prop(&mut self, n: &Prop) {
        match n {
            Prop::Shorthand(i) => {
                self.mark_value_usage(i.to_id());
            }
            Prop::KeyValue(kv) => {
                if let PropName::Computed(c) = &kv.key {
                    c.expr.visit_with(self);
                }
                kv.value.visit_with(self);
            }
            Prop::Assign(a) => {
                self.mark_value_usage(a.key.to_id());
                a.value.visit_with(self);
            }
            Prop::Getter(g) => {
                if let PropName::Computed(c) = &g.key {
                    c.expr.visit_with(self);
                }
                if let Some(body) = &g.body {
                    body.visit_with(self);
                }
            }
            Prop::Setter(s) => {
                if let PropName::Computed(c) = &s.key {
                    c.expr.visit_with(self);
                }
                s.body.visit_with(self);
            }
            Prop::Method(m) => {
                if let PropName::Computed(c) = &m.key {
                    c.expr.visit_with(self);
                }
                m.function.visit_with(self);
            }
        }
    }

    fn visit_assign_expr(&mut self, n: &AssignExpr) {
        // Visit LHS for member expressions (they use values)
        match &n.left {
            AssignTarget::Simple(s) => match s {
                SimpleAssignTarget::Ident(i) => {
                    self.mark_value_usage(i.to_id());
                }
                SimpleAssignTarget::Member(m) => {
                    m.visit_with(self);
                }
                _ => {}
            },
            AssignTarget::Pat(p) => {
                p.visit_with(self);
            }
        }
        n.right.visit_with(self);
    }

    fn visit_ts_enum_decl(&mut self, n: &TsEnumDecl) {
        // Collect enum values
        if let Some(values) = collect_enum_values(n) {
            let id = n.id.to_id();
            if n.is_const {
                self.info
                    .const_enum_values
                    .insert(id.clone(), values.clone());
                self.info.const_enum_ids.insert(id.clone());
            }
            self.info.enum_values.insert(id, values);
        }
    }

    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl) {
        if n.declare {
            return;
        }

        let old_in_namespace = self.in_namespace;
        self.in_namespace = true;

        if let TsModuleName::Ident(id) = &n.id {
            self.namespace_stack.push(id.clone());

            // Check if this namespace is non-instantiated (only type exports)
            if let Some(TsNamespaceBody::TsModuleBlock(block)) = &n.body {
                if !is_namespace_instantiated(block) {
                    self.info.non_instantiated_namespaces.insert(id.to_id());
                }
            }
        }

        // Visit namespace body to collect usages
        if let Some(body) = &n.body {
            self.visit_ts_namespace_body(body);
        }

        if let TsModuleName::Ident(_) = &n.id {
            self.namespace_stack.pop();
        }

        self.in_namespace = old_in_namespace;
    }

    fn visit_ts_namespace_body(&mut self, n: &TsNamespaceBody) {
        match n {
            TsNamespaceBody::TsModuleBlock(block) => {
                for item in &block.body {
                    match item {
                        ModuleItem::ModuleDecl(decl) => {
                            decl.visit_with(self);
                        }
                        ModuleItem::Stmt(stmt) => {
                            stmt.visit_with(self);
                        }
                    }
                }
            }
            TsNamespaceBody::TsNamespaceDecl(ns) => {
                self.namespace_stack.push(ns.id.clone());
                self.visit_ts_namespace_body(&ns.body);
                self.namespace_stack.pop();
            }
        }
    }

    fn visit_ts_entity_name(&mut self, n: &TsEntityName) {
        // Mark the root identifier as used
        let root_id = get_entity_root(n);
        self.mark_value_usage(root_id);
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        if !n.is_type_only {
            if let ModuleExportName::Ident(id) = &n.orig {
                let id_ref = id.to_id();
                self.mark_value_usage(id_ref.clone());
                // If exporting a const enum by name, track it as used as a value
                if self.info.const_enum_ids.contains(&id_ref) {
                    self.info.const_enums_as_values.insert(id_ref);
                }
                self.info.has_value_export = true;
            }
        }
    }

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        match &n.decl {
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}
            _ => {
                self.info.has_value_export = true;
            }
        }
        n.decl.visit_with(self);
    }

    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl) {
        self.info.has_value_export = true;
        n.decl.visit_with(self);
    }

    fn visit_export_default_expr(&mut self, n: &ExportDefaultExpr) {
        self.info.has_value_export = true;
        // If exporting a const enum by name, track it as used as a value
        if let Expr::Ident(id) = &*n.expr {
            let id_ref = id.to_id();
            if self.info.const_enum_ids.contains(&id_ref) {
                self.info.const_enums_as_values.insert(id_ref);
            }
        }
        n.expr.visit_with(self);
    }

    fn visit_jsx_element(&mut self, n: &JSXElement) {
        self.visit_jsx_element_name(&n.opening.name);
        for attr in &n.opening.attrs {
            attr.visit_with(self);
        }
        for child in &n.children {
            child.visit_with(self);
        }
        if let Some(closing) = &n.closing {
            self.visit_jsx_element_name(&closing.name);
        }
    }

    fn visit_jsx_element_name(&mut self, n: &JSXElementName) {
        match n {
            JSXElementName::Ident(i) => {
                // Only uppercase components are values
                if i.sym.chars().next().map_or(false, |c| c.is_uppercase()) {
                    self.mark_value_usage(i.to_id());
                }
            }
            JSXElementName::JSXMemberExpr(m) => {
                self.visit_jsx_object(&m.obj);
            }
            JSXElementName::JSXNamespacedName(_) => {}
        }
    }

    fn visit_jsx_object(&mut self, n: &JSXObject) {
        match n {
            JSXObject::Ident(i) => {
                self.mark_value_usage(i.to_id());
            }
            JSXObject::JSXMemberExpr(m) => {
                self.visit_jsx_object(&m.obj);
            }
        }
    }
}

/// Gets the root identifier from a TsEntityName.
fn get_entity_root(entity: &TsEntityName) -> Id {
    match entity {
        TsEntityName::Ident(i) => i.to_id(),
        TsEntityName::TsQualifiedName(q) => get_entity_root(&q.left),
    }
}

/// Collects enum member values.
fn collect_enum_values(e: &TsEnumDecl) -> Option<FxHashMap<Atom, TsLit>> {
    let mut values = FxHashMap::default();
    let mut current_value: Option<f64> = Some(0.0);

    for member in &e.members {
        let member_name: Atom = match &member.id {
            TsEnumMemberId::Ident(i) => i.sym.clone(),
            TsEnumMemberId::Str(s) => wtf8_to_atom(&s.value),
        };

        let value = if let Some(init) = &member.init {
            match compute_const_expr(init, &values) {
                Some(v) => {
                    if let TsLit::Number(n) = &v {
                        current_value = Some(n.value + 1.0);
                    } else {
                        current_value = None;
                    }
                    Some(v)
                }
                None => {
                    current_value = None;
                    None
                }
            }
        } else if let Some(cv) = current_value {
            current_value = Some(cv + 1.0);
            Some(TsLit::Number(Number {
                span: swc_common::DUMMY_SP,
                value: cv,
                raw: None,
            }))
        } else {
            None
        };

        if let Some(v) = value {
            values.insert(member_name, v);
        }
    }

    if values.is_empty() {
        None
    } else {
        Some(values)
    }
}

/// Computes a constant expression value.
fn compute_const_expr(expr: &Expr, enum_values: &FxHashMap<Atom, TsLit>) -> Option<TsLit> {
    match expr {
        Expr::Lit(Lit::Num(n)) => Some(TsLit::Number(n.clone())),
        Expr::Lit(Lit::Str(s)) => Some(TsLit::Str(s.clone())),
        Expr::Ident(i) => enum_values.get(&i.sym).cloned(),
        Expr::Unary(u) => {
            let arg = compute_const_expr(&u.arg, enum_values)?;
            match u.op {
                UnaryOp::Minus => {
                    if let TsLit::Number(n) = arg {
                        Some(TsLit::Number(Number {
                            span: swc_common::DUMMY_SP,
                            value: -n.value,
                            raw: None,
                        }))
                    } else {
                        None
                    }
                }
                UnaryOp::Plus => {
                    if let TsLit::Number(n) = arg {
                        Some(TsLit::Number(n))
                    } else {
                        None
                    }
                }
                UnaryOp::Tilde => {
                    if let TsLit::Number(n) = arg {
                        Some(TsLit::Number(Number {
                            span: swc_common::DUMMY_SP,
                            value: (!(n.value as i64)) as f64,
                            raw: None,
                        }))
                    } else {
                        None
                    }
                }
                _ => None,
            }
        }
        Expr::Bin(b) => {
            let left = compute_const_expr(&b.left, enum_values)?;
            let right = compute_const_expr(&b.right, enum_values)?;

            match (left, right) {
                (TsLit::Number(l), TsLit::Number(r)) => {
                    let result = match b.op {
                        BinaryOp::Add => l.value + r.value,
                        BinaryOp::Sub => l.value - r.value,
                        BinaryOp::Mul => l.value * r.value,
                        BinaryOp::Div => l.value / r.value,
                        BinaryOp::Mod => l.value % r.value,
                        BinaryOp::BitOr => ((l.value as i64) | (r.value as i64)) as f64,
                        BinaryOp::BitXor => ((l.value as i64) ^ (r.value as i64)) as f64,
                        BinaryOp::BitAnd => ((l.value as i64) & (r.value as i64)) as f64,
                        BinaryOp::LShift => ((l.value as i64) << (r.value as i64)) as f64,
                        BinaryOp::RShift => ((l.value as i64) >> (r.value as i64)) as f64,
                        BinaryOp::ZeroFillRShift => ((l.value as u64) >> (r.value as u64)) as f64,
                        BinaryOp::Exp => l.value.powf(r.value),
                        _ => return None,
                    };
                    Some(TsLit::Number(Number {
                        span: swc_common::DUMMY_SP,
                        value: result,
                        raw: None,
                    }))
                }
                (TsLit::Str(l), TsLit::Str(r)) if b.op == BinaryOp::Add => {
                    let left_str = wtf8_to_atom(&l.value);
                    let right_str = wtf8_to_atom(&r.value);
                    let concat = format!("{}{}", left_str, right_str);
                    Some(TsLit::Str(Str {
                        span: swc_common::DUMMY_SP,
                        value: concat.into(),
                        raw: None,
                    }))
                }
                _ => None,
            }
        }
        Expr::Paren(p) => compute_const_expr(&p.expr, enum_values),
        Expr::Tpl(t) if t.exprs.is_empty() => {
            if t.quasis.len() == 1 {
                Some(TsLit::Str(Str {
                    span: swc_common::DUMMY_SP,
                    value: t.quasis[0].raw.clone().into(),
                    raw: None,
                }))
            } else {
                None
            }
        }
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_parser::{parse_file_as_module, Syntax, TsSyntax};

    use super::*;

    fn analyze(code: &str) -> ProgramInfo {
        let cm = swc_common::sync::Lrc::new(swc_common::SourceMap::default());
        let fm = cm.new_source_file(swc_common::FileName::Anon.into(), code.to_string());

        let mut errors = vec![];
        let module = parse_file_as_module(
            &fm,
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
            EsVersion::latest(),
            None,
            &mut errors,
        )
        .unwrap();

        let mut info = ProgramInfo::default();
        let mut analyzer = Analyzer::new(&mut info);
        analyzer.analyze_module(&module);
        info
    }

    #[test]
    fn test_import_collection() {
        let info = analyze(
            r#"
            import { a, b as c } from "mod";
            import d from "mod2";
            import * as e from "mod3";
            console.log(a, c, d, e);
        "#,
        );

        assert!(info
            .imports
            .iter()
            .any(|(_, i)| matches!(&i.kind, ImportedKind::Named(n) if n == "a")));
        assert!(info
            .imports
            .iter()
            .any(|(_, i)| matches!(&i.kind, ImportedKind::Named(n) if n == "b")));
        assert!(info
            .imports
            .iter()
            .any(|(_, i)| matches!(&i.kind, ImportedKind::Default)));
        assert!(info
            .imports
            .iter()
            .any(|(_, i)| matches!(&i.kind, ImportedKind::Namespace)));
    }

    #[test]
    fn test_const_enum_values() {
        let info = analyze(
            r#"
            const enum Color {
                Red,
                Green = 10,
                Blue
            }
        "#,
        );

        assert!(info.const_enum_ids.iter().any(|id| id.0 == "Color"));
        let values = info
            .const_enum_values
            .iter()
            .find(|(id, _)| id.0 == "Color")
            .map(|(_, v)| v);
        assert!(values.is_some());
        let values = values.unwrap();
        assert!(matches!(values.get(&Atom::from("Red")), Some(TsLit::Number(n)) if n.value == 0.0));
        assert!(
            matches!(values.get(&Atom::from("Green")), Some(TsLit::Number(n)) if n.value == 10.0)
        );
        assert!(
            matches!(values.get(&Atom::from("Blue")), Some(TsLit::Number(n)) if n.value == 11.0)
        );
    }

    #[test]
    fn test_value_usages() {
        let info = analyze(
            r#"
            import { a, b } from "mod";
            const x = a;
            type T = typeof b;
        "#,
        );

        // 'a' should be marked as used (in value position)
        assert!(info.value_usages.iter().any(|id| id.0 == "a"));
        // 'b' should also be marked (typeof uses value)
        assert!(info.value_usages.iter().any(|id| id.0 == "b"));
    }

    #[test]
    fn test_local_decls() {
        let info = analyze(
            r#"
            const a = 1;
            let b = 2;
            var c = 3;
            function d() {}
            class E {}
        "#,
        );

        assert!(info.local_decls.iter().any(|id| id.0 == "a"));
        assert!(info.local_decls.iter().any(|id| id.0 == "b"));
        assert!(info.local_decls.iter().any(|id| id.0 == "c"));
        assert!(info.local_decls.iter().any(|id| id.0 == "d"));
        assert!(info.local_decls.iter().any(|id| id.0 == "E"));
    }
}
