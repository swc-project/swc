use swc_common::{errors::HANDLER, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{member_expr, private_ident, quote_ident, quote_str, ExprFactory};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitWith,
};

use crate::TsImportExportAssignConfig;

pub fn import_export_assign(
    unresolved_mark: Mark,
    config: TsImportExportAssignConfig,
) -> impl Fold + VisitMut {
    as_folder(ImportExportAssign {
        unresolved_mark,
        config,
        export_assign: None,
        found_import_assign: false,
        found_export_assign: false,
    })
}

struct ImportExportAssign {
    unresolved_mark: Mark,
    config: TsImportExportAssignConfig,
    export_assign: Option<TsExportAssignment>,
    found_import_assign: bool,
    found_export_assign: bool,
}

impl VisitMut for ImportExportAssign {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        n.visit_with(self);

        if !self.found_import_assign && !self.found_export_assign {
            return;
        }

        let mut stmts: Vec<ModuleItem> = Vec::with_capacity(n.len() + 2);

        let create_require = private_ident!("_createRequire");
        let require = private_ident!("__require");

        if self.found_import_assign && self.config == TsImportExportAssignConfig::NodeNext {
            stmts.push(
                ModuleDecl::Import(ImportDecl {
                    span: DUMMY_SP,
                    specifiers: vec![ImportNamedSpecifier {
                        span: DUMMY_SP,
                        local: create_require.clone(),
                        imported: Some(quote_ident!("createRequire").into()),
                        is_type_only: false,
                    }
                    .into()],
                    src: quote_str!("module"),
                    type_only: false,
                    asserts: None,
                })
                .into(),
            );

            // const __require = _createRequire(import.meta.url);
            stmts.push(
                Stmt::Decl(
                    create_require
                        .as_call(
                            DUMMY_SP,
                            vec![MetaPropExpr {
                                span: DUMMY_SP,
                                kind: MetaPropKind::ImportMeta,
                            }
                            .make_member(quote_ident!("url"))
                            .as_arg()],
                        )
                        .into_var_decl(VarDeclKind::Const, require.clone().into())
                        .into(),
                )
                .into(),
            );
        }

        let cjs_require = quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "require");

        for item in n.drain(..) {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(TsImportEqualsDecl {
                    span,
                    declare: false,
                    is_export,
                    is_type_only: false,
                    id,
                    module_ref: TsModuleRef::TsExternalModuleRef(TsExternalModuleRef { expr, .. }),
                })) if self.config != TsImportExportAssignConfig::Preserve => match self.config {
                    TsImportExportAssignConfig::Classic => {
                        // const foo = require("foo")
                        let mut var_decl = cjs_require
                            .clone()
                            .as_call(DUMMY_SP, vec![expr.as_arg()])
                            .into_var_decl(VarDeclKind::Const, id.clone().into());
                        var_decl.span = span;

                        stmts.push(Stmt::Decl(var_decl.into()).into());

                        // exports.foo = foo;
                        if is_export {
                            stmts.push(
                                id.make_assign_to(
                                    op!("="),
                                    member_expr!(DUMMY_SP, exports.foo).into(),
                                )
                                .into_stmt()
                                .into(),
                            )
                        }
                    }
                    TsImportExportAssignConfig::EsNext => {
                        // TS1202
                        HANDLER.with(|handler| {
                            handler
                                .struct_span_err(
                                    span,
                                    r#"Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead."#,
                                )
                                .emit()
                        });
                    }
                    TsImportExportAssignConfig::NodeNext => {
                        // const foo = __require("foo")
                        stmts.push(
                            Stmt::Decl(
                                require
                                    .clone()
                                    .as_call(span, vec![expr.as_arg()])
                                    .into_var_decl(VarDeclKind::Const, id.clone().into())
                                    .into(),
                            )
                            .into(),
                        );

                        // export { foo }
                        if is_export {
                            stmts.push(ModuleItem::ModuleDecl(
                                NamedExport {
                                    span,
                                    specifiers: vec![ExportNamedSpecifier {
                                        span,
                                        orig: id.into(),
                                        exported: None,
                                        is_type_only: false,
                                    }
                                    .into()],
                                    src: None,
                                    type_only: false,
                                    asserts: None,
                                }
                                .into(),
                            ))
                        }
                    }
                    TsImportExportAssignConfig::Preserve => unreachable!(),
                },
                ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(export_assign)) => {
                    self.export_assign.get_or_insert(export_assign);
                }
                _ => {
                    stmts.push(item);
                }
            }
        }

        if let Some(export_assign) = self.export_assign.take() {
            match self.config {
                TsImportExportAssignConfig::Classic => {
                    let TsExportAssignment { expr, span } = export_assign;

                    stmts.push(
                        Stmt::Expr(ExprStmt {
                            span,
                            expr: Box::new(
                                expr.make_assign_to(
                                    op!("="),
                                    member_expr!(
                                        DUMMY_SP.apply_mark(self.unresolved_mark),
                                        module.exports
                                    )
                                    .as_pat_or_expr(),
                                ),
                            ),
                        })
                        .into(),
                    )
                }
                TsImportExportAssignConfig::Preserve => {
                    stmts.push(ModuleDecl::TsExportAssignment(export_assign).into())
                }
                TsImportExportAssignConfig::EsNext | TsImportExportAssignConfig::NodeNext => {
                    // TS1203
                    HANDLER.with(|handler| {
                        handler
                            .struct_span_err(
                                export_assign.span,
                                r#"Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead."#,
                            )
                            .emit()
                    });
                }
            }
        }

        *n = stmts;
    }
}

impl Visit for ImportExportAssign {
    noop_visit_type!();

    fn visit_module_items(&mut self, n: &[ModuleItem]) {
        // `export =` is usually at the end of the code, let's scan from both sides
        for item in AlternateEndIterator(n.iter(), false) {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(..)) => {
                    self.found_import_assign = true
                }
                ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(..)) => {
                    self.found_export_assign = true;
                }
                _ => {
                    if self.found_import_assign && self.found_export_assign {
                        return;
                    }
                }
            }
        }
    }
}

struct AlternateEndIterator<T>(T, bool);
impl<T: DoubleEndedIterator> Iterator for AlternateEndIterator<T> {
    type Item = T::Item;

    fn next(&mut self) -> Option<T::Item> {
        self.1 = !self.1;
        if self.1 {
            self.0.next()
        } else {
            self.0.next_back()
        }
    }
}
