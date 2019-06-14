pub use self::export::{ExportExtra, ExportInfo};
use self::{
    scope::{Scope, ScopeKind, VarInfo},
    util::{PatExt, TypeExt, TypeRefExt},
};
use super::Checker;
use crate::{errors::Error, loader::Load, Rule};
use fxhash::{FxHashMap, FxHashSet};
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use std::{borrow::Cow, path::PathBuf, sync::Arc};
use swc_atoms::{js_word, JsWord};
use swc_common::{Span, Spanned, Visit, VisitWith};
use swc_ecma_ast::*;

mod defaults;
mod export;
mod expr;
mod scope;
#[cfg(test)]
mod tests;
mod type_facts;
mod util;

struct Analyzer<'a, 'b> {
    info: Info,
    /// TODO(kdy1): Use vector (for performance)
    resolved_imports: FxHashMap<JsWord, Arc<ExportInfo>>,
    /// TODO(kdy1): Use vector (for performance)
    errored_imports: FxHashSet<JsWord>,
    pending_exports: Vec<((JsWord, Span), Box<Expr>)>,
    scope: Scope<'a>,
    path: Arc<PathBuf>,
    loader: &'b dyn Load,
    rule: Rule,
}

impl<T> Visit<Vec<T>> for Analyzer<'_, '_>
where
    T: VisitWith<Self> + for<'any> VisitWith<ImportFinder<'any>> + Send + Sync,
    Vec<T>: VisitWith<Self>,
{
    fn visit(&mut self, items: &Vec<T>) {
        // We first load imports.

        let mut imports: Vec<ImportInfo> = vec![];

        items.iter().for_each(|item| {
            // EXtract imports
            item.visit_with(&mut ImportFinder { to: &mut imports });
            // item.visit_with(self);
        });

        let import_results = imports
            .par_iter()
            .map(|import| {
                self.loader
                    .load(self.path.clone(), &*import)
                    .map_err(|err| {
                        //
                        (import, err)
                    })
            })
            .collect::<Vec<_>>();

        for res in import_results {
            match res {
                Ok(import) => {
                    self.resolved_imports.extend(import);
                }
                Err((import, mut err)) => {
                    match err {
                        Error::ModuleLoadFailed { ref mut errors, .. } => {
                            self.info.errors.append(errors);
                        }
                        _ => {}
                    }
                    // Mark errored imported types as any to prevent useless errors
                    self.errored_imports.extend(
                        import
                            .items
                            .iter()
                            .map(|&Specifier { ref local, .. }| local.0.clone()),
                    );

                    self.info.errors.push(err);
                }
            }
        }

        items.visit_children(self);

        self.handle_pending_exports();
    }
}

impl Visit<TsModuleDecl> for Analyzer<'_, '_> {
    fn visit(&mut self, decl: &TsModuleDecl) {
        // TODO(kdy1): Uncomment the line below.
        // Uncommenting the line somehow returned without excuting subsequent codes.
        // decl.visit_children(self);

        // println!("after: visit<TsModuleDecl>: {:?}", decl.id);

        match decl.body {
            None => {
                return;
            }
            Some(ref body) => match *body {
                TsNamespaceBody::TsModuleBlock(TsModuleBlock { ref body, .. }) => {
                    let id = match decl.id {
                        TsModuleName::Ident(ref ident) => ident,
                        TsModuleName::Str(..) => {
                            unimplemented!("typescript module with string name")
                        }
                    };

                    // TODO(kdy1): Allow multiple exports with same name.
                    debug_assert_eq!(self.scope.types.get(&id.sym), None);

                    self.scope
                        .register_type(id.sym.clone(), ExportExtra::Module(decl.clone()).into());
                }
                TsNamespaceBody::TsNamespaceDecl(TsNamespaceDecl { .. }) => {
                    // TOOD: What should we do at here?
                    // impl below this impl may be enough.
                }
            },
        }
    }
}

impl Visit<TsInterfaceDecl> for Analyzer<'_, '_> {
    fn visit(&mut self, decl: &TsInterfaceDecl) {
        self.scope.register_type(
            decl.id.sym.clone(),
            ExportExtra::Interface(decl.clone()).into(),
        );
    }
}

#[derive(Debug)]
struct ImportFinder<'a> {
    to: &'a mut Vec<ImportInfo>,
}

/// Extracts require('foo')
impl Visit<CallExpr> for ImportFinder<'_> {
    fn visit(&mut self, expr: &CallExpr) {
        let span = expr.span();

        match expr.callee {
            ExprOrSuper::Expr(box Expr::Ident(ref i)) if i.sym == js_word!("require") => {
                let src = expr
                    .args
                    .iter()
                    .map(|v| match *v.expr {
                        Expr::Lit(Lit::Str(Str { ref value, .. })) => value.clone(),
                        _ => unimplemented!("error reporting for dynamic require"),
                    })
                    .next()
                    .unwrap();
                self.to.push(ImportInfo {
                    span,
                    all: true,
                    items: vec![],
                    src,
                });
            }
            _ => return,
        }
    }
}

