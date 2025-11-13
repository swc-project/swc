use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;

use super::diagnostics;
use crate::context::TraverseCtx;

/// TypeScript module transformation handler
///
/// Transforms TypeScript-specific module syntax into JavaScript equivalents:
/// - `export = expression` -> `module.exports = expression`
/// - `import = require('module')` -> `const x = require('module')`
/// - `import = Namespace` -> `const x = Namespace`
pub struct TypeScriptModule {
    /// Controls whether to only remove type-only imports
    ///
    /// See: <https://babeljs.io/docs/babel-plugin-transform-typescript#onlyremovetypeimports>
    only_remove_type_imports: bool,
}

impl TypeScriptModule {
    pub fn new(only_remove_type_imports: bool) -> Self {
        Self {
            only_remove_type_imports,
        }
    }
}

impl TypeScriptModule {
    pub fn exit_program(&mut self, program: &mut Program, ctx: &mut TraverseCtx) {
        // In Babel, `use strict` is inserted by @babel/transform-modules-commonjs
        // plugin. Once we have a commonjs plugin, we can consider moving this
        // logic there.
        if ctx.module.is_commonjs() {
            let Program::Module(module) = program else {
                return;
            };

            let has_use_strict = module
                .body
                .iter()
                .any(|item| matches!(item, ModuleItem::Stmt(Stmt::Expr(ExprStmt { expr, .. })) if is_use_strict_directive(expr)));

            if !has_use_strict {
                // Insert "use strict" at the beginning
                let use_strict = ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: "use strict".into(),
                        raw: None,
                    }))),
                }));
                module.body.insert(0, use_strict);
            }
        }
    }

    /// Enter TsExportAssignment handler - called by parent TypeScript visitor
    pub fn enter_ts_export_assignment(
        &mut self,
        export_assignment: &mut TsExportAssignment,
        ctx: &mut TraverseCtx,
    ) -> Option<Stmt> {
        Some(self.transform_ts_export_assignment(export_assignment, ctx))
    }

    /// Enter TsImportEqualsDecl handler - called by parent TypeScript visitor
    pub fn enter_ts_import_equals_decl(
        &mut self,
        import_equals: &mut TsImportEqualsDecl,
        ctx: &mut TraverseCtx,
    ) -> Option<Decl> {
        if !import_equals.is_type_only {
            self.transform_ts_import_equals(import_equals, ctx)
        } else {
            None
        }
    }

    /// Transform `export = expression` to `module.exports = expression`
    ///
    /// This is a TypeScript-specific export syntax that's equivalent to
    /// CommonJS `module.exports`. It's not allowed in ES modules.
    ///
    /// # Example
    ///
    /// ```typescript
    /// export = someValue;
    /// ```
    ///
    /// Transforms to:
    ///
    /// ```javascript
    /// module.exports = someValue;
    /// ```
    fn transform_ts_export_assignment(
        &self,
        export_assignment: &mut TsExportAssignment,
        ctx: &mut TraverseCtx,
    ) -> Stmt {
        if ctx.module.is_esm() {
            ctx.error(diagnostics::export_assignment_cannot_bed_used_in_esm(
                export_assignment.span,
            ));
        }

        // Create: module.exports = expression
        let module_exports = MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Expr::Ident(Ident {
                span: DUMMY_SP,
                ctxt: Default::default(),
                sym: "module".into(),
                optional: false,
            })),
            prop: MemberProp::Ident(IdentName {
                span: DUMMY_SP,
                sym: "exports".into(),
            }),
        };

        let assignment_expr = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::Assign,
            left: AssignTarget::Simple(SimpleAssignTarget::Member(module_exports)),
            right: export_assignment.expr.clone(),
        });

        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(assignment_expr),
        })
    }

    /// Transform `import = require()` or `import = Namespace` to variable
    /// declaration
    ///
    /// TypeScript supports two forms of import equals:
    /// 1. External module reference: `import x = require('module')`
    /// 2. Namespace reference: `import x = NS.SubNS`
    ///
    /// # Examples
    ///
    /// ```typescript
    /// import module = require('module');
    /// import AliasModule = LongNameModule;
    /// ```
    ///
    /// Transforms to:
    ///
    /// ```javascript
    /// const module = require('module');
    /// var AliasModule = LongNameModule;
    /// ```
    fn transform_ts_import_equals(
        &self,
        decl: &mut TsImportEqualsDecl,
        ctx: &mut TraverseCtx,
    ) -> Option<Decl> {
        // Check if this declaration is only used in type positions
        // If so, we can remove it entirely
        // Note: In SWC, we don't have semantic analysis yet, so we skip this check
        // and rely on the annotations transformer to remove unused imports

        let binding = Pat::Ident(BindingIdent {
            id: decl.id.clone(),
            type_ann: None,
        });

        let (kind, init) = match &mut decl.module_ref {
            TsModuleRef::TsEntityName(entity_name) => {
                // Namespace reference: use `var` to match TypeScript's function-scoped
                // semantics
                let init = self.transform_ts_entity_name(entity_name);
                (VarDeclKind::Var, init)
            }
            TsModuleRef::TsExternalModuleRef(reference) => {
                // External module reference: use `const` for block-scoped, read-only
                // semantics
                if ctx.module.is_esm() {
                    ctx.error(diagnostics::import_equals_cannot_be_used_in_esm(decl.span));
                }

                // Create: require('module')
                let callee = Expr::Ident(Ident {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    sym: "require".into(),
                    optional: false,
                });
                let arguments = vec![ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Lit(Lit::Str(reference.expr.clone()))),
                }];
                let init = Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    ctxt: SyntaxContext::empty(),
                    callee: Callee::Expr(Box::new(callee)),
                    args: arguments,
                    type_args: None,
                });
                (VarDeclKind::Const, init)
            }
        };

        let decls = vec![VarDeclarator {
            span: DUMMY_SP,
            name: binding,
            init: Some(Box::new(init)),
            definite: false,
        }];

        Some(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            kind,
            declare: false,
            decls,
        })))
    }

    /// Transform TypeScript entity name to member expression
    ///
    /// Converts TypeScript type name syntax into runtime member expressions.
    ///
    /// # Examples
    ///
    /// - `X` -> `X`
    /// - `X.Y` -> `X.Y`
    /// - `X.Y.Z` -> `X.Y.Z`
    #[allow(clippy::only_used_in_recursion)]
    fn transform_ts_entity_name(&self, entity_name: &TsEntityName) -> Expr {
        match entity_name {
            TsEntityName::Ident(ident) => Expr::Ident(ident.clone()),
            TsEntityName::TsQualifiedName(qualified_name) => {
                // Recursively transform left side, then create member expression
                let obj = Box::new(self.transform_ts_entity_name(&qualified_name.left));
                Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj,
                    prop: MemberProp::Ident(qualified_name.right.clone()),
                })
            }
        }
    }
}

/// Helper to check if an expression is a "use strict" directive
fn is_use_strict_directive(expr: &Expr) -> bool {
    matches!(
        expr,
        Expr::Lit(Lit::Str(Str { value, .. })) if &**value == "use strict"
    )
}
