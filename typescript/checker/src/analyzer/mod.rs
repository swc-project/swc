use self::{
    scope::{Scope, ScopeKind, VarInfo},
    util::{PatExt, TypeRefExt},
};
use crate::errors::Error;
use swc_atoms::JsWord;
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Spanned};
use swc_ecma_ast::*;

mod expr;
mod scope;
#[cfg(test)]
mod tests;
mod type_facts;
mod util;

struct Analyzer<'a> {
    info: Info,
    scope: Scope<'a>,
}

impl<'a> Analyzer<'a> {
    pub fn new(scope: Scope<'a>) -> Self {
        Analyzer {
            scope,
            info: Default::default(),
        }
    }
}

#[derive(Debug, Default)]
pub struct Info {
    pub imports: Vec<ImportInfo>,
    pub exports: Vec<ExportInfo>,
    pub errors: Vec<Error>,
}

#[derive(Debug)]
pub struct ImportInfo {
    pub src: JsWord,
}

#[derive(Debug)]
pub struct ExportInfo {}

impl Fold<Function> for Analyzer<'_> {
    fn fold(&mut self, f: Function) -> Function {
        let mut analyzer = Analyzer::new(Scope::new(&self.scope, ScopeKind::Fn));

        f.params
            .iter()
            .for_each(|pat| analyzer.scope.insert_vars(VarDeclKind::Let, pat));

        Function {
            body: f.body.fold_children(&mut analyzer),
            ..f
        }
    }
}

impl Fold<ArrowExpr> for Analyzer<'_> {
    fn fold(&mut self, f: ArrowExpr) -> ArrowExpr {
        let mut analyzer = Analyzer::new(Scope::new(&self.scope, ScopeKind::Fn));

        f.params
            .iter()
            .for_each(|pat| analyzer.scope.insert_vars(VarDeclKind::Let, pat));

        ArrowExpr {
            body: match f.body {
                BlockStmtOrExpr::Expr(expr) => BlockStmtOrExpr::Expr(expr.fold_with(&mut analyzer)),
                BlockStmtOrExpr::BlockStmt(stmt) => {
                    BlockStmtOrExpr::BlockStmt(stmt.fold_children(&mut analyzer))
                }
            },
            ..f
        }
    }
}

impl Fold<BlockStmt> for Analyzer<'_> {
    fn fold(&mut self, stmt: BlockStmt) -> BlockStmt {
        let mut analyzer = Analyzer::new(Scope::new(&self.scope, ScopeKind::Block));

        stmt.fold_children(&mut analyzer)
    }
}

impl Fold<AssignExpr> for Analyzer<'_> {
    fn fold(&mut self, expr: AssignExpr) -> AssignExpr {
        if let Some(rhs_ty) = self.type_of(&expr.right) {
            if expr.op == op!("=") {
                self.assign(&expr.left, rhs_ty);
            }
        }

        expr
    }
}

impl Fold<VarDecl> for Analyzer<'_> {
    fn fold(&mut self, var: VarDecl) -> VarDecl {
        let kind = var.kind;
        VarDecl {
            decls: var.decls.move_map(|v| {
                if let Some(ref init) = v.init {
                    //  Check if v_ty is assignable to ty
                    let value_ty = self.type_of(&init);

                    match v.name.get_ty() {
                        Some(ref ty) => {
                            let errors = value_ty.assign_to(ty);
                            if errors.is_none() {
                                self.scope.insert_vars(kind, &v.name)
                            } else {
                                self.info.errors.extend(errors);
                            }
                        }
                        // Infer type from value.
                        None => {
                            // v.name.set_ty(value_ty.map(Box::new))
                        }
                    }

                    return v;
                }

                // There's no initializer, so undefined is required.
                if !v.name.get_ty().contains_undefined() {
                    self.info.errors.push(Error::ShouldIncludeUndefinedType {
                        span: v.name.span(),
                    })
                }

                self.scope.insert_vars(kind, &v.name);

                v
            }),
            ..var
        }
    }
}

impl Analyzer<'_> {
    pub fn assign(&mut self, lhs: &PatOrExpr, ty: TsType) {
        match *lhs {
            PatOrExpr::Pat(ref pat) => {
                // Update variable's type
                match **pat {
                    Pat::Ident(ref i) => {
                        if let Some(var_info) = self.scope.vars.get_mut(&i.sym) {
                            if let Some(ref var_ty) = var_info.ty {
                                let errors = ty.assign_to(&var_ty);
                                if errors.is_none() {
                                    var_info.ty = Some(box ty);
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
                                    ty: Some(box ty),
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
            PatOrExpr::Expr(ref expr) => unimplemented!("assign: {:?} = {:?}", expr, ty),
        }
    }
}

/// Analyzes a module.
///
/// Constants are propagated, and
pub fn analyze_module(m: Module) -> (Module, Info) {
    let mut a = Analyzer::new(Scope::root());
    let m = m.fold_with(&mut a);

    (m, a.info)
}

#[test]
fn assert_types() {
    fn is_sync<T: Sync>() {}
    fn is_send<T: Send>() {}
    is_sync::<Info>();
    is_send::<Info>();
}
