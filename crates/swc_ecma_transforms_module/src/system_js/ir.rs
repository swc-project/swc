use indexmap::IndexMap;
use swc_atoms::Atom;
use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

use crate::{module_record::ImportAttributeRecord, SpanCtx};

#[derive(Clone, Debug)]
pub(super) struct ExportName {
    pub name: Atom,
    pub span: SpanCtx,
}

#[derive(Clone, Debug, Default)]
pub(super) struct ExportTable {
    pub announced: Vec<ExportName>,
    pub local_exports: IndexMap<Id, Vec<ExportName>>,
}

impl ExportTable {
    pub fn add_local(&mut self, local: Id, export: ExportName) {
        self.announced.push(export.clone());
        self.local_exports.entry(local).or_default().push(export);
    }

    pub fn add_indirect(&mut self, export: ExportName) {
        self.announced.push(export);
    }

    pub fn exports_for(&self, id: &Id) -> Option<&[ExportName]> {
        self.local_exports.get(id).map(Vec::as_slice)
    }
}

/// Export value initialized in the `System.register` declaration callback.
#[derive(Debug)]
pub(super) struct ExportInit {
    pub export: ExportName,
    pub value: Box<Expr>,
}

impl ExportInit {
    pub fn new(export: ExportName, value: Box<Expr>) -> Self {
        Self { export, value }
    }
}

#[derive(Debug)]
pub(super) enum SetterOp {
    Import {
        local: Ident,
        imported: Option<Atom>,
    },
    ReExport {
        export: ExportName,
        imported: Atom,
    },
    ReExportNamespace {
        export: ExportName,
    },
    StarExport,
}

#[derive(Debug)]
pub(super) struct DependencySlot {
    pub request: Atom,
    pub span: SpanCtx,
    pub attributes: Vec<ImportAttributeRecord>,
    pub namespace: Ident,
    pub setter_ops: Vec<SetterOp>,
}

#[derive(Debug)]
pub(super) enum ExecuteStmt {
    Source(Stmt),
    Assign {
        left: AssignTarget,
        right: Box<Expr>,
    },
    ExportAssign {
        exports: Vec<ExportName>,
        local: Ident,
        right: Box<Expr>,
    },
    ExportValue {
        export: ExportName,
        value: Box<Expr>,
    },
    /// SystemJS batch export update: `_export(value)`.
    ExportBatch {
        value: Box<Expr>,
    },
    ExportNames {
        exports: Vec<ExportName>,
        value: Ident,
    },
}

impl ExecuteStmt {
    pub fn source(stmt: Stmt) -> Self {
        Self::Source(stmt)
    }

    pub fn assign(left: AssignTarget, right: Box<Expr>) -> Self {
        Self::Assign { left, right }
    }

    pub fn export_assign(exports: &[ExportName], local: Ident, right: Box<Expr>) -> Self {
        Self::ExportAssign {
            exports: exports.to_vec(),
            local,
            right,
        }
    }

    pub fn export_value(export: ExportName, value: Box<Expr>) -> Self {
        Self::ExportValue { export, value }
    }

    pub fn export_batch(value: Box<Expr>) -> Self {
        Self::ExportBatch { value }
    }

    pub fn export_names(exports: &[ExportName], value: Ident) -> Self {
        Self::ExportNames {
            exports: exports.to_vec(),
            value,
        }
    }
}

impl<V> VisitMutWith<V> for ExecuteStmt
where
    V: ?Sized + VisitMut,
{
    fn visit_mut_with(&mut self, visitor: &mut V) {
        self.visit_mut_children_with(visitor);
    }

    fn visit_mut_children_with(&mut self, visitor: &mut V) {
        // ExecuteStmt traversal intentionally exposes only user-authored
        // expressions/statements. SystemJS scaffold such as export names and
        // synthetic assignment targets is emitted later.
        match self {
            ExecuteStmt::Source(stmt) => {
                stmt.visit_mut_with(visitor);
            }
            ExecuteStmt::Assign { left, right } => {
                left.visit_mut_with(visitor);
                right.visit_mut_with(visitor);
            }
            ExecuteStmt::ExportAssign { right, .. } => {
                right.visit_mut_with(visitor);
            }
            ExecuteStmt::ExportValue { value, .. } => {
                value.visit_mut_with(visitor);
            }
            ExecuteStmt::ExportBatch { value } => {
                value.visit_mut_with(visitor);
            }
            ExecuteStmt::ExportNames { .. } => {}
        }
    }
}

impl<V> VisitWith<V> for ExecuteStmt
where
    V: ?Sized + Visit,
{
    fn visit_with(&self, visitor: &mut V) {
        self.visit_children_with(visitor);
    }

    fn visit_children_with(&self, visitor: &mut V) {
        match self {
            ExecuteStmt::Source(stmt) => {
                stmt.visit_with(visitor);
            }
            ExecuteStmt::Assign { left, right } => {
                left.visit_with(visitor);
                right.visit_with(visitor);
            }
            ExecuteStmt::ExportAssign { right, .. } => {
                right.visit_with(visitor);
            }
            ExecuteStmt::ExportValue { value, .. } => {
                value.visit_with(visitor);
            }
            ExecuteStmt::ExportBatch { value } => {
                value.visit_with(visitor);
            }
            ExecuteStmt::ExportNames { .. } => {}
        }
    }
}

#[derive(Debug)]
pub(super) struct SystemModule {
    pub dependencies: Vec<DependencySlot>,
    pub exports: ExportTable,
    pub export_inits: Vec<ExportInit>,
    pub wrapper_vars: Vec<Ident>,
    pub wrapper_fns: Vec<FnDecl>,
    pub wrapper_stmts: Vec<Stmt>,
    pub execute_stmts: Vec<ExecuteStmt>,
    pub export_setters: Ident,
    pub needs_export_setters: bool,
    pub async_execute: bool,
}

impl SystemModule {
    pub fn new(exports: ExportTable) -> Self {
        Self {
            dependencies: Default::default(),
            exports,
            export_inits: Default::default(),
            wrapper_vars: Default::default(),
            wrapper_fns: Default::default(),
            wrapper_stmts: Default::default(),
            execute_stmts: Default::default(),
            export_setters: private_ident!("_export_setters"),
            needs_export_setters: false,
            async_execute: false,
        }
    }
}

pub(super) fn export_name(name: Atom, span: SpanCtx) -> ExportName {
    ExportName { name, span }
}
