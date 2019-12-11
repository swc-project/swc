pub use self::opt_chaining::optional_chaining;
use crate::{
    pass::Pass,
    util::{prepend_stmts, var::VarCollector, ExprFactory},
};
use ast::*;
use hashbrown::HashMap;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    util::move_map::MoveMap, Fold, FoldWith, Spanned, SyntaxContext, Visit, VisitWith, DUMMY_SP,
};

mod opt_chaining;
#[cfg(test)]
mod tests;

/// Strips type annotations out.
pub fn strip() -> impl Pass {
    Strip::default()
}

#[derive(Default)]
struct Strip {
    non_top_level: bool,
    scope: Scope,
    phase: Phase,
}

#[derive(Debug, Clone, Copy)]
enum Phase {
    ///
    ///  - analyze ident usages
    ///  - remove type annotations
    Analysis,
    ///
    ///  - remove type-only imports
    DropImports,
}
impl Default for Phase {
    fn default() -> Self {
        Phase::Analysis
    }
}

#[derive(Default)]
struct Scope {
    decls: HashMap<(JsWord, SyntaxContext), DeclInfo>,
    imported_idents: HashMap<(JsWord, SyntaxContext), DeclInfo>,
}

#[derive(Debug, Default)]
struct DeclInfo {
    /// interface / type alias
    has_type: bool,
    /// Var, Fn, Class
    has_concrete: bool,
}

impl Strip {
    fn handle_decl(&mut self, decl: &Decl) {
        // We don't care about stuffs which cannot be exported
        if self.non_top_level {
            return;
        }

        macro_rules! store {
            ($sym:expr, $ctxt:expr, $concrete:expr) => {{
                let entry = self.scope.decls.entry(($sym.clone(), $ctxt)).or_default();

                if $concrete {
                    entry.has_concrete = true
                } else {
                    entry.has_type = true;
                }
            }};
        }
        match *decl {
            Decl::Class(ClassDecl { ref ident, .. }) | Decl::Fn(FnDecl { ref ident, .. }) => {
                store!(ident.sym, ident.span.ctxt(), true);
            }

            Decl::Var(ref var) => {
                let mut names = vec![];
                var.decls.visit_with(&mut VarCollector { to: &mut names });

                for name in names {
                    store!(name.0, name.1, true);
                }
            }

            Decl::TsEnum(TsEnumDecl { ref id, .. })
            | Decl::TsInterface(TsInterfaceDecl { ref id, .. })
            | Decl::TsModule(TsModuleDecl {
                id: TsModuleName::Ident(ref id),
                ..
            })
            | Decl::TsTypeAlias(TsTypeAliasDecl { ref id, .. }) => {
                store!(id.sym, id.span.ctxt(), false)
            }

            Decl::TsModule(TsModuleDecl {
                id:
                    TsModuleName::Str(Str {
                        ref value, span, ..
                    }),
                ..
            }) => store!(value, span.ctxt(), false),
        }
    }
}

impl Fold<Constructor> for Strip {
    fn fold(&mut self, c: Constructor) -> Constructor {
        let c = c.fold_children(self);

        let mut stmts = vec![];

        let params = c.params.move_map(|param| match param {
            PatOrTsParamProp::Pat(..) => param,
            PatOrTsParamProp::TsParamProp(param) => {
                let (ident, param) = match param.param {
                    TsParamPropParam::Ident(i) => (i.clone(), Pat::Ident(i)),
                    TsParamPropParam::Assign(AssignPat {
                        span,
                        left: box Pat::Ident(i),
                        right,
                        ..
                    }) => (
                        i.clone(),
                        Pat::Assign(AssignPat {
                            span,
                            left: box Pat::Ident(i),
                            right,
                            type_ann: None,
                        }),
                    ),
                    _ => unreachable!("destructuring pattern inside TsParameterProperty"),
                };
                stmts.push(Stmt::Expr(box Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Expr(box ThisExpr { span: DUMMY_SP }.member(ident.clone())),
                    op: op!("="),
                    right: box Expr::Ident(ident),
                })));

                PatOrTsParamProp::Pat(param)
            }
        });

        let body = match c.body {
            Some(mut body) => {
                prepend_stmts(&mut body.stmts, stmts.into_iter());
                Some(body)
            }
            None => None,
        };

        Constructor { params, body, ..c }
    }
}