impl Visit<ImportDecl> for ImportFinder<'_> {
    fn visit(&mut self, import: &ImportDecl) {
        let span = import.span();
        let mut items = vec![];
        let mut all = false;

        for s in &import.specifiers {
            match *s {
                ImportSpecifier::Default(ref default) => items.push(Specifier {
                    export: (js_word!("default"), default.span),
                    local: (default.local.sym.clone(), default.local.span),
                }),
                ImportSpecifier::Specific(ref s) => {
                    items.push(Specifier {
                        export: (
                            s.imported
                                .clone()
                                .map(|v| v.sym)
                                .unwrap_or_else(|| s.local.sym.clone()),
                            s.span,
                        ),
                        local: (s.local.sym.clone(), s.local.span),
                    });
                }
                ImportSpecifier::Namespace(..) => all = true,
            }
        }

        if !items.is_empty() {
            self.to.push(ImportInfo {
                span,
                items,
                all,
                src: import.src.value.clone(),
            });
        }
    }
}

impl<'a, 'b> Analyzer<'a, 'b> {
    pub fn new(rule: Rule, scope: Scope<'a>, path: Arc<PathBuf>, loader: &'b dyn Load) -> Self {
        Analyzer {
            rule,
            scope,
            info: Default::default(),
            path,
            resolved_imports: Default::default(),
            errored_imports: Default::default(),
            pending_exports: Default::default(),
            loader,
        }
    }
}

#[derive(Debug, Default)]
pub struct Info {
    pub exports: FxHashMap<JsWord, Arc<ExportInfo>>,
    pub errors: Vec<Error>,
}

#[derive(Debug, PartialEq, Eq)]
pub struct ImportInfo {
    pub span: Span,
    pub items: Vec<Specifier>,
    pub all: bool,
    pub src: JsWord,
}

#[derive(Debug, PartialEq, Eq)]
pub struct Specifier {
    pub local: (JsWord, Span),
    pub export: (JsWord, Span),
}

impl Visit<ClassDecl> for Analyzer<'_, '_> {
    fn visit(&mut self, c: &ClassDecl) {
        c.visit_children(self);

        let ty = self.type_of_class(&c.class);
        let ty = match ty {
            Ok(ty) => ty,
            Err(err) => {
                self.info.errors.push(err);
                TsType::TsKeywordType(TsKeywordType {
                    span: c.span(),
                    kind: TsKeywordTypeKind::TsAnyKeyword,
                })
            }
        };
        self.scope.declare_var(
            VarDeclKind::Var,
            c.ident.sym.clone(),
            Some(ty),
            // declare Class does not allow multiple declarations.
            false,
        );
    }
}

impl Visit<FnDecl> for Analyzer<'_, '_> {
    fn visit(&mut self, f: &FnDecl) {
        let fn_ty = match self.type_of_fn(&f.function) {
            Ok(ty) => ty,
            Err(err) => {
                self.info.errors.push(err);
                TsType::TsKeywordType(TsKeywordType {
                    span: f.span(),
                    kind: TsKeywordTypeKind::TsAnyKeyword,
                })
            }
        };
        self.scope.declare_var(
            VarDeclKind::Var,
            f.ident.sym.clone(),
            Some(fn_ty),
            f.declare,
        );
        f.function.visit_with(self);
    }
}

impl Visit<Function> for Analyzer<'_, '_> {
    fn visit(&mut self, f: &Function) {
        let mut analyzer = self.child(ScopeKind::Fn);

        f.params
            .iter()
            .for_each(|pat| analyzer.scope.declare_vars(VarDeclKind::Let, pat));

        match f.body {
            Some(ref body) => body.visit_children(&mut analyzer),
            None => {}
        }
    }
}

impl Visit<ArrowExpr> for Analyzer<'_, '_> {
    fn visit(&mut self, f: &ArrowExpr) {
        let mut analyzer = self.child(ScopeKind::Fn);

        f.params
            .iter()
            .for_each(|pat| analyzer.scope.declare_vars(VarDeclKind::Let, pat));

        match f.body {
            BlockStmtOrExpr::Expr(ref expr) => expr.visit_with(&mut analyzer),
            BlockStmtOrExpr::BlockStmt(ref stmt) => stmt.visit_children(&mut analyzer),
        }
    }
}

impl Visit<BlockStmt> for Analyzer<'_, '_> {
    fn visit(&mut self, stmt: &BlockStmt) {
        let mut analyzer = self.child(ScopeKind::Block);

        stmt.visit_children(&mut analyzer)
    }
}

impl Visit<AssignExpr> for Analyzer<'_, '_> {
    fn visit(&mut self, expr: &AssignExpr) {
        let span = expr.span();

        let rhs_ty = match self
            .type_of(&expr.right)
            .and_then(|ty| self.expand(span, ty))
        {
            Ok(rhs_ty) => rhs_ty,
            Err(err) => {
                self.info.errors.push(err);
                return;
            }
        };
        if expr.op == op!("=") {
            self.try_assign(&expr.left, rhs_ty);
        }
    }
}

