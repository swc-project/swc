//! Utility to add `import` / `require` statements to top of program.
//!
//! `ModuleImportsStore` contains an `IndexMap<Atom, Vec<ImportKind>>`.
//! It is stored on `TransformCtx`.
//!
//! Other transforms can add `import`s / `require`s to the store by calling
//! methods of `ModuleImportsStore`:
//!
//! ### Usage
//!
//! ```rs
//! // import { jsx as _jsx } from 'react';
//! self.ctx.module_imports.add_named_import(
//!     "react".into(),
//!     "jsx".into(),
//!     "_jsx".into(),
//!     symbol_id
//! );
//!
//! // ESM: import React from 'react';
//! // CJS: var _React = require('react');
//! self.ctx.module_imports.add_default_import(
//!     "react".into(),
//!     "React".into(),
//!     symbol_id
//! );
//! ```
//!
//! > NOTE: Using `import` or `require` is determined by the module type.
//!
//! Based on `@babel/helper-module-imports`
//! <https://github.com/nicolo-ribaudo/babel/tree/v7.25.8/packages/babel-helper-module-imports>

use std::cell::RefCell;

use indexmap::{map::Entry as IndexMapEntry, IndexMap};
use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

use crate::context::{TransformCtx, TraverseCtx};

/// Represents a local binding name for an import
type LocalBinding = Atom;

struct NamedImport {
    imported: Atom,
    local: LocalBinding,
}

enum Import {
    Named(NamedImport),
    Default(LocalBinding),
}

/// Store for `import` / `require` statements to be added at top of program.
///
/// TODO(improve-on-babel): Insertion order does not matter. We only have to use
/// `IndexMap` to produce output that's the same as Babel's.
/// Substitute `FxHashMap` once we don't need to match Babel's output exactly.
pub struct ModuleImportsStore {
    imports: RefCell<IndexMap<Atom, Vec<Import>>>,
}

// Public methods
impl ModuleImportsStore {
    /// Create new `ModuleImportsStore`.
    pub fn new() -> Self {
        Self {
            imports: RefCell::new(IndexMap::default()),
        }
    }

    /// Add default `import` or `require` to top of program.
    ///
    /// Which it will be depends on the source type.
    ///
    /// * `import named_import from 'source';` or
    /// * `var named_import = require('source');`
    ///
    /// If `front` is `true`, `import`/`require` is added to front of the
    /// `import`s/`require`s.
    pub fn add_default_import(&self, source: Atom, local: LocalBinding, front: bool) {
        self.add_import(source, Import::Default(local), front);
    }

    /// Add named `import` to top of program.
    ///
    /// `import { named_import } from 'source';`
    ///
    /// If `front` is `true`, `import` is added to front of the `import`s.
    ///
    /// Adding named `require`s is not supported, and will cause a panic later
    /// on.
    pub fn add_named_import(&self, source: Atom, imported: Atom, local: LocalBinding, front: bool) {
        self.add_import(
            source,
            Import::Named(NamedImport { imported, local }),
            front,
        );
    }

    /// Returns `true` if no imports have been scheduled for insertion.
    pub fn is_empty(&self) -> bool {
        self.imports.borrow().is_empty()
    }
}

// Internal methods
impl ModuleImportsStore {
    /// Add `import` or `require` to top of program.
    ///
    /// Which it will be depends on the source type.
    ///
    /// * `import { named_import } from 'source';` or
    /// * `var named_import = require('source');`
    ///
    /// Adding a named `require` is not supported, and will cause a panic later
    /// on.
    ///
    /// If `front` is `true`, `import`/`require` is added to front of the
    /// `import`s/`require`s. TODO(improve-on-babel): `front` option is only
    /// required to pass one of Babel's tests. Output without it is still
    /// valid. Remove this once our output doesn't need to match Babel exactly.
    fn add_import(&self, source: Atom, import: Import, front: bool) {
        match self.imports.borrow_mut().entry(source) {
            IndexMapEntry::Occupied(mut entry) => {
                entry.get_mut().push(import);
                if front && entry.index() != 0 {
                    entry.move_index(0);
                }
            }
            IndexMapEntry::Vacant(entry) => {
                let named_imports = vec![import];
                if front {
                    entry.shift_insert(0, named_imports);
                } else {
                    entry.insert(named_imports);
                }
            }
        }
    }

    /// Insert `import` / `require` statements at top of program.
    pub(crate) fn insert_into_program(&self, transform_ctx: &TransformCtx, ctx: &mut TraverseCtx) {
        if transform_ctx.module.is_script() {
            self.insert_require_statements(transform_ctx, ctx);
        } else {
            self.insert_import_statements(transform_ctx, ctx);
        }
    }

    fn insert_import_statements(&self, transform_ctx: &TransformCtx, _ctx: &TraverseCtx) {
        let mut imports = self.imports.borrow_mut();
        let stmts = imports
            .drain(..)
            .map(|(source, names)| Self::get_import(source, names));
        transform_ctx.top_level_statements.insert_statements(stmts);
    }

    fn insert_require_statements(&self, transform_ctx: &TransformCtx, _ctx: &mut TraverseCtx) {
        let mut imports = self.imports.borrow_mut();
        if imports.is_empty() {
            return;
        }

        let stmts = imports
            .drain(..)
            .map(|(source, names)| Self::get_require(source, names));
        transform_ctx.top_level_statements.insert_statements(stmts);
    }

    fn get_import(source: Atom, names: Vec<Import>) -> Stmt {
        let specifiers = names
            .into_iter()
            .map(|import| match import {
                Import::Named(import) => ImportSpecifier::Named(ImportNamedSpecifier {
                    span: DUMMY_SP,
                    local: Ident::new(import.local, DUMMY_SP),
                    imported: Some(ModuleExportName::Ident(Ident::new(
                        import.imported,
                        DUMMY_SP,
                    ))),
                    is_type_only: false,
                }),
                Import::Default(local) => ImportSpecifier::Default(ImportDefaultSpecifier {
                    span: DUMMY_SP,
                    local: Ident::new(local, DUMMY_SP),
                }),
            })
            .collect();

        Stmt::Decl(Decl::Import(ImportDecl {
            span: DUMMY_SP,
            specifiers,
            src: Box::new(Str {
                span: DUMMY_SP,
                value: source,
                raw: None,
            }),
            type_only: false,
            with: None,
            phase: Default::default(),
        }))
    }

    fn get_require(source: Atom, names: Vec<Import>) -> Stmt {
        let Some(Import::Default(local)) = names.into_iter().next() else {
            unreachable!()
        };

        let callee = Expr::Ident(Ident::new("require".into(), DUMMY_SP));
        let args = vec![ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: source,
                raw: None,
            }))),
        }];

        let init = Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(Box::new(callee)),
            args,
            type_args: None,
        });

        let id = Pat::Ident(BindingIdent::from(Ident::new(local, DUMMY_SP)));

        let decl = VarDeclarator {
            span: DUMMY_SP,
            name: id,
            init: Some(Box::new(init)),
            definite: false,
        };

        Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            declare: false,
            decls: vec![decl],
        })))
    }
}