impl Fold<Vec<ClassMember>> for Strip {
    fn fold(&mut self, members: Vec<ClassMember>) -> Vec<ClassMember> {
        let members = members.fold_children(self);

        members.move_flat_map(|member| match member {
            ClassMember::Constructor(Constructor { body: None, .. }) => None,
            ClassMember::Method(ClassMethod {
                is_abstract: true, ..
            })
            | ClassMember::Method(ClassMethod {
                function: Function { body: None, .. },
                ..
            })
            | ClassMember::ClassProp(ClassProp { value: None, .. }) => None,

            _ => Some(member),
        })
    }
}

impl Fold<Vec<Pat>> for Strip {
    fn fold(&mut self, pats: Vec<Pat>) -> Vec<Pat> {
        let mut pats = pats.fold_children(self);

        // Remove this from parameter list
        pats.retain(|pat| match *pat {
            Pat::Ident(Ident {
                sym: js_word!("this"),
                ..
            }) => false,
            _ => true,
        });

        pats
    }
}

impl Fold<Vec<ModuleItem>> for Strip {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        // First pass
        let items = items.fold_children(self);

        let old = self.phase;
        self.phase = Phase::DropImports;

        // Second pass
        let mut stmts = Vec::with_capacity(items.len());
        for item in items {
            match item {
                ModuleItem::Stmt(Stmt::Empty(..)) => continue,

                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::TsEnum(e),
                    ..
                })) => {
                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                        span: e.span,
                        decl: Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: e.span,
                                name: Pat::Ident(e.id.clone()),
                                definite: false,
                                init: None,
                            }],
                        }),
                    })));
                    self.handle_enum(e, &mut stmts)
                }
                ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(e))) => {
                    // var Foo;
                    // (function (Foo) {
                    //     Foo[Foo["a"] = 0] = "a";
                    // })(Foo || (Foo = {}));

                    stmts.push(
                        Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: e.span,
                                name: Pat::Ident(e.id.clone()),
                                definite: false,
                                init: None,
                            }],
                        }))
                        .into(),
                    );
                    self.handle_enum(e, &mut stmts)
                }

                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                    function: Function { body: None, .. },
                    ..
                })))
                | ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(..)))
                | ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(..)))
                | ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(..)))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::TsInterface(..),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::TsModule(..),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::TsTypeAlias(..),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl:
                        Decl::Fn(FnDecl {
                            function: Function { body: None, .. },
                            ..
                        }),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl:
                        DefaultDecl::Fn(FnExpr {
                            function: Function { body: None, .. },
                            ..
                        }),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl: DefaultDecl::TsInterfaceDecl(..),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::TsNamespaceExport(..)) => continue,

                ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(import)) => {
                    if !import.is_export {
                        continue;
                    }

                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                        span: DUMMY_SP,
                        decl: Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(import.id),
                                init: Some(box module_ref_to_expr(import.module_ref)),
                                definite: false,
                            }],
                            declare: false,
                        }),
                    })));
                }

                ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(export)) => {
                    stmts.push(ModuleItem::ModuleDecl(
                        ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                            span: export.span(),
                            expr: export.expr,
                        })
                        .fold_with(self),
                    ))
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(mut export)) => {
                    // if specifier become empty, we remove export statement.

                    export.specifiers.retain(|s| match *s {
                        ExportSpecifier::Named(NamedExportSpecifier { ref orig, .. }) => {
                            if let Some(e) =
                                self.scope.decls.get(&(orig.sym.clone(), orig.span.ctxt()))
                            {
                                e.has_concrete
                            } else {
                                true
                            }
                        }
                        _ => true,
                    });
                    if export.specifiers.is_empty() {
                        continue;
                    }

                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport { ..export },
                    )))
                }

                _ => stmts.push(item.fold_with(self)),
            };
        }
        self.phase = old;

        stmts
    }
}

