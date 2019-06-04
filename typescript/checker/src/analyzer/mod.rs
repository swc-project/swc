use self::util::{PatExt, TypeExt};
use crate::errors::Error;
use fxhash::FxHashMap;
use swc_atoms::JsWord;
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Spanned};
use swc_ecma_ast::*;

mod expr;
#[cfg(test)]
mod tests;
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

#[derive(Debug, Clone)]
struct VarInfo {
    kind: VarDeclKind,
    ty: Option<Box<TsType>>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    Block,
    Fn,
}

#[derive(Debug, Clone)]
pub struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    kind: ScopeKind,
    vars: FxHashMap<JsWord, VarInfo>,
}

impl<'a> Scope<'a> {
    fn new(parent: &'a Scope<'a>, kind: ScopeKind) -> Self {
        Scope {
            parent: Some(parent),
            kind,
            vars: Default::default(),
        }
    }

    fn root() -> Self {
        Scope {
            parent: None,
            kind: ScopeKind::Fn,
            vars: Default::default(),
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

// impl<T> Fold<Vec<T>> for Analyzer<'_>
// where
//     Vec<T>: FoldWith<Self>,
//     T: FoldWith<Self>,
//     T: StmtLike + ModuleItemLike,
// {
//     fn fold(&mut self, items: Vec<T>) -> Vec<T> {
//         let mut buf = vec![];

//         for item in items {
//             match item.try_into_stmt() {
//                 Ok(stmt) => {}
//                 Err(item) => match item.try_into_module_decl() {
//                     Ok(decl) => {}
//                     Err(..) => unreachable!(),
//                 },
//             }
//         }

//         buf
//     }
// }

impl Fold<BlockStmt> for Analyzer<'_> {
    fn fold(&mut self, stmt: BlockStmt) -> BlockStmt {
        let mut analyzer = Analyzer::new(Scope::new(&self.scope, ScopeKind::Block));

        stmt.fold_children(&mut analyzer)
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
                                self.insert_vars(kind, &v.name)
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

                v
            }),
            ..var
        }
    }
}

impl Analyzer<'_> {
    /// Updates variable list
    fn insert_vars(&mut self, kind: VarDeclKind, pat: &Pat) {
        match *pat {
            Pat::Ident(ref i) => {
                let name = i.sym.clone();
                let info = VarInfo {
                    kind,
                    ty: i.type_ann.as_ref().map(|t| &t.type_ann).cloned(),
                };
                self.scope.vars.insert(name, info);
            }
            _ => unimplemented!("insert_vars for patterns other than ident"),
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
