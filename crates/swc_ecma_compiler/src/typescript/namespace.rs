use swc_common::{Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::quote_ident;

use super::{diagnostics, TypeScriptOptions};
use crate::context::TraverseCtx;

pub struct TypeScriptNamespace {
    // Options
    allow_namespaces: bool,
}

impl TypeScriptNamespace {
    pub fn new(options: &TypeScriptOptions) -> Self {
        Self {
            allow_namespaces: options.allow_namespaces,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for TypeScriptNamespace {
    // `namespace Foo { }` -> `let Foo; (function (_Foo) { })(Foo || (Foo = {}));`
    fn enter_program(&mut self, program: &mut Program, _ctx: &mut TraverseCtx) {
        // Only process Module programs, not Script
        let Program::Module(module) = program else {
            return;
        };

        // namespace declaration is only allowed at the top level
        if !has_namespace(&module.body) {
            return;
        }

        // Recreate the statements vec for memory efficiency.
        let mut new_stmts = Vec::new();

        for mut stmt in std::mem::take(&mut module.body) {
            let should_push = match &mut stmt {
                ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(decl))) => {
                    if !self.allow_namespaces {
                        _ctx.error(diagnostics::namespace_not_supported(decl.span));
                    }

                    let decl = std::mem::replace(
                        decl,
                        Box::new(TsModuleDecl {
                            span: DUMMY_SP,
                            declare: true,
                            global: false,
                            namespace: false,
                            id: TsModuleName::Ident(quote_ident!(
                                SyntaxContext::empty(),
                                "__dummy"
                            )),
                            body: None,
                        }),
                    );

                    self.handle_nested(
                        decl,
                        /* is_export */ false,
                        &mut new_stmts,
                        None,
                        _ctx,
                    );
                    false
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) => {
                    if let Decl::TsModule(decl) = &mut export_decl.decl {
                        if !decl.declare {
                            if !self.allow_namespaces {
                                _ctx.error(diagnostics::namespace_not_supported(decl.span));
                            }

                            let decl = std::mem::replace(
                                decl,
                                Box::new(TsModuleDecl {
                                    span: DUMMY_SP,
                                    declare: true,
                                    global: false,
                                    namespace: false,
                                    id: TsModuleName::Ident(quote_ident!(
                                        SyntaxContext::empty(),
                                        "__dummy"
                                    )),
                                    body: None,
                                }),
                            );

                            self.handle_nested(
                                decl,
                                /* is_export */ true,
                                &mut new_stmts,
                                None,
                                _ctx,
                            );
                            false
                        } else {
                            true
                        }
                    } else {
                        true
                    }
                }
                _ => true,
            };

            if should_push {
                new_stmts.push(stmt);
            }
        }

        module.body = new_stmts;
    }
}

impl TypeScriptNamespace {
    fn handle_nested(
        &self,
        mut decl: Box<TsModuleDecl>,
        is_export: bool,
        parent_stmts: &mut Vec<ModuleItem>,
        parent_ident: Option<&Ident>,
        ctx: &TraverseCtx,
    ) {
        if decl.declare {
            return;
        }

        // Skip empty declaration e.g. `namespace x;`
        let TsModuleName::Ident(ident) = &decl.id else {
            ctx.error(diagnostics::ambient_module_nested(decl.span));
            return;
        };

        let ident = ident.clone();

        let Some(body) = decl.body.take() else {
            return;
        };

        let namespace_top_level = match body {
            TsNamespaceBody::TsModuleBlock(block) => block.body,
            // We handle `namespace X.Y {}` as if it was
            //   namespace X {
            //     export namespace Y {}
            //   }
            TsNamespaceBody::TsNamespaceDecl(nested_decl) => {
                let ts_module_decl = TsModuleDecl {
                    span: nested_decl.span,
                    declare: nested_decl.declare,
                    global: nested_decl.global,
                    namespace: true,
                    id: TsModuleName::Ident(nested_decl.id.clone()),
                    body: Some(TsNamespaceBody::TsNamespaceDecl(nested_decl)),
                };
                let export_decl = ModuleDecl::ExportDecl(ExportDecl {
                    span: DUMMY_SP,
                    decl: Decl::TsModule(Box::new(ts_module_decl)),
                });
                vec![ModuleItem::ModuleDecl(export_decl)]
            }
        };

        let uid_ident = quote_ident!(SyntaxContext::empty(), format!("_{}", ident.sym));

        let mut new_stmts = Vec::new();

        for stmt in namespace_top_level {
            match stmt {
                ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(nested_decl))) => {
                    self.handle_nested(
                        nested_decl,
                        /* is_export */ false,
                        &mut new_stmts,
                        None,
                        ctx,
                    );
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) => {
                    match export_decl.decl {
                        Decl::TsModule(module_decl) => {
                            if !module_decl.declare {
                                self.handle_nested(
                                    module_decl,
                                    /* is_export */ false,
                                    &mut new_stmts,
                                    Some(&uid_ident),
                                    ctx,
                                );
                            }
                        }
                        Decl::TsEnum(enum_decl) => {
                            if !enum_decl.declare {
                                let enum_id = enum_decl.id.clone();
                                new_stmts
                                    .push(ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(enum_decl))));
                                Self::add_declaration(&uid_ident, &enum_id, &mut new_stmts);
                            }
                        }
                        Decl::Class(class_decl) => {
                            let class_ident = class_decl.ident.clone();
                            new_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(class_decl))));
                            Self::add_declaration(&uid_ident, &class_ident, &mut new_stmts);
                        }
                        Decl::Fn(fn_decl) => {
                            new_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(fn_decl.clone()))));
                            Self::add_declaration(&uid_ident, &fn_decl.ident, &mut new_stmts);
                        }
                        Decl::Var(var_decl) => {
                            // Check that all are const
                            for _declarator in &var_decl.decls {
                                if var_decl.kind != VarDeclKind::Const {
                                    ctx.error(diagnostics::namespace_exporting_non_const(
                                        var_decl.span,
                                    ));
                                }
                            }

                            let stmts = Self::handle_variable_declaration(var_decl, &uid_ident);
                            new_stmts.extend(stmts);
                        }
                        _ => {}
                    }
                }
                _ => new_stmts.push(stmt),
            }
        }

        // Create variable declaration
        let var_decl = VarDecl {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            kind: VarDeclKind::Let,
            declare: false,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(BindingIdent {
                    id: ident.clone(),
                    type_ann: None,
                }),
                init: None,
                definite: false,
            }],
        };

        if is_export {
            parent_stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                span: DUMMY_SP,
                decl: Decl::Var(Box::new(var_decl)),
            })));
        } else {
            parent_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(var_decl)))));
        }

        parent_stmts.push(ModuleItem::Stmt(Self::transform_namespace(
            decl.span,
            &uid_ident,
            &ident,
            parent_ident,
            new_stmts,
        )));
    }

    // `namespace Foo { }` -> `let Foo; (function (_Foo) { })(Foo || (Foo = {}));`
    fn transform_namespace(
        span: Span,
        param_ident: &Ident,
        ident: &Ident,
        parent_ident: Option<&Ident>,
        func_body: Vec<ModuleItem>,
    ) -> Stmt {
        // Convert ModuleItems to Stmts
        let stmts: Vec<Stmt> = func_body
            .into_iter()
            .map(|item| match item {
                ModuleItem::Stmt(stmt) => stmt,
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) => {
                    Stmt::Decl(export_decl.decl)
                }
                _ => Stmt::Empty(EmptyStmt { span: DUMMY_SP }),
            })
            .collect();

        // `(function (_N) { var x; })(N || (N = {}))`;
        let params = vec![Param {
            span: DUMMY_SP,
            decorators: vec![],
            pat: Pat::Ident(BindingIdent {
                id: param_ident.clone(),
                type_ann: None,
            }),
        }];

        let body = BlockStmt {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            stmts,
        };

        let function_expr = Expr::Fn(FnExpr {
            ident: None,
            function: Box::new(Function {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty(),
                params,
                decorators: vec![],
                body: Some(body),
                is_generator: false,
                is_async: false,
                type_params: None,
                return_type: None,
            }),
        });

        let callee = Expr::Paren(ParenExpr {
            span: DUMMY_SP,
            expr: Box::new(function_expr),
        });

        // M
        let logical_left = Expr::Ident(ident.clone());

        // (_N.M = {}) or (N = {})
        let mut logical_right = if let Some(parent_ident) = parent_ident {
            // _N.M
            let member_expr = MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(parent_ident.clone())),
                prop: MemberProp::Ident(ident.clone().into()),
            };

            let assign_left = AssignTarget::Simple(SimpleAssignTarget::Member(member_expr));

            let assign_right = Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: vec![],
            });

            Expr::Paren(ParenExpr {
                span: DUMMY_SP,
                expr: Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: assign_left,
                    right: Box::new(assign_right),
                })),
            })
        } else {
            // N
            let assign_left = AssignTarget::Simple(SimpleAssignTarget::Ident(ident.clone().into()));

            let assign_right = Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: vec![],
            });

            Expr::Paren(ParenExpr {
                span: DUMMY_SP,
                expr: Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: assign_left,
                    right: Box::new(assign_right),
                })),
            })
        };

        // (M = _N.M || (_N.M = {}))
        if let Some(parent_ident) = parent_ident {
            let assign_left = AssignTarget::Simple(SimpleAssignTarget::Ident(ident.clone().into()));

            let logical_left = Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(parent_ident.clone())),
                prop: MemberProp::Ident(ident.clone().into()),
            });

            let assign_right = Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::LogicalOr,
                left: Box::new(logical_left),
                right: Box::new(logical_right),
            });

            logical_right = Expr::Paren(ParenExpr {
                span: DUMMY_SP,
                expr: Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: assign_left,
                    right: Box::new(assign_right),
                })),
            });
        }

        let expr = Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: BinaryOp::LogicalOr,
            left: Box::new(logical_left),
            right: Box::new(logical_right),
        });

        let arguments = vec![ExprOrSpread {
            spread: None,
            expr: Box::new(expr),
        }];

        let call_expr = Expr::Call(CallExpr {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            callee: Callee::Expr(Box::new(callee)),
            args: arguments,
            type_args: None,
        });

        Stmt::Expr(ExprStmt {
            span,
            expr: Box::new(call_expr),
        })
    }

    /// Add assignment statement for decl id
    /// function id() {} -> function id() {}; Name.id = id;
    fn add_declaration(
        namespace_ident: &Ident,
        value_ident: &Ident,
        new_stmts: &mut Vec<ModuleItem>,
    ) {
        let assignment_expr = Self::create_assignment_expr(namespace_ident, value_ident);
        new_stmts.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(assignment_expr),
        })));
    }

    // namespace_ident.value_ident = value_ident
    fn create_assignment_expr(namespace_ident: &Ident, value_ident: &Ident) -> Expr {
        let member_expr = MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Expr::Ident(namespace_ident.clone())),
            prop: MemberProp::Ident(value_ident.clone().into()),
        };

        let left = AssignTarget::Simple(SimpleAssignTarget::Member(member_expr));

        let right = Expr::Ident(value_ident.clone());

        Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::Assign,
            left,
            right: Box::new(right),
        })
    }

    /// Convert `export const foo = 1` to `Namespace.foo = 1`;
    fn handle_variable_declaration(
        var_decl: Box<VarDecl>,
        namespace_ident: &Ident,
    ) -> Vec<ModuleItem> {
        let is_all_binding_identifier = var_decl
            .decls
            .iter()
            .all(|declarator| matches!(declarator.name, Pat::Ident(_)));

        // `export const a = 1` transforms to `const a = N.a = 1`
        if is_all_binding_identifier {
            let mut new_decls = Vec::new();
            for declarator in var_decl.decls {
                if let Pat::Ident(ref binding_ident) = declarator.name {
                    let property_ident = &binding_ident.id;

                    if let Some(init) = declarator.init {
                        let member_expr = MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(Expr::Ident(namespace_ident.clone())),
                            prop: MemberProp::Ident(property_ident.clone().into()),
                        };

                        let assign_expr = Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: AssignOp::Assign,
                            left: AssignTarget::Simple(SimpleAssignTarget::Member(member_expr)),
                            right: init,
                        });

                        new_decls.push(VarDeclarator {
                            span: declarator.span,
                            name: declarator.name,
                            init: Some(Box::new(assign_expr)),
                            definite: false,
                        });
                    } else {
                        new_decls.push(declarator);
                    }
                } else {
                    new_decls.push(declarator);
                }
            }

            return vec![ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: var_decl.span,
                ctxt: SyntaxContext::empty(),
                kind: var_decl.kind,
                declare: false,
                decls: new_decls,
            }))))];
        }

        // Now we have pattern in declarators
        // `export const [a] = 1` transforms to `const [a] = 1; N.a = a`
        let mut result = vec![ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl.clone())))];

        for declarator in &var_decl.decls {
            extract_idents_from_pat(&declarator.name, namespace_ident, &mut result);
        }

        result
    }
}