impl Strip {
    fn handle_enum(&mut self, e: TsEnumDecl, stmts: &mut Vec<ModuleItem>) {
        let id = e.id;
        stmts.push(
            Stmt::Expr(box Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: FnExpr {
                    ident: None,
                    function: Function {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        is_async: false,
                        is_generator: false,
                        type_params: Default::default(),
                        params: vec![Pat::Ident(id.clone())],
                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts: e
                                .members
                                .into_iter()
                                .enumerate()
                                .map(|(i, m)| {
                                    let value = match m.id {
                                        TsEnumMemberId::Str(s) => s,
                                        TsEnumMemberId::Ident(i) => Str {
                                            span: i.span,
                                            value: i.sym,
                                            has_escape: false,
                                        },
                                    };

                                    // Foo[Foo["a"] = 0] = "a";
                                    Stmt::Expr(box Expr::Assign(AssignExpr {
                                        span: DUMMY_SP,
                                        left: PatOrExpr::Expr(box Expr::Member(MemberExpr {
                                            obj: id.clone().as_obj(),
                                            span: DUMMY_SP,
                                            computed: true,

                                            // Foo["a"] = 0
                                            prop: box Expr::Assign(AssignExpr {
                                                span: DUMMY_SP,
                                                left: PatOrExpr::Expr(box Expr::Member(
                                                    MemberExpr {
                                                        span: DUMMY_SP,
                                                        obj: id.clone().as_obj(),
                                                        prop: m.init.unwrap_or_else(|| {
                                                            box Expr::Lit(Lit::Str(value.clone()))
                                                        }),
                                                        computed: true,
                                                    },
                                                )),
                                                op: op!("="),
                                                right: box Expr::Lit(Lit::Num(Number {
                                                    span: DUMMY_SP,
                                                    value: i as _,
                                                })),
                                            }),
                                        })),
                                        op: op!("="),
                                        right: box Expr::Lit(Lit::Str(Str {
                                            span: DUMMY_SP,
                                            value: value.value,
                                            has_escape: false,
                                        })),
                                    }))
                                })
                                .collect(),
                        }),
                        return_type: Default::default(),
                    },
                }
                .as_callee(),
                args: vec![BinExpr {
                    span: DUMMY_SP,
                    left: box Expr::Ident(id.clone()),
                    op: op!("||"),
                    right: box Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(Pat::Ident(id.clone()).into()),
                        op: op!("="),
                        right: box Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![],
                        }),
                    }),
                }
                .as_arg()],
                type_args: Default::default(),
            }))
            .into(),
        )
    }
}

impl Fold<ImportDecl> for Strip {
    fn fold(&mut self, mut import: ImportDecl) -> ImportDecl {
        match self.phase {
            Phase::Analysis => {
                macro_rules! store {
                    ($i:expr) => {{
                        self.scope
                            .imported_idents
                            .insert(($i.sym.clone(), $i.span.ctxt()), Default::default());
                    }};
                }
                for s in &import.specifiers {
                    match *s {
                        ImportSpecifier::Default(ref import) => store!(import.local),
                        ImportSpecifier::Specific(ref import) => store!(import.local),
                        ImportSpecifier::Namespace(..) => {}
                    }
                }

                import
            }
            Phase::DropImports => {
                import.specifiers.retain(|s| match *s {
                    ImportSpecifier::Default(ImportDefault { ref local, .. })
                    | ImportSpecifier::Specific(ImportSpecific { ref local, .. }) => {
                        let entry = self
                            .scope
                            .imported_idents
                            .get(&(local.sym.clone(), local.span.ctxt()));
                        match entry {
                            Some(&DeclInfo {
                                has_type: true,
                                has_concrete: false,
                            }) => false,
                            _ => true,
                        }
                    }
                    _ => true,
                });

                import
            }
        }
    }
}

