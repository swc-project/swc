pub use self::export::{ExportExtra, ExportInfo};
use self::{
    scope::{Scope, ScopeKind, VarInfo},
    util::{PatExt, TypeExt, TypeRefExt},
};
use super::Checker;
use crate::{
    errors::Error,
    loader::Load,
    util::{ModuleItemLike, StmtLike},
};
use fxhash::FxHashMap;
use rayon::iter::{IntoParallelIterator, ParallelIterator};
use std::{borrow::Cow, path::PathBuf, sync::Arc};
use swc_atoms::{js_word, JsWord};
use swc_common::{Span, Spanned, Visit, VisitWith};
use swc_ecma_ast::*;

mod export;
mod expr;
mod scope;
#[cfg(test)]
mod tests;
mod type_facts;
mod util;

struct Analyzer<'a, 'b> {
    info: Info,
    resolved_imports: FxHashMap<JsWord, Arc<ExportInfo>>,
    scope: Scope<'a>,
    path: Arc<PathBuf>,
    loader: &'b Load,
}

impl<T> Visit<Vec<T>> for Analyzer<'_, '_>
where
    T: VisitWith<Self>
        + for<'any> VisitWith<ImportFinder<'any>>
        + StmtLike
        + ModuleItemLike
        + Send
        + Sync,
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

        let imports = imports
            .into_par_iter()
            .map(|import| self.loader.load(self.path.clone(), import))
            .collect::<Vec<_>>();

        for import in imports {
            match import {
                Ok(import) => self.resolved_imports.extend(import),
                Err(err) => self.info.errors.push(err),
            }
        }

        items.visit_children(self);
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

impl Visit<ImportDecl> for ImportFinder<'_> {
    fn visit(&mut self, import: &ImportDecl) {
        let mut items = vec![];
        let mut all = false;

        for s in &import.specifiers {
            match *s {
                ImportSpecifier::Default(ref default) => {
                    items.push((js_word!("default"), default.span))
                }
                ImportSpecifier::Specific(ref s) => {
                    items.push((
                        s.imported
                            .clone()
                            .map(|v| v.sym)
                            .unwrap_or_else(|| s.local.sym.clone()),
                        s.span,
                    ));
                }
                ImportSpecifier::Namespace(..) => all = true,
            }
        }

        if !items.is_empty() {
            self.to.push(ImportInfo {
                items,
                all,
                src: import.src.value.clone(),
            });
        }
    }
}

impl<'a, 'b> Analyzer<'a, 'b> {
    pub fn new(scope: Scope<'a>, path: Arc<PathBuf>, loader: &'b Load) -> Self {
        Analyzer {
            scope,
            info: Default::default(),
            path,
            resolved_imports: Default::default(),
            loader,
        }
    }
}

#[derive(Debug, Default)]
pub struct Info {
    pub exports: FxHashMap<JsWord, Arc<ExportInfo>>,
    pub errors: Vec<Error>,
}

#[derive(Debug, PartialEq, Eq, Hash)]
pub struct ImportInfo {
    pub items: Vec<(JsWord, Span)>,
    pub all: bool,
    pub src: JsWord,
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
        f.visit_children(self);

        let ty = self.type_of_fn(&f.function);
        let ty = match ty {
            Ok(ty) => ty,
            Err(err) => {
                self.info.errors.push(err);
                TsType::TsKeywordType(TsKeywordType {
                    span: f.span(),
                    kind: TsKeywordTypeKind::TsAnyKeyword,
                })
            }
        };
        self.scope
            .declare_var(VarDeclKind::Var, f.ident.sym.clone(), Some(ty), f.declare);
    }
}

impl Visit<Function> for Analyzer<'_, '_> {
    fn visit(&mut self, f: &Function) {
        let mut analyzer = self.child(ScopeKind::Fn);

        f.params
            .iter()
            .for_each(|pat| analyzer.scope.declare_vars(VarDeclKind::Let, pat));

        f.body.visit_children(&mut analyzer);
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
        let rhs_ty = match self.type_of(&expr.right).map(|ty| self.expand(ty)) {
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
            if let Some(ref init) = v.init {
                //  Check if v_ty is assignable to ty
                let value_ty = match self.type_of(&init).map(|ty| self.expand(ty)) {
                    Ok(ty) => ty,
                    Err(err) => {
                        self.info.errors.push(err);
                        return;
                    }
                };

                match v.name.get_ty() {
                    Some(ty) => {
                        let ty = self.expand(Cow::Borrowed(ty));
                        let errors = value_ty.assign_to(&*ty);
                        if errors.is_none() {
                            self.scope.declare_vars(kind, &v.name)
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
                // There's no initializer, so undefined is required.
                if !v.name.get_ty().contains_undefined() {
                    self.info.errors.push(Error::ShouldIncludeUndefinedType {
                        span: v.name.span(),
                    })
                }
            }

            self.scope.declare_vars(kind, &v.name);
        });
    }
}

impl Analyzer<'_, '_> {
    fn try_assign(&mut self, lhs: &PatOrExpr, ty: Cow<TsType>) {
        match *lhs {
            PatOrExpr::Expr(ref expr) | PatOrExpr::Pat(box Pat::Expr(ref expr)) => {
                unimplemented!("assign: {:?} = {:?}", expr, ty)
            }

            PatOrExpr::Pat(ref pat) => {
                // Update variable's type
                match **pat {
                    Pat::Ident(ref i) => {
                        if let Some(var_info) = self.scope.vars.get_mut(&i.sym) {
                            // Variable is declared.

                            if let Some(ref var_ty) = var_info.ty {
                                // let foo: string;
                                // let foo = 'value';

                                let errors = ty.assign_to(&var_ty);
                                if errors.is_none() {
                                    var_info.ty = Some(ty.into_owned());
                                } else {
                                    self.info.errors.extend(errors)
                                }
                            } else {
                                // let v = foo;
                                // v = bar;
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
    pub fn analyze_module(&self, path: Arc<PathBuf>, m: &Module) -> Info {
        let mut a = Analyzer::new(Scope::root(), path, &self);
        m.visit_with(&mut a);

        a.info
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
            Scope::new(&self.scope, kind),
            self.path.clone(),
            self.loader,
        )
    }
}