/// Extract identifiers from a pattern and create assignments
fn extract_idents_from_pat(pat: &Pat, namespace_ident: &Ident, result: &mut Vec<ModuleItem>) {
    match pat {
        Pat::Ident(binding_ident) => {
            let ident = &binding_ident.id;
            let assignment_expr =
                TypeScriptNamespace::create_assignment_expr(namespace_ident, ident);
            result.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(assignment_expr),
            })));
        }
        Pat::Array(array_pat) => {
            for elem in &array_pat.elems {
                if let Some(elem) = elem {
                    extract_idents_from_pat(elem, namespace_ident, result);
                }
            }
        }
        Pat::Object(object_pat) => {
            for prop in &object_pat.props {
                match prop {
                    ObjectPatProp::KeyValue(kv) => {
                        extract_idents_from_pat(&kv.value, namespace_ident, result);
                    }
                    ObjectPatProp::Assign(assign) => {
                        let ident = &assign.key;
                        let assignment_expr =
                            TypeScriptNamespace::create_assignment_expr(namespace_ident, ident);
                        result.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(assignment_expr),
                        })));
                    }
                    ObjectPatProp::Rest(rest) => {
                        extract_idents_from_pat(&rest.arg, namespace_ident, result);
                    }
                }
            }
        }
        Pat::Rest(rest_pat) => {
            extract_idents_from_pat(&rest_pat.arg, namespace_ident, result);
        }
        Pat::Assign(assign_pat) => {
            extract_idents_from_pat(&assign_pat.left, namespace_ident, result);
        }
        _ => {}
    }
}

/// Check if the statements contain a namespace declaration
fn has_namespace(stmts: &[ModuleItem]) -> bool {
    stmts.iter().any(|stmt| match stmt {
        ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(_))) => true,
        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl)) => {
            matches!(decl.decl, Decl::TsModule(_))
        }
        _ => false,
    })
}