impl Fold<Ident> for Strip {
    fn fold(&mut self, i: Ident) -> Ident {
        self.scope
            .imported_idents
            .entry((i.sym.clone(), i.span.ctxt()))
            .and_modify(|v| v.has_concrete = true);

        Ident {
            optional: false,
            ..i.fold_children(self)
        }
    }
}

impl Visit<TsEntityName> for Strip {
    fn visit(&mut self, name: &TsEntityName) {
        assert!(match self.phase {
            Phase::Analysis => true,
            _ => false,
        });

        match *name {
            TsEntityName::Ident(ref i) => {
                self.scope
                    .imported_idents
                    .entry((i.sym.clone(), i.span.ctxt()))
                    .and_modify(|v| v.has_type = true);
            }
            TsEntityName::TsQualifiedName(..) => name.visit_children(self),
        }
    }
}

impl Fold<Decl> for Strip {
    fn fold(&mut self, decl: Decl) -> Decl {
        let decl = validate!(decl);
        self.handle_decl(&decl);

        let old = self.non_top_level;
        self.non_top_level = true;
        let decl = decl.fold_children(self);
        self.non_top_level = old;
        validate!(decl)
    }
}

impl Fold<Stmt> for Strip {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
        let stmt = stmt.fold_children(self);

        match stmt {
            Stmt::Decl(decl) => match decl {
                Decl::TsInterface(..) | Decl::TsModule(..) | Decl::TsTypeAlias(..) => {
                    let span = decl.span();
                    Stmt::Empty(EmptyStmt { span })
                }
                _ => Stmt::Decl(decl),
            },
            _ => stmt,
        }
    }
}

macro_rules! type_to_none {
    ($T:ty) => {
        impl Fold<Option<$T>> for Strip {
            fn fold(&mut self, node: Option<$T>) -> Option<$T> {
                node.visit_with(self);

                None
            }
        }
    };
    ($T:ty,) => {
        type_to_none!($T);
    };
    ($T:ty, $($rest:tt)+) => {
        type_to_none!($T);
        type_to_none!($($rest)*);
    };
}

impl Fold<Option<Accessibility>> for Strip {
    fn fold(&mut self, _: Option<Accessibility>) -> Option<Accessibility> {
        None
    }
}

type_to_none!(TsType, TsTypeAnn, TsTypeParamDecl, TsTypeParamInstantiation);

impl Fold<Expr> for Strip {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = match expr {
            Expr::Member(MemberExpr {
                span,
                obj,
                prop,
                computed,
            }) => Expr::Member(MemberExpr {
                span,
                obj: obj.fold_with(self),
                prop: if computed { prop.fold_with(self) } else { prop },
                computed,
            }),
            _ => expr.fold_children(self),
        };

        match expr {
            Expr::TsAs(TsAsExpr { expr, .. }) => validate!(*expr),
            Expr::TsNonNull(TsNonNullExpr { expr, .. }) => validate!(*expr),
            Expr::TsTypeAssertion(TsTypeAssertion { expr, .. }) => validate!(*expr),
            Expr::TsTypeCast(TsTypeCastExpr { expr, .. }) => validate!(*expr),
            _ => validate!(expr),
        }
    }
}

impl Fold<Module> for Strip {
    fn fold(&mut self, node: Module) -> Module {
        let node = validate!(node);

        validate!(node.fold_children(self))
    }
}

fn module_ref_to_expr(r: TsModuleRef) -> Expr {
    match r {
        TsModuleRef::TsEntityName(name) => ts_entity_name_to_expr(name),
        _ => unimplemented!("export import A = B where B != TsEntityName\nB: {:?}", r),
    }
}

fn ts_entity_name_to_expr(n: TsEntityName) -> Expr {
    match n {
        TsEntityName::Ident(i) => i.into(),
        TsEntityName::TsQualifiedName(box TsQualifiedName { left, right }) => MemberExpr {
            span: DUMMY_SP,
            obj: ExprOrSuper::Expr(box ts_entity_name_to_expr(left)),
            prop: box right.into(),
            computed: false,
        }
        .into(),
    }
}