impl Visit<VarDecl> for Analyzer<'_, '_> {
    fn visit(&mut self, var: &VarDecl) {
        let kind = var.kind;

        var.decls.iter().for_each(|v| {
            let span = v.span();

            if let Some(ref init) = v.init {
                let span = init.span();

                //  Check if v_ty is assignable to ty
                let value_ty = match self.type_of(&init).and_then(|ty| self.expand(span, ty)) {
                    Ok(ty) => ty,
                    Err(err) => {
                        self.info.errors.push(err);
                        return;
                    }
                };

                match v.name.get_ty() {
                    Some(ty) => {
                        let ty = match self.expand(span, Cow::Borrowed(ty)) {
                            Ok(ty) => ty,
                            Err(err) => {
                                self.info.errors.push(err);
                                return;
                            }
                        };
                        let errors = value_ty.assign_to(&*ty);
                        if errors.is_none() {
                            self.scope.declare_vars(kind, &v.name);
                            return;
                        } else {
                            self.info.errors.extend(errors);
                        }
                    }
                    None => {
                        // infer type from value.

                        let ty = value_ty.into_owned().generalize_lit();

                        self.scope.declare_var(
                            kind,
                            match v.name {
                                Pat::Ident(ref i) => i.sym.clone(),
                                _ => unimplemented!("declare_var with complex type inference"),
                            },
                            Some(ty),
                            // Variable declarations does not allow multiple declarations with same
                            // name
                            false,
                        );
                        return;
                    }
                }
            } else {
                if !var.declare {
                    // There's no initializer, so undefined is required.
                    if !v.name.get_ty().contains_undefined() {
                        self.info.errors.push(Error::ShouldIncludeUndefinedType {
                            span: v.name.span(),
                        })
                    }
                }
            }

            self.scope.declare_vars(kind, &v.name);
        });
    }
}

impl Analyzer<'_, '_> {
    fn try_assign(&mut self, lhs: &PatOrExpr, ty: Cow<TsType>) {
        match *lhs {
            PatOrExpr::Expr(ref expr) | PatOrExpr::Pat(box Pat::Expr(ref expr)) => match **expr {
                // TODO(kdy1): Validate
                Expr::Member(MemberExpr { .. }) => return,
                _ => unimplemented!(
                    "assign: {:?} = {:?}\nFile: {}",
                    expr,
                    ty,
                    self.path.display()
                ),
            },

            PatOrExpr::Pat(ref pat) => {
                // Update variable's type
                match **pat {
                    Pat::Ident(ref i) => {
                        if let Some(var_info) = self.scope.vars.get_mut(&i.sym) {
                            // Variable is declared.

                            let var_ty = if let Some(ref var_ty) = var_info.ty {
                                // let foo: string;
                                // let foo = 'value';

                                let errors = ty.assign_to(&var_ty);
                                if errors.is_none() {
                                    Some(ty.into_owned())
                                } else {
                                    self.info.errors.extend(errors);
                                    None
                                }
                            } else {
                                // let v = foo;
                                // v = bar;
                                None
                            };
                            if let Some(var_ty) = var_ty {
                                var_info.ty = Some(var_ty);
                            }
                        } else {
                            let var_info = if let Some(var_info) = self.scope.search_parent(&i.sym)
                            {
                                VarInfo {
                                    ty: Some(ty.into_owned()),
                                    copied: true,
                                    ..var_info.clone()
                                }
                            } else {
                                // undefined symbol
                                self.info
                                    .errors
                                    .push(Error::UndefinedSymbol { span: i.span });
                                return;
                            };
                            // Variable is defined on parent scope.
                            //
                            // We copy varinfo with enhanced type.
                            self.scope.vars.insert(i.sym.clone(), var_info);
                        }
                    }

                    _ => unimplemented!("assignment with complex pattern"),
                }
            }
        }
    }
}

/// Analyzes a module.
///
/// Constants are propagated, and
impl Checker<'_> {
    pub fn analyze_module(&self, rule: Rule, path: Arc<PathBuf>, m: &Module) -> Info {
        ::swc_common::GLOBALS.set(&self.globals, || {
            let mut a = Analyzer::new(rule, Scope::root(), path, &self);
            m.visit_with(&mut a);

            a.info
        })
    }
}

#[test]
fn assert_types() {
    fn is_sync<T: Sync>() {}
    fn is_send<T: Send>() {}
    is_sync::<Info>();
    is_send::<Info>();
}

impl Analyzer<'_, '_> {
    fn child(&self, kind: ScopeKind) -> Analyzer {
        Analyzer::new(
            self.rule,
            Scope::new(&self.scope, kind),
            self.path.clone(),
            self.loader,
        )
    }
}
